import { Product, Customer, Bill, BusinessProfile } from '../types';

export const INITIAL_BUSINESS: BusinessProfile = {
  shopName: 'Sayan General Store',
  ownerName: 'Sayan Kumar Patra',
  phone: '+91 98765 43210',
  email: 'sayan@gmail.com',
  address: 'College Road, Kolkata, West Bengal 700073',
  category: 'Retail Store',
  gstNumber: '19ABCDE1234F1Z5',
  upiId: 'sayan.patra@okhdfcbank',
  currency: '₹',
  invoicePrefix: 'BK',
  logoUrl: '',
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Aashirvaad Shudh Chakki Atta 5kg',
    barcode: '8901030834027',
    category: 'Grains & Staples',
    price: 245,
    mrp: 275,
    stock: 24,
    minStockAlert: 5,
    unit: 'pack',
  },
  {
    id: 'prod-2',
    name: 'Tata Salt Vacuum Evaporated 1kg',
    barcode: '8901030383709',
    category: 'Spices & Seasoning',
    price: 28,
    mrp: 30,
    stock: 45,
    minStockAlert: 10,
    unit: 'pouch',
  },
  {
    id: 'prod-3',
    name: 'Fortune Sunlite Refined Sunflower Oil 1L',
    barcode: '8906007280014',
    category: 'Edible Oils',
    price: 135,
    mrp: 155,
    stock: 18,
    minStockAlert: 5,
    unit: 'bottle',
  },
  {
    id: 'prod-4',
    name: 'Classmate Long Notebook 160 Pages',
    barcode: '8901058852331',
    category: 'Stationery',
    price: 60,
    mrp: 70,
    stock: 30,
    minStockAlert: 5,
    unit: 'book',
  },
  {
    id: 'prod-5',
    name: 'Reynolds Ballpoint Blue Pen',
    barcode: '8901262010054',
    category: 'Stationery',
    price: 10,
    mrp: 10,
    stock: 100,
    minStockAlert: 20,
    unit: 'pc',
  },
];

// Clean initial customer list - starts fresh as requested
export const INITIAL_CUSTOMERS: Customer[] = [];

// Clean initial bills - starts with 0 bills / ₹0 sales as requested
export const INITIAL_BILLS: Bill[] = [];

// Sample demo data available if user chooses to load samples in Settings
export const DEMO_SAMPLE_BILLS: Bill[] = [
  {
    id: 'bill-1',
    billNumber: 'BK-1001',
    date: '2026-09-06',
    time: '09:15 AM',
    customerId: 'cust-1',
    customerName: 'Rahul Verma',
    customerPhone: '9845012345',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        name: 'Aashirvaad Shudh Chakki Atta 5kg',
        barcode: '8901030834027',
        unitPrice: 245,
        quantity: 1,
        discount: 0,
        gstRate: 0,
        total: 245,
        unit: 'pack',
      },
      {
        id: 'item-2',
        productId: 'prod-3',
        name: 'Fortune Sunlite Refined Sunflower Oil 1L',
        barcode: '8906007280014',
        unitPrice: 135,
        quantity: 1,
        discount: 0,
        gstRate: 5,
        total: 135,
        unit: 'bottle',
      },
    ],
    subtotal: 380,
    discountAmount: 10,
    gstAmount: 6.75,
    grandTotal: 376.75,
    paymentMethod: 'UPI',
    paymentStatus: 'SUCCESS',
    paymentReference: 'UPI-983724128912',
  },
];

