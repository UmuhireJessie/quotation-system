import { toast } from "react-toastify";
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

export const convertToExportFormatQuote = async (dataToFormat) => {
    await getAllClients()
    const formattedData = dataToFormat.map((row: any) => {
        return {
            CreationDate: row.createdAt,
            PolicyQuoteId: row.policyQuoteId,
            PolicyQuoteType: row.policyQuoteType,
            PolicyHolderName: row.policyHolderName,
            PolicyHolderType: row.policyHolderType,
            Client: clientInfoMap[row.clientId],
            Document: !(row.document) ? "No File" : "Done",
            Amount: row.amount,
            ValidDate: row.validDate,
            Status: row.status,
        };
    });
    return formattedData;
};

export const convertToExportFormatClient = (dataToFormat) => {
    const formattedData = dataToFormat.map((row: any) => {
        return {
            CreationDate: row.createdAt,
            FirstName: row.fName,
            LastName: row.sName,
            Email: row.email,
            PhoneNumber: row.pNnumber
        };
    });
    return formattedData;
};

export const convertToExportFormatPay = async (dataToFormat) => {
    await getAllQuotes()
    const formattedData = dataToFormat.map((row: any) => {
        return {
            CreationDate: row.createdAt,
            PhoneNumber: row.pNnumber,
            Amount: row.amount,
            QuoteId: quoteInfoMap[row.quoteId],
            GatewayReference: row.gtwRef,
            Status: row.status
        };
    });
    return formattedData;
};

export const convertToExportFormatSMS = async (dataToFormat) => {
    await getAllQuotes()
    const formattedData = dataToFormat.map((row: any) => {
        return {
            CreationDate: row.createdAt,
            PhoneNumber: row.pNnumber,
            Message: row.message,
            QuoteId: quoteInfoMap[row.quoteId],
            GatewayReference: row.gtwRef,
            Status: row.status
        };
    });
    return formattedData;
};
export const convertToExportFormatLogs = (dataToFormat) => {
    const formattedData = dataToFormat.map((row: any) => {
        return {
            CreationDate: row.createdAt,
            IpAddress: row.ipAddress,
            HostName: row.hostName,
            Description: row.description,
            FirstName: row.fName,
            LastName: row.sName,
            Role: row.role
        };
    });
    return formattedData;
};