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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    const [loading, setLoading] = useState(true);

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [policyQuoteType, setPolicyQuoteType] = useState("");
    const [policyQuoteId, setPolicyQuoteId] = useState("");
    const [policyHolderType, setPolicyHolderType] = useState("");
    const [policyHolderName, setPolicyHolderName] = useState("");
    const [doc, setDoc] = useState("");
    const [validDate, setValidDate] = useState("");
    const [amount, setAmount] = useState("");

    const [openUpdateModal, setOpenUpdateModel] = useState(false);
    const [openUploadModal, setOpenUploadModel] = useState(false);
    const [kycFile, setKycFile] = useState<File | null>(null);
    const [updatePolicyQuoteType, setUpdatePolicyQuoteType] = useState("")
    const [updatePolicyHolderType, setUpdatePolicyHolderType] = useState("")
    const [updatePolicyHolderName, setUpdatePolicyHolderName] = useState("")
    const [updateDoc, setUpdateDoc] = useState("")
    const [updateValidDate, setUpdateValidDate] = useState("")
    const [updateAmount, setUpdateAmount] = useState("")
    const [openAssignModal, setOpenAssignModel] = useState(false);
    const [assignedClient, setAssignedClient] = useState("");
    const [clientData, setClientData] = useState([]);
    const [oneClient, setOneClientData] = useState("");

    const [activeData, setActiveData] = useState<any | undefined>({});
    const [updateQuoteId, setUpdateQuoteId] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10)


    const token = Cookies.get("token");

    const getAllQuotes = async () => {
        try {
            const dt = await fetch("http://178.79.172.122:5000/quatation/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const response = await dt.json();
            setData(response?.data)
            console.log("response quote", response)
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getAllQuotes()
        getAllClients()
    }, [])

    const [filters, setFilters] = useState({
        dateStart: '',
        dateEnd: '',
        policyQuoteType: '',
        policyQuoteId: '',
        policyHolderType: '',
        policyHolderName: '',
        document: '',
        validDate: '',
        status: '',
        amount: '',
        clientId: ''
    });

    const handleFilterChange = (e, columnId) => {
        setFilters({ ...filters, [columnId]: e.target.value });
    };

    const filteredData = data?.filter((row: any) => {
        const date = new Date(row.createdAt);
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

        const validDateMatch = row.validDate
            .toLowerCase()
            .includes(filters.validDate.toLowerCase());

        const documentMatch = row.document?.toLowerCase()
            .includes(filters.document.toLowerCase());

        const policyQuoteIdMatch = row.policyQuoteId
            .toLowerCase()
            .includes(filters.policyQuoteId.toLowerCase());

        const policyHolderNameMatch = row.policyHolderName
            .toLowerCase()
            .includes(filters.policyHolderName.toLowerCase());

        const statusMatch = row.status
            .toLowerCase()
            .includes(filters.status.toLowerCase());

        const clientIdMatch = row.clientId?.toLowerCase()
            .includes(filters.clientId.toLowerCase());

        return (
            isDateInRange &&
            policyHolderTypeMatch &&
            amountMatch &&
            policyQuoteTypeMatch &&
            validDateMatch &&
            policyQuoteIdMatch &&
            policyHolderNameMatch &&
            statusMatch &&
            clientIdMatch &&
            documentMatch
        );
    });

    console.log("filteredData quote", filteredData)

    // Create client ===============

    const handleOpenCreateClient = () => {
        setOpenCreateModal(true);
    };
    const handleCloseCreateModel = () => {
        setOpenCreateModal(false);
    };
    const createClient = async (data: any) => {
        try {
            const dt = await fetch("http://178.79.172.122:5000/quatation/", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const response = await dt.json();
            console.log("response create quote", response)
        } catch (error) {
            console.error(error);
        }
    };

    const createNewClient = (e: any) => {
        e.preventDefault()
        const quoteData = {
            policyQuoteType: policyQuoteType,
            policyQuoteId: policyQuoteId,
            policyHolderType: policyHolderType,
            policyHolderName: policyHolderName,
            document: doc,
            validDate: validDate,
            amount: amount
        };
        createClient(quoteData);
        setOpenCreateModal(false);
    };

    // Assigning client ==========
    const getOneClient = async (id: any) => {
        try {
            const dt = await fetch(`http://178.79.172.122:5000/client/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const response = await dt.json();
            const clientIdentity: any = `${response?.data?.sName} | ${response?.data?.pNnumber} `

            console.log("response", response)
            return clientIdentity;
        } catch (error) {
            console.error(error);
        }
    }
    const getAllClients = async () => {
        try {
            const dt = await fetch("http://178.79.172.122:5000/client/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const response = await dt.json();
            setClientData(response?.data)
            console.log("response", response)
            return response;
        } catch (error) {
            console.error(error);
        }
    }
    console.log("clientData", clientData)
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
            const dt = await fetch(`http://178.79.172.122:5000/quatation/asign/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });
            console.log("response assign data", data)
            console.log("response assign id", id)
            const response = await dt.json();
            console.log("response assign", response)

        } catch (error) {
            console.error(error);
        }
    };

    const handleAssignClient = (e: any) => {
        e.preventDefault();

        const assignData = {
            clientId: assignedClient
        };
        assignClient(assignData, updateQuoteId);

        setOpenAssignModel(false);
    };

    // upload kyc
    const handleOpenUploadModal = (e: any) => {
        setOpenUploadModel(true);

        setUpdateQuoteId(activeData?.id);
    };
    const handleCloseUploadModal = (e: any) => {
        e.preventDefault();
        setOpenUploadModel(false);
    };
    const handleUploadFile = (e: any) => {
        e.preventDefault();

        if (kycFile) {
            const formData = new FormData();
            formData.append('file', kycFile);

            uploadFile(formData, updateQuoteId);
        }

        setKycFile(null)
        setOpenUploadModel(false);

    };
    const uploadFile = async (data: any, id: any) => {
        try {
            const dt = await fetch(`http://178.79.172.122:5000/files/upload?quoteId=${id}`, {
                method: "POST",
                body: data,
                headers: {
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
            });
            const response = await dt.json();
            console.log("response", response)
            if (response.status == "success") {
                toast.success("KYC added successfully!")
            } else {
                toast.error(response?.detail)
            }

        } catch (error:any) {
            console.error(error);
            toast.error(error.message)
        }
    };

    // Download kyc
    const downloadFile = async (id: any) => {
        try {
            const dt = await fetch(`http://178.79.172.122:5000/files/download?quoteId=${id}`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
            });
            const response = await dt.json();
            console.log("response download", response)
            if (response.status == "success") {
                toast.success("KYC added successfully!")
            } else {
                toast.error(response?.detail)
            }

        } catch (error:any) {
            console.error(error);
            toast.error(error.message)
        }
    };
    // delete kyc
    const deleteFile = async (id: any) => {
        try {
            const dt = await fetch(`http://178.79.172.122:5000/files/?filename=${id}`, {
                method: "DELETE",
                headers: {
                    'Accept': 'application/json',
                    "Authorization": `Bearer ${token}`,
                },
            });
            const response = await dt.json();
            console.log("response delete", response)
            if (response.status == "success") {
                toast.success("KYC deleted successfully!")
            } else {
                toast.error(response?.detail)
            }

        } catch (error:any) {
            console.error(error);
            toast.error(error.message)
        }
    };

    // update quote ===========

    const handleOpenUpdateModal = (e: any) => {
        setOpenUpdateModel(true);
        setUpdatePolicyQuoteType(activeData?.policyQuoteType)
        setUpdatePolicyHolderType(activeData?.policyHolderType)
        setUpdatePolicyHolderName(activeData?.policyHolderName)
        setUpdateDoc(activeData?.document)
        setUpdateValidDate(activeData?.validDate)
        setUpdateAmount(activeData?.amount)

        setUpdateQuoteId(activeData?.id);
    };

    const handleCloseUpdateModal = (e: any) => {
        e.preventDefault();
        setOpenUpdateModel(false);
    };

    const updateClient = async (data: any, id) => {
        try {
            const dt = await fetch(`http://178.79.172.122:5000/quatation/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const response = await dt.json();
            console.log("response", response)
        } catch (error) {
            console.error(error);
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
        updateClient(updateData, updateQuoteId);

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
            <ToastContainer
                autoClose={2000}
                hideProgressBar={true}
                closeOnClick
                pauseOnHover
                style={{ width: "300px", height: "100px" }}
            />
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
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Client ID</Th>
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
                                <input
                                    className="block w-[4rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                    type="text"
                                    value={filters.document}
                                    onChange={(e) => handleFilterChange(e, 'document')}
                                />
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
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.clientId}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.document}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.amount}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.validDate}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.status == 'pending' ? <span className="bg-[#dde2de] rounded-[5px] px-[8px] py-[2px]">pending</span> : row.status == 'asigned' ? <span className="bg-[#e6e1a6] rounded-[5px] px-[8px] py-[2px]">assigned</span> : <span className="bg-[#a7e0b2] rounded-[5px] px-[8px] py-[2px]">paid</span>}</Td>
                                            <Td className='py-[10px] border-b border-[#e6e6e6] text-sm'>
                                                {
                                                    row.status !== 'paid' ? (
                                                        <span className="inline-flex">
                                                            <button
                                                                className={" h-[28px] mr-2   rounded-[5px] bg-[#5bcf5b] text-white flex items-center py-[5px] px-[7px]"}
                                                                onClick={(e) => {
                                                                    setUpdateQuoteId(row.id)
                                                                    handleOpenAssignModal(e);
                                                                }}
                                                            >
                                                                <span>assign</span>
                                                            </button>
                                                            <button
                                                                className={" h-[28px] rounded-[5px] bg-[#5c83d8] text-white flex items-center py-[5px] px-[7px] mr-[8px]"}
                                                                onClick={(e) => {
                                                                    setActiveData(row)
                                                                    handleOpenUpdateModal(e);
                                                                }}
                                                            >
                                                                <span>update</span>
                                                            </button>

                                                        </span>
                                                    ) : (
                                                        <span className="inline-block">
                                                            <button
                                                                className={" h-[28px] rounded-[5px] bg-[#cbccc7] text-[#06091b] flex items-center py-[5px] px-[7px] mb-[4px]"}
                                                                onClick={(e) => {
                                                                    setActiveData(row)
                                                                    handleOpenUploadModal(e);
                                                                }}
                                                            >
                                                                <span>upload</span>
                                                            </button>
                                                            <button
                                                                className={" h-[28px] rounded-[5px] bg-[#8ccc42] text-white flex items-center py-[5px] px-[7px] mb-[4px]"}
                                                                onClick={() => {
                                                                    downloadFile(row.id)
                                                                }}
                                                            >
                                                                <span>download</span>
                                                            </button>
                                                            <button
                                                                className={" h-[28px] rounded-[5px] bg-[#cf5e5e] text-white flex items-center py-[5px] px-[7px]"}
                                                                onClick={() => {
                                                                    deleteFile(row.id)
                                                                }}
                                                            >
                                                                <span>delete</span>
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
                    <Box className="flex m-auto w-[50%] h-[100%] items-center justify-center">
                        <form
                            action=""
                            onSubmit={createNewClient}
                            className="relative w-[100%] rounded-[5px] m-auto p-[10px] pt-[5px] dark:bg-dark-bg bg-[#f0f0f0] "
                        >
                            <h1 className="text-center font-bold dark:text-white text-[20px] m-[20px]">
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
                                    name="policyQuoteType"
                                    placeholder="Policy Quote Type"
                                    value={policyQuoteType}
                                    onChange={(e) => {
                                        setPolicyQuoteType(e.target.value);
                                    }}
                                    className=" mt-2 bg-lime text-[16px] self-center py-1 rounded-[5px] h-[40px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%] focus:outline-none focus:shadow-md"
                                />
                            </div>
                            <div>
                                <input
                                    type="number"
                                    name="policyQuoteId"
                                    placeholder="Policy Quote Id"
                                    value={policyQuoteId}
                                    onChange={(e) => {
                                        setPolicyQuoteId(e.target.value);
                                    }}
                                    className=" mt-2 bg-lime text-[16px] self-center py-1 rounded-[5px] h-[40px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%] focus:outline-none focus:shadow-md"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="policyHolderType"
                                    placeholder="Policy Holder Type"
                                    value={policyHolderType}
                                    onChange={(e) => {
                                        setPolicyHolderType(e.target.value);
                                    }}
                                    className=" mt-2 bg-lime text-[16px] self-center py-1 rounded-[5px] h-[40px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%] focus:outline-none focus:shadow-md"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="policyHolderName"
                                    placeholder="Policy Holder Name"
                                    value={policyHolderName}
                                    onChange={(e) => {
                                        setPolicyHolderName(e.target.value);
                                    }}
                                    className=" mt-2 bg-lime text-[16px] self-center py-1 rounded-[5px] h-[40px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%] focus:outline-none focus:shadow-md"
                                />
                            </div>
                            <div>
                                <input
                                    type="date"
                                    name="validDate"
                                    defaultValue="Valid Date"
                                    min={new Date().toISOString().split("T")[0]}
                                    value={validDate}
                                    onChange={(e) => {
                                        setValidDate(e.target.value);
                                    }}
                                    className=" mt-2 bg-lime text-[16px] self-center py-1 rounded-[5px] h-[40px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%] focus:outline-none focus:shadow-md"
                                />
                            </div>
                            <div>
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="Amount"
                                    value={amount}
                                    onChange={(e) => {
                                        setAmount(e.target.value);
                                    }}
                                    className=" mt-2 bg-lime text-[16px] self-center py-1 rounded-[5px] h-[40px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%] focus:outline-none focus:shadow-md"
                                />
                            </div>

                            <button
                                type="submit"
                                className="text-white border-[1px] border-[#a8a8a8] dark:bg-[#56C870] h-[40px] w-[100px] block rounded-[5px] my-[10px] mx-[auto] bg-[#173b3f]"
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
                    <Box className="flex m-auto w-[50%] h-[100%] items-center justify-center">
                        <form
                            action=""
                            onSubmit={updateCycle}
                            className="relative rounded-[5px] w-[100%] m-auto p-[10px] pt-[5px] dark:bg-dark-bg bg-[#f0f0f0] "
                        >
                            <h1 className="text-center dark:text-white font-bold text-[22px] m-[20px]">
                                Update Quotation
                            </h1>
                            <IoIcons.IoClose
                                style={{
                                    position: "absolute",
                                    top: "20px",
                                    right: "20px",
                                    fontSize: "35px",
                                    cursor: "pointer",
                                }}
                                onClick={handleCloseUpdateModal}
                            />
                            <hr style={{ marginBottom: "40px" }} />
                            <input
                                type="text"
                                name="policyQuoteType"
                                placeholder="Policy Quote Type"
                                value={updatePolicyQuoteType}
                                onChange={(e) => {
                                    setUpdatePolicyQuoteType(e.target.value);
                                }}
                                className=" mt-3 bg-lime text-[16px] self-center py-1 rounded-[5px] h-[40px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%] focus:outline-none focus:shadow-md"
                            />
                            <input
                                type="text"
                                name="policyHolderType"
                                placeholder="Policy Holder Type"
                                value={updatePolicyHolderType}
                                onChange={(e) => {
                                    setUpdatePolicyHolderType(e.target.value);
                                }}
                                className=" mt-3 bg-lime text-[16px] self-center py-1 rounded-[5px] h-[40px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%] focus:outline-none focus:shadow-md"
                            />
                            <input
                                type="text"
                                name="policyHolderName"
                                placeholder="Policy Holder Name"
                                value={updatePolicyHolderName}
                                onChange={(e) => {
                                    setUpdatePolicyHolderName(e.target.value);
                                }}
                                className=" mt-3 bg-lime text-[16px] self-center py-1 rounded-[5px] h-[40px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%] focus:outline-none focus:shadow-md"
                            />
                            <input
                                type="date"
                                name="validDate"
                                placeholder="Valid Date"
                                value={updateValidDate}
                                onChange={(e) => {
                                    setUpdateValidDate(e.target.value);
                                }}
                                className=" mt-3 bg-lime text-[16px] self-center py-1 rounded-[5px] h-[40px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%] focus:outline-none focus:shadow-md"
                            />
                            <input
                                type="text"
                                name="amount"
                                placeholder="Amount"
                                value={updateAmount}
                                onChange={(e) => {
                                    setUpdateAmount(e.target.value);
                                }}
                                className=" mt-3 bg-lime text-[16px] self-center py-1 rounded-[5px] h-[40px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%] focus:outline-none focus:shadow-md"
                            />

                            <div className="flex flex-wrap w-[300px] m-auto">
                                <button
                                    className="text-white border-[1px] dark:bg-[#56C870] h-[40px] w-[100px] block rounded-[5px] my-[10px] mx-[auto] bg-[#173b3f]"
                                    type="submit"
                                >
                                    Save
                                </button>
                            </div>
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
                            <h1 className="text-center dark:text-white font-bold text-[24px] m-[20px]">
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
                                    className="text-white border-[1px] dark:bg-[#56C870] h-[40px] w-[100px] block rounded-[5px] my-[10px] mx-[auto] bg-[#173b3f]"
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
                            <h1 className="text-center dark:text-white font-bold text-[24px] m-[20px]">
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
                                name="kyc"
                                onChange={(e) => {
                                    const file = e?.target.files?.[0];
                                    setKycFile(file || null);
                                }}

                                className=" mt-2 bg-lime text-[16px] self-center py-1 rounded-[5px] h-[40px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%] focus:outline-none focus:shadow-md"
                            />

                            <div className="flex flex-wrap w-[300px] mx-auto mt-[20px]">
                                <button
                                    className="text-white border-[1px] dark:bg-[#56C870] h-[40px] w-[100px] block rounded-[5px] my-[10px] mx-[auto] bg-[#173b3f]"
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
