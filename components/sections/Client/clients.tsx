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
    const [isCreated, setIsCreated] = useState(false)


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

    useEffect(() => {
        getAllClients()
    }, [isCreated])

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
            console.log("response", response)
            if (response?.detail) {
                toast.error(response.detail, {
                    className: 'font-[sans-serif] text-sm'
                });
            } else {
                setEmail("")
                setPNumber("")
                setFirstName("")
                setLastName("")
                setIsCreated(true)
                toast.success('Client added successfully!', {
                    className: 'font-[sans-serif] text-sm'
                });
            }
        } catch (error: any) {
            console.error(error);
            setEmail("")
            setPNumber("")
            setFirstName("")
            setLastName("")
            toast.error(error.message, {
                className: 'font-[sans-serif] text-sm'
            });
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
            if (response?.detail) {
                toast.error(response.detail, {
                    className: 'font-[sans-serif] text-sm'
                });
            } else {
                setIsCreated(true)
                toast.success('Client updated successfully!', {
                    className: 'font-[sans-serif] text-sm'
                });
            }

        } catch (error: any) {
            console.error(error);
            setUpdateFirstName("");
            setUpdateLastName("");
            setUpdatePNnumber("");
            setUpdateEmail("");
            setUpdateClientId("");
            toast.error(error.message)
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
            <ToastContainer
                autoClose={2000}
                hideProgressBar={true}
                closeOnClick
                pauseOnHover
                style={{ width: "300px", height: "100px" }}
            />
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
                    <Box className="flex m-auto w-[40%] h-[100%] items-center justify-center">
                        <form
                            action=""
                            onSubmit={createNewClient}
                            className=" relative w-[100%] rounded-[5px] m-auto p-[10px] pt-[5px] bg-[#f0f0f0] "
                        >
                            <h1 className="text-center text-[#1b173f] font-bold text-[20px] m-[20px]">
                                New Client
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
                                    required
                                    value={firstName}
                                    onChange={(e) => {
                                        setFirstName(e.target.value);
                                    }}
                                    className="bg-lime text-sm self-center rounded-[5px] h-[40px] my-[15px] mx-auto block border-[1px] border-[#a8a8a8]  px-[10px] w-[85%] focus:outline-none focus:shadow-md"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    required
                                    value={lastName}
                                    onChange={(e) => {
                                        setLastName(e.target.value);
                                    }}
                                    className="bg-lime text-sm self-center rounded-[5px] h-[40px] my-[15px] mx-auto block border-[1px] border-[#a8a8a8]  px-[10px] w-[85%] focus:outline-none focus:shadow-md"
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    required
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                    }}
                                    className="bg-lime text-sm self-center rounded-[5px] h-[40px] my-[15px] mx-auto block border-[1px] border-[#a8a8a8]  px-[10px] w-[85%] focus:outline-none focus:shadow-md"
                                />
                            </div>
                            <div>
                                <input
                                    type="number"
                                    name="pNumber"
                                    placeholder="Phone Number"
                                    required
                                    value={pNumber}
                                    onChange={(e) => {
                                        setPNumber(e.target.value);
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
                                Update Client
                            </h1>
                            <IoIcons.IoClose
                                className="absolute top-[20px] right-[20px] text-[35px] cursor-pointer"
                                onClick={handleCloseUpdateModal}
                            />
                            <hr style={{ marginBottom: "4px" }} />
                            <div>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    required
                                    value={updateFirstName}
                                    onChange={(e) => {
                                        setUpdateFirstName(e.target.value);
                                    }}
                                    className="bg-lime text-sm self-center rounded-[5px] h-[40px] my-[15px] mx-auto block border-[1px] border-[#a8a8a8]  px-[10px] w-[85%] focus:outline-none focus:shadow-md"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    required
                                    value={updateLastName}
                                    onChange={(e) => {
                                        setUpdateLastName(e.target.value);
                                    }}
                                    className="bg-lime text-sm self-center rounded-[5px] h-[40px] my-[15px] mx-auto block border-[1px] border-[#a8a8a8]  px-[10px] w-[85%] focus:outline-none focus:shadow-md"
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    required
                                    value={updateEmail}
                                    onChange={(e) => {
                                        setUpdateEmail(e.target.value);
                                    }}
                                    className="bg-lime text-sm self-center rounded-[5px] h-[40px] my-[15px] mx-auto block border-[1px] border-[#a8a8a8]  px-[10px] w-[85%] focus:outline-none focus:shadow-md"
                                />
                            </div>
                            <div>
                                <input
                                    type="number"
                                    name="pNumber"
                                    placeholder="Phone Number"
                                    required
                                    value={updatePNnumber}
                                    onChange={(e) => {
                                        setUpdatePNnumber(e.target.value);
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

export default Clients;
