import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  AlertCircle, 
  Receipt, 
  PlusCircle, 
  ArrowRight,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { Bill, PaymentMethod, PaymentStatus } from '../../types';
import { useApp } from '../../contexts/AppContext';

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
  const { business, markBillAsPaid, clearCart, setCurrentView } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(bill.paymentStatus || 'PENDING');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [cashTendered, setCashTendered] = useState<string>(String(Math.ceil(bill.grandTotal)));

  // Generate UPI URI String
  // upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...
  const upiUri = `upi://pay?pa=${encodeURIComponent(business.upiId || 'billkart.store@okhdfcbank')}&pn=${encodeURIComponent(business.shopName)}&am=${bill.grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Bill ${bill.billNumber}`)}`;

  // Generate crisp QR code data URL using `qrcode`
  useEffect(() => {
    if (isOpen && selectedMethod === 'UPI') {
      QRCode.toDataURL(upiUri, {
        width: 320,
        margin: 2,
        color: {
          dark: '#061B16',
          light: '#FFFFFF',
        },
      })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error('QR generation error:', err));
    }
  }, [isOpen, selectedMethod, upiUri]);

  // Trigger celebration confetti and chime when payment succeeds
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#19D66B', '#B8F500', '#57E39B', '#FFFFFF'],
      });
    } catch (e) {
      // Confetti fallback
    }
  };

  const handleSimulatePayment = () => {
    setPaymentStatus('PROCESSING');
    setTimeout(() => {
      const ref = `UPI-REF-${Date.now().toString().slice(-8)}`;
      setPaymentStatus('SUCCESS');
      markBillAsPaid(bill.id, ref);
      triggerCelebration();
      const updated = { ...bill, paymentStatus: 'SUCCESS' as PaymentStatus, paymentReference: ref, paymentMethod: selectedMethod };
      onPaymentSuccess(updated);
    }, 1200);
  };

  const handleStartNewBill = () => {
    clearCart();
    onClose();
    setCurrentView('create-bill');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-[#061B16] rounded-3xl border border-[#19D66B]/30 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#19D66B]/20 bg-[#0B2822] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#10352D] border border-[#19D66B]/30 flex items-center justify-center text-[#B8F500]">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#F5F7F6] font-display">
                {paymentStatus === 'SUCCESS' ? 'Payment Completed' : 'Payment Collection'}
              </h3>
              <p className="text-[11px] text-[#A9B8B3]">
                Bill #{bill.billNumber} • {bill.customerName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#10352D] text-[#A9B8B3] hover:text-[#F5F7F6] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto space-y-4">
          {paymentStatus === 'SUCCESS' ? (
            /* SUCCESS STATE */
            <div className="text-center py-4 space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="w-18 h-18 mx-auto rounded-3xl bg-gradient-to-tr from-[#19D66B] to-[#B8F500] p-1 shadow-[0_0_30px_rgba(25,214,107,0.5)]"
              >
                <div className="w-full h-full bg-[#061B16] rounded-[22px] flex items-center justify-center text-[#B8F500]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
              </motion.div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#19D66B] uppercase tracking-wider bg-[#10352D] px-3 py-1 rounded-full border border-[#19D66B]/30">
                  Payment Received
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#F5F7F6] font-display pt-2">
                  ₹{bill.grandTotal.toFixed(2)}
                </h2>
                <p className="text-xs text-[#A9B8B3]">
                  Paid via {selectedMethod} • Ref: {bill.paymentReference || 'TXN-CONFIRMED'}
                </p>
              </div>

              {/* Bill Details Summary Card */}
              <div className="p-4 rounded-2xl bg-[#0B2822] border border-[#19D66B]/20 text-xs space-y-2 text-left">
                <div className="flex justify-between text-[#A9B8B3]">
                  <span>Bill Number:</span>
                  <span className="font-bold text-[#F5F7F6]">{bill.billNumber}</span>
                </div>
                <div className="flex justify-between text-[#A9B8B3]">
                  <span>Customer:</span>
                  <span className="font-semibold text-[#F5F7F6]">{bill.customerName}</span>
                </div>
                <div className="flex justify-between text-[#A9B8B3]">
                  <span>Date & Time:</span>
                  <span className="font-semibold text-[#F5F7F6]">{bill.date} at {bill.time}</span>
                </div>
                <div className="flex justify-between text-[#A9B8B3]">
                  <span>Items:</span>
                  <span className="font-semibold text-[#57E39B]">{bill.items.length} products</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => onViewInvoice(bill)}
                  className="flex-1 py-3 rounded-2xl bg-[#10352D] hover:bg-[#19D66B]/20 border border-[#19D66B]/30 text-xs font-bold text-[#B8F500] transition-colors flex items-center justify-center gap-2"
                >
                  <Receipt className="w-4 h-4" />
                  <span>View & Print Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={handleStartNewBill}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#19D66B] via-[#57E39B] to-[#B8F500] text-[#061B16] text-xs font-extrabold shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Next Bill</span>
                </button>
              </div>
            </div>
          ) : (
            /* PAYMENT SELECTION & UPI QR STATE */
            <>
              {/* Payment Methods Selector Tabs */}
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#0B2822] rounded-2xl border border-[#19D66B]/20">
                {(['UPI', 'CASH', 'CARD', 'BANK_TRANSFER'] as PaymentMethod[]).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setSelectedMethod(method)}
                    className={`py-2 text-[11px] font-bold rounded-xl transition-all flex flex-col items-center gap-1 ${
                      selectedMethod === method
                        ? 'bg-[#10352D] text-[#B8F500] border border-[#19D66B]/30 shadow-sm'
                        : 'text-[#A9B8B3] hover:text-[#F5F7F6]'
                    }`}
                  >
                    {method === 'UPI' && <QrCode className="w-4 h-4" />}
                    {method === 'CASH' && <Banknote className="w-4 h-4" />}
                    {method === 'CARD' && <CreditCard className="w-4 h-4" />}
                    {method === 'BANK_TRANSFER' && <Building2 className="w-4 h-4" />}
                    <span>{method === 'BANK_TRANSFER' ? 'NetBanking' : method}</span>
                  </button>
                ))}
              </div>

              {/* Amount Box */}
              <div className="p-3.5 rounded-2xl bg-[#0B2822] border border-[#19D66B]/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#A9B8B3] uppercase font-bold tracking-wider">Total Amount Due</span>
                  <div className="text-2xl font-black text-[#F5F7F6] font-display">
                    ₹{bill.grandTotal.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#57E39B] font-mono bg-[#10352D] px-2 py-0.5 rounded-md">
                    {business.shopName}
                  </span>
                  <p className="text-[10px] text-[#A9B8B3] mt-1">{bill.customerName}</p>
                </div>
              </div>

              {/* UPI MODE: DYNAMIC QR DISPLAY */}
              {selectedMethod === 'UPI' && (
                <div className="p-5 rounded-2xl bg-[#0B2822] border border-[#19D66B]/30 flex flex-col items-center text-center space-y-3">
                  <div className="bg-white p-3 rounded-2xl shadow-[0_0_20px_rgba(25,214,107,0.2)]">
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt="Dynamic UPI Payment QR"
                        className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                      />
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-[#19D66B]" />
                      </div>
                    )}
                  </div>

                  {/* UPI Apps supported pills */}
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-[#F5F7F6]">
                      Scan with any UPI App
                    </p>
                    <div className="flex items-center justify-center gap-2 text-[10px] font-semibold text-[#A9B8B3]">
                      <span className="px-2 py-0.5 rounded-md bg-[#10352D] text-[#57E39B]">Google Pay</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#10352D] text-[#57E39B]">PhonePe</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#10352D] text-[#57E39B]">Paytm</span>
                      <span className="px-2 py-0.5 rounded-md bg-[#10352D] text-[#57E39B]">BHIM</span>
                    </div>
                  </div>

                  <p className="text-[10px] font-mono text-[#A9B8B3] truncate max-w-xs">
                    UPI ID: <span className="text-[#57E39B]">{business.upiId}</span>
                  </p>
                </div>
              )}

              {/* CASH MODE */}
              {selectedMethod === 'CASH' && (
                <div className="p-4 rounded-2xl bg-[#0B2822] border border-[#19D66B]/20 space-y-3">
                  <span className="text-xs font-bold text-[#F5F7F6] block">Cash Register Tender</span>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#57E39B]">₹</span>
                      <input
                        type="number"
                        value={cashTendered}
                        onChange={(e) => setCashTendered(e.target.value)}
                        placeholder="Amount received from customer"
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] focus:outline-none"
                      />
                    </div>
                  </div>
                  {parseFloat(cashTendered) >= bill.grandTotal && (
                    <div className="p-2.5 rounded-xl bg-[#10352D] border border-[#19D66B]/30 flex justify-between items-center text-xs">
                      <span className="text-[#A9B8B3]">Return Change to Customer:</span>
                      <span className="font-extrabold text-[#B8F500]">
                        ₹{(parseFloat(cashTendered) - bill.grandTotal).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* CARD MODE */}
              {selectedMethod === 'CARD' && (
                <div className="p-4 rounded-2xl bg-[#0B2822] border border-[#19D66B]/20 text-center space-y-2">
                  <CreditCard className="w-8 h-8 text-[#57E39B] mx-auto" />
                  <p className="text-xs font-bold text-[#F5F7F6]">Swipe / Tap on POS Card Terminal</p>
                  <p className="text-[11px] text-[#A9B8B3]">
                    Process ₹{bill.grandTotal.toFixed(2)} on your wireless EDC terminal, then confirm below.
                  </p>
                </div>
              )}

              {/* NETBANKING MODE */}
              {selectedMethod === 'BANK_TRANSFER' && (
                <div className="p-4 rounded-2xl bg-[#0B2822] border border-[#19D66B]/20 text-xs space-y-2">
                  <div className="flex justify-between text-[#A9B8B3]">
                    <span>Account Name:</span>
                    <span className="font-bold text-[#F5F7F6]">{business.shopName}</span>
                  </div>
                  <div className="flex justify-between text-[#A9B8B3]">
                    <span>Account Number:</span>
                    <span className="font-mono text-[#57E39B]">50200084729103</span>
                  </div>
                  <div className="flex justify-between text-[#A9B8B3]">
                    <span>IFSC Code:</span>
                    <span className="font-mono text-[#57E39B]">HDFC0001234</span>
                  </div>
                </div>
              )}

              {/* Live Payment Status & Action Buttons */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-[11px] px-1">
                  <span className="text-[#A9B8B3]">Current Status:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-md ${
                      paymentStatus === 'PROCESSING'
                        ? 'bg-yellow-500/20 text-yellow-400 animate-pulse'
                        : 'bg-orange-500/20 text-orange-400'
                    }`}
                  >
                    {paymentStatus}
                  </span>
                </div>

                {/* Confirm Payment Button */}
                <button
                  type="button"
                  disabled={paymentStatus === 'PROCESSING'}
                  onClick={handleSimulatePayment}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#19D66B] via-[#57E39B] to-[#B8F500] text-[#061B16] font-extrabold text-xs sm:text-sm hover:brightness-110 shadow-[0_6px_20px_rgba(25,214,107,0.35)] transition-all flex items-center justify-center gap-2"
                >
                  {paymentStatus === 'PROCESSING' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Payment...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Mark as Paid (Confirm Payment)</span>
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
