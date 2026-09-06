import { useState } from 'react';
import { 
  Bell, 
  Barcode, 
  ShoppingCart, 
  CheckCircle2, 
  AlertTriangle,
  Volume2, 
  VolumeX, 
  Globe, 
  LogOut, 
  Sun, 
  Moon, 
  Monitor,
  Store
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { BillKartLogo } from '../BillKartLogo';
import { isSoundEnabled, toggleSoundEnabled, playBarcodeScanSuccess } from '../../utils/soundEffects';

export function AppHeader() {
  const { 
    currentView, 
    setCurrentView, 
    business, 
    openScanner, 
    cartItems, 
    notifications, 
    markNotificationRead,
    clearNotifications,
    language,
    setLanguage,
    themeMode,
    setThemeMode,
    t,
    logout
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleToggleTheme = () => {
    const nextMode = themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'system' : 'light';
    setThemeMode(nextMode);
    playBarcodeScanSuccess();
  };

  const handleToggleSound = () => {
    const newState = toggleSoundEnabled();
    setSoundOn(newState);
    if (newState) {
      playBarcodeScanSuccess();
    }
  };

  const handleToggleLanguage = () => {
    const newLang = language === 'bn' ? 'en' : 'bn';
    setLanguage(newLang);
    playBarcodeScanSuccess();
  };

  const viewTitles: Record<string, string> = {
    dashboard: t('welcomeTitle'),
    'create-bill': t('posBillingTitle'),
    products: t('productsInventoryTitle'),
    customers: t('customerDirectoryTitle'),
    bills: t('navBills'),
    reports: t('viewAllReports'),
    settings: t('settingsTitle'),
    help: t('navHelp'),
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 py-2.5 select-none transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Brand Logo / Desktop Page Title */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <BillKartLogo size="sm" showTagline={false} horizontal={true} />
          </div>

          <div className="hidden lg:block">
            <h1 className="text-base font-bold text-slate-900 dark:text-white font-display">
              {viewTitles[currentView] || 'BillKart POS'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
              {business.shopName || 'Retail Store'} • {business.address?.split(',')[0] || 'Kolkata'}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick Camera Scan Trigger */}
          <button
            type="button"
            onClick={openScanner}
            title="Scan Barcode via Camera"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
          >
            <Barcode className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Scan</span>
          </button>

          {/* Quick Create Bill / Cart Pill */}
          <button
            type="button"
            onClick={() => setCurrentView('create-bill')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentView === 'create-bill'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Bill</span>
            {cartItems.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                currentView === 'create-bill' ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
              }`}>
                {cartItems.length}
              </span>
            )}
          </button>

          {/* 1-Click Language Switcher Button */}
          <button
            type="button"
            onClick={handleToggleLanguage}
            title={language === 'bn' ? 'Switch interface to English' : 'ইন্টারফেস বাংলায় পরিবর্তন করুন'}
            className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1 shadow-2xs"
          >
            <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-[11px] font-bold">
              {language === 'bn' ? 'বাং' : 'EN'}
            </span>
          </button>

          {/* Quick Theme Switcher Button */}
          <button
            type="button"
            onClick={handleToggleTheme}
            className="p-1.5 sm:px-2 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
          >
            {themeMode === 'light' ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : themeMode === 'dark' ? (
              <Moon className="w-4 h-4 text-blue-400" />
            ) : (
              <Monitor className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Sound Effects Toggle Button */}
          <button
            type="button"
            onClick={handleToggleSound}
            title={soundOn ? 'Audio feedback enabled' : 'Audio feedback muted'}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Notifications Flyout Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-[9px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div 
                className="absolute right-0 mt-2 w-72 sm:w-88 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-3 z-50 text-xs space-y-2.5"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Store Notifications</span>
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={clearNotifications}
                      className="text-[11px] text-slate-400 hover:text-red-500"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-center py-5 text-slate-400">কোনো নোটিফিকেশন নেই</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl border transition-colors cursor-pointer flex items-start gap-2 ${
                          n.read
                            ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-500'
                            : 'bg-blue-50/50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-800/60 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {n.type === 'stock' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[11px] truncate">{n.title}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{n.message}</p>
                          <span className="text-[9px] text-slate-400 mt-0.5 block">{n.timestamp}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Shopkeeper Profile & Logout Button */}
          <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentView('settings')}
              title={business.shopName || 'Store Settings'}
              className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                {business.shopName ? business.shopName[0] : 'S'}
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                {business.shopName || 'Store'}
              </span>
            </button>

            <button
              type="button"
              onClick={logout}
              title={language === 'bn' ? 'লগআউট' : 'Logout'}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
