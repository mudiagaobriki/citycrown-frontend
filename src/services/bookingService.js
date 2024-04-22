import axios from 'axios';
import {API_URL} from "../assets/constants";

export async function allBookings(page, limit) {
    const res = await axios.get(`${API_URL}/bookings/all/${page}/${limit}`);

    // console.log("Data: ", res?.data)
    const docs = res?.data?.data?.docs;

    return docs.filter(el => el?.isDeleted === false);
}

export async function newBooking(payload) {
    console.log({payload})
    const res = await axios.post(`${API_URL}/bookings/new`,payload);

    return res?.data;
}

export async function getBooking(id) {
    const res = await axios.get(`${API_URL}/bookings/details/${id}`);
   
    return res?.data;
}

export async function editBooking(name, payload) {
    const res = await axios.patch(`${API_URL}/bookings/edit`, {name, payload});

    return res?.data;
}
