import { useState, type FormEvent, type ChangeEvent } from 'react';
import { 
  Settings, 
  Store, 
  CreditCard, 
  QrCode, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  Save, 
  Bell, 
  ShieldCheck,
  FileSpreadsheet,
  Volume2,
  VolumeX,
  Play
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { 
  isSoundEnabled, 
  toggleSoundEnabled, 
  playBarcodeScanSuccess, 
  playBarcodeScanError, 
  playBillGenerateSound, 
  playPaymentSuccessSound 
} from '../utils/soundEffects';

export function SettingsPage() {
  const { 
    business, 
    updateBusiness, 
    exportDataJSON, 
    restoreDataJSON, 
    resetToDefaultData,
    bills,
    products
  } = useApp();

  const [shopName, setShopName] = useState(business.shopName);
  const [ownerName, setOwnerName] = useState(business.ownerName);
  const [phone, setPhone] = useState(business.phone);
  const [email, setEmail] = useState(business.email);
  const [address, setAddress] = useState(business.address);
  const [gstNumber, setGstNumber] = useState(business.gstNumber || '');
  const [upiId, setUpiId] = useState(business.upiId || 'billkart@upi');
  const [invoicePrefix, setInvoicePrefix] = useState(business.invoicePrefix || 'BK');
  
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);
  const [soundActive, setSoundActive] = useState(() => isSoundEnabled());

  const handleToggleSound = () => {
    const nextState = toggleSoundEnabled();
    setSoundActive(nextState);
    if (nextState) {
      playBarcodeScanSuccess();
    }
  };

  const handleSaveSettings = (e: FormEvent) => {
    e.preventDefault();
    updateBusiness({
      shopName,
      ownerName,
      phone,
      email,
      address,
      gstNumber,
      upiId,
      invoicePrefix,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportBackup = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BillKart_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportBillsCSV = () => {
    const headers = 'Bill Number,Date,Time,Customer,Phone,Payment Method,Status,Amount\n';
    const rows = bills
      .map(
        b =>
          `"${b.billNumber}","${b.date}","${b.time}","${b.customerName}","${b.customerPhone}","${b.paymentMethod}","${b.paymentStatus}",${b.grandTotal}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BillKart_Bills_Export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = restoreDataJSON(content);
      if (ok) {
        setRestoreStatus('Data restored successfully!');
      } else {
        setRestoreStatus('Invalid backup file format.');
      }
      setTimeout(() => setRestoreStatus(null), 3000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 select-none pb-24 lg:pb-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold font-display text-white">
          Business & POS Terminal Settings
        </h2>
        <p className="text-xs text-[#A09CA8]">
          Configure store details, printed receipt headers, UPI payment ID, and data backups
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Store Profile Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#140F18] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-[#FF4A6B]">
            <Store className="w-4 h-4" />
            <h3 className="font-bold text-sm text-white">Store Details & Printed Header</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-[#A09CA8] mb-1">
                Shop / Trade Name *
              </label>
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#100C14] border border-white/15 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A09CA8] mb-1">
                Owner / Contact Name *
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#100C14] border border-white/15 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A09CA8] mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#100C14] border border-white/15 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A09CA8] mb-1">
                Store Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#100C14] border border-white/15 text-white focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-[#A09CA8] mb-1">
                Full Store Address (Printed on Invoices) *
              </label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#100C14] border border-white/15 text-white focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* UPI & Billing Config Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#140F18] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-[#FFA000]">
            <QrCode className="w-4 h-4" />
            <h3 className="font-bold text-sm text-white">Payment & Billing Preferences</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-[#A09CA8] mb-1">
                Store UPI ID for Dynamic QR *
              </label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="billkart.store@okhdfcbank"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#100C14] border border-white/15 text-white focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A09CA8] mb-1">
                GSTIN / Tax Identification
              </label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                placeholder="29ABCDE1234F1Z5"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#100C14] border border-white/15 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A09CA8] mb-1">
                Invoice Number Prefix
              </label>
              <input
                type="text"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                placeholder="BK"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#100C14] border border-white/15 text-white focus:outline-none uppercase font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs font-bold text-[#FF4A6B] flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Settings saved successfully!</span>
              </span>
            ) : (
              <div />
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl btn-primary-gradient text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>
      </form>

      {/* POS Audio & Sound Effects Settings Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#140F18] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5 text-[#FF4A6B]">
            <Volume2 className="w-5 h-5" />
            <div>
              <h3 className="font-bold text-sm text-white">POS Audio Feedback & Sound Effects</h3>
              <p className="text-[11px] text-[#A09CA8]">Synthesized Web Audio chimes for scanning, billing and payment confirmation</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleSound}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              soundActive
                ? 'bg-[#1F1422] text-[#FFA000] border-[#FFA000]/40 shadow-sm'
                : 'bg-[#100C14] text-[#A09CA8] border-white/10'
            }`}
          >
            {soundActive ? <Volume2 className="w-4 h-4 text-[#FFA000]" /> : <VolumeX className="w-4 h-4 text-[#A09CA8]" />}
            <span>{soundActive ? 'Sound: Enabled' : 'Sound: Muted'}</span>
          </button>
        </div>

        {/* Audition sound buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Beep */}
          <div className="p-3 rounded-2xl bg-[#100C14] border border-white/10 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-xs font-bold text-white block">Scanner Beep</span>
              <span className="text-[10px] text-[#A09CA8]">1980 Hz POS laser detection</span>
            </div>
            <button
              type="button"
              onClick={() => playBarcodeScanSuccess()}
              className="w-full py-2 px-3 rounded-xl bg-[#1F1422] hover:bg-[#FF1E42]/20 border border-white/10 hover:border-[#FF1E42]/40 text-[11px] font-bold text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <Play className="w-3 h-3 text-[#FF4A6B]" />
              <span>Test Beep</span>
            </button>
          </div>

          {/* Error Chime */}
          <div className="p-3 rounded-2xl bg-[#100C14] border border-white/10 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-xs font-bold text-white block">Error Chime</span>
              <span className="text-[10px] text-[#A09CA8]">Two-tone item not found</span>
            </div>
            <button
              type="button"
              onClick={() => playBarcodeScanError()}
              className="w-full py-2 px-3 rounded-xl bg-[#1F1422] hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-[11px] font-bold text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <Play className="w-3 h-3 text-red-400" />
              <span>Test Chime</span>
            </button>
          </div>

          {/* Bill Generation Flutter */}
          <div className="p-3 rounded-2xl bg-[#100C14] border border-white/10 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-xs font-bold text-white block">Bill Generation</span>
              <span className="text-[10px] text-[#A09CA8]">Tri-tone register calculation</span>
            </div>
            <button
              type="button"
              onClick={() => playBillGenerateSound()}
              className="w-full py-2 px-3 rounded-xl bg-[#1F1422] hover:bg-[#FFA000]/20 border border-white/10 hover:border-[#FFA000]/40 text-[11px] font-bold text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <Play className="w-3 h-3 text-[#FFA000]" />
              <span>Test Sound</span>
            </button>
          </div>

          {/* Payment Success Fanfare */}
          <div className="p-3 rounded-2xl bg-[#100C14] border border-white/10 flex flex-col justify-between space-y-2">
            <div>
              <span className="text-xs font-bold text-white block">Payment Success</span>
              <span className="text-[10px] text-[#A09CA8]">Harmonic celebration fanfare</span>
            </div>
            <button
              type="button"
              onClick={() => playPaymentSuccessSound()}
              className="w-full py-2 px-3 rounded-xl bg-[#1F1422] hover:bg-[#FF1E42]/20 border border-white/10 hover:border-[#FF1E42]/40 text-[11px] font-bold text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <Play className="w-3 h-3 text-[#FF4A6B]" />
              <span>Test Fanfare</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Backup & Restore Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#140F18] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-[#FF4A6B]">
          <Download className="w-4 h-4" />
          <h3 className="font-bold text-sm text-white">Data Backup, Export & Restore</h3>
        </div>

        <p className="text-xs text-[#A09CA8]">
          Never lose your bills, customers, or inventory. Your data is stored locally on this terminal and can be exported as standard JSON or CSV spreadsheets.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="px-4 py-2.5 rounded-xl bg-[#1F1422] hover:bg-[#FF1E42]/20 border border-white/10 text-xs font-bold text-white hover:text-[#FFA000] transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#FFA000]" />
            <span>Download Full Backup (JSON)</span>
          </button>

          <button
            type="button"
            onClick={handleExportBillsCSV}
            className="px-4 py-2.5 rounded-xl bg-[#1F1422] hover:bg-[#FF1E42]/20 border border-white/10 text-xs font-bold text-white hover:text-[#FFA000] transition-colors flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#FF4A6B]" />
            <span>Export Invoices to Excel (CSV)</span>
          </button>

          <label className="px-4 py-2.5 rounded-xl bg-[#1F1422] hover:bg-[#FF1E42]/20 border border-white/10 text-xs font-bold text-[#A09CA8] hover:text-white transition-colors flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Restore From File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleRestoreFile}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => {
              if (confirm('Reset store data to empty state?')) {
                resetToDefaultData();
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-xs font-bold text-red-400 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {restoreStatus && (
          <p className="text-xs font-bold text-[#FFA000] mt-2">{restoreStatus}</p>
        )}
      </div>
    </div>
  );
}
