import { 
  BarChart3, 
  TrendingUp, 
  Receipt, 
  ShoppingBag, 
  Award, 
  CreditCard,
  QrCode
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function ReportsPage() {
  const { bills, language } = useApp();

  const totalRevenue = bills.reduce((acc, b) => acc + b.grandTotal, 0);
  const totalBills = bills.length;
  const avgBillValue = totalBills > 0 ? totalRevenue / totalBills : 0;

  // Compute Top Selling Products
  const itemMap: Record<string, { name: string; qty: number; revenue: number }> = {};
  bills.forEach((b) => {
    b.items.forEach((item) => {
      if (!itemMap[item.productId]) {
        itemMap[item.productId] = { name: item.name, qty: 0, revenue: 0 };
      }
      itemMap[item.productId].qty += item.quantity;
      itemMap[item.productId].revenue += item.total;
    });
  });

  const topSelling = Object.values(itemMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // Payment Breakdown
  const paymentBreakdown = bills.reduce(
    (acc, b) => {
      acc[b.paymentMethod] = (acc[b.paymentMethod] || 0) + b.grandTotal;
      return acc;
    },
    { UPI: 0, CASH: 0, CARD: 0, BANK_TRANSFER: 0 } as Record<string, number>
  );

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-5 select-none pb-24 lg:pb-8">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
          {language === 'bn' ? 'বিক্রয় রিপোর্ট ও অ্যানালিটিক্স' : 'Sales Reports & Analytics'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {language === 'bn' 
            ? 'দোকানের মোট আয়, গড় বিল সাইজ ও সর্বাধিক বিক্রিত পণ্যের বিশ্লেষণ' 
            : 'Revenue metrics, average ticket size, and best selling inventory'}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {language === 'bn' ? 'মোট বিক্রয় রাজস্ব' : 'Total Revenue'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display mt-2">
            ₹{totalRevenue.toFixed(2)}
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 mt-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'সুস্থ ক্যাশফ্লো' : 'Healthy cashflow'}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {language === 'bn' ? 'গড় বিলের পরিমাণ' : 'Average Bill Value'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-blue-600 font-display mt-2">
            ₹{avgBillValue.toFixed(2)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn' ? 'প্রতি খরিদ্দারের গড় খরচ' : 'Per transaction average'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {language === 'bn' ? 'মোট বিল প্রক্রিয়া' : 'Invoices Processed'}
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display mt-2">
            {totalBills} {language === 'bn' ? 'টি' : 'bills'}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn' ? 'কোনো ভুল ছাড়া সফল হিসাব' : '100% accurate record'}
          </p>
        </div>
      </div>

      {/* Grid: Top Selling Products + Payment Modes Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Selling Items */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Award className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">
              {language === 'bn' ? 'সর্বাধিক বিক্রিত পণ্য তালিকা' : 'Top Selling Products'}
            </h3>
          </div>

          <div className="space-y-3.5">
            {topSelling.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-500">
                {language === 'bn' ? 'এখনও কোনো পণ্য বিক্রয় হয়নি।' : 'No products sold yet.'}
              </p>
            ) : (
              topSelling.map((prod, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      #{idx + 1} {prod.name}
                    </span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">
                      {prod.qty} {language === 'bn' ? 'পিস' : 'units'} • ₹{prod.revenue.toFixed(0)}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        width: `${Math.min(100, (prod.qty / (topSelling[0]?.qty || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Payment Methods Split */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <QrCode className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">
              {language === 'bn' ? 'পেমেন্ট মাধ্যমের বিবরণ' : 'Payment Methods Breakdown'}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 block">UPI QR Payments</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                ₹{paymentBreakdown.UPI.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">GPay / PhonePe / Paytm</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 block">{language === 'bn' ? 'নগদ ক্যাশ' : 'Cash'}</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                ₹{paymentBreakdown.CASH.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Physical currency</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 block">Card Swipes</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                ₹{paymentBreakdown.CARD.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">POS Card terminal</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 block">Bank Transfer</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                ₹{paymentBreakdown.BANK_TRANSFER.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">NEFT / IMPS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
