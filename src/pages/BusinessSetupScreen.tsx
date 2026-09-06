import { useState, type FormEvent } from 'react';
import { 
  Store, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Receipt, 
  CreditCard, 
  Printer, 
  ShieldCheck, 
  Check, 
  Globe,
  Sparkles
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { BillKartLogo } from '../components/BillKartLogo';
import { playSound } from '../utils/audioHelper';

type SetupTab = 'brand' | 'address' | 'legal' | 'payment' | 'receipt';

interface PresetShop {
  id: string;
  name: string;
  categoryLabel: string;
  data: {
    shopName: string;
    tagline: string;
    ownerName: string;
    phone: string;
    secondaryPhone: string;
    email: string;
    address: string;
    landmark: string;
    city: string;
    district: string;
    state: string;
    pinCode: string;
    category: string;
    establishedYear: string;
    gstNumber: string;
    panNumber: string;
    tradeLicenseNumber: string;
    fssaiNumber: string;
    drugLicenseNumber: string;
    msmeNumber: string;
    upiId: string;
    upiPayeeName: string;
    bankName: string;
    bankAccountNumber: string;
    bankIfsc: string;
    invoicePrefix: string;
    receiptFooterText: string;
    termsAndConditions: string;
    printerType: '58mm' | '80mm' | 'a4';
    showQrOnBill: boolean;
  };
}

const PRESET_SHOPS: PresetShop[] = [
  {
    id: 'grocery',
    name: 'সায়ন জেনারেল স্টোর (মুদিখানা)',
    categoryLabel: 'Grocery & Staples',
    data: {
      shopName: 'সায়ন জেনারেল স্টোর',
      tagline: 'খাঁটি মুদি ও নিত্যপ্রয়োজনীয় সামগ্রী',
      ownerName: 'সায়ন কুমার পাত্র',
      phone: '9876543210',
      secondaryPhone: '9830123456',
      email: 'sayan.patra@gmail.com',
      address: '১২/বি, রাজা রামমোহন সরণি',
      landmark: 'কলেজ স্ট্রিট মোড়ের কাছে',
      city: 'কলকাতা',
      district: 'কলকাতা',
      state: 'পশ্চিমবঙ্গ (West Bengal)',
      pinCode: '700009',
      category: 'মুদিখানা ও জেনারেল স্টোর (Grocery & Kirana)',
      establishedYear: '২০১৮',
      gstNumber: '19ABCDE1234F1Z5',
      panNumber: 'ABCDE1234F',
      tradeLicenseNumber: 'TL/KMC/2024/09812',
      fssaiNumber: '22823015000452',
      drugLicenseNumber: '',
      msmeNumber: 'UDYAM-WB-10-0029148',
      upiId: '9876543210@upi',
      upiPayeeName: 'Sayan General Store',
      bankName: 'State Bank of India',
      bankAccountNumber: '389201992012',
      bankIfsc: 'SBIN0000001',
      invoicePrefix: 'SGS',
      receiptFooterText: 'আমাদের দোকানে কেনাকাটা করার জন্য ধন্যবাদ! আবার আসবেন।',
      termsAndConditions: 'ক্যাশ মেমো সহ ৩ দিনের মধ্যে অক্ষত অবস্থায় পণ্য পরিবর্তনযোগ্য। কোনো ক্যাশ রিফান্ড হবে না।',
      printerType: '80mm',
      showQrOnBill: true,
    }
  },
  {
    id: 'garments',
    name: 'পাত্র বস্ত্রালয় (তৈরি পোশাক)',
    categoryLabel: 'Clothing & Apparel',
    data: {
      shopName: 'পাত্র বস্ত্রালয়',
      tagline: 'সেরা ফ্যাশন ও ট্রেন্ডি পোশাকের সম্ভার',
      ownerName: 'সায়ন কুমার পাত্র',
      phone: '9876543210',
      secondaryPhone: '',
      email: 'patra.fashion@gmail.com',
      address: '৪৫, জিটি রোড, সেন্ট্রাল পয়েন্ট',
      landmark: 'হাওড়া ময়দান মেট্রো গেট ২',
      city: 'হাওড়া',
      district: 'হাওড়া',
      state: 'পশ্চিমবঙ্গ (West Bengal)',
      pinCode: '711101',
      category: 'বস্ত্রালয় ও তৈরি পোশাক (Clothing & Apparel)',
      establishedYear: '২০২০',
      gstNumber: '19ABCDE5678G1Z2',
      panNumber: 'ABCDE5678G',
      tradeLicenseNumber: 'TL/HMC/2024/44312',
      fssaiNumber: '',
      drugLicenseNumber: '',
      msmeNumber: 'UDYAM-WB-12-0044129',
      upiId: 'patra.textiles@okaxis',
      upiPayeeName: 'Patra Bastralaya',
      bankName: 'HDFC Bank',
      bankAccountNumber: '50100438192012',
      bankIfsc: 'HDFC0000128',
      invoicePrefix: 'PB',
      receiptFooterText: 'পোশাকের রঙ ও সাইজ পরিবর্তনের জন্য বিল সাথে আনুন। শুভকামনা!',
      termsAndConditions: 'ট্যাগ লাগানো অবস্থায় ৭ দিনের মধ্যে পরিবর্তনযোগ্য। অন্তর্বাস পরিবর্তনযোগ্য নয়।',
      printerType: '80mm',
      showQrOnBill: true,
    }
  },
  {
    id: 'pharmacy',
    name: 'লাইফলাইন ফার্মেসি ও ড্রাগ স্টোর',
    categoryLabel: 'Pharmacy & Healthcare',
    data: {
      shopName: 'লাইফলাইন ফার্মেসি',
      tagline: 'নির্ভরযোগ্য ঔষধ ও স্বাস্থ্য পরিষেবা',
      ownerName: 'সায়ন কুমার পাত্র',
      phone: '9876543210',
      secondaryPhone: '',
      email: 'lifeline.meds@gmail.com',
      address: '৮৮, ডায়মন্ড হারবার রোড',
      landmark: 'বেহালা ট্রাম ডিপো অপোজিট',
      city: 'কলকাতা',
      district: 'দক্ষিণ ২৪ পরগনা',
      state: 'পশ্চিমবঙ্গ (West Bengal)',
      pinCode: '700034',
      category: 'ফার্মেসি ও ঔষধালয় (Pharmacy & Medical)',
      establishedYear: '২০২২',
      gstNumber: '19ABCDE9012H1Z9',
      panNumber: 'ABCDE9012H',
      tradeLicenseNumber: 'TL/KMC/2024/77219',
      fssaiNumber: '12822019000118',
      drugLicenseNumber: 'WB-DL-2022-881920',
      msmeNumber: 'UDYAM-WB-10-0081290',
      upiId: 'lifeline.pharma@icici',
      upiPayeeName: 'Lifeline Pharmacy',
      bankName: 'ICICI Bank',
      bankAccountNumber: '001205018291',
      bankIfsc: 'ICIC0000012',
      invoicePrefix: 'LLP',
      receiptFooterText: 'ডাক্তারের পরামর্শ অনুযায়ী ঔষধ সেবন করুন। আপনার সুস্থতা আমাদের কাম্য।',
      termsAndConditions: 'ফ্রিজের ইনসুলিন ও খোলা কাটা ওষুধ ফেরত নেওয়া হয় না।',
      printerType: '80mm',
      showQrOnBill: true,
    }
  }
];

export function BusinessSetupScreen() {
  const { business, updateBusiness, setUser, setCurrentView, language, setLanguage } = useApp();

  const [activeTab, setActiveTab] = useState<SetupTab>('brand');
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [shopName, setShopName] = useState(business.shopName || 'সায়ন জেনারেল স্টোর');
  const [tagline, setTagline] = useState(business.tagline || 'খাঁটি পণ্য ও দ্রুত পরিষেবা');
  const [ownerName, setOwnerName] = useState(business.ownerName || 'সায়ন কুমার পাত্র');
  const [phone, setPhone] = useState(business.phone || '9876543210');
  const [secondaryPhone, setSecondaryPhone] = useState(business.secondaryPhone || '');
  const [email, setEmail] = useState(business.email || 'sayan@gmail.com');
  const [category, setCategory] = useState(business.category || 'মুদিখানা ও জেনারেল স্টোর (Grocery & Kirana)');
  const [establishedYear, setEstablishedYear] = useState(business.establishedYear || '২০১৮');

  // Address
  const [address, setAddress] = useState(business.address || '১২/বি, রাজা রামমোহন সরণি');
  const [landmark, setLandmark] = useState(business.landmark || 'কলেজ স্ট্রিট মোড়');
  const [city, setCity] = useState(business.city || 'কলকাতা');
  const [district, setDistrict] = useState(business.district || 'কলকাতা');
  const [state, setState] = useState(business.state || 'পশ্চিমবঙ্গ (West Bengal)');
  const [pinCode, setPinCode] = useState(business.pinCode || '700009');

  // Legal
  const [gstNumber, setGstNumber] = useState(business.gstNumber || '19ABCDE1234F1Z5');
  const [panNumber, setPanNumber] = useState(business.panNumber || 'ABCDE1234F');
  const [tradeLicenseNumber, setTradeLicenseNumber] = useState(business.tradeLicenseNumber || 'TL/KMC/2024/09812');
  const [fssaiNumber, setFssaiNumber] = useState(business.fssaiNumber || '');

  // Payment
  const [upiId, setUpiId] = useState(business.upiId || '9876543210@upi');
  const [upiPayeeName, setUpiPayeeName] = useState(business.upiPayeeName || 'Sayan General Store');
  const [bankName, setBankName] = useState(business.bankName || 'State Bank of India');
  const [bankAccountNumber, setBankAccountNumber] = useState(business.bankAccountNumber || '389201992012');
  const [bankIfsc, setBankIfsc] = useState(business.bankIfsc || 'SBIN0000001');

  // Receipt
  const [invoicePrefix, setInvoicePrefix] = useState(business.invoicePrefix || 'BK');
  const [receiptFooterText, setReceiptFooterText] = useState(
    business.receiptFooterText || 'আমাদের দোকানে কেনাকাটা করার জন্য ধন্যবাদ! আবার আসবেন।'
  );
  const [printerType, setPrinterType] = useState<'58mm' | '80mm' | 'a4'>(business.printerType || '80mm');
  const [showQrOnBill, setShowQrOnBill] = useState(business.showQrOnBill !== false);

  const handleApplyPreset = (presetId: string) => {
    const preset = PRESET_SHOPS.find(p => p.id === presetId);
    if (!preset) return;

    playSound('click');
    setShopName(preset.data.shopName);
    setTagline(preset.data.tagline);
    setOwnerName(preset.data.ownerName);
    setPhone(preset.data.phone);
    setSecondaryPhone(preset.data.secondaryPhone);
    setEmail(preset.data.email);
    setAddress(preset.data.address);
    setLandmark(preset.data.landmark);
    setCity(preset.data.city);
    setDistrict(preset.data.district);
    setState(preset.data.state);
    setPinCode(preset.data.pinCode);
    setCategory(preset.data.category);
    setEstablishedYear(preset.data.establishedYear);
    setGstNumber(preset.data.gstNumber);
    setPanNumber(preset.data.panNumber);
    setTradeLicenseNumber(preset.data.tradeLicenseNumber);
    setFssaiNumber(preset.data.fssaiNumber);
    setUpiId(preset.data.upiId);
    setUpiPayeeName(preset.data.upiPayeeName);
    setBankName(preset.data.bankName);
    setBankAccountNumber(preset.data.bankAccountNumber);
    setBankIfsc(preset.data.bankIfsc);
    setInvoicePrefix(preset.data.invoicePrefix);
    setReceiptFooterText(preset.data.receiptFooterText);
    setPrinterType(preset.data.printerType);
    setShowQrOnBill(preset.data.showQrOnBill);
    setFormError(null);
  };

  const handleSaveAll = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!shopName.trim()) {
      playSound('error');
      setFormError(language === 'bn' ? 'দোকানের নাম লিখতে হবে।' : 'Store Name is required.');
      setActiveTab('brand');
      return;
    }
    if (!ownerName.trim()) {
      playSound('error');
      setFormError(language === 'bn' ? 'দোকানদারের নাম লিখতে হবে।' : 'Owner Name is required.');
      setActiveTab('brand');
      return;
    }
    if (!phone.trim()) {
      playSound('error');
      setFormError(language === 'bn' ? 'মোবাইল নম্বর দিতে হবে।' : 'Phone Number is required.');
      setActiveTab('brand');
      return;
    }

    const fullProfile = {
      shopName: shopName.trim(),
      tagline: tagline.trim(),
      ownerName: ownerName.trim(),
      phone: phone.trim(),
      secondaryPhone: secondaryPhone.trim(),
      email: email.trim(),
      address: address.trim(),
      landmark: landmark.trim(),
      city: city.trim(),
      district: district.trim(),
      state: state.trim(),
      pinCode: pinCode.trim(),
      category: category.trim(),
      establishedYear: establishedYear.trim(),
      gstNumber: gstNumber.trim(),
      panNumber: panNumber.trim(),
      tradeLicenseNumber: tradeLicenseNumber.trim(),
      fssaiNumber: fssaiNumber.trim(),
      drugLicenseNumber: '',
      msmeNumber: '',
      upiId: upiId.trim(),
      upiPayeeName: upiPayeeName.trim() || shopName.trim(),
      bankName: bankName.trim(),
      bankAccountNumber: bankAccountNumber.trim(),
      bankIfsc: bankIfsc.trim(),
      currency: '₹',
      invoicePrefix: invoicePrefix.trim() || 'BK',
      receiptFooterText: receiptFooterText.trim(),
      termsAndConditions: 'ক্যাশ মেমো সহ ৩ দিনের মধ্যে পণ্য পরিবর্তনযোগ্য।',
      printerType,
      showQrOnBill,
    };

    updateBusiness(fullProfile);

    setUser(prev => ({
      ...prev,
      name: ownerName.trim(),
      phone: phone.trim(),
      storeName: shopName.trim(),
      hasCompletedSetup: true,
      hasCompletedOnboarding: true,
      isAuthenticated: true,
    }));

    playSound('fanfare');
    setCurrentView('dashboard');
  };

  const tabs: { id: SetupTab; labelBn: string; labelEn: string; icon: any }[] = [
    { id: 'brand', labelBn: 'দোকানের নাম ও তথ্য', labelEn: 'Store Info', icon: Store },
    { id: 'address', labelBn: 'ঠিকানা ও যোগাযোগ', labelEn: 'Address', icon: MapPin },
    { id: 'legal', labelBn: 'জিএসটি ও লাইসেন্স', labelEn: 'Tax & GST', icon: FileText },
    { id: 'payment', labelBn: 'ইউপিআই ও পেমেন্ট', labelEn: 'UPI QR Pay', icon: QrCode },
    { id: 'receipt', labelBn: 'বিল ও প্রিন্টার', labelEn: 'Receipt Setup', icon: Printer },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between p-3 sm:p-6 select-none">
      
      {/* Top Header */}
      <header className="w-full max-w-3xl mx-auto flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <BillKartLogo size="sm" showTagline={false} horizontal={true} />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-3xl mx-auto my-4 space-y-4">
        
        {/* Preset Selector Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">
            {language === 'bn' ? '⚡ দ্রুত শুরু করতে ডেমো দোকানের প্রোফাইল নির্বাচন করুন:' : '⚡ Quick Start: Choose a business preset:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRESET_SHOPS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset.id)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50/50 text-left transition-colors flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                  <Store className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{preset.name.split(' ')[0]} {preset.name.split(' ')[1]}</p>
                  <p className="text-[10px] text-slate-500 truncate">{preset.categoryLabel}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
          
          {/* Header Title */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white">
                {language === 'bn' ? 'দোকানের প্রোফাইল ও বিলিং কনফিগারেশন' : 'Store Profile & POS Settings'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === 'bn' ? 'সঠিক তথ্য দিন যাতে বিলে ও ইউপিআই কিউআরে আপনার দোকানের নাম আসে' : 'Configure details printed on receipts and dynamic UPI QRs'}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>ধাপ ৪/৪</span>
            </div>
          </div>

          {/* Form Error */}
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs font-medium text-red-700 dark:text-red-300">
              {formError}
            </div>
          )}

          {/* Responsive Tab Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100 dark:border-slate-800">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setActiveTab(tab.id);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{language === 'bn' ? tab.labelBn : tab.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: BRAND */}
          {activeTab === 'brand' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'দোকানের নাম *' : 'Store Name *'}
                  </label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="সায়ন জেনারেল স্টোর"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'দোকানদার / স্বত্বাধিকারীর নাম *' : 'Owner / Merchant Name *'}
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="সায়ন কুমার পাত্র"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'মোবাইল নম্বর *' : 'Primary Phone *'}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'স্লোগান / ট্যাগলাইন' : 'Store Tagline'}
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="খাঁটি পণ্য ও দ্রুত পরিষেবা"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADDRESS */}
          {activeTab === 'address' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'দোকানের ঠিকানা (রাস্তা ও হোল্ডিং নং)' : 'Store Address'}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="১২/বি, রাজা রামমোহন সরণি"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'শহর / এলাকা' : 'City'}
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="কলকাতা"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'রাজ্য' : 'State'}
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="পশ্চিমবঙ্গ"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'পিন কোড' : 'PIN Code'}
                  </label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="700009"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LEGAL */}
          {activeTab === 'legal' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'জিএসটি নম্বর (GSTIN)' : 'GST Number (GSTIN)'}
                  </label>
                  <input
                    type="text"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                    placeholder="19ABCDE1234F1Z5"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm uppercase focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'প্যান নম্বর (PAN)' : 'PAN Number'}
                  </label>
                  <input
                    type="text"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm uppercase focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'ট্রেড লাইসেন্স নম্বর' : 'Trade License No.'}
                  </label>
                  <input
                    type="text"
                    value={tradeLicenseNumber}
                    onChange={(e) => setTradeLicenseNumber(e.target.value)}
                    placeholder="TL/KMC/2024/09812"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'FSSAI খাদ্য লাইসেন্স (ঐচ্ছিক)' : 'FSSAI License (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={fssaiNumber}
                    onChange={(e) => setFssaiNumber(e.target.value)}
                    placeholder="22823015000452"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: UPI & PAYMENT */}
          {activeTab === 'payment' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
                <QrCode className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  {language === 'bn'
                    ? 'এখানে আপনার সঠিক UPI আইডি (যেমন: 9876543210@upi বা Google Pay/PhonePe ID) দিন। বিল করার সময় এই আইডির ভিত্তিতে স্বয়ংক্রিয় কিউআর তৈরি হবে।'
                    : 'Set your shopkeeper UPI ID (e.g., 9876543210@upi). Dynamic payment QR codes will be generated using this handle.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'দোকানের ইউপিআই আইডি (UPI ID) *' : 'Store UPI ID *'}
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="9876543210@upi"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'ইউপিআই প্রাপকের নাম (Payee Name)' : 'UPI Payee Name'}
                  </label>
                  <input
                    type="text"
                    value={upiPayeeName}
                    onChange={(e) => setUpiPayeeName(e.target.value)}
                    placeholder="Sayan General Store"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'ব্যাংকের নাম' : 'Bank Name'}
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="State Bank of India"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'অ্যাকাউন্ট নম্বর' : 'Account Number'}
                  </label>
                  <input
                    type="text"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    placeholder="389201992012"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RECEIPT & PRINTER */}
          {activeTab === 'receipt' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'ইনভয়েস প্রিফিক্স (Prefix)' : 'Invoice Prefix'}
                  </label>
                  <input
                    type="text"
                    value={invoicePrefix}
                    onChange={(e) => setInvoicePrefix(e.target.value.toUpperCase())}
                    placeholder="BK"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm uppercase focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'থার্মাল প্রিন্টার পেপার সাইজ' : 'Thermal Printer Format'}
                  </label>
                  <select
                    value={printerType}
                    onChange={(e) => setPrinterType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  >
                    <option value="80mm">3 Inch (80mm) POS Thermal Printer</option>
                    <option value="58mm">2 Inch (58mm) Mini Bluetooth Printer</option>
                    <option value="a4">Full Page (A4) Laser / Inkjet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'বিলের নিচের শুভেচ্ছাবার্তা (Footer Note)' : 'Receipt Footer Note'}
                </label>
                <input
                  type="text"
                  value={receiptFooterText}
                  onChange={(e) => setReceiptFooterText(e.target.value)}
                  placeholder="আমাদের দোকানে কেনাকাটা করার জন্য ধন্যবাদ! আবার আসবেন।"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="print-qr-on-bill"
                  checked={showQrOnBill}
                  onChange={(e) => setShowQrOnBill(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-600"
                />
                <label htmlFor="print-qr-on-bill" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {language === 'bn' ? 'প্রিন্ট করা বিলে পেমেন্ট কিউআর কোড অন্তর্ভুক্ত থাকবে' : 'Print dynamic UPI QR code on paper receipts'}
                </label>
              </div>
            </div>
          )}

          {/* Action Buttons: Next Tab / Save & Launch */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                const currentIndex = tabs.findIndex(t => t.id === activeTab);
                if (currentIndex > 0) {
                  playSound('click');
                  setActiveTab(tabs[currentIndex - 1].id);
                }
              }}
              disabled={activeTab === 'brand'}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'brand'
                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'bn' ? 'পূর্ববর্তী' : 'Previous'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'bn' ? 'প্রোফাইল সেভ করে বিলিং শুরু করুন' : 'Save & Launch POS Terminal'}</span>
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-3xl mx-auto text-center pt-2">
        <span className="text-xs text-slate-400 dark:text-slate-500">
          BillKart Enterprise POS System • All rights reserved
        </span>
      </footer>
    </div>
  );
}
