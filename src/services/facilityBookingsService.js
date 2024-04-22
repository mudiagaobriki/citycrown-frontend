import axios from 'axios';
import {API_URL} from "../assets/constants";

export async function allFacilityBookings(page, limit) {
    const res = await axios.get(`${API_URL}/facility-bookings/all/${page}/${limit}`);

    // console.log("Data: ", res?.data)
    const docs = res?.data?.data?.docs;

    return docs.filter(el => (el?.isDeleted === false || el?.isDeleted === undefined));
}

export async function newFacilityBookings(payload) {
    const res = await axios.post(`${API_URL}/facility-bookings/new`,payload);

    return res?.data;
}

export async function getFacilityBookings(id) {
    const res = await axios.get(`${API_URL}/facility-bookings/details/${id}`);
   
    return res?.data;
}

export async function editFacilityBookings(id, payload) {
    console.log({id,payload})
    const res = await axios.patch(`${API_URL}/facility-bookings/edit`, {id, payload});
    console.log({res})
    return res?.data;
}
