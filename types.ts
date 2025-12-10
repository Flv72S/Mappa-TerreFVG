
export interface Review {
  id: string;
  author: string;
  rating: number; // 1 to 5
  text: string;
  date: string;
}

export interface Socials {
  facebook?: string;
  instagram?: string;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Company {
  id: string;
  name: string;
  category: 'Cantina' | 'Agriturismo' | 'Produttore' | 'Ristorazione';
  description: string;
  address: string;
  lat: number;
  lng: number;
  products: string[];
  website?: string;
  phone?: string;
  email?: string;
  imageUrl: string;
  features: string[]; // e.g. "Degustazioni", "Pernottamento"
  
  // New fields
  gallery?: string[];
  socials?: Socials;
  bookingUrl?: string; // Link to booking engine or mailto
  reviews?: Review[];
  openingHours?: Partial<Record<DayOfWeek, string>>; // e.g. monday: "09:00-18:00" or "09:00-12:00, 15:00-19:00"
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum ViewMode {
  MAP = 'MAP',
  LIST = 'LIST',
  PROFILE = 'PROFILE'
}
