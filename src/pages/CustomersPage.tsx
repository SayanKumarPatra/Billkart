import { useState, type FormEvent } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Phone, 
  Mail, 
  MapPin, 
  Receipt, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  History,
  ShoppingCart
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Customer } from '../types';

export function CustomersPage() {
  const { customers, addCustomer, updateCustomer, deleteCustomer, bills, setActiveCustomer, setCurrentView } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery.trim())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setShowModal(true);
  };

  const handleOpenEdit = (c: Customer) => {
    setEditingId(c.id);
    setName(c.name);
    setPhone(c.phone);
    setEmail(c.email || '');
    setAddress(c.address || '');
    setShowModal(true);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    if (editingId) {
      updateCustomer(editingId, {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        address: address.trim() || undefined,
      });
    } else {
      addCustomer({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        address: address.trim() || undefined,
      });
    }

    setShowModal(false);
  };

  const handleCreateBillForCustomer = (c: Customer) => {
    setActiveCustomer(c);
    setCurrentView('create-bill');
  };

  // Bills for selected customer
  const customerBills = selectedCustomer 
    ? bills.filter(b => b.customerId === selectedCustomer.id || b.customerPhone === selectedCustomer.phone)
    : [];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 select-none pb-24 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-display text-white">
            Customer Directory & CRM
          </h2>
          <p className="text-xs text-[#A09CA8]">
            Track purchase totals, billing frequencies, and contact details ({customers.length} customers)
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-2xl btn-primary-gradient text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF4A6B]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by customer name or phone..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#140F18] border border-white/10 text-xs text-white placeholder-[#A09CA8]/60 focus:outline-none"
        />
      </div>

      {/* Customers List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-3xl bg-[#140F18] border border-white/10 hover:border-[#FF1E42]/50 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-[#1F1422] border border-white/10 flex items-center justify-center font-bold text-sm text-[#FFA000]">
                    {c.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white truncate">{c.name}</h3>
                    <p className="text-[11px] text-[#A09CA8] font-mono">{c.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 rounded-lg bg-[#1F1422] text-[#FFA000] hover:bg-[#FF1E42]/20"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {c.id !== 'cust-walkin' && (
                    <button
                      type="button"
                      onClick={() => deleteCustomer(c.id)}
                      className="p-1.5 rounded-lg bg-[#1F1422] text-[#A09CA8] hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {c.address && (
                <p className="text-[11px] text-[#A09CA8] flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-[#FF4A6B] shrink-0" />
                  <span>{c.address}</span>
                </p>
              )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-[#100C14] border border-white/10 text-xs">
              <div>
                <span className="text-[10px] text-[#A09CA8] block">Total Spent</span>
                <span className="font-extrabold text-[#FFA000] font-mono text-sm">
                  ₹{c.totalPurchases.toFixed(2)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#A09CA8] block">Bills Generated</span>
                <span className="font-bold text-white font-mono">
                  {c.billsCount} bills
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedCustomer(c)}
                className="flex-1 py-2 rounded-xl bg-[#1F1422] hover:bg-[#FF1E42]/20 text-xs font-semibold text-[#A09CA8] hover:text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <History className="w-3.5 h-3.5" />
                <span>History</span>
              </button>

              <button
                type="button"
                onClick={() => handleCreateBillForCustomer(c)}
                className="flex-1 py-2 rounded-xl btn-primary-gradient text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Bill Customer</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CUSTOMER HISTORY MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-[#140F18] border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-sm text-white font-display">
                  {selectedCustomer.name}'s Purchase History
                </h3>
                <p className="text-[11px] text-[#A09CA8]">Phone: {selectedCustomer.phone}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="text-[#A09CA8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
              {customerBills.length === 0 ? (
                <p className="text-center py-8 text-xs text-[#A09CA8]">
                  No past bills found for this customer.
                </p>
              ) : (
                customerBills.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-2xl bg-[#100C14] border border-white/10 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{b.billNumber}</span>
                        <span className="text-[10px] text-[#FFA000]">{b.paymentMethod}</span>
                      </div>
                      <p className="text-[10px] text-[#A09CA8] mt-0.5">{b.date} at {b.time}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-sm text-[#FFA000]">
                        ₹{b.grandTotal.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-[#FF4A6B] block">Paid</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  const cust = selectedCustomer;
                  setSelectedCustomer(null);
                  handleCreateBillForCustomer(cust);
                }}
                className="w-full py-2.5 rounded-xl btn-primary-gradient text-white font-bold text-xs"
              >
                Create New Bill For This Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT CUSTOMER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-[#140F18] border border-white/10 rounded-3xl p-5 space-y-3.5 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-bold text-sm text-white">
                {editingId ? 'Edit Customer' : 'Add New Customer'}
              </h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-[#A09CA8]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] text-[#A09CA8] mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full px-3 py-2 rounded-xl bg-[#100C14] border border-white/15 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#A09CA8] mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98200 11223"
                  className="w-full px-3 py-2 rounded-xl bg-[#100C14] border border-white/15 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#A09CA8] mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="customer@email.com"
                  className="w-full px-3 py-2 rounded-xl bg-[#100C14] border border-white/15 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#A09CA8] mb-1">Address (Optional)</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat #, Locality, City"
                  className="w-full px-3 py-2 rounded-xl bg-[#100C14] border border-white/15 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl btn-primary-gradient text-white font-bold text-xs"
                >
                  Save Customer
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#1F1422] text-[#A09CA8] text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
