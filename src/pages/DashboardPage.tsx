import { useState } from 'react';
import { 
  TrendingUp, 
  ReceiptText, 
  Users, 
  Package, 
  Barcode, 
  PlusCircle, 
  ArrowUpRight, 
  Clock, 
  ChevronRight, 
  AlertTriangle,
  QrCode,
  Eye
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
    openScanner,
    language,
    t
  } = useApp();

  const [selectedInvoice, setSelectedInvoice] = useState<Bill | null>(null);

  // Compute live statistics
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBills = bills.filter(b => b.date === todayStr);
  const todaySales = todayBills.reduce((acc, b) => acc + b.grandTotal, 0);
  const totalRevenue = bills.reduce((acc, b) => acc + b.grandTotal, 0);
  const lowStockCount = products.filter(p => p.stock <= p.minStockAlert).length;

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 select-none pb-24 lg:pb-8">
      {/* Welcome & Quick Store Header */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {t('posTerminalActive')} • {business.shopName}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
            {language === 'bn' 
              ? `স্বাগতম, ${business.ownerName || 'দোকানদার'}` 
              : `Welcome back, ${business.ownerName || 'Store Owner'}`}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'bn'
              ? `${bills.length}টি বিল তৈরি হয়েছে • বারকোড স্ক্যানার এবং ইউপিআই পেমেন্ট সক্রিয়`
              : `${bills.length} bills generated • Barcode scanner & UPI ready`}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:flex items-center gap-2.5">
          <button
            type="button"
            onClick={openScanner}
            className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <Barcode className="w-4 h-4 text-blue-600" />
            <span>{language === 'bn' ? 'স্ক্যান করুন' : 'Scan'}</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('create-bill')}
            className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন বিল তৈরি' : 'New Bill'}</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Today's Sales */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {t('todaySales')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
            ₹{todaySales.toFixed(0)}
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{bills.length > 0 ? '+18%' : (language === 'bn' ? 'সক্রিয়' : 'Active')}</span>
          </div>
        </div>

        {/* Total Bills */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {t('todayBillsCount')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <ReceiptText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
            {bills.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {bills.filter(b => b.paymentStatus === 'SUCCESS').length} {language === 'bn' ? 'পরিশোধিত বিল' : 'paid bills'}
          </div>
        </div>

        {/* Total Customers */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {t('totalCustomers')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
            {customers.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {customers.length} {language === 'bn' ? 'নিবন্ধিত গ্রাহক' : 'registered'}
          </div>
        </div>

        {/* Total Products & Low Stock */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {t('navProducts')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
            {products.length}
          </div>
          <div className="flex items-center gap-1 text-xs mt-1">
            {lowStockCount > 0 ? (
              <span className="text-amber-600 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {lowStockCount} {language === 'bn' ? 'কম মজুত' : 'low stock'}
              </span>
            ) : (
              <span className="text-emerald-600 font-medium">{language === 'bn' ? 'পর্যাপ্ত মজুত' : 'In stock'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-semibold">
        <button
          type="button"
          onClick={() => setCurrentView('create-bill')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 text-slate-800 dark:text-slate-200 flex flex-col items-center gap-2 transition-colors shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span>{language === 'bn' ? 'নতুন বিল তৈরি' : 'Create Bill'}</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('products')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 text-slate-800 dark:text-slate-200 flex flex-col items-center gap-2 transition-colors shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <span>{language === 'bn' ? 'পণ্য তালিকা' : 'Inventory'}</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('customers')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 text-slate-800 dark:text-slate-200 flex flex-col items-center gap-2 transition-colors shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <span>{language === 'bn' ? 'খরিদ্দার খাতা' : 'Customers'}</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('bills')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 text-slate-800 dark:text-slate-200 flex flex-col items-center gap-2 transition-colors shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <ReceiptText className="w-5 h-5" />
          </div>
          <span>{language === 'bn' ? 'বিল হিস্ট্রি' : 'Bills History'}</span>
        </button>
      </div>

      {/* Recent Bills */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <ReceiptText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
                {language === 'bn' ? 'সাম্প্রতিক বিল সমূহ' : 'Recent Invoices'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('bills')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 transition-colors"
          >
            <span>{language === 'bn' ? 'সকল বিল' : 'View All'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bills List */}
        {bills.length === 0 ? (
          <div className="py-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <ReceiptText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {language === 'bn' ? 'এখনও কোনো বিল তৈরি করা হয়নি' : 'No invoices generated yet'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'bn' ? 'নতুন বিল বাটনে ক্লিক করে প্রথম ক্যাশ মেমো বানান' : 'Click new bill to make your first memo'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView('create-bill')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-2xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{language === 'bn' ? 'প্রথম বিল তৈরি করুন' : 'Create First Bill'}</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {bills.slice(0, 6).map((bill) => (
              <div
                key={bill.id}
                onClick={() => setSelectedInvoice(bill)}
                className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-xl transition-colors cursor-pointer"
              >
                <div className="space-y-0.5 min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {bill.billNumber}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                        bill.paymentMethod === 'UPI'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                          : bill.paymentMethod === 'CARD'
                          ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600'
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600'
                      }`}
                    >
                      {bill.paymentMethod}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                    {bill.customerName}
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{bill.date} • {bill.time} • {bill.items.length} {language === 'bn' ? 'পণ্য' : 'items'}</span>
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                    ₹{bill.grandTotal.toFixed(2)}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedInvoice(bill);
                    }}
                    className="mt-1 text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 justify-end"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'বিল দেখুন' : 'View'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Total Summary */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            {language === 'bn' ? 'মোট লেনদেন:' : 'Total Sales:'}{' '}
            <strong className="text-slate-900 dark:text-white font-mono">₹{totalRevenue.toFixed(2)}</strong>
          </span>
          <span className="text-emerald-600 font-semibold flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5" />
            <span>UPI QR Ready</span>
          </span>
        </div>
      </div>

      {/* Invoice Modal */}
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
