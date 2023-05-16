import Adminbar from "@/components/layout/AdminNav";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import * as BsIcons from "react-icons/bs";
import * as IoIcons from "react-icons/io5";
import { Pagination } from '@nextui-org/react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import handleExportData from "@/components/utils/ExportExcel";
import { useRef } from 'react';
import { exportToPDF } from "@/components/utils/ExportPDF";
import { printTable } from "@/components/utils/Print";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const QuoteReport = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [reportEmail, setReportEmail] = useState("")
    const [openSendEmailModal, setOpenSendEmailModal] = useState(false)
    const tableRef = useRef(null);

    const handleCloseSendEmailModal = () => {
        setOpenSendEmailModal(false);
    }
    const handleOpenSendEmailModal = () => {
        setOpenSendEmailModal(true);
    }
    const handleSendEmailReport = () => {
        return;
    }

    const token = Cookies.get("token");

    const getAllQuotes = async () => {
        try {
            const dt = await fetch("http://212.71.245.100:5000/quatation/", {
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

    console.log("filteredData", filteredData)

    // Get one client ==========
    const getOneClient = async (id: any) => {
        try {
            const dt = await fetch(`http://212.71.245.100:5000/client/${id}`, {
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
                    <h4 className="font-[500] text-[16px] mb-6">Quotation Report</h4>
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
                </div>
                <div className='flex justify-end'>
                    <button
                        className={" h-[35px] rounded-l-[5px] text-[#1b173f] flex items-center bg-[#cac8c8] pr-[10px] pl-[5px] mb-[20px]"}
                        onClick={() => printTable(tableRef)}
                    >
                        <BsIcons.BsPrinterFill className="mx-[5px]" />
                        <span className="text-sm">Print</span>
                    </button>
                    <button
                        className={" h-[35px] text-white flex items-center bg-[#dd5959] pr-[10px] pl-[5px] mb-[20px]"}
                        onClick={() => exportToPDF(tableRef)}
                    >
                        <BsIcons.BsFilePdfFill className="mx-[5px]" />
                        <span className="text-sm">PDF</span>
                    </button>
                    <button
                        className={" h-[35px] text-white flex items-center bg-[#48b857] pr-[10px] pl-[5px] mb-[20px]"}
                        onClick={(e) => {
                            e.preventDefault();
                            handleExportData(filteredData, 'quote')
                        }}
                    >
                        <BsIcons.BsFileExcelFill className="mx-[5px]" />
                        <span className="text-sm">Excel</span>
                    </button>
                    <button
                        className={" h-[35px] rounded-r-[5px] text-white flex items-center bg-[#8c70db] pr-[10px] pl-[5px] mb-[20px] mr-[10px]"}
                        onClick={handleOpenSendEmailModal}
                    >
                        <BsIcons.BsEnvelopeOpen className="mx-[5px]" />
                        <span className="text-sm">Send By Email</span>
                    </button>
                </div>

                <Table ref={tableRef} className="mb-10 text-[#06091b]">
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
                                </Tr>
                            )


                        }
                    </Tbody>
                </Table>

                <Modal
                    open={openSendEmailModal}
                    onClose={handleCloseSendEmailModal}
                    aria-labelledby="parent-modal-title"
                    aria-describedby="parent-modal-description"
                >
                    <Box className="flex m-auto w-[35%] h-[100%] items-center justify-center">
                        <form
                            action=""
                            onSubmit={handleSendEmailReport}
                            className="relative rounded-[5px] w-[100%] m-auto p-[10px] dark:bg-dark-bg bg-[#f0f0f0] "
                        >
                            <h1 className="text-center text-[#1b173f] font-bold text-[20px] m-[20px]">
                                Send Report to Email
                            </h1>
                            <IoIcons.IoClose
                                style={{
                                    position: "absolute",
                                    top: "20px",
                                    right: "20px",
                                    fontSize: "35px",
                                    cursor: "pointer",
                                }}
                                onClick={handleCloseSendEmailModal}
                            />
                            <hr style={{ marginBottom: "40px" }} />
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="Please enter your email"
                                value={reportEmail}
                                onChange={(e) => {
                                    setReportEmail(e.target.value);
                                }}
                                className="bg-lime text-sm self-center rounded-[5px] h-[40px] my-[15px] mx-auto block border-[1px] border-[#a8a8a8]  px-[10px] w-[85%] focus:outline-none focus:shadow-md"
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

                <Pagination
                    size="sm"
                    color='success'
                    total={totalPages}
                    initialPage={currentPage}
                    onChange={(page) => setCurrentPage(page)}
                />
                <hr style={{ marginBottom: "1.5rem" }} />
            </div >
        </>
    );
};

export default QuoteReport;
