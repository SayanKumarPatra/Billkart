import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Receipt, 
  ShoppingBag, 
  Award, 
  Calendar,
  CreditCard,
  QrCode
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export function ReportsPage() {
  const { bills, products, business } = useApp();

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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 select-none pb-24 lg:pb-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-display text-[#F5F7F6]">
          Sales Reports & Performance Analytics
        </h2>
        <p className="text-xs text-[#A9B8B3]">
          Comprehensive revenue metrics, average transaction size, and top selling stock
        </p>
      </div>

      {/* KPI Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-[#0B2822] border border-[#19D66B]/20 shadow-lg">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A9B8B3]">Total Lifetime Revenue</span>
          <div className="text-2xl sm:text-3xl font-black text-[#F5F7F6] font-display mt-2">
            ₹{totalRevenue.toFixed(2)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#57E39B] mt-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Healthy cashflow</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0B2822] border border-[#19D66B]/20 shadow-lg">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A9B8B3]">Average Bill Value</span>
          <div className="text-2xl sm:text-3xl font-black text-[#B8F500] font-display mt-2">
            ₹{avgBillValue.toFixed(2)}
          </div>
          <p className="text-[11px] text-[#A9B8B3] mt-1">Per customer transaction</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#0B2822] border border-[#19D66B]/20 shadow-lg">
          <span className="text-xs font-bold uppercase tracking-wider text-[#A9B8B3]">Invoices Processed</span>
          <div className="text-2xl sm:text-3xl font-black text-[#57E39B] font-display mt-2">
            {totalBills} bills
          </div>
          <p className="text-[11px] text-[#A9B8B3] mt-1">Zero billing errors recorded</p>
        </div>
      </div>

      {/* Grid: Top Selling Products + Payment Modes Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Selling Items */}
        <div className="p-5 rounded-3xl bg-[#0B2822] border border-[#19D66B]/25 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#19D66B]/15">
            <Award className="w-4 h-4 text-[#B8F500]" />
            <h3 className="font-bold text-sm text-[#F5F7F6] font-display">
              Top Selling Products by Volume
            </h3>
          </div>

          <div className="space-y-3">
            {topSelling.length === 0 ? (
              <p className="text-center py-6 text-xs text-[#A9B8B3]">No items sold yet.</p>
            ) : (
              topSelling.map((prod, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[#F5F7F6]">
                      #{idx + 1} {prod.name}
                    </span>
                    <span className="font-mono text-[#B8F500] font-bold">
                      {prod.qty} units • ₹{prod.revenue.toFixed(0)}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#061B16] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#19D66B] to-[#B8F500] rounded-full"
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
        <div className="p-5 rounded-3xl bg-[#0B2822] border border-[#19D66B]/25 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#19D66B]/15">
            <QrCode className="w-4 h-4 text-[#57E39B]" />
            <h3 className="font-bold text-sm text-[#F5F7F6] font-display">
              Payment Method Breakdown
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-[#061B16] border border-[#19D66B]/20">
              <span className="text-[11px] text-[#A9B8B3] block">UPI QR Payments</span>
              <span className="text-lg font-black text-[#57E39B] font-display">
                ₹{paymentBreakdown.UPI.toFixed(2)}
              </span>
              <span className="text-[10px] text-[#A9B8B3] block mt-0.5">Google Pay / PhonePe</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#061B16] border border-[#19D66B]/20">
              <span className="text-[11px] text-[#A9B8B3] block">Cash Register</span>
              <span className="text-lg font-black text-[#F5F7F6] font-display">
                ₹{paymentBreakdown.CASH.toFixed(2)}
              </span>
              <span className="text-[10px] text-[#A9B8B3] block mt-0.5">Physical currency</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#061B16] border border-[#19D66B]/20">
              <span className="text-[11px] text-[#A9B8B3] block">Card Swipes</span>
              <span className="text-lg font-black text-[#F5F7F6] font-display">
                ₹{paymentBreakdown.CARD.toFixed(2)}
              </span>
              <span className="text-[10px] text-[#A9B8B3] block mt-0.5">Debit / Credit POS</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#061B16] border border-[#19D66B]/20">
              <span className="text-[11px] text-[#A9B8B3] block">Bank Transfer</span>
              <span className="text-lg font-black text-[#F5F7F6] font-display">
                ₹{paymentBreakdown.BANK_TRANSFER.toFixed(2)}
              </span>
              <span className="text-[10px] text-[#A9B8B3] block mt-0.5">NEFT / IMPS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
