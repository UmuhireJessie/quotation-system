import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { convertToExportFormatQuote, convertToExportFormatClient, convertToExportFormatPay, convertToExportFormatSMS, convertToExportFormatLogs} from './Formats';

const handleExportData = (data: any, report: any) => {
    let exportedData: any;
    if (report == 'quote') {
        exportedData = convertToExportFormatQuote(data);
    } if (report == 'client') {
        exportedData = convertToExportFormatClient(data);
    } if (report == 'pay') {
        exportedData = convertToExportFormatPay(data);
    } if (report == 'sms') {
        exportedData = convertToExportFormatSMS(data);
    } if (report == 'logs') {
        exportedData = convertToExportFormatLogs(data);
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportedData);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    saveAs(blob, 'excel_report.xlsx');
};

export default handleExportData;