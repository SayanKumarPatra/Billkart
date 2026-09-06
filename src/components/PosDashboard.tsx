import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  RotateCcw, 
  Barcode, 
  ShoppingCart, 
  Receipt, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  QrCode, 
  CheckCircle2, 
  Search,
  Sparkles,
  TrendingUp,
  Store
} from 'lucide-react';
import { BillKartLogo } from './BillKartLogo';
import { playBarcodeScanSuccess, playPaymentSuccessSound } from '../utils/soundEffects';

interface PosDashboardProps {
  onReplaySplash: () => void;
}

interface CartItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  qty: number;
  category: string;
}

const SAMPLE_ITEMS: CartItem[] = [
  { id: '1', name: 'Organic Almond Milk 1L', sku: '89012345678', price: 4.50, qty: 2, category: 'Dairy' },
  { id: '2', name: 'Artisan Sourdough Loaf', sku: '89012345679', price: 5.20, qty: 1, category: 'Bakery' },
  { id: '3', name: 'Dark Roast Espresso Beans 250g', sku: '89012345680', price: 12.00, qty: 1, category: 'Beverages' },
];

export function PosDashboard({ onReplaySplash }: PosDashboardProps) {
  const [items, setItems] = useState<CartItem[]>(SAMPLE_ITEMS);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleScan = (e: FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    playBarcodeScanSuccess();
    const newItem: CartItem = {
      id: Date.now().toString(),
      name: `Scanned Item #${barcodeInput.slice(-4) || '7721'}`,
      sku: barcodeInput,
      price: Math.floor(Math.random() * 8 + 3) + 0.99,
      qty: 1,
      category: 'Smart POS',
    };
    setItems((prev) => [newItem, ...prev]);
    setBarcodeInput('');
  };

  const handleCheckout = () => {
    playPaymentSuccessSound();
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setItems([]);
    }, 2800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen w-full bg-[#070709] text-white flex flex-col font-sans selection:bg-[#FF1E42]/30"
    >
      {/* Top POS Navigation Bar */}
      <header className="h-16 px-4 md:px-8 border-b border-white/10 bg-[#140F18]/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <BillKartLogo size="sm" showTagline={false} showScript={false} animate={false} />
          <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-white/10 text-xs text-[#A09CA8]">
            <Store className="w-3.5 h-3.5 text-[#FFA000]" />
            <span className="font-medium text-white">Express Store #104</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF1E42] animate-pulse" />
            <span className="text-[#FF4A6B]">Live Terminal</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Replay Preloader Button */}
          <button
            id="replay-splash-button"
            type="button"
            onClick={onReplaySplash}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1F1422] hover:bg-[#FF1E42]/20 border border-white/10 text-xs font-semibold text-[#FFA000] hover:text-white shadow-sm transition-all duration-200 group"
          >
            <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-90 transition-transform" />
            <span>Replay Splash Screen</span>
          </button>
        </div>
      </header>

      {/* Main POS Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Scanner, Search & Quick Catalog */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Barcode Scanner Bar */}
          <div className="p-4 rounded-2xl bg-[#140F18] border border-white/10 shadow-md">
            <form onSubmit={handleScan} className="flex gap-2.5">
              <div className="relative flex-1">
                <Barcode className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#FF4A6B]" />
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Scan barcode or type SKU (e.g. 8901234)..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#100C14] border border-white/15 text-sm text-white placeholder-[#A09CA8]/60 focus:outline-none focus:border-[#FF1E42] transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl btn-primary-gradient text-white font-bold text-sm shadow-[0_4px_15px_rgba(255,30,66,0.35)] transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </form>
          </div>

          {/* Quick Item Category Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { title: "Today's Sales", val: "₹1,842.50", icon: TrendingUp },
              { title: 'Invoices Done', val: '48 Bills', icon: Receipt },
              { title: 'Barcode Rate', val: '0.4s Fast', icon: Barcode },
              { title: 'Sync Status', val: 'Cloud Active', icon: Sparkles },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#140F18] border border-white/10 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between text-[#A09CA8] mb-1">
                    <span className="text-xs">{stat.title}</span>
                    <Icon className="w-3.5 h-3.5 text-[#FFA000]" />
                  </div>
                  <p className="text-base font-bold font-display text-white">{stat.val}</p>
                </div>
              );
            })}
          </div>

          {/* Active Cart Item Table */}
          <div className="flex-1 p-4 rounded-2xl bg-[#140F18] border border-white/10 shadow-md flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <h3 className="font-bold text-sm md:text-base flex items-center gap-2 text-white">
                <ShoppingCart className="w-4 h-4 text-[#FF1E42]" />
                Current Invoice ({items.reduce((s, i) => s + i.qty, 0)} items)
              </h3>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={() => setItems([])}
                  className="text-xs text-[#A09CA8] hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear Cart
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[360px] pr-1">
              {items.length === 0 ? (
                <div className="h-44 flex flex-col items-center justify-center text-[#A09CA8] text-center">
                  <Receipt className="w-10 h-10 text-[#FF1E42]/30 mb-2" />
                  <p className="text-sm font-medium">Cart is currently empty</p>
                  <p className="text-xs text-[#A09CA8]/70 mt-0.5">Scan a barcode or add an item above</p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#1F1422] border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                      <p className="text-xs text-[#A09CA8] font-mono">
                        SKU: {item.sku} • ₹{item.price.toFixed(2)} each
                      </p>
                    </div>

                    {/* Qty Stepper */}
                    <div className="flex items-center gap-2 bg-[#100C14] px-2 py-1 rounded-lg border border-white/10">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, -1)}
                        className="text-[#A09CA8] hover:text-white transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold w-5 text-center">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, 1)}
                        className="text-[#A09CA8] hover:text-[#FFA000] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[65px]">
                      <p className="text-sm font-bold font-display text-[#FFA000]">
                        ₹{(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Smart Billing & Payment Terminal */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="p-5 rounded-2xl bg-[#140F18] border border-white/10 shadow-lg flex flex-col">
            <h3 className="font-bold text-base text-white mb-4 flex items-center justify-between">
              <span>Checkout Summary</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-[#1F1422] text-[#FFA000] border border-white/10">
                AUTO-TAX GST 8%
              </span>
            </h3>

            <div className="space-y-2.5 text-sm pb-4 border-b border-white/10">
              <div className="flex justify-between text-[#A09CA8]">
                <span>Subtotal</span>
                <span className="font-medium text-white">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#A09CA8]">
                <span>Estimated Tax (8%)</span>
                <span className="font-medium text-white">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#FFA000]">
                <span>Member Promo Applied</span>
                <span className="font-medium">-₹0.00</span>
              </div>
            </div>

            <div className="py-4 flex justify-between items-baseline">
              <span className="text-sm font-semibold text-[#A09CA8]">Total Amount Due</span>
              <span className="text-3xl font-extrabold font-display text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF1E42] to-[#FFA000]">
                ₹{total.toFixed(2)}
              </span>
            </div>

            {/* Payment Options */}
            <div className="grid grid-cols-3 gap-2.5 my-3">
              <button
                type="button"
                className="p-3 rounded-xl bg-[#1F1422] hover:bg-[#FF1E42]/20 border border-white/10 flex flex-col items-center gap-1.5 transition-all group"
              >
                <QrCode className="w-5 h-5 text-[#FF4A6B] group-hover:text-[#FFA000]" />
                <span className="text-xs font-medium text-white">UPI / QR</span>
              </button>
              <button
                type="button"
                className="p-3 rounded-xl bg-[#1F1422] hover:bg-[#FF1E42]/20 border border-white/10 flex flex-col items-center gap-1.5 transition-all group"
              >
                <CreditCard className="w-5 h-5 text-[#FF4A6B] group-hover:text-[#FFA000]" />
                <span className="text-xs font-medium text-white">Card POS</span>
              </button>
              <button
                type="button"
                className="p-3 rounded-xl bg-[#1F1422] hover:bg-[#FF1E42]/20 border border-white/10 flex flex-col items-center gap-1.5 transition-all group"
              >
                <Banknote className="w-5 h-5 text-[#FF4A6B] group-hover:text-[#FFA000]" />
                <span className="text-xs font-medium text-white">Cash</span>
              </button>
            </div>

            {/* Instant Bill Generator Button */}
            <button
              id="complete-billing-btn"
              type="button"
              disabled={items.length === 0}
              onClick={handleCheckout}
              className="mt-2 w-full py-3.5 rounded-xl btn-primary-gradient text-white font-extrabold text-base tracking-wide hover:brightness-110 shadow-[0_6px_25px_rgba(255,30,66,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <Receipt className="w-5 h-5" />
              <span>Charge & Print Smart Bill</span>
            </button>

            {/* Success Banner */}
            {paymentSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 rounded-xl bg-[#FF1E42]/15 border border-[#FF1E42]/40 flex items-center gap-2.5 text-xs text-[#FF4A6B] font-semibold"
              >
                <CheckCircle2 className="w-4 h-4 text-[#FFA000]" />
                <span>Invoice printed & customer notified via WhatsApp SMS!</span>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </motion.div>
  );
}
