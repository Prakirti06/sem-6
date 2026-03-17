import {api} from "./api.js"

export const loginService  = async(data) => {
    const response = await api.post("/auth/login", data);
    if(!response.data.error){
        localStorage.setItem("token", response.data.data.token);
        const userData = atob(response.data.data.split(".")[1]);
        console.log("userData", userData);
    }
    return response.data;

}