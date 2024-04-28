import { api } from "@/api"
import type { AxiosError, AxiosRequestConfig } from "axios"
import { ref } from 'vue'
import { useGlobalStore } from '@/stores/globalStore'

export function useFetcher<T>() {
  const data = ref<T>()
  const error = ref<Error>()
  const globalStore = useGlobalStore()

  const getData = async (url: string, config?: AxiosRequestConfig) => {
    globalStore.isLoading = true
    data.value = undefined
    error.value = undefined
    return api
      .get<T>(url, config)
      .then((res) => {
        data.value = res.data
        return data.value
      })
      .catch((err: AxiosError) => {
        console.error(err)
        error.value = new Error(err.message)
      })
      .finally(() => {
        globalStore.isLoading = false
      })
  }

  const postData = async (url: string, dataToPost: any, config?: AxiosRequestConfig) => {
    globalStore.isLoading = true
    data.value = undefined
    error.value = undefined
    return api
      .post<T>(url, dataToPost, config)
      .then((res) => {
        data.value = res.data
        return data.value
      })
      .catch((err: AxiosError) => {
        console.error(err)
        error.value = new Error(err.message)
      })
      .finally(() => {
        globalStore.isLoading = false
      })
  }

  const putData = async (url: string, dataToPut: any, config?: AxiosRequestConfig) => {
    globalStore.isLoading = true
    data.value = undefined
    error.value = undefined
    return api
      .put<T>(url, dataToPut, config)
      .then((res) => {
        data.value = res.data
        return data.value
      })
      .catch((err: AxiosError) => {
        console.error(err)
        error.value = new Error(err.message)
      })
      .finally(() => {
        globalStore.isLoading = false
      })
  }

  const deleteData = async (url: string, config?: AxiosRequestConfig) => {
    globalStore.isLoading = true
    data.value = undefined
    error.value = undefined
    return api
      .delete(url, config)
      .then(() => {
        data.value = {} as T
        return data.value
      })
      .catch((err: AxiosError) => {
        console.error(err)
        error.value = new Error(err.message)
      })
      .finally(() => {
        globalStore.isLoading = false
      })
  }

  return {data, error, getData, postData, putData, deleteData}
}

// ******************************* Using example *******************************

// import {useFetcher} from "@/composables/useFetcher"
//
// const {getData, postData, loading, error} = useFetcher()

// const getItems = () => {
//   getData("/your-api-endpoint")
//     .then((res) => {
//       console.log(res)
//     })
//     .catch((err) => {
//       console.error(err)
//     })
// }
//
// const postItem = () => {
//   postData("/your-api-endpoint", newItem)
//     .then((res) => {
//       console.log(res);
//     })
//     .catch((err) => {
//       console.error(err);
//     });
// }