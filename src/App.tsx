import { Layout, About, Commands, Dashboard, Error403, Error404, Invite, LeaderBoard, Logout, Main, Profile, Support } from "./components";
import { getGuildsUser, getUserDetails, useLocalStorage } from "./libs";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";

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

    return !load ? (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout user={user} load={load} reloaderGuilds={reloaderGuilds} />}>
                    <Route index element={<Main />} />
                    <Route path="about" element={<About />} />
                    <Route path="invite" element={<Invite />} />
                    <Route path="commands" element={<Commands />} />
                    <Route path="error403" element={<Error403 />} />
                    <Route path="support" element={<Support />} />
                    {!load ? (
                        <>
                            <Route path="profile" element={<Profile user={user} />} />
                            <Route path="dashboard/:id" element={<Dashboard user={user} />} />
                            <Route path="leaderboard/:id" element={<LeaderBoard user={user} />} />
                            <Route path="error404" element={<Error404 />} />
                        </>
                    ) : (
                        <Route path="logout" element={<Logout />} />
                    )}
                </Route>
            </Routes>
        </BrowserRouter>
    ) : (
        <Container className="container-fluid text-center align-middle">
            <Spinner animation="border" variant="warning" role="status" />
        </Container>
    );
};

export default App;
