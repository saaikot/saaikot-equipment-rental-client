// Shared API response shapes used across the client.

export interface Equipment {
  _id: string;
  name: string;
  description?: string;
  category: string;
  location: string;
  price: number;
  rentalType: string;
  availableQuantity: number;
  imageURL: string;
  rentalTerms?: string;
}

export interface Favorite {
  _id: string;
  equipmentId?: Equipment | null;
}

export interface Rental {
  _id: string;
  equipmentId?: Pick<Equipment, "_id" | "name" | "imageURL"> | null;
  rentalStartDate: string;
  rentalEndDate: string;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
}
