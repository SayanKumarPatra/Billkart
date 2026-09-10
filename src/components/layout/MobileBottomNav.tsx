import { useState } from 'react';
import { 
  LayoutGrid, 
  Receipt, 
  Barcode, 
  Package, 
  Menu, 
  X, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Sparkles,
  Store
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
    products,
    language, 
    business,
    logout
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lowStockCount = products.filter(p => p.stock <= p.minStockAlert).length;

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

  return (
    <>
      {/* Expanded Menu Drawer (Modal Sheet) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="relative bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl p-4 sm:p-5 shadow-2xl z-10 max-h-[82vh] overflow-y-auto space-y-3.5">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200/60 dark:border-blue-800/60">
                  <Store className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {business.shopName || 'BillKart POS'}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {business.ownerName || 'দোকানদার'} • {language === 'bn' ? 'সকল মেনু ও ফিচার' : 'All Menus & Features'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Navigation Grid */}
            <div className="grid grid-cols-2 gap-2">
              {/* Customers */}
              <button
                type="button"
                onClick={() => handleNav('customers')}
                className={`flex items-center gap-2.5 p-3 rounded-xl text-left border transition-all ${
                  currentView === 'customers'
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                    : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                    {language === 'bn' ? 'গ্রাহক খতিয়ান' : 'Customers'}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {language === 'bn' ? 'বাকি ও কাস্টমার' : 'Ledger & dues'}
                  </span>
                </div>
              </button>

              {/* Bills & Invoices */}
              <button
                type="button"
                onClick={() => handleNav('bills')}
                className={`flex items-center gap-2.5 p-3 rounded-xl text-left border transition-all ${
                  currentView === 'bills'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                    {language === 'bn' ? 'সকল ইনভয়েস' : 'Invoices'}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {language === 'bn' ? 'ইতিহাস ও প্রিন্ট' : 'History & print'}
                  </span>
                </div>
              </button>

              {/* Reports */}
              <button
                type="button"
                onClick={() => handleNav('reports')}
                className={`flex items-center gap-2.5 p-3 rounded-xl text-left border transition-all ${
                  currentView === 'reports'
                    ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300'
                    : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                    {language === 'bn' ? 'বিক্রয় রিপোর্ট' : 'Reports'}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {language === 'bn' ? 'দৈনিক লাভ-লোকসান' : 'Sales & insights'}
                  </span>
                </div>
              </button>

              {/* Settings */}
              <button
                type="button"
                onClick={() => handleNav('settings')}
                className={`flex items-center gap-2.5 p-3 rounded-xl text-left border transition-all ${
                  currentView === 'settings'
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300'
                    : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Settings className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                    {language === 'bn' ? 'দোকান সেটিংস' : 'Settings'}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {language === 'bn' ? 'ইউপিআই ও প্রিন্টার' : 'UPI & printer'}
                  </span>
                </div>
              </button>
            </div>

            {/* Help & Support Button */}
            <button
              type="button"
              onClick={() => handleNav('help')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 text-left transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    {language === 'bn' ? 'সহায়তা ও ব্যবহার নির্দেশিকা' : 'Help & User Guide'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {language === 'bn' ? 'প্রশ্নোত্তর ও টিউটোরিয়াল' : 'FAQ & Support'}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* Clean Logout */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>BillKart Mobile v2.6</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className="py-2 px-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'লগ আউট' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern, Thumb-Friendly Mobile Bottom Navigation Bar */}
      <nav 
        id="mobile-bottom-nav"
        className="sticky bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 safe-area-pb transition-colors shadow-lg shrink-0"
      >
        <div className="flex items-center justify-around px-1 py-1.5 w-full">
          {/* 1. Dashboard */}
          <button
            type="button"
            id="mobile-nav-dashboard"
            onClick={() => handleNav('dashboard')}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all min-h-[46px] ${
              currentView === 'dashboard'
                ? 'text-blue-600 dark:text-blue-400 font-bold scale-102'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] leading-tight truncate w-full text-center">
              {language === 'bn' ? 'ড্যাশবোর্ড' : 'Home'}
            </span>
          </button>

          {/* 2. Billing / Cart */}
          <button
            type="button"
            id="mobile-nav-create-bill"
            onClick={() => handleNav('create-bill')}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative min-h-[46px] ${
              currentView === 'create-bill'
                ? 'text-blue-600 dark:text-blue-400 font-bold scale-102'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Receipt className="w-5 h-5 mb-0.5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-600 text-white animate-bounce">
                  {cartItems.length}
                </span>
              )}
            </div>
            <span className="text-[10px] leading-tight truncate w-full text-center">
              {language === 'bn' ? 'ক্যাশ মেমো' : 'Billing'}
            </span>
          </button>

          {/* 3. Central Prominent Scanner FAB */}
          <div className="flex-1 flex justify-center -mt-3.5">
            <button
              type="button"
              id="mobile-nav-scanner"
              onClick={handleScanClick}
              className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 active:scale-95 text-white flex flex-col items-center justify-center shadow-lg shadow-blue-500/30 transition-all border-2 border-white dark:border-slate-900"
              title="Scan Barcode via Camera"
            >
              <Barcode className="w-6 h-6" />
            </button>
          </div>

          {/* 4. Products / Stock */}
          <button
            type="button"
            id="mobile-nav-products"
            onClick={() => handleNav('products')}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative min-h-[46px] ${
              currentView === 'products'
                ? 'text-blue-600 dark:text-blue-400 font-bold scale-102'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Package className="w-5 h-5 mb-0.5" />
              {lowStockCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              )}
            </div>
            <span className="text-[10px] leading-tight truncate w-full text-center">
              {language === 'bn' ? 'পণ্য স্টক' : 'Stock'}
            </span>
          </button>

          {/* 5. More Menu */}
          <button
            type="button"
            id="mobile-nav-menu"
            onClick={() => setIsMenuOpen(true)}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all min-h-[46px] ${
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
