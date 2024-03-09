import axios from 'axios';
import {API_URL} from "../assets/constants";

export async function allRooms(page, limit) {
    const res = await axios.get(`${API_URL}/rooms/all/${page}/${limit}`);

    // console.log("Data: ", res?.data)
    const docs = res?.data?.data?.docs;

    return docs.filter(el => el?.isDeleted !== true);
}

export async function newRoom(payload) {
    const res = await axios.post(`${API_URL}/rooms/new`,payload);

    return res?.data;
}

export async function getRoom(name) {
    const res = await axios.get(`${API_URL}/rooms/details/${name}`);
   
    return res?.data;
}

export async function editRoom(number, payload) {
    const res = await axios.patch(`${API_URL}/rooms/edit`, {number, payload});

    return res?.data;
}
