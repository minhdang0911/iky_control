import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './carliststaff.scss';
import icons from '../../Utils/icons';
import {
    Modalcreateliftingtable,
    Modalupdateliftingtable,
    Modalincreasetime,
    Modaldecreasetime,
    ModalCreateCustomer,
    ModalCategory,
    ModalLCD,
    ModalTechnical,
    ModalSynchronousLeb,
    ModalSynchronousCustomer,
    ModalConfigSystem,
    ModalCreateDatabase,
    ModalUpdateDatabase,
    ModalInfomation,
    ModalImport,
    ModalReceivingCustomer,
} from '../Modal';
import { toast } from 'react-toastify';
import { Modal, Button } from 'antd';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/img/logocompany.png';
import Swal from 'sweetalert2';
import { apiDeleteLiftTable, apiGetLiftTable } from '../../api/lifttable';
import { apiGetCustomers } from '../../api/customer';
import { apiLogout } from '../../api/user';
import CreateStore from '../Admin/Store/ManageStore';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { Accordion, Card, Table } from 'react-bootstrap';
import Cookies from 'js-cookie';
import moment from 'moment/moment';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const Dashboard = () => {
    const [cars, setCars] = useState([]);
    const [receivedCustomers, setReceivedCustomers] = useState([]);
    const [returnCar, setReturnCar] = useState([]);
    const [activeTab, setActiveTab] = useState('home');
    // const [selectedCarRow, setSelectedCarRow] = useState(null);
    const [selectedCustomerRow, setSelectedCustomerRow] = useState(null);
    const [selectedReturnCarRow, setSelectedReturnCarRow] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [data, setData] = useState([]);
    const [hideStore, setHideStore] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [activeKey, setActiveKey] = useState('home');
    // const [selectedCar, setSelectedCar] = useState(null); // State lưu dữ liệu của hàng được chọn

    //api thực tế
    const [serviceWating, setServiceWaiting] = useState([]);
    const [expandedRows, setExpandedRows] = useState({});
    const [expandedService, setExpandedService] = useState(null);

    const modals = [
        { key: 'isShowModalCreateLiftingTable', component: Modalcreateliftingtable },
        { key: 'isShowModalUpdateLiftingTable', component: Modalupdateliftingtable },
        { key: 'isShowModalIncreaseTime', component: Modalincreasetime },
        { key: 'isShowModalDecreaseTime', component: Modaldecreasetime },
        { key: 'isShowModalCreateCustomer', component: ModalCreateCustomer },
        { key: 'isShowModalCategory', component: ModalCategory },
        { key: 'isShowModalLCD', component: ModalLCD },
        { key: 'isShowModalTechnical', component: ModalTechnical },
        { key: 'isShowModalSynchronousLeb', component: ModalSynchronousLeb },
        { key: 'isShowModalSynchronousCustomer', component: ModalSynchronousCustomer },
        { key: 'isShowModalConfigSystem', component: ModalConfigSystem },
        { key: 'isShowModalCreateDatabase', component: ModalCreateDatabase },
        { key: 'isShowModalUpdateDatabase', component: ModalUpdateDatabase },
        { key: 'isShowModalInfomation', component: ModalInfomation },
        { key: 'isShowModalImport', component: ModalImport },
        { key: 'isShowModalReceivingCustomer', component: ModalReceivingCustomer },
    ];

    const [modalStates, setModalStates] = useState({
        isShowModalCreateLiftingTable: false,
        isShowModalUpdateLiftingTable: false,
        isShowModalIncreaseTime: false,
        isShowModalDecreaseTime: false,
        isShowModalCreateCustomer: false,
        isShowModalCategory: false,
        isShowModalLCD: false,
        isShowModalTechnical: false,
        isShowModalSynchronousLeb: false,
        isShowModalSynchronousCustomer: false,
        isShowModalConfigSystem: false,
        isShowModalCreateDatabase: false,
        isShowModalUpdateDatabase: false,
        isShowModalInfomation: false,
        isShowModalImport: false,
        isShowModalReceivingCustomer: false,
    });

    const {
        GoPlusCircle,
        IoMdCloseCircle,
        IoReloadOutline,
        LuClipboardEdit,
        FaArrowAltCircleDown,
        FaArrowAltCircleUp,
        TiSpanner,
        LuBookOpenCheck,
        RiUserShared2Fill,
        HiSpeakerphone,
        MdClose,
        GrPrint,
        SlClock,
        FaAddressCard,
        IoSettingsOutline,
        FaFlipboard,
        TbDatabasePlus,
        LuDatabase,
        IoDocuments,
        FaEarthAmericas,
        HiQuestionMarkCircle,
        FaUser,
        FiLogOut,
    } = icons;

    useEffect(() => {
        document.title = 'Bảng điều khiển';
        fetch('/list-mantain-car.json')
            .then((response) => response.json())
            .then((data) => {
                setCars(data.cars);
                setReceivedCustomers(data.ListCustomers);
                setReturnCar(data.done);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const toggleModal = (modalKey) => {
        setModalStates((prev) => ({
            ...prev,
            [modalKey]: !prev[modalKey],
        }));
    };

    const handleModalSubmit = ({ liftingTable, technician }) => {
        const newEntry = {
            technician,
            content: 'Kính chào quý khách',
            status: 'ĐÃ XONG' || 'Đã xong',
        };
        setCars((prevCars) => [...prevCars, newEntry]);
    };

    const handleModalSubmitCustomer = ({ customer, ID, licensePlate, time }) => {
        setReceivedCustomers((prevCustomers) => [...prevCustomers, { customer, ID, licensePlate, time }]);
    };

    const handleCustomerReturn = (index) => {
        setReceivedCustomers((prevCustomers) => prevCustomers.filter((_, i) => i !== index));
    };

    const handleToggleModal = (modalKey) => {
        toggleModal(modalKey);
    };

    const setSelectedCarRoww = (carId) => {
        const index = cars.findIndex((car) => car._id === carId);
        setSelectedIndex(index);
    };

    const handleDelete = async () => {
        if (selectedIndex !== null && selectedIndex >= 0 && selectedIndex < cars.length) {
            try {
                const liftTableId = cars[selectedIndex]._id;
                await apiDeleteLiftTable(liftTableId);

                const updatedData = cars.filter((_, index) => index !== selectedIndex);
                setCars(updatedData);
                toast.success('Xóa thành công');
                setShowConfirm(false);
                setSelectedIndex(null);
            } catch (error) {
                console.error('Lỗi khi xóa bản nâng:', error);
                toast.error('Có lỗi xảy ra khi xóa bản nâng.');
            }
        } else {
            console.error('Chỉ số đã chọn không hợp lệ:', selectedIndex);
        }
    };

    const handleDecreaseTime = (timeToDecrease) => {
        const index = selectedIndex; // Lấy chỉ số xe đã chọn
        if (index !== null) {
            setCars((prevCars) => {
                const updatedCars = [...prevCars];
                const currentTimeSpent = updatedCars[index].timeSpent; // Thời gian còn lại hiện tại
                const newTimeSpent = currentTimeSpent - timeToDecrease; // Tính thời gian mới
                updatedCars[index].timeSpent = newTimeSpent < 0 ? 0 : newTimeSpent; // Đảm bảo không âm
                return updatedCars;
            });
        }
    };

    const handleRowClick = (carId) => {
        const index = cars.findIndex((car) => car._id === carId);
        setSelectedCarRoww(carId);
        setSelectedIndex(index);
    };

    const handleRowClickCustomer = (customer) => {
        const index = customers.findIndex((c) => c._id === customer._id);
        setSelectedCustomerRow(index);
        setSelectedCustomer(customer);
    };

    const handleIncreaseTime = (timeToIncrease) => {
        const index = selectedIndex;
        if (index !== null) {
            setCars((prevCars) => {
                const updatedCars = [...prevCars];
                const currentTimeSpent = Number(updatedCars[index].timeSpent);
                const newTimeSpent = Number(currentTimeSpent) + Number(timeToIncrease);
                updatedCars[index].timeSpent = newTimeSpent;
                return updatedCars;
            });
        }
    };

    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const token = useMemo(() => Cookies.get('token'), []);
    useEffect(() => {
        if (!token) {
            Swal.fire({
                title: 'Bạn chưa đăng nhập!',
                text: 'Vui lòng đăng nhập để tiếp tục.',
                icon: 'warning',
                confirmButtonText: 'OK',
            }).then(() => {
                navigate('/login');
            });
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/user/getUser', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.success) {
                    const userData = response.data.rs;
                    setFirstName(userData.firstName);
                    setLastName(userData.lastName);
                    setIsLoggedIn(true);
                    setData(userData);

                    // Fetch lift tables if storeId exists
                    if (userData.storeId) {
                        await fetchLiftTables(userData.storeId);
                    } else {
                        console.log('Không có storeId trong dữ liệu người dùng.');
                    }

                    // Set token expiration handling
                    setTokenExpiration();
                } else {
                    console.log('Lỗi xác thực người dùng:', response.data.message);
                    setIsLoggedIn(false);
                }
            } catch (error) {
                handleApiError(error);
            }
        };

        const fetchLiftTables = async (storeID) => {
            try {
                const response = await axios.get(`http://localhost:5000/api/lifttable/getTables?storeId=${storeID}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.success) {
                    setCars(response.data.data);
                } else {
                    console.log('Lỗi lấy danh sách bàn nâng:', response.data.message);
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách bàn nâng:', error);
            }
        };

        const setTokenExpiration = () => {
            const expirationTime = 6000 * 1000; // 100 phút
            const tokenExpirationTimeout = setTimeout(handleTokenExpired, expirationTime);
            return () => clearTimeout(tokenExpirationTimeout);
        };

        const handleTokenExpired = () => {
            Swal.fire({
                title: 'Phiên đăng nhập đã hết hạn!',
                text: 'Vui lòng đăng nhập lại.',
                icon: 'warning',
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    Cookies.remove('token');
                    setIsLoggedIn(false);
                    setFirstName('');
                    setLastName('');
                    window.location.href = '/login';
                }
            });
        };

        const handleApiError = (error) => {
            if (error.response && error.response.status === 402) {
                handleTokenExpired();
            } else {
                console.error('Lỗi từ server:', error.response?.data || error.message);
            }
        };

        fetchUserData();
    }, [navigate, token]);

    // // Hàm thông báo hết hạn token
    const handleTokenExpired = useCallback(() => {
        Swal.fire({
            title: 'Phiên đăng nhập đã hết hạn!',
            text: 'Vui lòng đăng nhập lại.',
            icon: 'warning',
            confirmButtonText: 'OK',
        }).then((result) => {
            if (result.isConfirmed) {
                Cookies.remove('token');
                setIsLoggedIn(false);
                setFirstName('');
                setLastName('');
                navigate('/login');
            }
        });
    }, [navigate]);

    // // Hàm lấy dữ liệu người dùng
    const fetchUserData = useCallback(async () => {
        if (!token) {
            Swal.fire({
                title: 'Bạn chưa đăng nhập!',
                text: 'Vui lòng đăng nhập để tiếp tục.',
                icon: 'warning',
                confirmButtonText: 'OK',
            }).then(() => {
                navigate('/login');
            });
            return;
        }

        try {
            const response = await axios.get('http://localhost:5000/api/user/getUser', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                const userData = response.data.rs;
                setFirstName(userData.firstName);
                setLastName(userData.lastName);
                setIsLoggedIn(true);
                if (userData.storeId) {
                    await fetchLiftTables(userData.storeId);
                }
            } else {
                console.log('Lỗi xác thực người dùng:', response.data.message);
                setIsLoggedIn(false);
            }
        } catch (error) {
            if (error.response && error.response.status === 402) {
                handleTokenExpired();
            } else {
                console.error('Lỗi từ server:', error.response?.data || error.message);
            }
        }
    }, [token, handleTokenExpired]);

    const fetchLiftTables = useCallback(
        async (storeID) => {
            try {
                const response = await apiGetLiftTable(storeID);

                if (response.success === true) {
                    setCars(response.data);
                } else {
                    console.log('Lỗi lấy danh sách bàn nâng:', response.data.message);
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách bàn nâng:', error);
            }
        },
        [token],
    );

    useEffect(() => {
        fetchUserData();

        const expirationTime = 6000 * 1000;
        const tokenExpirationTimeout = setTimeout(handleTokenExpired, expirationTime);

        return () => clearTimeout(tokenExpirationTimeout);
    }, [fetchUserData, handleTokenExpired]);

    const handleLogout = async () => {
        try {
            const token = Cookies.get('token');

            if (!token) {
                throw new Error('Token không tồn tại, hãy đăng nhập lại.');
            }

            const response = await apiLogout(token); // Gọi apiLogout

            if (response.success) {
                Cookies.remove('token');
                setFirstName('');
                setLastName('');
                setIsLoggedIn(false); // Cập nhật trạng thái đăng nhập
                Swal.fire('Đăng xuất thành công!', '', 'success'); // Thông báo thành công
                navigate('/login');
            }
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error.response ? error.response.data : error);
        }
    };

    const updateCars = (updatedCar) => {
        setCars((prevCars) => {
            const newCars = prevCars?.map((car) => (car?._id === updatedCar?._id ? updatedCar : car));
            return newCars;
        });
    };

    const handleAddNewLiftingTable = (newLiftingTable) => {
        setCars((prev) => [...prev, newLiftingTable]);
    };

    // api thực tế
    // useEffect(() => {
    //     const fetchCustomer = async () => {
    //         const token = Cookies.get('Access token');

    //         try {
    //             const response = await fetch('/api/queues/list', {
    //                 method: 'GET',
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                     'Content-Type': 'application/json',
    //                 },
    //             });

    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! Status: ${response.status}`);
    //             }

    //             const data = await response.json();
    //             setServiceWaiting(data.msg.customerWaiting);
    //             console.log('data', serviceWating);
    //         } catch (error) {
    //             console.error('Error fetching customer data:', error);
    //         }
    //     };

    //     fetchCustomer();
    // }, []);

    // api thực tế
    // const toggleRow = (index) => {
    //     setExpandedRows((prev) => ({
    //         ...prev,
    //         [index]: !prev[index], // Đảo trạng thái mở/đóng của hàng
    //     }));
    // };

    //api thực tế
    // const toggleService = (index) => {
    //     setExpandedService((prev) => (prev === index ? null : index)); // Đóng mở bảng dịch vụ theo chỉ số
    // };

    useEffect(() => {
        const fetchCustomers = async () => {
            const response = await apiGetCustomers();
            if (response) {
                setCustomers(response.customers);
            }
        };
        fetchCustomers();
    }, []);

    return (
        <>
            <div className="dashboard-container">
                {!hideStore && <CreateStore dataUser={data} />}
                {modals.map(
                    ({ key, component: ModalComponent }) =>
                        modalStates[key] && (
                            <div className="modal-overlay" key={key}>
                                <ModalComponent
                                    isShowModal={modalStates[key]}
                                    onClose={() => toggleModal(key)}
                                    onSubmit={handleModalSubmit}
                                    selectedCar={cars[selectedIndex]}
                                    onUpdate={handleModalSubmit}
                                    onHandle={handleModalSubmitCustomer}
                                    receivedCustomers={receivedCustomers}
                                    onDecreaseTime={handleDecreaseTime}
                                    onIncreaseTime={handleIncreaseTime}
                                    dataUser={data}
                                    cars={cars}
                                    onUpdateCars={updateCars}
                                    onAddCars={handleAddNewLiftingTable}
                                    selectedCustomer={selectedCustomer}
                                />
                            </div>
                        ),
                )}

                <header className="header">
                    <img src={logo} alt="Logo" className="header-logo" loading="lazy" />
                    <div className="header-icons">
                        {!isLoggedIn ? (
                            <div></div>
                        ) : (
                            // <FaUser onClick={handleLoginClick} className="icon login-icon" title="Đăng nhập" />
                            <>
                                <h5 className="welcome-text">
                                    Chào Mừng {firstName} {lastName}
                                </h5>
                                <FiLogOut onClick={handleLogout} className="icon logout-icon" title="Đăng xuất" />
                            </>
                        )}
                    </div>
                </header>
                <div>
                    <Tabs activeKey={activeKey} onChange={setActiveKey} style={{ marginBottom: 16, marginLeft: 25 }}>
                        <TabPane tab="Trang Chính" key="home">
                            <div className="card-grid">
                                {/* Card content for "Trang Chính" */}
                                <div className="card">
                                    <div className="cart-top">
                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalCreateLiftingTable')}
                                        >
                                            <GoPlusCircle className="icon-plus" size={30} />
                                            <p className="text-function">Tạo bản nâng</p>
                                        </div>
                                        <div
                                            className="cart-center"
                                            onClick={() => {
                                                setShowConfirm(true);
                                            }}
                                        >
                                            <IoMdCloseCircle className="icon-close" size={30} />
                                            <p className="text-function">Xóa bản nâng</p>
                                        </div>
                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalUpdateLiftingTable')}
                                        >
                                            <LuClipboardEdit size={30} />
                                            <p className="text-function">Sửa bản nâng</p>
                                        </div>
                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalSynchronousLeb')}
                                        >
                                            <IoReloadOutline className="icon-plus" size={30} />
                                            <p className="text-function">Đồng bộ bảng leb</p>
                                        </div>
                                    </div>
                                    <p className="function">Bảng nâng</p>
                                </div>

                                {/* Other cards for "Trang Chính" */}
                                {/* Repeat similar structure for other cards */}
                                <div className="card">
                                    <div className="cart-top">
                                        <div className="cart-center">
                                            <TiSpanner className="icon-plus" size={30} />
                                            <p className="text-function">Tiếp nhận xe</p>
                                        </div>
                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalDecreaseTime')}
                                        >
                                            <FaArrowAltCircleDown className="icon-green" size={30} />
                                            <p className="text-function">Giảm thời gian</p>
                                        </div>
                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalIncreaseTime')}
                                        >
                                            <FaArrowAltCircleUp className="icon-green" size={30} />
                                            <p className="text-function">Tăng thời gian</p>
                                        </div>
                                        <div className="cart-center">
                                            <LuBookOpenCheck size={30} />
                                            <p className="text-function">Trả xe</p>
                                        </div>
                                    </div>
                                    <p className="function">Thông tin sửa chữa</p>
                                </div>

                                <div className="card ">
                                    <div className="cart-top">
                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalCreateCustomer')}
                                        >
                                            <RiUserShared2Fill size={30} />
                                            <p className="text-function"> Tiếp nhận khách</p>
                                        </div>

                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalSynchronousCustomer')}
                                        >
                                            <IoReloadOutline className="icon-plus" size={30} />
                                            <span className="text-function">Đồng bộ thông </span>
                                            <span className="text-function">tin khách hàng</span>
                                        </div>

                                        <div className="cart-center">
                                            <HiSpeakerphone className="icon-plus" size={30} />
                                            <p className="text-function">Thông báo</p>
                                        </div>

                                        <div className="cart-center">
                                            <MdClose className="icon-close" size={30} />
                                            <p className="text-function"> Tắt thông báo</p>
                                        </div>
                                    </div>
                                    <p className="function">Thông tin khách hàng</p>
                                </div>

                                <div className="card">
                                    <div className="cart-top">
                                        <div className="cart-center">
                                            <GrPrint size={30} />
                                            <p className="text-function">Xuất báo cáo</p>
                                        </div>
                                    </div>
                                    <p className="function">Báo cáo</p>
                                </div>

                                <div className="card">
                                    <div className="cart-top">
                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalCategory')}
                                        >
                                            <SlClock size={30} />
                                            <p className="text-function"> Danh mục thời</p>
                                            <p className="text-function"> gian sửa chửa</p>
                                        </div>

                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalTechnical')}
                                        >
                                            <FaAddressCard size={30} />
                                            <p className="text-function">Danh sách kĩ </p>
                                            <p className="text-function">thuật viên</p>
                                        </div>
                                    </div>
                                    <p className="function">Khai báo</p>
                                </div>
                            </div>
                        </TabPane>

                        <TabPane tab="Cấu Hình" key="settings">
                            <div className="card-grid">
                                <div className="card">
                                    <div className="cart-top">
                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalConfigSystem')}
                                        >
                                            <IoSettingsOutline size={30} />
                                            <p className="text-function">Cấu hình thông số hệ thống</p>
                                        </div>
                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalLCD')}
                                        >
                                            <FaFlipboard size={30} />
                                            <p className="text-function">Cấu hình thông số thể hiện LCD</p>
                                        </div>
                                    </div>
                                    <p className="function">Thông tin</p>
                                </div>

                                {/* Other cards for "Cấu Hình" */}
                            </div>
                        </TabPane>

                        <TabPane tab="Import" key="import">
                            <div className="card-grid">
                                <div className="card">
                                    <div className="cart-top">
                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalImport')}
                                        >
                                            <IoDocuments size={30} />
                                            <p className="text-function">Import danh mục thời gian sửa chữa</p>
                                        </div>
                                    </div>
                                    <p className="function">Import</p>
                                </div>
                            </div>
                        </TabPane>

                        <TabPane tab="Trợ Giúp" key="help">
                            <div className="card-grid">
                                <div className="card">
                                    <div className="cart-top">
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://iky.vn/"
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <div className="cart-center">
                                                <FaEarthAmericas size={30} />
                                                <p className="text-function">Trang chủ</p>
                                            </div>
                                        </a>
                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalInfomation')}
                                        >
                                            <HiQuestionMarkCircle size={30} />
                                            <p className="text-function">Phiên bản</p>
                                        </div>
                                    </div>
                                    <p className="function">Thông tin</p>
                                </div>
                            </div>
                        </TabPane>
                    </Tabs>
                </div>

                <div className="home-content">
                    {/* <div className="card-grid">
                        {activeTab === 'home' && (
                            <>
                                <div className="card">
                                    <div className="cart-top">
                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalCreateLiftingTable')}
                                        >
                                            <GoPlusCircle className="icon-plus" size={30} />
                                            <p className="text-function"> Tạo bản nâng</p>
                                        </div>

                                        <div
                                            className="cart-center"
                                            onClick={() => {
                                                setShowConfirm(true);
                                            }}
                                        >
                                            <IoMdCloseCircle className="icon-close" size={30} />
                                            <p className="text-function"> Xóa bản nâng</p>
                                        </div>

                                        <div className="cart-center">
                                            <LuClipboardEdit
                                                size={30}
                                                onClick={() => handleToggleModal('isShowModalUpdateLiftingTable')}
                                            />
                                            <p className="text-function"> Sửa bản nâng</p>
                                        </div>

                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalSynchronousLeb')}
                                        >
                                            <IoReloadOutline className="icon-plus" size={30} />
                                            <p className="text-function"> Đồng bộ bảng leb</p>
                                        </div>
                                    </div>
                                    <p className="function">Bảng nâng</p>
                                </div>

                                <div className="card">
                                    <div className="cart-top">
                                        <div className="cart-center">
                                            <TiSpanner className="icon-plus" size={30} />
                                            <p className="text-function"> Tiếp nhận xe</p>
                                        </div>

                                        <div className="cart-center">
                                            <FaArrowAltCircleDown
                                                className="icon-green"
                                                size={30}
                                                onClick={() => {
                                                    if (selectedIndex !== null) {
                                                        // Kiểm tra chỉ số đã được chọn chưa
                                                        handleToggleModal('isShowModalDecreaseTime');
                                                    }
                                                }}
                                            />
                                            <p className="text-function">Giảm thời gian</p>
                                        </div>

                                        <div className="cart-center">
                                            <FaArrowAltCircleUp
                                                className="icon-green"
                                                size={30}
                                                onClick={() => handleToggleModal('isShowModalIncreaseTime')}
                                            />
                                            <p className="text-function">Tăng thời gian</p>
                                        </div>

                                        <div className="cart-center">
                                            <LuBookOpenCheck size={30} />
                                            <p className="text-function"> Trả xe</p>
                                        </div>
                                    </div>
                                    <p className="function">Thông tin sửa chữa</p>
                                </div>

                                <div className="card ">
                                    <div className="cart-top">
                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalCreateCustomer')}
                                        >
                                            <RiUserShared2Fill size={30} />
                                            <p className="text-function"> Tiếp nhận khách</p>
                                        </div>

                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalSynchronousCustomer')}
                                        >
                                            <IoReloadOutline className="icon-plus" size={30} />
                                            <span className="text-function">Đồng bộ thông </span>
                                            <span className="text-function">tin khách hàng</span>
                                        </div>

                                        <div className="cart-center">
                                            <HiSpeakerphone className="icon-plus" size={30} />
                                            <p className="text-function">Thông báo</p>
                                        </div>

                                        <div className="cart-center">
                                            <MdClose className="icon-close" size={30} />
                                            <p className="text-function"> Tắt thông báo</p>
                                        </div>
                                    </div>
                                    <p className="function">Thông tin khách hàng</p>
                                </div>

                                <div className="card">
                                    <div className="cart-top">
                                        <div className="cart-center">
                                            <GrPrint size={30} />
                                            <p className="text-function">Xuất báo cáo</p>
                                        </div>
                                    </div>
                                    <p className="function">Báo cáo</p>
                                </div>

                                <div className="card">
                                    <div className="cart-top">
                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalCategory')}
                                        >
                                            <SlClock size={30} />
                                            <p className="text-function"> Danh mục thời</p>
                                            <p className="text-function"> gian sửa chửa</p>
                                        </div>

                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalTechnical')}
                                        >
                                            <FaAddressCard size={30} />
                                            <p className="text-function">Danh sách kĩ </p>
                                            <p className="text-function">thuật viên</p>
                                        </div>
                                    </div>
                                    <p className="function">Khai báo</p>
                                </div>
                            </>
                        )}

                        {activeTab === 'settings' && (
                            <>
                                <div className="card">
                                    <div className="cart-top">
                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalConfigSystem')}
                                        >
                                            <IoSettingsOutline size={30} />
                                            <p className="text-function"> Cấu hình thông</p>
                                            <p className="text-function"> số hệ thống</p>
                                        </div>

                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalLCD')}
                                        >
                                            <FaFlipboard size={30} />
                                            <p className="text-function"> Cấu hình thông</p>
                                            <p className="text-function"> số thể hiện LCD</p>
                                        </div>
                                    </div>
                                    <p className="function">Thông tin</p>
                                </div>

                                <div className="card">
                                    <div className="cart-top">
                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalCreateDatabase')}
                                        >
                                            <TbDatabasePlus size={30} />
                                            <p className="text-function"> Tạo cấu trúc</p>
                                            <p className="text-function"> dữ liệu</p>
                                        </div>

                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalUpdateDatabase')}
                                        >
                                            <LuDatabase size={30} />
                                            <p className="text-function"> Cài đặt cơ</p>
                                            <p className="text-function"> sở dữ liệu</p>
                                        </div>
                                    </div>
                                    <p className="function">Database</p>
                                </div>
                            </>
                        )}

                        {activeTab === 'import' && (
                            <>
                                <div className="card">
                                    <div className="cart-top">
                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalImport')}
                                        >
                                            <IoDocuments size={30} />
                                            <p className="text-function"> Import danh mục</p>
                                            <p className="text-function"> thời gian sửa chửa</p>
                                        </div>
                                    </div>
                                    <p className="function">Import</p>
                                </div>
                            </>
                        )}

                        {activeTab === 'help' && (
                            <>
                                <div className="card">
                                    <div className="cart-top">
                                        <a target="_blank" href="https://iky.vn/" style={{ textDecoration: 'none' }}>
                                            <div className="cart-center">
                                                <FaEarthAmericas size={30} />
                                                <p className="text-function"> Trang chủ</p>
                                            </div>
                                        </a>

                                        <div
                                            className="cart-center"
                                            onClick={() => handleToggleModal('isShowModalInfomation')}
                                        >
                                            <HiQuestionMarkCircle size={30} />
                                            <p className="text-function">Phiên bản</p>
                                        </div>
                                    </div>
                                    <p className="function">Thông tin</p>
                                </div>
                            </>
                        )}
                    </div> */}

                    <div className="active-tables">
                        <div className="background-container">
                            <div className="content-wrapper">
                                <div style={{ border: '1px solid #ddd', padding: '16px' }}>
                                    <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Bảng dữ liệu</p>
                                    <div style={{ border: '1px solid #ccc', padding: '16px' }}>
                                        <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                                            DANH SÁCH BÀN NÂNG
                                        </p>
                                        <div style={{ overflowX: 'auto' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                <thead>
                                                    <tr>
                                                        <th
                                                            style={{
                                                                padding: '8px 16px',
                                                                textAlign: 'left',
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            Bàn nâng
                                                        </th>
                                                        <th
                                                            style={{
                                                                padding: '8px 16px',
                                                                textAlign: 'left',
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            Kĩ Thuật Viên
                                                        </th>
                                                        <th
                                                            style={{
                                                                padding: '8px 16px',
                                                                textAlign: 'left',
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            Nội dung thông báo
                                                        </th>
                                                        <th
                                                            style={{
                                                                padding: '8px 16px',
                                                                textAlign: 'left',
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            TRẠNG THÁI
                                                        </th>
                                                        <th
                                                            style={{
                                                                padding: '8px 16px',
                                                                textAlign: 'left',
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            Số thẻ
                                                        </th>
                                                        <th
                                                            style={{
                                                                padding: '8px 16px',
                                                                textAlign: 'left',
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            Khách Hàng
                                                        </th>
                                                        <th
                                                            style={{
                                                                padding: '8px 16px',
                                                                textAlign: 'left',
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            Biển số xe
                                                        </th>
                                                        <th
                                                            style={{
                                                                padding: '8px 16px',
                                                                textAlign: 'left',
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            TG sửa chữa
                                                        </th>
                                                        <th
                                                            style={{
                                                                padding: '8px 16px',
                                                                textAlign: 'left',
                                                                whiteSpace: 'nowrap',
                                                            }}
                                                        >
                                                            TG còn lại
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {cars
                                                        ?.filter((car) => moment(car.createdAt).isSame(moment(), 'day'))
                                                        .map((car) => (
                                                            <tr
                                                                key={car._id}
                                                                onClick={() => handleRowClick(car._id)}
                                                                style={{
                                                                    backgroundColor:
                                                                        selectedIndex === cars.indexOf(car)
                                                                            ? '#f0f0f0'
                                                                            : 'transparent',
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                <td style={{ padding: '8px 16px' }}>
                                                                    {isLoggedIn && car ? car.number : ''}
                                                                </td>
                                                                <td style={{ padding: '8px 16px' }}>
                                                                    {isLoggedIn && car ? car?.technician?.fullName : ''}
                                                                </td>
                                                                <td style={{ padding: '8px 16px' }}>
                                                                    {isLoggedIn && car ? car.description : ''}
                                                                </td>
                                                                <td style={{ padding: '8px 16px' }}>
                                                                    {isLoggedIn && car ? 'đã xong' : ''}
                                                                </td>
                                                                <td style={{ padding: '8px 16px' }}></td>
                                                                <td style={{ padding: '8px 16px' }}></td>
                                                                <td style={{ padding: '8px 16px' }}></td>
                                                                <td style={{ padding: '8px 16px' }}></td>
                                                                <td style={{ padding: '8px 16px' }}></td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className="row-tables">
                                    <div className="active-table" style={{ overflowX: 'auto' }}>
                                        <p className="active-table-title">DANH SÁCH KHÁCH HÀNG</p>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Số thẻ</th>
                                                    <th>Họ tên</th>
                                                    <th>BIỂN SỐ XE</th>
                                                    <th>THỜI GIAN</th>
                                                    <th>Nhận</th>
                                                    <th>Trả</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {customers
                                                    ?.slice()
                                                    .filter((customer) => {
                                                        const createdAt = new Date(customer.createdAt);
                                                        const today = new Date();
                                                        return (
                                                            createdAt.getDate() === today.getDate() &&
                                                            createdAt.getMonth() === today.getMonth() &&
                                                            createdAt.getFullYear() === today.getFullYear()
                                                        );
                                                    })
                                                    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                                                    .map((customer, index) => (
                                                        <tr
                                                            key={customer._id} // Sử dụng _id làm key
                                                            onClick={() => handleRowClickCustomer(customer)}
                                                            style={{
                                                                backgroundColor:
                                                                    selectedCustomerRow === customers.indexOf(customer)
                                                                        ? '#f0f0f0'
                                                                        : 'transparent',
                                                                cursor: 'pointer',
                                                            }}
                                                            // className={
                                                            //     selectedCustomerRow === index ? 'active-row' : ''
                                                            // }
                                                        >
                                                            <td>{customer?.cardNumber}</td>
                                                            <td>{customer?.fullName}</td>
                                                            <td>{customer?.licensePlate}</td>
                                                            <td>{customer?.repairStartTime}</td>
                                                            <td
                                                                className="status-cell"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleToggleModal('isShowModalReceivingCustomer');
                                                                    setSelectedCustomerRow(index);
                                                                    setSelectedCustomer(customer);
                                                                }}
                                                            >
                                                                <span className="status status-receive">✓</span>
                                                            </td>
                                                            <td
                                                                className="status-cell"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleCustomerReturn(customer);
                                                                }}
                                                            >
                                                                <span className="status status-cancel">X</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* api thực tế */}
                                    {/* <div className="active-table">
                                        <h4 className="active-table-title">DANH SÁCH DỊCH VỤ</h4>
                                        <Accordion>
                                            {serviceWating.map((service, index) => (
                                                <Card key={index} className="mb-2">
                                                    <Card.Header>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span className="service-name">
                                                                {service.services_name}
                                                            </span>
                                                            <Button
                                                                variant="link"
                                                                onClick={() => toggleService(index)}
                                                                aria-expanded={expandedService === index}
                                                            >
                                                                {expandedService === index ? (
                                                                    <FaCaretUp />
                                                                ) : (
                                                                    <FaCaretDown />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </Card.Header>
                                                    <Accordion.Collapse
                                                        eventKey={index.toString()}
                                                        in={expandedService === index}
                                                    >
                                                        <Card.Body>
                                                            {service.queues.length > 0 ? (
                                                                <Table bordered hover responsive>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Số thẻ</th>
                                                                            <th>Họ tên</th>
                                                                            <th>BIỂN SỐ XE</th>

                                                                            <th>THỜI GIAN</th>
                                                                            <th>Nhận</th>
                                                                            <th>Trả</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {service.queues.map((queue, queueIndex) => (
                                                                            <tr key={queueIndex}>
                                                                                <td>{queue.serial_number}</td>
                                                                                <td>
                                                                                    {service.customer ||
                                                                                        service.name ||
                                                                                        'N/A'}
                                                                                </td>
                                                                                <td>{service.licensePlate || 'N/A'}</td>

                                                                                <td>
                                                                                    {new Date(
                                                                                        queue.created_at,
                                                                                    ).toLocaleString()}
                                                                                </td>
                                                                                <td className="status-cell">
                                                                                    <span
                                                                                        className="status status-receive"
                                                                                        onClick={() =>
                                                                                            handleToggleModal(
                                                                                                'isShowModalReceivingCustomer',
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        ✓
                                                                                    </span>
                                                                                </td>
                                                                                <td className="status-cell">
                                                                                    <span className="status status-cancel">
                                                                                        X
                                                                                    </span>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </Table>
                                                            ) : (
                                                                <p>Không có hàng đợi nào cho dịch vụ này</p>
                                                            )}
                                                        </Card.Body>
                                                    </Accordion.Collapse>
                                                </Card>
                                            ))}
                                        </Accordion>
                                    </div> */}
                                    <div className="active-table" style={{ overflowX: 'auto' }}>
                                        <p className="active-table-title">DANH SÁCH XE CHỜ LẤY</p>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Số thẻ</th>
                                                    <th>Họ tên</th>
                                                    <th>Biển Số Xe</th>
                                                    <th>Thời gian</th>
                                                    <th>KH đã nhận </th>
                                                    <th>Gọi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {returnCar?.map((items, index) => (
                                                    <tr
                                                        key={index}
                                                        onClick={() => setSelectedReturnCarRow(index)}
                                                        className={selectedReturnCarRow === index ? 'active-row' : ''}
                                                        // style={{
                                                        //     backgroundColor:
                                                        //         selectedCustomerRow === returnCar.indexOf(items)
                                                        //             ? '#f0f0f0'
                                                        //             : 'transparent',
                                                        //     cursor: 'pointer',
                                                        // }}
                                                    >
                                                        <td>{items?.ID}</td>
                                                        <td>{items?.customer}</td>
                                                        <td>{items?.licensePlate}</td>
                                                        <td>{items?.time}</td>

                                                        <td className="status-cell">
                                                            <span className="status status-receive">✓</span>
                                                        </td>

                                                        <td className="status-cell">
                                                            <span className="status status-call">📢</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title="Xác nhận xóa"
                open={showConfirm}
                onCancel={() => setShowConfirm(false)}
                footer={[
                    <Button key="cancel" onClick={() => setShowConfirm(false)}>
                        Hủy
                    </Button>,
                    <Button key="delete" type="danger" onClick={handleDelete}>
                        Xóa
                    </Button>,
                ]}
            >
                <p>Bạn có chắc chắn muốn xóa bản nâng này?</p>
            </Modal>
        </>
        // <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        //     <Modal.Header closeButton>
        //         <Modal.Title>Xác nhận xóa</Modal.Title>
        //     </Modal.Header>
        //     <Modal.Body>Bạn có chắc chắn muốn xóa bản nâng này?</Modal.Body>
        //     <Modal.Footer>
        //         <Button variant="secondary" onClick={() => setShowConfirm(false)}>
        //             Hủy
        //         </Button>
        //         <Button variant="danger" onClick={handleDelete}>
        //             Xóa
        //         </Button>
        //     </Modal.Footer>
        // </Modal>
    );
};

export default Dashboard;
