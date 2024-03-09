import axios from 'axios';
import {API_URL} from "../assets/constants";

export async function allKitchenBarPresets(page, limit) {
    const res = await axios.get(`${API_URL}/kitchen-bar-presets/all/${page}/${limit}`);

    // console.log("Data: ", res?.data)
    const docs = res?.data?.data?.docs;

    return docs.filter(el => el?.isDeleted !== true);
}

export async function newKitchenBarPresets(payload) {
    const res = await axios.post(`${API_URL}/kitchen-bar-presets/new`,payload);

    return res?.data;
}

export async function getKitchenBarPresets(id) {
    const res = await axios.get(`${API_URL}/kitchen-bar-presets/details/${id}`);
   
    return res?.data;
}

export async function editKitchenBarPresets(id, payload) {
    const res = await axios.patch(`${API_URL}/kitchen-bar-presets/edit`, {id, payload});

    return res?.data;
}
