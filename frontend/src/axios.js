import axios from "axios";

const instance = axios.create({
    baseURL: 'https://flame-coin.xyz'
})

export default instance