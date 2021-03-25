import axios from "axios";
import { API_URL } from "../Constants";

export function getUserDetails() {
    return axios.get(`${API_URL}/oauth`, { withCredentials: true });
}
