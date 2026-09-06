import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { 
  Barcode, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  User, 
  UserPlus, 
  Percent, 
  Sparkles, 
  Receipt, 
  ShoppingBag, 
  RotateCcw, 
  Tag, 
  Check, 
  ArrowRight,
  Package
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Customer, Product } from '../types';
import { PaymentModal } from '../components/payment/PaymentModal';
import { InvoiceModal } from '../components/invoice/InvoiceModal';
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
    generateBill,
    activeBill,
    openScanner
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

  // Filter products for quick-add list
  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      p.barcode.includes(productSearchQuery.trim());
    return matchesCat && matchesSearch;
  });

  const handleCreateCustomer = (e: FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim()) return;
    const added = addCustomer({
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
    });
    setActiveCustomer(added);
    setShowAddCustomerModal(false);
    setNewCustName('');
    setNewCustPhone('');
  };

  const handleAddManualCustomItem = (e: FormEvent) => {
    e.preventDefault();
    if (!customItemName.trim() || !customItemPrice) return;
    const manualProd: Product = {
      id: 'custom-' + Date.now(),
      name: customItemName.trim(),
      barcode: 'MANUAL-' + Math.floor(1000 + Math.random() * 9000),
      category: 'General',
      price: parseFloat(customItemPrice) || 10,
      stock: 99,
      minStockAlert: 0,
      unit: 'item',
    };
    addToCart(manualProd, 1);
    playBarcodeScanSuccess();
    setManualAddModal(false);
    setCustomItemName('');
    setCustomItemPrice('');
  };

  const handleGenerateBillClick = () => {
    if (cartItems.length === 0) return;
    playBillGenerateSound();
    const bill = generateBill('UPI', 'PENDING');
    setShowPaymentModal(true);
  };

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = productSearchQuery.trim();
      if (!query) return;
      const found = products.find(
        p => p.barcode.toLowerCase() === query.toLowerCase() || p.name.toLowerCase() === query.toLowerCase()
      );
      if (found) {
        addToCart(found, 1);
        playBarcodeScanSuccess();
        setProductSearchQuery('');
      } else {
        playBarcodeScanError();
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5 select-none pb-24 lg:pb-8">
      {/* Top Customer Bar & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Customer Selector Card */}
        <div className="p-4 rounded-3xl bg-[#140F18] border border-white/10 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#FF4A6B]">
              <User className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Customer Details</span>
            </div>
            <button
              type="button"
              onClick={() => setShowAddCustomerModal(true)}
              className="text-[11px] font-bold text-[#FFA000] hover:underline flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ New</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={activeCustomer.id}
              onChange={(e) => {
                const found = customers.find(c => c.id === e.target.value);
                if (found) setActiveCustomer(found);
              }}
              className="flex-1 px-3 py-2 rounded-xl bg-[#100C14] border border-white/15 text-xs font-semibold text-white focus:outline-none"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#A09CA8] pt-1 border-t border-white/10">
            <span>Customer Phone:</span>
            <span className="font-mono text-white font-semibold">{activeCustomer.phone}</span>
          </div>
        </div>

        {/* Barcode & Search Controls */}
        <div className="lg:col-span-2 p-4 rounded-3xl bg-[#140F18] border border-white/10 flex flex-col justify-between gap-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF4A6B]" />
              <input
                type="text"
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search products by name or scan barcode (press Enter)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#100C14] border border-white/15 text-xs text-white placeholder-[#A09CA8]/60 focus:outline-none focus:border-[#FF1E42]"
              />
              {productSearchQuery && (
                <button
                  type="button"
                  onClick={() => setProductSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A09CA8] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Camera Scan Trigger */}
            <button
              type="button"
              onClick={openScanner}
              className="px-4 py-2.5 rounded-2xl btn-primary-gradient text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Barcode className="w-4 h-4" />
              <span>Scan Barcode</span>
            </button>

            {/* Manual Product Add */}
            <button
              type="button"
              onClick={() => setManualAddModal(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-[#1F1422] hover:bg-[#FF1E42]/20 border border-white/10 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4 text-[#FF4A6B]" />
              <span className="hidden sm:inline">Manual Item</span>
            </button>
          </div>

          {/* Quick Categories Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'btn-primary-gradient text-white font-bold shadow-sm'
                    : 'bg-[#1F1422] text-[#A09CA8] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Billing Grid: Cart Table + Quick Product Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Current Cart / Bill Items (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-[#140F18] border border-white/10 shadow-xl flex-1 flex flex-col">
            {/* Table Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#FFA000]" />
                <h3 className="font-bold text-sm text-white font-display">
                  Current Bill Items ({cartItems.length})
                </h3>
              </div>
              {cartItems.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[11px] font-semibold text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto max-h-[420px] py-2 space-y-2.5 pr-1">
              {cartItems.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <Package className="w-12 h-12 text-[#FF1E42]/40 mx-auto" />
                  <p className="text-sm font-semibold text-white">Bill is currently empty</p>
                  <p className="text-xs text-[#A09CA8] max-w-xs mx-auto">
                    Click "Scan Barcode" or pick from the product list on the right to start adding items.
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-[#100C14] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-[#FF1E42]/50 transition-colors"
                  >
                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-[#A09CA8] font-mono flex items-center gap-2 mt-0.5">
                        <span>Code: {item.barcode}</span>
                        <span>•</span>
                        <span className="text-[#FF4A6B]">Unit: {item.unit}</span>
                      </p>
                    </div>

                    {/* Quantity Controls: [-] qty [+] */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-[#1F1422] rounded-xl border border-white/10 p-0.5">
                        <button
                          type="button"
                          onClick={() => updateCartItemQty(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-[#100C14] hover:bg-red-500/20 text-[#A09CA8] hover:text-red-400 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-extrabold text-white font-mono">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartItemQty(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-[#100C14] hover:bg-[#FF1E42]/30 text-[#A09CA8] hover:text-[#FFA000] flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Editable Price Input */}
                      <div className="flex items-center gap-1 w-20">
                        <span className="text-[11px] text-[#A09CA8]">₹</span>
                        <input
                          type="number"
                          step="0.5"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateCartItemPrice(item.id, parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-2 py-1 rounded-lg bg-[#1F1422] border border-white/10 text-xs font-mono font-bold text-white text-right focus:outline-none"
                        />
                      </div>

                      {/* Item Total */}
                      <div className="w-20 text-right font-bold text-xs text-[#FFA000] font-mono">
                        ₹{item.total.toFixed(2)}
                      </div>

                      {/* Delete Item Button */}
                      <button
                        type="button"
                        onClick={() => removeCartItem(item.id)}
                        className="p-1.5 rounded-lg text-[#A09CA8] hover:text-red-400 hover:bg-red-500/10 transition-colors"
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

        {/* Right Column: Instant Totals & Quick Catalog (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Bill Summary Card */}
          <div className="p-5 rounded-3xl bg-[#140F18] border border-white/10 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-white font-display pb-2 border-b border-white/10">
              Bill Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-[#A09CA8]">
                <span>Items Subtotal:</span>
                <span className="font-mono font-bold text-white">
                  ₹{cartSubtotal.toFixed(2)}
                </span>
              </div>

              {/* Discount Selector */}
              <div className="flex items-center justify-between text-[#A09CA8]">
                <div className="flex items-center gap-1.5">
                  <span>Bill Discount:</span>
                  <div className="flex gap-1">
                    {[0, 5, 10].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setCartDiscount(d)}
                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                          cartDiscount === d
                            ? 'btn-primary-gradient text-white'
                            : 'bg-[#1F1422] text-[#A09CA8]'
                        }`}
                      >
                        {d}%
                      </button>
                    ))}
                  </div>
                </div>
                <span className="font-mono text-[#FF4A6B]">
                  -₹{cartDiscountAmount.toFixed(2)}
                </span>
              </div>

              {/* GST Selector */}
              <div className="flex items-center justify-between text-[#A09CA8]">
                <div className="flex items-center gap-1.5">
                  <span>GST Tax:</span>
                  <div className="flex gap-1">
                    {[0, 5, 12, 18].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setCartGst(g)}
                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                          cartGst === g
                            ? 'btn-primary-gradient text-white'
                            : 'bg-[#1F1422] text-[#A09CA8]'
                        }`}
                      >
                        {g}%
                      </button>
                    ))}
                  </div>
                </div>
                <span className="font-mono text-white">
                  +₹{cartGstAmount.toFixed(2)}
                </span>
              </div>

              {/* Grand Total Box */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#A09CA8] block">
                    Grand Total
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-white font-display">
                    ₹{cartGrandTotal.toFixed(2)}
                  </span>
                </div>

                <span className="text-[11px] font-mono font-bold bg-[#1F1422] text-[#FFA000] px-3 py-1.5 rounded-xl border border-white/10">
                  {cartItems.length} Products
                </span>
              </div>
            </div>

            {/* Generate Bill Button */}
            <button
              type="button"
              disabled={cartItems.length === 0}
              onClick={handleGenerateBillClick}
              className={`w-full py-4 rounded-2xl font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2 ${
                cartItems.length > 0
                  ? 'btn-primary-gradient text-white shadow-[0_8px_25px_rgba(255,30,66,0.4)] hover:brightness-110'
                  : 'bg-[#1F1422] text-[#A09CA8] cursor-not-allowed'
              }`}
            >
              <Receipt className="w-5 h-5" />
              <span>Generate Bill & Collect Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Product Tap Shelf */}
          <div className="p-4 rounded-3xl bg-[#140F18] border border-white/10 space-y-3">
            <span className="text-xs font-bold text-[#FFA000] uppercase tracking-wider block">
              Quick Tap Products ({filteredProducts.length})
            </span>
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {filteredProducts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    addToCart(p, 1);
                    playBarcodeScanSuccess();
                  }}
                  className="p-2.5 rounded-xl bg-[#100C14] hover:bg-[#1F1422] border border-white/10 hover:border-[#FF1E42]/60 text-left transition-all group"
                >
                  <p className="text-xs font-bold text-white truncate group-hover:text-[#FFA000]">
                    {p.name}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className="font-extrabold text-[#FFA000]">₹{p.price}</span>
                    <span className="text-[10px] text-[#A09CA8]">Stock: {p.stock}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* NEW CUSTOMER MODAL */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-[#140F18] border border-white/10 rounded-3xl p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-white">Add New Customer</h3>
            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <input
                type="text"
                required
                value={newCustName}
                onChange={(e) => setNewCustName(e.target.value)}
                placeholder="Customer Name (e.g. Priya Sharma)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#100C14] border border-white/15 text-xs text-white focus:outline-none"
              />
              <input
                type="tel"
                required
                value={newCustPhone}
                onChange={(e) => setNewCustPhone(e.target.value)}
                placeholder="Mobile Number (e.g. 9845012345)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#100C14] border border-white/15 text-xs text-white focus:outline-none"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl btn-primary-gradient text-white font-bold text-xs"
                >
                  Save Customer
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#1F1422] text-[#A09CA8] text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANUAL ITEM MODAL */}
      {manualAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-[#140F18] border border-white/10 rounded-3xl p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-white">Add Custom Manual Item</h3>
            <form onSubmit={handleAddManualCustomItem} className="space-y-3">
              <input
                type="text"
                required
                value={customItemName}
                onChange={(e) => setCustomItemName(e.target.value)}
                placeholder="Item Name (e.g. Special Sweet Box)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#100C14] border border-white/15 text-xs text-white focus:outline-none"
              />
              <input
                type="number"
                required
                step="0.5"
                value={customItemPrice}
                onChange={(e) => setCustomItemPrice(e.target.value)}
                placeholder="Price (₹)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#100C14] border border-white/15 text-xs text-white focus:outline-none"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl btn-primary-gradient text-white font-bold text-xs"
                >
                  Add to Current Bill
                </button>
                <button
                  type="button"
                  onClick={() => setManualAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#1F1422] text-[#A09CA8] text-xs font-semibold"
                >
                  Cancel
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
            // Updated in context
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
