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
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
          onClick={() => setShowMoreMenu(false)}
        >
          <div 
            className="absolute bottom-16 inset-x-3 p-4 bg-[#0B2822] border border-[#19D66B]/30 rounded-3xl shadow-2xl space-y-2 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#19D66B]/15">
              <span className="text-xs font-bold text-[#57E39B] uppercase tracking-wider">More BillKart Features</span>
              <span className="text-[10px] text-[#A9B8B3]">v2.6 POS</span>
            </div>

            <button
              type="button"
              onClick={() => { setCurrentView('create-bill'); setShowMoreMenu(false); }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#10352D] text-xs font-bold text-[#F5F7F6]"
            >
              <div className="flex items-center gap-2.5">
                <PlusCircle className="w-4 h-4 text-[#19D66B]" />
                <span>Create New Bill</span>
              </div>
              {cartItems.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#B8F500] text-[#061B16] font-bold">
                  {cartItems.length} in cart
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setCurrentView('customers'); setShowMoreMenu(false); }}
              className="w-full flex items-center gap-2.5 p-3 rounded-2xl bg-[#10352D] text-xs font-medium text-[#F5F7F6]"
            >
              <Users className="w-4 h-4 text-[#57E39B]" />
              <span>Customers CRM</span>
            </button>

            <button
              type="button"
              onClick={() => { setCurrentView('reports'); setShowMoreMenu(false); }}
              className="w-full flex items-center gap-2.5 p-3 rounded-2xl bg-[#10352D] text-xs font-medium text-[#F5F7F6]"
            >
              <BarChart3 className="w-4 h-4 text-[#57E39B]" />
              <span>Sales Reports & Analytics</span>
            </button>

            <button
              type="button"
              onClick={() => { setCurrentView('settings'); setShowMoreMenu(false); }}
              className="w-full flex items-center gap-2.5 p-3 rounded-2xl bg-[#10352D] text-xs font-medium text-[#F5F7F6]"
            >
              <Settings className="w-4 h-4 text-[#57E39B]" />
              <span>Business Settings & UPI</span>
            </button>

            <button
              type="button"
              onClick={() => { setCurrentView('help'); setShowMoreMenu(false); }}
              className="w-full flex items-center gap-2.5 p-3 rounded-2xl bg-[#10352D] text-xs font-medium text-[#F5F7F6]"
            >
              <HelpCircle className="w-4 h-4 text-[#57E39B]" />
              <span>Help & Support</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0B2822]/95 backdrop-blur-lg border-t border-[#19D66B]/20 py-2 px-3 safe-area-pb select-none shadow-[0_-4px_25px_rgba(0,0,0,0.5)]">
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
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#19D66B] via-[#57E39B] to-[#B8F500] p-0.5 shadow-[0_6px_20px_rgba(25,214,107,0.5)] active:scale-95 transition-transform">
                    <div className="w-full h-full bg-[#061B16] rounded-[14px] flex items-center justify-center group-hover:bg-[#0B2822] transition-colors">
                      <Barcode className="w-6 h-6 text-[#B8F500]" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#B8F500] mt-0.5">Scan</span>
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
                  isActive ? 'text-[#B8F500]' : 'text-[#A9B8B3] hover:text-[#F5F7F6]'
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
