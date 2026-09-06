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
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-[#0B2822] border-r border-[#19D66B]/15 text-[#F5F7F6] sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#19D66B]/15">
        <div className="flex items-center gap-3">
          <BillKartLogo size="sm" showTagline={false} showScript={false} animate={false} />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold font-display text-[#F5F7F6] block truncate">
              {business.shopName}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-[#57E39B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#19D66B] animate-pulse" />
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
                  ? 'bg-gradient-to-r from-[#10352D] to-[#10352D]/80 text-[#B8F500] border border-[#19D66B]/30 shadow-[0_4px_14px_rgba(25,214,107,0.15)]'
                  : 'text-[#A9B8B3] hover:text-[#F5F7F6] hover:bg-[#10352D]/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-[#19D66B]/20 text-[#B8F500]'
                      : 'text-[#A9B8B3] group-hover:text-[#57E39B]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#19D66B] text-[#061B16]">
                  {item.badge}
                </span>
              )}

              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-[#B8F500]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick POS Terminal Card in sidebar */}
      <div className="p-3 m-3 rounded-2xl bg-[#061B16]/80 border border-[#19D66B]/20">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[#A9B8B3]">Active Cart</span>
          <span className="font-bold text-[#57E39B]">{cartItems.length} items</span>
        </div>
        <button
          type="button"
          onClick={() => setCurrentView('create-bill')}
          className="w-full py-2 rounded-xl bg-gradient-to-r from-[#19D66B] to-[#B8F500] text-[#061B16] font-bold text-xs shadow-md hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
        >
          <ReceiptText className="w-3.5 h-3.5" />
          <span>Go to Billing</span>
        </button>
      </div>

      {/* Bottom Profile Footer */}
      <div className="p-3.5 border-t border-[#19D66B]/15 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#10352D] border border-[#19D66B]/30 flex items-center justify-center font-bold text-[#57E39B]">
            {business.ownerName ? business.ownerName[0] : 'R'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#F5F7F6] truncate">{business.ownerName}</p>
            <p className="text-[10px] text-[#A9B8B3] truncate">{business.phone}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
