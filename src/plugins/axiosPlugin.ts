import { inject } from 'vue'
import axios from 'axios'

export const AxiosSymbol = Symbol('axios')

export const axiosPlugin = {
  install(app: any) {
    app.provide(AxiosSymbol, axios)
  }
}

export const useAxios = () => {
  const axios = inject(AxiosSymbol)
  if (!axios) {
    throw new Error('Axios is not installed')
  }
  return axios
}
