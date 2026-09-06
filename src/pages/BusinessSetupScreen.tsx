import { useState, type FormEvent } from 'react';
import { Store, User, Phone, Mail, MapPin, Tag, FileText, QrCode, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { BillKartLogo } from '../components/BillKartLogo';

export function BusinessSetupScreen() {
  const { business, updateBusiness, setCurrentView } = useApp();

  const [shopName, setShopName] = useState(business.shopName || 'Sayan General Store');
  const [ownerName, setOwnerName] = useState(business.ownerName || 'Sayan Kumar Patra');
  const [phone, setPhone] = useState(business.phone || '+91 98765 43210');
  const [email, setEmail] = useState(business.email || 'sayan@gmail.com');
  const [address, setAddress] = useState(business.address || 'College Road, Kolkata, West Bengal 700073');
  const [category, setCategory] = useState(business.category || 'Retail Store');
  const [gstNumber, setGstNumber] = useState(business.gstNumber || '19ABCDE1234F1Z5');
  const [upiId, setUpiId] = useState(business.upiId || 'sayan.patra@okhdfcbank');

  const categories = [
    'Retail Store',
    'Grocery & Supermarket',
    'Kirana & General Store',
    'Clothing & Apparel',
    'Electronics & Mobile',
    'Pharmacy & Medical',
    'Cafe & Bakery',
    'Stationery & Books',
    'Hardware & Sanitary',
  ];

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    updateBusiness({
      shopName,
      ownerName,
      phone,
      email,
      address,
      category,
      gstNumber,
      upiId,
    });
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-[#070709] text-[#F5F5F7] flex flex-col justify-center items-center p-4 sm:p-6 select-none relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#FF1E42]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl bg-[#130F17]/95 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <BillKartLogo size="sm" showTagline={false} showScript={false} animate={false} horizontal={true} />
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-white">
                Business Profile Setup
              </h2>
              <p className="text-xs text-[#A09CA8]">Configure your store details for printed receipts & UPI QR</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-[#FFA000] bg-[#24131E] px-2.5 py-1 rounded-full border border-[#FF1E42]/25">
            Step 04 / 04
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#A09CA8] mb-1">
                Shop / Store Name *
              </label>
              <div className="relative">
                <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF4A6B]" />
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g. Sayan General Store"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#18111D] border border-white/10 focus:border-[#FF1E42] text-xs text-white placeholder-[#666] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A09CA8] mb-1">
                Owner / Manager Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF4A6B]" />
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Sayan Kumar Patra"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#18111D] border border-white/10 focus:border-[#FF1E42] text-xs text-white placeholder-[#666] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#A09CA8] mb-1">
                Contact Mobile Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF4A6B]" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#18111D] border border-white/10 focus:border-[#FF1E42] text-xs text-white placeholder-[#666] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A09CA8] mb-1">
                Store Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF4A6B]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sayan@gmail.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#18111D] border border-white/10 focus:border-[#FF1E42] text-xs text-white placeholder-[#666] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#A09CA8] mb-1">
              Store Address (Appears on Bills) *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-[#FF4A6B]" />
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="College Road, Kolkata, West Bengal 700073"
                className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#18111D] border border-white/10 focus:border-[#FF1E42] text-xs text-white placeholder-[#666] focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#A09CA8] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#18111D] border border-white/10 focus:border-[#FF1E42] text-xs text-white focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-[#18111D] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A09CA8] mb-1">
                GST Number (Optional)
              </label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                placeholder="19ABCDE1234F1Z5"
                className="w-full px-3 py-2.5 rounded-xl bg-[#18111D] border border-white/10 focus:border-[#FF1E42] text-xs text-white placeholder-[#666] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A09CA8] mb-1">
                Store UPI ID for QR *
              </label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="sayan.patra@okhdfcbank"
                className="w-full px-3 py-2.5 rounded-xl bg-[#18111D] border border-white/10 focus:border-[#FF1E42] text-xs text-white placeholder-[#666] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl btn-primary-gradient text-white font-extrabold text-xs sm:text-sm shadow-[0_6px_25px_rgba(255,30,66,0.35)] transition-all flex items-center justify-center gap-2"
            >
              <span>Save & Launch BillKart POS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
