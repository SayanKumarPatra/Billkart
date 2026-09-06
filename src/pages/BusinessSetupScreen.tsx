import { useState, type FormEvent } from 'react';
import { Store, User, Phone, Mail, MapPin, Tag, FileText, QrCode, CheckCircle2, ArrowRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { BillKartLogo } from '../components/BillKartLogo';

export function BusinessSetupScreen() {
  const { business, updateBusiness, setCurrentView } = useApp();

  const [shopName, setShopName] = useState(business.shopName);
  const [ownerName, setOwnerName] = useState(business.ownerName);
  const [phone, setPhone] = useState(business.phone);
  const [email, setEmail] = useState(business.email);
  const [address, setAddress] = useState(business.address);
  const [category, setCategory] = useState(business.category);
  const [gstNumber, setGstNumber] = useState(business.gstNumber || '');
  const [upiId, setUpiId] = useState(business.upiId || 'billkart@upi');

  const categories = [
    'Grocery & Supermarket',
    'Kirana & General Store',
    'Clothing & Apparel',
    'Electronics & Mobile',
    'Pharmacy & Medical',
    'Cafe & Bakery',
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
    <div className="min-h-screen w-full bg-[#061B16] text-[#F5F7F6] flex flex-col justify-center items-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-xl bg-[#0B2822] border border-[#19D66B]/25 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        <div className="flex items-center justify-between pb-4 border-b border-[#19D66B]/15 mb-6">
          <div className="flex items-center gap-2.5">
            <BillKartLogo size="sm" showTagline={false} showScript={false} animate={false} />
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-[#F5F7F6]">
                Business Profile Setup
              </h2>
              <p className="text-xs text-[#A9B8B3]">Set up your store details for printed invoices</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#B8F500] bg-[#10352D] px-2.5 py-1 rounded-full border border-[#19D66B]/30">
            Step 04 / 04
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                Shop / Store Name *
              </label>
              <div className="relative">
                <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57E39B]" />
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g. BillKart Super Mart"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                Owner / Manager Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57E39B]" />
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                Contact Mobile Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57E39B]" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                Store Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57E39B]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="store@billkart.in"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
              Store Address (Appears on Bills) *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-[#57E39B]" />
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Shop #, Street, Market, City, State, PIN"
                className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                GST Number (Optional)
              </label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                placeholder="29ABCDE1234F1Z5"
                className="w-full px-3 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                Store UPI ID for QR *
              </label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="store@upi"
                className="w-full px-3 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#19D66B] via-[#57E39B] to-[#B8F500] text-[#061B16] font-extrabold text-xs sm:text-sm hover:brightness-110 shadow-[0_6px_20px_rgba(25,214,107,0.35)] transition-all flex items-center justify-center gap-2"
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
