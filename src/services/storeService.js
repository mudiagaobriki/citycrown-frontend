import axios from 'axios';
import { API_URL } from '../assets/constants';

export async function allStores(page, limit) {
  const res = await axios.get(`${API_URL}/items/all/${page}/${limit}`);

  // console.log("Data: ", res?.data)
  const docs = res?.data?.data?.docs || [];

  docs?.forEach((doc, index) => {
    doc.sn = index + 1;
  });

  return docs?.filter((el) => el?.isDeleted === false);
}

export async function newStore(payload) {
  const res = await axios.post(`${API_URL}/items/new`, payload);

  return res?.data;
}

export async function getStore(id) {
  const res = await axios.get(`${API_URL}/items/details/${id}`);

  return res?.data;
}

export async function editStore(name, payload) {
  const res = await axios.post(`${API_URL}/items/edit-item`, { name, payload });

  return res?.data;
}
