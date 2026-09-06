import { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Barcode, 
  Package, 
  Menu, 
  X, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  Globe, 
  Sun, 
  Moon, 
  Monitor, 
  RotateCcw,
  LogOut,
  Compass
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { AppView } from '../../types';
import { playSound } from '../../utils/audioHelper';

export function MobileBottomNav() {
  const { 
    currentView, 
    setCurrentView, 
    openScanner, 
    cartItems, 
    language, 
    setLanguage, 
    themeMode, 
    setThemeMode,
    business,
    logout
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNav = (view: AppView) => {
    playSound('click');
    setCurrentView(view);
    setIsMenuOpen(false);
  };

  const handleScanClick = () => {
    playSound('scan');
    openScanner();
    setIsMenuOpen(false);
  };

  const toggleLanguage = () => {
    playSound('click');
    setLanguage(language === 'bn' ? 'en' : 'bn');
  };

  const toggleTheme = () => {
    const next = themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'system' : 'light';
    setThemeMode(next);
    playSound('click');
  };

  const restartFlow = () => {
    playSound('click');
    try {
      sessionStorage.removeItem('billkart_session_started');
    } catch (e) { /* ignore */ }
    setIsMenuOpen(false);
    setCurrentView('splash');
  };

  return (
    <>
      {/* Expanded Menu Drawer (Modal Sheet) */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="relative bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl p-5 shadow-2xl z-10 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {business.shopName || 'BillKart POS'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {business.ownerName || 'দোকানদার'} • {language === 'bn' ? 'মেনু ও সেটিংস' : 'Menu & Tools'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleNav('customers')}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left border border-slate-200/80 dark:border-slate-800 transition-colors"
              >
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                    {language === 'bn' ? 'কাস্টমার খতিয়ান' : 'Customers'}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {language === 'bn' ? 'বাকি ও কাস্টমার তালিকা' : 'Directory & dues'}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleNav('bills')}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left border border-slate-200/80 dark:border-slate-800 transition-colors"
              >
                <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                    {language === 'bn' ? 'সকল ইনভয়েস' : 'All Bills'}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {language === 'bn' ? 'ইতিহাস ও প্রিন্ট' : 'History & reprint'}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleNav('reports')}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left border border-slate-200/80 dark:border-slate-800 transition-colors"
              >
                <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                    {language === 'bn' ? 'বিক্রয় রিপোর্ট' : 'Reports'}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {language === 'bn' ? 'দৈনিক হিসাব ও লাভ' : 'Sales & insights'}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleNav('settings')}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left border border-slate-200/80 dark:border-slate-800 transition-colors"
              >
                <Settings className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                    {language === 'bn' ? 'দোকান সেটিংস' : 'Settings'}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {language === 'bn' ? 'ইউপিআই ও প্রোফাইল' : 'UPI & printer'}
                  </span>
                </div>
              </button>
            </div>

            {/* Quick Toggle Controls */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {language === 'bn' ? 'ভাষা নির্বাচন' : 'Language'}
                </span>
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-blue-600 dark:text-blue-400"
                >
                  {language === 'bn' ? 'বাংলা (বাং)' : 'English (EN)'}
                </button>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {language === 'bn' ? 'থিম ডিসপ্লে' : 'Theme Mode'}
                </span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
                >
                  {themeMode === 'light' ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5 text-blue-400" />}
                  <span className="capitalize">{themeMode}</span>
                </button>
              </div>
            </div>

            {/* Tour & Logout */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={restartFlow}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Compass className="w-4 h-4 text-blue-600" />
                <span>{language === 'bn' ? 'গাইড ও টিউটোরিয়াল' : 'Tutorial Guide'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className="py-2.5 px-4 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 text-xs font-semibold flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>{language === 'bn' ? 'লগ আউট' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern, Rock-Solid Bottom Navigation Bar */}
      <nav 
        id="mobile-bottom-nav"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 safe-area-pb transition-colors shadow-lg"
      >
        <div className="flex items-center justify-around px-1 py-1.5 max-w-md mx-auto">
          {/* 1. Dashboard */}
          <button
            type="button"
            id="mobile-nav-dashboard"
            onClick={() => handleNav('dashboard')}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-colors min-h-[46px] ${
              currentView === 'dashboard'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight truncate w-full text-center">
              {language === 'bn' ? 'ড্যাশবোর্ড' : 'Home'}
            </span>
          </button>

          {/* 2. Create Bill / Cart */}
          <button
            type="button"
            id="mobile-nav-create-bill"
            onClick={() => handleNav('create-bill')}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-colors relative min-h-[46px] ${
              currentView === 'create-bill'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 mb-0.5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-600 text-white">
                  {cartItems.length}
                </span>
              )}
            </div>
            <span className="text-[10px] leading-tight truncate w-full text-center">
              {language === 'bn' ? 'বিল তৈরি' : 'Billing'}
            </span>
          </button>

          {/* 3. Central Barcode Scanner */}
          <div className="flex-1 flex justify-center -mt-3">
            <button
              type="button"
              id="mobile-nav-scanner"
              onClick={handleScanClick}
              className="w-12 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex flex-col items-center justify-center shadow-md transition-all"
              title="Scan Barcode"
            >
              <Barcode className="w-6 h-6" />
            </button>
          </div>

          {/* 4. Products */}
          <button
            type="button"
            id="mobile-nav-products"
            onClick={() => handleNav('products')}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-colors min-h-[46px] ${
              currentView === 'products'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Package className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight truncate w-full text-center">
              {language === 'bn' ? 'পণ্য স্টক' : 'Items'}
            </span>
          </button>

          {/* 5. More Menu */}
          <button
            type="button"
            id="mobile-nav-menu"
            onClick={() => setIsMenuOpen(true)}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-colors min-h-[46px] ${
              isMenuOpen
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight truncate w-full text-center">
              {language === 'bn' ? 'মেনু' : 'Menu'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
