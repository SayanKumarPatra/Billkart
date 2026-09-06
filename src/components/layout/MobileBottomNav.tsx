import { useState } from 'react';
import { 
  Home, 
  FileText, 
  Barcode, 
  Package, 
  MoreHorizontal, 
  Users, 
  BarChart3, 
  Settings, 
  HelpCircle,
  PlusCircle
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { AppView } from '../../types';

export function MobileBottomNav() {
  const { currentView, setCurrentView, openScanner, cartItems } = useApp();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const navItems = [
    { id: 'dashboard' as AppView, label: 'Home', icon: Home },
    { id: 'bills' as AppView, label: 'Bills', icon: FileText },
    // Center Action: Scan
    { id: 'scan' as any, label: 'Scan', icon: Barcode, isCenterAction: true },
    { id: 'products' as AppView, label: 'Products', icon: Package },
    { id: 'more' as any, label: 'More', icon: MoreHorizontal, isMenu: true },
  ];

  return (
    <>
      {/* Pop-up sheet for 'More' menu on mobile */}
      {showMoreMenu && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs lg:hidden"
          onClick={() => setShowMoreMenu(false)}
        >
          <div 
            className="absolute bottom-16 inset-x-3 p-4 bg-[#140F18] border border-white/10 rounded-3xl shadow-2xl space-y-2 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold text-[#FFA000] uppercase tracking-wider">More BillKart Features</span>
              <span className="text-[10px] text-[#A09CA8]">v2.6 POS</span>
            </div>

            <button
              type="button"
              onClick={() => { setCurrentView('create-bill'); setShowMoreMenu(false); }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#1F1422] border border-white/10 text-xs font-bold text-white"
            >
              <div className="flex items-center gap-2.5">
                <PlusCircle className="w-4 h-4 text-[#FF1E42]" />
                <span>Create New Bill</span>
              </div>
              {cartItems.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#FFA000] text-black font-bold">
                  {cartItems.length} in cart
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setCurrentView('customers'); setShowMoreMenu(false); }}
              className="w-full flex items-center gap-2.5 p-3 rounded-2xl bg-[#1F1422] border border-white/10 text-xs font-medium text-white"
            >
              <Users className="w-4 h-4 text-[#FF4A6B]" />
              <span>Customers CRM</span>
            </button>

            <button
              type="button"
              onClick={() => { setCurrentView('reports'); setShowMoreMenu(false); }}
              className="w-full flex items-center gap-2.5 p-3 rounded-2xl bg-[#1F1422] border border-white/10 text-xs font-medium text-white"
            >
              <BarChart3 className="w-4 h-4 text-[#FF4A6B]" />
              <span>Sales Reports & Analytics</span>
            </button>

            <button
              type="button"
              onClick={() => { setCurrentView('settings'); setShowMoreMenu(false); }}
              className="w-full flex items-center gap-2.5 p-3 rounded-2xl bg-[#1F1422] border border-white/10 text-xs font-medium text-white"
            >
              <Settings className="w-4 h-4 text-[#FF4A6B]" />
              <span>Business Settings & UPI</span>
            </button>

            <button
              type="button"
              onClick={() => { setCurrentView('help'); setShowMoreMenu(false); }}
              className="w-full flex items-center gap-2.5 p-3 rounded-2xl bg-[#1F1422] border border-white/10 text-xs font-medium text-white"
            >
              <HelpCircle className="w-4 h-4 text-[#FF4A6B]" />
              <span>Help & Support</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#100C14]/95 backdrop-blur-lg border-t border-white/10 py-2 px-3 safe-area-pb select-none shadow-[0_-4px_25px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;

            if (item.isCenterAction) {
              return (
                <button
                  key="center-scan"
                  type="button"
                  id="mobile-nav-scan-btn"
                  onClick={() => openScanner()}
                  className="relative -top-4 flex flex-col items-center group"
                >
                  <div className="w-13 h-13 rounded-2xl btn-primary-gradient p-0.5 shadow-[0_6px_20px_rgba(255,30,66,0.5)] active:scale-95 transition-transform">
                    <div className="w-full h-full bg-[#100C14] rounded-[14px] flex items-center justify-center group-hover:bg-[#1C121D] transition-colors">
                      <Barcode className="w-6 h-6 text-[#FFA000]" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#FFA000] mt-0.5">Scan</span>
                </button>
              );
            }

            const isActive = currentView === item.id;

            return (
              <button
                key={item.label}
                type="button"
                id={`mobile-nav-${item.label.toLowerCase()}`}
                onClick={() => {
                  if (item.isMenu) {
                    setShowMoreMenu(!showMoreMenu);
                  } else {
                    setShowMoreMenu(false);
                    setCurrentView(item.id as AppView);
                  }
                }}
                className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                  isActive ? 'text-[#FFA000]' : 'text-[#A09CA8] hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className={`text-[10px] mt-1 font-medium ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
