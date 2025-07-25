import axios from "axios"

const BASE_URL = "https://random-quote-gen-production-856e.up.railway.app/api"

const api = axios.create({
	baseURL: BASE_URL,
	timeout: 10000,
	headers: { "Content-Type": "application/json" },
})

export default api