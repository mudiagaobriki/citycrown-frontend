import axios from 'axios';
import {API_URL} from "../assets/constants";

export async function allRoomTypes(page, limit) {
    const res = await axios.get(`${API_URL}/roomtypes/all/${page}/${limit}`);

    // console.log("Data: ", res?.data)
    const docs = res?.data?.data?.docs;

    return docs.filter(el => el?.isDeleted !== true);
}

export async function newRoomType(payload) {
    const res = await axios.post(`${API_URL}/roomtypes/new`,payload);

    return res?.data;
}

export async function getRoomType(name) {
    const res = await axios.get(`${API_URL}/roomtypes/details/${name}`);
   
    return res?.data;
}

export async function editRoomType(name, payload) {
    const res = await axios.patch(`${API_URL}/roomtypes/edit`, {name, payload});

    return res?.data;
}
