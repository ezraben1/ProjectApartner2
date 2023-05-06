import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

export const API_BASE_URL = 'http://localhost:8000';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const accessToken = Cookies.get('access_token');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});


const post = async (url: string, data: any): Promise<Response> => {
  const response = await api.request({
    url,
    method: 'POST',
    data,
  });

  const headers: HeadersInit = Object.entries(response.headers).reduce((acc: { [key: string]: string }, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

  return new Response(JSON.stringify(response.data), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};
const postWithFormData = async (
  url: string,
  formData: FormData
): Promise<Response> => {
  const response = await api.request({
    url,
    method: "POST",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });

  const headers: HeadersInit = Object.entries(response.headers).reduce(
    (acc: { [key: string]: string }, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {}
  );

  return new Response(JSON.stringify(response.data), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const getUserDetails = async (): Promise<Response> => {
  const response = await api.get('/core/me/');
  const headers = new Headers();
  for (const [key, value] of Object.entries(response.headers)) {
    headers.append(key, value);
  }
  return new Response(JSON.stringify(response.data), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const get = async (url: string, options?: any): Promise<Response> => {
  const response = await api.get(url, options);

  const headers: HeadersInit = Object.entries(response.headers).reduce((acc: { [key: string]: string }, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

  return new Response(JSON.stringify(response.data), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const patch = async (url: string, data: any, config?: AxiosRequestConfig): Promise<Response> => {
  const response = await api.request({
    url,
    method: 'PATCH',
    data,
    ...config,
  });

  const responseHeaders: HeadersInit = Object.entries(response.headers).reduce(
    (acc: { [key: string]: string }, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {}
  );

  return new Response(JSON.stringify(response.data), {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
};

const remove = async (url: string): Promise<Response> => {
  const response = await api.delete(url);

  const headers: HeadersInit = Object.entries(response.headers).reduce((acc: { [key: string]: string }, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

  const body = response.data ? JSON.stringify(response.data) : null;

  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const put = async (url: string, data: any): Promise<Response> => {
  const response = await api.request({
    url,
    method: 'PUT',
    data,
  });

  const headers: HeadersInit = Object.entries(response.headers).reduce(
    (acc: { [key: string]: string }, [key, value]) => {
      acc[key] = value;
      return acc;
    },
    {}
  );

  return new Response(JSON.stringify(response.data), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

const getBlob = async (url: string, options?: any): Promise<Blob> => {
  const response = await api.get(url, { ...options, responseType: 'blob' });

  if (response.status !== 200) {
    throw new Error(`Error downloading file: ${response.statusText}`);
  }

  return response.data;
};


export default {
  post,
  get,
  getUserDetails,
  patch,
  remove,
  put,
  getBlob,
  postWithFormData 
};

