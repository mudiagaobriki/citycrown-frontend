import axios from "axios";
import {API_URL} from "../assets/constants";

export async function signUpUser(payload){
    // eslint-disable-next-line no-useless-catch
    try{
        const res =  await axios.post(`${API_URL}/users/register`, payload)

        return res?.data
    }
    catch (e) {
        throw e
    }
}

export function signInUser(payload, additionalData){

    return axios.post(`${API_URL}/users/login`, payload).then((res) => {

        return res.data;
    }).catch((err) => {
        throw err
    })
}

// eslint-disable-next-line consistent-return
export async function getUser(email) {
    try {
        const res = await axios.get(`${API_URL}/users/user/${email}`);

        return res?.data;
    }
    catch (e) {
        console.log(e)
    }

}