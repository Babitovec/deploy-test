import axios from "axios";

const instance = axios.create({
    baseURL: 'https://more-gratefully-hornet.ngrok-free.app'
})

export default instance