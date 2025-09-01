/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import AppError from "../errorHelpers/appError";
import httpStatusCodes from "http-status-codes";

export interface IInvoiceData {
  transactionId: string;
  bookingDate: Date;
  userName: string;
  tourTitle: string;
  guestsCount: number;
  totalAmount: number;
}

export const generatePDF = async (invoiceData: IInvoiceData) =>{
  try {
    return new Promise((resolve, reject) =>{
      const doc = new PDFDocument({size: "A4", margin: 50});
      const buffer: Uint8Array[] = [];

      doc.on("data", (chunk) => buffer.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffer)));
      doc.on("error", (err) => reject(err));

      //PDF content
      doc.fontSize(20).text("Invoice", {align: "center"});
      doc.moveDown();

      doc.fontSize(14).text(`Transaction Id: ${invoiceData.transactionId} `);
      doc.fontSize(14).text(`Booking Date: ${invoiceData.bookingDate}`);
      doc.text(`Customer: ${invoiceData.userName}`)
      doc.moveDown();

      doc.text(`Tour: ${invoiceData.tourTitle}`);
      doc.text(`Guests: ${invoiceData.guestsCount}`);
      doc.text(`Total Amount: ${invoiceData.totalAmount.toFixed(2)}`);
      doc.moveDown();

      doc.text("Thank you for booking with us", {align: "center"})

      doc.end();

    })
    
  } catch (error: any) {
    console.log(error)
    throw new AppError(httpStatusCodes.UNAUTHORIZED, `PDF creation error ${error.message}`)
  }
}