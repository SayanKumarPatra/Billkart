import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { 
  X, 
  QrCode, 
  Banknote, 
  CreditCard, 
  Building2, 
  CheckCircle2, 
  Loader2, 
  Receipt, 
  PlusCircle, 
  ShieldCheck,
  Printer,
  Share2,
  Copy,
  Check,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { Bill, PaymentMethod, PaymentStatus } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { playSound } from '../../utils/audioHelper';
import { playPaymentSuccessSound } from '../../utils/soundEffects';
import { printReceipt } from '../../utils/printHelper';
import { sendBillViaWhatsApp, copyBillToClipboard } from '../../utils/whatsappHelper';
import { downloadBillDirect } from '../../utils/downloadHelper';

interface PaymentModalProps {
  bill: Bill;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (finalBill: Bill) => void;
  onViewInvoice: (finalBill: Bill) => void;
}

export function PaymentModal({
  bill,
  isOpen,
  onClose,
  onPaymentSuccess,
  onViewInvoice,
}: PaymentModalProps) {
  const { business, markBillAsPaid, clearCart, setCurrentView, language } = useApp();
  const isBn = language === 'bn';

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(bill.paymentStatus || 'PENDING');
  const [currentBill, setCurrentBill] = useState<Bill>(bill);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [cashTendered, setCashTendered] = useState<string>(String(Math.ceil(bill.grandTotal)));
  const [copied, setCopied] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<'pdf' | 'jpg' | null>(null);

  // Sync currentBill if bill prop changes
  useEffect(() => {
    setCurrentBill(bill);
    setPaymentStatus(bill.paymentStatus || 'PENDING');
  }, [bill]);

  // Generate UPI URI String
  const upiUri = `upi://pay?pa=${encodeURIComponent(business.upiId || '9876543210@upi')}&pn=${encodeURIComponent(business.shopName)}&am=${bill.grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Bill ${bill.billNumber}`)}`;

  // Generate crisp QR code data URL using `qrcode`
  useEffect(() => {
    if (isOpen && selectedMethod === 'UPI') {
      QRCode.toDataURL(upiUri, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error('QR generation error:', err));
    }
  }, [isOpen, selectedMethod, upiUri]);

  // Trigger celebration confetti and chime when payment succeeds
  const triggerCelebration = () => {
    playPaymentSuccessSound();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // safe fallback
    }
  };

  const handleSimulatePayment = () => {
    playSound('scan');
    setPaymentStatus('PROCESSING');

    setTimeout(() => {
      triggerCelebration();
      setPaymentStatus('SUCCESS');

      const updatedBill: Bill = {
        ...bill,
        paymentStatus: 'SUCCESS',
        paymentMethod: selectedMethod,
        paymentReference: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      };

      setCurrentBill(updatedBill);
      markBillAsPaid(updatedBill.id, updatedBill.paymentReference);
      onPaymentSuccess(updatedBill);
    }, 850);
  };

  const handlePrintInstant = () => {
    playSound('click');
    printReceipt(currentBill, business, 'thermal', language);
  };

  const handleWhatsAppInstant = () => {
    playSound('click');
    sendBillViaWhatsApp(currentBill, business, undefined, language);
  };

  const handleCopyInstant = async () => {
    playSound('click');
    const success = await copyBillToClipboard(currentBill, business, language);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadInstant = async (format: 'pdf' | 'jpg') => {
    playSound('click');
    setDownloadingFormat(format);
    try {
      await downloadBillDirect(currentBill, business, format, language);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleStartNewBill = () => {
    playSound('click');
    clearCart();
    onClose();
    setCurrentView('create-bill');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">
                {paymentStatus === 'SUCCESS'
                  ? (isBn ? 'পেমেন্ট সম্পন্ন হয়েছে' : 'Payment Received')
                  : (isBn ? 'পেমেন্ট গ্রহণ করুন' : 'Accept Payment')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                #{bill.billNumber} • {bill.customerName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {paymentStatus === 'SUCCESS' ? (
            /* SUCCESS STATE */
            <div className="text-center py-2 space-y-3.5">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-3 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  {isBn ? 'টাকা গ্রহণ সম্পন্ন' : 'Payment Successful'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display pt-1">
                  ₹{bill.grandTotal.toFixed(2)}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isBn ? 'পেমেন্ট মাধ্যম' : 'Paid via'}: {currentBill.paymentMethod} • Ref: {currentBill.paymentReference || 'CONFIRMED'}
                </p>
              </div>

              {/* Bill Details Summary Card */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1.5 text-left">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{isBn ? 'বিল নম্বর:' : 'Bill Number:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">#{bill.billNumber}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{isBn ? 'ক্রেতা:' : 'Customer:'}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {bill.customerName} ({bill.customerPhone})
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{isBn ? 'পণ্য সংখ্যা:' : 'Items Count:'}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{bill.items.length} {isBn ? 'টি পণ্য' : 'products'}</span>
                </div>
              </div>

              {/* Instant Print & WhatsApp High-Priority Actions */}
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handlePrintInstant}
                    className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{isBn ? 'রসিদ প্রিন্ট করুন' : 'Print Receipt'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppInstant}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>{isBn ? 'হোয়াটসঅ্যাপে পাঠান' : 'Send WhatsApp'}</span>
                  </button>
                </div>

                {/* PDF & JPG Download Options */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadInstant('pdf')}
                    disabled={downloadingFormat !== null}
                    className="py-2.5 px-3 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {downloadingFormat === 'pdf' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    <span>{isBn ? 'PDF ডাউনলোড' : 'Download PDF'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadInstant('jpg')}
                    disabled={downloadingFormat !== null}
                    className="py-2.5 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {downloadingFormat === 'jpg' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ImageIcon className="w-4 h-4" />
                    )}
                    <span>{isBn ? 'JPG ছবি ডাউনলোড' : 'Download JPG'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={handleCopyInstant}
                    className="py-2 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-600 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? (isBn ? 'কপি হয়েছে' : 'Copied') : (isBn ? 'টেক্সট কপি' : 'Copy')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onViewInvoice(currentBill)}
                    className="py-2 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1"
                  >
                    <Receipt className="w-3 h-3 text-blue-600" />
                    <span>{isBn ? 'মেমো দেখুন' : 'Full Invoice'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleStartNewBill}
                    className="py-2 px-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-[11px] font-bold shadow-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <PlusCircle className="w-3 h-3" />
                    <span>{isBn ? 'পরের বিল' : 'Next Bill'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* PAYMENT SELECTION & UPI QR STATE */
            <>
              {/* Payment Methods */}
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                {(['UPI', 'CASH', 'CARD', 'BANK_TRANSFER'] as PaymentMethod[]).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setSelectedMethod(method)}
                    className={`py-2 text-xs font-bold rounded-lg transition-colors flex flex-col items-center gap-1 ${
                      selectedMethod === method
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {method === 'UPI' && <QrCode className="w-4 h-4" />}
                    {method === 'CASH' && <Banknote className="w-4 h-4" />}
                    {method === 'CARD' && <CreditCard className="w-4 h-4" />}
                    {method === 'BANK_TRANSFER' && <Building2 className="w-4 h-4" />}
                    <span>
                      {method === 'UPI' ? 'UPI QR' :
                       method === 'CASH' ? (isBn ? 'নগদ' : 'Cash') :
                       method === 'CARD' ? 'Card' : 'Bank'}
                    </span>
                  </button>
                ))}
              </div>

              {/* Amount Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    {isBn ? 'মোট প্রদেয় বিলের পরিমাণ' : 'Total Amount Due'}
                  </span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white font-display">
                    ₹{bill.grandTotal.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-blue-600">
                    {business.shopName}
                  </span>
                  <p className="text-[11px] text-slate-500">{bill.customerName}</p>
                </div>
              </div>

              {/* UPI MODE: DYNAMIC QR DISPLAY */}
              {selectedMethod === 'UPI' && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 flex flex-col items-center text-center space-y-2.5">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="Dynamic UPI QR"
                        className="w-44 h-44 object-contain"
                      />
                    ) : (
                      <div className="w-44 h-44 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                      </div>
                    )}
                  </div>

                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {isBn ? 'যেকোনো ইউপিআই অ্যাপ দিয়ে স্ক্যান করুন' : 'Scan using GPay, PhonePe, Paytm'}
                  </p>

                  <p className="text-[11px] font-mono text-slate-500 truncate max-w-xs">
                    UPI: <span className="font-semibold text-slate-700 dark:text-slate-300">{business.upiId}</span>
                  </p>
                </div>
              )}

              {/* CASH MODE */}
              {selectedMethod === 'CASH' && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    {isBn ? 'ক্যাশ টাকা গ্রহণ' : 'Cash Received'}
                  </span>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(e.target.value)}
                      placeholder="ক্রেতার প্রদত্ত অর্থ"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    />
                  </div>
                  {parseFloat(cashTendered) >= bill.grandTotal && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex justify-between items-center text-xs">
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        {isBn ? 'ক্রেতাকে ফেরত দিন:' : 'Change to Return:'}
                      </span>
                      <span className="font-black text-emerald-800 dark:text-emerald-300 font-mono">
                        ₹{(parseFloat(cashTendered) - bill.grandTotal).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Confirm Payment Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={paymentStatus === 'PROCESSING'}
                  onClick={handleSimulatePayment}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  {paymentStatus === 'PROCESSING' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isBn ? 'পেমেন্ট যাচাই করা হচ্ছে...' : 'Verifying...'}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isBn ? 'পেমেন্ট সফল হয়েছে (কনফার্ম করুন)' : 'Confirm Payment'}</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
