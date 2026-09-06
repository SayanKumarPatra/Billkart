import { useEffect, useRef, useState, type FormEvent, type ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Zap, 
  ZapOff, 
  Image as ImageIcon, 
  Barcode, 
  Camera, 
  AlertCircle, 
  CheckCircle2, 
  Plus
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Product } from '../../types';
import { playSound } from '../../utils/audioHelper';

interface CameraBarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onProductFound?: (product: Product, quantity: number) => void;
  onUnknownBarcode?: (barcode: string) => void;
}

export function CameraBarcodeScanner({
  isOpen,
  onClose,
  onProductFound,
  onUnknownBarcode,
}: CameraBarcodeScannerProps) {
  const { addToCartByBarcode, products, addProduct, language } = useApp();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [manualCode, setManualCode] = useState('');
  
  // Feedback states
  const [lastScannedResult, setLastScannedResult] = useState<{
    product?: Product;
    quantity?: number;
    barcode: string;
    status: 'success' | 'unknown';
  } | null>(null);

  // Unknown Product Quick-Add Modal
  const [unknownBarcodeModal, setUnknownBarcodeModal] = useState<string | null>(null);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('General');

  // Start Camera when scanner opens
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    let isMounted = true;

    async function initCamera() {
      setCameraError(null);
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera not supported in this browser environment');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (!isMounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }

        // Check torch support
        const track = stream.getVideoTracks()[0];
        const capabilities: any = track.getCapabilities ? track.getCapabilities() : {};
        if (capabilities.torch) {
          setHasTorch(true);
        }
      } catch (err: any) {
        console.warn('Camera stream error:', err);
        if (isMounted) {
          setHasCameraPermission(false);
          setCameraError(err.message || 'Camera permission denied or camera device busy');
        }
      }
    }

    initCamera();

    // Barcode Detection loop if BarcodeDetector is available natively
    let barcodeDetector: any = null;
    let detectionInterval: any = null;

    if ('BarcodeDetector' in window) {
      try {
        barcodeDetector = new (window as any).BarcodeDetector({
          formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code'],
        });

        detectionInterval = setInterval(async () => {
          if (!videoRef.current || videoRef.current.readyState < 2) return;
          try {
            const barcodes = await barcodeDetector.detect(videoRef.current);
            if (barcodes && barcodes.length > 0) {
              const rawValue = barcodes[0].rawValue;
              if (rawValue) {
                handleBarcodeDetected(rawValue);
              }
            }
          } catch (e) {
            // Frame detection error, ignore
          }
        }, 500);
      } catch (e) {
        // Native detector failed
      }
    }

    return () => {
      isMounted = false;
      stopCamera();
      if (detectionInterval) clearInterval(detectionInterval);
    };
  }, [isOpen]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;
    try {
      const nextTorch = !torchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: nextTorch }],
      });
      setTorchOn(nextTorch);
    } catch (e) {
      console.warn('Failed to toggle torch', e);
    }
  };

  // Central Barcode Processing Logic
  const handleBarcodeDetected = (rawCode: string) => {
    const code = rawCode.trim();
    if (!code) {
      playSound('error');
      return;
    }

    const result = addToCartByBarcode(code);

    if (result.success && result.product) {
      playSound('success');
      setLastScannedResult({
        barcode: code,
        product: result.product,
        quantity: result.quantity || 1,
        status: 'success',
      });
      if (onProductFound) onProductFound(result.product, result.quantity || 1);
    } else {
      playSound('error');
      setLastScannedResult({
        barcode: code,
        status: 'unknown',
      });
      setUnknownBarcodeModal(code);
      if (onUnknownBarcode) onUnknownBarcode(code);
    }
  };

  const handleManualSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) {
      playSound('error');
      return;
    }
    handleBarcodeDetected(manualCode.trim());
    setManualCode('');
  };

  // Handle Quick Add New Product for Unknown Barcode
  const handleCreateUnknownProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!unknownBarcodeModal || !newProdName.trim() || !newProdPrice) {
      playSound('error');
      return;
    }

    const added = addProduct({
      name: newProdName.trim(),
      barcode: unknownBarcodeModal,
      price: parseFloat(newProdPrice) || 50,
      stock: 50,
      minStockAlert: 10,
      category: newProdCategory,
      unit: 'pcs',
    });

    // Add to cart immediately
    addToCartByBarcode(added.barcode);
    playSound('success');

    setUnknownBarcodeModal(null);
    setNewProdName('');
    setNewProdPrice('');
  };

  // Handle Photo upload simulation / barcode extraction
  const handleGalleryUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sampleProduct = products.length > 0 ? products[Math.floor(Math.random() * products.length)] : null;
    if (sampleProduct) {
      handleBarcodeDetected(sampleProduct.barcode);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
              <Barcode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">
                {language === 'bn' ? 'বারকোড স্ক্যানার' : 'Smart Barcode Scanner'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === 'bn' ? 'পণ্যের বারকোডের সামনে ক্যামেরা ধরুন' : 'Point camera at product barcode'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {hasTorch && (
              <button
                type="button"
                onClick={toggleTorch}
                title={torchOn ? 'Turn Flash Off' : 'Turn Flash On'}
                className={`p-2 rounded-xl transition-colors ${
                  torchOn ? 'bg-amber-500 text-white font-bold' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {torchOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Camera Viewport */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-slate-950 overflow-hidden flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {!hasCameraPermission && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-900/90 z-10">
              <Camera className="w-10 h-10 text-blue-500 mb-2" />
              <p className="text-sm font-semibold text-white">
                {language === 'bn' ? 'ক্যামেরা স্ক্যান সক্রিয়' : 'Camera Scanner Ready'}
              </p>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                {cameraError || (language === 'bn' ? 'ক্যামেরা ব্যবহার করুন অথবা নিচের কোড বোতামে চাপুন' : 'Use camera or click quick-test buttons below')}
              </p>
            </div>
          )}

          {/* Target Scanning Reticle with Blue Corners */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8 z-20">
            <div className="relative w-64 h-36 border-2 border-dashed border-blue-500/50 rounded-xl flex items-center justify-center">
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-3 border-l-3 border-blue-500 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-3 border-r-3 border-blue-500 rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-3 border-l-3 border-blue-500 rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-3 border-r-3 border-blue-500 rounded-br-lg" />

              <motion.div
                animate={{ y: [-45, 45, -45] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_10px_#3B82F6]"
              />

              <span className="absolute bottom-2 text-[10px] font-mono font-bold tracking-wider text-white uppercase bg-slate-900/80 px-2 py-0.5 rounded">
                {language === 'bn' ? 'বারকোড সোজা রাখুন' : 'Align Barcode Here'}
              </span>
            </div>
          </div>

          {/* Success Flash Toast */}
          <AnimatePresence>
            {lastScannedResult && lastScannedResult.status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-4 top-4 z-30 p-3 rounded-xl bg-blue-600 text-white font-medium text-xs flex items-center justify-between shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <div>
                    <p className="font-bold">{lastScannedResult.product?.name}</p>
                    <p className="text-[10px] opacity-90">
                      {language === 'bn' ? 'বিলে যুক্ত হয়েছে! সংখ্যা: x' : 'Added to bill! Qty: x'}
                      {lastScannedResult.quantity} • ₹{lastScannedResult.product?.price}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-1 bg-white/20 text-white rounded-lg">
                  +1
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Actions & Simulation */}
        <div className="p-4 bg-white dark:bg-slate-900 space-y-3 border-t border-slate-100 dark:border-slate-800 z-20">
          {/* Manual Barcode Entry Form */}
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder={language === 'bn' ? 'অথবা বারকোড নম্বর লিখুন (যেমন 8901030834027)' : 'Or enter barcode manually (e.g. 8901030834027)'}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'যোগ' : 'Add'}</span>
            </button>
          </form>

          {/* Quick-Scan Simulation Chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {language === 'bn' ? 'দ্রুত টেস্ট বারকোড:' : 'Quick Test Barcodes:'}
              </span>
              <label className="text-[10px] font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer">
                <ImageIcon className="w-3 h-3" />
                <span>{language === 'bn' ? 'ছবি থেকে স্ক্যান' : 'Upload Barcode Image'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {products.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleBarcodeDetected(p.barcode)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
                >
                  <span>{p.name.split(' ')[0]}</span>
                  <span className="text-[9px] font-mono text-blue-600">{p.barcode.slice(-4)}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => handleBarcodeDetected('9999888877771')}
                title="Test Unknown Barcode handling"
                className="px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[11px]"
              >
                + {language === 'bn' ? 'অজানা কোড টেস্ট' : 'Unknown Code Test'}
              </button>
            </div>
          </div>
        </div>

        {/* UNKNOWN BARCODE MODAL DIALOG */}
        <AnimatePresence>
          {unknownBarcodeModal && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute inset-x-0 bottom-0 z-40 p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-2xl shadow-2xl space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="w-5 h-5" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {language === 'bn' ? 'নতুন পণ্য যোগ করুন' : 'Product Not Found'}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setUnknownBarcodeModal(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500">
                {language === 'bn' 
                  ? `বারকোড ${unknownBarcodeModal} ক্যাটালগে নেই। এখনই নাম ও দাম দিয়ে সেভ করুন:` 
                  : `Barcode ${unknownBarcodeModal} is not in your catalog. Enter details to auto-add:`}
              </p>

              <form onSubmit={handleCreateUnknownProduct} className="space-y-2.5">
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder={language === 'bn' ? 'পণ্যের নাম (যেমন: ব্রিটানিয়া বিস্কুট)' : 'Product Name'}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    required
                    step="0.5"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="Price (₹)"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  >
                    <option value="General">General</option>
                    <option value="Snacks & Biscuits">Snacks & Biscuits</option>
                    <option value="Grains & Staples">Grains & Staples</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
                  >
                    {language === 'bn' ? 'সংরক্ষণ ও বিলে যোগ' : 'Save & Add to Bill'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnknownBarcodeModal(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold"
                  >
                    {language === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
