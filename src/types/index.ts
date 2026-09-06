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
  tagline?: string;
  ownerName: string;
  phone: string;
  secondaryPhone?: string;
  email: string;
  address: string;
  landmark?: string;
  city?: string;
  district?: string;
  state?: string;
  pinCode?: string;
  category: string;
  establishedYear?: string;
  logoUrl?: string;
  
  // Tax & Legal Licenses
  gstNumber?: string;
  panNumber?: string;
  tradeLicenseNumber?: string;
  fssaiNumber?: string;
  drugLicenseNumber?: string;
  msmeNumber?: string;

  // Digital Payments & Banking
  upiId: string;
  upiPayeeName?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;

  // Invoice & Receipt Customization
  currency: string;
  invoicePrefix: string;
  receiptFooterText?: string;
  termsAndConditions?: string;
  printerType?: '58mm' | '80mm' | 'a4';
  showQrOnBill?: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  storeName?: string;
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

export type Language = 'en' | 'bn';
export type ThemeMode = 'light' | 'dark' | 'system';

export type AppView = 
  | 'splash'
  | 'language-select'
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
