import axios from "axios";
import {API_URL} from "../assets/constants";

export async function newProfile(payload){
    // eslint-disable-next-line no-useless-catch
    try{
        const res =  await axios.post(`${API_URL}/profiles/profile/new`, payload)

        return res?.data
    }
    catch (e) {
        throw e
    }
}

// eslint-disable-next-line consistent-return
export async function getProfile(email) {
    try {
        const res = await axios.get(`${API_URL}/profiles/user/${email}`);

        return res?.data;
    }
    catch (e) {
        console.log(e)
    }

}