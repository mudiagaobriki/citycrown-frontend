import axios from 'axios';
import {API_URL} from "../assets/constants";

export async function allServiceOrders(page, limit) {
    const res = await axios.get(`${API_URL}/service-order/all/${page}/${limit}`);

    // console.log("Data: ", res?.data)
    const docs = res?.data?.data?.docs;

    return docs.filter(el => el?.isDeleted !== true);
}

export async function newServiceOrder(payload) {
    const res = await axios.post(`${API_URL}/service-order/new`,payload);

    return res?.data;
}

export async function getServiceOrder(id) {
    const res = await axios.get(`${API_URL}/service-order/details/${id}`);
   
    return res?.data;
}

export async function editServiceOrder(id, payload) {
    const res = await axios.patch(`${API_URL}/service-order/edit`, {id, payload});

    return res?.data;
}
