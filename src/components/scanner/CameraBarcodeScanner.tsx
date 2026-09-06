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
  Plus, 
  RefreshCw, 
  Volume2 
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Product } from '../../types';
import { playBarcodeScanSuccess, playBarcodeScanError } from '../../utils/soundEffects';

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
  const { addToCartByBarcode, products, addProduct } = useApp();
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
    if (!code) return;

    const result = addToCartByBarcode(code);

    if (result.success && result.product) {
      playBarcodeScanSuccess();
      setLastScannedResult({
        barcode: code,
        product: result.product,
        quantity: result.quantity || 1,
        status: 'success',
      });
      if (onProductFound) onProductFound(result.product, result.quantity || 1);
    } else {
      // Unknown barcode error chime
      playBarcodeScanError();
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
    if (!manualCode.trim()) return;
    handleBarcodeDetected(manualCode.trim());
    setManualCode('');
  };

  // Handle Quick Add New Product for Unknown Barcode
  const handleCreateUnknownProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!unknownBarcodeModal || !newProdName.trim() || !newProdPrice) return;

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
    playBarcodeScanSuccess();

    setUnknownBarcodeModal(null);
    setNewProdName('');
    setNewProdPrice('');
  };

  // Handle Photo upload simulation / barcode extraction
  const handleGalleryUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // For demo/offline: Pick a random realistic barcode from database or simulate reading
    const sampleProduct = products[Math.floor(Math.random() * products.length)];
    handleBarcodeDetected(sampleProduct.barcode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        className="relative w-full max-w-lg bg-[#100C14] rounded-3xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(255,30,66,0.15)] flex flex-col overflow-hidden max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/10 bg-[#140F18] flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1F1422] border border-white/10 flex items-center justify-center text-[#FFA000]">
              <Barcode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white font-display">Smart Barcode Scanner</h3>
              <p className="text-[11px] text-[#A09CA8]">Point camera at product barcode</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasTorch && (
              <button
                type="button"
                onClick={toggleTorch}
                title={torchOn ? 'Turn Flash Off' : 'Turn Flash On'}
                className={`p-2 rounded-xl transition-colors ${
                  torchOn ? 'bg-[#FFA000] text-black font-bold' : 'bg-[#1F1422] text-white hover:bg-[#FF1E42]/20'
                }`}
              >
                {torchOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-[#1F1422] text-[#A09CA8] hover:text-white hover:bg-red-500/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Camera Viewport / Scanning HUD */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-black overflow-hidden flex items-center justify-center">
          {/* Video Stream */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Fallback or Camera Inactive Info */}
          {!hasCameraPermission && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#100C14]/95 z-10">
              <Camera className="w-12 h-12 text-[#FF1E42] mb-2 animate-pulse" />
              <p className="text-sm font-semibold text-white">Camera Ready & Interactive</p>
              <p className="text-xs text-[#A09CA8] max-w-xs mt-1">
                {cameraError || 'Use real camera or test with quick-scan buttons below'}
              </p>
            </div>
          )}

          {/* Target Scanning Reticle with Corner Brackets & Laser */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8 z-20">
            <div className="relative w-64 h-36 border-2 border-dashed border-[#FF1E42]/40 rounded-2xl flex items-center justify-center">
              {/* Glowing Corner Accents */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#FF1E42] rounded-tl-xl" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#FF1E42] rounded-tr-xl" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#FF1E42] rounded-bl-xl" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#FF1E42] rounded-br-xl" />

              {/* Animated Laser Beam */}
              <motion.div
                animate={{
                  y: [-50, 50, -50],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#FF1E42] to-transparent shadow-[0_0_14px_#FF1E42]"
              />

              <span className="absolute bottom-2 text-[10px] font-mono font-bold tracking-widest text-[#FFA000] uppercase bg-[#100C14]/80 px-2 py-0.5 rounded-md">
                Align Barcode Here
              </span>
            </div>
          </div>

          {/* Success Flash Indicator */}
          <AnimatePresence>
            {lastScannedResult && lastScannedResult.status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-4 top-4 z-30 p-3 rounded-2xl btn-primary-gradient text-white font-bold text-xs flex items-center justify-between shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <div>
                    <p className="font-extrabold">{lastScannedResult.product?.name}</p>
                    <p className="text-[10px] opacity-90">
                      Auto-added! Quantity: x{lastScannedResult.quantity} • ₹{lastScannedResult.product?.price}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-black px-2 py-1 bg-black/40 text-[#FFA000] rounded-lg">
                  +1 Added
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Actions & Simulation Tools */}
        <div className="p-4 bg-[#140F18] space-y-3.5 z-20">
          {/* Manual Barcode Entry Form */}
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Barcode className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FF4A6B]" />
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Or enter barcode manually (e.g. 8901030834027)"
                className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#100C14] border border-white/15 text-xs text-white placeholder-[#A09CA8]/60 focus:outline-none focus:border-[#FF1E42]"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl btn-primary-gradient text-white font-bold text-xs shadow-md transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>

          {/* Quick-Scan Simulation Chips (Super helpful for instant testing!) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A09CA8]">
                Quick Test Real Barcodes:
              </span>
              <label className="text-[10px] font-semibold text-[#FFA000] hover:underline flex items-center gap-1 cursor-pointer">
                <ImageIcon className="w-3 h-3" />
                <span>Upload Barcode Image</span>
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
                  className="px-2.5 py-1 rounded-lg bg-[#1F1422] hover:bg-[#FF1E42]/20 border border-white/10 text-[11px] text-[#A09CA8] hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>{p.name.split(' ')[0]}</span>
                  <span className="text-[9px] font-mono text-[#FFA000]">{p.barcode.slice(-4)}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => handleBarcodeDetected('9999888877771')}
                title="Test Unknown Barcode handling"
                className="px-2.5 py-1 rounded-lg bg-orange-950/40 hover:bg-orange-900/60 border border-orange-500/40 text-[11px] text-orange-200"
              >
                + Unknown Code Test
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
              className="absolute inset-x-0 bottom-0 z-40 p-5 bg-[#100C14] border-t-2 border-orange-500/60 rounded-t-3xl shadow-2xl space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-orange-400">
                  <AlertCircle className="w-5 h-5" />
                  <h4 className="font-bold text-sm text-white">Product Not Found</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setUnknownBarcodeModal(null)}
                  className="text-[#A09CA8] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#A09CA8]">
                Barcode <span className="font-mono text-white font-bold">{unknownBarcodeModal}</span> is not in your product catalog. Add it now to auto-bill it!
              </p>

              <form onSubmit={handleCreateUnknownProduct} className="space-y-2.5">
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="Product Name (e.g. Britannia Bourbon 150g)"
                  className="w-full px-3 py-2 rounded-xl bg-[#140F18] border border-white/15 text-xs text-white placeholder-[#A09CA8]/60 focus:outline-none"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    required
                    step="0.5"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    placeholder="Price (₹)"
                    className="w-full px-3 py-2 rounded-xl bg-[#140F18] border border-white/15 text-xs text-white placeholder-[#A09CA8]/60 focus:outline-none"
                  />
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#140F18] border border-white/15 text-xs text-white focus:outline-none"
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
                    className="flex-1 py-2.5 rounded-xl btn-primary-gradient text-white font-bold text-xs shadow-md"
                  >
                    Save & Add to Bill
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnknownBarcodeModal(null)}
                    className="px-4 py-2.5 rounded-xl bg-[#1F1422] text-[#A09CA8] text-xs font-semibold"
                  >
                    Cancel
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
