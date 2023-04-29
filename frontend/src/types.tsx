export interface CustomUser {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    user_type: 'owner' | 'renter' | 'searcher';
    is_superuser: boolean;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
  }
  
  export interface Apartment {
    rooms: any;
    id: number;
    owner: CustomUser;
    address: string;
    description: string | null;
    size: string;
    balcony: boolean | null;
    bbq_allowed: boolean;
    smoking_allowed: boolean;
    allowed_pets: boolean;
    ac: boolean;
    images: ApartmentImage[];
  }
  
  export interface ApartmentImage {
    id: number;
    apartment: Apartment;
    image: string; // URL of the image
  }
  
  export interface Room {
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
    room: Room;
    owner: CustomUser;
    start_date: string; // Date string
    end_date: string; // Date string
    rent_amount: number;
    deposit_amount: number;
    terms_and_conditions: string | null;
  }
  
  export interface Bill {
    id: number;
    apartment: Apartment;
    bill_type: 'electricity' | 'gas' | 'water' | 'rent' | 'other';
    amount: number;
    date: string; // Date string
    paid: boolean;
    created_by: CustomUser;
    created_at: string; // Date string
    updated_at: string; // Date string
    document: string | null; // URL of the file
    files: BillFile[];
  }
  
  export interface BillFile {
    id: number;
    bill: Bill;
    file: string; // URL of the file
  }
  
  export interface Review {
    id: number;
    product: Room;
    name: string;
    description: string;
    date: string; // Date string
  }
  