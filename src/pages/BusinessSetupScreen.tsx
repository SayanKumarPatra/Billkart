import { useState, type FormEvent } from 'react';
import { 
  Store, 
  User, 
  MapPin, 
  Phone, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Check
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { BrandLogo } from '../components/common/BrandLogo';
import { playSound } from '../utils/audioHelper';

// Preset Shop Avatars & Logos
const SHOP_LOGO_PRESETS = [
  { id: 'grocery', emoji: '🛒', label: 'মুদিখানা', bg: 'bg-emerald-500' },
  { id: 'general', emoji: '🏪', label: 'ভ্যারাইটি স্টোর', bg: 'bg-blue-600' },
  { id: 'garments', emoji: '👕', label: 'পোশাক ও বস্ত্রালয়', bg: 'bg-purple-600' },
  { id: 'mobile', emoji: '📱', label: 'মোবাইল ও ইলেকট্রনিক্স', bg: 'bg-amber-500' },
  { id: 'pharmacy', emoji: '💊', label: 'ফার্মেসি ও ঔষধ', bg: 'bg-rose-500' },
  { id: 'restaurant', emoji: '🍽️', label: 'হোটেল ও রেস্তোরাঁ', bg: 'bg-orange-500' },
  { id: 'sweets', emoji: '🥐', label: 'মিষ্টান্ন ও বেকারি', bg: 'bg-yellow-600' },
  { id: 'billkart', emoji: '⚡', label: 'বিলকার্ট স্মার্ট', bg: 'bg-red-600' },
];

const SHOP_CATEGORIES = [
  'মুদিখানা ও জেনারেল স্টোর (Grocery)',
  'বস্ত্রালয় ও তৈরি পোশাক (Clothing)',
  'ইলেকট্রনিক্স ও মোবাইল শপ (Electronics)',
  'ফার্মেসি ও ঔষধের দোকান (Pharmacy)',
  'হোটেল, রেস্তোরাঁ ও বেকারি (Food & Cafe)',
  'হার্ডওয়্যার ও স্যানিটারি (Hardware)',
  'বই, খাতা ও স্টেশনারি (Stationery)',
  'অন্যান্য রিটেল ব্যবসা (Other)',
];

export function BusinessSetupScreen() {
  const { 
    business, 
    updateBusiness, 
    user, 
    setUser, 
    setCurrentView, 
    language 
  } = useApp();

  const isBn = language === 'bn';

  // Form states
  const [selectedLogoId, setSelectedLogoId] = useState(business.logoUrl || 'general');
  const [shopName, setShopName] = useState(business.shopName || 'পাত্র ভ্যারাইটি স্টোর');
  const [ownerName, setOwnerName] = useState(business.ownerName || user.name || 'সায়ন পাত্র');
  const [category, setCategory] = useState(business.category || SHOP_CATEGORIES[0]);
  const [address, setAddress] = useState(business.address || '১২/বি, বাজার রোড, কলকাতা');
  const [city, setCity] = useState(business.city || 'কলকাতা');
  const [phone, setPhone] = useState(user.phone || business.phone || '9876543210');
  const [upiId, setUpiId] = useState(business.upiId || `${user.phone || '9876543210'}@upi`);

  const [nameError, setNameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedPreset = SHOP_LOGO_PRESETS.find(p => p.id === selectedLogoId) || SHOP_LOGO_PRESETS[1];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = shopName.trim();
    if (!trimmedName) {
      playSound('error');
      setNameError(isBn ? 'দোকানের নাম লিখুন' : 'Please enter shop name');
      return;
    }
    setNameError('');
    setIsSubmitting(true);
    playSound('success');

    setTimeout(() => {
      // Save business profile
      updateBusiness({
        shopName: trimmedName,
        ownerName: ownerName.trim() || (isBn ? 'দোকানদার' : 'Shop Owner'),
        category,
        address: address.trim(),
        city: city.trim(),
        phone: phone.trim(),
        upiId: upiId.trim(),
        logoUrl: selectedLogoId,
      });

      // Mark setup as completed in user account
      setUser(prev => ({
        ...prev,
        storeName: trimmedName,
        name: ownerName.trim() || prev.name,
        hasCompletedSetup: true,
        isAuthenticated: true,
      }));

      // Directly open Dashboard!
      setCurrentView('dashboard');
      setIsSubmitting(false);
    }, 350);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-slate-50 dark:bg-slate-950 p-4 select-none overflow-y-auto">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
            ২
          </span>
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {isBn ? 'দোকান নিবন্ধন ও প্রোফাইল' : 'Shop Registration'}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{isBn ? 'মোবাইল ভেরিফায়েড' : 'Phone Verified'}</span>
        </div>
      </div>

      {/* Main Registration Form Container */}
      <form onSubmit={handleSubmit} className="my-auto py-2 space-y-3.5 max-w-sm mx-auto w-full">
        
        {/* Section 1: Logo & Avatar Picker */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{isBn ? 'দোকানের লোগো / আইকন নির্বাচন করুন' : 'Choose Shop Logo / Icon'}</span>
            </span>
            <span className="text-[10px] text-blue-600 font-bold">
              {selectedPreset.label}
            </span>
          </div>

          {/* Active Logo Big Preview */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className={`w-12 h-12 rounded-xl ${selectedPreset.bg} text-white text-2xl flex items-center justify-center shadow-md shrink-0`}>
              {selectedPreset.emoji}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                {shopName || (isBn ? 'আপনার দোকানের নাম' : 'Your Shop Name')}
              </div>
              <div className="text-[10px] text-slate-500 truncate font-medium">
                {category}
              </div>
            </div>
          </div>

          {/* Logo Presets Grid (8 Sleek Mobile Icons) */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {SHOP_LOGO_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  playSound('click');
                  setSelectedLogoId(preset.id);
                }}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all relative ${
                  selectedLogoId === preset.id
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/50 shadow-xs scale-102'
                    : 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800 hover:border-slate-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg ${preset.bg} text-white text-lg flex items-center justify-center shadow-2xs`}>
                  {preset.emoji}
                </div>
                <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 truncate w-full text-center">
                  {preset.label}
                </span>
                {selectedLogoId === preset.id && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xs">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Shop Details Inputs */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2.5">
          
          {/* Shop Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Store className="w-3 h-3 text-blue-600" />
                <span>{isBn ? 'দোকানের নাম' : 'Shop Name'}</span>
                <span className="text-red-500">*</span>
              </span>
              {nameError && <span className="text-[10px] text-red-500">{nameError}</span>}
            </label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => {
                setShopName(e.target.value);
                if (nameError) setNameError('');
              }}
              placeholder={isBn ? 'উদাঃ সায়ন জেনারেল স্টোর' : 'e.g. Sayan General Store'}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
              autoFocus
            />
          </div>

          {/* Owner Name & Phone */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <User className="w-3 h-3 text-emerald-600" />
                <span>{isBn ? 'মালিকের নাম' : 'Owner Name'}</span>
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="সায়ন পাত্র"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Phone className="w-3 h-3 text-blue-600" />
                <span>{isBn ? 'মোবাইল' : 'Mobile'}</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30"
              />
            </div>
          </div>

          {/* Shop Category */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              {isBn ? 'ব্যবসার ধরণ (ক্যাটাগরি)' : 'Business Category'}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            >
              {SHOP_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Address & City */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-500" />
              <span>{isBn ? 'দোকানের ঠিকানা ও শহর' : 'Address & City'}</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={isBn ? '১২/বি, বাজার রোড, কলকাতা' : '12/B, Market Road, Kolkata'}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            />
          </div>

          {/* UPI ID (Optional for QR Bill) */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <QrCode className="w-3 h-3 text-purple-600" />
                <span>{isBn ? 'UPI আইডি (QR পেমেন্ট বিলের জন্য)' : 'UPI ID (For QR on Bill)'}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                {isBn ? 'ঐচ্ছিক' : 'Optional'}
              </span>
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="9876543210@upi"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/30"
            />
          </div>

        </div>

        {/* Submit Button: Directly opens the Dashboard! */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-98 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>{isBn ? 'দোকান নিবন্ধন সম্পন্ন করুন ও ড্যাশবোর্ডে প্রবেশ করুন' : 'Complete Setup & Open Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer Branding */}
      <div className="text-center pt-1 pb-1">
        <p className="text-[10px] text-slate-400">
          Powered by BillKart Smart POS
        </p>
      </div>

    </div>
  );
}
