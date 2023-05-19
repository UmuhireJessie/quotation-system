import Adminbar from "@/components/layout/AdminNav";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import * as BsIcons from "react-icons/bs";
import * as IoIcons from "react-icons/io5";
import { Pagination } from '@nextui-org/react';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import handleExportData from "@/components/utils/ExportExcel";
import { useRef } from 'react';
import { exportToPDF } from "@/components/utils/ExportPDF";
import { printTable } from "@/components/utils/Print";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { handleExportAndSendEmail } from "@/components/utils/ExportEmail";


const ClientReport = () => {

    const [data, setData] = useState<any>([]);
    const [isCreated, setIsCreated] = useState(false)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const tableRef = useRef(null);
    const [reportEmail, setReportEmail] = useState("")
    const [openSendEmailModal, setOpenSendEmailModal] = useState(false)

    const handleCloseSendEmailModal = () => {
        setOpenSendEmailModal(false);
    }
    const handleOpenSendEmailModal = () => {
        setOpenSendEmailModal(true);
    }
    const handleSendEmailReport = (e:any) => {
        e.preventDefault();
        handleExportAndSendEmail(filteredData, reportEmail, 'client')
        setReportEmail('')
        setOpenSendEmailModal(false)
    }

    const token = Cookies.get("token");
    

    const [filters, setFilters] = useState({
        dateStart: '',
        dateEnd: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: '',
        isActive: '',
    });

    const handleFilterChange = (e, columnId) => {
        setFilters({ ...filters, [columnId]: e.target.value });
    };

    const filteredData = data?.filter((row) => {
        const date = new Date(row.createdAt);
        const dateStart = filters.dateStart ? new Date(filters.dateStart) : null;
        const dateEnd = filters.dateEnd ? new Date(filters.dateEnd) : null;
        const isDateInRange =
            (!dateStart || date >= dateStart) && (!dateEnd || date <= dateEnd);

        const firstNameMatch = row.fName
            .toLowerCase()
            .includes(filters.firstName.toLowerCase());

        const lastNameMatch = row.sName
            .toLowerCase()
            .includes(filters.lastName.toLowerCase());

        const emailMatch = row.email
            .toLowerCase()
            .includes(filters.email.toLowerCase());

        const phoneNumberMatch = row.pNnumber
            .toLowerCase()
            .includes(filters.phoneNumber.toLowerCase());

        const roleMatch = filters.role ? row.role === filters.role : true;
        const isActiveMatch =
            filters.isActive === ''
                ? true
                : row.is_active === (filters.isActive === 'true');

        return (
            isDateInRange &&
            firstNameMatch &&
            lastNameMatch &&
            emailMatch &&
            phoneNumberMatch &&
            roleMatch &&
            isActiveMatch
        );
    });

    console.log("filteredData", filteredData)

    const getAllUsers = async () => {
        try {
            const dt = await fetch("http://178.79.172.122:5000/client/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const response = await dt.json();
            setData(response?.data)
            console.log("response", response)
            return response;
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

    useEffect(() => {
        getAllUsers()
    }, [isCreated])

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
                    <h4 className="font-[500] text-[16px] mb-6">Client Report</h4>
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
                            handleExportData(filteredData, 'client')
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
                        <Tr >
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0] pl-4">Date</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">First Name</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Last Name</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Email</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Phone Number</Th>
                        </Tr>
                    </Thead>

                    <Tbody>
                        <Tr className="border-b border-[#888787]">
                            <Td className="py-4">
                                <div>
                                    <input
                                        className="block ml-4 w-[5rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 mb-2 focus:outline-none focus:shadow-sm text-sm"
                                        type="date"
                                        value={filters.dateStart}
                                        onChange={(e) => handleFilterChange(e, 'dateStart')}
                                    />
                                    <input
                                        className="block ml-4 w-[5rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                        type="date"
                                        value={filters.dateEnd}
                                        onChange={(e) => handleFilterChange(e, 'dateEnd')}
                                    />
                                </div>
                            </Td>
                            <Td className="py-4">
                                <input
                                    className="block w-[5rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                    type="text"
                                    value={filters.firstName}
                                    onChange={(e) => handleFilterChange(e, 'firstName')}
                                />
                            </Td>
                            <Td className="py-4">
                                <input
                                    className="block w-[5rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                    type="text"
                                    value={filters.lastName}
                                    onChange={(e) => handleFilterChange(e, 'lastName')}
                                />
                            </Td>
                            <Td className="py-4">
                                <input
                                    className="block w-[5rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                    type="email"
                                    value={filters.email}
                                    onChange={(e) => handleFilterChange(e, 'email')}
                                />
                            </Td>
                            <Td className="py-4">
                                <input
                                    className="block w-[5rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                    type="tel"
                                    value={filters.phoneNumber}
                                    onChange={(e) => handleFilterChange(e, 'phoneNumber')}
                                />
                            </Td>
                        </Tr>
                        {
                            currentRows?.length !== 0 ? (
                                currentRows?.map((row: any, index: any) => {
                                    return (
                                        <Tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f7f7f7' : '#ffffff' }}>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm pl-4">{row.createdAt}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.fName}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.sName}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.email}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.pNnumber}</Td>
                                        </Tr>
                                    )
                                })
                            ) : (
                                <Tr style={{ backgroundColor: '#f7f7f7' }}>
                                    <Td className="py-[10px] border-b border-[#e6e6e6] text-sm pl-4"></Td>
                                    <Td className="py-[10px] border-b border-[#e6e6e6] text-sm"></Td>
                                    <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">No Record Found</Td>
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
                                    Send
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

            </div>

        </>
    );
};

export default ClientReport;
