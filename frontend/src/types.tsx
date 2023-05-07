export interface CustomUser {
  phone: number;
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: "owner" | "renter" | "searcher";
  is_superuser: boolean;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  avatar: string;
}

export interface Apartment {
  id: number;
  owner: CustomUser;
  owner_id: number;
  owner_email: string;
  owner_first_name: string;
  owner_last_name: string;
  owner_phone: string;
  address: string;
  city: string;
  street: string;
  building_number: string;
  apartment_number: string;
  floor: string;
  description: string;
  size: string;
  balcony: boolean | null;
  bbq_allowed: boolean;
  smoking_allowed: boolean;
  allowed_pets: boolean;
  images: ApartmentImage[];
  rooms?: Room[];
  ac: boolean;
}

export interface ApartmentImage {
  url: string;
  id: number;
  apartment: Apartment;
  image: string; // URL of the image
}

export interface Room {
  city: string;
  street: string;
  building_number: string;
  apartment_number: string;
  floor: string;
  id: number;
  apartment: Apartment;
  renter: CustomUser | null;
  description: string | null;
  price_per_month: number;
  size: string;
  window: boolean;
  ac: boolean;
  images: RoomImage[];
  contract: Contract;
}

export interface RoomImage {
  url: string | undefined;
  id: number;
  room: Room;
  image: string; // URL of the image
}

export interface Contract {
  id: number;
  room_id: number; // Add this line
  apartment_id: number; // Add this line
  room: Room;
  owner: CustomUser;
  start_date: string; // Date string
  end_date: string; // Date string
  rent_amount: number;
  deposit_amount: number;
  terms_and_conditions: string | null;
  file: File | null;
}

export interface Bill {
  id: number;
  apartment: Apartment;
  bill_type: "electricity" | "gas" | "water" | "rent" | "other";
  amount: number;
  date: string; // Date string
  paid: boolean;
  created_at: string; // Date string
  updated_at: string; // Date string
  document: string | null; // URL of the file
  file: File | null;
}

export namespace Bill {
  export const BILL_TYPES: [Bill["bill_type"], string][] = [
    ["electricity", "Electricity"],
    ["gas", "Gas"],
    ["water", "Water"],
    ["rent", "Rent"],
    ["other", "Other"],
  ];
}

export interface Review {
  id: number;
  product: Room;
  name: string;
  description: string;
  date: string; // Date string
}

export interface ApartmentAPI {
  id: number;
  owner_id: number;
  owner_email: string;
  owner_first_name: string;
  owner_last_name: string;
  owner_phone: string | null;
  address: string;
  city: string;
  street: string;
  building_number: string;
  apartment_number: string;
  floor: string;
  description: string;
  size: string;
  balcony: boolean;
  bbq_allowed: boolean;
  smoking_allowed: boolean;
  allowed_pets: boolean;
  ac: boolean;
  images: Array<any>;
}

export interface Inquiry {
  status: string;
  id: number;
  apartment: Apartment;
  sender: CustomUser;
  receiver: CustomUser | null;
  type: string;
  message: string;
  created_at: string;
  image: string | null;
}

export interface Reply {
  id: number;
  message: string;
  sender: CustomUser;
  created_at: string;
}
