import axios from "axios";

export function getUserDetails() {
    return axios.get(`${process.env.REACT_APP_API_URL}/oauth`, { withCredentials: true });
}

export function getGuildsUser() {
    return axios.get(`${process.env.REACT_APP_API_URL}/oauth/guilds`, { withCredentials: true });
}
