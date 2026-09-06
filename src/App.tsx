import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Sparkles, 
  RotateCcw, 
  Compass, 
  Store, 
  KeyRound, 
  LayoutDashboard, 
  ReceiptText 
} from 'lucide-react';
import { AppProvider, useApp } from './contexts/AppContext';
import { SplashScreen } from './pages/SplashScreen';
import { OnboardingScreen } from './pages/OnboardingScreen';
import { AuthScreen } from './pages/AuthScreen';
import { BusinessSetupScreen } from './pages/BusinessSetupScreen';
import { DashboardPage } from './pages/DashboardPage';
import { CreateBillPage } from './pages/CreateBillPage';
import { ProductsPage } from './pages/ProductsPage';
import { CustomersPage } from './pages/CustomersPage';
import { BillsHistoryPage } from './pages/BillsHistoryPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';
import { DesktopSidebar } from './components/layout/DesktopSidebar';
import { AppHeader } from './components/layout/AppHeader';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { CameraBarcodeScanner } from './components/scanner/CameraBarcodeScanner';
import { AppView } from './types';

function MainAppContent() {
  const { 
    currentView, 
    setCurrentView, 
    isScannerOpen, 
    closeScanner 
  } = useApp();

  const [showScreenNavigator, setShowScreenNavigator] = useState(false);

  // Full-Screen Standalone Views (Pre-login / setup)
  if (currentView === 'splash') {
    return (
      <SplashScreen 
        onComplete={() => setCurrentView('dashboard')} 
      />
    );
  }

  if (currentView === 'onboarding') {
    return <OnboardingScreen />;
  }

  if (currentView === 'auth') {
    return <AuthScreen />;
  }

  if (currentView === 'business-setup') {
    return <BusinessSetupScreen />;
  }

  // Active POS Workspace View Router
  const renderWorkspacePage = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'create-bill':
        return <CreateBillPage />;
      case 'products':
        return <ProductsPage />;
      case 'customers':
        return <CustomersPage />;
      case 'bills':
        return <BillsHistoryPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'help':
        return <HelpPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#070709] text-[#F5F5F7] flex overflow-x-hidden">
      {/* Desktop Sidebar (Left side, sticky) */}
      <DesktopSidebar />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <AppHeader />

        {/* Global Screen Switcher Chip for Instant Evaluation/Testing */}
        <div className="bg-[#140F18]/80 border-b border-white/10 px-4 py-1.5 flex items-center justify-between text-[11px] select-none">
          <div className="flex items-center gap-1.5 text-[#A09CA8]">
            <span className="w-2 h-2 rounded-full bg-[#FF1E42] animate-pulse" />
            <span className="font-semibold">Screen:</span>
            <span className="font-bold text-[#FFA000] uppercase font-mono">{currentView}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentView('splash')}
              title="Test Screen 01 Preloader"
              className="px-2 py-0.5 rounded-md bg-[#1F1422] hover:bg-[#FF1E42]/20 text-[10px] font-bold text-[#A09CA8] hover:text-[#FFA000] transition-colors"
            >
              Splash
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('onboarding')}
              title="Test Screen 02 Onboarding"
              className="px-2 py-0.5 rounded-md bg-[#1F1422] hover:bg-[#FF1E42]/20 text-[10px] font-bold text-[#A09CA8] hover:text-[#FFA000] transition-colors"
            >
              Intro
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('auth')}
              title="Test Screen 03 Login/Signup"
              className="px-2 py-0.5 rounded-md bg-[#1F1422] hover:bg-[#FF1E42]/20 text-[10px] font-bold text-[#A09CA8] hover:text-[#FFA000] transition-colors"
            >
              Auth
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('business-setup')}
              title="Test Screen 04 Business Setup"
              className="px-2 py-0.5 rounded-md bg-[#1F1422] hover:bg-[#FF1E42]/20 text-[10px] font-bold text-[#A09CA8] hover:text-[#FFA000] transition-colors"
            >
              Setup
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('create-bill')}
              title="Go to Smart Billing"
              className="px-2 py-0.5 rounded-md btn-primary-gradient text-[10px] font-bold text-white shadow-sm"
            >
              POS
            </button>
          </div>
        </div>

        {/* Dynamic Page Container */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {renderWorkspacePage()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Navigation (Visible on phones/tablets) */}
        <MobileBottomNav />
      </div>

      {/* Global Camera Barcode Scanner Modal */}
      <CameraBarcodeScanner
        isOpen={isScannerOpen}
        onClose={closeScanner}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
