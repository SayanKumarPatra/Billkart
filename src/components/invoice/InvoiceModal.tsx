import { useRef } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Printer, 
  Share2, 
  Download, 
  CheckCircle2, 
  Receipt, 
  Phone, 
  MapPin, 
  Store,
  FileCheck
} from 'lucide-react';
import { Bill } from '../../types';
import { useApp } from '../../contexts/AppContext';

interface InvoiceModalProps {
  bill: Bill | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceModal({ bill, isOpen, onClose }: InvoiceModalProps) {
  const { business } = useApp();
  const printRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen || !bill) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const itemsSummary = bill.items
      .map(i => `• ${i.name} (x${i.quantity}) - ₹${i.total.toFixed(2)}`)
      .join('%0A');
    
    const text = `*${encodeURIComponent(business.shopName)}*%0A` +
      `Invoice: *#${bill.billNumber}*%0A` +
      `Date: ${bill.date} ${bill.time}%0A` +
      `Customer: ${encodeURIComponent(bill.customerName)}%0A%0A` +
      `*Items:*%0A${itemsSummary}%0A%0A` +
      `Subtotal: ₹${bill.subtotal.toFixed(2)}%0A` +
      (bill.discountAmount > 0 ? `Discount: -₹${bill.discountAmount.toFixed(2)}%0A` : '') +
      (bill.gstAmount > 0 ? `GST Tax: ₹${bill.gstAmount.toFixed(2)}%0A` : '') +
      `*Total Paid: ₹${bill.grandTotal.toFixed(2)}* (${bill.paymentMethod})%0A%0A` +
      `Thank you for shopping with us!`;

    const phoneDigits = bill.customerPhone.replace(/[^0-9]/g, '');
    const waUrl = phoneDigits.length >= 10
      ? `https://wa.me/91${phoneDigits.slice(-10)}?text=${text}`
      : `https://wa.me/?text=${text}`;
    
    window.open(waUrl, '_blank');
  };

  const handleDownloadInvoice = () => {
    const invoiceContent = `
========================================
${business.shopName}
${business.address}
Phone: ${business.phone} | GSTIN: ${business.gstNumber || 'N/A'}
========================================
INVOICE: #${bill.billNumber}
Date: ${bill.date} | Time: ${bill.time}
Customer: ${bill.customerName} (${bill.customerPhone})
----------------------------------------
ITEMS:
${bill.items.map(i => `${i.name.padEnd(24)} x${i.quantity}  ₹${i.total.toFixed(2)}`).join('\n')}
----------------------------------------
Subtotal:        ₹${bill.subtotal.toFixed(2)}
Discount:       -₹${bill.discountAmount.toFixed(2)}
GST Tax:         ₹${bill.gstAmount.toFixed(2)}
GRAND TOTAL:     ₹${bill.grandTotal.toFixed(2)}
Payment Method:  ${bill.paymentMethod}
Payment Status:  ${bill.paymentStatus}
========================================
Thank You For Visiting Us!
    `.trim();

    const blob = new Blob([invoiceContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bill_${bill.billNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 select-none print:p-0 print:bg-white print:static">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-[#100C14] rounded-3xl border border-white/10 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col print:border-none print:shadow-none print:max-h-full print:bg-white"
      >
        {/* Header Modal Bar */}
        <div className="px-5 py-3.5 border-b border-white/10 bg-[#140F18] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#FFA000]" />
            <h3 className="font-bold text-sm text-white font-display">Tax Invoice / Bill</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#1F1422] text-[#A09CA8] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="p-3 bg-[#140F18] border-b border-white/10 flex items-center justify-center gap-2 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2 px-3 rounded-xl bg-[#1F1422] hover:bg-[#FF1E42]/20 border border-white/10 text-xs font-bold text-white hover:text-[#FFA000] transition-colors flex items-center justify-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Bill</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="flex-1 py-2 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-xs font-bold text-[#25D366] transition-colors flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadInvoice}
            className="py-2 px-3 rounded-xl bg-[#1F1422] hover:bg-[#FF1E42]/20 border border-white/10 text-xs font-bold text-[#A09CA8] hover:text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>

        {/* Printable Thermal Receipt Container */}
        <div
          ref={printRef}
          className="p-5 sm:p-6 overflow-y-auto bg-white text-zinc-900 font-sans text-xs space-y-4 print:text-black print:p-2"
        >
          {/* Shop Header */}
          <div className="text-center border-b border-dashed border-zinc-300 pb-3 space-y-1">
            <div className="w-10 h-10 mx-auto rounded-xl bg-[#FF1E42] text-white flex items-center justify-center font-bold font-display text-lg mb-1 shadow-md">
              BK
            </div>
            <h2 className="text-lg font-black tracking-tight uppercase text-zinc-900">
              {business.shopName}
            </h2>
            <p className="text-[11px] text-zinc-600 max-w-xs mx-auto leading-tight">
              {business.address}
            </p>
            <p className="text-[11px] text-zinc-600 font-medium">
              Phone: {business.phone} {business.gstNumber && `| GSTIN: ${business.gstNumber}`}
            </p>
          </div>

          {/* Bill Meta */}
          <div className="grid grid-cols-2 gap-2 text-[11px] border-b border-dashed border-zinc-300 pb-2.5">
            <div>
              <span className="text-zinc-500 block">Bill Number:</span>
              <span className="font-extrabold text-zinc-900 font-mono text-xs">{bill.billNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-zinc-500 block">Date & Time:</span>
              <span className="font-bold text-zinc-800">{bill.date}, {bill.time}</span>
            </div>
            <div>
              <span className="text-zinc-500 block">Customer Name:</span>
              <span className="font-bold text-zinc-800">{bill.customerName}</span>
            </div>
            <div className="text-right">
              <span className="text-zinc-500 block">Customer Mobile:</span>
              <span className="font-medium text-zinc-800 font-mono">{bill.customerPhone}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-1.5 border-b border-dashed border-zinc-300 pb-3">
            <div className="flex justify-between font-bold text-zinc-500 text-[10px] uppercase border-b border-zinc-200 pb-1">
              <span className="flex-1">Item Description</span>
              <span className="w-12 text-center">Qty</span>
              <span className="w-16 text-right">Price</span>
              <span className="w-16 text-right">Amount</span>
            </div>

            {bill.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-[11px] py-1 border-b border-zinc-100 last:border-none">
                <div className="flex-1 pr-2">
                  <p className="font-semibold text-zinc-900 leading-tight">{item.name}</p>
                  <p className="text-[9px] text-zinc-500 font-mono">{item.barcode}</p>
                </div>
                <span className="w-12 text-center font-bold text-zinc-800">
                  x{item.quantity}
                </span>
                <span className="w-16 text-right text-zinc-600 font-mono">
                  ₹{item.unitPrice.toFixed(2)}
                </span>
                <span className="w-16 text-right font-bold text-zinc-900 font-mono">
                  ₹{item.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals Calculation Breakdown */}
          <div className="space-y-1 text-xs pt-1 border-b border-dashed border-zinc-300 pb-3">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal:</span>
              <span className="font-mono">₹{bill.subtotal.toFixed(2)}</span>
            </div>

            {bill.discountAmount > 0 && (
              <div className="flex justify-between text-[#FF1E42]">
                <span>Discount:</span>
                <span className="font-mono">-₹{bill.discountAmount.toFixed(2)}</span>
              </div>
            )}

            {bill.gstAmount > 0 && (
              <div className="flex justify-between text-zinc-600">
                <span>GST Tax:</span>
                <span className="font-mono">+₹{bill.gstAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-base font-black text-zinc-900 pt-1 border-t border-zinc-200">
              <span>Grand Total:</span>
              <span className="font-mono text-[#FF1E42]">₹{bill.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Details & Footer */}
          <div className="text-center text-[11px] text-zinc-600 space-y-1 pt-1">
            <p className="font-bold text-zinc-800">
              Payment: {bill.paymentMethod} • Status: {bill.paymentStatus}
            </p>
            {bill.paymentReference && (
              <p className="text-[10px] text-zinc-500 font-mono">
                Txn Ref: {bill.paymentReference}
              </p>
            )}
            <p className="text-zinc-500 italic pt-2">
              *** Thank You For Shopping With Us! Please Visit Again ***
            </p>
            <p className="text-[9px] text-zinc-400 font-mono">
              Powered by BillKart Smart POS
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
