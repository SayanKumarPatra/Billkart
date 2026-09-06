import { useState } from 'react';
import { 
  HelpCircle, 
  Barcode, 
  QrCode, 
  Printer, 
  Mail, 
  ChevronDown, 
  ChevronUp, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface FAQ {
  qEn: string;
  qBn: string;
  aEn: string;
  aBn: string;
}

const FAQS: FAQ[] = [
  {
    qEn: 'How does barcode scanning work in BillKart?',
    qBn: 'বিলকার্টে বারকোড স্ক্যান কীভাবে কাজ করে?',
    aEn: 'When you scan a product barcode with your camera or scanner gun, BillKart checks if the item is already on the current bill. If it exists, BillKart automatically increments quantity (+1) without creating duplicate rows, and recalculates totals instantly!',
    aBn: 'ক্যামেরা বা স্ক্যানার দিয়ে বারকোড স্ক্যান করলেই পণ্যটি বিলে যোগ হয়। একই পণ্য পুনরায় স্ক্যান করলে নতুন সারি না করে স্বয়ংক্রিয়ভাবে সংখ্যা (+১) বেড়ে যায় এবং মোট মূল্য সাথে সাথে হিসাব হয়ে যায়।'
  },
  {
    qEn: 'Can I use BillKart without a physical barcode scanner?',
    qBn: 'বারকোড মেশিন ছাড়া কি ক্যামেরা দিয়ে স্ক্যান করা যাবে?',
    aEn: 'Yes! BillKart turns your smartphone, tablet, or laptop camera into an intelligent laser barcode scanner. You can also manually search or type barcode numbers.',
    aBn: 'হ্যাঁ! আপনার মোবাইল, ট্যাবলেট বা ল্যাপটপের ক্যামেরা স্বয়ংক্রিয়ভাবে বারকোড স্ক্যানার হিসেবে কাজ করবে। তাছাড়া নাম বা বারকোড লিখেও পণ্য যোগ করতে পারবেন।'
  },
  {
    qEn: 'How do customers pay with the UPI QR code?',
    qBn: 'খরিদ্দার কীভাবে কিউআর কোড দিয়ে পেমেন্ট করবে?',
    aEn: 'When you click "Generate Bill", BillKart creates a dynamic UPI QR containing your shop UPI ID and exact bill amount. Customers scan this with GPay, PhonePe, Paytm, or any bank app to pay instantly.',
    aBn: 'বিল তৈরির সময় মোট টাকার সাথে আপনার দোকানের কিউআর কোড স্ক্রিনে ভেসে উঠবে। খরিদ্দার গুগল পে, ফোনপে বা পেটিএম দিয়ে স্ক্যান করলেই সরাসরি আপনার একাউন্টে টাকা চলে যাবে।'
  },
  {
    qEn: 'Can I print bills on thermal receipt printers?',
    qBn: 'থার্মাল প্রিন্টারে কি রসিদ প্রিন্ট করা যাবে?',
    aEn: 'Yes! BillKart generates 80mm and 58mm POS thermal compliant receipts. Click "Print Bill" to route directly to any Bluetooth, USB, or WiFi thermal printer.',
    aBn: 'হ্যাঁ! বিলকার্টে ৫৮মিমি এবং ৮০মিমি যেকোনো ব্লুটুথ বা ইউএসবি থার্মাল প্রিন্টারে সরাসরি মেমো প্রিন্ট করা যায়। একইসাথে হোয়াটসঅ্যাপেও রসিদ পাঠানো যায়।'
  },
  {
    qEn: 'Where is my store data stored?',
    qBn: 'দোকানের হিসাব ও ডাটা কি নিরাপদ?',
    aEn: 'Your products, bills, and customers are safely stored inside your browser local storage. You can back up and download your entire database as a JSON file or export invoices as Excel CSV anytime from Settings.',
    aBn: 'আপনার সকল ডাটা এই ডিভাইসে সুরক্ষিত থাকে। সেটিংস মেনু থেকে যেকোনো সময় এক ক্লিকে সম্পূর্ণ ব্যাকআপ ডাউনলোড অথবা এক্সেলে এক্সপোর্ট করতে পারবেন।'
  },
];

export function HelpPage() {
  const { setCurrentView, language } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-5 select-none pb-24 lg:pb-8">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
          {language === 'bn' ? 'সাহায্য ও ব্যবহার সহায়িকা' : 'Help & User Guide'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {language === 'bn' 
            ? 'সহজে বিল তৈরি, বারকোড স্ক্যান এবং কিউআর পেমেন্টের নিয়মাবলী' 
            : 'Quick start guides, hardware tips, and merchant support'}
        </p>
      </div>

      {/* Interactive Walkthrough Banner */}
      <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {language === 'bn' ? 'ইন্টারেক্টিভ স্টেপ-বাই-স্টেপ অ্যাপ গাইড' : 'Interactive App Walkthrough'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {language === 'bn' 
                ? 'নেক্সট-নেক্সট করে পুরো বিলকার্ট পিওএস অ্যাপ্লিকেশনের প্রতিটি ফিচার সহজে বুঝে নিন।' 
                : 'Click Next-Next to explore every feature of BillKart POS step-by-step.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCurrentView('onboarding')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs shrink-0"
        >
          <span>{language === 'bn' ? 'গাইড স্ক্রিন দেখুন' : 'Start App Tour'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3 Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
            <Barcode className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white">
            {language === 'bn' ? 'বারকোড স্ক্যানিং' : 'Barcode Scanning'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {language === 'bn'
              ? 'মোবাইল ক্যামেরা ১০-১৫ সেমি দূরত্বে পণ্যের বারকোডের সামনে ধরুন। স্বয়ংক্রিয়ভাবে পণ্য সনাক্ত হবে।'
              : 'Hold camera 10–15 cm away from barcode. Ensure sufficient lighting for fast recognition.'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <QrCode className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white">
            {language === 'bn' ? 'ইউপিআই কিউআর পেমেন্ট' : 'UPI Collections'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {language === 'bn'
              ? 'সেটিংসে আপনার সঠিক UPI ID দিন। খরিদ্দার সরাসরি যে কোনো অ্যাপ দিয়ে টাকা পাঠাতে পারবে।'
              : 'Set your UPI ID in Settings. Customers pay via any UPI app with zero transaction charge.'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
            <Printer className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-white">
            {language === 'bn' ? 'থার্মাল প্রিন্ট ও শেয়ার' : 'Thermal Printing'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {language === 'bn'
              ? '৫৮মিমি বা ৮০মিমি কাগজের প্রিন্টারে সরাসরি মেমো দিন অথবা হোয়াটসঅ্যাপে শেয়ার করুন।'
              : 'Standard 2-inch or 3-inch roll thermal paper. Direct WhatsApp receipt sharing is also built-in.'}
          </p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          {language === 'bn' ? 'সাধারণ জিজ্ঞাসাবলী (FAQ)' : 'Frequently Asked Questions'}
        </h3>

        <div className="space-y-2">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white"
                >
                  <span>{language === 'bn' ? faq.qBn : faq.qEn}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-blue-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/60 dark:border-slate-700/60 pt-2.5">
                    {language === 'bn' ? faq.aBn : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Support Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-0.5">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {language === 'bn' ? 'কোনো সহায়তার প্রয়োজন?' : 'Need technical support?'}
          </h4>
          <p className="text-xs text-slate-500">
            {language === 'bn' ? 'আমাদের রিটেইল সাপোর্ট টিম সবসময় সহায়তার জন্য প্রস্তুত।' : 'Retail POS specialist assistance available 7 days a week.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="mailto:support@billkart.in"
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>support@billkart.in</span>
          </a>
        </div>
      </div>
    </div>
  );
}
