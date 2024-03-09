import axios from 'axios';
import {API_URL} from "../assets/constants";

export async function newInvestment(payload) {
    const res = await axios.post(`${API_URL}/investments/new`, payload);
    
    return res?.data;
}

export async function allInvestments(page, limit) {
    const res = await axios.get(`${API_URL}/investments/all/${page}/${limit}`);

    const docs = res?.data?.data?.docs;

    return docs;
}
