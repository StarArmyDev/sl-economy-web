import axios from "axios";

const baseUrlUpTimeRobot = "https://api.uptimerobot.com/v2";

export function getUserDetails() {
    return axios.get(`${process.env.REACT_APP_API_URL}/oauth`, { withCredentials: true });
}

export function getGuildsUser() {
    return axios.get(`${process.env.REACT_APP_API_URL}/oauth/guilds`, { withCredentials: true });
}

export function getMonitors() {
    return axios.post(`${baseUrlUpTimeRobot}/getMonitors?api_key=${"ur673874-61592d0cca1b9c56b2140b8b"}&format=json`);
}
