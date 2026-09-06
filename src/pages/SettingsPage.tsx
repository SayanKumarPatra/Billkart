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
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

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
        <h2 className="text-xl font-bold font-display text-[#F5F7F6]">
          Business & POS Terminal Settings
        </h2>
        <p className="text-xs text-[#A9B8B3]">
          Configure store details, printed receipt headers, UPI payment ID, and data backups
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Store Profile Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0B2822] border border-[#19D66B]/25 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#19D66B]/15 text-[#57E39B]">
            <Store className="w-4 h-4" />
            <h3 className="font-bold text-sm text-[#F5F7F6]">Store Details & Printed Header</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                Shop / Trade Name *
              </label>
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-[#F5F7F6] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                Owner / Contact Name *
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-[#F5F7F6] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-[#F5F7F6] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                Store Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-[#F5F7F6] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                Full Store Address (Printed on Invoices) *
              </label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-[#F5F7F6] focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* UPI & Billing Config Card */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#0B2822] border border-[#19D66B]/25 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#19D66B]/15 text-[#B8F500]">
            <QrCode className="w-4 h-4" />
            <h3 className="font-bold text-sm text-[#F5F7F6]">Payment & Billing Preferences</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                Store UPI ID for Dynamic QR *
              </label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="billkart.store@okhdfcbank"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-[#F5F7F6] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                GSTIN / Tax Identification
              </label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                placeholder="29ABCDE1234F1Z5"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-[#F5F7F6] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                Invoice Number Prefix
              </label>
              <input
                type="text"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                placeholder="BK"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-[#F5F7F6] focus:outline-none uppercase font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs font-bold text-[#19D66B] flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Settings saved successfully!</span>
              </span>
            ) : (
              <div />
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#19D66B] to-[#B8F500] text-[#061B16] font-extrabold text-xs shadow-md hover:brightness-110 transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </div>
      </form>

      {/* Data Backup & Restore Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0B2822] border border-[#19D66B]/25 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#19D66B]/15 text-[#57E39B]">
          <Download className="w-4 h-4" />
          <h3 className="font-bold text-sm text-[#F5F7F6]">Data Backup, Export & Restore</h3>
        </div>

        <p className="text-xs text-[#A9B8B3]">
          Never lose your bills, customers, or inventory. Your data is stored locally on this terminal and can be exported as standard JSON or CSV spreadsheets.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="px-4 py-2.5 rounded-xl bg-[#10352D] hover:bg-[#19D66B]/20 border border-[#19D66B]/30 text-xs font-bold text-[#F5F7F6] hover:text-[#B8F500] transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#B8F500]" />
            <span>Download Full Backup (JSON)</span>
          </button>

          <button
            type="button"
            onClick={handleExportBillsCSV}
            className="px-4 py-2.5 rounded-xl bg-[#10352D] hover:bg-[#19D66B]/20 border border-[#19D66B]/30 text-xs font-bold text-[#F5F7F6] hover:text-[#B8F500] transition-colors flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#57E39B]" />
            <span>Export Invoices to Excel (CSV)</span>
          </button>

          <label className="px-4 py-2.5 rounded-xl bg-[#10352D] hover:bg-[#19D66B]/20 border border-[#19D66B]/30 text-xs font-bold text-[#A9B8B3] hover:text-white transition-colors flex items-center gap-2 cursor-pointer">
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
              if (confirm('Reset store data to default grocery demo state?')) {
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
          <p className="text-xs font-bold text-[#B8F500] mt-2">{restoreStatus}</p>
        )}
      </div>
    </div>
  );
}
