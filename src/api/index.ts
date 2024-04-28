import axios from "axios"
import router from "@/router"

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
})

api.interceptors.request.use(
  (config) => {
    const token = getLocalToken()
    if (token) config.headers["Authorization"] = "Bearer " + token
    else setLocalToken()
    return config
  },
  (error) => {
    Promise.reject(error).then(r => r)
  }
)

api.interceptors.response.use((response) => {
  if (401 === response.status) {
    console.error(new Error("401 Unauthorized. Redirecting to the authorization page."))
    setLocalToken()
    router.push("/auth").then(r => r)
  }
  return response
})

export function setLocalToken(token?: string) {
  if (token) localStorage.setItem("access-token", token)
  else localStorage.removeItem("access-token")
}

export function getLocalToken(): string | null {
  return localStorage.getItem("access-token")
}

export function isGuest(): boolean {
  return !localStorage.getItem("access-token")
}

export function isAuth(): boolean {
  return !isGuest()
}

export { api }