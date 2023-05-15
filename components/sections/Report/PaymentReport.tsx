import Adminbar from "@/components/layout/AdminNav";
import Footer from "@/components/layout/Footer";
import { Icon } from "@iconify/react";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import * as AiIcons from "react-icons/ai";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import * as IoIcons from "react-icons/io5";
import * as BsIcons from "react-icons/bs";
import { Pagination } from '@nextui-org/react';

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

const PaymentReport = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enteredWord, setEnteredWord] = useState("");
    const [enteredsubmitWord, setenteredsubmitWord] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [msisdn, setMsisdn] = useState("");
    const [amount, setAmount] = useState("");
    const [gtwRef, setGtwRef] = useState("");

    const [openMakeModal, setOpenMakeModal] = useState(false);
    const [policyQuoteId, setPolicyQuoteId] = useState("")

    const [openUpdateModal, setOpenUpdateModel] = useState(false);
    const [updateFirstName, setUpdateFirstName] = useState("")
    const [updateLastName, setUpdateLastName] = useState("")
    const [activeCycle, setActiveCycle] = useState<number | undefined>(undefined);
    const [activeData, setActiveData] = useState<any | undefined>({});
    const [updateClientId, setUpdateClientId] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10)


    const token = Cookies.get("token");

    const handleStartDateChange = (date) => {
        setStartDate(date);
        if (endDate < date) {
            setEndDate(date);
        }
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        if (date < startDate) {
            setStartDate(date);
        }
    };

    const getAllPayment = async () => {
        try {
            const dt = await fetch("http://178.79.172.122:5000/payment/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const response = await dt.json();
            setData(response.data)
            console.log("response", response)
            return response;
        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        getAllPayment()
    }, [])

    const [filters, setFilters] = useState({
        dateStart: '',
        dateEnd: '',
        amount: '',
        pNnumber: '',
        gtwRef: '',
        quoteId: '',
        status: '',
        createdAt: ''
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

        const amountTypeMatch = row.amount.toString()
            .toLowerCase()
            .includes(filters.amount.toLowerCase());

        const pNnumberMatch = row.pNnumber
            .toLowerCase()
            .includes(filters.pNnumber.toLowerCase());

        const gtwRefMatch = row.gtwRef
            .toLowerCase()
            .includes(filters.gtwRef.toLowerCase());

        const quoteIdMatch = row.quoteId
            .toLowerCase()
            .includes(filters.quoteId.toLowerCase());

        const statusMatch = row.status
            .toLowerCase()
            .includes(filters.status.toLowerCase());

        return (
            isDateInRange &&
            amountTypeMatch &&
            pNnumberMatch &&
            gtwRefMatch &&
            quoteIdMatch &&
            quoteIdMatch &&
            statusMatch
        );
    });

    console.log("filteredData", filteredData)

    const numData = filteredData?.length

    // Make Payment
    const handleOpenMakeClient = () => {
        setOpenMakeModal(true);
    };

    const handleCloseMakeModel = () => {
        setOpenMakeModal(false);
    };
    const createMakePayment = async (id: any) => {
        try {
            const dt = await fetch(`http://178.79.172.122:5000/payment/make/?policyQuoteId=${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const response = await dt.json();
            console.log("Pay", response)
        } catch (error) {
            console.error(error);
        }
    };

    // Send Payment ===============

    const handleOpenCreateClient = () => {
        setOpenCreateModal(true);
    };
    const handleCloseCreateModel = () => {
        setOpenCreateModal(false);
    };
    const createClient = async (data: any) => {
        try {
            const dt = await fetch("http://178.79.172.122:5000/payment/pay/", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const response = await dt.json();
            console.log("Pay", response)
        } catch (error) {
            console.error(error);
        }
    };

    const createNewClient = (e: any) => {
        e.preventDefault()
        const payData = {
            msisdn: msisdn,
            amount: amount,
            gtwRef: gtwRef
        }
        createClient(payData);
        setOpenCreateModal(false);

        // setTimeout(() => {
        //   window.location.reload();
        // }, 3000);
    };

    // update client ===========

    const handleOpenUpdateModal = (e: any) => {
        setOpenUpdateModel(true);
        setUpdateFirstName(activeData?.fName);
        setUpdateLastName(activeData?.sName);

        setUpdateClientId(activeData?.id);
    };

    const handleCloseUpdateModal = (e: any) => {
        e.preventDefault();
        setOpenUpdateModel(false);
    };

    const updateClient = async (data: any, id) => {
        try {
            const dt = await fetch(`http://178.79.172.122:5000/client/${id}`, {
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
            first_name: updateFirstName,
            last_name: updateLastName,
        };
        updateClient(updateData, updateClientId);

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
            <div className="mt-[7rem] ml-[18rem] mr-7 mb-4 bg-white p-6 rounded-md">
                <div>
                    <h4 className="font-[500] text-[16px] mb-6">Payment Report</h4>
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
                        onClick={() => ""}
                    >
                    <BsIcons.BsPrinterFill className="mx-[5px]" />
                        <span className="text-sm">Print</span>
                    </button>
                    <button
                        className={" h-[35px] text-white flex items-center bg-[#dd5959] pr-[10px] pl-[5px] mb-[20px]"}
                        onClick={() => ""}
                    >
                    <BsIcons.BsFilePdfFill className="mx-[5px]" />
                        <span className="text-sm">PDF</span>
                    </button>
                    <button
                        className={" h-[35px] text-white flex items-center bg-[#48b857] pr-[10px] pl-[5px] mb-[20px]"}
                        onClick={() => ""}
                    >
                    <BsIcons.BsFileExcelFill className="mx-[5px]" />
                        <span className="text-sm">Excel</span>
                    </button>
                    <button
                        className={" h-[35px] rounded-r-[5px] text-white flex items-center bg-[#8c70db] pr-[10px] pl-[5px] mb-[20px] mr-[10px]"}
                        onClick={() => ""}
                    >
                    <BsIcons.BsEnvelopeOpen className="mx-[5px]" />
                        <span className="text-sm">Send By Email</span>
                    </button>
                </div>

                <Table className="mb-10 text-[#06091b]">
                    <Thead className="">
                        <Tr>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0] pl-4">Creation Date</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Phone Number</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Amount</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Quotation ID</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Gateway Reference</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Status</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        <Tr className="border-b border-[#888787]">
                            <Td className="py-4">
                                <div>
                                    <input
                                        className="block ml-4 w-[6rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 mb-2 focus:outline-none focus:shadow-sm text-sm"
                                        type="date"
                                        value={filters.dateStart}
                                        onChange={(e) => handleFilterChange(e, 'dateStart')}
                                    />
                                    <input
                                        className="block ml-4 w-[6rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                        type="date"
                                        value={filters.dateEnd}
                                        onChange={(e) => handleFilterChange(e, 'dateEnd')}
                                    />
                                </div>
                            </Td>
                            <Td className="py-4">
                                <input
                                    className="block w-[6rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                    type="text"
                                    value={filters.pNnumber}
                                    onChange={(e) => handleFilterChange(e, 'pNnumber')}
                                />
                            </Td>
                            <Td className="py-4">
                                <input
                                    className="block w-[6rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                    type="text"
                                    value={filters.amount}
                                    onChange={(e) => handleFilterChange(e, 'amount')}
                                />
                            </Td>
                            <Td className="py-4">
                                <input
                                    className="block w-[8rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                    type="text"
                                    value={filters.quoteId}
                                    onChange={(e) => handleFilterChange(e, 'quoteId')}
                                />
                            </Td>
                            <Td className="py-4">
                                <input
                                    className="block w-[8rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                    type="text"
                                    value={filters.gtwRef}
                                    onChange={(e) => handleFilterChange(e, 'gtwRef')}
                                />
                            </Td>
                            <Td className="py-4">
                                <select
                                    className="block w-[4rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange(e, 'status')}
                                >
                                    <option value="">All</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                    <option value="success">Sent</option>
                                </select>
                            </Td>
                        </Tr>
                        {
                            currentRows?.length !== 0 ? (
                                currentRows?.map((row: any, index: any) => {
                                    return (
                                        <Tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f7f7f7' : '#ffffff' }}>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm pl-4">{row.createdAt}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.pNnumber}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.amount}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.quoteId}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.gtwRef}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.status == 'pending' ? <span className="bg-[#dde2de] rounded-[5px] px-[8px] py-[2px]">pending</span> : row.status == 'failed' ? <span className="bg-[#e6a8a6] rounded-[5px] px-[8px] py-[2px]">failed</span> : <span className="bg-[#a7e0b2] rounded-[5px] px-[8px] py-[2px]">sent</span>}</Td>
                                        </Tr>
                                    )
                                })
                            ) : (
                                <Tr style={{ backgroundColor: '#f7f7f7' }}>
                                    <Td className="py-[10px] border-b border-[#e6e6e6] text-sm pl-4"></Td>
                                    <Td className="py-[10px] border-b border-[#e6e6e6] text-sm"></Td>
                                    <Td className="py-[10px] border-b border-[#e6e6e6] text-end text-sm">No Record Found</Td>
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
                            <h1 className="text-center font-bold dark:text-white text-[22px] m-[20px]">
                                Send Payment
                            </h1>
                            <IoIcons.IoClose
                                className="absolute top-[20px] right-[20px] text-[35px] cursor-pointer"
                                onClick={handleCloseCreateModel}
                            />
                            <hr style={{ marginBottom: "4px" }} />
                            <div>
                                <input
                                    type="text"
                                    name="msisdn"
                                    placeholder="Phone Number"
                                    value={msisdn}
                                    onChange={(e) => {
                                        setMsisdn(e.target.value);
                                    }}
                                    className=" mt-2 bg-lime cursor-pointer text-[18px] self-center py-1 rounded-[5px] h-[50px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%] focus:outline-none focus:shadow-md"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="amount"
                                    placeholder="Amount"
                                    value={amount}
                                    onChange={(e) => {
                                        setAmount(e.target.value);
                                    }}
                                    className=" mt-2 bg-lime cursor-pointer text-[18px] self-center py-1 rounded-[5px] h-[50px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%] focus:outline-none focus:shadow-md"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="gtwRef"
                                    placeholder="Gateway Reference"
                                    value={gtwRef}
                                    onChange={(e) => {
                                        setGtwRef(e.target.value);
                                    }}
                                    className=" mt-2 bg-lime cursor-pointer text-[18px] self-center py-1 rounded-[5px] h-[50px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%] focus:outline-none focus:shadow-md"
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
                    open={openMakeModal}
                    onClose={handleCloseMakeModel}
                    aria-labelledby="parent-modal-title"
                    aria-describedby="parent-modal-description"
                >
                    <Box className="flex m-auto w-[40%] h-[100%] items-center justify-center">
                        <form
                            action=""
                            onSubmit={createMakePayment}
                            className="relative w-[100%] rounded-[5px] m-auto p-[10px] pt-[5px] dark:bg-dark-bg bg-[#f0f0f0] "
                        >
                            <h1 className="text-center font-bold dark:text-white text-[22px] m-[20px]">
                                Make Payment
                            </h1>
                            <IoIcons.IoClose
                                className="absolute top-[20px] right-[20px] text-[35px] cursor-pointer"
                                onClick={handleCloseMakeModel}
                            />
                            <hr style={{ marginBottom: "4px" }} />
                            <div>
                                <input
                                    type="text"
                                    name="quoteId"
                                    placeholder="Policy Quote Id"
                                    value={policyQuoteId}
                                    onChange={(e) => {
                                        setPolicyQuoteId(e.target.value);
                                    }}
                                    className=" mt-2 bg-lime cursor-pointer text-[18px] self-center py-1 rounded-[5px] h-[50px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%] focus:outline-none focus:shadow-md"
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

            </div>

            {/* <Footer /> */}
        </>
    );
};

export default PaymentReport;
