export interface TourItem {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  duration: number;
  startDate: Date | string;
  endDate: Date | string;
  image?: string;
  typeId: number;
  bestOffer: boolean;
  adventures: boolean;
  experience: boolean;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
