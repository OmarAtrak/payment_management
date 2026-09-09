import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {DatePipe} from '@angular/common';

// External Libraries
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Models & Config
import config from '../../../../config';
import {Invoice} from '../model/invoice';
import {ProductItem} from '../model/product-item';
import {ServiceItem} from '../model/service-item';
import {Company} from '../../company/model/company';
import {ARABIC_FONT_BASE64} from "../../../../assets/fonts/Amiri/amiri-font";
import {InvoiceStatus} from "../model/invoice-status";
import {Payment} from "../model/payment";
import {PaymentMethod} from "../model/payment-method";
import {PaymentStatus} from "../model/payment-status";

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private API_URL = config.endPoint + 'invoices';

  // Design Constants
  private readonly COLOR_ORANGE = '#FF5722';
  private readonly COLOR_GRAY_BG = '#E8E8E8';

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
  ) {}

  // ==========================================================================
  // API METHODS
  // ==========================================================================

  getAll(page: number, size: number, sortField: string, sortDirection: string) {
    const params = new HttpParams()
      .set('page', page - 1)
      .set('size', size)
      .set('sortField', sortField)
      .set('sortDirection', sortDirection);
    return this.http.get<Array<Invoice>>(`${this.API_URL}/index`, { params });
  }

  get(id: number) {
    return this.http.get<Invoice>(`${this.API_URL}/${id}`);
  }

  save(invoice: Invoice) {
    if (!invoice.id) {
      return this.http.post<Invoice>(`${this.API_URL}/save`, invoice.toJson);
    } else {
      return this.http.put<Invoice>(`${this.API_URL}/update`, invoice.toJson);
    }
  }

  delete(id: number) {
    return this.http.delete<Invoice>(`${this.API_URL}/delete/${id}`);
  }

  // --- Product Items ---
  saveProductItem(invoiceId: number, productItem: ProductItem) {
    if (!productItem.id) {
      return this.http.post<ProductItem>(`${this.API_URL}/product-items/save/${invoiceId}`, productItem.toJson);
    }
    return this.http.put<ProductItem>(`${this.API_URL}/product-items/update/${invoiceId}`, productItem.toJson);
  }

  deleteProductItem(id: number) {
    return this.http.delete<ProductItem>(`${this.API_URL}/product-items/delete/${id}`);
  }

  // --- Service Items ---
  saveServiceItem(invoiceId: number, serviceItem: ServiceItem) {
    if (!serviceItem.id) {
      return this.http.post<ServiceItem>(`${this.API_URL}/service-items/save/${invoiceId}`, serviceItem.toJson);
    }
    return this.http.put<ServiceItem>(`${this.API_URL}/service-items/update/${invoiceId}`, serviceItem.toJson);
  }

  deleteServiceItem(id: number) {
    return this.http.delete<ServiceItem>(`${this.API_URL}/service-items/delete/${id}`);
  }

  // --- Payments ---
  savePayment(invoiceId: number, payment: Payment) {
    if (!payment.id) {
      return this.http.post<Payment>(`${this.API_URL}/payments/save/${invoiceId}`, payment.toJson);
    }
    return this.http.put<Payment>(`${this.API_URL}/payments/update/${invoiceId}`, payment.toJson);
  }

  deletePayment(id: number) {
    return this.http.delete<Payment>(`${this.API_URL}/payments/delete/${id}`);
  }






  // ==========================================================================
  // PDF GENERATION
  // ==========================================================================

  async generateInvoicePDF(invoice: Invoice, company: Company) {
    const doc = new jsPDF();

    // 1. Register Arabic Font
    doc.addFileToVFS('Amiri-Regular.ttf', ARABIC_FONT_BASE64);
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    doc.setFont('Amiri');

    // --- HEADER: LOGO ---
    try {
      const img = await this.getImageDataUrl('assets/garage03.png');
      doc.addImage(img, 'PNG', 14, -5, 50, 50);
    } catch (e) {
      console.warn('Could not load logo - continuing without it', e);
    }

    // --- HEADER: INVOICE INFO ---
    doc.setFontSize(16);
    doc.setFont('Amiri', 'bold');
    doc.text('Facture', 170, 15, { align: 'center' });

    doc.setFontSize(10);
    const dateFormatted = this.datePipe.transform(invoice.date, 'dd/MM/yyyy');

    doc.text(`Ref. ${invoice.code}`, 170, 22, { align: 'center' });
    doc.setFont('Amiri', 'normal');
    doc.text(`Date : ${dateFormatted}`, 170, 27, { align: 'center' });

    const clientCode = invoice.customer ? invoice.customer.code : 'CLT-0000';
    doc.text(`Code client : ${clientCode}`, 170, 32, { align: 'center' });

    // --- BOXES SECTION ---
    const boxTopY = 45;
    const boxHeight = 35;
    const boxWidth = 85;

    // Labels
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Billing:', 14, boxTopY - 2);
    doc.text('Customer:', 110, boxTopY - 2);

    // Gray Backgrounds
    doc.setFillColor(this.COLOR_GRAY_BG);
    doc.rect(14, boxTopY, boxWidth, boxHeight, 'F');
    doc.rect(110, boxTopY, boxWidth, boxHeight, 'F');

    // Box 1: Company Details
    doc.setFont('Amiri', 'bold');
    doc.text(company.name, 18, boxTopY + 6);

    doc.setFont('Amiri', 'normal');
    doc.setFontSize(9);
    doc.text('Dakar Street, Building No. 5', 18, boxTopY + 11);
    doc.text('Apartment 1', 18, boxTopY + 15);
    doc.text('OCEAN RABAT', 18, boxTopY + 19);

    if (company.contact) {
      doc.text(`Tel: ${company.contact.phoneNumber}`, 18, boxTopY + 23);
      doc.text(company.contact.email, 18, boxTopY + 27);
    }

    // Box 2: Customer Details with Vehicles Table
    if (invoice.customer) {
      doc.setFontSize(12);
      doc.setFont('Amiri', 'bold');
      const custName = invoice.customer.name || 'Client Name';
      doc.text(custName, 114, boxTopY + 6);
      doc.setFont('Amiri', 'normal');
      doc.setFontSize(9);

      const custAddress = invoice.customer.address
        ? invoice.customer.address.address
        : '';
      const custPhone = invoice.customer.contact
        ? invoice.customer.contact.phoneNumber
        : '';
      const custCode = invoice.customer.code ?? '';

      doc.text(custAddress, 114, boxTopY + 11);
      doc.text(custPhone, 114, boxTopY + 15);
      if (invoice.discount > 0) {
        doc.text(`Torque club card: ${custCode}`, 114, boxTopY + 19);
      }

      // Display vehicles table below the contact info
      if (invoice.customer.vehicles && invoice.customer.vehicles.length > 0) {
        const vehicleTableData = invoice.customer.vehicles.map((vehicle) => [
          vehicle.model || '',
          vehicle.vin || '',
          vehicle.color || ''
        ]);

        autoTable(doc, {
          startY: boxTopY + 20,
          head: [['Modèle', 'VIN', 'Couleur']],
          body: vehicleTableData,
          theme: 'grid',
          margin: { left: 110, right: 14 },
          tableWidth: boxWidth,
          styles: {
            font: 'Amiri',
            fontSize: 7,
            cellPadding: 1,
            minCellHeight: 4,
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            textColor: [0, 0, 0],
            halign: 'left',
            valign: 'middle',
          },
          headStyles: {
            font: 'Amiri',
            fillColor: [200, 200, 200],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            fontSize: 7,
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
            halign: 'center',
            minCellHeight: 4
          },
          columnStyles: {
            0: { cellWidth: 'auto', halign: 'left' },
            1: { cellWidth: 'auto', halign: 'center' },
            2: { cellWidth: 'auto', halign: 'center' },
          }
        });
      }
    }

    // --- TABLE DATA PREPARATION ---
    const tableRows: any[] = [];
    let index = 1;

    // Helper to strip HTML tags
    if (invoice.products) {
      invoice.products.forEach((p) => {
        tableRows.push([
          index++,
          (p.product.name || 'Produit')
          + ( p.product.descriptionForPrint ? `\n${p.product.descriptionForPrint}` : ''),
          this.formatCurrency(p.priceHT),
          `${p.quantity}`,
          this.formatCurrency(p.totalHT),
        ]);
      });
    }

    if (invoice.services) {
      invoice.services.forEach((s) => {
        tableRows.push([
          index++,
          (s.service.name || 'Service')
          + ( s.service.descriptionForPrint ? `\n${s.service.descriptionForPrint}` : ''),
          this.formatCurrency(s.price),
          '',
          this.formatCurrency(s.price),
        ]);
      });
    }

    if (invoice.products.length == 0 && invoice.services.length == 0) {
      tableRows.push([
        '',
        '',
        '',
        '',
        '',
      ]);
    }

    // --- DYNAMIC HEIGHT CALCULATION ---
    // This logic ensures the table stretches to fill the page down to Y=225
    const startY = 90;
    const targetTableBottomY = 150;
    const minRowHeight = 10;
    const headerHeight = 12;

    // Estimate height of rows BEFORE the last one
    // (We subtract 1 because the last row will take up the remaining space)
    const rowCount = tableRows.length;
    const usedHeight = startY + headerHeight + ((rowCount - 1) * minRowHeight);

    // Calculate remaining space for the last row
    let dynamicLastRowHeight = targetTableBottomY - usedHeight;

    // Safety: If content is already long (or multipage), revert to standard height
    if (dynamicLastRowHeight < minRowHeight) {
      dynamicLastRowHeight = minRowHeight;
    }

    // --- DRAW TABLE ---
    autoTable(doc, {
      startY: startY,
      head: [['N°', 'Désignation', 'P.U. HT', 'Qty', 'Total HT']],
      body: tableRows,
      theme: 'grid',
      styles: {
        font: 'Amiri',
        fontSize: 10,
        cellPadding: 3,
        minCellHeight: minRowHeight,
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        textColor: [0, 0, 0],
        halign: 'left',
        valign: 'middle',
      },
      headStyles: {
        font: 'Amiri',
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        halign: 'center',
        minCellHeight: headerHeight
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: "auto", halign: 'left' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 40, halign: 'right' },
      },
      didParseCell: (data) => {
        // Only apply logic in the body section
        if (data.section === 'body') {
          // If this is the very last row of the table
          if (data.row.index === tableRows.length - 1) {
            // Apply the calculated dynamic height
            data.cell.styles.minCellHeight = dynamicLastRowHeight;
            // Force text to stay at the top
            data.cell.styles.valign = 'top';
          }
        }
      },
    });

    // --- WATERMARK: STATUS ---
    if (invoice.status != InvoiceStatus.POSTED) {
      this.drawStatusWatermark(doc, invoice.status);
    }

    // --- TOTALS SECTION ---
    // Ensure Totals start below the fixed table bottom or the actual table end
    let finalY = (doc as any).lastAutoTable.finalY + 10;

    // If the table grew very large (multipage), handle page break
    if (finalY > 300) {
      doc.addPage();
      // --- WATERMARK: STATUS ---
      if (invoice.status != InvoiceStatus.POSTED) {
        this.drawStatusWatermark(doc, invoice.status);
      }
      finalY = 20;
    }

    const totalX_Label = 130;
    const totalX_Value = 190;

    doc.setFontSize(10);
    doc.setFont('Amiri', 'normal');

    const drawTotalRow = (
      label: string,
      value: string,
      isBold: boolean = false,
      bg: boolean = false
    ) => {
      if (bg) {
        doc.setFillColor(245, 245, 245);
        doc.rect(totalX_Label - 2, finalY - 4, 70, 6, 'F');
      }
      if (isBold) {
        doc.setFont('Amiri', 'bold');
      }
      doc.text(label, totalX_Label, finalY);
      doc.text(value, totalX_Value, finalY, { align: 'right' });
      finalY += 6;
    };

    drawTotalRow(
      'Total HT (products)',
      this.formatCurrency(invoice.totalProductsHT),
      false,
      true
    );
    drawTotalRow(
      'Total HT (services)',
      this.formatCurrency(invoice.totalServicesHT),
      false,
      true
    );
    if (invoice.discount > 0) {
      drawTotalRow(
        'Loyalty Discount',
        `${invoice.discount}% (${this.formatCurrency(invoice.discountValueForServices)})`,
        false,
        true
      );
    }
    drawTotalRow('Total HT', this.formatCurrency(invoice.totalHT), false, true);
    drawTotalRow('Total TVA', this.formatCurrency(invoice.totalTVA), false, true);
    drawTotalRow(
      'Total TTC',
      this.formatCurrency(invoice.discount > 0 ? invoice.totalTTCAfterDiscount : invoice.totalTTC),
      true,
      true
    );

    // --- FOOTER ---
    const pageHeight = doc.internal.pageSize.height || 297;

    doc.setDrawColor(this.COLOR_ORANGE);
    doc.setLineWidth(1);
    doc.line(14, pageHeight - 25, 196, pageHeight - 25);

    doc.setFontSize(8);
    doc.setFont('Amiri', 'normal');
    doc.setTextColor(0, 0, 0);

    doc.text('Dakar Street, Building No. 5 Apartment 1', 105, pageHeight - 20, {
      align: 'center',
    });
    doc.text('OCEAN RABAT', 105, pageHeight - 16, { align: 'center' });
    doc.text(
      `Tel: ${company.contact.phoneNumber} - ${company.contact.email}`,
      105,
      pageHeight - 12,
      { align: 'center' }
    );

    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);
    const legalText = `R.C : ${company.rc} - I.F : ${company.ifu} - C.N.S.S : ${company.cnss} I.C.E : ${company.ice}`;
    doc.text(legalText, 105, pageHeight - 8, { align: 'center' });

    // --- SAVE ---
    doc.save(`Facture_${invoice.code}.pdf`);
  }

  async generateInvoiceBon(invoice: Invoice, company: Company) {
    const doc = new jsPDF();

    // 1. Register Arabic Font
    doc.addFileToVFS('Amiri-Regular.ttf', ARABIC_FONT_BASE64);
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    doc.setFont('Amiri');

    // --- HEADER: LOGO ---
    try {
      const img = await this.getImageDataUrl('assets/garage03.png');
      doc.addImage(img, 'PNG', 14, -5, 50, 50);
    } catch (e) {
      console.warn('Could not load logo - continuing without it', e);
    }

    // --- HEADER: INVOICE INFO ---
    doc.setFontSize(16);
    doc.setFont('Amiri', 'bold');
    doc.text('Bon', 170, 15, { align: 'center' });

    doc.setFontSize(10);
    const dateFormatted = this.datePipe.transform(invoice.date, 'dd/MM/yyyy');

    doc.text(`Ref. ${invoice.code}`, 170, 22, { align: 'center' });
    doc.setFont('Amiri', 'normal');
    doc.text(`Date : ${dateFormatted}`, 170, 27, { align: 'center' });

    const clientCode = invoice.customer ? invoice.customer.code : 'CLT-0000';
    doc.text(`Code client : ${clientCode}`, 170, 32, { align: 'center' });

    // --- BOXES SECTION ---
    const boxTopY = 45;
    const boxHeight = 35;
    const boxWidth = 85;

    // Labels
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Billing:', 14, boxTopY - 2);
    doc.text('Customer:', 110, boxTopY - 2);

    // Gray Backgrounds
    doc.setFillColor(this.COLOR_GRAY_BG);
    doc.rect(14, boxTopY, boxWidth, boxHeight, 'F');
    doc.rect(110, boxTopY, boxWidth, boxHeight, 'F');

    // Box 1: Company Details
    doc.setFont('Amiri', 'bold');
    doc.text(company.name, 18, boxTopY + 6);

    doc.setFont('Amiri', 'normal');
    doc.setFontSize(9);
    doc.text('Dakar Street, Building No. 5', 18, boxTopY + 11);
    doc.text('Apartment 1', 18, boxTopY + 15);
    doc.text('OCEAN RABAT', 18, boxTopY + 19);

    if (company.contact) {
      doc.text(`Tel: ${company.contact.phoneNumber}`, 18, boxTopY + 23);
      doc.text(company.contact.email, 18, boxTopY + 27);
    }

    // Box 2: Customer Details with Vehicles Table
    if (invoice.customer) {
      doc.setFontSize(12);
      doc.setFont('Amiri', 'bold');
      const custName = invoice.customer.name || 'Client Name';
      doc.text(custName, 114, boxTopY + 6);
      doc.setFont('Amiri', 'normal');
      doc.setFontSize(9);

      const custAddress = invoice.customer.address
        ? invoice.customer.address.address
        : '';
      const custPhone = invoice.customer.contact
        ? invoice.customer.contact.phoneNumber
        : '';
      const custCode = invoice.customer.code ?? '';

      doc.text(custAddress, 114, boxTopY + 11);
      doc.text(custPhone, 114, boxTopY + 15);
      if (invoice.discount > 0) {
        doc.text(`Torque club card: ${custCode}`, 114, boxTopY + 19);
      }

      // Display vehicles table below the contact info
      if (invoice.customer.vehicles && invoice.customer.vehicles.length > 0) {
        const vehicleTableData = invoice.customer.vehicles.map((vehicle) => [
          vehicle.model || '',
          vehicle.vin || '',
          vehicle.color || ''
        ]);

        autoTable(doc, {
          startY: boxTopY + 20,
          head: [['Modèle', 'VIN', 'Couleur']],
          body: vehicleTableData,
          theme: 'grid',
          margin: { left: 110, right: 14 },
          tableWidth: boxWidth,
          styles: {
            font: 'Amiri',
            fontSize: 7,
            cellPadding: 1,
            minCellHeight: 4,
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            textColor: [0, 0, 0],
            halign: 'left',
            valign: 'middle',
          },
          headStyles: {
            font: 'Amiri',
            fillColor: [200, 200, 200],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            fontSize: 7,
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
            halign: 'center',
            minCellHeight: 4
          },
          columnStyles: {
            0: { cellWidth: 'auto', halign: 'left' },
            1: { cellWidth: 'auto', halign: 'center' },
            2: { cellWidth: 'auto', halign: 'center' },
          }
        });
      }
    }

    // --- TABLE DATA PREPARATION ---
    const tableRows: any[] = [];
    let index = 1;

    // Helper to strip HTML tags
    if (invoice.products) {
      invoice.products.forEach((p) => {
        tableRows.push([
          index++,
          (p.product.name || 'Produit')
          + ( p.product.descriptionForPrint ? `\n${p.product.descriptionForPrint}` : ''),
          this.formatCurrency(p.priceTTC),
          `${p.quantity}`,
          this.formatCurrency(p.totalTTC),
        ]);
      });
    }

    if (invoice.services) {
      invoice.services.forEach((s) => {
        tableRows.push([
          index++,
          (s.service.name || 'Service')
          + ( s.service.descriptionForPrint ? `\n${s.service.descriptionForPrint}` : ''),
          this.formatCurrency(s.priceTTC),
          '',
          this.formatCurrency(s.priceTTC),
        ]);
      });
    }

    if (invoice.products.length == 0 && invoice.services.length == 0) {
      tableRows.push([
        '',
        '',
        '',
        '',
        '',
      ]);
    }

    // --- DYNAMIC HEIGHT CALCULATION ---
    // This logic ensures the table stretches to fill the page down to Y=225
    const startY = 90;
    const targetTableBottomY = 150;
    const minRowHeight = 10;
    const headerHeight = 12;

    // Estimate height of rows BEFORE the last one
    // (We subtract 1 because the last row will take up the remaining space)
    const rowCount = tableRows.length;
    const usedHeight = startY + headerHeight + ((rowCount - 1) * minRowHeight);

    // Calculate remaining space for the last row
    let dynamicLastRowHeight = targetTableBottomY - usedHeight;

    // Safety: If content is already long (or multipage), revert to standard height
    if (dynamicLastRowHeight < minRowHeight) {
      dynamicLastRowHeight = minRowHeight;
    }

    // --- DRAW TABLE ---
    autoTable(doc, {
      startY: startY,
      head: [['N°', 'Désignation', 'P.U. HT', 'Qty', 'Total']],
      body: tableRows,
      theme: 'grid',
      styles: {
        font: 'Amiri',
        fontSize: 10,
        cellPadding: 3,
        minCellHeight: minRowHeight,
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        textColor: [0, 0, 0],
        halign: 'left',
        valign: 'middle',
      },
      headStyles: {
        font: 'Amiri',
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        lineWidth: 0.1,
        lineColor: [0, 0, 0],
        halign: 'center',
        minCellHeight: headerHeight
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: "auto", halign: 'left' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 40, halign: 'right' },
      },
      didParseCell: (data) => {
        // Only apply logic in the body section
        if (data.section === 'body') {
          // If this is the very last row of the table
          if (data.row.index === tableRows.length - 1) {
            // Apply the calculated dynamic height
            data.cell.styles.minCellHeight = dynamicLastRowHeight;
            // Force text to stay at the top
            data.cell.styles.valign = 'top';
          }
        }
      },
    });

    // --- WATERMARK: STATUS ---
    if (invoice.status != InvoiceStatus.POSTED) {
      this.drawStatusWatermark(doc, invoice.status);
    }

    // --- TOTALS SECTION ---
    // Ensure Totals start below the fixed table bottom or the actual table end
    let finalY = (doc as any).lastAutoTable.finalY + 10;

    // If the table grew very large (multipage), handle page break
    if (finalY > 300) {
      doc.addPage();
      // --- WATERMARK: STATUS ---
      if (invoice.status != InvoiceStatus.POSTED) {
        this.drawStatusWatermark(doc, invoice.status);
      }
      finalY = 20;
    }

    const totalX_Label = 130;
    const totalX_Value = 190;

    doc.setFontSize(10);
    doc.setFont('Amiri', 'normal');

    if (invoice.discount > 0) {
      const drawTotalAfterDiscountRow = (
        label: string,
        oldPrice: string,
        newPrice: string,
        isBold: boolean = false,
        bg: boolean = false
      ) => {
        if (bg) {
          doc.setFillColor(245, 245, 245);
          doc.rect(totalX_Label - 2, finalY - 4, 70, 12, 'F');
        }

        doc.setFont('Amiri', isBold ? 'bold' : 'normal');

        // 1. Draw the Label
        doc.setTextColor(0);
        doc.text(label, totalX_Label, finalY);

        // 2. Draw the Old Price with a Strikethrough
        if (oldPrice) {
          doc.setTextColor(135);
          doc.text(oldPrice, totalX_Value, finalY, { align: 'right' });

          // Calculate dynamic width and vertical center
          const textWidth = doc.getTextWidth(oldPrice);
          const strikeY = finalY - 1;

          doc.setLineWidth(0.3);
          doc.setDrawColor(135);

          // Start drawing from (Anchor point - Width) to (Anchor point)
          doc.line(totalX_Value - textWidth, strikeY, totalX_Value, strikeY);
          doc.setDrawColor(0);
        }

        // 3. Draw the New Price
        doc.setTextColor(0);
        // Note: finalY + 5 moves the new price to the NEXT line down.
        // If you want them on the same line, just use finalY.
        doc.text(newPrice, totalX_Value, finalY + 5, { align: 'right' });

        // Increment finalY by more than 6 if you are stacking prices vertically
        finalY += 10;
      };

      finalY += 1;
      drawTotalAfterDiscountRow(
        'Total',
        this.formatCurrency(invoice.totalTTC),
        this.formatCurrency(invoice.discount > 0 ? invoice.totalTTCAfterDiscount : invoice.totalTTC),
        true,
        true
      );
    }
    else {
      const drawTotalRow = (
        label: string,
        value: string,
        isBold: boolean = false,
        bg: boolean = false
      ) => {
        if (bg) {
          doc.setFillColor(245, 245, 245);
          doc.rect(totalX_Label - 2, finalY - 4, 70, 6, 'F');
        }
        if (isBold) {
          doc.setFont('Amiri', 'bold');
        }
        doc.text(label, totalX_Label, finalY);
        doc.text(value, totalX_Value, finalY, { align: 'right' });
        finalY += 6;
      };

      finalY += 1;
      drawTotalRow(
        'Total',
        this.formatCurrency(invoice.discount > 0 ? invoice.totalTTCAfterDiscount : invoice.totalTTC),
        true,
        true
      );
    }

    // --- SAVE ---
    doc.save(`Bon_${invoice.code}.pdf`);
  }

  async generatePaymentPdf(invoice: Invoice, company: Company, payment: Payment) {
    const doc = new jsPDF();

    // 1. Register Arabic Font
    doc.addFileToVFS('Amiri-Regular.ttf', ARABIC_FONT_BASE64);
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    doc.setFont('Amiri');

    // --- HEADER: LOGO ---
    try {
      const img = await this.getImageDataUrl('assets/garage03.png');
      doc.addImage(img, 'PNG', 14, -5, 50, 50);
    } catch (e) {
      console.warn('Could not load logo - continuing without it', e);
    }

    // --- HEADER: INVOICE INFO ---
    doc.setFontSize(16);
    doc.setFont('Amiri', 'bold');
    doc.text('Payment', 170, 15, { align: 'center' });

    doc.setFontSize(10);
    const dateFormatted = this.datePipe.transform(invoice.date, 'dd/MM/yyyy');

    doc.text(`Code : ${payment.code}`, 170, 22, { align: 'center' });
    doc.setFont('Amiri', 'normal');
    doc.text(`Invoice Code : ${invoice.code}`, 170, 27, { align: 'center' });
    doc.text(`Date : ${dateFormatted}`, 170, 32, { align: 'center' });

    const clientCode = invoice.customer ? invoice.customer.code : 'CLT-0000';
    doc.text(`Code client : ${clientCode}`, 170, 37, { align: 'center' });

    // --- BOXES SECTION ---
    const boxTopY = 45;
    const boxHeight = 35;
    const boxWidth = 85;

    // Labels
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Billing:', 14, boxTopY - 2);
    doc.text('Customer:', 110, boxTopY - 2);

    // Gray Backgrounds
    doc.setFillColor(this.COLOR_GRAY_BG);
    doc.rect(14, boxTopY, boxWidth, boxHeight, 'F');
    doc.rect(110, boxTopY, boxWidth, boxHeight, 'F');

    // Box 1: Company Details
    doc.setFont('Amiri', 'bold');
    doc.text(company.name, 18, boxTopY + 6);

    doc.setFont('Amiri', 'normal');
    doc.setFontSize(9);
    doc.text('Dakar Street, Building No. 5', 18, boxTopY + 11);
    doc.text('Apartment 1', 18, boxTopY + 15);
    doc.text('OCEAN RABAT', 18, boxTopY + 19);

    if (company.contact) {
      doc.text(`Tel: ${company.contact.phoneNumber}`, 18, boxTopY + 23);
      doc.text(company.contact.email, 18, boxTopY + 27);
    }

    // Box 2: Customer Details with Vehicles Table
    if (invoice.customer) {
      doc.setFontSize(12);
      doc.setFont('Amiri', 'bold');
      const custName = invoice.customer.name || 'Client Name';
      doc.text(custName, 114, boxTopY + 6);
      doc.setFont('Amiri', 'normal');
      doc.setFontSize(9);

      const custAddress = invoice.customer.address
        ? invoice.customer.address.address
        : '';
      const custPhone = invoice.customer.contact
        ? invoice.customer.contact.phoneNumber
        : '';

      doc.text(custAddress, 114, boxTopY + 11);
      doc.text(custPhone, 114, boxTopY + 15);

      // Display vehicles table below the contact info
      if (invoice.customer.vehicles && invoice.customer.vehicles.length > 0) {
        const vehicleTableData = invoice.customer.vehicles.map((vehicle) => [
          vehicle.model || '',
          vehicle.vin || '',
          vehicle.color || ''
        ]);

        autoTable(doc, {
          startY: boxTopY + 18,
          head: [['Modèle', 'VIN', 'Couleur']],
          body: vehicleTableData,
          theme: 'grid',
          margin: { left: 110, right: 14 },
          tableWidth: boxWidth,
          styles: {
            font: 'Amiri',
            fontSize: 7,
            cellPadding: 1,
            minCellHeight: 4,
            lineColor: [0, 0, 0],
            lineWidth: 0.1,
            textColor: [0, 0, 0],
            halign: 'left',
            valign: 'middle',
          },
          headStyles: {
            font: 'Amiri',
            fillColor: [200, 200, 200],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            fontSize: 7,
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
            halign: 'center',
            minCellHeight: 4
          },
          columnStyles: {
            0: { cellWidth: 'auto', halign: 'left' },
            1: { cellWidth: 'auto', halign: 'center' },
            2: { cellWidth: 'auto', halign: 'center' },
          }
        });
      }
    }

    // --- PAYMENT DETAILS SECTION ---
    const paymentStartY = 95;

    // Draw a box for payment details
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(14, paymentStartY, 182, 110, 'S');

    // Title
    doc.setFontSize(14);
    doc.setFont('Amiri', 'bold');
    doc.setTextColor(this.COLOR_ORANGE);
    doc.text('Payment Details', 105, paymentStartY + 12, { align: 'center' });

    // Payment information
    doc.setFontSize(12);
    doc.setFont('Amiri', 'normal');
    doc.setTextColor(0, 0, 0);

    const paymentDateFormatted = this.datePipe.transform(payment.date, 'dd/MM/yyyy') || '';

    let currentY = paymentStartY + 25;
    const labelX = 25;
    const valueX = 90;

    // Helper function to draw payment row
    const drawPaymentRow = (label: string, value: string, isBold: boolean = false) => {
      doc.setFont('Amiri', 'bold');
      doc.text(label, labelX, currentY);

      if (isBold) {
        doc.setFont('Amiri', 'bold');
        doc.setFontSize(14);
      } else {
        doc.setFont('Amiri', 'normal');
        doc.setFontSize(12);
      }
      doc.text(value, valueX, currentY);
      doc.setFontSize(12);
      currentY += 10;
    };

    drawPaymentRow('Code:', payment.code);
    drawPaymentRow('Invoice Code:', invoice.code);
    drawPaymentRow('Date:', paymentDateFormatted);
    const method = this.getPaymentMethodEn(payment.paymentMethod);
    drawPaymentRow('Method:', method);
    const status = this.getPaymentStatusEn(payment.status);
    drawPaymentRow('Status:', status);

    currentY += 5;

    // Amount paid - highlighted
    doc.setFillColor(245, 245, 245);
    doc.rect(20, currentY - 8, 165, 12, 'F');
    doc.setFont('Amiri', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(this.COLOR_ORANGE);
    doc.text('Amount:', labelX, currentY);
    doc.text(this.formatCurrency(payment.amount), valueX, currentY);
    doc.setTextColor(0, 0, 0);

    currentY += 15;

    // Notes section if available
    doc.setFont('Amiri', 'bold');
    doc.setFontSize(11);
    doc.text('Notes:', labelX, currentY);

    if (payment.notes && payment.notes.trim().length > 0) {
      doc.setFont('Amiri', 'normal');
      doc.setFontSize(10);
      const splitNotes = doc.splitTextToSize(payment.notes, 155);
      doc.text(splitNotes, labelX, currentY + 6);
    }

    // --- FOOTER ---
    const pageHeight = doc.internal.pageSize.height || 297;

    doc.setDrawColor(this.COLOR_ORANGE);
    doc.setLineWidth(1);
    doc.line(14, pageHeight - 25, 196, pageHeight - 25);

    doc.setFontSize(8);
    doc.setFont('Amiri', 'normal');
    doc.setTextColor(0, 0, 0);

    doc.text(`Dakar Street, Building No. 5 Apartment 1 OCEAN RABAT Tel: ${company.contact.phoneNumber}`, 105, pageHeight - 20, {
      align: 'center',
    });
    doc.text(`${company.contact.email}`, 105, pageHeight - 16, { align: 'center' });

    // --- SAVE ---
    doc.save(`Payment_${payment.code}.pdf`);
  }

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  private drawStatusWatermark(doc: jsPDF, status: string): void {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Save current state
    const currentFontSize = doc.getFontSize();

    // Get status text
    let statusText = status || 'DRAFT';

    // Set watermark style - very large text with light gray color
    doc.setFontSize(160);
    doc.setTextColor(230, 230, 230);

    // Calculate center position
    const centerX = (pageWidth / 2) + 30;
    const centerY = (pageHeight / 2) + 50;

    // Save graphics state
    doc.saveGraphicsState();

    // Set transparency using GState
    const gState = new (doc as any).GState({ opacity: 0.3 });
    doc.setGState(gState);

    // Draw rotated watermark text in the center of the page
    doc.text(statusText, centerX, centerY, {
      align: 'center',
      angle: 45
    });

    // Restore graphics state
    doc.restoreGraphicsState();

    // Restore original settings
    doc.setFontSize(currentFontSize);
    doc.setTextColor(0, 0, 0);
  }

  private formatCurrency(value: number): string {
    const amount = value ?? 0;

    return amount.toLocaleString('en-EN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + ' DH';
  }

  private getImageDataUrl(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          reject('Canvas context failed');
        }
      };
      img.onerror = (error) => reject(error);
    });
  }

  private getPaymentMethodEn(method: string): string {
    switch (method) {
      case PaymentMethod.CASH:
        return "Cash";
      case PaymentMethod.CREDIT_CARD:
        return "Credit Card";
      case PaymentMethod.BANK_TRANSFER:
        return "Bank Transfer";
      case PaymentMethod.CHECK:
        return "Check";
      case PaymentMethod.AGENCY_TRANSFER:
        return "Agency Transfer";
      case PaymentMethod.MOBILE_PAYMENT:
        return "Mobile Payment";
      case PaymentMethod.OTHER:
        return "Other";
    }

    return '';
  }
  private getPaymentStatusEn(status: string): string {
    switch (status) {
      case PaymentStatus.PENDING:
        return "Pending";
      case PaymentStatus.PAID:
        return "Paid";
      case PaymentStatus.FAILED:
        return "Failed";
    }

    return '';
  }
}
