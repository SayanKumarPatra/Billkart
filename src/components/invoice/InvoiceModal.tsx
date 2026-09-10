import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Printer, 
  Share2, 
  Download, 
  Receipt,
  Copy,
  Check,
  Phone,
  FileText,
  Smartphone,
  ExternalLink,
  Info,
  Image as ImageIcon,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { Bill } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { printReceipt, PrintFormat } from '../../utils/printHelper';
import { 
  sendBillViaWhatsApp, 
  copyBillToClipboard, 
  shareBillNative,
  formatBillForWhatsApp 
} from '../../utils/whatsappHelper';
import { 
  downloadElementAsPdf, 
  downloadElementAsJpg, 
  downloadBillDirect 
} from '../../utils/downloadHelper';
import { playSound } from '../../utils/audioHelper';

interface InvoiceModalProps {
  bill: Bill | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceModal({ bill, isOpen, onClose }: InvoiceModalProps) {
  const { business, language } = useApp();
  const isBn = language === 'bn';

  // Printing format
  const [printFormat, setPrintFormat] = useState<PrintFormat>(
    business.printerType === 'a4' ? 'a4' : 'thermal'
  );

  // WhatsApp states
  const [recipientPhone, setRecipientPhone] = useState<string>(bill?.customerPhone || '');
  const [copied, setCopied] = useState(false);
  const [showWhatsAppPanel, setShowWhatsAppPanel] = useState(false);
  const [showTextPreview, setShowTextPreview] = useState(false);

  // Download states (PDF / JPG)
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<'pdf' | 'jpg' | null>(null);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bill) {
      setRecipientPhone(bill.customerPhone || '');
    }
  }, [bill]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setShowDownloadMenu(false);
      }
    }
    if (showDownloadMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDownloadMenu]);

  if (!isOpen || !bill) return null;

  const handlePrint = (format: PrintFormat = printFormat) => {
    playSound('click');
    printReceipt(bill, business, format, language);
  };

  const handleDirectWhatsApp = () => {
    playSound('click');
    const targetPhone = recipientPhone.trim() || bill.customerPhone;
    sendBillViaWhatsApp(bill, business, targetPhone, language);
  };

  const handleCopyBill = async () => {
    playSound('click');
    const success = await copyBillToClipboard(bill, business, language);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    playSound('click');
    await shareBillNative(bill, business, language);
  };

  const handleDownload = async (format: 'pdf' | 'jpg') => {
    playSound('click');
    setDownloadingFormat(format);
    try {
      const receiptEl = document.getElementById('printable-receipt-content');
      const filename = `Bill_${bill.billNumber}`;
      if (receiptEl) {
        if (format === 'pdf') {
          await downloadElementAsPdf(receiptEl, filename);
        } else {
          await downloadElementAsJpg(receiptEl, filename);
        }
      } else {
        await downloadBillDirect(bill, business, format, language);
      }
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloadingFormat(null);
      setShowDownloadMenu(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-2.5 sm:p-4 select-none print:p-0 print:bg-white print:static">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        id="printable-receipt-card"
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[94vh] flex flex-col print:border-none print:shadow-none print:max-h-full print:bg-white print:w-full"
      >
        {/* Header Bar */}
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">
                {isBn ? 'ক্যাশ মেমো ও ট্যাক্স ইনভয়েস' : 'Cash Memo & Tax Invoice'}
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                #{bill.billNumber} • {bill.date}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Format Switcher */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg mr-1 text-xs">
              <button
                type="button"
                onClick={() => setPrintFormat('thermal')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  printFormat === 'thermal'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
                title={isBn ? '৮০মিমি/৫৮মিমি থার্মাল প্রিন্টার' : 'Thermal POS format'}
              >
                {isBn ? 'থার্মাল POS' : 'Thermal'}
              </button>
              <button
                type="button"
                onClick={() => setPrintFormat('a4')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  printFormat === 'a4'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
                title={isBn ? 'স্ট্যান্ডার্ড A4 মেমো' : 'A4 Full Page'}
              >
                {isBn ? 'A4 মেমো' : 'A4'}
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2 print:hidden">
          {/* Print Button */}
          <button
            type="button"
            onClick={() => handlePrint()}
            className="flex-1 min-w-[110px] py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>{isBn ? 'প্রিন্ট' : 'Print'}</span>
          </button>

          {/* WhatsApp Direct Share Button */}
          <button
            type="button"
            onClick={handleDirectWhatsApp}
            className="flex-1 min-w-[120px] py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-4 h-4" />
            <span>{isBn ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}</span>
          </button>

          {/* Download Options (PDF / JPG) Dropdown Menu */}
          <div className="relative" ref={downloadMenuRef}>
            <button
              type="button"
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
              title={isBn ? 'পিডিএফ বা জেপিজি ডাউনলোড অপশন' : 'Download bill as PDF or JPG'}
            >
              {downloadingFormat ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isBn ? 'ডাউনলোড' : 'Download'}</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>

            {/* Dropdown Popover */}
            <AnimatePresence>
              {showDownloadMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  className="absolute right-0 mt-1.5 w-56 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-1.5 z-50 space-y-1"
                >
                  <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {isBn ? 'ফরম্যাট পছন্দ করুন' : 'Choose Format'}
                  </div>

                  {/* PDF Option */}
                  <button
                    type="button"
                    onClick={() => handleDownload('pdf')}
                    disabled={downloadingFormat !== null}
                    className="w-full px-2.5 py-2 rounded-lg text-left text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-2.5 transition-colors disabled:opacity-50"
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{isBn ? 'পিডিএফ ফাইল' : 'PDF Document'}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300 font-mono font-bold">.pdf</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block leading-tight">
                        {isBn ? 'প্রিন্ট ও অফিশিয়াল মেমোর জন্য' : 'Best for printing & archiving'}
                      </span>
                    </div>
                  </button>

                  {/* JPG Option */}
                  <button
                    type="button"
                    onClick={() => handleDownload('jpg')}
                    disabled={downloadingFormat !== null}
                    className="w-full px-2.5 py-2 rounded-lg text-left text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 flex items-center gap-2.5 transition-colors disabled:opacity-50"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{isBn ? 'জেপিজি ছবি' : 'JPG Image'}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 font-mono font-bold">.jpg</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block leading-tight">
                        {isBn ? 'গ্যালারি ও যেকোনো অ্যাপে শেয়ার' : 'For photo gallery & social share'}
                      </span>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Copy Bill Text */}
          <button
            type="button"
            onClick={handleCopyBill}
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
              copied
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-600 font-bold'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isBn ? 'সম্পূর্ণ বিলের টেক্সট কপি করুন' : 'Copy bill text to clipboard'}
          >
            {copied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (isBn ? 'কপি হয়েছে!' : 'Copied!') : (isBn ? 'টেক্সট কপি' : 'Copy')}</span>
          </button>

          {/* More options toggle (WhatsApp panel) */}
          <button
            type="button"
            onClick={() => setShowWhatsAppPanel(!showWhatsAppPanel)}
            className={`p-2.5 rounded-xl border transition-colors ${
              showWhatsAppPanel
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-600'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
            title={isBn ? 'হোয়াটসঅ্যাপ অপশন ও নম্বর পরিবর্তন' : 'WhatsApp options & phone settings'}
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* WhatsApp Phone & Details Slide-down Panel */}
        <AnimatePresence>
          {showWhatsAppPanel && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/40 p-3.5 space-y-2.5 text-xs overflow-hidden print:hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                  <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isBn ? 'হোয়াটসঅ্যাপে পাঠানোর নম্বর:' : 'WhatsApp Recipient Phone:'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTextPreview(!showTextPreview)}
                  className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  <span>{showTextPreview ? (isBn ? 'প্রিভিউ বন্ধ' : 'Hide Preview') : (isBn ? 'মেসেজ প্রিভিউ' : 'View Message')}</span>
                </button>
              </div>

              {/* Recipient Phone Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-600" />
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleDirectWhatsApp}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <span>{isBn ? 'এখনই পাঠান' : 'Send Now'}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold text-xs transition-colors shrink-0"
                    title={isBn ? 'মোবাইল শেয়ার মেন্যু খুলুন' : 'Open mobile share sheet'}
                  >
                    <span>{isBn ? 'মোবাইল শেয়ার' : 'App Share'}</span>
                  </button>
                )}
              </div>

              {/* Formatted Text Preview */}
              {showTextPreview && (
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 font-mono text-[11px] text-slate-700 dark:text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {formatBillForWhatsApp(bill, business, language)}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Printable Receipt Container (Thermal / A4) */}
        <div
          id="printable-receipt-content"
          className="p-5 sm:p-6 overflow-y-auto bg-white text-slate-900 font-sans text-xs space-y-4 print:text-black print:p-0 print:overflow-visible"
        >
          {/* Shop Header */}
          <div className="text-center border-b border-dashed border-slate-400 pb-3 space-y-1">
            <h2 className="text-base sm:text-lg font-bold tracking-tight uppercase text-slate-900">
              {business.shopName}
            </h2>
            {business.tagline && (
              <p className="text-[11px] text-slate-600 italic">
                {business.tagline}
              </p>
            )}
            <p className="text-[11px] text-slate-600 max-w-xs mx-auto leading-tight">
              {business.address}
            </p>
            <p className="text-[11px] text-slate-600 font-medium">
              মোবাইল: {business.phone} {business.gstNumber && `| GSTIN: ${business.gstNumber}`}
            </p>
          </div>

          {/* Bill Meta */}
          <div className="grid grid-cols-2 gap-2 text-[11px] border-b border-dashed border-slate-400 pb-2.5">
            <div>
              <span className="text-slate-500 block">{isBn ? 'ইনভয়েস নং:' : 'Invoice No:'}</span>
              <span className="font-bold text-slate-900 font-mono text-xs">#{bill.billNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">{isBn ? 'তারিখ ও সময়:' : 'Date & Time:'}</span>
              <span className="font-medium text-slate-800">{bill.date}, {bill.time}</span>
            </div>
            <div>
              <span className="text-slate-500 block">{isBn ? 'ক্রেতা:' : 'Customer:'}</span>
              <span className="font-semibold text-slate-800">{bill.customerName}</span>
              {bill.customerAddress && (
                <span className="text-[10px] text-slate-500 block truncate max-w-[160px]">
                  📍 {bill.customerAddress}
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">{isBn ? 'মোবাইল:' : 'Phone:'}</span>
              <span className="font-mono text-slate-800">{bill.customerPhone}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-1.5 border-b border-dashed border-slate-400 pb-3">
            <div className="flex justify-between font-bold text-slate-500 text-[10px] uppercase border-b border-slate-300 pb-1">
              <span className="flex-1">{isBn ? 'পণ্য বিবরণ' : 'Item'}</span>
              <span className="w-12 text-center">{isBn ? 'পরিমাণ' : 'Qty'}</span>
              <span className="w-16 text-right">{isBn ? 'দর' : 'Rate'}</span>
              <span className="w-16 text-right">{isBn ? 'মোট' : 'Total'}</span>
            </div>

            {bill.items.map((item, idx) => (
              <div key={item.id || idx} className="flex justify-between items-center text-[11px] py-1 border-b border-slate-100 last:border-none">
                <div className="flex-1 pr-2">
                  <p className="font-semibold text-slate-900 leading-tight">{item.name}</p>
                </div>
                <span className="w-12 text-center font-bold text-slate-800">
                  x{item.quantity}
                </span>
                <span className="w-16 text-right text-slate-600 font-mono">
                  ₹{item.unitPrice.toFixed(2)}
                </span>
                <span className="w-16 text-right font-bold text-slate-900 font-mono">
                  ₹{item.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Totals Breakdown */}
          <div className="space-y-1 text-xs pt-1 border-b border-dashed border-slate-400 pb-3">
            <div className="flex justify-between text-slate-600">
              <span>{isBn ? 'সাবটোটাল:' : 'Subtotal:'}</span>
              <span className="font-mono font-bold">₹{bill.subtotal.toFixed(2)}</span>
            </div>

            {bill.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>{isBn ? 'ছাড় (ডিসকাউন্ট):' : 'Discount:'}</span>
                <span className="font-mono font-bold">-₹{bill.discountAmount.toFixed(2)}</span>
              </div>
            )}

            {bill.gstAmount > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>{isBn ? 'ট্যাক্স (GST):' : 'GST Tax:'}</span>
                <span className="font-mono font-bold">+₹{bill.gstAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-300">
              <span className="uppercase">{isBn ? 'সর্বমোট প্রদেয়:' : 'Grand Total:'}</span>
              <span className="font-mono text-base font-black">₹{bill.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Footer & Payment Info */}
          <div className="text-center text-[11px] text-slate-600 space-y-1 pt-1">
            <p className="font-bold text-slate-800">
              {isBn ? 'পেমেন্ট মাধ্যম:' : 'Payment:'} {bill.paymentMethod} •{' '}
              <span className={bill.paymentStatus === 'SUCCESS' ? 'text-emerald-700 font-bold' : 'text-amber-700'}>
                {bill.paymentStatus === 'SUCCESS' ? (isBn ? 'পরিশোধিত ✓' : 'PAID ✓') : (isBn ? 'বাকি' : 'PENDING')}
              </span>
            </p>
            {bill.paymentReference && (
              <p className="text-[10px] text-slate-500 font-mono">
                {isBn ? 'রেফারেন্স:' : 'Ref:'} {bill.paymentReference}
              </p>
            )}
            <p className="text-slate-600 italic pt-2">
              {business.receiptFooterText ||
                (isBn
                  ? '*** আমাদের দোকানে কেনাকাটা করার জন্য ধন্যবাদ! আবার আসবেন ***'
                  : '*** Thank you for shopping with us! Visit again ***')}
            </p>
          </div>
        </div>

        {/* Bottom Quick-actions Bar with direct PDF and JPG buttons */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 print:hidden">
          {/* Direct Download Options */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mr-1">
              {isBn ? 'ডাউনলোড:' : 'Download:'}
            </span>

            {/* Direct PDF Button */}
            <button
              type="button"
              onClick={() => handleDownload('pdf')}
              disabled={downloadingFormat !== null}
              className="px-2.5 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 text-xs font-bold transition-colors flex items-center gap-1 disabled:opacity-50"
              title={isBn ? 'পিডিএফ ফরম্যাটে রসিদ ডাউনলোড করুন' : 'Download bill receipt as PDF'}
            >
              {downloadingFormat === 'pdf' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5" />
              )}
              <span>PDF</span>
            </button>

            {/* Direct JPG Button */}
            <button
              type="button"
              onClick={() => handleDownload('jpg')}
              disabled={downloadingFormat !== null}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 text-xs font-bold transition-colors flex items-center gap-1 disabled:opacity-50"
              title={isBn ? 'জেপিজি ছবি ফরম্যাটে রসিদ ডাউনলোড করুন' : 'Download bill receipt as JPG image'}
            >
              {downloadingFormat === 'jpg' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ImageIcon className="w-3.5 h-3.5" />
              )}
              <span>JPG</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePrint()}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isBn ? 'প্রিন্ট' : 'Print'}</span>
            </button>
            <button
              type="button"
              onClick={handleDirectWhatsApp}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isBn ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
