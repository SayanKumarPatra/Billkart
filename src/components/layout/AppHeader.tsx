import { useState } from 'react';
import { 
  Bell, 
  Barcode, 
  Plus, 
  ShoppingCart, 
  Store, 
  CheckCircle2, 
  AlertTriangle,
  X,
  Volume2,
  VolumeX
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
    clearNotifications
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleToggleSound = () => {
    const newState = toggleSoundEnabled();
    setSoundOn(newState);
    if (newState) {
      playBarcodeScanSuccess();
    }
  };

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
    <header className="sticky top-0 z-20 bg-[#120E16]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Mobile Brand Logo / Desktop Page Title */}
        <div className="flex items-center gap-3">
          <div className="lg:hidden">
            <BillKartLogo size="sm" showTagline={false} showScript={false} animate={false} horizontal={true} />
          </div>

          <div className="hidden lg:block">
            <h1 className="text-lg font-bold font-display text-white">
              {viewTitles[currentView] || 'BillKart POS'}
            </h1>
            <p className="text-xs text-[#A09CA8]">
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#24131E] hover:bg-[#FF1E42]/20 border border-[#FF1E42]/30 text-xs font-semibold text-[#FF4A6B] hover:text-[#FFA000] transition-colors shadow-sm"
          >
            <Barcode className="w-4 h-4 text-[#FFA000]" />
            <span className="hidden sm:inline">Scan Barcode</span>
          </button>

          {/* Quick Create Bill / Cart Pill */}
          <button
            type="button"
            onClick={() => setCurrentView('create-bill')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentView === 'create-bill'
                ? 'btn-primary-gradient text-white shadow-[0_0_15px_rgba(255,30,66,0.4)]'
                : 'bg-[#24131E] hover:bg-[#FF1E42]/20 border border-[#FF1E42]/30 text-white'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Current Bill</span>
            {cartItems.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-[#FFA000] text-black">
                {cartItems.length}
              </span>
            )}
          </button>

          {/* Sound Effects Toggle Button */}
          <button
            type="button"
            onClick={handleToggleSound}
            title={soundOn ? 'Sound Effects Enabled (Click to Mute)' : 'Sound Effects Muted (Click to Enable)'}
            className={`p-2 rounded-xl border transition-colors ${
              soundOn 
                ? 'bg-[#1D1420] text-[#FFA000] border-white/10 hover:border-[#FF1E42]/40' 
                : 'bg-[#1D1420]/50 text-[#A09CA8]/50 border-white/5 line-through'
            }`}
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Notifications Flyout Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl bg-[#1D1420] hover:bg-[#FF1E42]/20 border border-white/10 text-[#A09CA8] hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF1E42] text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div 
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#16111B] border border-white/10 shadow-2xl p-4 z-50 text-xs space-y-3 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-bold text-sm text-white">Store Notifications</span>
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={clearNotifications}
                      className="text-[11px] text-[#A09CA8] hover:text-red-400"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-center py-6 text-[#A09CA8]">No notifications right now</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-2.5 rounded-xl border transition-colors cursor-pointer flex items-start gap-2.5 ${
                          n.read
                            ? 'bg-[#100C14]/50 border-transparent text-[#A09CA8]'
                            : 'bg-[#221522] border-[#FF1E42]/25 text-white'
                        }`}
                      >
                        {n.type === 'stock' ? (
                          <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-[#FF4A6B] shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[11px] truncate">{n.title}</p>
                          <p className="text-[10px] text-[#A09CA8] mt-0.5">{n.message}</p>
                          <span className="text-[9px] text-[#FFA000] mt-1 block">{n.timestamp}</span>
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

