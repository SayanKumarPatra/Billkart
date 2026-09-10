import { useState, useEffect, type FormEvent, type KeyboardEvent } from 'react';
import { 
  Barcode, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  User, 
  Phone,
  MapPin,
  CheckCircle2, 
  ArrowRight,
  ArrowLeft,
  Package,
  Receipt,
  RotateCcw,
  Sparkles,
  Edit2,
  Users,
  CreditCard,
  QrCode,
  Banknote,
  Percent,
  Calculator
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Customer, Product, PaymentMethod } from '../types';
import { InvoiceModal } from '../components/invoice/InvoiceModal';
import { playSound } from '../utils/audioHelper';
import { 
  playBarcodeScanSuccess, 
  playBarcodeScanError, 
  playBillGenerateSound 
} from '../utils/soundEffects';

export function CreateBillPage() {
  const { 
    cartItems, 
    products, 
    customers, 
    activeCustomer, 
    setActiveCustomer, 
    addCustomer,
    updateCustomer,
    addToCart, 
    updateCartItemQty, 
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
    generateBill,
    activeBill,
    setActiveBill,
    openScanner,
    language,
    t
  } = useApp();

  const isBn = language === 'bn';

  // STEP 1 vs STEP 2 (Customer details first, then Billing)
  const [currentStep, setCurrentStep] = useState<'customer' | 'billing'>('customer');

  // Step 1 Form States (Customer Name, Phone, Address)
  const [custName, setCustName] = useState(activeCustomer?.name || '');
  const [custPhone, setCustPhone] = useState(activeCustomer?.phone || '');
  const [custAddress, setCustAddress] = useState(activeCustomer?.address || '');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [showSavedCustomers, setShowSavedCustomers] = useState(false);

  useEffect(() => {
    if (activeCustomer) {
      setCustName(activeCustomer.name || '');
      setCustPhone(activeCustomer.phone || '');
      setCustAddress(activeCustomer.address || '');
    }
  }, [activeCustomer]);

  // Step 2 States (Catalog, Search, Tabs)
  const [activeTab, setActiveTab] = useState<'catalog' | 'cart'>('catalog');
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [manualAddModal, setManualAddModal] = useState(false);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Categories
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = 
      p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      p.barcode.includes(productSearchQuery.trim());
    return matchesCat && matchesSearch;
  });

  // Handle Step 1 Quick Fill for Walk-in Customer
  const handleQuickWalkIn = () => {
    playSound('click');
    const walkIn: Customer = {
      id: 'cust-walkin-' + Date.now(),
      name: isBn ? 'সাধারণ খরিদ্দার (Walk-in)' : 'Walk-in Customer',
      phone: '9876543210',
      address: isBn ? 'লোকাল কাউন্টার' : 'Local Counter',
      totalPurchases: 0,
      billsCount: 0,
      createdAt: new Date().toISOString(),
    };
    setCustName(walkIn.name);
    setCustPhone(walkIn.phone);
    setCustAddress(walkIn.address || '');
    setActiveCustomer(walkIn);
    setNameError('');
    setPhoneError('');
    setCurrentStep('billing');
  };

  // Select an existing customer
  const handleSelectCustomer = (c: Customer) => {
    playSound('click');
    setCustName(c.name);
    setCustPhone(c.phone);
    setCustAddress(c.address || '');
    setActiveCustomer(c);
    setNameError('');
    setPhoneError('');
    setShowSavedCustomers(false);
    setCurrentStep('billing');
  };

  // Handle Proceed from Step 1 to Step 2
  const handleProceedToBilling = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = custName.trim();
    const trimmedPhone = custPhone.trim();
    const trimmedAddress = custAddress.trim();

    if (!trimmedName) {
      setNameError(isBn ? 'অনুগ্রহ করে কাস্টমারের নাম লিখুন' : 'Please enter customer name');
      playSound('error');
      return;
    }
    setNameError('');

    // Check if customer exists or create new
    const existing = customers.find(c => c.phone === trimmedPhone);
    let targetCustomer: Customer;

    if (existing) {
      updateCustomer(existing.id, {
        name: trimmedName,
        address: trimmedAddress || existing.address,
      });
      targetCustomer = {
        ...existing,
        name: trimmedName,
        address: trimmedAddress || existing.address,
      };
    } else {
      targetCustomer = addCustomer({
        name: trimmedName,
        phone: trimmedPhone || '9876543210',
        address: trimmedAddress || (isBn ? 'লোকাল এরিয়া' : 'Local Area'),
      });
    }

    setActiveCustomer(targetCustomer);
    playSound('success');
    setCurrentStep('billing');
  };

  // Step 2: Custom manual item addition
  const handleAddManualCustomItem = (e: FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(customItemPrice);
    if (!customItemName.trim() || isNaN(priceNum) || priceNum <= 0) {
      playSound('error');
      return;
    }

    const customProduct: Product = {
      id: `custom-${Date.now()}`,
      barcode: `MANUAL-${Math.floor(1000 + Math.random() * 9000)}`,
      name: customItemName.trim(),
      price: priceNum,
      category: 'General',
      stock: 999,
      unit: 'pcs',
      minStockAlert: 5,
    };

    addToCart(customProduct, 1);
    playSound('scan');
    setCustomItemName('');
    setCustomItemPrice('');
    setManualAddModal(false);
  };

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const match = products.find(p => 
        p.barcode.toLowerCase() === productSearchQuery.trim().toLowerCase() ||
        p.name.toLowerCase() === productSearchQuery.trim().toLowerCase()
      );
      if (match) {
        addToCart(match, 1);
        playBarcodeScanSuccess();
        setProductSearchQuery('');
      } else {
        playBarcodeScanError();
      }
    }
  };

  // Final Step: Generate Bill
  const handleGenerateFinalBill = () => {
    if (cartItems.length === 0) {
      playSound('error');
      return;
    }
    const bill = generateBill(paymentMethod, 'SUCCESS');
    playBillGenerateSound();
    setActiveBill(bill);
    setShowInvoiceModal(true);
  };

  return (
    <div className="flex flex-col min-h-full pb-28 select-none">
      
      {/* ─────────────────────────────────────────────────────────────
          STEP 1: CUSTOMER DETAILS FIRST (নাম, মোবাইল নম্বর, ঠিকানা)
      ───────────────────────────────────────────────────────────── */}
      {currentStep === 'customer' && (
        <div className="p-4 space-y-4 max-w-md mx-auto w-full">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                ১
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {isBn ? 'ধাপ ১: কাস্টমার তথ্য' : 'Step 1: Customer Details'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {isBn ? 'পরবর্তী ধাপ: বিলিং' : 'Next: Billing'}
            </span>
          </div>

          {/* Intro Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>{isBn ? 'খরিদ্দারের তথ্য পূরণ করুন' : 'Enter Customer Details'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isBn 
                ? 'বিলিং শুরু করার পূর্বে ক্রেতার নাম, মোবাইল নম্বর এবং ঠিকানা লিখুন।' 
                : 'Enter name, phone number, and address before proceeding to billing.'}
            </p>
          </div>

          {/* Step 1 Customer Form */}
          <form onSubmit={handleProceedToBilling} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3.5">
            
            {/* Customer Name Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isBn ? 'কাস্টমারের নাম' : 'Customer Name'}</span>
                  <span className="text-red-500">*</span>
                </span>
                {nameError && (
                  <span className="text-[10px] text-red-500 font-normal">{nameError}</span>
                )}
              </label>
              <input
                type="text"
                value={custName}
                onChange={(e) => {
                  setCustName(e.target.value);
                  if (nameError) setNameError('');
                }}
                placeholder={isBn ? 'উদাঃ রহিম শেখ / সুবীর দাস' : 'e.g. John Doe / Rajesh Roy'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
                autoFocus
              />
            </div>

            {/* Customer Phone Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isBn ? 'মোবাইল নম্বর' : 'Mobile Number'}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {isBn ? 'হোয়াটসঅ্যাপ বিলের জন্য' : 'For WhatsApp bill'}
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={custPhone}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, '');
                    setCustPhone(cleaned);
                  }}
                  placeholder="9876543210"
                  className="w-full pl-12 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all tracking-wider"
                />
              </div>
            </div>

            {/* Customer Address Field (Requested explicitly by user) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  <span>{isBn ? 'ঠিকানা / এরিয়া' : 'Address & Area'}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {isBn ? 'ইনভয়েসে প্রিন্ট হবে' : 'Printed on invoice'}
                </span>
              </label>
              <textarea
                rows={2}
                value={custAddress}
                onChange={(e) => setCustAddress(e.target.value)}
                placeholder={isBn ? 'দোকান/গ্রাম/এরিয়া, শহর (উদাঃ মহেশতলা, কলকাতা)' : 'Street, Village/Area, City (e.g. Park Street, Kolkata)'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all resize-none"
              />
            </div>

            {/* Quick Shortcuts */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {isBn ? 'দ্রুত নির্বাচন ও শর্টকাট:' : 'Quick shortcuts:'}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* 1-Tap Walk-in */}
                <button
                  type="button"
                  onClick={handleQuickWalkIn}
                  className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-98"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isBn ? 'নিয়মিত খরিদ্দার' : 'Walk-in (1-Tap)'}</span>
                </button>

                {/* Pick Saved Customer */}
                <button
                  type="button"
                  onClick={() => setShowSavedCustomers(!showSavedCustomers)}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-98"
                >
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                  <span>{isBn ? `সংরক্ষিত (${customers.length})` : `Saved (${customers.length})`}</span>
                </button>
              </div>

              {/* Saved Customers List Drawer */}
              {showSavedCustomers && customers.length > 0 && (
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 max-h-48 overflow-y-auto space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                    {isBn ? 'খরিদ্দার নির্বাচন করুন' : 'Select Customer'}
                  </div>
                  {customers.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectCustomer(c)}
                      className="w-full text-left p-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {c.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono truncate">
                          {c.phone} {c.address ? `• ${c.address}` : ''}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Step 1 Primary CTA Button: Proceed to Billing */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-3"
            >
              <span>{isBn ? 'পরবর্তী ধাপ: বিলিং শুরু করুন' : 'Proceed to Billing'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          STEP 2: PRODUCTS & BILLING (পণ্য যোগ, স্ক্যান ও মেমো তৈরি)
      ───────────────────────────────────────────────────────────── */}
      {currentStep === 'billing' && (
        <div className="space-y-3 p-3 max-w-md mx-auto w-full">
          
          {/* Active Customer Summary Banner with Edit Button */}
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                  <span>{custName || activeCustomer?.name || 'খরিদ্দার'}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                    {custPhone || activeCustomer?.phone || ''}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 shrink-0 text-rose-500" />
                  <span>{custAddress || activeCustomer?.address || (isBn ? 'ঠিকানা নেই' : 'No address')}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                playSound('click');
                setCurrentStep('customer');
              }}
              className="py-1.5 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-bold text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 flex items-center gap-1 shrink-0 transition-all"
            >
              <Edit2 className="w-3 h-3" />
              <span>{isBn ? 'বদলান' : 'Edit'}</span>
            </button>
          </div>

          {/* Subview Tabs: Products Catalog vs Cart */}
          <div className="flex rounded-xl bg-slate-200/80 dark:bg-slate-800 p-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'catalog'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs font-black'
                  : 'text-slate-600 dark:text-slate-400 font-medium'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>{isBn ? 'পণ্য ক্যাটালগ' : 'Catalog'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('cart')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all relative ${
                activeTab === 'cart'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs font-black'
                  : 'text-slate-600 dark:text-slate-400 font-medium'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>{isBn ? 'বিল কার্ট' : 'Cart'} ({cartItems.length})</span>
              {cartGrandTotal > 0 && (
                <span className="font-mono text-emerald-600 dark:text-emerald-400 text-[11px]">
                  ₹{cartGrandTotal.toFixed(0)}
                </span>
              )}
            </button>
          </div>

          {/* ──────────────── TAB 1: CATALOG & SCANNER ──────────────── */}
          {activeTab === 'catalog' && (
            <div className="space-y-3">
              
              {/* Search Bar + Scanner + Custom Item Buttons */}
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      placeholder={isBn ? 'পণ্য বা বারকোড খুঁজুন...' : 'Search product or barcode...'}
                      className="w-full pl-9 pr-7 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                    />
                    {productSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setProductSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Barcode Scanner Button */}
                  <button
                    type="button"
                    onClick={openScanner}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
                    title={isBn ? 'বারকোড স্ক্যানার খুলুন' : 'Open barcode camera'}
                  >
                    <Barcode className="w-4 h-4" />
                    <span>{isBn ? 'স্ক্যান' : 'Scan'}</span>
                  </button>

                  {/* Manual Add Custom Product */}
                  <button
                    type="button"
                    onClick={() => setManualAddModal(true)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all shrink-0"
                    title={isBn ? 'কাস্টম পণ্য যোগ' : 'Add custom item'}
                  >
                    <Plus className="w-4 h-4 text-blue-600" />
                  </button>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                        selectedCategory === cat
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Cards List */}
              <div className="space-y-2">
                {filteredProducts.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <Package className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isBn ? 'কোনো পণ্য খুঁজে পাওয়া যায়নি' : 'No products found'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setManualAddModal(true)}
                      className="text-xs text-blue-600 font-bold"
                    >
                      {isBn ? '+ নতুন কাস্টম পণ্য যোগ করুন' : '+ Add custom item'}
                    </button>
                  </div>
                ) : (
                  filteredProducts.map((prod) => {
                    const cartItem = cartItems.find(i => i.productId === prod.id);
                    return (
                      <div
                        key={prod.id}
                        className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-3 hover:border-blue-400/50 transition-all"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {prod.name}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono">
                              ₹{prod.price}
                            </span>
                            <span className="text-[10px] text-slate-400">/{prod.unit}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                              {prod.category}
                            </span>
                          </div>
                        </div>

                        {/* Add or Counter Button */}
                        <div className="shrink-0">
                          {cartItem ? (
                            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-0.5">
                              <button
                                type="button"
                                onClick={() => updateCartItemQty(cartItem.id, cartItem.quantity - 1)}
                                className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center transition-colors shadow-2xs"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-7 text-center text-xs font-bold font-mono text-slate-900 dark:text-white">
                                {cartItem.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateCartItemQty(cartItem.id, cartItem.quantity + 1)}
                                className="w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center transition-colors shadow-2xs"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                addToCart(prod, 1);
                                playSound('scan');
                              }}
                              className="py-1.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-bold transition-all flex items-center gap-1 active:scale-95 shadow-2xs"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>{isBn ? 'যোগ' : 'Add'}</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Floating Bottom Quick Bar when cart has items */}
              {cartItems.length > 0 && (
                <div className="sticky bottom-20 z-20 p-2.5 rounded-2xl bg-slate-900 text-white shadow-xl border border-slate-800 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      {isBn ? 'কার্ট সারাংশ' : 'Cart summary'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-200">
                        {cartItems.length} {isBn ? 'টি পণ্য' : 'items'}
                      </span>
                      <span className="text-sm font-black text-emerald-400 font-mono">
                        ₹{cartGrandTotal.toFixed(0)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playSound('click');
                      setActiveTab('cart');
                    }}
                    className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-md"
                  >
                    <span>{isBn ? 'কার্ট ও ফাইনাল বিল' : 'View Cart'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

            </div>
          )}

          {/* ──────────────── TAB 2: CART & CHECKOUT ──────────────── */}
          {activeTab === 'cart' && (
            <div className="space-y-3">
              
              {/* Cart Items Card */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-blue-600" />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {isBn ? 'নির্বাচিত পণ্য তালিকা' : 'Cart Items'} ({cartItems.length})
                    </h3>
                  </div>

                  {cartItems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        playSound('click');
                        clearCart();
                      }}
                      className="text-[11px] font-bold text-red-500 hover:text-red-600 flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{isBn ? 'খালি করুন' : 'Clear'}</span>
                    </button>
                  )}
                </div>

                {/* Items List */}
                {cartItems.length === 0 ? (
                  <div className="py-10 text-center space-y-2">
                    <Package className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {isBn ? 'কার্ট খালি রয়েছে' : 'Cart is empty'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('catalog')}
                      className="text-xs text-blue-600 font-bold"
                    >
                      {isBn ? 'ক্যাটালগ থেকে পণ্য যোগ করুন ➔' : 'Add products from catalog ➔'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-2.5"
                      >
                        <div className="min-w-0 flex-1">
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.name}
                          </h5>
                          <div className="text-[11px] text-slate-500 font-mono">
                            ₹{item.unitPrice} × {item.quantity} = <strong className="text-slate-800 dark:text-slate-200">₹{item.total}</strong>
                          </div>
                        </div>

                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5">
                            <button
                              type="button"
                              onClick={() => updateCartItemQty(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold"
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-xs font-bold font-mono">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartItemQty(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center text-xs font-bold"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeCartItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Discount & GST Inputs */}
              {cartItems.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Discount Input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Percent className="w-3 h-3 text-amber-500" />
                        <span>{isBn ? 'ডিসকাউন্ট (%)' : 'Discount (%)'}</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={cartDiscount || ''}
                        onChange={(e) => setCartDiscount(parseFloat(e.target.value) || 0)}
                        placeholder="0%"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* GST Input */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Calculator className="w-3 h-3 text-blue-500" />
                        <span>{isBn ? 'জিএসটি কর (%)' : 'GST (%)'}</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="28"
                        value={cartGst || ''}
                        onChange={(e) => setCartGst(parseFloat(e.target.value) || 0)}
                        placeholder="0%"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                      {isBn ? 'পেমেন্ট মাধ্যম নির্বাচন করুন:' : 'Payment Method:'}
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
                      {(['UPI', 'CASH', 'CARD'] as PaymentMethod[]).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`py-2 px-1 rounded-xl border text-center transition-all flex items-center justify-center gap-1 ${
                            paymentMethod === method
                              ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {method === 'UPI' && <QrCode className="w-3.5 h-3.5" />}
                          {method === 'CASH' && <Banknote className="w-3.5 h-3.5" />}
                          {method === 'CARD' && <CreditCard className="w-3.5 h-3.5" />}
                          <span>{method}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Totals Breakdown */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span>{isBn ? 'মোট মূল্য (Subtotal)' : 'Subtotal'}</span>
                      <span className="font-mono">₹{cartSubtotal.toFixed(2)}</span>
                    </div>

                    {cartDiscountAmount > 0 && (
                      <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 font-semibold">
                        <span>{isBn ? 'ডিসকাউন্ট ছাড়' : 'Discount'}</span>
                        <span className="font-mono">-₹{cartDiscountAmount.toFixed(2)}</span>
                      </div>
                    )}

                    {cartGstAmount > 0 && (
                      <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
                        <span>{isBn ? 'জিএসটি কর' : 'GST Tax'}</span>
                        <span className="font-mono">+₹{cartGstAmount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-sm font-black text-slate-900 dark:text-white">
                      <span>{isBn ? 'সর্বমোট প্রদেয় বিল' : 'Grand Total'}</span>
                      <span className="font-mono text-xl text-emerald-600 dark:text-emerald-400">
                        ₹{cartGrandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Final Action Button: Generate Bill */}
                  <button
                    type="button"
                    onClick={handleGenerateFinalBill}
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>{isBn ? 'বিল প্রস্তুত ও ক্যাশ মেমো প্রিন্ট করুন' : 'Generate & Print Invoice'}</span>
                  </button>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* Manual Custom Product Modal */}
      {manualAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {isBn ? 'কাস্টম পণ্য যোগ করুন' : 'Add Custom Product'}
            </h4>
            <form onSubmit={handleAddManualCustomItem} className="space-y-2.5">
              <input
                type="text"
                value={customItemName}
                onChange={(e) => setCustomItemName(e.target.value)}
                placeholder={isBn ? 'পণ্যের নাম' : 'Product name'}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                autoFocus
              />
              <input
                type="number"
                step="0.01"
                value={customItemPrice}
                onChange={(e) => setCustomItemPrice(e.target.value)}
                placeholder={isBn ? 'বিক্রয় মূল্য (₹)' : 'Price (₹)'}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setManualAddModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  {isBn ? 'যোগ করুন' : 'Add to Cart'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal (Print / WhatsApp / PDF & JPG Download) */}
      <InvoiceModal
        bill={activeBill}
        isOpen={showInvoiceModal}
        onClose={() => {
          setShowInvoiceModal(false);
          // When bill is done, reset to step 1 for the next customer
          setCurrentStep('customer');
        }}
      />

    </div>
  );
}
