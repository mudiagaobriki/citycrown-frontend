import axios from 'axios';
import {API_URL} from "../assets/constants";

export async function allMessages(page, limit) {
    const res = await axios.get(`${API_URL}/services/all/${page}/${limit}`);

    // console.log("Data: ", res?.data)
    const docs = res?.data?.data?.docs;

    return docs.filter(el => el?.isDeleted !== true);
}

export async function newMessage(payload) {
    const res = await axios.post(`${API_URL}/messages/new`,payload);

    return res?.data;
}

export async function getService(id) {
    const res = await axios.get(`${API_URL}/services/details/${id}`);
   
    return res?.data;
}

export async function editService(id, payload) {
    const res = await axios.patch(`${API_URL}/services/edit`, {id, payload});

    return res?.data;
}
