import axios from 'axios';
import {API_URL} from "../assets/constants";

export async function allFacilities(page, limit) {
    const res = await axios.get(`${API_URL}/facilities/all/${page}/${limit}`);

    // console.log("Data: ", res?.data)
    const docs = res?.data?.data?.docs;

    return docs.filter(el => el?.isDeleted === false);
}

export async function newFacility(payload) {
    const res = await axios.post(`${API_URL}/facilities/new`,payload);

    return res?.data;
}

export async function getFacility(id) {
    const res = await axios.get(`${API_URL}/facilities/details/${id}`);
   
    return res?.data;
}

export async function editFacility(name, payload) {
    const res = await axios.post(`${API_URL}/facilities/edit`, {name, payload});

    return res?.data;
}
