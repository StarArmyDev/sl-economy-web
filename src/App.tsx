import { Fragment, useEffect, useState } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import { useLocalStorage } from './libs/useLocalStorage';

import { API_URL } from './Constants';
//=========[ Routers
import NavBar from './components/partials/navbar';
import Footer from './components/partials/footer';

import Index from './components/index';
import About from './components/about';
import Commands from './components/commands';
import Profile from './components/profile';
import DashBoard from './components/dashboard';
import LeaderBoard from './components/leaderboard';
import Login from './components/login';
import Logout from './components/logout';
import Error from './components/error404';
import Prohibido from './components/error403';

//=========[ Main App
const App = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser, removeLoading] = useLocalStorage('user', null);

    const load = () => {
        if (user && user.timestamp && user.timestamp + 36e5 <= Date.now()) {
            removeLoading('user');
        }

        if (!user) {
            axios
                .get(`${API_URL}/oauth/details`, {
                    withCredentials: true,
                })
                .then((res) => {
                    var resUser = res.data;
                    if (!resUser.id) return setLoading(false);
                    resUser.timestamp = Date.now();

                    setUser(resUser);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else setLoading(false);
    };

    useEffect(() => {
        load();
    });

    return (
        <Router>
            <NavBar user={user} loading={loading} />
            <div className="container-fluid p-4">
                <Switch>
                    <Route exact path="/" component={Index} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/commands" component={Commands} />
                    <Route exact path="/error403" component={Prohibido} />
                    {!loading ? (
                        <Fragment>
                            <Route exact path="/profile" render={(props) => <Profile {...props} user={user} />} />
                            <Route exact path="/dashboard/:id" component={DashBoard} />
                            <Route exact path="/leaderboard/:id" render={(props) => <LeaderBoard {...props} user={user} />} />
                            <Route exact path="/error404" component={Error} />
                        </Fragment>
                    ) : (
                        <Container className="text-center">
                            <Route exact path="/login" component={Login} />
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
