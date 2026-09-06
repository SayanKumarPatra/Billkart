import { useState } from 'react';
import { 
  FileText, 
  Search, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  User, 
  Receipt, 
  CreditCard, 
  QrCode, 
  Banknote,
  Trash2
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Bill } from '../types';
import { InvoiceModal } from '../components/invoice/InvoiceModal';

export function BillsHistoryPage() {
  const { bills, deleteBill, business } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PAID' | 'PENDING'>('ALL');
  const [selectedBillForInvoice, setSelectedBillForInvoice] = useState<Bill | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredBills = bills.filter((b) => {
    // Search match
    const matchesSearch =
      b.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerPhone.includes(searchQuery.trim());

    // Period match
    let matchesPeriod = true;
    if (filterPeriod === 'TODAY') {
      matchesPeriod = b.date === todayStr;
    }

    // Status match
    let matchesStatus = true;
    if (filterStatus === 'PAID') {
      matchesStatus = b.paymentStatus === 'SUCCESS';
    } else if (filterStatus === 'PENDING') {
      matchesStatus = b.paymentStatus !== 'SUCCESS';
    }

    return matchesSearch && matchesPeriod && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 select-none pb-24 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-display text-[#F5F7F6]">
            Bills & Invoice History
          </h2>
          <p className="text-xs text-[#A9B8B3]">
            Search, view, re-print and share previously generated receipts ({bills.length} total)
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Row */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57E39B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by bill number (BK-000012) or customer phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0B2822] border border-[#19D66B]/25 text-xs text-[#F5F7F6] placeholder-[#A9B8B3]/60 focus:outline-none"
          />
        </div>

        {/* Period Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['ALL', 'TODAY', 'WEEK', 'MONTH'] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setFilterPeriod(period)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                filterPeriod === period
                  ? 'bg-[#19D66B] text-[#061B16]'
                  : 'bg-[#0B2822] text-[#A9B8B3] hover:text-[#F5F7F6] border border-[#19D66B]/20'
              }`}
            >
              {period === 'ALL' ? 'All Time' : period === 'TODAY' ? 'Today' : period === 'WEEK' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* Bills Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBills.length === 0 ? (
          <div className="col-span-full text-center py-16 p-6 rounded-3xl bg-[#0B2822] border border-[#19D66B]/20 text-xs text-[#A9B8B3]">
            No invoices found matching current search filter.
          </div>
        ) : (
          filteredBills.map((bill) => (
            <div
              key={bill.id}
              className="p-5 rounded-3xl bg-[#0B2822] border border-[#19D66B]/20 hover:border-[#19D66B]/50 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#19D66B]/15">
                  <span className="font-mono text-xs font-extrabold text-[#F5F7F6]">
                    {bill.billNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                      bill.paymentStatus === 'SUCCESS'
                        ? 'bg-[#19D66B]/20 text-[#19D66B]'
                        : 'bg-orange-500/20 text-orange-400'
                    }`}
                  >
                    {bill.paymentStatus === 'SUCCESS' ? 'Paid' : 'Pending'}
                  </span>
                </div>

                <div className="pt-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[#A9B8B3]">
                    <span>Customer:</span>
                    <span className="font-bold text-[#F5F7F6]">{bill.customerName}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#A9B8B3]">
                    <span>Mobile:</span>
                    <span className="font-mono">{bill.customerPhone}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#A9B8B3]">
                    <span>Date & Time:</span>
                    <span>{bill.date} • {bill.time}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#A9B8B3]">
                    <span>Payment Mode:</span>
                    <span className="font-semibold text-[#57E39B]">{bill.paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#A9B8B3]">
                    <span>Items Count:</span>
                    <span>{bill.items.length} products</span>
                  </div>
                </div>
              </div>

              {/* Amount Box & Actions */}
              <div className="pt-3 border-t border-[#19D66B]/15 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#A9B8B3]">Grand Total</span>
                  <span className="text-xl font-black text-[#B8F500] font-display">
                    ₹{bill.grandTotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBillForInvoice(bill)}
                    className="flex-1 py-2 rounded-xl bg-[#10352D] hover:bg-[#19D66B]/20 border border-[#19D66B]/30 text-xs font-bold text-[#F5F7F6] hover:text-[#B8F500] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>View Bill</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteBill(bill.id)}
                    className="p-2 rounded-xl bg-[#10352D] text-[#A9B8B3] hover:text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Invoice Modal for selected bill */}
      {selectedBillForInvoice && (
        <InvoiceModal
          bill={selectedBillForInvoice}
          isOpen={!!selectedBillForInvoice}
          onClose={() => setSelectedBillForInvoice(null)}
        />
      )}
    </div>
  );
}
