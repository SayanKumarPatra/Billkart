import { useState } from 'react';
import { 
  Search, 
  Receipt, 
  Trash2,
  Calendar,
  Clock,
  User,
  Phone,
  Eye,
  FileText,
  Printer,
  Share2,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Bill } from '../types';
import { InvoiceModal } from '../components/invoice/InvoiceModal';
import { printReceipt } from '../utils/printHelper';
import { sendBillViaWhatsApp } from '../utils/whatsappHelper';
import { downloadBillDirect } from '../utils/downloadHelper';
import { playSound } from '../utils/audioHelper';

export function BillsHistoryPage() {
  const { bills, deleteBill, business, language } = useApp();
  const isBn = language === 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PAID' | 'PENDING'>('ALL');
  const [selectedBillForInvoice, setSelectedBillForInvoice] = useState<Bill | null>(null);
  const [downloadingBill, setDownloadingBill] = useState<{ id: string; format: 'pdf' | 'jpg' } | null>(null);

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

  const handleInstantPrint = (bill: Bill) => {
    playSound('click');
    printReceipt(bill, business, 'thermal', language);
  };

  const handleInstantWhatsApp = (bill: Bill) => {
    playSound('click');
    sendBillViaWhatsApp(bill, business, undefined, language);
  };

  const handleDownloadBill = async (bill: Bill, format: 'pdf' | 'jpg') => {
    playSound('click');
    setDownloadingBill({ id: bill.id, format });
    try {
      await downloadBillDirect(bill, business, format, language);
    } catch (err) {
      console.error('Download bill error:', err);
    } finally {
      setDownloadingBill(null);
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-5 select-none pb-24 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
            {isBn ? 'বিল ও ইনভয়েস হিস্ট্রি' : 'Bills & Invoices History'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isBn 
              ? `পূর্ববর্তী সকল বিলের তালিকা, থার্মাল প্রিন্ট ও হোয়াটসঅ্যাপ শেয়ারিং (${bills.length}টি সংরক্ষিত)`
              : `View, search, re-print thermal slips and share past receipts (${bills.length} total)`}
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Row */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isBn ? 'বিল নম্বর (যেমন BK-000001) বা ফোন দিয়ে খুঁজুন...' : 'Search by bill number or customer phone...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
          />
        </div>

        {/* Period Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {(['ALL', 'TODAY', 'WEEK', 'MONTH'] as const).map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setFilterPeriod(period)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                filterPeriod === period
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {period === 'ALL' 
                ? (isBn ? 'সব বিল' : 'All Time') 
                : period === 'TODAY' 
                ? (isBn ? 'আজকের' : 'Today') 
                : period === 'WEEK' 
                ? (isBn ? 'এই সপ্তাহ' : 'This Week') 
                : (isBn ? 'এই মাস' : 'This Month')}
            </button>
          ))}
        </div>
      </div>

      {/* Bills Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBills.length === 0 ? (
          <div className="col-span-full text-center py-16 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              {isBn ? 'কোনো বিলের তথ্য পাওয়া যায়নি' : 'No invoices found matching criteria.'}
            </p>
          </div>
        ) : (
          filteredBills.map((bill) => (
            <div
              key={bill.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-colors flex flex-col justify-between space-y-4 shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    #{bill.billNumber}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      bill.paymentStatus === 'SUCCESS'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 border border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    {bill.paymentStatus === 'SUCCESS' ? (isBn ? 'পরিশোধিত' : 'Paid') : (isBn ? 'বাকি' : 'Pending')}
                  </span>
                </div>

                <div className="pt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isBn ? 'ক্রেতা:' : 'Customer:'}</span>
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">{bill.customerName}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isBn ? 'মোবাইল:' : 'Phone:'}</span>
                    </span>
                    <span className="font-mono">{bill.customerPhone}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{isBn ? 'তারিখ:' : 'Date:'}</span>
                    </span>
                    <span>{bill.date} • {bill.time}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>{isBn ? 'পেমেন্ট মাধ্যম:' : 'Payment:'}</span>
                    <span className="font-semibold text-blue-600">{bill.paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>{isBn ? 'পণ্য সংখ্যা:' : 'Items:'}</span>
                    <span>{bill.items.length} {isBn ? 'টি পণ্য' : 'products'}</span>
                  </div>
                </div>
              </div>

              {/* Amount Box & Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{isBn ? 'সর্বমোট বিল' : 'Grand Total'}</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                    ₹{bill.grandTotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* View Full Modal */}
                  <button
                    type="button"
                    onClick={() => setSelectedBillForInvoice(bill)}
                    className="flex-1 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 transition-colors flex items-center justify-center gap-1"
                    title={isBn ? 'বিল দেখুন' : 'View Bill'}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isBn ? 'দেখুন' : 'View'}</span>
                  </button>

                  {/* Quick Print */}
                  <button
                    type="button"
                    onClick={() => handleInstantPrint(bill)}
                    className="py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1"
                    title={isBn ? 'থার্মাল প্রিন্ট করুন' : 'Print Receipt'}
                  >
                    <Printer className="w-3.5 h-3.5 text-blue-600" />
                    <span className="hidden sm:inline">{isBn ? 'প্রিন্ট' : 'Print'}</span>
                  </button>

                  {/* Quick WhatsApp */}
                  <button
                    type="button"
                    onClick={() => handleInstantWhatsApp(bill)}
                    className="py-2 px-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold transition-colors flex items-center gap-1"
                    title={isBn ? 'হোয়াটসঅ্যাপে পাঠান' : 'Send via WhatsApp'}
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">WA</span>
                  </button>

                  {/* Quick PDF Download */}
                  <button
                    type="button"
                    onClick={() => handleDownloadBill(bill, 'pdf')}
                    disabled={downloadingBill?.id === bill.id}
                    className="py-2 px-2 rounded-xl bg-red-50 dark:bg-red-950/30 hover:bg-red-100 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 text-xs font-bold transition-colors flex items-center gap-1 disabled:opacity-50"
                    title={isBn ? 'পিডিএফ ডাউনলোড' : 'Download PDF'}
                  >
                    {downloadingBill?.id === bill.id && downloadingBill?.format === 'pdf' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <FileText className="w-3.5 h-3.5" />
                    )}
                    <span className="text-[10px]">PDF</span>
                  </button>

                  {/* Quick JPG Download */}
                  <button
                    type="button"
                    onClick={() => handleDownloadBill(bill, 'jpg')}
                    disabled={downloadingBill?.id === bill.id}
                    className="py-2 px-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 text-xs font-bold transition-colors flex items-center gap-1 disabled:opacity-50"
                    title={isBn ? 'জেপিজি ছবি ডাউনলোড' : 'Download JPG'}
                  >
                    {downloadingBill?.id === bill.id && downloadingBill?.format === 'jpg' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ImageIcon className="w-3.5 h-3.5" />
                    )}
                    <span className="text-[10px]">JPG</span>
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => deleteBill(bill.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors border border-transparent hover:border-red-200"
                    title={isBn ? 'মুছে ফেলুন' : 'Delete'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Invoice Modal */}
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
