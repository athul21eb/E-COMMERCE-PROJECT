import jsPDF from "jspdf";
import "jspdf-autotable";
import { formatDate } from "./formatDate";
import toast from "react-hot-toast";

export const downloadPdfReport = async (fetchData,period,startDate,endDate) => {
  try {
    
    const { salesReport: reportData } = await fetchData({period,startDate,endDate})?.unwrap();
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
      `Refunded Amount :${reportData.overallRefundAmount}`,
      
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
      order.items.reduce(
        (acc, item) => acc + (item.appliedOfferAmount || 0),
        0
      ),
      order.refundedAmount,
      order.billAmount-(order.refundedAmount||0)
    ]);

    // AutoTable starts after summary
    doc.autoTable({
      head: [
        [
          "Order ID",
          "Date",
          "Order Amount",
          "Coupon Discount",
          "Discount on MRP",
          "Refund Amount",
          "Revenue"
        ],
      ],
      body: tableData,
      startY: summaryY + 10, // Position the table just below the summary
      styles: { fontSize: 10, halign: "center" },
      headStyles: { fillColor: "#f2f2f2", textColor: "black" },
      alternateRowStyles: { fillColor: "#f9f9f9" },
    });

    // Save the PDF
    doc.save("fire_boots_sales_report.pdf");
  } catch (error) {
    console.error("Error downloading sales report:", error);
    toast.error(
      error.message || "An error occurred while downloading the report."
    );
  }
};

export const downloadOrderDetailsPdf = (orderDetails) => {
  try {
    const doc = new jsPDF();

    // Add Logo at Top Right
    const imgPath = "/LOGO.png"; // Path to your logo
    const imgWidth = 30;
    const imgHeight = 30;
    // Get page width
    const imgX = 105 - imgWidth / 2; // Position 10 units from the right
    const imgY = 10;
    doc.addImage(imgPath, "PNG", imgX, imgY, imgWidth, imgHeight);

    // Content starts below the logo
    const contentStartY = imgY + imgHeight + 10;

    // Add Title
    doc.setFontSize(20);
    doc.text("Invoice", 105, contentStartY, { align: "center" });

    // Order Information
    doc.setFontSize(12);
    const orderInfo = [
      `Order ID: ${orderDetails.orderId || "N/A"}`,
      `Order Date: ${
        new Date(orderDetails.orderDate).toLocaleString() || "N/A"
      }`,
      `Payment Method: ${orderDetails.payment?.method || "N/A"}`,
      `Payment Status: ${orderDetails.payment?.status || "N/A"}`,
      `Invoice Date: ${new Date().toLocaleString()}`,
      `Transaction ID: ${orderDetails.payment?.transactionId || "N/A"}`,
    ];

    let orderInfoY = contentStartY + 10;
    orderInfo.forEach((line) => {
      doc.text(line, 105, orderInfoY, { align: "center" });
      orderInfoY += 8;
    });

    // Shipping Address
    const shippingAddress = orderDetails.shippingAddress;
    doc.setFontSize(14);
    doc.text("Shipping Address:", 10, orderInfoY + 10);
    doc.setFontSize(12);

    const addressLines = [
      `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      `${shippingAddress.landmark}, ${shippingAddress.city}`,
      `${shippingAddress.district}, ${shippingAddress.state}, ${shippingAddress.pincode}`,
      `Phone: ${shippingAddress.mobileNumber}`,
    ];

    let addressY = orderInfoY + 20;
    addressLines.forEach((line) => {
      doc.text(line, 10, addressY);
      addressY += 8;
    });

    // Table Header
    const tableData = orderDetails.items.map((item) => [
      `${item.productId?.productName || "N/A"} (Size: ${item.size || "N/A"})`,
      item.quantity,
      item.unitPrice,
      item.appliedOfferAmount,
      item.itemTotalPrice,
      item.status,
    ]);

    doc.autoTable({
      head: [
        [
          "Product",
          "Quantity",
          "Unit Price",
          "Offer Discount",
          "Total Price",
          "Status",
        ],
      ],
      body: tableData,
      startY: addressY + 10,
      styles: { fontSize: 10, halign: "center" },
      headStyles: { fillColor: "#f2f2f2", textColor: "black" },
      alternateRowStyles: { fillColor: "#f9f9f9" },
    });
    // Redesigned Summary Section with a more prominent total amount
    const summaryY = doc.lastAutoTable.finalY + 10;

    // Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Order Summary", 10, summaryY);

    // Subtotal and other amounts with improved design
    doc.autoTable({
      body: [
        [
          "Sub Total",
          `${orderDetails.items.reduce(
            (acc, item) => acc + (item.unitPrice * item.quantity || 0),
            0
          )}`,
        ],
        [
          "Offer Discount",
          `${orderDetails.items.reduce(
            (acc, item) => acc + (item.appliedOfferAmount || 0),
            0
          )}`,
        ],
        ["Applied Coupon Discount", `${orderDetails.appliedCouponAmount || 0}`],
        ["Refunded Amount  ",`${orderDetails.refundedAmount || 0}`]
      ],
      startY: summaryY + 10,
      styles: { fontSize: 12, halign: "right" },
      columnStyles: {
        0: { halign: "left", fontStyle: "normal" },
        1: { halign: "right", fontStyle: "normal" },
      },
      margin: { left: 10, right: 10 },
      theme: "grid",
    });


   
    // Total Amount with more bold and dark font
    const totalAmountY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold"); // Bold style for total amount
    doc.setTextColor(0, 0, 0); // Dark color for the total amount
    doc.text("Total Amount", 10, totalAmountY);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0); // Keep the dark color for better visibility

   
    doc.text(
      `${orderDetails.billAmount-orderDetails.refundedAmount || 0}`,
      105, // Position it at the center
      totalAmountY,
      { align: "center" }
    );

    // Save PDF
    doc.save(`Invoice_${orderDetails.orderId || "N/A"}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate the order invoice.");
  }
};
