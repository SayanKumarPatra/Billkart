import { useState } from 'react';
import { 
  Bell, 
  Barcode, 
  Plus, 
  ShoppingCart, 
  Store, 
  CheckCircle2, 
  AlertTriangle,
  X
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { BillKartLogo } from '../BillKartLogo';

export function AppHeader() {
  const { 
    currentView, 
    setCurrentView, 
    business, 
    openScanner, 
    cartItems, 
    notifications, 
    markNotificationRead,
    clearNotifications
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const viewTitles: Record<string, string> = {
    dashboard: 'Dashboard Overview',
    'create-bill': 'Smart POS Billing',
    products: 'Product Inventory',
    customers: 'Customer Directory',
    bills: 'Invoices & Bill History',
    reports: 'Sales & Revenue Analytics',
    settings: 'Business & UPI Settings',
    help: 'Help Center & Support',
  };

  return (
    <header className="sticky top-0 z-20 bg-[#0B2822]/90 backdrop-blur-md border-b border-[#19D66B]/15 px-4 sm:px-6 py-3 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Mobile Brand Logo / Desktop Page Title */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <BillKartLogo size="sm" showTagline={false} showScript={false} animate={false} />
          </div>

          <div className="hidden lg:block">
            <h1 className="text-lg font-bold font-display text-[#F5F7F6]">
              {viewTitles[currentView] || 'BillKart POS'}
            </h1>
            <p className="text-xs text-[#A9B8B3]">
              {business.shopName} • {business.address.split(',')[0]}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Camera Scan Trigger */}
          <button
            type="button"
            onClick={openScanner}
            title="Scan Barcode via Camera"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10352D] hover:bg-[#19D66B]/20 border border-[#19D66B]/30 text-xs font-semibold text-[#57E39B] hover:text-[#B8F500] transition-colors"
          >
            <Barcode className="w-4 h-4 text-[#B8F500]" />
            <span className="hidden sm:inline">Scan Barcode</span>
          </button>

          {/* Quick Create Bill / Cart Pill */}
          <button
            type="button"
            onClick={() => setCurrentView('create-bill')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentView === 'create-bill'
                ? 'bg-[#19D66B] text-[#061B16] shadow-[0_0_15px_rgba(25,214,107,0.4)]'
                : 'bg-gradient-to-r from-[#10352D] to-[#10352D]/80 hover:bg-[#19D66B]/20 border border-[#19D66B]/30 text-[#F5F7F6]'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Current Bill</span>
            {cartItems.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-[#B8F500] text-[#061B16]">
                {cartItems.length}
              </span>
            )}
          </button>

          {/* Notifications Flyout Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-[#10352D] hover:bg-[#19D66B]/20 border border-[#19D66B]/30 text-[#A9B8B3] hover:text-[#F5F7F6] transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div 
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0B2822] border border-[#19D66B]/30 shadow-2xl p-4 z-50 text-xs space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#19D66B]/15">
                  <span className="font-bold text-sm text-[#F5F7F6]">Store Notifications</span>
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={clearNotifications}
                      className="text-[11px] text-[#A9B8B3] hover:text-red-400"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-center py-6 text-[#A9B8B3]">No notifications right now</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl border transition-colors cursor-pointer flex items-start gap-2.5 ${
                          n.read
                            ? 'bg-[#061B16]/50 border-transparent text-[#A9B8B3]'
                            : 'bg-[#10352D] border-[#19D66B]/25 text-[#F5F7F6]'
                        }`}
                      >
                        {n.type === 'stock' ? (
                          <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-[#19D66B] shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[11px] truncate">{n.title}</p>
                          <p className="text-[10px] text-[#A9B8B3] mt-0.5">{n.message}</p>
                          <span className="text-[9px] text-[#57E39B] mt-1 block">{n.timestamp}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
