import Adminbar from "@/components/layout/AdminNav";
import Footer from "@/components/layout/Footer";
import { Icon } from "@iconify/react";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import * as AiIcons from "react-icons/ai";
import Select from "react-select";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import * as IoIcons from "react-icons/io5";
import * as BsIcons from "react-icons/bs";
import { Pagination } from '@nextui-org/react';


const SMSReport = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [msisdn, setMsisdn] = useState("");
    const [message, setMessage] = useState("");
    const [msgRef, setMsgRef] = useState("");
    const [senderId, setSenderId] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10)


    const token = Cookies.get("token");

    const getAllSMS = async () => {
        try {
            const dt = await fetch("http://178.79.172.122:5000/sms/", {
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
        getAllSMS()
    }, [])

    const [filters, setFilters] = useState({
        dateStart: '',
        dateEnd: '',
        message: '',
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

        const messageTypeMatch = row.message
            .toLowerCase()
            .includes(filters.message.toLowerCase());

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
            messageTypeMatch &&
            pNnumberMatch &&
            gtwRefMatch &&
            quoteIdMatch &&
            quoteIdMatch &&
            statusMatch
        );
    });

    console.log("filteredData", filteredData)

    const numData = filteredData?.length



    // Send SMS ===============

    const handleOpenCreateClient = () => {
        setOpenCreateModal(true);
    };
    const handleCloseCreateModel = () => {
        setOpenCreateModal(false);
    };
    const createClient = async (data: any) => {
        try {
            const dt = await fetch("http://178.79.172.122:5000/sms/send/", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const response = await dt.json();
            console.log("send sms", response)
        } catch (error) {
            console.error(error);
        }
    };

    const createNewClient = (e: any) => {
        e.preventDefault()
        const regData = {
            msisdn: msisdn,
            message: message,
            msgRef: msgRef,
            sender_id: senderId
        }
        createClient(regData);
        setOpenCreateModal(false);

        // setTimeout(() => {
        //   window.location.reload();
        // }, 3000);
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
                    <h4 className="font-[500] text-[16px] mb-6">SMS Report</h4>
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
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Message</Th>
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
                                    className="block w-[8rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                    type="text"
                                    value={filters.message}
                                    onChange={(e) => handleFilterChange(e, 'message')}
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
                                    <option value="sent">Sent</option>
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
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.message}</Td>
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
                                Send SMS
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
                                    className=" mt-2 bg-lime cursor-pointer text-[18px] self-center py-1 rounded-[5px] h-[50px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%]"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="message"
                                    placeholder="Message"
                                    value={message}
                                    onChange={(e) => {
                                        setMessage(e.target.value);
                                    }}
                                    className=" mt-2 bg-lime cursor-pointer text-[18px] self-center py-1 rounded-[5px] h-[50px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%]"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="msgRef"
                                    placeholder="Message Reference"
                                    value={msgRef}
                                    onChange={(e) => {
                                        setMsgRef(e.target.value);
                                    }}
                                    className=" mt-2 bg-lime cursor-pointer text-[18px] self-center py-1 rounded-[5px] h-[50px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%]"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="senderId"
                                    placeholder="Sender ID"
                                    value={senderId}
                                    onChange={(e) => {
                                        setSenderId(e.target.value);
                                    }}
                                    className=" mt-2 bg-lime cursor-pointer text-[18px] self-center py-1 rounded-[5px] h-[50px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%]"
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

export default SMSReport;
