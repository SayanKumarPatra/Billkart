import { useState, type FormEvent } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  Barcode, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Tag, 
  TrendingDown, 
  TrendingUp,
  Camera
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Product } from '../types';

export function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, openScanner } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
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
  const [unit, setUnit] = useState('pack');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery.trim());
    return matchesCat && matchesSearch;
  });

  const handleOpenAdd = () => {
    setName('');
    setBarcode(String(Math.floor(8901000000000 + Math.random() * 99999999)));
    setCategory('Grocery');
    setPrice('');
    setMrp('');
    setStock('20');
    setMinStockAlert('5');
    setUnit('pack');
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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 select-none pb-24 lg:pb-8">
      {/* Top Header & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold font-display text-[#F5F7F6]">
            Product Catalog & Inventory
          </h2>
          <p className="text-xs text-[#A9B8B3]">
            Manage prices, barcodes, stock levels and auto-refill alerts ({products.length} products)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openScanner}
            className="px-3.5 py-2.5 rounded-2xl bg-[#10352D] hover:bg-[#19D66B]/20 border border-[#19D66B]/30 text-xs font-bold text-[#57E39B] transition-colors flex items-center gap-2"
          >
            <Barcode className="w-4 h-4 text-[#B8F500]" />
            <span>Scan to Check Stock</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#19D66B] to-[#B8F500] text-[#061B16] font-extrabold text-xs shadow-md hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#57E39B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product title or barcode..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0B2822] border border-[#19D66B]/25 text-xs text-[#F5F7F6] placeholder-[#A9B8B3]/60 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCategory(c)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === c
                  ? 'bg-[#19D66B] text-[#061B16]'
                  : 'bg-[#0B2822] text-[#A9B8B3] hover:text-[#F5F7F6] border border-[#19D66B]/20'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid Table */}
      <div className="rounded-3xl bg-[#0B2822] border border-[#19D66B]/20 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#19D66B]/15 bg-[#061B16]/60 text-[10px] uppercase tracking-wider text-[#A9B8B3]">
                <th className="py-3.5 px-4">Product & Category</th>
                <th className="py-3.5 px-4 font-mono">Barcode</th>
                <th className="py-3.5 px-4">Price (₹)</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#19D66B]/10">
              {filteredProducts.map((p) => {
                const isLowStock = p.stock <= p.minStockAlert;
                const isOutOfStock = p.stock === 0;

                return (
                  <tr key={p.id} className="hover:bg-[#10352D]/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#F5F7F6]">{p.name}</div>
                      <div className="text-[10px] text-[#A9B8B3] flex items-center gap-1 mt-0.5">
                        <Tag className="w-3 h-3 text-[#57E39B]" />
                        <span>{p.category}</span>
                        <span>•</span>
                        <span>{p.unit}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[11px] text-[#57E39B]">
                      {p.barcode}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-extrabold text-sm text-[#F5F7F6] font-mono">
                        ₹{p.price.toFixed(2)}
                      </div>
                      {p.mrp && p.mrp > p.price && (
                        <div className="text-[10px] text-[#A9B8B3] line-through">
                          MRP: ₹{p.mrp.toFixed(2)}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold font-mono px-2 py-0.5 rounded-lg text-xs ${
                            isOutOfStock
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : isLowStock
                              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                              : 'bg-[#19D66B]/15 text-[#19D66B] border border-[#19D66B]/30'
                          }`}
                        >
                          {p.stock} {p.unit}
                        </span>
                        {isLowStock && (
                          <span className="text-[10px] text-orange-400 font-semibold flex items-center gap-0.5">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Low!</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg bg-[#10352D] text-[#57E39B] hover:text-[#B8F500] hover:bg-[#19D66B]/20 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 rounded-lg bg-[#10352D] text-[#A9B8B3] hover:text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-[#0B2822] border border-[#19D66B]/30 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#19D66B]/15">
              <h3 className="font-bold text-sm text-[#F5F7F6] font-display">
                {editingProduct ? 'Edit Product Details' : 'Add New Inventory Product'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#A9B8B3] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aashirvaad Shudh Chakki Atta 5kg"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                    Barcode Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="8901030834027"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs font-mono text-[#57E39B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Grains, Dairy, Snacks..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="120"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={mrp}
                    onChange={(e) => setMrp(e.target.value)}
                    placeholder="140"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="kg, pack, bottle"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                    Current Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="25"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#A9B8B3] mb-1">
                    Low Stock Alert Threshold
                  </label>
                  <input
                    type="number"
                    required
                    value={minStockAlert}
                    onChange={(e) => setMinStockAlert(e.target.value)}
                    placeholder="5"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#061B16] border border-[#19D66B]/30 text-xs text-[#F5F7F6] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#19D66B] to-[#B8F500] text-[#061B16] font-extrabold text-xs shadow-md"
                >
                  {editingProduct ? 'Update Product' : 'Save New Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-3 rounded-xl bg-[#10352D] text-[#A9B8B3] text-xs font-semibold"
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
