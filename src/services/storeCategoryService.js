import axios from 'axios';
import { API_URL } from '../assets/constants';

export async function allStoreCategories(page, limit) {
  const res = await axios.get(`${API_URL}/item-categories/all/${page}/${limit}`);

  console.log('store cats Data: ', res?.data);
  const docs = res?.data?.data?.docs || [];

  console.log('DDD::', docs);

  return docs?.filter((el) => el?.isDeleted === false);
}

export async function newStoreCategroy(payload) {
  const res = await axios.post(`${API_URL}/item-categories/new`, payload);

  return res?.data;
}

export async function getStoreCategory(name) {
  const res = await axios.get(`${API_URL}/item-categories/select/${name}`);

  return res?.data;
}

// export async function editStoreCategory(name, payload) {
//   const res = await axios.post(`${API_URL}/item/edit-item`, { name, payload });

//   return res?.data;
// }
