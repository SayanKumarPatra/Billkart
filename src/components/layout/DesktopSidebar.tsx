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
  Store, 
  PlusCircle, 
  Sparkles,
  ChevronRight
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
  const { currentView, setCurrentView, business, openScanner, cartItems } = useApp();

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'create-bill', label: 'Create Bill', icon: PlusCircle, badge: cartItems.length > 0 ? `${cartItems.length}` : undefined },
    { id: 'scan-product', label: 'Scan Product', icon: Barcode, isAction: true },
    { id: 'products', label: 'Products & Stock', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'bills', label: 'Bills History', icon: FileText },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Business Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const handleNavClick = (item: NavItem) => {
    if (item.isAction) {
      openScanner();
    } else {
      setCurrentView(item.id);
    }
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-[#100C14] border-r border-white/10 text-[#F5F5F7] sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <BillKartLogo size="sm" showTagline={false} showScript={false} animate={false} horizontal={true} />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold font-display text-white block truncate">
              {business.shopName}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-[#FFA000]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF1E42] animate-pulse" />
              <span>POS Terminal Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              type="button"
              id={`sidebar-nav-${item.id}`}
              onClick={() => handleNavClick(item)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-[#27131F] text-[#FFA000] border border-[#FF1E42]/35 shadow-[0_4px_14px_rgba(255,30,66,0.18)]'
                  : 'text-[#A09CA8] hover:text-white hover:bg-[#1C121D]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-[#FF1E42]/20 text-[#FFA000]'
                      : 'text-[#A09CA8] group-hover:text-[#FF4A6B]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF1E42] text-white">
                  {item.badge}
                </span>
              )}

              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-[#FFA000]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick POS Terminal Card in sidebar */}
      <div className="p-3 m-3 rounded-2xl bg-[#18111D] border border-white/10">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[#A09CA8]">Active Cart</span>
          <span className="font-bold text-[#FFA000]">{cartItems.length} items</span>
        </div>
        <button
          type="button"
          onClick={() => setCurrentView('create-bill')}
          className="w-full py-2 rounded-xl btn-primary-gradient text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
        >
          <ReceiptText className="w-3.5 h-3.5" />
          <span>Go to Billing</span>
        </button>
      </div>

      {/* Bottom Profile Footer */}
      <div className="p-3.5 border-t border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#27131F] border border-[#FF1E42]/30 flex items-center justify-center font-bold text-[#FFA000]">
            {business.ownerName ? business.ownerName[0] : 'S'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">{business.ownerName}</p>
            <p className="text-[10px] text-[#A09CA8] truncate">{business.phone}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
