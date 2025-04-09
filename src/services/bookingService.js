import axios from 'axios';
import {API_URL} from "../assets/constants";

export async function allBookings(page, limit) {
    const res = await axios.get(`${API_URL}/bookings/all/${page}/${limit}`);

    // console.log("Data: ", res?.data)
    const docs = res?.data?.data?.docs;
    // console.log("Docs: ", docs);

    return docs.filter(el => !el?.isDeleted);
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

export async function editBooking(id, payload) {
    const res = await axios.patch(`${API_URL}/bookings/edit`, {id, payload});

    // console.log({res})

    return res?.data;
}
