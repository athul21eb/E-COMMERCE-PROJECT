import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { formatDate } from "./formatDate";
import toast from "react-hot-toast";

export const downloadXlsxReport = async (fetchData,period,startDate,endDate) => {
  try {
    const { salesReport: reportData } = await fetchData({period,startDate,endDate})?.unwrap();
    console.log();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sales Report");

    worksheet.columns = [
      { header: "Order ID", key: "orderId", width: 30 },

      { header: "Coupon Discount", key: "appliedCouponAmount", width: 20 },
      { header: "Discount on MRP", key: "productDiscount", width: 20 },
      { header: "Refunded Amount", key: "refundAmount", width: 25 },
      { header: "Order Amount", key: "billAmount", width: 25 },
      { header: "Date", key: "orderDate", width: 25 },
    ];

    reportData.orders.forEach((order) => {
      worksheet.addRow({
        orderId: order.orderId,
        appliedCouponAmount: order.appliedCouponAmount,
        productDiscount: order.items.reduce(
          (acc, item) => acc + (item.appliedOfferAmount || 0),
          0
        ),
        refundAmount: order.refundedAmount,
        billAmount: order.billAmount - order.refundedAmount,
        orderDate: formatDate(order.orderDate), // Ensure date is formatted correctly before passing
      });
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "fire_boots_sales_report.xlsx");
    });
  } catch (error) {
    console.error("Error downloading sales report:", error);
    toast.error(
      error.message || "An error occurred while downloading the report."
    );
  }
};
