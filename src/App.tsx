import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import type { IUserObjet } from '@app/models';
import { getUserDetails } from '@app/helpers';
import * as Screens from '@app/screens';

//=========[ Main App
const App = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<IUserObjet | undefined>();

    async function init() {
        await getUserDetails()
            .then(({ data }) => {
                if (!data.error && loading) setUser(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }

    useEffect(() => {
        init();
    });

    if (loading)
        return (
            <Container
                style={{
                    height: '100vh',
                    width: '100vw',
                    position: 'relative',
                    zIndex: 9999,
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                }}>
                <Spinner animation="border" variant="warning" role="status" />
            </Container>
        );
    else
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Screens.Layout user={user} />}>
                        <Route index element={<Screens.Main />} />
                        <Route path="about" element={<Screens.About />} />
                        <Route path="invite" element={<Screens.Invite />} />
                        <Route path="commands" element={<Screens.Commands />} />
                        <Route path="status" element={<Screens.Status />} />
                        <Route path="support" element={<Screens.Support />} />
                        <Route path="privacy" element={<Screens.Privacy />} />
                        <Route path="terms" element={<Screens.Terms />} />
                        <Route path="developer" element={<Screens.Developer />} />
                        <Route path="error403" element={<Screens.Error403 />} />
                        <Route path="error404" element={<Screens.Error404 />} />
                        <Route path="*" element={<Screens.Error404 />} />
                        {user && (
                            <>
                                <Route path="profile" element={<Screens.Profile user={user} />} />
                                <Route path="dashboard/:id" element={<Screens.Dashboard user={user} />} />
                                <Route path="logout" element={<Screens.Logout />} />
                            </>
                        )}
                        <Route path="leaderboard/:id" element={<Screens.LeaderBoard user={user} />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        );
};

export default App;
