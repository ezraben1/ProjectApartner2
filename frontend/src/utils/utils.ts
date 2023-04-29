import Cookies from 'js-cookie';

export function getCookie(name: string): string | undefined {
  const value = Cookies.get(name);
  return value ?? undefined;
}

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};