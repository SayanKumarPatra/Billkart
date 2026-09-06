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
import { LanguageSelectionScreen } from './pages/LanguageSelectionScreen';
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
    closeScanner,
    themeMode,
    resolvedTheme
  } = useApp();

  const [showScreenNavigator, setShowScreenNavigator] = useState(false);

  // Full-Screen Standalone Views (Pre-login / setup)
  if (currentView === 'splash') {
    return (
      <SplashScreen 
        onComplete={() => setCurrentView('onboarding')} 
      />
    );
  }

  if (currentView === 'language-select') {
    return (
      <LanguageSelectionScreen 
        onSelectLanguage={(_lang) => setCurrentView('onboarding')} 
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
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex overflow-x-hidden">
      {/* Desktop Sidebar (Left side, sticky) */}
      <DesktopSidebar />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <AppHeader />

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
