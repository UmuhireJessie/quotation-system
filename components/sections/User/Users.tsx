import Adminbar from "@/components/layout/AdminNav";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import Select from "react-select";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import * as IoIcons from "react-icons/io5";
import * as BsIcons from "react-icons/bs";
import { Pagination } from '@nextui-org/react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";

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

const Users = () => {

    const [data, setData] = useState<any>([]);
    const [isCreated, setIsCreated] = useState(false)

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [pNumber, setPNumber] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const token = Cookies.get("token");
    const router = useRouter()

    if (token) {
        const decoded: any = jwt_decode(token);
        const currentTime = Date.now() / 1000; // convert to seconds
        if (decoded.expires < currentTime) {
            toast.info("You've been signed out! Sign in again")
            Cookies.remove("token");
            router.push("/");
            console.log('Token has expired')
        }
    } else {
        router.push("/")
    }

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
            const dt = await fetch("http://212.71.245.100:5000/auth/", {
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
        } catch (error:any) {
            console.error(error);
            toast.error(error.message, {
                className: 'font-[sans-serif] text-sm'
            })
        }
    }

    // Create userr ===============

    const handleOpenCreateUser = () => {
        setOpenCreateModal(true);
    };
    const handleCloseCreateModel = () => {
        setOpenCreateModal(false);
    };
    const createUser = async (data: any) => {
        try {
            const dt = await fetch("http://212.71.245.100:5000/auth/registration", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
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
                setPassword("")
                setLastName("")
                setRole("")
                setIsCreated(true)
                toast.success('Member added successfully!', {
                    className: 'font-[sans-serif] text-sm'
                });
            }


        } catch (error: any) {
            console.error(error);
            setEmail("")
            setPNumber("")
            setFirstName("")
            setPassword("")
            setLastName("")
            setRole("")
            toast.error(error.message, {
                className: 'font-[sans-serif] text-sm'
            })
        }
    };

    const createNewUser = (e: any) => {
        e.preventDefault();
        if (role == "") {
            toast.error('Please select a role', {
                className: 'font-[sans-serif] text-sm'
            });
            return
        }
        const regData = {
            email: email,
            pNnumber: pNumber,
            first_name: firstName,
            last_name: lastName,
            password: password,
            role: role
        };
        createUser(regData);
        setOpenCreateModal(false);
    };

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
                    <h4 className="font-[500] text-[16px] mb-6">Staff</h4>
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
                        onClick={() => handleOpenCreateUser()}
                    >
                        <BsIcons.BsPlusLg className="mx-[5px]" />
                        <span className="text-sm">Staff</span>
                    </button>
                </div>

                <Table className="mb-10 text-[#06091b]">
                    <Thead className="">
                        <Tr >
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0] pl-4">Date</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">First Name</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Last Name</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Role</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Email</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Phone Number</Th>
                            <Th className="text-start text-[14px] py-6 border-b border-[#e0e0e0]">Active</Th>
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
                                <select
                                    className="block w-[5rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                    value={filters.role}
                                    onChange={(e) => handleFilterChange(e, 'role')}
                                >
                                    <option value="">All</option>
                                    <option value="admin">Admin</option>
                                    <option value="call_center">Call Center</option>
                                </select>
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
                            <Td className="py-4">
                                <select
                                    className="block w-[5rem] border-2 border-[#e8ebe8] rounded-[5px] py-1 px-2 mr-4 focus:outline-none focus:shadow-sm text-sm"
                                    value={filters.isActive}
                                    onChange={(e) => handleFilterChange(e, 'isActive')}
                                >
                                    <option value="">All</option>
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
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
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.role}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.email}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.pNnumber}</Td>
                                            <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">{row.is_active ? <span className="bg-[#a4e9b3] rounded-[5px] px-[8px] py-[2px]">True</span> : <span className="bg-[#dde2de] rounded-[5px] px-[8px] py-[2px]">False</span>}</Td>
                                        </Tr>
                                    )
                                })
                            ) : (
                                <Tr style={{ backgroundColor: '#f7f7f7' }}>
                                    <Td className="py-[10px] border-b border-[#e6e6e6] text-sm pl-4"></Td>
                                    <Td className="py-[10px] border-b border-[#e6e6e6] text-sm"></Td>
                                    <Td className="py-[10px] border-b border-[#e6e6e6] text-sm"></Td>
                                    <Td className="py-[10px] border-b border-[#e6e6e6] text-sm">No Record Found</Td>
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
                            onSubmit={createNewUser}
                            className=" relative w-[100%] rounded-[5px] m-auto p-[10px] pt-[5px] bg-[#f0f0f0] "
                        >
                            <h1 className="text-center text-[#1b173f] font-bold text-[20px] m-[20px]">
                                New Staff
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
                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    required
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                    }}
                                    className="bg-lime text-sm self-center rounded-[5px] h-[40px] my-[15px] mx-auto block border-[1px] border-[#a8a8a8]  px-[10px] w-[85%] focus:outline-none focus:shadow-md"
                                />
                            </div>
                            <div>
                                <Select
                                    className="px-[10px] h-[50px] my-[15px] mx-auto w-[89%] text-sm"
                                    options={[
                                        { value: "admin", label: "Admin" },
                                        { value: "call_center", label: "Call Center" },
                                    ]}
                                    defaultValue={{ value: "", label: "Select Role" }}
                                    onChange={(e) => setRole(`${e?.value}`)}
                                    theme={customTheme}
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

export default Users;
