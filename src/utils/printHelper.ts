import { Bill, BusinessProfile } from '../types';

export type PrintFormat = 'thermal' | 'a4';

/**
 * Generates clean HTML for thermal receipt printing.
 */
function generateReceiptHtml(
  bill: Bill,
  business: BusinessProfile,
  format: PrintFormat = 'thermal',
  language: 'bn' | 'en' = 'bn'
): string {
  const isBn = language === 'bn';
  const isThermal = format === 'thermal';

  const itemsHtml = bill.items
    .map(
      (item, idx) => `
      <tr>
        <td style="padding: 4px 2px; text-align: left; vertical-align: top;">
          <strong>${idx + 1}. ${escapeHtml(item.name)}</strong>
        </td>
        <td style="padding: 4px 2px; text-align: center; vertical-align: top; white-space: nowrap;">
          ${item.quantity} ${escapeHtml(item.unit || (isBn ? 'পিস' : 'pcs'))}
        </td>
        <td style="padding: 4px 2px; text-align: right; vertical-align: top; white-space: nowrap;">
          ₹${item.unitPrice.toFixed(2)}
        </td>
        <td style="padding: 4px 2px; text-align: right; vertical-align: top; font-weight: bold; white-space: nowrap;">
          ₹${item.total.toFixed(2)}
        </td>
      </tr>
    `
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="utf-8">
  <title>Receipt - ${bill.billNumber}</title>
  <style>
    @page {
      margin: ${isThermal ? '2mm 4mm' : '10mm 15mm'};
      size: ${isThermal ? '80mm auto' : 'A4 portrait'};
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: ${isThermal ? '11px' : '13px'};
      line-height: 1.35;
      color: #000000;
      background: #ffffff;
      padding: ${isThermal ? '4px' : '16px'};
      max-width: ${isThermal ? '78mm' : '800px'};
      margin: 0 auto;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .text-left { text-align: left; }
    .font-bold { font-weight: bold; }
    .font-black { font-weight: 900; }
    .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    .uppercase { text-transform: uppercase; }
    
    .shop-header {
      text-align: center;
      padding-bottom: 8px;
      margin-bottom: 8px;
      border-bottom: 1px dashed #000;
    }
    .shop-title {
      font-size: ${isThermal ? '15px' : '22px'};
      font-weight: 900;
      letter-spacing: -0.02em;
    }
    .shop-sub {
      font-size: ${isThermal ? '10px' : '12px'};
      color: #222;
      margin-top: 2px;
    }

    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
      padding-bottom: 6px;
      border-bottom: 1px dashed #000;
      font-size: ${isThermal ? '10.5px' : '12px'};
    }
    .meta-table td {
      padding: 1.5px 0;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
      border-bottom: 1px dashed #000;
    }
    .items-table th {
      border-bottom: 1px solid #000;
      padding: 4px 2px;
      font-size: ${isThermal ? '10px' : '11px'};
      font-weight: bold;
      text-transform: uppercase;
    }
    .items-table td {
      border-bottom: 1px dotted #ccc;
      font-size: ${isThermal ? '10.5px' : '12px'};
    }
    .items-table tr:last-child td {
      border-bottom: none;
    }

    .totals-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
      padding-bottom: 6px;
      border-bottom: 1px dashed #000;
      font-size: ${isThermal ? '11px' : '13px'};
    }
    .totals-table td {
      padding: 2.5px 0;
    }
    .grand-total-row td {
      font-size: ${isThermal ? '14px' : '16px'};
      font-weight: 900;
      padding-top: 4px;
      border-top: 1px solid #000;
    }

    .footer {
      text-align: center;
      font-size: ${isThermal ? '9.5px' : '11px'};
      color: #333;
      padding-top: 6px;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <!-- Shop Header -->
  <div class="shop-header">
    <div class="shop-title uppercase">${escapeHtml(business.shopName)}</div>
    ${business.tagline ? `<div class="shop-sub"><em>${escapeHtml(business.tagline)}</em></div>` : ''}
    <div class="shop-sub">${escapeHtml(business.address)}</div>
    <div class="shop-sub">Phone: ${escapeHtml(business.phone)}${business.gstNumber ? ` | GSTIN: ${escapeHtml(business.gstNumber)}` : ''}</div>
  </div>

  <!-- Bill Metadata -->
  <table class="meta-table">
    <tr>
      <td class="text-left font-bold">${isBn ? 'ইনভয়েস নং' : 'Bill No'}: <span class="font-mono">#${escapeHtml(bill.billNumber)}</span></td>
      <td class="text-right">${escapeHtml(bill.date)} ${escapeHtml(bill.time)}</td>
    </tr>
    <tr>
      <td class="text-left">${isBn ? 'ক্রেতা' : 'Customer'}: <strong>${escapeHtml(bill.customerName)}</strong></td>
      <td class="text-right font-mono">${escapeHtml(bill.customerPhone)}</td>
    </tr>
    ${bill.customerAddress ? `<tr><td colspan="2" class="text-left" style="font-size: 10px; color: #444;">${isBn ? 'ঠিকানা' : 'Address'}: ${escapeHtml(bill.customerAddress)}</td></tr>` : ''}
  </table>

  <!-- Items Table -->
  <table class="items-table">
    <thead>
      <tr>
        <th class="text-left">${isBn ? 'পণ্য বিবরণ' : 'Item Description'}</th>
        <th class="text-center" style="width: 50px;">${isBn ? 'পরিমাণ' : 'Qty'}</th>
        <th class="text-right" style="width: 60px;">${isBn ? 'দর' : 'Rate'}</th>
        <th class="text-right" style="width: 65px;">${isBn ? 'মোট' : 'Total'}</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
  </table>

  <!-- Totals Breakdown -->
  <table class="totals-table">
    <tr>
      <td class="text-left">${isBn ? 'সাবটোটাল' : 'Subtotal'}:</td>
      <td class="text-right font-mono font-bold">₹${bill.subtotal.toFixed(2)}</td>
    </tr>
    ${
      bill.discountAmount > 0
        ? `<tr>
        <td class="text-left">${isBn ? 'ছাড় (ডিসকাউন্ট)' : 'Discount'}:</td>
        <td class="text-right font-mono">-₹${bill.discountAmount.toFixed(2)}</td>
      </tr>`
        : ''
    }
    ${
      bill.gstAmount > 0
        ? `<tr>
        <td class="text-left">${isBn ? 'ট্যাক্স (GST)' : 'GST Tax'}:</td>
        <td class="text-right font-mono">+₹${bill.gstAmount.toFixed(2)}</td>
      </tr>`
        : ''
    }
    <tr class="grand-total-row">
      <td class="text-left uppercase">${isBn ? 'সর্বমোট প্রদেয়' : 'GRAND TOTAL'}:</td>
      <td class="text-right font-mono">₹${bill.grandTotal.toFixed(2)}</td>
    </tr>
  </table>

  <!-- Payment & Footer -->
  <div class="footer">
    <div class="font-bold">
      ${isBn ? 'পেমেন্ট মাধ্যম' : 'Payment'}: ${bill.paymentMethod} • ${
    bill.paymentStatus === 'SUCCESS' ? (isBn ? 'পরিশোধিত ✓' : 'PAID ✓') : (isBn ? 'বাকি' : 'PENDING')
  }
    </div>
    ${bill.paymentReference ? `<div class="font-mono" style="font-size: 9px;">Ref: ${escapeHtml(bill.paymentReference)}</div>` : ''}
    <div style="margin-top: 6px; font-style: italic;">
      ${escapeHtml(
        business.receiptFooterText ||
          (isBn
            ? '*** আমাদের দোকানে কেনাকাটা করার জন্য ধন্যবাদ! আবার আসবেন ***'
            : '*** Thank you for your business! Visit again soon ***')
      )}
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Reliable print executor using an isolated hidden iframe.
 * If iframe printing fails (e.g. browser restrictions), it falls back to standard window.print().
 */
export function printReceipt(
  bill: Bill,
  business: BusinessProfile,
  format: PrintFormat = 'thermal',
  language: 'bn' | 'en' = 'bn'
): void {
  try {
    const htmlContent = generateReceiptHtml(bill, business, format, language);

    // Create a hidden iframe for clean printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.src = 'about:blank';

    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!iframeDoc) {
      throw new Error('Cannot access iframe document');
    }

    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    // Give iframe a moment to render fonts and layout
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (printErr) {
        console.warn('Iframe print failed, falling back to window.print():', printErr);
        window.print();
      } finally {
        // Clean up iframe after print dialog closes
        setTimeout(() => {
          try {
            document.body.removeChild(iframe);
          } catch {
            // Already removed
          }
        }, 3000);
      }
    }, 250);
  } catch (err) {
    console.warn('Print helper error, triggering standard window.print():', err);
    window.print();
  }
}
