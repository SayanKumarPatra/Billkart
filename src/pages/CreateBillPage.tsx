import { useState, type FormEvent } from 'react';
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
    setManualAddModal(false);
    setCustomItemName('');
    setCustomItemPrice('');
  };

  const handleGenerateBillClick = () => {
    if (cartItems.length === 0) return;
    const bill = generateBill('UPI', 'PENDING');
    setShowPaymentModal(true);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-5 select-none pb-24 lg:pb-8">
      {/* Top Customer Bar & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Customer Selector Card */}
        <div className="p-4 rounded-3xl bg-[#0B2822] border border-[#19D66B]/25 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#57E39B]">
              <User className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Customer Details</span>
            </div>
            <button
              type="button"
              onClick={() => setShowAddCustomerModal(true)}
              className="text-[11px] font-bold text-[#B8F500] hover:underline flex items-center gap-1"
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
              className="flex-1 px-3 py-2 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs font-semibold text-[#F5F7F6] focus:outline-none"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#A9B8B3] pt-1 border-t border-[#19D66B]/15">
            <span>Customer Phone:</span>
            <span className="font-mono text-[#F5F7F6] font-semibold">{activeCustomer.phone}</span>
          </div>
        </div>

        {/* Barcode & Search Controls */}
        <div className="lg:col-span-2 p-4 rounded-3xl bg-[#0B2822] border border-[#19D66B]/25 flex flex-col justify-between gap-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57E39B]" />
              <input
                type="text"
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
                placeholder="Search products by name or scan barcode..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] placeholder-[#A9B8B3]/60 focus:outline-none"
              />
              {productSearchQuery && (
                <button
                  type="button"
                  onClick={() => setProductSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A9B8B3] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Camera Scan Trigger */}
            <button
              type="button"
              onClick={openScanner}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#19D66B] to-[#B8F500] text-[#061B16] font-extrabold text-xs shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Barcode className="w-4 h-4" />
              <span>Scan Barcode</span>
            </button>

            {/* Manual Product Add */}
            <button
              type="button"
              onClick={() => setManualAddModal(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-[#10352D] hover:bg-[#19D66B]/20 border border-[#19D66B]/30 text-[#F5F7F6] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4 text-[#57E39B]" />
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
                    ? 'bg-[#19D66B] text-[#061B16] font-bold shadow-sm'
                    : 'bg-[#10352D] text-[#A9B8B3] hover:text-[#F5F7F6]'
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
          <div className="p-4 sm:p-5 rounded-3xl bg-[#0B2822] border border-[#19D66B]/25 shadow-xl flex-1 flex flex-col">
            {/* Table Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#19D66B]/15">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#B8F500]" />
                <h3 className="font-bold text-sm text-[#F5F7F6] font-display">
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
                  <Package className="w-12 h-12 text-[#19D66B]/40 mx-auto" />
                  <p className="text-sm font-semibold text-[#F5F7F6]">Bill is currently empty</p>
                  <p className="text-xs text-[#A9B8B3] max-w-xs mx-auto">
                    Click "Scan Barcode" or pick from the product list on the right to start adding items.
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-[#061B16] border border-[#19D66B]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:border-[#19D66B]/50 transition-colors"
                  >
                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#F5F7F6] truncate">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-[#A9B8B3] font-mono flex items-center gap-2 mt-0.5">
                        <span>Code: {item.barcode}</span>
                        <span>•</span>
                        <span className="text-[#57E39B]">Unit: {item.unit}</span>
                      </p>
                    </div>

                    {/* Quantity Controls: [-] qty [+] */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-[#10352D] rounded-xl border border-[#19D66B]/30 p-0.5">
                        <button
                          type="button"
                          onClick={() => updateCartItemQty(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-[#061B16] hover:bg-red-500/20 text-[#A9B8B3] hover:text-red-400 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-extrabold text-[#F5F7F6] font-mono">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartItemQty(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-[#061B16] hover:bg-[#19D66B]/30 text-[#A9B8B3] hover:text-[#B8F500] flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Editable Price Input */}
                      <div className="flex items-center gap-1 w-20">
                        <span className="text-[11px] text-[#A9B8B3]">₹</span>
                        <input
                          type="number"
                          step="0.5"
                          value={item.unitPrice}
                          onChange={(e) =>
                            updateCartItemPrice(item.id, parseFloat(e.target.value) || 0)
                          }
                          className="w-full px-2 py-1 rounded-lg bg-[#10352D] border border-[#19D66B]/20 text-xs font-mono font-bold text-[#F5F7F6] text-right focus:outline-none"
                        />
                      </div>

                      {/* Item Total */}
                      <div className="w-20 text-right font-bold text-xs text-[#B8F500] font-mono">
                        ₹{item.total.toFixed(2)}
                      </div>

                      {/* Delete Item Button */}
                      <button
                        type="button"
                        onClick={() => removeCartItem(item.id)}
                        className="p-1.5 rounded-lg text-[#A9B8B3] hover:text-red-400 hover:bg-red-500/10 transition-colors"
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
          <div className="p-5 rounded-3xl bg-[#0B2822] border border-[#19D66B]/30 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-[#F5F7F6] font-display pb-2 border-b border-[#19D66B]/15">
              Bill Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-[#A9B8B3]">
                <span>Items Subtotal:</span>
                <span className="font-mono font-bold text-[#F5F7F6]">
                  ₹{cartSubtotal.toFixed(2)}
                </span>
              </div>

              {/* Discount Selector */}
              <div className="flex items-center justify-between text-[#A9B8B3]">
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
                            ? 'bg-[#19D66B] text-[#061B16]'
                            : 'bg-[#10352D] text-[#A9B8B3]'
                        }`}
                      >
                        {d}%
                      </button>
                    ))}
                  </div>
                </div>
                <span className="font-mono text-[#57E39B]">
                  -₹{cartDiscountAmount.toFixed(2)}
                </span>
              </div>

              {/* GST Selector */}
              <div className="flex items-center justify-between text-[#A9B8B3]">
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
                            ? 'bg-[#19D66B] text-[#061B16]'
                            : 'bg-[#10352D] text-[#A9B8B3]'
                        }`}
                      >
                        {g}%
                      </button>
                    ))}
                  </div>
                </div>
                <span className="font-mono text-[#F5F7F6]">
                  +₹{cartGstAmount.toFixed(2)}
                </span>
              </div>

              {/* Grand Total Box */}
              <div className="pt-3 border-t border-[#19D66B]/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#A9B8B3] block">
                    Grand Total
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-[#F5F7F6] font-display">
                    ₹{cartGrandTotal.toFixed(2)}
                  </span>
                </div>

                <span className="text-[11px] font-mono font-bold bg-[#10352D] text-[#B8F500] px-3 py-1.5 rounded-xl border border-[#19D66B]/30">
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
                  ? 'bg-gradient-to-r from-[#19D66B] via-[#57E39B] to-[#B8F500] text-[#061B16] hover:brightness-110 shadow-[0_8px_25px_rgba(25,214,107,0.4)]'
                  : 'bg-[#10352D] text-[#A9B8B3] cursor-not-allowed'
              }`}
            >
              <Receipt className="w-5 h-5" />
              <span>Generate Bill & Collect Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Product Tap Shelf */}
          <div className="p-4 rounded-3xl bg-[#0B2822] border border-[#19D66B]/20 space-y-3">
            <span className="text-xs font-bold text-[#57E39B] uppercase tracking-wider block">
              Quick Tap Products ({filteredProducts.length})
            </span>
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {filteredProducts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => addToCart(p, 1)}
                  className="p-2.5 rounded-xl bg-[#061B16] hover:bg-[#10352D] border border-[#19D66B]/20 hover:border-[#19D66B]/60 text-left transition-all group"
                >
                  <p className="text-xs font-bold text-[#F5F7F6] truncate group-hover:text-[#B8F500]">
                    {p.name}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className="font-extrabold text-[#57E39B]">₹{p.price}</span>
                    <span className="text-[10px] text-[#A9B8B3]">Stock: {p.stock}</span>
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
          <div className="w-full max-w-sm bg-[#0B2822] border border-[#19D66B]/30 rounded-3xl p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-[#F5F7F6]">Add New Customer</h3>
            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <input
                type="text"
                required
                value={newCustName}
                onChange={(e) => setNewCustName(e.target.value)}
                placeholder="Customer Name (e.g. Priya Sharma)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] focus:outline-none"
              />
              <input
                type="tel"
                required
                value={newCustPhone}
                onChange={(e) => setNewCustPhone(e.target.value)}
                placeholder="Mobile Number (e.g. 9845012345)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] focus:outline-none"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#19D66B] text-[#061B16] font-bold text-xs"
                >
                  Save Customer
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#10352D] text-[#A9B8B3] text-xs font-semibold"
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
          <div className="w-full max-w-sm bg-[#0B2822] border border-[#19D66B]/30 rounded-3xl p-5 space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-[#F5F7F6]">Add Custom Manual Item</h3>
            <form onSubmit={handleAddManualCustomItem} className="space-y-3">
              <input
                type="text"
                required
                value={customItemName}
                onChange={(e) => setCustomItemName(e.target.value)}
                placeholder="Item Name (e.g. Special Sweet Box)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] focus:outline-none"
              />
              <input
                type="number"
                required
                step="0.5"
                value={customItemPrice}
                onChange={(e) => setCustomItemPrice(e.target.value)}
                placeholder="Price (₹)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] focus:outline-none"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#19D66B] text-[#061B16] font-bold text-xs"
                >
                  Add to Current Bill
                </button>
                <button
                  type="button"
                  onClick={() => setManualAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#10352D] text-[#A9B8B3] text-xs font-semibold"
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
