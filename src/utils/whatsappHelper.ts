import { Bill, BusinessProfile } from '../types';

/**
 * Formats a bill into a clean, professional, and readable WhatsApp text receipt.
 */
export function formatBillForWhatsApp(
  bill: Bill,
  business: BusinessProfile,
  language: 'bn' | 'en' = 'bn'
): string {
  const isBn = language === 'bn';

  // Format line items
  const itemsText = bill.items
    .map((item, idx) => {
      const itemTotal = `₹${item.total.toFixed(2)}`;
      const itemRate = `₹${item.unitPrice.toFixed(2)}`;
      const unit = item.unit || (isBn ? 'পিস' : 'pcs');
      return `${idx + 1}. *${item.name}*\n   └ ${item.quantity} ${unit} × ${itemRate} = *${itemTotal}*`;
    })
    .join('\n');

  // Breakdown lines
  const discountLine =
    bill.discountAmount > 0
      ? `\n🏷️ ${isBn ? 'ছাড় (ডিসকাউন্ট)' : 'Discount'}: *-₹${bill.discountAmount.toFixed(2)}*`
      : '';

  const gstLine =
    bill.gstAmount > 0
      ? `\n📊 ${isBn ? 'ট্যাক্স (GST)' : 'GST Tax'}: *+₹${bill.gstAmount.toFixed(2)}*`
      : '';

  const notesLine = bill.notes ? `\n📝 ${isBn ? 'নোট' : 'Notes'}: ${bill.notes}` : '';

  const paymentStatusText =
    bill.paymentStatus === 'SUCCESS'
      ? isBn
        ? 'পরিশোধিত ✓'
        : 'PAID ✓'
      : isBn
      ? 'বাকি / অপেক্ষমান'
      : 'PENDING';

  const footerText =
    business.receiptFooterText ||
    (isBn
      ? 'আমাদের দোকানে আসার জন্য আন্তরিক ধন্যবাদ! আবার আসবেন।'
      : 'Thank you for shopping with us! Have a wonderful day.');

  return `═══════════════════════
🧾 *${business.shopName.toUpperCase()}*
${business.tagline ? `_${business.tagline}_\n` : ''}📍 ${business.address}
📞 ${business.phone}${business.gstNumber ? `\n📋 GSTIN: ${business.gstNumber}` : ''}
═══════════════════════
📄 *${isBn ? 'ক্যাশ মেমো / ইনভয়েস' : 'TAX INVOICE / CASH MEMO'}*
${isBn ? 'ইনভয়েস নং' : 'Bill No'}: *#${bill.billNumber}*
${isBn ? 'তারিখ' : 'Date'}: ${bill.date} | ${bill.time}
${isBn ? 'ক্রেতার নাম' : 'Customer'}: *${bill.customerName}*
${isBn ? 'মোবাইল' : 'Phone'}: ${bill.customerPhone}${bill.customerAddress ? `\n📍 ${isBn ? 'ঠিকানা' : 'Address'}: ${bill.customerAddress}` : ''}
───────────────────────
🛒 *${isBn ? 'পণ্যের বিবরণ (আইটেম)' : 'PURCHASED ITEMS'}:*
${itemsText}
───────────────────────
💵 ${isBn ? 'সাবটোটাল' : 'Subtotal'}: *₹${bill.subtotal.toFixed(2)}*${discountLine}${gstLine}
💰 *${isBn ? 'সর্বমোট প্রদেয় বিল' : 'GRAND TOTAL'}: ₹${bill.grandTotal.toFixed(2)}*
───────────────────────
💳 ${isBn ? 'পেমেন্ট মাধ্যম' : 'Payment Method'}: *${bill.paymentMethod}* (${paymentStatusText})
${bill.paymentReference ? `🔖 ${isBn ? 'রেফারেন্স' : 'Ref ID'}: ${bill.paymentReference}\n` : ''}${notesLine}
═══════════════════════
✨ ${footerText}
═══════════════════════`;
}

/**
 * Opens WhatsApp with the formatted bill text.
 * Automatically cleans the recipient phone number.
 */
export function sendBillViaWhatsApp(
  bill: Bill,
  business: BusinessProfile,
  customPhone?: string,
  language: 'bn' | 'en' = 'bn'
): { success: boolean; url: string } {
  const fullText = formatBillForWhatsApp(bill, business, language);
  const encodedText = encodeURIComponent(fullText);

  const rawPhone = customPhone || bill.customerPhone || '';
  const digits = rawPhone.replace(/[^0-9]/g, '');

  let phoneParam = '';
  if (digits.length >= 10) {
    // If Indian 10-digit number without country code, prepend 91
    if (digits.length === 10) {
      phoneParam = `phone=91${digits}`;
    } else {
      phoneParam = `phone=${digits}`;
    }
  }

  // Official universal WhatsApp Web / App endpoint
  const url = phoneParam
    ? `https://api.whatsapp.com/send?${phoneParam}&text=${encodedText}`
    : `https://api.whatsapp.com/send?text=${encodedText}`;

  // Attempt window.open, fall back to link click
  try {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Popup blocked, trigger hidden anchor tag
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    return { success: true, url };
  } catch (err) {
    console.error('Failed to open WhatsApp URL:', err);
    return { success: false, url };
  }
}

/**
 * Copies formatted bill text to clipboard.
 */
export async function copyBillToClipboard(
  bill: Bill,
  business: BusinessProfile,
  language: 'bn' | 'en' = 'bn'
): Promise<boolean> {
  const fullText = formatBillForWhatsApp(bill, business, language);
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(fullText);
      return true;
    } else {
      // Fallback for non-secure context or older browsers
      const textarea = document.createElement('textarea');
      textarea.value = fullText;
      textarea.style.position = 'fixed';
      textarea.style.left = '-999999px';
      textarea.style.top = '-999999px';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    }
  } catch (err) {
    console.error('Clipboard copy error:', err);
    return false;
  }
}

/**
 * Shares bill using Native Web Share API if available (great for mobile WhatsApp).
 */
export async function shareBillNative(
  bill: Bill,
  business: BusinessProfile,
  language: 'bn' | 'en' = 'bn'
): Promise<boolean> {
  const fullText = formatBillForWhatsApp(bill, business, language);
  if (navigator.share) {
    try {
      await navigator.share({
        title: `${business.shopName} - Bill #${bill.billNumber}`,
        text: fullText,
      });
      return true;
    } catch (err) {
      // User cancelled or share failed
      return false;
    }
  }
  return false;
}
