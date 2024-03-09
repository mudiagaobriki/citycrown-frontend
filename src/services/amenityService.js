import axios from 'axios';
import {API_URL} from "../assets/constants";

export async function allAmenities(page, limit) {
    const res = await axios.get(`${API_URL}/amenities/all/${page}/${limit}`);

    // console.log("Data: ", res?.data)
    const docs = res?.data?.data?.docs;

    return docs.filter(el => el?.isDeleted === false);
}

export async function newAmenity(payload) {
    const res = await axios.post(`${API_URL}/amenities/new`,payload);

    return res?.data;
}

export async function getAmenity(id) {
    const res = await axios.get(`${API_URL}/amenities/details/${id}`);
   
    return res?.data;
}

export async function editAmenity(name, payload) {
    const res = await axios.post(`${API_URL}/amenities/edit`, {name, payload});

    return res?.data;
}
