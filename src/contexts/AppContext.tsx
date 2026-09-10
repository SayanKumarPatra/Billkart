import { createContext, useContext, useState, useEffect, ReactNode, type Dispatch, type SetStateAction } from 'react';
import { 
  Product, 
  Customer, 
  Bill, 
  BillItem, 
  BusinessProfile, 
  UserAccount, 
  NotificationItem, 
  AppView, 
  PaymentMethod, 
  PaymentStatus,
  Language,
  ThemeMode
} from '../types';
import { translations, Translations } from '../i18n/translations';
import { 
  INITIAL_BUSINESS, 
  INITIAL_PRODUCTS, 
  INITIAL_CUSTOMERS, 
  INITIAL_BILLS,
  DEFAULT_CUSTOMER
} from '../data/initialData';

interface AddToCartResult {
  success: boolean;
  product?: Product;
  quantity?: number;
  notFoundBarcode?: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  themeMode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setThemeMode: (mode: ThemeMode) => void;
  t: (key: keyof Translations) => string;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  user: UserAccount;
  setUser: Dispatch<SetStateAction<UserAccount>>;
  business: BusinessProfile;
  updateBusiness: (updated: Partial<BusinessProfile>) => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  findProductByBarcode: (barcode: string) => Product | undefined;
  customers: Customer[];
  addCustomer: (cust: Omit<Customer, 'id' | 'totalPurchases' | 'billsCount' | 'createdAt'>) => Customer;
  updateCustomer: (id: string, updated: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  bills: Bill[];
  markBillAsPaid: (billId: string, reference?: string) => void;
  deleteBill: (billId: string) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Active Bill & POS Cart State
  activeCustomer: Customer;
  setActiveCustomer: (cust: Customer) => void;
  cartItems: BillItem[];
  addToCartByBarcode: (barcode: string) => AddToCartResult;
  addToCart: (product: Product, qty?: number) => void;
  updateCartItemQty: (itemId: string, newQty: number) => void;
  updateCartItemPrice: (itemId: string, newPrice: number) => void;
  removeCartItem: (itemId: string) => void;
  clearCart: () => void;
  cartDiscount: number;
  setCartDiscount: (val: number) => void;
  cartGst: number;
  setCartGst: (val: number) => void;
  cartSubtotal: number;
  cartDiscountAmount: number;
  cartGstAmount: number;
  cartGrandTotal: number;
  
  // Generated Bill for Checkout & Invoice View
  activeBill: Bill | null;
  setActiveBill: (bill: Bill | null) => void;
  generateBill: (paymentMethod?: PaymentMethod, status?: PaymentStatus) => Bill;

  // Camera Scanner Modal State
  isScannerOpen: boolean;
  openScanner: () => void;
  closeScanner: () => void;

  // Data Export & Reset
  exportDataJSON: () => string;
  restoreDataJSON: (jsonString: string) => boolean;
  resetToDefaultData: () => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  BUSINESS: 'billkart_v2_business',
  PRODUCTS: 'billkart_v2_products',
  CUSTOMERS: 'billkart_v2_customers',
  BILLS: 'billkart_v2_bills',
  USER: 'billkart_v2_user',
  LANGUAGE: 'billkart_v2_language',
  THEME: 'billkart_v2_theme',
};

export function AppProvider({ children }: { children: ReactNode }) {
  // Theme State - Default to 'light' mode as requested ("প্রথমে যে আসবে মানে ইউজার তাকে প্রথম লাইট মোডেই থাকবে")
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
    // Default for first-time visitors is strictly Light Mode
    return 'light';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Synchronize theme to document element class list & data attributes
  useEffect(() => {
    const updateEffectiveTheme = () => {
      let effective: 'light' | 'dark' = 'light';
      if (themeMode === 'system') {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        effective = prefersDark ? 'dark' : 'light';
      } else {
        effective = themeMode;
      }
      setResolvedTheme(effective);

      const root = document.documentElement;
      if (effective === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
    };

    updateEffectiveTheme();

    if (themeMode === 'system' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => updateEffectiveTheme();
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [themeMode]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem(STORAGE_KEYS.THEME, mode);
  };

  // Language State - Default to 'bn' (Bengali) as requested or stored preference
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (saved === 'en' || saved === 'bn') {
      return saved;
    }
    return 'bn';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  };

  // Translation lookup helper
  const t = (key: keyof Translations): string => {
    return translations[language]?.[key] || translations.en[key] || '';
  };

  // Navigation State: directly opens the mobile dashboard for ready POS operation
  const [currentView, setCurrentView] = useState<AppView>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.isAuthenticated && parsed.hasCompletedSetup) {
          return 'dashboard';
        }
        if (!parsed.isAuthenticated) {
          return 'auth';
        }
      }
    } catch (e) { /* ignore */ }
    return 'dashboard';
  });

  // User State - Initialized fresh to Sayan Kumar Patra
  const [user, setUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      id: 'usr-1',
      name: 'Sayan Kumar Patra',
      email: 'sayan@gmail.com',
      isAuthenticated: true,
      hasCompletedSetup: true,
      hasCompletedOnboarding: true,
    };
  });

  // Business State
  const [business, setBusiness] = useState<BusinessProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUSINESS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_BUSINESS;
  });

  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((p: Product) => p.id));
          const missing = INITIAL_PRODUCTS.filter(p => !existingIds.has(p.id));
          if (missing.length > 0) {
            return [...parsed, ...missing];
          }
          return parsed;
        }
      } catch (e) { /* ignore */ }
    }
    return INITIAL_PRODUCTS;
  });

  // Customers State (ensures at least 1 customer exists, e.g. Walk-in)
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.id) {
          return parsed;
        }
      } catch (e) { /* ignore */ }
    }
    return INITIAL_CUSTOMERS.length > 0 ? INITIAL_CUSTOMERS : [DEFAULT_CUSTOMER];
  });

  // Bills State (starts clean: [])
  const [bills, setBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BILLS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_BILLS;
  });

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Low Stock Alert',
      message: 'Parle-G 800g has only 2 units left in inventory.',
      type: 'stock',
      timestamp: '10m ago',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'UPI Payment Received',
      message: '₹513.50 received for Bill #BK-000012 via Google Pay.',
      type: 'payment',
      timestamp: '35m ago',
      read: false,
    },
  ]);

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUSINESS, JSON.stringify(business));
  }, [business]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
  }, [bills]);

  // Active Bill / POS Cart
  const [activeCustomer, setActiveCustomer] = useState<Customer>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0]?.id) {
          return parsed[0];
        }
      } catch (e) { /* ignore */ }
    }
    return INITIAL_CUSTOMERS[0] || DEFAULT_CUSTOMER;
  });
  const [cartItems, setCartItems] = useState<BillItem[]>([
    {
      id: 'cart-1',
      productId: 'prod-4',
      name: 'Maggi 2-Minute Noodles Masala 4-Pack',
      barcode: '8901058852331',
      unitPrice: 56,
      quantity: 2,
      discount: 0,
      gstRate: 0,
      total: 112,
      unit: 'pack',
    },
    {
      id: 'cart-2',
      productId: 'prod-2',
      name: 'Tata Salt Vacuum Evaporated 1kg',
      barcode: '8901030383709',
      unitPrice: 28,
      quantity: 1,
      discount: 0,
      gstRate: 0,
      total: 28,
      unit: 'pouch',
    }
  ]);
  const [cartDiscount, setCartDiscount] = useState<number>(0);
  const [cartGst, setCartGst] = useState<number>(0);
  const [activeBill, setActiveBill] = useState<Bill | null>(null);

  // Scanner modal toggle
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const openScanner = () => setIsScannerOpen(true);
  const closeScanner = () => setIsScannerOpen(false);

  // Business updates
  const updateBusiness = (updated: Partial<BusinessProfile>) => {
    setBusiness(prev => ({ ...prev, ...updated }));
  };

  // Product CRUD
  const addProduct = (prodData: Omit<Product, 'id'>): Product => {
    const newProduct: Product = {
      ...prodData,
      id: 'prod-' + Date.now(),
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const findProductByBarcode = (barcode: string) => {
    const cleanBarcode = barcode.trim();
    return products.find(p => p.barcode === cleanBarcode);
  };

  // Customer CRUD
  const addCustomer = (custData: Omit<Customer, 'id' | 'totalPurchases' | 'billsCount' | 'createdAt'>): Customer => {
    const newCust: Customer = {
      ...custData,
      id: 'cust-' + Date.now(),
      totalPurchases: 0,
      billsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCustomers(prev => [newCust, ...prev]);
    return newCust;
  };

  const updateCustomer = (id: string, updated: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => (c.id === id ? { ...c, ...updated } : c)));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => {
      const remaining = prev.filter(c => c.id !== id);
      return remaining.length > 0 ? remaining : [DEFAULT_CUSTOMER];
    });
    setActiveCustomer(prev => (prev?.id === id ? DEFAULT_CUSTOMER : prev));
  };

  // Cart Logic with EXACT Barcode Auto-Increment requirement:
  // "If the scanned barcode does NOT exist in the current bill:
  //  Add: Product, Quantity = 1
  //  IF THE SAME BARCODE IS SCANNED AGAIN:
  //  Do NOT create another product row. Instead: Quantity = Quantity + 1
  //  Automatically recalculate: Item Total AND Grand Total"
  const addToCartByBarcode = (barcode: string): AddToCartResult => {
    const cleanCode = barcode.trim();
    const product = findProductByBarcode(cleanCode);

    if (!product) {
      return { success: false, notFoundBarcode: cleanCode };
    }

    // Check if barcode already exists in cart
    const existingIndex = cartItems.findIndex(i => i.barcode === cleanCode || i.productId === product.id);

    if (existingIndex >= 0) {
      // Barcode already in cart: increment quantity!
      const current = cartItems[existingIndex];
      const newQty = current.quantity + 1;
      const updatedItem: BillItem = {
        ...current,
        quantity: newQty,
        total: newQty * current.unitPrice,
      };

      setCartItems(prev => {
        const next = [...prev];
        next[existingIndex] = updatedItem;
        return next;
      });

      return { success: true, product, quantity: newQty };
    } else {
      // First scan of this barcode: add new row with quantity = 1
      const newItem: BillItem = {
        id: 'cart-' + Date.now(),
        productId: product.id,
        name: product.name,
        barcode: product.barcode,
        unitPrice: product.price,
        quantity: 1,
        discount: 0,
        gstRate: 0,
        total: product.price,
        unit: product.unit,
      };

      setCartItems(prev => [newItem, ...prev]);
      return { success: true, product, quantity: 1 };
    }
  };

  const addToCart = (product: Product, qty = 1) => {
    const existingIndex = cartItems.findIndex(i => i.productId === product.id);
    if (existingIndex >= 0) {
      const current = cartItems[existingIndex];
      const newQty = current.quantity + qty;
      const updatedItem: BillItem = {
        ...current,
        quantity: newQty,
        total: newQty * current.unitPrice,
      };
      setCartItems(prev => {
        const next = [...prev];
        next[existingIndex] = updatedItem;
        return next;
      });
    } else {
      const newItem: BillItem = {
        id: 'cart-' + Date.now(),
        productId: product.id,
        name: product.name,
        barcode: product.barcode,
        unitPrice: product.price,
        quantity: qty,
        discount: 0,
        gstRate: 0,
        total: product.price * qty,
        unit: product.unit,
      };
      setCartItems(prev => [newItem, ...prev]);
    }
  };

  const updateCartItemQty = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeCartItem(itemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: newQty,
            total: newQty * item.unitPrice,
          };
        }
        return item;
      })
    );
  };

  const updateCartItemPrice = (itemId: string, newPrice: number) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const validPrice = Math.max(0, newPrice);
          return {
            ...item,
            unitPrice: validPrice,
            total: item.quantity * validPrice,
          };
        }
        return item;
      })
    );
  };

  const removeCartItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
    setCartDiscount(0);
    setCartGst(0);
  };

  // Instant Totals Recalculation
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.total, 0);
  const cartDiscountAmount = (cartSubtotal * cartDiscount) / 100;
  const cartGstAmount = ((cartSubtotal - cartDiscountAmount) * cartGst) / 100;
  const cartGrandTotal = Math.max(0, cartSubtotal - cartDiscountAmount + cartGstAmount);

  // Generate Unique Bill
  const generateBill = (
    paymentMethod: PaymentMethod = 'UPI',
    status: PaymentStatus = 'PENDING'
  ): Bill => {
    const nextNum = bills.length + 1;
    const formattedNum = `${business.invoicePrefix || 'BK'}-${String(nextNum).padStart(6, '0')}`;
    const now = new Date();

    const targetCustomer = activeCustomer || customers[0] || DEFAULT_CUSTOMER;

    const newBill: Bill = {
      id: 'bill-' + Date.now(),
      billNumber: formattedNum,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerId: targetCustomer.id,
      customerName: targetCustomer.name,
      customerPhone: targetCustomer.phone,
      customerAddress: targetCustomer.address || '',
      items: [...cartItems],
      subtotal: cartSubtotal,
      discountAmount: cartDiscountAmount,
      gstAmount: cartGstAmount,
      grandTotal: cartGrandTotal,
      paymentMethod,
      paymentStatus: status,
      paymentReference: status === 'SUCCESS' ? `TXN-${Date.now()}` : undefined,
    };

    setBills(prev => [newBill, ...prev]);

    // Update customer stats
    setCustomers(prev =>
      prev.map(c => {
        if (c.id === targetCustomer.id) {
          return {
            ...c,
            totalPurchases: c.totalPurchases + cartGrandTotal,
            billsCount: c.billsCount + 1,
          };
        }
        return c;
      })
    );

    // Update stock in products catalog
    setProducts(prev =>
      prev.map(prod => {
        const billedItem = cartItems.find(i => i.productId === prod.id);
        if (billedItem) {
          const newStock = Math.max(0, prod.stock - billedItem.quantity);
          // Trigger notification if low stock
          if (newStock <= prod.minStockAlert) {
            setNotifications(curr => [
              {
                id: 'notif-' + Date.now() + Math.random(),
                title: 'Low Stock Alert',
                message: `${prod.name} has only ${newStock} left in stock!`,
                type: 'stock',
                timestamp: 'Just now',
                read: false,
              },
              ...curr,
            ]);
          }
          return { ...prod, stock: newStock };
        }
        return prod;
      })
    );

    setActiveBill(newBill);
    return newBill;
  };

  const markBillAsPaid = (billId: string, reference?: string) => {
    setBills(prev =>
      prev.map(b => {
        if (b.id === billId) {
          return {
            ...b,
            paymentStatus: 'SUCCESS',
            paymentReference: reference || `MANUAL-CONFIRM-${Date.now().toString().slice(-6)}`,
          };
        }
        return b;
      })
    );

    if (activeBill && activeBill.id === billId) {
      setActiveBill(prev =>
        prev
          ? {
              ...prev,
              paymentStatus: 'SUCCESS',
              paymentReference: reference || `MANUAL-CONFIRM-${Date.now().toString().slice(-6)}`,
            }
          : null
      );
    }
  };

  const deleteBill = (billId: string) => {
    setBills(prev => prev.filter(b => b.id !== billId));
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Data Export & Restore
  const exportDataJSON = () => {
    const data = {
      business,
      products,
      customers,
      bills,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };
    return JSON.stringify(data, null, 2);
  };

  const restoreDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.business) setBusiness(data.business);
      if (data.products && Array.isArray(data.products)) setProducts(data.products);
      if (data.customers && Array.isArray(data.customers)) setCustomers(data.customers);
      if (data.bills && Array.isArray(data.bills)) setBills(data.bills);
      return true;
    } catch (err) {
      console.error('Failed to restore backup', err);
      return false;
    }
  };

  const resetToDefaultData = () => {
    setBusiness(INITIAL_BUSINESS);
    setProducts(INITIAL_PRODUCTS);
    setCustomers(INITIAL_CUSTOMERS.length > 0 ? INITIAL_CUSTOMERS : [DEFAULT_CUSTOMER]);
    setActiveCustomer(INITIAL_CUSTOMERS[0] || DEFAULT_CUSTOMER);
    setBills(INITIAL_BILLS);
    clearCart();
  };

  const logout = () => {
    setUser(prev => ({
      ...prev,
      isAuthenticated: false,
    }));
    setCurrentView('auth');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        themeMode,
        resolvedTheme,
        setThemeMode,
        t,
        currentView,
        setCurrentView,
        user,
        setUser,
        business,
        updateBusiness,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        findProductByBarcode,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        bills,
        markBillAsPaid,
        deleteBill,
        notifications,
        markNotificationRead,
        clearNotifications,
        activeCustomer: activeCustomer || customers[0] || DEFAULT_CUSTOMER,
        setActiveCustomer,
        cartItems,
        addToCartByBarcode,
        addToCart,
        updateCartItemQty,
        updateCartItemPrice,
        removeCartItem,
        clearCart,
        cartDiscount,
        setCartDiscount,
        cartGst,
        setCartGst,
        cartSubtotal,
        cartDiscountAmount,
        cartGstAmount,
        cartGrandTotal,
        activeBill,
        setActiveBill,
        generateBill,
        isScannerOpen,
        openScanner,
        closeScanner,
        exportDataJSON,
        restoreDataJSON,
        resetToDefaultData,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
