import axios from 'axios';
import {API_URL} from "../assets/constants";

export async function allDeposits(page, limit) {
    const res = await axios.get(`${API_URL}/deposit/all/${page}/${limit}`);

    // console.log("Data: ", res?.data)
    const docs = res?.data?.data?.docs;

    return docs;
}

export async function newDeposit(payload) {
    const res = await axios.post(`${API_URL}/deposit/new`,payload);

    return res?.data;
}

export async function getDeposit(id) {
    const res = await axios.get(`${API_URL}/deposit/details/${id}`);
   
    return res?.data;
}
