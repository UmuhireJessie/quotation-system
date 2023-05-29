import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";


const clientInfoMap = {};
const quoteInfoMap = {};
const token = Cookies.get("token");

const getAllClients = async () => {
    try {
        const dt = await fetch("https://insurance.e-fashe.com/client/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        const response = await dt.json();
        const Allclients = response?.data || [];

        Allclients.forEach((client) => {
            const clientIdentity = `${client.fName} | ${client.pNnumber}`;
            clientInfoMap[client.id] = clientIdentity;
        });

    } catch (error: any) {
        toast.error(error, {
            className: 'font-[sans-serif] text-sm'
        });
    }
}

const getAllQuotes = async () => {
    try {
        const dt = await fetch("https://insurance.e-fashe.com/quatation/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        const response = await dt.json();
        const AllQuotes = response?.data || [];

        AllQuotes.forEach((quote) => {
            const quoteData = `${quote.policyQuoteId}`;
            quoteInfoMap[quote.id] = quoteData;
        });

    } catch (error: any) {
        toast.error(error, {
            className: 'font-[sans-serif] text-sm'
        });
    }
}

export const handleExportAndSendEmail = async (data: any, email: any, type: any) => {
    let columnHeaders: any;
    let csvData: any;
    await getAllClients()
    await getAllQuotes()

    if (type === 'quote') {
        columnHeaders = [
            'CreationDate',
            'policyQuoteId',
            'policyQuoteType',
            'policyHolderName',
            'policyHolderType',
            'client',
            'document',
            'amount',
            'validDate',
            'status',
        ];

        csvData = [columnHeaders]
            .concat(data.map((row: any) => {
                return `"${row.createdAt}","${row.policyQuoteId}","${row.policyQuoteType}","${row.policyHolderName}","${row.policyHolderType}",${!(row.clientId) ? "" : clientInfoMap[row.clientId]},${!(row.document) ? "No File" : "Done"},"${row.amount}","${row.validDate}","${row.status}"`;
            })).join('\n');
    } if (type === 'client') {
        columnHeaders = [
            'CreationDate',
            'FirstName',
            'LastName',
            'Email',
            'PhoneNumber'
        ];

        csvData = [columnHeaders]
            .concat(data.map((row: any) => {
                return `"${row.createdAt}","${row.fName}","${row.sName}","${row.email}","${row.pNnumber}"`;
            })).join('\n');
    } if (type === 'sms') {
        columnHeaders = [
            'CreationDate',
            'PhoneNumber',
            'Message',
            'QuoteId',
            'GatewayReference',
            'Status'
        ];

        csvData = [columnHeaders]
            .concat(data.map((row: any) => {
                return `"${row.createdAt}","${row.pNnumber}","${row.message}","${quoteInfoMap[row.quoteId]}","${row.gtwRef}","${row.status}"`;
            })).join('\n');
    } if (type === 'pay') {
        columnHeaders = [
            'CreationDate',
            'PhoneNumber',
            'Amount',
            'QuoteId',
            'GatewayReference',
            'Status'
        ];

        csvData = [columnHeaders]
            .concat(data.map((row: any) => {
                return `"${row.createdAt}","${row.pNnumber}","${row.amount}","${quoteInfoMap[row.quoteId]}","${row.gtwRef}", "${row.status}"`;
            })).join('\n');
    } if (type === 'logs') {
        columnHeaders = [
            'CreationDate',
            'IpAddress',
            'HostName',
            'Description',
            'FirstName',
            'LastName',
            'Role'
        ];

        csvData = [columnHeaders]
            .concat(data.map((row: any) => {
                return `"${row.createdAt}","${row.ipAddress}","${row.hostName}","${row.description}","${row.fName}", "${row.sName}", "${row.role}"`;
            })).join('\n');
    }

    const zip = new JSZip();
    zip.file('report.csv', csvData);
    const zipContent = await zip.generateAsync({ type: 'arraybuffer' });

    const zipBlob = new Blob([zipContent], { type: 'application/zip' });

    // Save the zip file locally (optional)
    // saveAs(zipBlob, 'data.zip');

    // Send the zip file to the email
    const formData = new FormData();
    formData.append('file', zipBlob, 'email_report.zip');

    formData.append('email', email);

    const config = {
        headers: {
            'accept': 'application/json',
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    };

    try {
        const response = await axios.post('https://insurance.e-fashe.com/email/file', formData, config);
        if (response.status === 200) {
            toast.success("Report sent successfully.", {
                className: 'font-[sans-serif] text-sm'
            })
        } else {
            toast.error("Sorry, an error occurred in sending email", {
                className: 'font-[sans-serif] text-sm'
            })
        }
    } catch (error: any) {
        console.error(error);
        toast.error(error.message, {
            className: 'font-[sans-serif] text-sm'
        })
    }
};