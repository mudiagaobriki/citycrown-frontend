import axios from 'axios';
import { API_URL } from '../assets/constants';

export async function allUsers(page, limit) {
  const res = await axios.get(`${API_URL}/admins/all-users/${page}/${limit}`);

  console.log('Data: ', res?.data);
  const docs = res?.data?.data?.docs;

  docs.reverse().forEach((doc, index) => {
    doc.sn = index + 1;
  });

  return docs;
}

export async function newUser(payload) {
  const res = await axios.post(`${API_URL}/users/register`, payload);

  return res?.data;
}

// export async function getStore(id) {
//   const res = await axios.get(`${API_URL}/items/details/${id}`);

//   return res?.data;
// }

export async function editUser(email, payload) {
  const res = await axios.post(`${API_URL}/admins/edit-user`, { email, payload });

  return res?.data;
}
