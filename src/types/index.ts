export interface Product {
  id: string;
  name: string;
  barcode: string;
  category: string;
  price: number;
  mrp?: number;
  stock: number;
  minStockAlert: number;
  unit: string;
  imageUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalPurchases: number;
  billsCount: number;
  createdAt: string;
}

export interface BillItem {
  id: string;
  productId: string;
  name: string;
  barcode: string;
  unitPrice: number;
  quantity: number;
  discount: number; // percentage or fixed
  gstRate: number; // e.g. 0, 5, 12, 18, 28
  total: number;
  unit: string;
}

export type PaymentMethod = 'CASH' | 'UPI' | 'CARD' | 'BANK_TRANSFER';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

export interface Bill {
  id: string;
  billNumber: string; // BK-000001
  date: string;
  time: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: BillItem[];
  subtotal: number;
  discountAmount: number;
  gstAmount: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  notes?: string;
}

export interface BusinessProfile {
  shopName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  category: string;
  gstNumber?: string;
  upiId: string;
  currency: string;
  invoicePrefix: string;
  logoUrl?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
  hasCompletedSetup: boolean;
  hasCompletedOnboarding: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'payment' | 'stock' | 'system' | 'report';
  timestamp: string;
  read: boolean;
}

export type AppView = 
  | 'splash'
  | 'onboarding'
  | 'auth'
  | 'business-setup'
  | 'dashboard'
  | 'create-bill'
  | 'scan-product'
  | 'products'
  | 'customers'
  | 'bills'
  | 'reports'
  | 'settings'
  | 'help';
