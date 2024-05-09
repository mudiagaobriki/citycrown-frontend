import axios from 'axios';
import { API_URL } from '../assets/constants';

export async function newProfile(payload) {
  // eslint-disable-next-line no-useless-catch
  try {
    const res = await axios.post(`${API_URL}/profiles/new`, payload);
    console.log('Data: ', res?.data);

    return res?.data;
  } catch (e) {
    throw e;
  }
}

export async function allProfiles(page, limit) {
  const res = await axios.get(`${API_URL}/profiles/all/${page}/${limit}`);

  //   console.log('Data: ', res?.data);
  const docs = res?.data?.data?.docs;

  return docs.filter((el) => el?.isDeleted !== true);
}

// eslint-disable-next-line consistent-return
export async function getProfile(email) {
  try {
    const res = await axios.get(`${API_URL}/profiles/user/${email}`);

    return res?.data;
  } catch (e) {
    console.log(e);
  }
}

export async function editProfile(id, payload) {
  console.log({ id, payload });
  const res = await axios.post(`${API_URL}/profiles/edit`, { id, payload });
  console.log({ res });

  return res?.data;
}
