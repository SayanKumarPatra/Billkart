import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Bill, BusinessProfile } from '../types';

export type DownloadFormat = 'pdf' | 'jpg';

/**
 * Downloads an existing rendered DOM element as a high-resolution JPG image.
 */
export async function downloadElementAsJpg(
  element: HTMLElement,
  fileName: string = 'bill-receipt'
): Promise<boolean> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2.5, // Crisp retina quality
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.href = imgData;
    link.download = fileName.endsWith('.jpg') ? fileName : `${fileName}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Error generating JPG receipt:', error);
    return false;
  }
}

/**
 * Downloads an existing rendered DOM element as a crisp, proportional PDF document.
 */
export async function downloadElementAsPdf(
  element: HTMLElement,
  fileName: string = 'bill-receipt'
): Promise<boolean> {
  try {
    const canvas = await html2canvas(element, {
      scale: 2.5, // Crisp retina quality
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Convert pixels to millimeters (standard 72/96 dpi scale ratio)
    // 1 px approx = 0.264583 mm
    const pdfWidthMm = (imgWidth / 2.5) * 0.264583;
    const pdfHeightMm = (imgHeight / 2.5) * 0.264583;

    const pdf = new jsPDF({
      orientation: pdfWidthMm > pdfHeightMm ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [pdfWidthMm, pdfHeightMm],
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidthMm, pdfHeightMm);
    pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating PDF receipt:', error);
    return false;
  }
}

/**
 * Generates an offscreen DOM receipt container for bills when the modal isn't open,
 * allowing instant download of any bill as PDF or JPG from history or payment lists.
 */
export async function downloadBillDirect(
  bill: Bill,
  business: BusinessProfile,
  format: DownloadFormat,
  language: 'bn' | 'en' = 'bn'
): Promise<boolean> {
  const isBn = language === 'bn';

  // Create temporary offscreen container with exact styles
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '420px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#000000';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  container.style.padding = '24px';
  container.style.boxSizing = 'border-box';
  container.style.zIndex = '-100';

  // Build items rows
  const itemsHtml = bill.items
    .map(
      (item, idx) => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px dashed #e2e8f0; font-size: 12px;">
        <div style="flex: 1; padding-right: 8px;">
          <strong style="color: #0f172a;">${idx + 1}. ${escapeHtml(item.name)}</strong>
        </div>
        <div style="width: 50px; text-align: center; font-weight: bold; color: #1e293b;">
          ${item.quantity} ${escapeHtml(item.unit || (isBn ? 'টি' : 'pcs'))}
        </div>
        <div style="width: 65px; text-align: right; color: #475569; font-family: monospace;">
          ₹${item.unitPrice.toFixed(2)}
        </div>
        <div style="width: 75px; text-align: right; font-weight: bold; color: #0f172a; font-family: monospace;">
          ₹${item.total.toFixed(2)}
        </div>
      </div>
    `
    )
    .join('');

  container.innerHTML = `
    <div style="background: #ffffff; color: #0f172a;">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 2px dashed #94a3b8; padding-bottom: 14px; margin-bottom: 14px;">
        <h1 style="margin: 0 0 4px 0; font-size: 19px; font-weight: 800; text-transform: uppercase; letter-spacing: -0.02em;">
          ${escapeHtml(business.shopName)}
        </h1>
        ${
          business.tagline
            ? `<div style="font-size: 11px; color: #64748b; font-style: italic; margin-bottom: 4px;">${escapeHtml(
                business.tagline
              )}</div>`
            : ''
        }
        <div style="font-size: 11px; color: #475569; line-height: 1.4;">${escapeHtml(business.address)}</div>
        <div style="font-size: 11px; color: #475569; margin-top: 2px; font-weight: 600;">
          ${isBn ? 'মোবাইল:' : 'Phone:'} ${escapeHtml(business.phone)} ${
    business.gstNumber ? `| GSTIN: ${escapeHtml(business.gstNumber)}` : ''
  }
        </div>
      </div>

      <!-- Bill Meta -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 12px; margin-bottom: 12px;">
        <div>
          <span style="color: #64748b; display: block;">${isBn ? 'ইনভয়েস নং:' : 'Bill No:'}</span>
          <strong style="font-size: 13px; font-family: monospace;">#${escapeHtml(bill.billNumber)}</strong>
        </div>
        <div style="text-align: right;">
          <span style="color: #64748b; display: block;">${isBn ? 'তারিখ ও সময়:' : 'Date & Time:'}</span>
          <strong>${escapeHtml(bill.date)} ${escapeHtml(bill.time)}</strong>
        </div>
        <div>
          <span style="color: #64748b; display: block;">${isBn ? 'ক্রেতার নাম:' : 'Customer:'}</span>
          <strong style="color: #0f172a;">${escapeHtml(bill.customerName)}</strong>
        </div>
        <div style="text-align: right;">
          <span style="color: #64748b; display: block;">${isBn ? 'মোবাইল:' : 'Phone:'}</span>
          <strong style="font-family: monospace;">${escapeHtml(bill.customerPhone)}</strong>
        </div>
      </div>

      <!-- Items Header -->
      <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 4px;">
        <span style="flex: 1;">${isBn ? 'পণ্য বিবরণ' : 'Item Description'}</span>
        <span style="width: 50px; text-align: center;">${isBn ? 'পরিমাণ' : 'Qty'}</span>
        <span style="width: 65px; text-align: right;">${isBn ? 'দর' : 'Rate'}</span>
        <span style="width: 75px; text-align: right;">${isBn ? 'মোট' : 'Total'}</span>
      </div>

      <!-- Items List -->
      <div style="margin-bottom: 12px;">
        ${itemsHtml}
      </div>

      <!-- Totals Breakdown -->
      <div style="border-top: 1px dashed #94a3b8; padding-top: 8px; margin-bottom: 12px; font-size: 12px;">
        <div style="display: flex; justify-content: space-between; padding: 2px 0; color: #475569;">
          <span>${isBn ? 'সাবটোটাল:' : 'Subtotal:'}</span>
          <strong style="font-family: monospace;">₹${bill.subtotal.toFixed(2)}</strong>
        </div>
        ${
          bill.discountAmount > 0
            ? `<div style="display: flex; justify-content: space-between; padding: 2px 0; color: #059669;">
            <span>${isBn ? 'ছাড় (ডিসকাউন্ট):' : 'Discount:'}</span>
            <strong style="font-family: monospace;">-₹${bill.discountAmount.toFixed(2)}</strong>
          </div>`
            : ''
        }
        ${
          bill.gstAmount > 0
            ? `<div style="display: flex; justify-content: space-between; padding: 2px 0; color: #475569;">
            <span>${isBn ? 'ট্যাক্স (GST):' : 'GST Tax:'}</span>
            <strong style="font-family: monospace;">+₹${bill.gstAmount.toFixed(2)}</strong>
          </div>`
            : ''
        }
        <div style="display: flex; justify-content: space-between; padding: 8px 0 0 0; margin-top: 6px; border-top: 2px solid #0f172a; font-size: 15px; font-weight: 800; color: #0f172a;">
          <span style="text-transform: uppercase;">${isBn ? 'সর্বমোট প্রদেয় বিল:' : 'GRAND TOTAL:'}</span>
          <span style="font-family: monospace;">₹${bill.grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 10px; font-size: 11px; color: #475569;">
        <div style="font-weight: 700; color: #0f172a; margin-bottom: 4px;">
          ${isBn ? 'পেমেন্ট মাধ্যম:' : 'Payment:'} ${bill.paymentMethod} • ${
    bill.paymentStatus === 'SUCCESS' ? (isBn ? 'পরিশোধিত ✓' : 'PAID ✓') : (isBn ? 'বাকি' : 'PENDING')
  }
        </div>
        ${
          bill.paymentReference
            ? `<div style="font-family: monospace; font-size: 10px; color: #64748b; margin-bottom: 4px;">
            ${isBn ? 'রেফারেন্স:' : 'Ref:'} ${escapeHtml(bill.paymentReference)}
          </div>`
            : ''
        }
        <div style="font-style: italic; margin-top: 8px; color: #64748b; font-size: 10.5px;">
          ${escapeHtml(
            business.receiptFooterText ||
              (isBn
                ? '*** আমাদের দোকানে কেনাকাটা করার জন্য ধন্যবাদ! আবার আসবেন ***'
                : '*** Thank you for shopping with us! Visit again ***')
          )}
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    let success = false;
    const filename = `Bill_${bill.billNumber}`;

    if (format === 'jpg') {
      success = await downloadElementAsJpg(container, filename);
    } else {
      success = await downloadElementAsPdf(container, filename);
    }

    return success;
  } finally {
    document.body.removeChild(container);
  }
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
