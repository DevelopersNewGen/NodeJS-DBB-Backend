import PDFDocument from "pdfkit";
import axios from "axios";
import ExcelJS from "exceljs";
import Movements from "../movements/movements.model.js";

export const getVoucherPDF = async (req, res) => {
    try {
        const { mid } = req.params;

        const movement = await Movements.findById(mid)
        .populate("originAccount", "accountNumber")
        .populate("destinationAccount", "accountNumber");

        if (!movement) {
        return res.status(404).json({ msg: "Movement not found" });
        }

        const doc = new PDFDocument({size: 'A5', layout: 'landscape', margin: 40 });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="voucher_${mid}.pdf"`);

        doc.pipe(res);

        const logoUrl = "https://res.cloudinary.com/dibe6yrzf/image/upload/v1749429640/Logo_DBB_rksoam.png";
        const response = await axios.get(logoUrl, { responseType: "arraybuffer" });
        const logoBuffer = Buffer.from(response.data);

        doc.image(logoBuffer, 40, 10, { width: 80 });

        doc
        .fillColor("#003366")
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("VOUCHER DE MOVIMIENTO BANCARIO", 50, 60, { align: "center" });

        doc.moveTo(40, 90).lineTo(555, 90).strokeColor("#cccccc").stroke();

        doc
        .roundedRect(40, 100, 515, 240, 8)
        .fillOpacity(0.03)
        .fillAndStroke("#f0f0f0", "#cccccc");

        doc.fillOpacity(1);

        const formatType = (type) => {
        switch (type) {
            case "DEPOSIT": return "Depósito";
            case "TRANSFER": return "Transferencia";
            case "WITHDRAWAL": return "Retiro";
            default: return type;
        }
        };

        doc
        .fillColor("#4F81BD")
        .fontSize(12)
        .font("Helvetica")
        .text("Tipo de Movimiento:", 60, 120)
        .font("Helvetica-Bold").text(formatType(movement.type), 200, 120)

        .font("Helvetica").text("Fecha y Hora:", 60, 145)
        .font("Helvetica-Bold").text(movement.date.toLocaleString(), 200, 145)

        .font("Helvetica").text("Cuenta Origen:", 60, 170)
        .font("Helvetica-Bold").text(movement.originAccount?.accountNumber || "N/A", 200, 170)

        .font("Helvetica").text("Cuenta Destino:", 60, 195)
        .font("Helvetica-Bold").text(movement.destinationAccount?.accountNumber || "N/A", 200, 195)

        .font("Helvetica").text("Monto:", 60, 220)
        .font("Helvetica-Bold").text(`Q${movement.amount.toFixed(2)}`, 200, 220)

        .font("Helvetica").text("Saldo después:", 60, 245)
        .font("Helvetica-Bold").text(`Q${movement.balanceAfter.toFixed(2)}`, 200, 245)

        .font("Helvetica").text("Descripción:", 60, 270)
        .font("Helvetica-Bold").text(movement.description || "-", 200, 270);

        // Footer
        doc
        .fontSize(9)
        .fillColor("#666")
        .text("Documento generado automáticamente por el sistema de DBB", 40, 360, { align: "center" });

        doc.end();
    } catch (err) {
        res.status(500).json({ msg: "Error generating voucher", error: err.message });
    }
};


export const getMovementsExcel = async (req, res) => {
    try {
        const movements = await Movements.find().populate("originAccount destinationAccount").lean();

        if (!movements.length) {
            return res.status(404).json({ msg: "No movements found" });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Movimientos");

        worksheet.columns = [
            { header: "ID Movimiento", key: "_id", width: 30 },
            { header: "Tipo", key: "type", width: 15 },
            { header: "Fecha", key: "date", width: 20 },
            { header: "Cuenta Origen", key: "originAccount", width: 25 },
            { header: "Cuenta Destino", key: "destinationAccount", width: 25 },
            { header: "Monto", key: "amount", width: 15 },
            { header: "Descripción", key: "description", width: 30 },
            { header: "Saldo Después", key: "balanceAfter", width: 20 },
        ];

        movements.forEach(m => {
            worksheet.addRow({
                _id: m._id,
                type: m.type,
                date: new Date(m.date).toLocaleString(),
                originAccount: m.originAccount?._id || "N/A",
                destinationAccount: m.destinationAccount?._id || "N/A",
                amount: m.amount,
                description: m.description,
                balanceAfter: m.balanceAfter,
            });
        });

        const headerRow = worksheet.getRow(1);
        headerRow.eachCell(cell => {
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4F81BD' } 
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        worksheet.eachRow((row, rowNumber) => {
            (cell => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { vertical: 'middle', horizontal: 'left' };
            });
        });

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=movements_report.xlsx");

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ msg: "Error generating Excel", error: error.message });
    }
};
