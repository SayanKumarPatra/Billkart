import { Language } from '../types';

export interface Translations {
  // Brand & General
  appName: string;
  tagline: string;
  smartBilling: string;
  simpleBusiness: string;
  search: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  add: string;
  actions: string;
  status: string;
  date: string;
  total: string;
  quantity: string;
  price: string;
  phone: string;
  name: string;
  address: string;
  confirm: string;
  continue: string;
  back: string;
  loading: string;
  close: string;
  print: string;
  download: string;
  share: string;
  emptyState: string;

  // Navigation
  navDashboard: string;
  navCreateBill: string;
  navProducts: string;
  navCustomers: string;
  navBills: string;
  navReports: string;
  navSettings: string;
  navHelp: string;
  navScanBarcode: string;
  navQuickBill: string;

  // Header
  currentBill: string;
  notifications: string;
  noNotifications: string;
  soundEnabled: string;
  soundMuted: string;
  switchLanguage: string;
  terminalOnline: string;

  // Language Selection Screen
  selectLanguageTitle: string;
  selectLanguageSubtitle: string;
  choosePrompt: string;
  englishLabel: string;
  englishSub: string;
  bengaliLabel: string;
  bengaliSub: string;
  continueInLanguage: string;
  bilingualNotice: string;

  // Dashboard Page
  welcomeTitle: string;
  posTerminalActive: string;
  todaySales: string;
  todayBillsCount: string;
  totalCustomers: string;
  lowStockAlert: string;
  quickActions: string;
  startNewBill: string;
  scanProductBarcode: string;
  addNewProduct: string;
  viewAllReports: string;
  recentTransactions: string;
  noRecentTransactions: string;
  viewAllBills: string;

  // Create Bill / POS
  posBillingTitle: string;
  scanOrSearchPlaceholder: string;
  quickBarcodeTip: string;
  customerInformation: string;
  customerName: string;
  customerPhone: string;
  walkInCustomer: string;
  cartTitle: string;
  emptyCartPrompt: string;
  itemName: string;
  rate: string;
  qty: string;
  discount: string;
  taxGst: string;
  subtotal: string;
  grandTotal: string;
  clearCart: string;
  generateBillBtn: string;
  addCustomItem: string;
  customItemName: string;
  customItemPrice: string;
  applyDiscount: string;

  // Payment Modal
  collectPaymentTitle: string;
  paymentMethod: string;
  payUPI: string;
  payCash: string;
  payCard: string;
  payBank: string;
  scanUpiPrompt: string;
  cashReceived: string;
  changeDue: string;
  exactCash: string;
  confirmPaymentBtn: string;
  paymentSuccessTitle: string;
  invoiceGenerated: string;
  printThermalReceipt: string;
  downloadInvoicePdf: string;
  shareOnWhatsApp: string;
  newSaleBtn: string;

  // Products Page
  productsInventoryTitle: string;
  addProductBtn: string;
  barcode: string;
  category: string;
  stockQty: string;
  minStockLevel: string;
  mrp: string;
  sellingPrice: string;
  noProductsFound: string;

  // Customers Page
  customerDirectoryTitle: string;
  addCustomerBtn: string;
  totalPurchases: string;
  billsCount: string;
  noCustomersFound: string;

  // Settings Page
  settingsTitle: string;
  storeDetails: string;
  shopName: string;
  ownerName: string;
  email: string;
  gstNumber: string;
  upiId: string;
  invoicePrefix: string;
  saveConfiguration: string;
  audioFeedbackTitle: string;
  audioFeedbackDesc: string;
  testScannerBeep: string;
  testErrorChime: string;
  testBillChime: string;
  testPaymentFanfare: string;
  dataBackupTitle: string;
  exportJson: string;
  exportCsv: string;
  restoreJson: string;
  resetDemoData: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Brand & General
    appName: 'BillKart',
    tagline: 'Smart Billing • Simple Business',
    smartBilling: 'Smart Billing',
    simpleBusiness: 'Simple Business',
    search: 'Search...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    actions: 'Actions',
    status: 'Status',
    date: 'Date',
    total: 'Total',
    quantity: 'Qty',
    price: 'Price',
    phone: 'Phone',
    name: 'Name',
    address: 'Address',
    confirm: 'Confirm',
    continue: 'Continue',
    back: 'Back',
    loading: 'Loading...',
    close: 'Close',
    print: 'Print Receipt',
    download: 'Download',
    share: 'Share',
    emptyState: 'No items found',

    // Navigation
    navDashboard: 'Dashboard',
    navCreateBill: 'Create Bill',
    navProducts: 'Products',
    navCustomers: 'Customers',
    navBills: 'Bills & History',
    navReports: 'Reports',
    navSettings: 'Settings',
    navHelp: 'Help & Guide',
    navScanBarcode: 'Scan Barcode',
    navQuickBill: 'Quick Bill',

    // Header
    currentBill: 'Current Bill',
    notifications: 'Notifications',
    noNotifications: 'No notifications',
    soundEnabled: 'Sound Enabled',
    soundMuted: 'Sound Muted',
    switchLanguage: 'বাংলায় দেখুন',
    terminalOnline: 'Terminal Online',

    // Language Selection Screen
    selectLanguageTitle: 'Choose Your Language',
    selectLanguageSubtitle: 'Select how you would like to experience BillKart. You can change this anytime from settings.',
    choosePrompt: 'Select your preferred language to proceed',
    englishLabel: 'English',
    englishSub: 'Default international business standard',
    bengaliLabel: 'বাংলা (Bengali)',
    bengaliSub: 'সহজ ও সাবলীল বাংলা ভাষায় ব্যবসা পরিচালনা করুন',
    continueInLanguage: 'Continue to BillKart',
    bilingualNotice: 'Instant 1-click language switching available across the entire terminal.',

    // Dashboard Page
    welcomeTitle: 'Dashboard Overview',
    posTerminalActive: 'Smart POS Terminal Active',
    todaySales: "Today's Sales",
    todayBillsCount: "Today's Bills",
    totalCustomers: 'Total Customers',
    lowStockAlert: 'Low Stock Alerts',
    quickActions: 'Quick Actions',
    startNewBill: 'Start New Bill',
    scanProductBarcode: 'Scan Barcode',
    addNewProduct: 'Add Product',
    viewAllReports: 'View Reports',
    recentTransactions: 'Recent Invoices',
    noRecentTransactions: 'No bills created yet. Click "Start New Bill" to generate your first invoice!',
    viewAllBills: 'View All Invoices',

    // Create Bill / POS
    posBillingTitle: 'Smart POS Billing',
    scanOrSearchPlaceholder: 'Scan barcode with scanner or search product by name / code...',
    quickBarcodeTip: 'Press Enter to scan or add product instantly',
    customerInformation: 'Customer Details',
    customerName: 'Customer Name',
    customerPhone: 'Phone Number',
    walkInCustomer: 'Walk-in Customer',
    cartTitle: 'Current Invoice Cart',
    emptyCartPrompt: 'Cart is empty. Scan barcode or search items to begin billing.',
    itemName: 'Product Name',
    rate: 'Rate',
    qty: 'Qty',
    discount: 'Discount',
    taxGst: 'GST (%)',
    subtotal: 'Subtotal',
    grandTotal: 'Grand Total',
    clearCart: 'Clear Cart',
    generateBillBtn: 'Generate Bill & Collect Payment',
    addCustomItem: 'Add Custom Item',
    customItemName: 'Item name / description',
    customItemPrice: 'Price (₹)',
    applyDiscount: 'Apply Discount',

    // Payment Modal
    collectPaymentTitle: 'Collect Payment',
    paymentMethod: 'Payment Method',
    payUPI: 'UPI QR Code',
    payCash: 'Cash',
    payCard: 'Card',
    payBank: 'Bank Transfer',
    scanUpiPrompt: 'Scan QR with any UPI app (GPay, PhonePe, Paytm, BHIM)',
    cashReceived: 'Cash Received (₹)',
    changeDue: 'Change to Return',
    exactCash: 'Exact Cash',
    confirmPaymentBtn: 'Confirm Payment & Print Receipt',
    paymentSuccessTitle: 'Payment Successful!',
    invoiceGenerated: 'Invoice Generated Successfully',
    printThermalReceipt: 'Print Thermal Receipt',
    downloadInvoicePdf: 'Download Invoice (PDF)',
    shareOnWhatsApp: 'Send to Customer on WhatsApp',
    newSaleBtn: 'Start Next Sale',

    // Products Page
    productsInventoryTitle: 'Product Inventory',
    addProductBtn: 'Add New Product',
    barcode: 'Barcode / SKU',
    category: 'Category',
    stockQty: 'Stock Quantity',
    minStockLevel: 'Min Alert Level',
    mrp: 'MRP (₹)',
    sellingPrice: 'Selling Price (₹)',
    noProductsFound: 'No products in inventory. Click "Add New Product" to get started.',

    // Customers Page
    customerDirectoryTitle: 'Customer Directory',
    addCustomerBtn: 'Add Customer',
    totalPurchases: 'Total Purchases',
    billsCount: 'Total Bills',
    noCustomersFound: 'No customers recorded yet.',

    // Settings Page
    settingsTitle: 'Store & Terminal Settings',
    storeDetails: 'Store Profile & Business Details',
    shopName: 'Store Name',
    ownerName: 'Owner Name',
    email: 'Email Address',
    gstNumber: 'GSTIN (Optional)',
    upiId: 'UPI ID for QR Payments',
    invoicePrefix: 'Invoice Prefix (e.g. BK)',
    saveConfiguration: 'Save Configuration',
    audioFeedbackTitle: 'POS Audio Feedback & Sound Effects',
    audioFeedbackDesc: 'Synthesized Web Audio chimes for scanning, billing and payment confirmation',
    testScannerBeep: 'Test Beep',
    testErrorChime: 'Test Chime',
    testBillChime: 'Test Sound',
    testPaymentFanfare: 'Test Fanfare',
    dataBackupTitle: 'Data Backup, Export & Restore',
    exportJson: 'Download Full Backup (JSON)',
    exportCsv: 'Export Invoices to Excel (CSV)',
    restoreJson: 'Restore From File',
    resetDemoData: 'Reset Demo Data',
  },
  bn: {
    // Brand & General
    appName: 'বিলকার্ট',
    tagline: 'স্মার্ট বিলিং • সহজ ব্যবসা',
    smartBilling: 'স্মার্ট বিলিং',
    simpleBusiness: 'সহজ ব্যবসা',
    search: 'অনুসন্ধান করুন...',
    save: 'সংরক্ষণ করুন',
    cancel: 'বাতিল',
    delete: 'মুছে ফেলুন',
    edit: 'সম্পাদনা',
    add: 'যোগ করুন',
    actions: 'পদক্ষেপ',
    status: 'অবস্থা',
    date: 'তারিখ',
    total: 'মোট',
    quantity: 'পরিমাণ',
    price: 'মূল্য',
    phone: 'ফোন নম্বর',
    name: 'নাম',
    address: 'ঠিকানা',
    confirm: 'নিশ্চিত করুন',
    continue: 'চালিয়ে যান',
    back: 'পেছনে',
    loading: 'লোড হচ্ছে...',
    close: 'বন্ধ করুন',
    print: 'রসিদ প্রিন্ট করুন',
    download: 'ডাউনলোড',
    share: 'শেয়ার করুন',
    emptyState: 'কোনো তথ্য পাওয়া যায়নি',

    // Navigation
    navDashboard: 'ড্যাশবোর্ড',
    navCreateBill: 'নতুন বিল',
    navProducts: 'পণ্যসমূহ',
    navCustomers: 'গ্রাহক তালিকা',
    navBills: 'ইনভয়েস হিস্ট্রি',
    navReports: 'রিপোর্ট ও হিসাব',
    navSettings: 'সেটিংস',
    navHelp: 'সাহায্য ও গাইড',
    navScanBarcode: 'বারকোড স্ক্যান',
    navQuickBill: 'কুইক বিল',

    // Header
    currentBill: 'চলতি বিল',
    notifications: 'বিজ্ঞপ্তি',
    noNotifications: 'নতুন কোনো বিজ্ঞপ্তি নেই',
    soundEnabled: 'সাউন্ড চালু',
    soundMuted: 'সাউন্ড বন্ধ',
    switchLanguage: 'English-এ দেখুন',
    terminalOnline: 'টার্মিনাল সক্রিয়',

    // Language Selection Screen
    selectLanguageTitle: 'আপনার পছন্দের ভাষা নির্বাচন করুন',
    selectLanguageSubtitle: 'বিলকার্ট কীভাবে ব্যবহার করতে চান তা বেছে নিন। আপনি পরবর্তীতে সেটিংস থেকে যেকোনো সময় এটি পরিবর্তন করতে পারবেন।',
    choosePrompt: 'শুরু করতে যেকোনো একটি ভাষা বেছে নিন',
    englishLabel: 'English (ইংরেজি)',
    englishSub: 'আন্তর্জাতিক ব্যবসা পরিচালনা ও ইংরেজি ইন্টারফেস',
    bengaliLabel: 'বাংলা (Bengali)',
    bengaliSub: 'সহজ ও সাবলীল বাংলা ভাষায় সম্পূর্ণ ব্যবসা পরিচালনা করুন',
    continueInLanguage: 'বিলকার্ট-এ এগিয়ে যান',
    bilingualNotice: 'অ্যাপের যেকোনো স্ক্রিন থেকে ১-ক্লিকে সহজেই ভাষা পরিবর্তন করা যায়।',

    // Dashboard Page
    welcomeTitle: 'ড্যাশবোর্ড সংক্ষিপ্ত বিবরণ',
    posTerminalActive: 'স্মার্ট পিওএস টার্মিনাল সক্রিয়',
    todaySales: 'আজকের মোট বিক্রি',
    todayBillsCount: 'আজকের মোট বিল',
    totalCustomers: 'মোট গ্রাহক সংখ্যা',
    lowStockAlert: 'কম মজুত পণ্যের সতর্কতা',
    quickActions: 'দ্রুত অ্যাকশন',
    startNewBill: 'নতুন বিল তৈরি করুন',
    scanProductBarcode: 'বারকোড স্ক্যান করুন',
    addNewProduct: 'নতুন পণ্য যোগ করুন',
    viewAllReports: 'রিপোর্ট দেখুন',
    recentTransactions: 'সাম্প্রতিক ইনভয়েস',
    noRecentTransactions: 'এখনো কোনো বিল তৈরি হয়নি। প্রথম ইনভয়েস তৈরি করতে "নতুন বিল তৈরি করুন"-এ ক্লিক করুন!',
    viewAllBills: 'সকল ইনভয়েস দেখুন',

    // Create Bill / POS
    posBillingTitle: 'স্মার্ট পিওএস বিলিং',
    scanOrSearchPlaceholder: 'বারকোড স্ক্যান করুন অথবা পণ্যের নাম বা কোড দিয়ে খুঁজুন...',
    quickBarcodeTip: 'সরাসরি পণ্য যোগ করতে টাইপ করে Enter চাপুন',
    customerInformation: 'গ্রাহকের বিবরণ',
    customerName: 'গ্রাহকের নাম',
    customerPhone: 'মোবাইল নম্বর',
    walkInCustomer: 'নিয়মিত খদ্দের (ওয়াক-ইন)',
    cartTitle: 'বর্তমান ইনভয়েস কার্ট',
    emptyCartPrompt: 'কার্ট খালি রয়েছে। বিলিং শুরু করতে বারকোড স্ক্যান করুন বা পণ্য যোগ করুন।',
    itemName: 'পণ্যের নাম',
    rate: 'দর',
    qty: 'পরিমাণ',
    discount: 'ছাড়',
    taxGst: 'জিএসটি (%)',
    subtotal: 'উপমোট (সাবটোটাল)',
    grandTotal: 'সর্বমোট প্রদেয়',
    clearCart: 'কার্ট খালি করুন',
    generateBillBtn: 'বিল তৈরি ও পেমেন্ট গ্রহণ করুন',
    addCustomItem: 'ম্যানুয়াল পণ্য যোগ করুন',
    customItemName: 'পণ্যের নাম / বিবরণ',
    customItemPrice: 'মূল্য (₹)',
    applyDiscount: 'ছাড় প্রয়োগ করুন',

    // Payment Modal
    collectPaymentTitle: 'পেমেন্ট সংগ্রহ করুন',
    paymentMethod: 'পেমেন্ট মাধ্যম',
    payUPI: 'ইউপিআই কিউআর কোড (UPI QR)',
    payCash: 'নগদ টাকা (Cash)',
    payCard: 'কার্ড পেমেন্ট',
    payBank: 'ব্যাংক ট্রান্সফার',
    scanUpiPrompt: 'যেকোনো UPI অ্যাপ (GPay, PhonePe, Paytm, BHIM) দিয়ে স্ক্যান করুন',
    cashReceived: 'প্রাপ্ত নগদ টাকা (₹)',
    changeDue: 'ফেরত দেওয়ার পরিমাণ',
    exactCash: 'সঠিক মূল্য',
    confirmPaymentBtn: 'পেমেন্ট নিশ্চিত করুন ও রসিদ প্রিন্ট করুন',
    paymentSuccessTitle: 'পেমেন্ট সফল হয়েছে!',
    invoiceGenerated: 'ইনভয়েস সফলভাবে তৈরি ও সংরক্ষিত হয়েছে',
    printThermalReceipt: 'থার্মাল রসিদ প্রিন্ট করুন',
    downloadInvoicePdf: 'ইনভয়েস ডাউনলোড (PDF)',
    shareOnWhatsApp: 'গ্রাহককে হোয়াটসঅ্যাপে পাঠান',
    newSaleBtn: 'পরবর্তী বিক্রয় শুরু করুন',

    // Products Page
    productsInventoryTitle: 'পণ্য ইনভেন্টরি ও স্টক',
    addProductBtn: 'নতুন পণ্য যোগ করুন',
    barcode: 'বারকোড / এসকেইউ',
    category: 'ক্যাটাগরি',
    stockQty: 'মজুত পরিমাণ',
    minStockLevel: 'ন্যূনতম সতর্কতা স্তর',
    mrp: 'সর্বোচ্চ খুচরা মূল্য (MRP)',
    sellingPrice: 'বিক্রয় মূল্য (₹)',
    noProductsFound: 'ইনভেন্টরিতে কোনো পণ্য নেই। শুরু করতে "নতুন পণ্য যোগ করুন"-এ ক্লিক করুন।',

    // Customers Page
    customerDirectoryTitle: 'গ্রাহক ডিরেক্টরি',
    addCustomerBtn: 'নতুন গ্রাহক যোগ করুন',
    totalPurchases: 'মোট কেনাকাটা',
    billsCount: 'মোট বিল সংখ্যা',
    noCustomersFound: 'এখনো কোনো গ্রাহক যোগ করা হয়নি।',

    // Settings Page
    settingsTitle: 'দোকান ও টার্মিনাল সেটিংস',
    storeDetails: 'দোকানের বিবরণ ও প্রোফাইল',
    shopName: 'দোকানের নাম',
    ownerName: 'মালিকের নাম',
    email: 'ইমেইল ঠিকানা',
    gstNumber: 'জিএসটি নম্বর (ঐচ্ছিক)',
    upiId: 'ইউপিআই আইডি (QR পেমেন্টের জন্য)',
    invoicePrefix: 'ইনভয়েস প্রিফিক্স (যেমন: BK)',
    saveConfiguration: 'কনফিগারেশন সংরক্ষণ করুন',
    audioFeedbackTitle: 'পিওএস সাউন্ড ইফেক্টস ও অডিও ফিডব্যাক',
    audioFeedbackDesc: 'স্ক্যানিং, বিলিং এবং পেমেন্ট নিশ্চিতকরণের জন্য ওয়েব অডিও সাউন্ড',
    testScannerBeep: 'টেস্ট বিপ',
    testErrorChime: 'টেস্ট চাইম',
    testBillChime: 'টেস্ট সাউন্ড',
    testPaymentFanfare: 'টেস্ট ফ্যানফেয়ার',
    dataBackupTitle: 'ডাটা ব্যাকআপ, এক্সপোর্ট ও রিস্টোর',
    exportJson: 'সম্পূর্ণ ব্যাকআপ ডাউনলোড (JSON)',
    exportCsv: 'ইনভয়েস এক্সপোর্ট করুন (Excel CSV)',
    restoreJson: 'ফাইল থেকে রিস্টোর করুন',
    resetDemoData: 'ডেমো ডাটা রিসেট করুন',
  },
};
