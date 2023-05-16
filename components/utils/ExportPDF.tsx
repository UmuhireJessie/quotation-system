import jsPDF from 'jspdf'
import html2canvas from 'html2canvas';

export const exportToPDF = (tableRef) => {
    const doc = new jsPDF();

    html2canvas(tableRef.current).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210; // A4 page width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        doc.save('pdf_report.pdf');
    });
};
