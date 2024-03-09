import axios from 'axios';
import {API_URL} from "../assets/constants";

export async function allKitchenBarCategories(page, limit) {
    const res = await axios.get(`${API_URL}/kitchen-bar-categories/all/${page}/${limit}`);

    // console.log("Data: ", res?.data)
    const docs = res?.data?.data?.docs;

    return docs.filter(el => el?.isDeleted !== true);
}

export async function newKitchenBarCategories(payload) {
    const res = await axios.post(`${API_URL}/kitchen-bar-categories/new`,payload);

    return res?.data;
}

export async function getKitchenBarCategories(id) {
    const res = await axios.get(`${API_URL}/kitchen-bar-categories/details/${id}`);
   
    return res?.data;
}

export async function editKitchenBarCategories(id, payload) {
    const res = await axios.patch(`${API_URL}/kitchen-bar-categories/edit`, {id, payload});

    return res?.data;
}
