export const convertToExportFormatQuote = (dataToFormat) => {
    const formattedData = dataToFormat.map((row: any) => {
        return {
            CreationDate: row.createdAt,
            PolicyQuoteId: row.policyQuoteId,
            PolicyQuoteType: row.policyQuoteType,
            PolicyHolderName: row.policyHolderName,
            PolicyHolderType: row.policyHolderType,
            ClientId: row.clientId,
            Document: row.document,
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

export const convertToExportFormatPay = (dataToFormat) => {
    const formattedData = dataToFormat.map((row: any) => {
        return {
            CreationDate: row.createdAt,
            PhoneNumber: row.pNnumber,
            Amount: row.amount,
            QuoteId: row.quoteId,
            GatewayReference: row.gtwRef,
            Status: row.status
        };
    });
    return formattedData;
};

export const convertToExportFormatSMS = (dataToFormat) => {
    const formattedData = dataToFormat.map((row: any) => {
        return {
            CreationDate: row.createdAt,
            PhoneNumber: row.pNnumber,
            Message: row.Message,
            QuoteId: row.quoteId,
            GatewayReference: row.gtwRef,
            Status: row.status
        };
    });
    return formattedData;
};