// Shared API response shapes used across the client.

// Every account in the platform has exactly one of these roles.
export type UserRole = "customer" | "owner" | "admin";

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
  // Optional fields returned by the owner/admin endpoints.
  status?: string;
  brand?: string;
  model?: string;
  condition?: string;
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  createdAt?: string;
}

export interface Favorite {
  _id: string;
  equipmentId?: Equipment | null;
}

export interface Rental {
  _id: string;
  equipmentId?: Pick<Equipment, "_id" | "name" | "imageURL" | "category"> | null;
  rentalStartDate: string;
  rentalEndDate: string;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  // Extra fields returned by the owner/admin booking endpoints.
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  ownerId?: string;
  requiredQuantity?: number;
  contactNumber?: string;
  deliveryAddress?: string;
  additionalNotes?: string;
  createdAt?: string;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  phone?: string;
  address?: string;
  emailVerified?: boolean;
  createdAt?: string;
}

// One entry of the monthly aggregation returned by /api/analytics/admin.
export interface MonthlyBookingStat {
  _id: { year: number; month: number };
  count: number;
  revenue: number;
}

export interface AdminAnalytics {
  totals: {
    totalUsers: number;
    totalEquipment: number;
    totalBookings: number;
    pendingApprovals: number;
    completedRentals: number;
    totalRevenue: number;
  };
  monthlyBookings: MonthlyBookingStat[];
}

export interface OwnerAnalytics {
  totals: {
    totalEquipment: number;
    completedRentals: number;
    totalEarnings: number;
  };
  monthlyEarnings: {
    _id: { year: number; month: number };
    earnings: number;
  }[];
}
