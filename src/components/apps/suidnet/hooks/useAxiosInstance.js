import axios from 'axios';

export function useAxiosInstance() {
  const axiosInstance = axios.create({
    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: false
  });

  axiosInstance.interceptors.request.use(request => {
    console.log('Request:', request);
    return request;
  });

  axiosInstance.interceptors.response.use(response => {
    console.log('Response:', response);
    return response;
  });

  return axiosInstance;
}