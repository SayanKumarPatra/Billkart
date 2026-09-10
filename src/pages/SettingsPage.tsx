import { useState, type FormEvent, type ChangeEvent } from 'react';
import { 
  Store, 
  QrCode, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  Save, 
  FileSpreadsheet,
  Volume2,
  VolumeX,
  Play,
  Globe,
  Sparkles,
  Sun,
  Moon,
  Monitor,
  Palette,
  LogOut
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { playSound } from '../utils/audioHelper';
import { 
  isSoundEnabled, 
  toggleSoundEnabled, 
  playBarcodeScanSuccess
} from '../utils/soundEffects';

export function SettingsPage() {
  const { 
    business, 
    updateBusiness, 
    setCurrentView,
    exportDataJSON, 
    restoreDataJSON, 
    resetToDefaultData,
    logout,
    bills,
    language,
    setLanguage,
    themeMode,
    setThemeMode,
    resolvedTheme,
    t
  } = useApp();

  const [shopName, setShopName] = useState(business.shopName);
  const [ownerName, setOwnerName] = useState(business.ownerName);
  const [phone, setPhone] = useState(business.phone);
  const [email, setEmail] = useState(business.email);
  const [address, setAddress] = useState(business.address);
  const [gstNumber, setGstNumber] = useState(business.gstNumber || '');
  const [upiId, setUpiId] = useState(business.upiId || 'billkart@upi');
  const [invoicePrefix, setInvoicePrefix] = useState(business.invoicePrefix || 'BK');
  
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);
  const [soundActive, setSoundActive] = useState(() => isSoundEnabled());

  const handleToggleSound = () => {
    const nextState = toggleSoundEnabled();
    setSoundActive(nextState);
    if (nextState) {
      playSound('success');
    }
  };

  const handleSaveSettings = (e: FormEvent) => {
    e.preventDefault();
    if (!shopName.trim() || !ownerName.trim()) {
      playSound('error');
      return;
    }
    updateBusiness({
      shopName,
      ownerName,
      phone,
      email,
      address,
      gstNumber,
      upiId,
      invoicePrefix,
    });
    playSound('success');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportBackup = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BillKart_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    playSound('success');
  };

  const handleExportBillsCSV = () => {
    const headers = 'Bill Number,Date,Time,Customer,Phone,Payment Method,Status,Amount\n';
    const rows = bills
      .map(
        b =>
          `"${b.billNumber}","${b.date}","${b.time}","${b.customerName}","${b.customerPhone}","${b.paymentMethod}","${b.paymentStatus}",${b.grandTotal}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BillKart_Bills_Export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    playSound('success');
  };

  const handleRestoreFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = restoreDataJSON(content);
      if (ok) {
        playSound('success');
        setRestoreStatus(language === 'bn' ? 'ডাটা সফলভাবে রিস্টোর হয়েছে!' : 'Data restored successfully!');
      } else {
        playSound('error');
        setRestoreStatus(language === 'bn' ? 'ফাইল ফরম্যাট সঠিক নয়।' : 'Invalid backup file format.');
      }
      setTimeout(() => setRestoreStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-3 sm:p-6 max-w-5xl mx-auto space-y-5 select-none pb-24 lg:pb-8">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
          {t('settingsTitle')}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {language === 'bn' 
            ? 'দোকানের বিবরণ, রসিদ হেডার, ভাষা পছন্দ, ইউপিআই আইডি এবং ডাটা ব্যাকআপ পরিচালনা করুন' 
            : 'Configure store details, printed receipt headers, language preference, UPI payment ID, and data backups'}
        </p>
      </div>

      {/* Language Preference Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Globe className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {language === 'bn' ? 'ভাষা নির্বাচন (Language)' : 'Language Preference'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'bn' 
                ? 'বাংলা বা ইংরেজিতে অ্যাপের সকল মেনু ও ফিচার পরিচালনা করুন' 
                : 'Run your complete POS terminal in English or Bengali'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Bengali Option */}
          <button
            type="button"
            onClick={() => {
              setLanguage('bn');
              playBarcodeScanSuccess();
            }}
            className={`p-4 rounded-xl border text-left transition-colors flex items-center justify-between ${
              language === 'bn'
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-950 dark:text-blue-100 ring-2 ring-blue-600/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 flex items-center justify-center font-bold text-base">
                অ
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block">বাংলা (Bengali)</span>
                <span className="text-xs text-slate-500">সহজ ও সাবলীল বাংলা ইন্টারফেস</span>
              </div>
            </div>
            {language === 'bn' && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                ✓
              </span>
            )}
          </button>

          {/* English Option */}
          <button
            type="button"
            onClick={() => {
              setLanguage('en');
              playBarcodeScanSuccess();
            }}
            className={`p-4 rounded-xl border text-left transition-colors flex items-center justify-between ${
              language === 'en'
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-950 dark:text-blue-100 ring-2 ring-blue-600/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 flex items-center justify-center font-bold text-sm">
                EN
              </div>
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-white block">English</span>
                <span className="text-xs text-slate-500">Standard retail POS English</span>
              </div>
            </div>
            {language === 'en' && (
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                ✓
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Application Settings & Theme Mode Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-blue-600" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {language === 'bn' ? 'থিম মোড সেটিংস' : 'Theme Mode'}
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                {language === 'bn' 
                  ? 'লাইট মোড, ডার্ক মোড অথবা সিস্টেমের সাথে স্বয়ংক্রিয় মিল নির্বাচন করুন।' 
                  : 'Select Light Mode, Dark Mode, or sync with System.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto px-3 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
            <span className="text-slate-500 text-xs">
              {language === 'bn' ? 'বর্তমান কার্যকর:' : 'Active:'}
            </span>
            <span className="font-semibold text-slate-900 dark:text-white capitalize flex items-center gap-1">
              {resolvedTheme === 'light' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>{language === 'bn' ? 'লাইট মোড' : 'Light'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-blue-500" />
                  <span>{language === 'bn' ? 'ডার্ক মোড' : 'Dark'}</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* 3 Theme Choices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Light Mode */}
          <button
            type="button"
            onClick={() => {
              setThemeMode('light');
              playBarcodeScanSuccess();
            }}
            className={`p-4 rounded-xl border text-left transition-colors flex flex-col justify-between ${
              themeMode === 'light'
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 ring-2 ring-blue-600/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-start justify-between mb-3 w-full">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              {themeMode === 'light' && (
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
              )}
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-white block">
                {language === 'bn' ? 'লাইট মোড (Light)' : 'Light Mode'}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'bn' ? 'দিনের আলোতে কাজের জন্য পরিষ্কার সাদা রূপ' : 'Crisp high-contrast daytime interface'}
              </p>
            </div>
          </button>

          {/* Dark Mode */}
          <button
            type="button"
            onClick={() => {
              setThemeMode('dark');
              playBarcodeScanSuccess();
            }}
            className={`p-4 rounded-xl border text-left transition-colors flex flex-col justify-between ${
              themeMode === 'dark'
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 ring-2 ring-blue-600/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-start justify-between mb-3 w-full">
              <div className="w-10 h-10 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center">
                <Moon className="w-5 h-5 text-blue-400" />
              </div>
              {themeMode === 'dark' && (
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
              )}
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-white block">
                {language === 'bn' ? 'ডার্ক মোড (Dark)' : 'Dark Mode'}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'bn' ? 'রাতের বেলা চোখের আরামদায়ক ডার্ক রূপ' : 'Eye-safe dim-light contrast interface'}
              </p>
            </div>
          </button>

          {/* System Mode */}
          <button
            type="button"
            onClick={() => {
              setThemeMode('system');
              playBarcodeScanSuccess();
            }}
            className={`p-4 rounded-xl border text-left transition-colors flex flex-col justify-between ${
              themeMode === 'system'
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 ring-2 ring-blue-600/20'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-start justify-between mb-3 w-full">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                <Monitor className="w-5 h-5" />
              </div>
              {themeMode === 'system' && (
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
              )}
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-white block">
                {language === 'bn' ? 'সিস্টেম মোড (System)' : 'System Sync'}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'bn' ? 'ডিভাইসের সেটিংস অনুসারে স্বয়ংক্রিয় পরিবর্তন' : 'Matches your device operating system theme'}
              </p>
            </div>
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-5">
        {/* Store Profile Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {language === 'bn' ? 'দোকানের বিবরণ ও রসিদ হেডার' : 'Store Details & Receipt Header'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setCurrentView('business-setup');
              }}
              className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 border border-blue-200 dark:border-blue-800 text-xs font-semibold hover:bg-blue-100 flex items-center gap-1.5 self-start sm:self-auto transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {language === 'bn' ? 'A to Z প্রোফাইল উইজার্ড খুলুন' : 'Open Setup Wizard'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'দোকানের নাম *' : 'Shop / Trade Name *'}
              </label>
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'মালিক / বিক্রেতার নাম *' : 'Owner / Contact Name *'}
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'মোবাইল নম্বর *' : 'Phone Number *'}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'ইমেইল অ্যাড্রেস *' : 'Store Email *'}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'দোকানের ঠিকানা (রসিদে প্রিন্ট হবে) *' : 'Store Address (Printed on Invoices) *'}
              </label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 resize-none"
              />
            </div>
          </div>
        </div>

        {/* UPI & Billing Config Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <QrCode className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {language === 'bn' ? 'পেমেন্ট ও বিলিং কনফিগারেশন' : 'Payment & Billing Configuration'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'ডায়নামিক QR কোডের UPI ID *' : 'UPI ID for QR Payments *'}
              </label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="billkart.store@okhdfcbank"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'জিএসটি / ট্যাক্স নম্বর' : 'GSTIN / Tax ID'}
              </label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                placeholder="29ABCDE1234F1Z5"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'bn' ? 'ইনভয়েস প্রিফিক্স' : 'Invoice Prefix'}
              </label>
              <input
                type="text"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                placeholder="BK"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 uppercase font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>{language === 'bn' ? 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে!' : 'Settings saved successfully!'}</span>
              </span>
            ) : (
              <div />
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Configuration'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* POS Audio & Sound Effects Settings Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {language === 'bn' ? 'সাউন্ড ও অডিও ফিডব্যাক' : 'POS Audio Feedback'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'bn' ? 'বারকোড স্ক্যান, বিল তৈরি ও পেমেন্টের ডিজিটাল সাউন্ড' : 'Chimes for scanning, billing and payment confirmation'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleSound}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 border ${
              soundActive
                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 border-blue-200 dark:border-blue-800'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
            }`}
          >
            {soundActive ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span>{soundActive ? (language === 'bn' ? 'সাউন্ড চালু' : 'Sound: Enabled') : (language === 'bn' ? 'সাউন্ড বন্ধ' : 'Sound: Muted')}</span>
          </button>
        </div>

        {/* Audition sound buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white block">সফল কনফার্মেশন</span>
              <span className="text-[10px] text-slate-400">Success Chime</span>
            </div>
            <button
              type="button"
              onClick={() => playSound('success')}
              className="w-full py-2 px-3 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-emerald-600 transition-colors flex items-center justify-center gap-1.5"
            >
              <Play className="w-3 h-3 text-emerald-600" />
              <span>টেস্ট শুনুন</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white block">সতর্কবার্তা ও এরর</span>
              <span className="text-[10px] text-slate-400">Error Sound</span>
            </div>
            <button
              type="button"
              onClick={() => playSound('error')}
              className="w-full py-2 px-3 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-red-600 transition-colors flex items-center justify-center gap-1.5"
            >
              <Play className="w-3 h-3 text-red-600" />
              <span>টেস্ট শুনুন</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white block">স্ক্যানার বিপ</span>
              <span className="text-[10px] text-slate-400">Scanner Beep</span>
            </div>
            <button
              type="button"
              onClick={() => playSound('scan')}
              className="w-full py-2 px-3 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-blue-600 transition-colors flex items-center justify-center gap-1.5"
            >
              <Play className="w-3 h-3 text-blue-600" />
              <span>টেস্ট শুনুন</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-xs font-semibold text-slate-900 dark:text-white block">পেমেন্ট সাকসেস ফ্যানফেয়ার</span>
              <span className="text-[10px] text-slate-400">Fanfare Sound</span>
            </div>
            <button
              type="button"
              onClick={() => playSound('fanfare')}
              className="w-full py-2 px-3 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-amber-600 transition-colors flex items-center justify-center gap-1.5"
            >
              <Play className="w-3 h-3 text-amber-600" />
              <span>টেস্ট শুনুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* Shop Profile Setup & Mobile Account Switch */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
          <Store className="w-4 h-4 text-blue-600" />
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {language === 'bn' ? 'দোকান নিবন্ধন ও মোবাইল একাউন্ট' : 'Shop Setup & Account'}
            </h3>
            <p className="text-[11px] text-slate-500">
              {language === 'bn' ? 'দোকানের নাম, লোগো বদলান অথবা অন্য নম্বর দিয়ে লগইন করুন' : 'Change shop name, logo, or switch mobile'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setCurrentView('business-setup')}
            className="py-3 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Store className="w-4 h-4" />
            <span>{language === 'bn' ? 'দোকানের নাম ও লোগো পরিবর্তন' : 'Edit Shop & Logo'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              logout();
            }}
            className="py-3 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>{language === 'bn' ? 'মোবাইল একাউন্ট পরিবর্তন (লগআউট)' : 'Switch Mobile (Logout)'}</span>
          </button>
        </div>
      </div>

      {/* Data Backup & Restore Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Download className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            {language === 'bn' ? 'ডাটা ব্যাকআপ ও এক্সপোর্ট' : 'Data Backup & Export'}
          </h3>
        </div>

        <p className="text-xs text-slate-500">
          {language === 'bn' 
            ? 'আপনার কোনো হিসাব কখনো হারাবে না। এক ক্লিকে সম্পূর্ণ বিল, পণ্য ও গ্রাহক তালিকা ব্যাকআপ রাখুন বা এক্সেলে এক্সপোর্ট করুন।' 
            : 'Export store data as standard JSON or CSV spreadsheets to keep local backups.'}
        </p>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={handleExportBackup}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-blue-600" />
            <span>{language === 'bn' ? 'ফুল ব্যাকআপ ডাউনলোড (JSON)' : 'Download Backup (JSON)'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportBillsCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>{language === 'bn' ? 'ইনভয়েস এক্সেল এক্সপোর্ট (CSV)' : 'Export to Excel (CSV)'}</span>
          </button>

          <label className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4 text-blue-600" />
            <span>{language === 'bn' ? 'ব্যাকআপ থেকে রিস্টোর' : 'Restore From Backup'}</span>
            <input
              type="file"
              accept=".json"
              onChange={handleRestoreFile}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => {
              if (confirm(language === 'bn' ? 'আপনি কি ডেমো ডাটা রিসেট করতে চান?' : 'Reset store data to empty state?')) {
                resetToDefaultData();
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 hover:bg-red-100 text-xs font-semibold text-red-600 border border-red-200 dark:border-red-800 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{language === 'bn' ? 'ডেমো ডাটা রিসেট' : 'Reset Demo Data'}</span>
          </button>
        </div>

        {restoreStatus && (
          <p className="text-xs font-bold text-blue-600 mt-2">{restoreStatus}</p>
        )}
      </div>
    </div>
  );
}
