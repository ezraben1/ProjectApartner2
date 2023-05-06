import api from './api';
import Cookies from 'js-cookie';

interface LoginParams {
  username: string;
  password: string;
}

const auth = {
  login: async ({ username, password }: LoginParams): Promise<Response> => {
    const response = await api.post('/login/', { username, password });

    const headers: HeadersInit = Object.entries(response.headers).reduce((acc: { [key: string]: string }, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
    
    const data = await response.json();
    Cookies.set('access_token', data.access_token); 

    return new Response(JSON.stringify(data), {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
  logout: async (): Promise<void> => {
    Cookies.remove('access_token');
    localStorage.removeItem('access_token');
    console.log('deleted')
  },
};

export default auth;
