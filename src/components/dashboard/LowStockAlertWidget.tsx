import { useState } from 'react';
import { 
  AlertTriangle, 
  AlertCircle, 
  Package, 
  Plus, 
  ChevronRight, 
  CheckCircle2, 
  TrendingDown, 
  ArrowUpRight, 
  Edit2, 
  Check, 
  X,
  Layers,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Product } from '../../types';
import { playSound } from '../../utils/audioHelper';

export function LowStockAlertWidget() {
  const { products, updateProduct, setCurrentView, language } = useApp();
  const isBn = language === 'bn';

  const [filter, setFilter] = useState<'ALL' | 'OUT_OF_STOCK' | 'LOW'>('ALL');
  const [editingStockProduct, setEditingStockProduct] = useState<Product | null>(null);
  const [newStockValue, setNewStockValue] = useState<string>('');
  const [newMinAlertValue, setNewMinAlertValue] = useState<string>('');
  const [justRestockedId, setJustRestockedId] = useState<string | null>(null);

  // Identify products at or below their minimum stock threshold
  const lowStockProducts = products.filter(p => p.stock <= p.minStockAlert);
  
  // Sort: Out-of-stock items (stock === 0) first, then by lowest stock
  const sortedAlerts = [...lowStockProducts].sort((a, b) => {
    if (a.stock === 0 && b.stock !== 0) return -1;
    if (b.stock === 0 && a.stock !== 0) return 1;
    return a.stock - b.stock;
  });

  const outOfStockCount = lowStockProducts.filter(p => p.stock === 0).length;
  const criticalLowCount = lowStockProducts.filter(p => p.stock > 0).length;

  const filteredList = sortedAlerts.filter(p => {
    if (filter === 'OUT_OF_STOCK') return p.stock === 0;
    if (filter === 'LOW') return p.stock > 0;
    return true;
  });

  // Quick instant restock handler
  const handleQuickAddStock = (product: Product, amountToAdd: number) => {
    playSound('click');
    const updatedStock = product.stock + amountToAdd;
    updateProduct(product.id, { stock: updatedStock });
    
    setJustRestockedId(product.id);
    setTimeout(() => {
      setJustRestockedId(null);
    }, 1800);
  };

  // Open custom stock edit modal
  const handleOpenEditModal = (product: Product) => {
    playSound('click');
    setEditingStockProduct(product);
    setNewStockValue(String(product.stock));
    setNewMinAlertValue(String(product.minStockAlert));
  };

  // Save custom stock & min alert values
  const handleSaveStock = () => {
    if (!editingStockProduct) return;
    playSound('click');
    const parsedStock = Math.max(0, parseInt(newStockValue, 10) || 0);
    const parsedMin = Math.max(1, parseInt(newMinAlertValue, 10) || 5);

    updateProduct(editingStockProduct.id, {
      stock: parsedStock,
      minStockAlert: parsedMin,
    });

    setEditingStockProduct(null);
  };

  // Simulate low stock for testing if user has none
  const handleSimulateLowStock = () => {
    playSound('click');
    if (products.length > 0) {
      // Pick first product and set stock below its alert threshold
      const target = products[0];
      updateProduct(target.id, {
        stock: Math.max(0, Math.floor(target.minStockAlert / 2)),
      });
    }
  };

  return (
    <div id="low-stock-alert-section" className="space-y-3">
      {/* Alert Header / Container Card */}
      <div className={`p-4 sm:p-5 rounded-2xl border shadow-xs transition-all ${
        lowStockProducts.length > 0 
          ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60' 
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      }`}>
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-200/70 dark:border-amber-900/40">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
              outOfStockCount > 0
                ? 'bg-red-500 text-white animate-pulse'
                : lowStockProducts.length > 0
                ? 'bg-amber-500 text-white'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600'
            }`}>
              {lowStockProducts.length > 0 ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{isBn ? 'কম মজুত পণ্যের সতর্কতা' : 'Low Stock Alerts'}</span>
                </h3>

                {lowStockProducts.length > 0 ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                    <span>{lowStockProducts.length}</span>
                    <span className="font-normal">{isBn ? 'টি পণ্য পুনর্মজুত প্রয়োজন' : 'items need restock'}</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    {isBn ? 'সব পণ্যের স্টক পর্যাপ্ত' : 'Healthy Inventory'}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {isBn
                  ? 'যেসব পণ্যের স্টক তাদের ন্যূনতম নির্ধারিত সীমার সমান বা নিচে নেমে গেছে'
                  : 'Products that have reached or fallen below their minimum stock threshold'}
              </p>
            </div>
          </div>

          {/* Quick Actions / Navigation */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            {lowStockProducts.length > 0 && (
              <div className="flex items-center bg-white dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    filter === 'ALL'
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isBn ? 'সকল' : 'All'} ({lowStockProducts.length})
                </button>
                {outOfStockCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilter('OUT_OF_STOCK')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      filter === 'OUT_OF_STOCK'
                        ? 'bg-red-500 text-white shadow-2xs'
                        : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40'
                    }`}
                  >
                    {isBn ? 'স্টক শেষ' : 'Out'} ({outOfStockCount})
                  </button>
                )}
                {criticalLowCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setFilter('LOW')}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      filter === 'LOW'
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                    }`}
                  >
                    {isBn ? 'কম স্টক' : 'Low'} ({criticalLowCount})
                  </button>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => setCurrentView('products')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs shrink-0"
              title={isBn ? 'ইনভেন্টরিতে সকল পণ্য দেখুন' : 'View all items in inventory'}
            >
              <span>{isBn ? 'ইনভেন্টরি' : 'Inventory'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content: When low stock items exist */}
        {lowStockProducts.length > 0 ? (
          <div className="pt-3 space-y-2.5">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredList.map((product) => {
                const isOutOfStock = product.stock === 0;
                const stockRatio = product.minStockAlert > 0 
                  ? Math.min(100, Math.round((product.stock / product.minStockAlert) * 100))
                  : 0;
                const shortage = Math.max(0, product.minStockAlert - product.stock);
                const isJustRestocked = justRestockedId === product.id;

                return (
                  <div
                    key={product.id}
                    className={`p-3.5 rounded-xl bg-white dark:bg-slate-900 border transition-all relative overflow-hidden shadow-xs ${
                      isOutOfStock
                        ? 'border-red-200 dark:border-red-900/80 bg-red-50/30 dark:bg-red-950/10'
                        : 'border-amber-200 dark:border-amber-900/60'
                    }`}
                  >
                    {/* Top Status & Category Badges */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md truncate max-w-[150px]">
                        {product.category}
                      </span>

                      {isOutOfStock ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800 flex items-center gap-1 shrink-0">
                          <AlertCircle className="w-3 h-3 text-red-600" />
                          <span>{isBn ? 'স্টক শেষ (০)' : 'Out of Stock'}</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1 shrink-0">
                          <TrendingDown className="w-3 h-3 text-amber-600" />
                          <span>{isBn ? 'কম মজুত' : 'Low Stock'}</span>
                        </span>
                      )}
                    </div>

                    {/* Product Name & Barcode */}
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 leading-snug" title={product.name}>
                        {product.name}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {product.barcode} • ₹{product.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Stock Metrics & Visual Gauge Bar */}
                    <div className="mt-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {isBn ? 'বর্তমান স্টক:' : 'Current Stock:'}
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className={`font-mono text-sm font-black ${
                            isOutOfStock ? 'text-red-600' : 'text-amber-600'
                          }`}>
                            {product.stock}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            / {product.minStockAlert} {product.unit} ({isBn ? 'ন্যূনতম' : 'min'})
                          </span>
                        </div>
                      </div>

                      {/* Visual Stock Percentage Gauge */}
                      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isOutOfStock ? 'w-0' : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.max(4, stockRatio)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
                        <span>
                          {isBn ? 'ঘাটতি:' : 'Shortage:'}{' '}
                          <strong className="text-red-600 dark:text-red-400 font-mono">
                            {shortage} {product.unit}
                          </strong>
                        </span>
                        <span>{stockRatio}% {isBn ? 'স্টক আছে' : 'level'}</span>
                      </div>
                    </div>

                    {/* Quick Restock Action Buttons */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold mr-0.5">
                          {isBn ? 'যোগ:' : 'Add:'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuickAddStock(product, 5)}
                          className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold transition-colors"
                          title={isBn ? '+৫ স্টক বৃদ্ধি করুন' : 'Add 5 units to stock'}
                        >
                          +5
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAddStock(product, 10)}
                          className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold transition-colors"
                          title={isBn ? '+১০ স্টক বৃদ্ধি করুন' : 'Add 10 units to stock'}
                        >
                          +10
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickAddStock(product, 25)}
                          className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold transition-colors hidden sm:inline-block"
                          title={isBn ? '+২৫ স্টক বৃদ্ধি করুন' : 'Add 25 units to stock'}
                        >
                          +25
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(product)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        title={isBn ? 'স্টক সংখ্যা বা সতর্কতার সীমা পরিবর্তন' : 'Set custom stock and alert limit'}
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>{isBn ? 'স্টক নির্ধারণ' : 'Set'}</span>
                      </button>
                    </div>

                    {/* Instant Restocked Feedback Overlay */}
                    {isJustRestocked && (
                      <div className="absolute inset-0 bg-emerald-500/90 text-white flex items-center justify-center font-bold text-xs gap-1.5 backdrop-blur-xs transition-opacity animate-in fade-in">
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>{isBn ? 'স্টক আপডেট সম্পন্ন!' : 'Stock Restocked!'}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sub-Footer Tip */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
              <span className="flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {isBn
                    ? 'ক্যাশ মেমো তৈরির সময় পণ্য বিক্রি হলে স্বয়ংক্রিয়ভাবে স্টক কমে যায়।'
                    : 'Stock automatically deducts when invoices are generated at checkout.'}
                </span>
              </span>

              <button
                type="button"
                onClick={() => setCurrentView('products')}
                className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1"
              >
                <span>{isBn ? 'সম্পূর্ণ ইনভেন্টরি ম্যানেজ করুন' : 'Manage Full Inventory'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* When all products have healthy stock */
          <div className="py-5 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {isBn ? 'সব পণ্যের স্টক পর্যাপ্ত রয়েছে!' : 'All stock levels are healthy!'}
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-0.5">
                {isBn
                  ? 'কোনো পণ্য তার ন্যূনতম সতর্কতার সীমায় পৌঁছায়নি। নিয়মিত বিক্রি চালিয়ে যান।'
                  : 'No products have fallen below their minimum stock thresholds.'}
              </p>
            </div>
            <div className="pt-1 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentView('products')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isBn ? 'ইনভেন্টরি দেখুন' : 'View Inventory'}</span>
              </button>

              <button
                type="button"
                onClick={handleSimulateLowStock}
                className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 text-xs font-medium transition-colors inline-flex items-center gap-1"
                title={isBn ? 'একটি পণ্যের স্টক কমিয়ে সতর্কতা ফিচারটি টেস্ট করুন' : 'Simulate low stock on a product to test the alert widget'}
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>{isBn ? 'টেস্ট সতর্কবার্তা তৈরি' : 'Simulate Low Stock'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Stock & Threshold Modal */}
      {editingStockProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isBn ? 'স্টক ও সতর্কবার্তা সীমা নির্ধারণ' : 'Update Stock & Alert Level'}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                    {editingStockProduct.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingStockProduct(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'বর্তমান মজুত সংখ্যা (Current Stock):' : 'Current Stock Quantity:'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={newStockValue}
                    onChange={(e) => setNewStockValue(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                  <span className="text-xs font-semibold text-slate-500">
                    {editingStockProduct.unit}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isBn ? 'ন্যূনতম সতর্কতা সীমা (Min Stock Alert Threshold):' : 'Minimum Stock Alert Threshold:'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={newMinAlertValue}
                    onChange={(e) => setNewMinAlertValue(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                  <span className="text-xs font-semibold text-slate-500">
                    {editingStockProduct.unit}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {isBn 
                    ? 'স্টক এই সংখ্যার সমান বা নিচে নামলে ড্যাশবোর্ডে অ্যালার্ট দেখানো হবে।'
                    : 'Alert triggers whenever stock reaches or falls below this number.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingStockProduct(null)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              >
                {isBn ? 'বাতিল' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveStock}
                className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                {isBn ? 'সংরক্ষণ করুন' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
