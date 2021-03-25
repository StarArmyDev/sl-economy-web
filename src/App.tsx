import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { NavBar, Footer, About, Commands, Dashboard, Error403, Error404, Invite, LeaderBoard, Logout, Main, Profile, Support } from "./components";
import { getUserDetails, useLocalStorage } from "./libs";

//=========[ Main App
const App = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser, removeLoading] = useLocalStorage("user", null);

    function init() {
        if (!user) {
            getUserDetails()
                .then(({ data }) => setUser(data))
                .catch(() => null);
            setLoading(false);
        } else setLoading(false);
    }

    useEffect(() => {
        if (user && user.timestamp && user.timestamp + 36e5 <= Date.now()) {
            removeLoading("user");
        }
        init();
    });

    return (
        <Router>
            <NavBar user={user} loading={loading} />
            <div className="container-fluid p-4">
                <Switch>
                    <Route exact path="/" component={Main} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/invite" component={Invite} />
                    <Route exact path="/commands" component={Commands} />
                    <Route exact path="/error403" component={Error403} />
                    <Route exact path="/support" component={Support} />
                    {!loading ? (
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
