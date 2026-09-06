import { 
  LayoutDashboard, 
  ReceiptText, 
  Barcode, 
  Package, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  PlusCircle, 
  LogOut,
  Sparkles,
  Compass
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { BillKartLogo } from '../BillKartLogo';
import { AppView } from '../../types';

interface NavItem {
  id: AppView;
  label: string;
  icon: any;
  badge?: string;
  isAction?: boolean;
}

export function DesktopSidebar() {
  const { currentView, setCurrentView, business, openScanner, cartItems, t, logout, language } = useApp();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'create-bill', label: t('navCreateBill'), icon: PlusCircle, badge: cartItems.length > 0 ? `${cartItems.length}` : undefined },
    { id: 'scan-product', label: t('navScanBarcode'), icon: Barcode, isAction: true },
    { id: 'products', label: t('navProducts'), icon: Package },
    { id: 'customers', label: t('navCustomers'), icon: Users },
    { id: 'bills', label: t('navBills'), icon: FileText },
    { id: 'reports', label: t('navReports'), icon: BarChart3 },
    { id: 'settings', label: t('navSettings'), icon: Settings },
    { id: 'help', label: t('navHelp'), icon: HelpCircle },
  ];

  const handleNavClick = (item: NavItem) => {
    if (item.isAction) {
      openScanner();
    } else {
      setCurrentView(item.id);
    }
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <BillKartLogo size="sm" showTagline={false} horizontal={true} />
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
            {business.shopName || 'Retail Store'}
          </span>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Active</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              type="button"
              id={`sidebar-nav-${item.id}`}
              onClick={() => handleNavClick(item)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/80 shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info & Logout */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <button
          type="button"
          onClick={() => setCurrentView('onboarding')}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Compass className="w-4 h-4 text-blue-600" />
          <span>{language === 'bn' ? 'অ্যাপ গাইড ও টিউটোরিয়াল' : 'Feature Guide'}</span>
        </button>

        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            <span>{language === 'bn' ? 'লগ আউট' : 'Log Out'}</span>
          </div>
          <span className="text-[10px] text-slate-400">{business.ownerName?.split(' ')[0]}</span>
        </button>
      </div>
    </aside>
  );
}
