import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import * as Components from "components";
import { IUserObjet } from "interfaces";
import { getUserDetails } from "libs";

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
                <Route path="/" element={<Components.Layout user={user} />}>
                    <Route index element={<Components.Main />} />
                    <Route path="about" element={<Components.About />} />
                    <Route path="invite" element={<Components.Invite />} />
                    <Route path="commands" element={<Components.Commands />} />
                    <Route path="status" element={<Components.Status />} />
                    <Route path="support" element={<Components.Support />} />
                    <Route path="privacy" element={<Components.Privacy />} />
                    <Route path="terms" element={<Components.Terms />} />
                    <Route path="developer" element={<Components.Developer />} />
                    <Route path="error403" element={<Components.Error403 />} />
                    <Route path="error404" element={<Components.Error404 />} />
                    <Route path="*" element={<Components.Error404 />} />
                    {user && (
                        <>
                            <Route path="profile" element={<Components.Profile user={user} />} />
                            <Route path="dashboard/:id" element={<Components.Dashboard user={user} />} />
                            <Route path="leaderboard/:id" element={<Components.LeaderBoard user={user} />} />
                            <Route path="logout" element={<Components.Logout />} />
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
