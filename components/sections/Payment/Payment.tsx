import Adminbar from "@/components/layout/AdminNav";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import * as IoIcons from "react-icons/io5";
import * as BsIcons from "react-icons/bs";
import { Pagination } from '@nextui-org/react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Payment = () => {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [msisdn, setMsisdn] = useState("");
    const [amount, setAmount] = useState("");
    const [gtwRef, setGtwRef] = useState("");

    const [openMakeModal, setOpenMakeModal] = useState(false);
    const [policyQuoteId, setPolicyQuoteId] = useState("")
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [isCreated, setIsCreated] = useState(false)
    const [quoteInfo, setQuoteInfo] = useState({});


    const token = Cookies.get("token");

    const getAllPayment = async () => {
        try {
            const dt = await fetch("http://212.71.245.100:5000/payment/", {
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
        } catch (error: any) {
            console.error(error);
            toast.error(error.message, {
                className: 'font-[sans-serif] text-sm'
            })
        }
    }

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
            const AllQuotes = response?.data || [];

            const quoteInfoMap = {};
            AllQuotes.forEach((quote) => {
                const quoteData = `${quote.policyQuoteId}`;
                quoteInfoMap[quote.id] = quoteData;
            });
            setQuoteInfo(quoteInfoMap);
            setIsLoading(false);

        } catch (error: any) {
            toast.error(error, {
                className: 'font-[sans-serif] text-sm'
            });
        }
    }


    useEffect(() => {
        getAllPayment()
        getAllQuotes()
        setIsCreated(false)
    }, [isCreated])

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

        const quoteIdMatch =
            filters.quoteId === '' ||
            (row.quoteId && quoteInfo[row.quoteId]?.toLowerCase().includes(filters.quoteId.toLowerCase()));

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

    // Make Payment
    const handleOpenMakeClient = () => {
        setOpenMakeModal(true);
    };

    const handleCloseMakeModel = () => {
        setOpenMakeModal(false);
    };
    const createMakePayment = async (id: any) => {
        try {
            const dt = await fetch(`http://212.71.245.100:5000/payment/make/?policyQuoteId=${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const response = await dt.json();
            console.log("Pay", response)
            if (response?.detail) {
                toast.error(response.detail, {
                    className: 'font-[sans-serif] text-sm'
                });
            } else {
                setIsCreated(true)
                toast.success('Payment created successfully!', {
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

    // Send Payment ===============

    const handleOpenCreateClient = () => {
        setOpenCreateModal(true);
    };
    const handleCloseCreateModel = () => {
        setOpenCreateModal(false);
    };
    const createClient = async (data: any) => {
        try {
            const dt = await fetch("http://212.71.245.100:5000/payment/pay/", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const response = await dt.json();
            console.log("Pay", response)
            if (response?.detail) {
                toast.error(response.detail, {
                    className: 'font-[sans-serif] text-sm'
                });
            } else {
                setIsCreated(true)
                setMsisdn("")
                setAmount("")
                setGtwRef("")
                toast.success('Payment sent successfully!', {
                    className: 'font-[sans-serif] text-sm'
                })
            }
        } catch (error: any) {
            console.error(error);
            setMsisdn("")
            setAmount("")
            setGtwRef("")
            toast.error(error.message, {
                className: 'font-[sans-serif] text-sm'
            })
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
                    <h4 className="font-[500] text-[16px] mb-6">Payment</h4>
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

                    <div className="flex">
                        <button
                            className={" h-[35px] rounded-[5px] text-white flex items-center p-0 pl-[5px] pr-[10px] mb-[20px] mr-[20px]"}
                            style={{ background: "linear-gradient(270deg, #60b848 1.64%, #009677 98.36%)" }}
                            onClick={() => handleOpenCreateClient()}
                        >
                            <BsIcons.BsPlusLg className="mx-[5px]" />
                            <span className="text-sm">Send Payment</span>
                        </button>
                        <button
                            className={" h-[35px] rounded-[5px] text-white flex items-center py-[5px] px-[10px] mb-[20px]"}
                            style={{ background: "linear-gradient(270deg, #60b848 1.64%, #009677 98.36%)" }}
                            onClick={() => handleOpenMakeClient()}
                        >
                            <span className="text-sm">Make Payment</span>
                        </button>
                    </div>
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
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{isLoading ? 'Loading...' : quoteInfo[row.quoteId]}</Td>
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
                    <Box className="flex m-auto w-[40%] h-[100%] items-center justify-center">
                        <form
                            action=""
                            onSubmit={createNewClient}
                            className=" relative w-[100%] rounded-[5px] m-auto p-[10px] pt-[5px] bg-[#f0f0f0] "
                        >
                            <h1 className="text-center text-[#1b173f] font-bold text-[20px] m-[20px]">
                                Send Payment
                            </h1>
                            <IoIcons.IoClose
                                className="absolute top-[20px] right-[20px] text-[35px] cursor-pointer"
                                onClick={handleCloseCreateModel}
                            />
                            <hr style={{ marginBottom: "4px" }} />
                            <div>
                                <input
                                    type="number"
                                    name="msisdn"
                                    required
                                    placeholder="Phone Number"
                                    value={msisdn}
                                    onChange={(e) => {
                                        setMsisdn(e.target.value);
                                    }}
                                    className="bg-lime text-sm self-center rounded-[5px] h-[40px] my-[15px] mx-auto block border-[1px] border-[#a8a8a8]  px-[10px] w-[85%] focus:outline-none focus:shadow-md"
                                />
                            </div>
                            <div>
                                <input
                                    type="number"
                                    required
                                    name="amount"
                                    placeholder="Amount"
                                    value={amount}
                                    onChange={(e) => {
                                        setAmount(e.target.value);
                                    }}
                                    className="bg-lime text-sm self-center rounded-[5px] h-[40px] my-[15px] mx-auto block border-[1px] border-[#a8a8a8]  px-[10px] w-[85%] focus:outline-none focus:shadow-md"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="gtwRef"
                                    required
                                    placeholder="Gateway Reference"
                                    value={gtwRef}
                                    onChange={(e) => {
                                        setGtwRef(e.target.value);
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
                    open={openMakeModal}
                    onClose={handleCloseMakeModel}
                    aria-labelledby="parent-modal-title"
                    aria-describedby="parent-modal-description"
                >
                    <Box className="flex m-auto w-[40%] h-[100%] items-center justify-center">
                        <form
                            action=""
                            onSubmit={createMakePayment}
                            className=" relative w-[100%] rounded-[5px] m-auto p-[10px] pt-[5px] bg-[#f0f0f0] "
                        >
                            <h1 className="text-center text-[#1b173f] font-bold text-[20px] m-[20px]">
                                Make Payment
                            </h1>
                            <IoIcons.IoClose
                                className="absolute top-[20px] right-[20px] text-[35px] cursor-pointer"
                                onClick={handleCloseMakeModel}
                            />
                            <hr style={{ marginBottom: "4px" }} />
                            <div>
                                <input
                                    type="number"
                                    required
                                    name="quoteId"
                                    placeholder="Policy Quote Id"
                                    value={policyQuoteId}
                                    onChange={(e) => {
                                        setPolicyQuoteId(e.target.value);
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

            </div>
        </>
    );
};

export default Payment;
