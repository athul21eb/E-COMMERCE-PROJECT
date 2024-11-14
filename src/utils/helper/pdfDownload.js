import jsPDF from "jspdf";
import "jspdf-autotable";
import { formatDate } from "./formatDate";

export const downloadPdfReport = (reportData) => {
  const doc = new jsPDF();
  const title = "Sales Report";

  // Path to the logo
  const imgPath = "/LOGO.png"; // Path to the image in the public folder
  const imgWidth = 40; // Adjust image width as needed
  const imgHeight = 40; // Adjust image height as needed

  // Add logo at the top center of the page
  const imgX = (doc.internal.pageSize.width - imgWidth) / 2; // Center the image horizontally
  const imgY = 10; // Position the image vertically from the top
  doc.addImage(imgPath, "PNG", imgX, imgY, imgWidth, imgHeight);

  // Add title below the logo, ensuring it's centered
  doc.setFontSize(18);
  const titleX = doc.internal.pageSize.width / 2; // Center the title horizontally
  doc.text(title, titleX, 70, { align: "center" }); // Adjust Y position for title

  // Add summary below the title
  const summary = [
    `Sales Count: ${reportData.overallSalesCount}`,
    `Order Amount: ${reportData.overallOrderAmount}`,
    `Discount: ${reportData.overallDiscount}`,
    `Discount on MRP: ${reportData.totalDiscountOnMRP}`,
  ];
  doc.setFontSize(12);
  let summaryY = 90; // Starting Y position for summary text
  summary.forEach((line) => {
    doc.text(line, 20, summaryY); // Left-align summary text at 20 px
    summaryY += 10; // Move Y position down for the next line
  });

  // Add table
  const tableData = reportData.orders.map((order) => [
    order.orderId,
    formatDate(order.orderDate), // Ensure date is formatted correctly before passing
    order.billAmount,
    order.appliedCouponAmount,
    order.items.reduce((acc, item) => acc + (item.appliedOfferAmount || 0), 0),
  ]);

  // AutoTable starts after summary
  doc.autoTable({
    head: [["Order ID", "Date", "Order Amount", "Coupon Discount", "Discount on MRP"]],
    body: tableData,
    startY: summaryY + 10, // Position the table just below the summary
    styles: { fontSize: 10, halign: "center" },
    headStyles: { fillColor: "#f2f2f2", textColor: "black" },
    alternateRowStyles: { fillColor: "#f9f9f9" },
  });

  // Save the PDF
  doc.save("fire_boots_sales_report.pdf");
};
