import Cookies from 'js-cookie';
import React from 'react';

export function getCookie(name: string): string | undefined {
  const value = Cookies.get(name);
  return value ?? undefined;
}

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Create the context objects
export const ApartmentIdContext = React.createContext<number | null>(null);
export const RoomIdContext = React.createContext<number | null>(null);
