import Adminbar from "@/components/layout/AdminNav";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Select from "react-select";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import * as IoIcons from "react-icons/io5";
import * as BsIcons from "react-icons/bs";
import { Pagination } from '@nextui-org/react';
import toast, { Toaster } from 'react-hot-toast';

const customTheme = (theme: any) => {
    return {
        ...theme,
        colors: {
            ...theme.colors,
            text: "light-gray",
            primary25: "#E5E7EB",
            primary: "#d6dfdf",
            neutral0: "white",
        },
    };
};

const Quote = () => {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [policyQuoteType, setPolicyQuoteType] = useState("");
    const [policyQuoteId, setPolicyQuoteId] = useState("");
    const [policyHolderType, setPolicyHolderType] = useState("");
    const [policyHolderName, setPolicyHolderName] = useState("");
    const [validDate, setValidDate] = useState("");
    const [amount, setAmount] = useState("");

    const [openUpdateModal, setOpenUpdateModel] = useState(false);
    const [openUploadModal, setOpenUploadModal] = useState(false);
    const [kycFile, setKycFile] = useState<File | null>(null);
    const [updatePolicyQuoteType, setUpdatePolicyQuoteType] = useState("")
    const [updatePolicyHolderType, setUpdatePolicyHolderType] = useState("")
    const [updatePolicyHolderName, setUpdatePolicyHolderName] = useState("")
    const [updateValidDate, setUpdateValidDate] = useState("")
    const [updateAmount, setUpdateAmount] = useState("")
    const [openAssignModal, setOpenAssignModel] = useState(false);
    const [assignedClient, setAssignedClient] = useState("");
    const [clientData, setClientData] = useState([]);
    const [clientInfo, setClientInfo] = useState({});

    const [activeData, setActiveData] = useState<any | undefined>({});
    const [updateQuoteId, setUpdateQuoteId] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [isCreated, setIsCreated] = useState(false)


    const token = Cookies.get("token");

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
            setData(response?.data)
            return response;
        } catch (error: any) {
            toast.error(error.message, {
                className: 'font-[sans-serif] text-sm'
            })
        }
    }

    useEffect(() => {
        getAllQuotes()
        getAllClients()
        if (openUpdateModal && activeData) {
            setUpdatePolicyQuoteType(activeData.policyQuoteType);
            setUpdatePolicyHolderType(activeData.policyHolderType);
            setUpdatePolicyHolderName(activeData.policyHolderName);
            setUpdateValidDate(activeData.validDate);
            setUpdateAmount(activeData.amount);
            setUpdateQuoteId(activeData?.id);
        } if ((openUploadModal && activeData) || (openAssignModal && activeData)) {
            setUpdateQuoteId(activeData.id)
        }
        setIsCreated(false);
    }, [isCreated, openUpdateModal, activeData])

    const [filters, setFilters] = useState({
        dateStart: '',
        dateEnd: '',
        policyQuoteType: '',
        policyQuoteId: '',
        policyHolderType: '',
        policyHolderName: '',
        document: '',
        status: '',
        amount: '',
        clientId: ''
    });

    const handleFilterChange = (e, columnId) => {
        setFilters({ ...filters, [columnId]: e.target.value });
    };

    const filteredData = data?.filter((row: any) => {
        const date = new Date(row.validDate);
        const dateStart = filters.dateStart ? new Date(filters.dateStart) : null;
        const dateEnd = filters.dateEnd ? new Date(filters.dateEnd) : null;
        const isDateInRange =
            (!dateStart || date >= dateStart) && (!dateEnd || date <= dateEnd);

        const policyHolderTypeMatch = row.policyHolderType
            .toLowerCase()
            .includes(filters.policyHolderType.toLowerCase());

        const amountMatch = row.amount.toString()
            .toLowerCase()
            .includes(filters.amount.toLowerCase());

        const policyQuoteTypeMatch = row.policyQuoteType
            .toLowerCase()
            .includes(filters.policyQuoteType.toLowerCase());

        const documentMatch =
            filters.document === "null"
                ? row.document === null
                : filters.document === "notNull"
                    ? row.document !== null
                    : true;

        const policyQuoteIdMatch = row.policyQuoteId
            .toLowerCase()
            .includes(filters.policyQuoteId.toLowerCase());

        const policyHolderNameMatch = row.policyHolderName
            .toLowerCase()
            .includes(filters.policyHolderName.toLowerCase());

        const statusMatch = row.status
            .toLowerCase()
            .includes(filters.status.toLowerCase());

        const clientIdMatch =
            filters.clientId === '' ||
            (row.clientId && clientInfo[row.clientId]?.toLowerCase().includes(filters.clientId.toLowerCase()));

        return (
            isDateInRange &&
            policyHolderTypeMatch &&
            amountMatch &&
            policyQuoteTypeMatch &&
            policyQuoteIdMatch &&
            policyHolderNameMatch &&
            statusMatch &&
            documentMatch &&
            clientIdMatch

        );
    });


    // Create client ===============

    const handleOpenCreateClient = () => {
        setOpenCreateModal(true);
    };
    const handleCloseCreateModel = () => {
        setOpenCreateModal(false);
    };
    const createClient = async (data: any) => {
        try {
            const dt = await fetch("https://insurance.e-fashe.com/quatation/", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const response = await dt.json();
            if (response?.detail) {
                toast.error(response.detail, {
                    className: 'font-[sans-serif] text-sm'
                });
            } else {
                setIsCreated(true)
                setPolicyQuoteType("")
                setPolicyQuoteId("")
                setPolicyHolderType("")
                setPolicyHolderName("")
                setAmount("")
                setValidDate("")
                toast.success('Quotation added successfully!', {
                    className: 'font-[sans-serif] text-sm'
                });
            }
        } catch (error: any) {
            setPolicyQuoteType("")
            setPolicyQuoteId("")
            setPolicyHolderType("")
            setPolicyHolderName("")
            setAmount("")
            setValidDate("")
            toast.error(error.message, {
                className: 'font-[sans-serif] text-sm'
            })
        }
    };

    const createNewClient = (e: any) => {
        e.preventDefault()
        const quoteData = {
            policyQuoteType: policyQuoteType,
            policyQuoteId: policyQuoteId,
            policyHolderType: policyHolderType,
            policyHolderName: policyHolderName,
            validDate: validDate,
            amount: amount
        };
        createClient(quoteData);
        setOpenCreateModal(false);
    };

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
            setClientData(Allclients)

            const clientInfoMap = {};
            Allclients.forEach((client) => {
                const clientIdentity = `${client.fName} | ${client.pNnumber}`;
                clientInfoMap[client.id] = clientIdentity;
            });
            setClientInfo(clientInfoMap);
            setIsLoading(false);

        } catch (error: any) {
            toast.error(error, {
                className: 'font-[sans-serif] text-sm'
            });
        }
    }

    const clientOptions = clientData?.map((client: any, index: any) => {
        return {
            key: index,
            value: client.id,
            label: `${client.fName} ${client.sName} | ${client.pNnumber}`
        };
    });

    const handleOpenAssignModal = (e: any) => {
        setOpenAssignModel(true);

    };

    const handleCloseAssignModal = (e: any) => {
        e.preventDefault();
        setOpenAssignModel(false);
    };

    const assignClient = async (data: any, id: any) => {
        try {
            const dt = await fetch(`https://insurance.e-fashe.com/quatation/asign/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const response = await dt.json();

            if (response?.detail) {
                throw new Error(response.detail);
            } else {
                setIsCreated(true)
                return 'Client assigned successfully!'
            }

        } catch (error: any) {
            console.error(error);
            throw new Error(error.message);
        }
    };

    const handleAssignClient = (e: any) => {
        e.preventDefault();

        const assignData = {
            clientId: assignedClient
        };
        
        toast.promise(assignClient(assignData, updateQuoteId), {
            loading: 'Assigning client...',
            success: (message) => {
                return message;
            },
            error: (error) => error.message,
        })

        setOpenAssignModel(false);
    };

    // upload kyc
    const handleOpenUploadModal = (e: any) => {
        setOpenUploadModal(true);

        setUpdateQuoteId(activeData?.id);
    };
    const handleCloseUploadModal = (e: any) => {
        e.preventDefault();
        setOpenUploadModal(false);
    };
    const handleUploadFile = (e: any) => {
        e.preventDefault();

        if (kycFile) {
            const formData = new FormData();
            formData.append('file', kycFile);

            toast.promise(uploadFile(formData, updateQuoteId), {
                loading: 'uploading ...',
                success: (message) => {
                    return message;
                },
                error: (error) => error.message,
            })
        }

        setKycFile(null)
        setOpenUploadModal(false);

    };
    const uploadFile = async (data: any, id: any) => {
        try {
            const dt = await fetch(`https://insurance.e-fashe.com/files/upload?quoteId=${id}`, {
                method: "POST",
                body: data,
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const response = await dt.json();
            if (response.status === "success") {
                setIsCreated(true)
                return "KYC added successfully!"
            } else {
                throw new Error(response?.detail)
            }

        } catch (error: any) {
            console.error(error);
            throw new Error(error.message)
        }
    };

    // Download kyc
    const handleDownload = (id: any) => {

        toast.promise(downloadFile(id), {
            loading: 'downloading ...',
            success: 'Successfully downloaded',
            error: (error) => error.message,
        })
    };
    const downloadFile = async (id: any) => {
        try {
            const response = await fetch(`https://insurance.e-fashe.com/files/download?quoteId=${id}`, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                const blob = await response.blob();

                // Create a temporary anchor element to initiate the download
                const anchor = document.createElement('a');
                const objectUrl = URL.createObjectURL(blob);
                anchor.href = objectUrl;
                anchor.download = 'kyc.pdf';
                anchor.click();
                URL.revokeObjectURL(objectUrl);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.detail)
            }
        } catch (error: any) {
            throw new Error(error.message)
        }
    };

    // delete kyc
    const handleDelete = (id: any) => {

        toast.promise(deleteFile(id), {
            loading: 'deleting ...',
            success: (message: any) => {
                return message;
            },
            error: (error) => error.message,
        })

        setOpenUpdateModel(false);
    };

    const deleteFile = async (id: any) => {
        try {
            const dt = await fetch(`https://insurance.e-fashe.com/files/?filename=${id}`, {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
            });
            const response = await dt.json();
            console.log("response delete", response)
            if (response?.filename) {
                setIsCreated(true)
                return "KYC deleted successfully!"
            } else {
                throw new Error(response.detail);
            }

        } catch (error: any) {
            console.error(error);
            throw new Error(error.message)
        }
    };

    // update quote ===========

    const handleOpenUpdateModal = (e: any) => {
        setOpenUpdateModel(true);
    };

    const handleCloseUpdateModal = (e: any) => {
        e.preventDefault();
        setOpenUpdateModel(false);
    };

    const updateClient = async (data: any, id) => {
        try {
            const dt = await fetch(`https://insurance.e-fashe.com/quatation/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const response = await dt.json();
            if (response?.detail) {
                throw new Error(response.detail);
            } else {
                setIsCreated(true)
                setUpdatePolicyQuoteType('')
                setUpdatePolicyHolderType('')
                setUpdatePolicyHolderName('')
                setUpdateValidDate('')
                setUpdateAmount('')
                setUpdateQuoteId('');
                return 'Quotation updated successfully!';
            }

        } catch (error: any) {
            console.error(error);
            setUpdatePolicyQuoteType('')
            setUpdatePolicyHolderType('')
            setUpdatePolicyHolderName('')
            setUpdateValidDate('')
            setUpdateAmount('')
            setUpdateQuoteId('');
            throw new Error(error.message);
        }
    };

    const updateCycle = (e: any) => {
        e.preventDefault();

        const updateData = {

            policyQuoteType: updatePolicyQuoteType,
            policyHolderType: updatePolicyHolderType,
            policyHolderName: updatePolicyHolderName,
            validDate: updateValidDate,
            amount: updateAmount
        };
        toast.promise(updateClient(updateData, updateQuoteId), {
            loading: 'updating quotation...',
            success: (message) => {
                return message;
            },
            error: (error) => error.message,
        })

        setOpenUpdateModel(false);
    };

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(filteredData?.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentRows = filteredData?.slice(startIndex, endIndex);

    return (
        <>
            <Adminbar />
            <Toaster
                position="top-right" />
            <div className="mt-[7rem] ml-[18rem] mr-7 mb-4 bg-white p-6 rounded-md">
                <div>
                    <h4 className="font-[500] text-[16px] mb-6">Quotation</h4>
                </div>
                <hr style={{ marginBottom: "1.5rem" }} />
                <div className='flex justify-between'>
                    <div className="flex mb-5 text-sm items-center">
                        <span className="mr-1">Display</span>
                        <span><select
                            className="block w-[4rem] border border-[#e8ebe8] bg-[#f6f6f6] rounded-[5px] py-1 px-2 mr-1 focus:outline-none focus:shadow-sm text-sm"
                            onChange={(e) => setRowsPerPage(Number(`${e?.target.value}`))}
                        >
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="50">50</option>

                        </select></span>
                        <span>entries per page</span>

                    </div>

                    <button
                        className={" h-[35px] rounded-[5px] text-white flex items-center p-0 pl-[5px] pr-[10px] mb-[20px]"}
                        style={{ background: "linear-gradient(270deg, #60b848 1.64%, #009677 98.36%)" }}
                        onClick={() => handleOpenCreateClient()}
                    >
                        <BsIcons.BsPlusLg className="mx-[5px]" />
                        <span className="text-sm">Quotation</span>
                    </button>
                </div>

                <Table className="mb-10 text-[#06091b]">
                    <Thead className="">
                        <Tr>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0] pl-4">Policy Quote Type</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Policy Quote ID</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Policy Holder Name</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Policy Holder Type</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Client</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">KYC</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Amount</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Valid Date</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Status</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Action</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        <Tr className="border-b border-[#888787]">
                            <Td className="py-4">
                                <input
                                    className="ml-4 block w-[4rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                    type="text"
                                    value={filters.policyQuoteType}
                                    onChange={(e) => handleFilterChange(e, 'policyQuoteType')}
                                />
                            </Td>
                            <Td className="py-4">
                                <input
                                    className="block w-[4rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                    type="text"
                                    value={filters.policyQuoteId}
                                    onChange={(e) => handleFilterChange(e, 'policyQuoteId')}
                                />
                            </Td>
                            <Td className="py-4">
                                <input
                                    className="block w-[4rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                    type="text"
                                    value={filters.policyHolderName}
                                    onChange={(e) => handleFilterChange(e, 'policyHolderName')}
                                />
                            </Td>
                            <Td className="py-4">
                                <input
                                    className="block w-[4rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                    type="text"
                                    value={filters.policyHolderType}
                                    onChange={(e) => handleFilterChange(e, 'policyHolderType')}
                                />
                            </Td>
                            <Td className="py-4">
                                <input
                                    className="block w-[4rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                    type="text"
                                    value={filters.clientId}
                                    onChange={(e) => handleFilterChange(e, 'clientId')}
                                />
                            </Td>
                            <Td className="py-4">
                                <select
                                    className="block w-[5rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                    value={filters.document}
                                    onChange={(e) => handleFilterChange(e, 'document')}
                                >
                                    <option value="">All</option>
                                    <option value="null">No File</option>
                                    <option value="notNull">Done</option>
                                </select>
                            </Td>
                            <Td className="py-4">
                                <input
                                    className="block w-[4rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                    type="text"
                                    value={filters.amount}
                                    onChange={(e) => handleFilterChange(e, 'amount')}
                                />
                            </Td>
                            <Td className="py-4">
                                <div>
                                    <input
                                        className="block w-[4rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 mb-2 focus:outline-none focus:shadow-sm text-sm"
                                        type="date"
                                        value={filters.dateStart}
                                        onChange={(e) => handleFilterChange(e, 'dateStart')}
                                    />
                                    <input
                                        className="block w-[4rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                        type="date"
                                        value={filters.dateEnd}
                                        onChange={(e) => handleFilterChange(e, 'dateEnd')}
                                    />
                                </div>
                            </Td>
                            <Td className="py-4">
                                <select
                                    className="block w-[5rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange(e, 'status')}
                                >
                                    <option value="">All</option>
                                    <option value="pending">Pending</option>
                                    <option value="asigned">Assigned</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </Td>
                        </Tr>
                        {
                            currentRows?.length !== 0 ? (
                                currentRows?.map((row: any, index: any) => {
                                    return (
                                        <Tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f7f7f7' : '#ffffff' }}>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm pl-4">{row.policyQuoteType}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.policyQuoteId}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.policyHolderName}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.policyHolderType}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{isLoading ? 'Loading...' : clientInfo[row.clientId]}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{!(row.document) ? <span className="bg-[#dde2de] rounded-[5px] px-[8px] py-[2px]">No File</span> : <span className="bg-[#a7e0b2] rounded-[5px] px-[8px] py-[2px]">Done</span>}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.amount}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.validDate}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.status == 'pending' ? <span className="bg-[#dde2de] rounded-[5px] px-[8px] py-[2px]">pending</span> : row.status == 'asigned' ? <span className="bg-[#e6e1a6] rounded-[5px] px-[8px] py-[2px]">assigned</span> : <span className="bg-[#a7e0b2] rounded-[5px] px-[8px] py-[2px]">paid</span>}</Td>
                                            <Td className='py-[10px] border-b border-[#e6e6e6] text-sm'>
                                                {
                                                    row.status === 'pending' ? (
                                                        <span className="inline-flex">
                                                            <button
                                                                className={"h-[28px] mr-2 rounded-[5px] bg-[#5bcf5b] text-white flex items-center py-[5px] px-[7px]"}
                                                                onClick={(e) => {
                                                                    setActiveData(row)
                                                                    setUpdateQuoteId(activeData?.id)
                                                                    handleOpenAssignModal(e);
                                                                }}
                                                            >
                                                                <span>assign</span>
                                                            </button>
                                                            <button
                                                                className={"h-[28px] rounded-[5px] bg-[#5c83d8] text-white flex items-center py-[5px] px-[7px] mr-[8px]"}
                                                                onClick={(e) => {
                                                                    setActiveData(row)
                                                                    handleOpenUpdateModal(e);
                                                                }}
                                                            >
                                                                <span>update</span>
                                                            </button>
                                                        </span>
                                                    ) : row.status === 'asigned' ? (
                                                        <span className="inline-flex">
                                                            <button
                                                                className={"h-[28px] rounded-[5px] bg-[#5c83d8] text-white flex items-center py-[5px] px-[7px] mr-[8px]"}
                                                                onClick={(e) => {
                                                                    setActiveData(row)
                                                                    handleOpenUpdateModal(e);
                                                                }}
                                                            >
                                                                <span>update</span>
                                                            </button>
                                                        </span>
                                                    ) : row.status === 'paid' && !(row.document) ? (
                                                        <span className="inline-block">
                                                            <button
                                                                className={"h-[28px] rounded-[5px] bg-[#cbccc7] text-[#06091b] items-center py-[5px] px-[7px] mb-[4px]"}
                                                                onClick={(e) => {
                                                                    setActiveData(row)
                                                                    handleOpenUploadModal(e);
                                                                }}
                                                            >
                                                                <span>upload</span>
                                                            </button>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-block">
                                                            <button
                                                                className={"h-[28px] rounded-[5px] bg-[#8ccc42] text-white flex items-center py-[5px] px-[7px] mb-[4px]"}
                                                                onClick={() => {
                                                                    handleDownload(row.id)
                                                                }}
                                                            >
                                                                <span>download</span>
                                                            </button>
                                                            <button
                                                                className={"h-[28px] rounded-[5px] bg-[#cf5e5e] text-white flex items-center py-[5px] px-[7px]"}
                                                                onClick={() => {
                                                                    handleDelete(row.id)
                                                                }}
                                                            >
                                                                <span>delete kyc</span>
                                                            </button>
                                                        </span>
                                                    )
                                                }

                                            </Td>
                                        </Tr>
                                    )
                                })
                            ) : (
                                <Tr style={{ backgroundColor: '#f7f7f7' }}>
                                    <Td className="py-[10px] border-b border-[#e6e6e6] text-sm pl-4"></Td>
                                    <Td className="py-[10px] border-b border-[#e6e6e6] text-sm"></Td>
                                    <Td className="py-[10px] border-b border-[#e6e6e6] text-sm"></Td>
                                    <Td className="py-[10px] border-b border-[#e6e6e6] text-start text-sm">No Record Found</Td>
                                    <Td className="py-[10px] border-b border-[#e6e6e6] text-sm"></Td>
                                    <Td className="py-[10px] border-b border-[#e6e6e6] text-sm"></Td>
                                    <Td className="py-[10px] border-b border-[#e6e6e6] text-sm"></Td>
                                    <Td className="py-[10px] border-b border-[#e6e6e6] text-sm"></Td>
                                    <Td className="py-[10px] border-b border-[#e6e6e6] text-sm"></Td>
                                    <Td className="py-[10px] border-b border-[#e6e6e6] text-sm"></Td>
                                </Tr>
                            )
                        }
                    </Tbody>
                </Table>

                <Pagination
                    size="sm"
                    color='success'
                    total={totalPages}
                    initialPage={currentPage}
                    onChange={(page) => setCurrentPage(page)}
                />

                <hr style={{ marginBottom: "1.5rem" }} />

                <Modal
                    open={openCreateModal}
                    onClose={handleCloseCreateModel}
                    aria-labelledby="parent-modal-title"
                    aria-describedby="parent-modal-description"
                >
                    <Box className="flex m-auto w-[40%] h-[100%] items-center justify-center">
                        <form
                            action=""
                            onSubmit={createNewClient}
                            className=" relative w-[100%] rounded-[5px] m-auto p-[10px] pt-[5px] bg-[#f0f0f0] "
                        >
                            <h1 className="text-center text-[#1b173f] font-bold text-[20px] m-[20px]">
                                Make Quotation
                            </h1>
                            <IoIcons.IoClose
                                className="absolute top-[20px] right-[20px] text-[35px] cursor-pointer"
                                onClick={handleCloseCreateModel}
                            />
                            <hr style={{ marginBottom: "4px" }} />
                            <div>
                                <input
                                    type="text"
                                    required
                                    name="policyQuoteType"
                                    placeholder="Policy Quote Type"
                                    value={policyQuoteType}
                                    onChange={(e) => {
                                        setPolicyQuoteType(e.target.value);
                                    }}
                                    className="bg-lime text-sm self-center rounded-[5px] h-[40px] my-[15px] mx-auto block border-[1px] border-[#a8a8a8]  px-[10px] w-[85%] focus:outline-none focus:shadow-md"
                                />
                            </div>
                            <div>
                                <input
                                    required
                                    type="number"
                                    name="policyQuoteId"
                                    placeholder="Policy Quote Id"
                                    value={policyQuoteId}
                                    onChange={(e) => {
                                        setPolicyQuoteId(e.target.value);
                                    }}
                                    className="bg-lime text-sm self-center rounded-[5px] h-[40px] my-[15px] mx-auto block border-[1px] border-[#a8a8a8]  px-[10px] w-[85%] focus:outline-none focus:shadow-md"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    required
                                    name="policyHolderType"
                                    placeholder="Policy Holder Type"
                                    value={policyHolderType}
                                    onChange={(e) => {
                                        setPolicyHolderType(e.target.value);
                                    }}
                                    className="bg-lime text-sm self-center rounded-[5px] h-[40px] my-[15px] mx-auto block border-[1px] border-[#a8a8a8]  px-[10px] w-[85%] focus:outline-none focus:shadow-md"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    required
                                    name="policyHolderName"
                                    placeholder="Policy Holder Name"
                                    value={policyHolderName}
                                    onChange={(e) => {
                                        setPolicyHolderName(e.target.value);
                                    }}
                                    className="bg-lime text-sm self-center rounded-[5px] h-[40px] my-[15px] mx-auto block border-[1px] border-[#a8a8a8]  px-[10px] w-[85%] focus:outline-none focus:shadow-md"
                                />
                            </div>
                            <div>
                                <div className="relative">
                                    {(!validDate) && (
                                        <div className="absolute inset-0 flex text-sm items-center justify-center pointer-events-none text-[#a8a8a8]">
                                            ~ Valid Date
                                        </div>
                                    )}
                                    <input
                                        type="date"
                                        required
                                        name="validDate"
                                        value={validDate}
                                        onChange={(e) => {
                                            setValidDate(e.target.value);
                                        }}
                                        className={`bg-lime text-sm self-center rounded-[5px] h-[40px] my-[15px] mx-auto block border-[1px] border-[#a8a8a8] px-[10px] w-[85%] focus:outline-none focus:shadow-md ${!validDate && 'text-[#a8a8a8]'}`}
                                    />

                                </div>
                            </div>
                            <div>
                                <input
                                    type="number"
                                    required
                                    name="amount"
                                    placeholder="Amount"
                                    min={100}
                                    value={amount}
                                    onChange={(e) => {
                                        setAmount(e.target.value);
                                    }}
                                    className="bg-lime text-sm self-center rounded-[5px] h-[40px] my-[15px] mx-auto block border-[1px] border-[#a8a8a8]  px-[10px] w-[85%] focus:outline-none focus:shadow-md"
                                />
                            </div>

                            <button
                                type="submit"
                                className="text-white text-sm font-[500] h-[35px] w-[90px] block rounded-[5px] mb-[15px] mx-[auto]"
                                style={{ background: "linear-gradient(270deg, #60b848 1.64%, #009677 98.36%)" }}
                            >
                                Save
                            </button>
                        </form>
                    </Box>
                </Modal>

                <Modal
                    open={openUpdateModal}
                    onClose={handleCloseUpdateModal}
                    aria-labelledby="parent-modal-title"
                    aria-describedby="parent-modal-description"
                >
                    <Box className="flex m-auto w-[40%] h-[100%] items-center justify-center">
                        <form
                            action=""
                            onSubmit={updateCycle}
                            className=" relative w-[100%] rounded-[5px] m-auto p-[10px] pt-[5px] bg-[#f0f0f0] "
                        >
                            <h1 className="text-center text-[#1b173f] font-bold text-[20px] m-[20px]">
                                Update Quotation
                            </h1>
                            <IoIcons.IoClose
                                className="absolute top-[20px] right-[20px] text-[35px] cursor-pointer"
                                onClick={handleCloseUpdateModal}
                            />
                            <hr style={{ marginBottom: "4px" }} />
                            <div>
                                <input
                                    type="text"
                                    required
                                    name="policyQuoteType"
                                    placeholder="Policy Quote Type"
                                    value={updatePolicyQuoteType}
                                    onChange={(e) => {
                                        setUpdatePolicyQuoteType(e.target.value);
                                    }}
                                    className="bg-lime text-sm self-center rounded-[5px] h-[40px] my-[15px] mx-auto block border-[1px] border-[#a8a8a8]  px-[10px] w-[85%] focus:outline-none focus:shadow-md"
                                />
                            </div>
                            <div>
                                <input
                                    required
                                    type="text"
                                    name="policyHolderType"
                                    placeholder="Policy Holder Type"
                                    value={updatePolicyHolderType}
                                    onChange={(e) => {
                                        setUpdatePolicyHolderType(e.target.value);
                                    }}
                                    className="bg-lime text-sm self-center rounded-[5px] h-[40px] my-[15px] mx-auto block border-[1px] border-[#a8a8a8]  px-[10px] w-[85%] focus:outline-none focus:shadow-md"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    required
                                    name="policyHolderName"
                                    placeholder="Policy Holder Name"
                                    value={updatePolicyHolderName}
                                    onChange={(e) => {
                                        setUpdatePolicyHolderName(e.target.value);
                                    }}
                                    className="bg-lime text-sm self-center rounded-[5px] h-[40px] my-[15px] mx-auto block border-[1px] border-[#a8a8a8]  px-[10px] w-[85%] focus:outline-none focus:shadow-md"
                                />
                            </div>
                            <div>
                                <div className="relative">
                                    {(!updateValidDate) && (
                                        <div className="absolute inset-0 flex text-sm items-center justify-center pointer-events-none text-[#a8a8a8]">
                                            ~ Valid Date
                                        </div>
                                    )}
                                    <input
                                        type="date"
                                        required
                                        name="updateValidDate"
                                        value={updateValidDate}
                                        onChange={(e) => {
                                            setUpdateValidDate(e.target.value);
                                        }}
                                        className={`bg-lime text-sm self-center rounded-[5px] h-[40px] my-[15px] mx-auto block border-[1px] border-[#a8a8a8] px-[10px] w-[85%] focus:outline-none focus:shadow-md ${!updateValidDate && 'text-[#a8a8a8]'}`}
                                    />

                                </div>
                            </div>
                            <div>
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="Amount"
                                    value={updateAmount}
                                    onChange={(e) => {
                                        setUpdateAmount(e.target.value);
                                    }}
                                    className="bg-lime text-sm self-center rounded-[5px] h-[40px] my-[15px] mx-auto block border-[1px] border-[#a8a8a8]  px-[10px] w-[85%] focus:outline-none focus:shadow-md"
                                />
                            </div>

                            <button
                                type="submit"
                                className="text-white text-sm font-[500] h-[35px] w-[90px] block rounded-[5px] mb-[15px] mx-[auto]"
                                style={{ background: "linear-gradient(270deg, #60b848 1.64%, #009677 98.36%)" }}
                            >
                                Save
                            </button>
                        </form>
                    </Box>
                </Modal>

                <Modal
                    open={openAssignModal}
                    onClose={handleCloseAssignModal}
                    aria-labelledby="parent-modal-title"
                    aria-describedby="parent-modal-description"
                >
                    <Box className="flex m-auto w-[35%] h-[100%] items-center justify-center">
                        <form
                            action=""
                            onSubmit={handleAssignClient}
                            className="relative rounded-[5px] w-[100%] m-auto p-[10px] dark:bg-dark-bg bg-[#f0f0f0] "
                        >
                            <h1 className="text-center text-[#1b173f] font-bold text-[20px] m-[20px]">
                                Assign Client to Quotation
                            </h1>
                            <IoIcons.IoClose
                                style={{
                                    position: "absolute",
                                    top: "20px",
                                    right: "20px",
                                    fontSize: "35px",
                                    cursor: "pointer",
                                }}
                                onClick={handleCloseAssignModal}
                            />
                            <hr style={{ marginBottom: "40px" }} />
                            <Select
                                className="sm:text-sm w-[60%] mx-auto"
                                options={clientOptions}
                                defaultValue={{ value: "", label: "Search Client" }}
                                onChange={(e) => setAssignedClient(`${e?.value}`)}
                                theme={customTheme}
                            />

                            <div className="flex flex-wrap w-[300px] mx-auto mt-[20px]">
                                <button
                                    className="text-white border-[1px] h-[40px] w-[100px] block rounded-[5px] my-[10px] mx-[auto]"
                                    style={{ background: "linear-gradient(270deg, #60b848 1.64%, #009677 98.36%)" }}
                                    type="submit"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </Box>
                </Modal>

                <Modal
                    open={openUploadModal}
                    onClose={handleCloseUploadModal}
                    aria-labelledby="parent-modal-title"
                    aria-describedby="parent-modal-description"
                >
                    <Box className="flex m-auto w-[35%] h-[100%] items-center justify-center">
                        <form
                            action=""
                            onSubmit={handleUploadFile}
                            className="relative rounded-[5px] w-[100%] m-auto p-[10px] dark:bg-dark-bg bg-[#f0f0f0] "
                        >
                            <h1 className="text-center text-[#1b173f] font-bold text-[20px] m-[20px]">
                                Upload KYC
                            </h1>
                            <IoIcons.IoClose
                                style={{
                                    position: "absolute",
                                    top: "20px",
                                    right: "20px",
                                    fontSize: "35px",
                                    cursor: "pointer",
                                }}
                                onClick={handleCloseUploadModal}
                            />
                            <hr style={{ marginBottom: "40px" }} />
                            <input
                                type="file"
                                name="file"
                                accept="application/pdf"
                                onChange={(e) => {
                                    const file = e?.target.files?.[0];
                                    setKycFile(file || null);
                                }}

                                className=" mt-2 bg-lime text-[16px] self-center py-1 rounded-[5px] h-[40px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%] focus:outline-none focus:shadow-md"
                            />

                            <div className="flex flex-wrap w-[300px] mx-auto mt-[20px]">
                                <button
                                    className="text-white border-[1px] h-[40px] w-[100px] block rounded-[5px] my-[10px] mx-[auto]"
                                    style={{ background: "linear-gradient(270deg, #60b848 1.64%, #009677 98.36%)" }}
                                    type="submit"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </Box>
                </Modal>

            </div>
        </>
    );
};

export default Quote;
