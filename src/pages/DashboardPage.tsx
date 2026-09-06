import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  ReceiptText, 
  Users, 
  Package, 
  Barcode, 
  PlusCircle, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Bill } from '../types';
import { InvoiceModal } from '../components/invoice/InvoiceModal';

export function DashboardPage() {
  const { 
    bills, 
    products, 
    customers, 
    business, 
    setCurrentView, 
    openScanner 
  } = useApp();

  const [selectedInvoice, setSelectedInvoice] = useState<Bill | null>(null);
  const [chartRange, setChartRange] = useState<'day' | 'week' | 'month'>('week');

  // Compute live statistics
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBills = bills.filter(b => b.date === todayStr);
  const todaySales = todayBills.reduce((acc, b) => acc + b.grandTotal, 0);
  const totalRevenue = bills.reduce((acc, b) => acc + b.grandTotal, 0);
  const lowStockCount = products.filter(p => p.stock <= p.minStockAlert).length;

  // Chart data points
  const weekData = [
    { label: 'Mon', value: 3420 },
    { label: 'Tue', value: 4190 },
    { label: 'Wed', value: 2980 },
    { label: 'Thu', value: 5820 },
    { label: 'Fri', value: 6490 },
    { label: 'Sat', value: 8920 },
    { label: 'Sun', value: 7450 },
  ];
  const maxChartVal = Math.max(...weekData.map(d => d.value));

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 select-none pb-24 lg:pb-8">
      {/* Welcome & Quick Store Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl bg-gradient-to-r from-[#160E18] via-[#24131E] to-[#160E18] border border-white/10 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF1E42] animate-ping" />
            <span className="text-[11px] font-bold text-[#FFA000] uppercase tracking-wider">
              Terminal Live • {business.shopName}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-display text-white">
            Welcome back, {business.ownerName || 'Sayan Kumar Patra'}
          </h2>
          <p className="text-xs text-[#A09CA8]">
            {bills.length} bills generated • Fast barcode scanning and instant UPI QR ready
          </p>
        </div>

        {/* Primary POS Action */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={openScanner}
            className="px-4 py-2.5 rounded-2xl bg-[#1F1422] hover:bg-[#FF1E42]/20 border border-[#FF1E42]/30 text-xs font-bold text-[#FFA000] transition-all flex items-center gap-2"
          >
            <Barcode className="w-4 h-4" />
            <span>Scan Product</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('create-bill')}
            className="px-5 py-2.5 rounded-2xl btn-primary-gradient text-white font-extrabold text-xs shadow-lg transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Bill</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Today's Sales */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#140F18] border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-[#FF4A6B] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A09CA8]">Today's Sales</span>
            <div className="w-8 h-8 rounded-xl bg-[#22131F] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#FFA000]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-display">
            ₹{todaySales.toFixed(2)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#FFA000] mt-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{bills.length > 0 ? '+18.4% vs yesterday' : 'Ready for first sale'}</span>
          </div>
        </div>

        {/* Total Bills */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#140F18] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-[#FF4A6B] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A09CA8]">Total Bills</span>
            <div className="w-8 h-8 rounded-xl bg-[#22131F] flex items-center justify-center">
              <ReceiptText className="w-4 h-4 text-[#FF4A6B]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-display">
            {bills.length}
          </div>
          <div className="text-[11px] text-[#A09CA8] mt-1">
            {bills.filter(b => b.paymentStatus === 'SUCCESS').length} paid successfully
          </div>
        </div>

        {/* Total Customers */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#140F18] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-[#FF4A6B] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A09CA8]">Customers</span>
            <div className="w-8 h-8 rounded-xl bg-[#22131F] flex items-center justify-center">
              <Users className="w-4 h-4 text-[#FF4A6B]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-display">
            {customers.length}
          </div>
          <div className="text-[11px] text-[#FFA000] mt-1 font-semibold">
            {customers.length > 0 ? `${customers.length} registered customers` : '0 registered customers'}
          </div>
        </div>

        {/* Total Products & Low Stock */}
        <div className="p-4 sm:p-5 rounded-3xl bg-[#140F18] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-[#FF4A6B] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A09CA8]">Products</span>
            <div className="w-8 h-8 rounded-xl bg-[#22131F] flex items-center justify-center">
              <Package className="w-4 h-4 text-[#FFA000]" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-display">
            {products.length}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] mt-1">
            {lowStockCount > 0 ? (
              <span className="text-orange-400 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {lowStockCount} items low stock
              </span>
            ) : (
              <span className="text-[#FFA000]">Inventory ready for POS</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Revenue Velocity Chart & Recent Bills */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Sales Chart (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-3xl bg-[#140F18] border border-white/10 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold font-display text-white">
                Revenue Velocity
              </h3>
              <p className="text-xs text-[#A09CA8]">Sales performance overview</p>
            </div>

            <div className="flex rounded-xl bg-[#1A121E] p-1 border border-white/10 text-[11px]">
              {(['day', 'week', 'month'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setChartRange(mode)}
                  className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all ${
                    chartRange === mode
                      ? 'bg-[#27131F] text-[#FFA000] border border-[#FF1E42]/30'
                      : 'text-[#A09CA8]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Clean Custom Bar Visualizer */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {weekData.map((bar, i) => {
              const heightPercent = Math.round((bar.value / maxChartVal) * 100);
              const isHighest = bar.value === maxChartVal;

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-mono text-[#A09CA8] opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{bar.value}
                  </span>
                  <div className="w-full max-w-[36px] bg-[#100C14] rounded-xl overflow-hidden flex flex-col justify-end p-1 h-44">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${heightPercent}%` }}
                      transition={{ duration: 0.8, delay: i * 0.08 }}
                      className={`w-full rounded-lg transition-all ${
                        isHighest
                          ? 'btn-primary-gradient shadow-[0_0_15px_rgba(255,30,66,0.5)]'
                          : 'bg-gradient-to-t from-[#27131F] to-[#FF1E42]/60 group-hover:to-[#FF1E42]'
                      }`}
                    />
                  </div>
                  <span className={`text-[11px] font-bold ${isHighest ? 'text-[#FFA000]' : 'text-[#A09CA8]'}`}>
                    {bar.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#A09CA8]">
            <span>Average Order Value: <strong className="text-white">₹{bills.length > 0 ? (totalRevenue / bills.length).toFixed(2) : '0.00'}</strong></span>
            <span className="text-[#FFA000] font-semibold">UPI Acceptance: Active</span>
          </div>
        </div>

        {/* Right Column: Recent Bills List (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-[#140F18] border border-white/10 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold font-display text-white">
              Recent Bills ({bills.length})
            </h3>
            <button
              type="button"
              onClick={() => setCurrentView('bills')}
              className="text-[11px] font-bold text-[#FFA000] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-white/10 max-h-80 overflow-y-auto pr-1">
            {bills.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <ReceiptText className="w-8 h-8 text-[#A09CA8]/50 mx-auto" />
                <p className="text-xs font-semibold text-white">No bills generated yet</p>
                <p className="text-[11px] text-[#A09CA8]">Create your first bill to record transactions</p>
              </div>
            ) : (
              bills.slice(0, 5).map((bill) => (
                <div
                  key={bill.id}
                  onClick={() => setSelectedInvoice(bill)}
                  className="py-3 flex items-center justify-between hover:bg-[#1E1422]/60 px-2 rounded-xl cursor-pointer transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-white">
                        {bill.billNumber}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                          bill.paymentStatus === 'SUCCESS'
                            ? 'bg-[#FF1E42]/20 text-[#FF4A6B]'
                            : 'bg-orange-500/20 text-orange-400'
                        }`}
                      >
                        {bill.paymentMethod}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#A09CA8] mt-0.5">
                      {bill.customerName} • {bill.time}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-black text-[#FFA000] font-mono">
                      ₹{bill.grandTotal.toFixed(2)}
                    </div>
                    <span className="text-[10px] text-[#FF4A6B] flex items-center justify-end gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Paid</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setCurrentView('create-bill')}
              className="w-full py-2.5 rounded-xl bg-[#1F1422] hover:bg-[#FF1E42]/20 text-xs font-bold text-white hover:text-[#FFA000] border border-[#FF1E42]/30 transition-colors flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-[#FFA000]" />
              <span>Create Bill For Customer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Modal for clicked bills */}
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
