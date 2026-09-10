import { AnimatePresence, motion } from 'motion/react';
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
import { AppHeader } from './components/layout/AppHeader';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { CameraBarcodeScanner } from './components/scanner/CameraBarcodeScanner';

function MainAppContent() {
  const { 
    currentView, 
    setCurrentView, 
    isScannerOpen, 
    closeScanner 
  } = useApp();

  // Standalone Full-Screen Mobile Flows (Splash, Onboarding, Auth, Business Setup)
  if (currentView === 'splash') {
    return (
      <div className="min-h-screen w-full bg-slate-900/90 dark:bg-black flex justify-center items-stretch">
        <div className="w-full max-w-md h-[100dvh] bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden shadow-2xl relative sm:border-x sm:border-slate-800/40">
          <SplashScreen onComplete={() => setCurrentView('dashboard')} />
        </div>
      </div>
    );
  }

  if (currentView === 'onboarding') {
    return (
      <div className="min-h-screen w-full bg-slate-900/90 dark:bg-black flex justify-center items-stretch">
        <div className="w-full max-w-md h-[100dvh] bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden shadow-2xl relative sm:border-x sm:border-slate-800/40">
          <OnboardingScreen />
        </div>
      </div>
    );
  }

  if (currentView === 'auth') {
    return (
      <div className="min-h-screen w-full bg-slate-900/90 dark:bg-black flex justify-center items-stretch">
        <div className="w-full max-w-md h-[100dvh] bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden shadow-2xl relative sm:border-x sm:border-slate-800/40">
          <AuthScreen />
        </div>
      </div>
    );
  }

  if (currentView === 'business-setup') {
    return (
      <div className="min-h-screen w-full bg-slate-900/90 dark:bg-black flex justify-center items-stretch">
        <div className="w-full max-w-md h-[100dvh] bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden shadow-2xl relative sm:border-x sm:border-slate-800/40">
          <BusinessSetupScreen />
        </div>
      </div>
    );
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
    <div className="min-h-screen w-full bg-slate-900/90 dark:bg-black flex justify-center items-stretch select-none">
      {/* 100% Mobile Application Screen Frame */}
      <div className="w-full max-w-md h-[100dvh] flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-2xl relative overflow-hidden sm:border-x sm:border-slate-800/50">
        
        {/* Mobile App Header (Fixed Top) */}
        <AppHeader />

        {/* Dynamic Mobile Page Container (Scrollable Middle with safe bottom padding) */}
        <main className="flex-1 overflow-y-auto overscroll-contain">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="min-h-full"
            >
              {renderWorkspacePage()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Navigation (Fixed Bottom) */}
        <MobileBottomNav />

        {/* Global Camera Barcode Scanner Modal */}
        <CameraBarcodeScanner
          isOpen={isScannerOpen}
          onClose={closeScanner}
        />
      </div>
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
