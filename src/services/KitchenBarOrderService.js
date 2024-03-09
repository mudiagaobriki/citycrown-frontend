import axios from 'axios';
import {API_URL} from "../assets/constants";

export async function allKitchenBarOrders(page, limit) {
    const res = await axios.get(`${API_URL}/kitchen-bar-order/all/${page}/${limit}`);

    // console.log("Data: ", res?.data)
    const docs = res?.data?.data?.docs;

    return docs.filter(el => el?.isDeleted !== true);
}

export async function newKitchenBarOrder(payload) {
    const res = await axios.post(`${API_URL}/kitchen-bar-order/new`,payload);

    return res?.data;
}

export async function getKitchenBarOrder(id) {
    const res = await axios.get(`${API_URL}/kitchen-bar-order/details/${id}`);
   
    return res?.data;
}

export async function editKitchenBarOrder(id, payload) {
    const res = await axios.patch(`${API_URL}/kitchen-bar-order/edit`, {id, payload});

    return res?.data;
}
