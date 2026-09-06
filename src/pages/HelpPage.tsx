import { useState } from 'react';
import { 
  HelpCircle, 
  Barcode, 
  QrCode, 
  Printer, 
  Phone, 
  Mail, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface FAQ {
  q: string;
  a: string;
}

const FAQS: FAQ[] = [
  {
    q: 'How does barcode duplicate scanning work in BillKart?',
    a: 'When you scan a product barcode with your camera or scanner gun, BillKart checks if the item is already on the current bill. If it already exists, BillKart automatically increments its quantity (Quantity = Quantity + 1) without creating duplicate rows, and recalculates item totals instantly!',
  },
  {
    q: 'Can I use BillKart without a physical barcode scanner?',
    a: 'Yes! BillKart turns your smartphone, tablet, or laptop camera into an intelligent laser barcode scanner. You can also click the quick-test chips or manually type barcodes.',
  },
  {
    q: 'How do customers pay with the UPI QR code?',
    a: 'When you click "Generate Bill", BillKart creates a dynamic UPI QR containing your shop\'s UPI ID and the exact invoice amount. The customer scans this with Google Pay, PhonePe, Paytm, or any banking app to complete payment in seconds.',
  },
  {
    q: 'Can I print bills on standard thermal receipt printers?',
    a: 'Yes! BillKart generates 80mm and 58mm POS thermal compliant receipts. Click "Print Bill" to route directly to any wireless Bluetooth, USB, or network receipt printer.',
  },
  {
    q: 'Where is my store data stored?',
    a: 'Your products, bills, and customers are safely stored inside your browser local storage. You can back up and download your entire database as a JSON file or export invoices as Excel CSV anytime from Settings.',
  },
];

export function HelpPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6 select-none pb-24 lg:pb-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-display text-[#F5F7F6]">
          BillKart Help Center & User Guide
        </h2>
        <p className="text-xs text-[#A9B8B3]">
          Quick start guides, hardware tips, and merchant support
        </p>
      </div>

      {/* 3 Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-3xl bg-[#0B2822] border border-[#19D66B]/20 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-[#10352D] flex items-center justify-center text-[#B8F500]">
            <Barcode className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-[#F5F7F6]">Barcode Scanning</h3>
          <p className="text-[11px] text-[#A9B8B3] leading-relaxed">
            Ensure good ambient lighting. Hold the camera 10–15 cm away from the barcode until the green reticle locks in.
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-[#0B2822] border border-[#19D66B]/20 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-[#10352D] flex items-center justify-center text-[#57E39B]">
            <QrCode className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-[#F5F7F6]">UPI Collections</h3>
          <p className="text-[11px] text-[#A9B8B3] leading-relaxed">
            Verify your UPI ID in Settings. Customers can pay using any standard UPI app in India with zero transaction fee.
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-[#0B2822] border border-[#19D66B]/20 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-[#10352D] flex items-center justify-center text-[#B8F500]">
            <Printer className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-[#F5F7F6]">Thermal Printing</h3>
          <p className="text-[11px] text-[#A9B8B3] leading-relaxed">
            Use standard 2-inch or 3-inch roll thermal paper. WhatsApp invoices can also be shared directly without paper waste.
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0B2822] border border-[#19D66B]/25 shadow-xl space-y-3">
        <h3 className="font-bold text-sm text-[#F5F7F6] pb-2 border-b border-[#19D66B]/15">
          Frequently Asked Questions
        </h3>

        <div className="space-y-2">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#061B16] border border-[#19D66B]/15 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between text-xs font-bold text-[#F5F7F6] hover:text-[#B8F500]"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#57E39B]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#A9B8B3]" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 text-xs text-[#A9B8B3] leading-relaxed border-t border-[#19D66B]/10 pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Support Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#10352D] to-[#0B2822] border border-[#19D66B]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-[#F5F7F6]">Need direct technical support?</h4>
          <p className="text-xs text-[#A9B8B3]">Our Indian retail POS specialists are available 7 days a week.</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="mailto:support@billkart.in"
            className="px-4 py-2 rounded-xl bg-[#061B16] hover:bg-[#10352D] text-xs font-bold text-[#F5F7F6] border border-[#19D66B]/25 flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-[#57E39B]" />
            <span>support@billkart.in</span>
          </a>
        </div>
      </div>
    </div>
  );
}
