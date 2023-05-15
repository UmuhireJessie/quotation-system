import Adminbar from "@/components/layout/AdminNav";
import Footer from "@/components/layout/Footer";
import { Icon } from "@iconify/react";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import styles from "../User/users.module.css"
import * as AiIcons from "react-icons/ai";
import Select from "react-select";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import * as IoIcons from "react-icons/io5";
import * as BsIcons from "react-icons/bs";
import { Pagination } from '@nextui-org/react';
// import { Pagination } from 'react-bootstrap';

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

const Clients = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [pNumber, setPNumber] = useState("");

    const [openUpdateModal, setOpenUpdateModel] = useState(false);
    const [updateFirstName, setUpdateFirstName] = useState("")
    const [updateLastName, setUpdateLastName] = useState("")
    const [updateEmail, setUpdateEmail] = useState("")
    const [updatePNnumber, setUpdatePNnumber] = useState("")
    const [activeData, setActiveData] = useState<any | undefined>({});
    const [updateClientId, setUpdateClientId] = useState("");


    const token = Cookies.get("token");

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
            setData(response.data)
            console.log("response", response)
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    const numData = data?.length

    useEffect(() => {
        getAllClients()
    }, [])

    const [filters, setFilters] = useState({
        dateStart: '',
        dateEnd: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
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

        return (
            isDateInRange &&
            firstNameMatch &&
            lastNameMatch &&
            emailMatch &&
            phoneNumberMatch
        );
    });

    console.log("filteredData", filteredData)

    // Create client ===============

    const handleOpenCreateClient = () => {
        setOpenCreateModal(true);
    };
    const handleCloseCreateModel = () => {
        setOpenCreateModal(false);
    };
    const createClient = async (data: any) => {
        try {
            const dt = await fetch("http://178.79.172.122:5000/client/registration", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            const response = await dt.json();
            console.log("response update", response)
        } catch (error) {
            console.error(error);
        }
    };

    const createNewClient = (e: any) => {
        e.preventDefault()
        const regData = {
            email: email,
            pNnumber: pNumber,
            first_name: firstName,
            last_name: lastName,
        };
        createClient(regData);
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
        setUpdatePNnumber(activeData?.pNnumber);
        setUpdateEmail(activeData?.email);

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
            pNumber: updatePNnumber,
            email: updateEmail
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
                    <h4 className="font-[500] text-[16px] mb-6">Clients</h4>
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
                        <span className="text-sm">Client</span>
                    </button>
                </div>

                <Table className="mb-10 text-[#06091b]">
                    <Thead className="">
                        <Tr >
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0] pl-4">Date</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">First Name</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Last Name</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Email</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Phone Number</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Action</Th>
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
                                    className="block w-[8rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
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
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">
                                                <span className="inline-flex">
                                                    <button
                                                        className={" h-[30px] rounded-[5px] bg-[#5c83d8] text-white flex items-center py-[5px] px-[10px] mr-[8px]"}
                                                        onClick={(e) => {
                                                            setActiveData(row)
                                                            handleOpenUpdateModal(e);
                                                        }}
                                                    >
                                                        <span className="text-sm">edit</span>
                                                    </button>
                                                </span>
                                            </Td>
                                        </Tr>
                                    )
                                })
                            ) : (
                                <Tr style={{ backgroundColor: '#f7f7f7' }}>
                                    <Td className="py-[10px] border-b border-[#e6e6e6] text-sm pl-4"></Td>
                                    <Td className="py-[10px] border-b border-[#e6e6e6] text-sm"></Td>
                                    <Td className="py-[10px] border-b border-[#e6e6e6] text-sm text-end">No Record Found</Td>
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
                                Create new client
                            </h1>
                            <IoIcons.IoClose
                                className="absolute top-[20px] right-[20px] text-[35px] cursor-pointer"
                                onClick={handleCloseCreateModel}
                            />
                            <hr style={{ marginBottom: "4px" }} />
                            <div>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => {
                                        setFirstName(e.target.value);
                                    }}
                                    className=" mt-2 bg-lime cursor-pointer text-[18px] self-center py-1 rounded-[5px] h-[50px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%]"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => {
                                        setLastName(e.target.value);
                                    }}
                                    className=" mt-2 bg-lime cursor-pointer text-[18px] self-center py-1 rounded-[5px] h-[50px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%]"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                    className=" mt-2 bg-lime cursor-pointer text-[18px] self-center py-1 rounded-[5px] h-[50px] my-[20px] mx-auto w-[80%] block border-[1px] border-[#a8a8a8]  px-[10px] md:w-[90%]"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="pNumber"
                                    placeholder="Phone Number"
                                    value={pNumber}
                                    onChange={(e) => {
                                        setPNumber(e.target.value);
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
                            className="relative rounded-[5px] w-[100%] h-[500px] m-auto p-[10px] pt-[5px] dark:bg-dark-bg bg-[#f0f0f0] "
                        >
                            <h1 className="text-center dark:text-white font-bold text-[24px] m-[20px]">
                                Update client
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
                                name="firstName"
                                placeholder="First Name"
                                value={updateFirstName}
                                onChange={(e) => {
                                    setUpdateFirstName(e.target.value);
                                }}
                                className=" mt-3 bg-lime cursor-pointer text-[18px] self-center py-1 rounded-[5px] h-[50px] my-[20px] mx-auto w-[80%] block border-[2px] border-[#a8a8a8]  px-[10px] md:w-[90%]"
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={updateLastName}
                                onChange={(e) => {
                                    setUpdateLastName(e.target.value);
                                }}
                                className=" mt-3 bg-lime cursor-pointer text-[18px] self-center py-1 rounded-[5px] h-[50px] my-[20px] mx-auto w-[80%] block border-[2px] border-[#a8a8a8]  px-[10px] md:w-[90%]"
                            />
                            <input
                                type="text"
                                name="email"
                                placeholder="Email"
                                value={updateEmail}
                                onChange={(e) => {
                                    setUpdateEmail(e.target.value);
                                }}
                                className=" mt-3 bg-lime cursor-pointer text-[18px] self-center py-1 rounded-[5px] h-[50px] my-[20px] mx-auto w-[80%] block border-[2px] border-[#a8a8a8]  px-[10px] md:w-[90%]"
                            />
                            <input
                                type="text"
                                name="pNnumber"
                                placeholder="Phone Number"
                                value={updatePNnumber}
                                onChange={(e) => {
                                    setUpdatePNnumber(e.target.value);
                                }}
                                className=" mt-3 bg-lime cursor-pointer text-[18px] self-center py-1 rounded-[5px] h-[50px] my-[20px] mx-auto w-[80%] block border-[2px] border-[#a8a8a8]  px-[10px] md:w-[90%]"
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

            </div>

            {/* <Footer /> */}
        </>
    );
};

export default Clients;
