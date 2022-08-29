import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { IUserObjet } from "interfaces";
import { getUserDetails } from "libs";
import * as Screens from "screens";

//=========[ Main App
const App = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null as IUserObjet | null);

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

    return !loading ? (
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
                            <Route path="leaderboard/:id" element={<Screens.LeaderBoard user={user} />} />
                            <Route path="logout" element={<Screens.Logout />} />
                        </>
                    )}
                </Route>
            </Routes>
        </BrowserRouter>
    ) : (
        <Container className="container-fluid text-center align-middle align-items-center my-5">
            <Spinner animation="border" variant="warning" role="status" />
        </Container>
    );
};

export default App;
