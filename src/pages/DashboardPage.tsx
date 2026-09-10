import { useState } from 'react';
import { 
  TrendingUp, 
  ReceiptText, 
  Users, 
  Package, 
  Barcode, 
  Plus, 
  ArrowRight, 
  Clock, 
  ChevronRight, 
  AlertTriangle,
  QrCode,
  FileText,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Bill } from '../types';
import { InvoiceModal } from '../components/invoice/InvoiceModal';
import { BrandLogo } from '../components/common/BrandLogo';

const LOGO_PRESETS: Record<string, { emoji: string; bg: string }> = {
  grocery: { emoji: '🛒', bg: 'bg-emerald-500' },
  general: { emoji: '🏪', bg: 'bg-blue-600' },
  garments: { emoji: '👕', bg: 'bg-purple-600' },
  mobile: { emoji: '📱', bg: 'bg-amber-500' },
  pharmacy: { emoji: '💊', bg: 'bg-rose-500' },
  restaurant: { emoji: '🍽️', bg: 'bg-orange-500' },
  sweets: { emoji: '🥐', bg: 'bg-yellow-600' },
  billkart: { emoji: '⚡', bg: 'bg-red-600' },
};

export function DashboardPage() {
  const { 
    bills, 
    products, 
    customers, 
    business, 
    user,
    setCurrentView, 
    openScanner,
    language 
  } = useApp();

  const [selectedInvoice, setSelectedInvoice] = useState<Bill | null>(null);

  const isBn = language === 'bn';

  // Compute live statistics for today
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBills = bills.filter(b => b.date === todayStr);
  const todaySales = todayBills.reduce((acc, b) => acc + b.grandTotal, 0);
  const upiSales = todayBills.filter(b => b.paymentMethod === 'UPI').reduce((acc, b) => acc + b.grandTotal, 0);
  const cashSales = todayBills.filter(b => b.paymentMethod === 'CASH').reduce((acc, b) => acc + b.grandTotal, 0);
  const lowStockCount = products.filter(p => p.stock <= p.minStockAlert).length;

  const shopPreset = business.logoUrl ? LOGO_PRESETS[business.logoUrl] : null;

  return (
    <div className="p-3 space-y-3 select-none pb-24 max-w-md mx-auto w-full">
      
      {/* ─────────────────────────────────────────────────────────────
          1. COMPACT SHOP HEADER & VERIFIED BADGE
      ───────────────────────────────────────────────────────────── */}
      <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Shop Avatar */}
          <div className="shrink-0">
            {shopPreset ? (
              <div className={`w-10 h-10 rounded-xl ${shopPreset.bg} text-white flex items-center justify-center text-xl shadow-xs`}>
                {shopPreset.emoji}
              </div>
            ) : (
              <BrandLogo variant="icon" size="sm" />
            )}
          </div>

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-black text-slate-900 dark:text-white truncate font-display">
                {business.shopName || 'আমার দোকান'}
              </h2>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
              <span>{business.ownerName || user.name || (isBn ? 'দোকানদার' : 'Merchant')}</span>
              {business.city && <span>• {business.city}</span>}
            </p>
          </div>
        </div>

        {/* Quick Online / POS Active Badge */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
          <CheckCircle2 className="w-3 h-3" />
          <span>{isBn ? 'সক্রিয় কাউন্টার' : 'POS Active'}</span>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. TODAY'S SALES OVERVIEW CARD (আজকের বিক্রি সারাংশ)
      ───────────────────────────────────────────────────────────── */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-md space-y-3 relative overflow-hidden">
        {/* Background glow decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>{isBn ? 'আজকের মোট বিক্রি' : "Today's Sales"}</span>
          </span>
          <span className="text-[10px] font-mono font-bold bg-white/10 px-2 py-0.5 rounded-md text-slate-200">
            {todayBills.length} {isBn ? 'টি বিল' : 'bills'}
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <div className="text-2xl font-black font-mono tracking-tight text-white">
            ₹{todaySales.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <span>● {todayBills.length > 0 ? (isBn ? 'লাইভ আপডেট' : 'Live') : (isBn ? 'প্রথম বিল বাকি' : 'Ready')}</span>
          </div>
        </div>

        {/* Cash vs UPI mini chips */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
          <div className="p-1.5 rounded-xl bg-white/5 flex items-center justify-between">
            <span className="text-[10px] text-slate-300">{isBn ? 'নগদ (Cash):' : 'Cash:'}</span>
            <span className="font-mono font-bold text-slate-100">₹{cashSales.toFixed(0)}</span>
          </div>
          <div className="p-1.5 rounded-xl bg-white/5 flex items-center justify-between">
            <span className="text-[10px] text-slate-300">{isBn ? 'অনলাইন (UPI):' : 'UPI:'}</span>
            <span className="font-mono font-bold text-emerald-300">₹{upiSales.toFixed(0)}</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. PRIMARY POS ACTION (সবচেয়ে জরুরি বোতাম: নতুন বিল)
      ───────────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setCurrentView('create-bill')}
        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 active:scale-98 text-white font-black text-sm shadow-md transition-all flex items-center justify-between group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shadow-2xs">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <div className="text-xs font-black leading-tight">
              {isBn ? 'নতুন ক্যাশ মেমো / বিল তৈরি করুন' : 'Create New Cash Memo'}
            </div>
            <div className="text-[10px] text-blue-100 font-normal">
              {isBn ? 'কাস্টমার নাম, বারকোড স্ক্যান ও ইনস্ট্যান্ট বিল' : 'Customer info, scan & print'}
            </div>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* ─────────────────────────────────────────────────────────────
          4. COMPACT 6-TILE NATIVE MOBILE APP GRID
      ───────────────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1 uppercase tracking-wider">
          {isBn ? 'দ্রুত কাজের মেনু' : 'Quick Actions'}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Tile 1: Create Bill */}
          <button
            type="button"
            onClick={() => setCurrentView('create-bill')}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 shadow-2xs flex flex-col items-center gap-1.5 transition-all active:scale-95 text-center"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <ReceiptText className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
              {isBn ? 'নতুন বিল' : 'New Bill'}
            </span>
          </button>

          {/* Tile 2: Barcode Scanner */}
          <button
            type="button"
            onClick={openScanner}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 shadow-2xs flex flex-col items-center gap-1.5 transition-all active:scale-95 text-center"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Barcode className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
              {isBn ? 'স্ক্যানার' : 'Scanner'}
            </span>
          </button>

          {/* Tile 3: Products & Stock (Stock moved here cleanly) */}
          <button
            type="button"
            onClick={() => setCurrentView('products')}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 shadow-2xs flex flex-col items-center gap-1.5 transition-all active:scale-95 text-center relative"
          >
            {lowStockCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
              {isBn ? 'পণ্য ও স্টক' : 'Stock & Items'}
            </span>
          </button>

          {/* Tile 4: Customers Directory */}
          <button
            type="button"
            onClick={() => setCurrentView('customers')}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 shadow-2xs flex flex-col items-center gap-1.5 transition-all active:scale-95 text-center"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
              {isBn ? 'খরিদ্দার খাতা' : 'Customers'}
            </span>
          </button>

          {/* Tile 5: Bills History */}
          <button
            type="button"
            onClick={() => setCurrentView('bills')}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 shadow-2xs flex flex-col items-center gap-1.5 transition-all active:scale-95 text-center"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
              {isBn ? 'বিল খাতা' : 'History'}
            </span>
          </button>

          {/* Tile 6: Reports & Profits */}
          <button
            type="button"
            onClick={() => setCurrentView('reports')}
            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 shadow-2xs flex flex-col items-center gap-1.5 transition-all active:scale-95 text-center"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-900 dark:text-white leading-tight">
              {isBn ? 'হিসাব ও লাভ' : 'Reports'}
            </span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. RECENT SALES (সাম্প্রতিক বিক্রি - কম্প্যাক্ট লিস্ট)
      ───────────────────────────────────────────────────────────── */}
      <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{isBn ? 'সাম্প্রতিক বিক্রি' : 'Recent Bills'}</span>
          </span>

          <button
            type="button"
            onClick={() => setCurrentView('bills')}
            className="text-[11px] text-blue-600 font-bold flex items-center gap-0.5 hover:underline"
          >
            <span>{isBn ? 'সব দেখুন' : 'View all'}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {bills.length === 0 ? (
          <div className="py-5 text-center space-y-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isBn ? 'আজ এখনও কোনো বিল তৈরি হয়নি' : 'No bills generated yet today'}
            </p>
            <button
              type="button"
              onClick={() => setCurrentView('create-bill')}
              className="text-xs text-blue-600 font-bold"
            >
              {isBn ? '+ প্রথম বিল বানান' : '+ Make first bill'}
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            {bills.slice(0, 3).map((bill) => (
              <div
                key={bill.id}
                onClick={() => setSelectedInvoice(bill)}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-100 dark:border-slate-800/80 transition-all flex items-center justify-between gap-2 cursor-pointer active:scale-98"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {bill.customerName}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono font-bold">
                      {bill.paymentMethod}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    #{bill.billNumber} • {bill.time}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400">
                    ₹{bill.grandTotal.toFixed(0)}
                  </div>
                  <span className="text-[9px] text-blue-600 font-semibold block">
                    {isBn ? 'মেমো ➔' : 'View ➔'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoice Modal for Quick View */}
      {selectedInvoice && (
        <InvoiceModal
          bill={selectedInvoice}
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

    </div>
  );
}
