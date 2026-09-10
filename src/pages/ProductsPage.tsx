import { useState, type FormEvent } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Barcode, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  X, 
  Tag
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Product } from '../types';

export function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, openScanner, language } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState('Grocery');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [stock, setStock] = useState('');
  const [minStockAlert, setMinStockAlert] = useState('5');
  const [unit, setUnit] = useState('pcs');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const lowStockCount = products.filter(p => p.stock <= p.minStockAlert).length;

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery.trim());
    const matchesLowStock = !showOnlyLowStock || p.stock <= p.minStockAlert;
    return matchesCat && matchesSearch && matchesLowStock;
  });

  const handleOpenAdd = () => {
    setName('');
    setBarcode(String(Math.floor(8901000000000 + Math.random() * 99999999)));
    setCategory('Grocery');
    setPrice('');
    setMrp('');
    setStock('20');
    setMinStockAlert('5');
    setUnit('pcs');
    setShowAddModal(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setBarcode(p.barcode);
    setCategory(p.category);
    setPrice(String(p.price));
    setMrp(p.mrp ? String(p.mrp) : '');
    setStock(String(p.stock));
    setMinStockAlert(String(p.minStockAlert));
    setUnit(p.unit);
    setShowAddModal(true);
  };

  const handleSaveProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !barcode.trim() || !price) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: name.trim(),
        barcode: barcode.trim(),
        category,
        price: parseFloat(price) || 0,
        mrp: mrp ? parseFloat(mrp) : undefined,
        stock: parseInt(stock, 10) || 0,
        minStockAlert: parseInt(minStockAlert, 10) || 5,
        unit,
      });
    } else {
      addProduct({
        name: name.trim(),
        barcode: barcode.trim(),
        category,
        price: parseFloat(price) || 0,
        mrp: mrp ? parseFloat(mrp) : undefined,
        stock: parseInt(stock, 10) || 0,
        minStockAlert: parseInt(minStockAlert, 10) || 5,
        unit,
      });
    }

    setShowAddModal(false);
    setEditingProduct(null);
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-5 select-none pb-24 lg:pb-8">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
            {language === 'bn' ? 'পণ্য তালিকা ও ইনভেন্টরি' : 'Product Inventory'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'bn'
              ? `দোকানের পণ্য, মূল্য, বারকোড এবং স্টক ম্যানেজমেন্ট (${products.length}টি পণ্য রয়েছে)`
              : `Manage prices, barcodes, stock levels and auto alerts (${products.length} products)`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openScanner}
            className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-2"
          >
            <Barcode className="w-4 h-4 text-blue-600" />
            <span>{language === 'bn' ? 'বারকোড স্ক্যান' : 'Barcode Scan'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন পণ্য যোগ' : 'Add Product'}</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'পণ্যের নাম বা বারকোড দিয়ে খুঁজুন...' : 'Search by product title or barcode...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCategory(c)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === c
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              {c === 'All' ? (language === 'bn' ? 'সকল পণ্য' : 'All') : c}
            </button>
          ))}

          {/* Quick Low Stock Toggle Filter */}
          <button
            type="button"
            onClick={() => setShowOnlyLowStock(!showOnlyLowStock)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              showOnlyLowStock
                ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-500/30'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'কম স্টক ফিল্টার' : 'Low Stock Only'}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              showOnlyLowStock ? 'bg-amber-700 text-white' : 'bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-200'
            }`}>
              {lowStockCount}
            </span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <th className="py-3.5 px-4">{language === 'bn' ? 'পণ্য ও ক্যাটাগরি' : 'Product & Category'}</th>
                <th className="py-3.5 px-4 font-mono">{language === 'bn' ? 'বারকোড' : 'Barcode'}</th>
                <th className="py-3.5 px-4">{language === 'bn' ? 'বিক্রয় মূল্য' : 'Price'}</th>
                <th className="py-3.5 px-4">{language === 'bn' ? 'স্টক' : 'Stock'}</th>
                <th className="py-3.5 px-4 text-right">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProducts.map((p) => {
                const isLowStock = p.stock <= p.minStockAlert;
                const isOutOfStock = p.stock === 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{p.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Tag className="w-3 h-3 text-slate-400" />
                        <span>{p.category}</span>
                        <span>•</span>
                        <span>{p.unit}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                      {p.barcode}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-sm text-slate-900 dark:text-white font-mono">
                        ₹{p.price.toFixed(2)}
                      </div>
                      {p.mrp && p.mrp > p.price && (
                        <div className="text-[10px] text-slate-400 line-through">
                          MRP: ₹{p.mrp.toFixed(2)}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold font-mono px-2 py-0.5 rounded-md text-xs ${
                            isOutOfStock
                              ? 'bg-red-50 text-red-600 dark:bg-red-950/60 border border-red-200 dark:border-red-800'
                              : isLowStock
                              ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800'
                              : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          {p.stock} {p.unit}
                        </span>
                        {isLowStock && (
                          <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{language === 'bn' ? 'কম স্টক!' : 'Low!'}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
                          title={language === 'bn' ? 'এডিট করুন' : 'Edit'}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title={language === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">
                {editingProduct 
                  ? (language === 'bn' ? 'পণ্য সংশোধন করুন' : 'Edit Product') 
                  : (language === 'bn' ? 'নতুন পণ্য যুক্ত করুন' : 'Add New Product')}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'bn' ? 'পণ্যের নাম *' : 'Product Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: ফরচুন সরিষার তেল ১ লিটার"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'বারকোড নম্বর *' : 'Barcode *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="8901030834027"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'ক্যাটাগরি *' : 'Category *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Grocery, Dairy, Snacks..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'বিক্রয় মূল্য (₹) *' : 'Price (₹) *'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="120"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'এমআরপি (₹)' : 'MRP (₹)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                    placeholder="140"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'একক (Unit)' : 'Unit'}
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="kg, pcs, pack"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'বর্তমান স্টক *' : 'Stock Quantity *'}
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="25"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'bn' ? 'কম স্টক এলার্ট লিমিট' : 'Low Stock Alert'}
                  </label>
                  <input
                    type="number"
                    required
                    value={minStockAlert}
                    onChange={(e) => setMinStockAlert(e.target.value)}
                    placeholder="5"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
                >
                  {editingProduct 
                    ? (language === 'bn' ? 'তথ্য আপডেট করুন' : 'Update Product') 
                    : (language === 'bn' ? 'পণ্য সেভ করুন' : 'Save Product')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
