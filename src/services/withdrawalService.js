import axios from 'axios';
import {API_URL} from "../assets/constants";

export async function allWithdrawals(page, limit) {
    const res = await axios.get(`${API_URL}/withdrawals/all/${page}/${limit}`);

    // console.log("Data: ", res?.data)
    const docs = res?.data?.data?.docs;

    return docs;
}

export async function sendWithdrawalOTP(email) {
    const res = await axios.post(`${API_URL}/withdrawal/otp`, {email});

    return res?.data;
}

export async function verifyWithdrawalOTP(email, otp) {
    const res = await axios.post(`${API_URL}/withdrawal/verify-otp`, {email,otp});

    return res?.data?.valid;
}

// export async function getDeposit(id) {
//     const res = await axios.get(`${API_URL}/deposit/details/${id}`);
//     // console.log({ res });
//     // console.log('Data: ', res?.data);
//     return res?.data;
// }
