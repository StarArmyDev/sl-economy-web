import { User, ErrorResponse } from '@app/models';
import axios from 'axios';

const baseUrlUpTimeRobot = 'https://api.uptimerobot.com/v2';

export const getUserDetails = async (): Promise<User | null> => {
    return await axios
        .get<User | ErrorResponse>(`${import.meta.env.VITE_API_URL}/oauth`, { withCredentials: true })
        .then(res => ('error' in res.data ? null : res.data))
        .catch(() => null);
};

export function getGuildsUser() {
    return axios.get(`${import.meta.env.VITE_API_URL}/oauth/guilds`, { withCredentials: true });
}

export function getMonitors() {
    return axios.post(`${baseUrlUpTimeRobot}/getMonitors?api_key=${'ur673874-61592d0cca1b9c56b2140b8b'}&format=json`);
}
