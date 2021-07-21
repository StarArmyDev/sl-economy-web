import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { NavBar, Footer, About, Commands, Dashboard, Error403, Error404, Invite, LeaderBoard, Logout, Main, Profile, Support } from "./components";
import { getGuildsUser, getUserDetails, useLocalStorage } from "./libs";

//=========[ Main App
const App = () => {
    const [load, setLoading] = useState(true);
    const [user, setUser, removeLoading] = useLocalStorage("user", null);

    async function init() {
        if (!user) {
            await getUserDetails()
                .then(({ data }) => setUser(data))
                .catch(() => null);
            setLoading(false);
        } else setLoading(false);
    }

    async function reloaderGuilds() {
        return await getGuildsUser()
            .then(({ data }) => {
                removeLoading("user");
                setUser({ ...data, timestamp: user.timestamp, guildsTimestamp: Date.now() });
            })
            .catch(() => null);
    }

    useEffect(() => {
        if (user && user.timestamp && user.timestamp + 36e5 <= Date.now()) removeLoading("user");

        if (user?.guildsTimestamp && user.guildsTimestamp + 6e5 <= Date.now()) reloaderGuilds();

        init();
    });

    return (
        <Router>
            <NavBar user={user} loading={load} reloaderGuilds={reloaderGuilds} />
            <div className="container-fluid p-4">
                <Switch>
                    <Route exact path="/" component={Main} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/invite" component={Invite} />
                    <Route exact path="/commands" component={Commands} />
                    <Route exact path="/error403" component={Error403} />
                    <Route exact path="/support" component={Support} />
                    {!load ? (
                        <Fragment>
                            <Route exact path="/profile" render={(props) => <Profile {...props} user={user} />} />
                            <Route exact path="/dashboard/:id" render={(props) => <Dashboard {...props} user={user} />} />
                            <Route exact path="/leaderboard/:id" render={(props) => <LeaderBoard {...props} user={user} />} />
                            <Route exact path="/error404" component={Error404} />
                        </Fragment>
                    ) : (
                        <Container className="text-center">
                            <Route exact path="/logout" component={Logout} />
                            <Route exact render={() => <Spinner animation="border" variant="warning" role="status" />} />
                        </Container>
                    )}
                </Switch>
            </div>
            <Footer />
        </Router>
    );
};

export default App;
