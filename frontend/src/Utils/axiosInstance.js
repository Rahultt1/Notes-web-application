import axios from "axios";
import { BASE_URL } from "./constants";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout:10000,
    headers:{
        "Content-Type":"application/json"
    },

});
axiosInstance.interceptors.request.use(
    (conig) => {
        const accessToken = localStorage.getItem("token");
        if(accessToken){
            conig.headers.Authorization = `Bearer ${accessToken}`;
    }
    return conig;
    },(error) => Promise.reject(
        error
    )
)

export default axiosInstance