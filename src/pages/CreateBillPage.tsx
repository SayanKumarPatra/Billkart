import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { 
  Barcode, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  User, 
  UserPlus, 
  ShoppingBag, 
  RotateCcw, 
  ArrowRight,
  Package,
  Receipt,
  CreditCard
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Customer, Product } from '../types';
import { PaymentModal } from '../components/payment/PaymentModal';
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

  // Search & Filters
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Modals & Popups
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [manualAddModal, setManualAddModal] = useState(false);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');
  const [mobileTab, setMobileTab] = useState<'cart' | 'catalog'>('cart');

  // Categories for quick filtering
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      p.barcode.includes(productSearchQuery.trim());
    return matchesCat && matchesSearch;
  });

  const handleCreateCustomer = (e: FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim()) {
      playSound('error');
      return;
    }
    const added = addCustomer({
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
    });
    setActiveCustomer(added);
    playSound('success');
    setShowAddCustomerModal(false);
    setNewCustName('');
    setNewCustPhone('');
  };

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

  const handleGenerateBillClick = () => {
    if (cartItems.length === 0) {
      playSound('error');
      return;
    }
    const bill = generateBill('UPI');
    playBillGenerateSound();
    setActiveBill(bill);
    setShowPaymentModal(true);
  };

  return (
    <div className="space-y-4 pb-24 lg:pb-12 max-w-7xl mx-auto select-none">
      
      {/* Top Customer & Search Bar Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          
          {/* Customer Selection */}
          <div className="space-y-2 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 lg:pr-4 pb-3 lg:pb-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>{t('customerDetails')}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowAddCustomerModal(true)}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <UserPlus className="w-3 h-3" />
                <span>{language === 'bn' ? '+ নতুন ক্রেতা' : '+ Add New'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={activeCustomer?.name || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setActiveCustomer(prev => ({
                    id: prev?.id || 'walk-in',
                    name: val,
                    phone: prev?.phone || '',
                    totalPurchases: prev?.totalPurchases || 0,
                    billsCount: prev?.billsCount || 0,
                  }));
                }}
                placeholder={language === 'bn' ? 'ক্রেতার নাম (ঐচ্ছিক)' : 'Customer Name'}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
              <input
                type="tel"
                value={activeCustomer?.phone || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  setActiveCustomer(prev => ({
                    id: prev?.id || 'walk-in',
                    name: prev?.name || 'সাধারণ ক্রেতা',
                    phone: val,
                    totalPurchases: prev?.totalPurchases || 0,
                    billsCount: prev?.billsCount || 0,
                  }));
                }}
                placeholder={language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Search, Scan & Manual Inputs */}
          <div className="lg:col-span-2 space-y-2.5">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={t('scanOrSearchPlaceholder')}
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
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

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={openScanner}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Barcode className="w-4 h-4" />
                  <span>{language === 'bn' ? 'বারকোড স্ক্যান' : 'Scan'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setManualAddModal(true)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>{language === 'bn' ? 'কাস্টম পণ্য' : 'Manual'}</span>
                </button>
              </div>
            </div>

            {/* Quick Category Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
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

        </div>
      </div>

      {/* Mobile View Switcher Tabs: Cart vs Quick Catalog */}
      <div className="flex lg:hidden rounded-xl bg-slate-200 dark:bg-slate-800 p-1 text-xs font-bold">
        <button
          type="button"
          onClick={() => setMobileTab('cart')}
          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'cart'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'বিল কার্ট' : 'Cart'} ({cartItems.length})</span>
          {cartGrandTotal > 0 && (
            <span className="font-mono text-emerald-600 dark:text-emerald-400">
              ₹{cartGrandTotal.toFixed(0)}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('catalog')}
          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'catalog'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'ক্যাটালগ' : 'Catalog'} ({filteredProducts.length})</span>
        </button>
      </div>

      {/* Main Billing Grid: Cart Table + Quick Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Cart Items (7 cols) */}
        <div className={`lg:col-span-7 space-y-4 ${mobileTab === 'cart' ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col min-h-[380px]">
            
            {/* Table Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">
                  {t('cartItemsTitle')} ({cartItems.length})
                </h3>
              </div>
              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t('clearCart')}</span>
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto max-h-80 sm:max-h-[460px] py-3 space-y-2">
              {cartItems.length === 0 ? (
                <div className="text-center py-12 sm:py-20 space-y-2.5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center mx-auto">
                    <Package className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t('emptyCartPrompt')}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    {language === 'bn' 
                      ? 'বারকোড স্ক্যান করুন অথবা পাশের পণ্য ক্যাটালগ থেকে ক্লিক করে আইটেম যোগ করুন।'
                      : 'Scan a barcode or tap products from the catalog to add them.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setMobileTab('catalog')}
                    className="mt-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-blue-600 lg:hidden inline-flex items-center gap-1.5"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'পণ্য ক্যাটালগ খুলুন' : 'Open Catalog'}</span>
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 hover:border-blue-500/50 transition-colors"
                  >
                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                        ₹{item.unitPrice} / {item.unit}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5">
                        <button
                          type="button"
                          onClick={() => updateCartItemQty(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-slate-900 dark:text-white font-mono">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartItemQty(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Total */}
                      <div className="w-16 text-right font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-mono">
                        ₹{item.total.toFixed(0)}
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => removeCartItem(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Bill Summary & Quick Shelf (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Bill Summary */}
          <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5 ${mobileTab === 'cart' ? 'block' : 'hidden lg:block'}`}>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display pb-2 border-b border-slate-100 dark:border-slate-800">
              {t('billSummary')}
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{t('subtotal')}:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  ₹{cartSubtotal.toFixed(2)}
                </span>
              </div>

              {/* Discount Selector */}
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span>{t('discount')}:</span>
                  <div className="flex gap-1">
                    {[0, 5, 10].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setCartDiscount(d)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors ${
                          cartDiscount === d
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {d}%
                      </button>
                    ))}
                  </div>
                </div>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  -₹{cartDiscountAmount.toFixed(2)}
                </span>
              </div>

              {/* GST Selector */}
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span>{t('taxGst')}:</span>
                  <div className="flex gap-1">
                    {[0, 5, 12, 18].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setCartGst(g)}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors ${
                          cartGst === g
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {g}%
                      </button>
                    ))}
                  </div>
                </div>
                <span className="font-mono text-slate-900 dark:text-white">
                  +₹{cartGstAmount.toFixed(2)}
                </span>
              </div>

              {/* Grand Total */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    {t('grandTotal')}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
                    ₹{cartGrandTotal.toFixed(2)}
                  </span>
                </div>

                <span className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  {cartItems.length} {language === 'bn' ? 'পণ্য' : 'Items'}
                </span>
              </div>
            </div>

            {/* Desktop / In-flow Generate Bill Button */}
            <button
              type="button"
              disabled={cartItems.length === 0}
              onClick={handleGenerateBillClick}
              className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 ${
                cartItems.length > 0
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer active:scale-98'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>{t('generateBill')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Product Shelf */}
          <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3 ${mobileTab === 'catalog' ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {language === 'bn' ? 'ক্যাটালগ পণ্য তালিকা' : 'Quick Catalog Items'} ({filteredProducts.length})
              </span>
              <span className="text-[11px] text-slate-400">
                {language === 'bn' ? 'ক্লিক করে যুক্ত করুন' : 'Click to add'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-72 sm:max-h-64 overflow-y-auto pr-0.5">
              {filteredProducts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    addToCart(p, 1);
                    playBarcodeScanSuccess();
                  }}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700/60 border border-slate-200 dark:border-slate-700 text-left transition-colors group"
                >
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {p.name}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">₹{p.price}</span>
                    <span className="text-[10px] text-slate-400">{p.unit}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Floating Mobile Checkout Bar - Positioned with safe margin above bottom nav */}
      {cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-18 inset-x-3 z-30 p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl flex items-center justify-between gap-3">
          <div className="min-w-0 pl-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block truncate">
              {cartItems.length} {language === 'bn' ? 'টি পণ্য' : 'items'}
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-white font-mono leading-none">
              ₹{cartGrandTotal.toFixed(0)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {mobileTab === 'catalog' && (
              <button
                type="button"
                onClick={() => setMobileTab('cart')}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-blue-600" />
                <span>{language === 'bn' ? 'কার্ট' : 'Cart'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleGenerateBillClick}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 active:scale-98 transition-transform"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'বিল করুন' : 'Checkout'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* NEW CUSTOMER MODAL */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">
              {language === 'bn' ? 'নতুন ক্রেতা যুক্ত করুন' : 'Add New Customer'}
            </h3>
            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <input
                type="text"
                required
                value={newCustName}
                onChange={(e) => setNewCustName(e.target.value)}
                placeholder="Customer Name (e.g. Priya Sharma)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
              <input
                type="tel"
                required
                value={newCustPhone}
                onChange={(e) => setNewCustPhone(e.target.value)}
                placeholder="Mobile Number (e.g. 9845012345)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors"
                >
                  {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Customer'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANUAL ITEM MODAL */}
      {manualAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">
              {language === 'bn' ? 'কাস্টম পণ্য যোগ করুন' : 'Add Custom Manual Item'}
            </h3>
            <form onSubmit={handleAddManualCustomItem} className="space-y-3">
              <input
                type="text"
                required
                value={customItemName}
                onChange={(e) => setCustomItemName(e.target.value)}
                placeholder="Item Name (e.g. Special Sweet Box)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
              <input
                type="number"
                required
                step="0.5"
                value={customItemPrice}
                onChange={(e) => setCustomItemPrice(e.target.value)}
                placeholder="Price (₹)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors"
                >
                  {language === 'bn' ? 'কার্টে যুক্ত করুন' : 'Add to Bill'}
                </button>
                <button
                  type="button"
                  onClick={() => setManualAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL WITH DYNAMIC UPI QR */}
      {showPaymentModal && activeBill && (
        <PaymentModal
          bill={activeBill}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={() => {
            // Handled in context
          }}
          onViewInvoice={(bill) => {
            setShowPaymentModal(false);
            setShowInvoiceModal(true);
          }}
        />
      )}

      {/* INVOICE MODAL */}
      {showInvoiceModal && activeBill && (
        <InvoiceModal
          bill={activeBill}
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
    </div>
  );
}
