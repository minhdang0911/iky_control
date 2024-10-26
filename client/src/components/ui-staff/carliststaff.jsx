import React, { useEffect, useState } from 'react';
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
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/img/logocompany.png';
import Swal from 'sweetalert2';
import { apiDeleteLiftTable } from '../../api/lifttable';
import { apiLogout } from '../../api/user';

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
    // const [selectedCar, setSelectedCar] = useState(null); // State lưu dữ liệu của hàng được chọn

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
        setSelectedCarRoww(carId); // Lưu ID cho mục đích khác nếu cần
        setSelectedIndex(index); // Lưu chỉ số của bản nâng
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

    useEffect(() => {
        const token = localStorage.getItem('token');
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
            if (!token) {
                console.log('Token không tồn tại, người dùng cần đăng nhập lại.');
                setIsLoggedIn(false);
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
                    setData(userData);

                    if (userData.storeId) {
                        await fetchLiftTables(userData.storeId);
                    } else {
                        console.log('Không có storeId trong dữ liệu người dùng.');
                    }

                    // Gán thời gian hết hạn token là 100 phút
                    const expirationTime = 6000 * 1000;
                    setTimeout(() => {
                        handleTokenExpired();
                    }, expirationTime);
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
        };

        const fetchLiftTables = async (storeID) => {
            try {
                const response = await axios.get(`http://localhost:5000/api/lifttable/getTables?storeId=${storeID}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });

                if (response.data.success) {
                    console.log('cars res', response);
                    setCars(response.data.data); // Cập nhật trạng thái cars
                    console.log('Dữ liệu mới được setCars:', cars); // In ra dữ liệu
                } else {
                    console.log('Lỗi lấy danh sách bàn nâng:', response.data.message);
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách bàn nâng:', error);
            }
        };

        const handleTokenExpired = () => {
            Swal.fire({
                title: 'Phiên đăng nhập đã hết hạn!',
                text: 'Vui lòng đăng nhập lại.',
                icon: 'warning',
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('token');
                    setIsLoggedIn(false);
                    setFirstName('');
                    setLastName('');
                    window.location.href = '/login';
                }
            });
        };

        fetchUserData(); // Gọi hàm fetch dữ liệu khi component được render

        // Set timeout cho token hết hạn ngay khi component render
        const expirationTime = 6000 * 1000; // 100 phút
        const tokenExpirationTimeout = setTimeout(handleTokenExpired, expirationTime);

        // Clean up the timeout on component unmount
        return () => clearTimeout(tokenExpirationTimeout);
    }, []);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Token không tồn tại, hãy đăng nhập lại.');
            }

            const response = await apiLogout(token); // Gọi apiLogout

            if (response.success) {
                localStorage.removeItem('token');
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
    return (
        <>
            {isLoggedIn ? (
                <div className="dashboard-container">
                    {modals.map(
                        ({ key, component: ModalComponent }) =>
                            modalStates[key] && (
                                <div className="modal-overlay" key={key}>
                                    <ModalComponent
                                        isShowModal={modalStates[key]} // Kiểm tra state modal
                                        onClose={() => toggleModal(key)} // Đảm bảo toggleModal đóng đúng modal
                                        onSubmit={handleModalSubmit} // Nếu có
                                        selectedCar={cars[selectedIndex]}
                                        onUpdate={handleModalSubmit} // Gọi cập nhật từ nơi khác
                                        onHandle={handleModalSubmitCustomer}
                                        receivedCustomers={receivedCustomers}
                                        onDecreaseTime={handleDecreaseTime}
                                        onIncreaseTime={handleIncreaseTime}
                                        dataUser={data}
                                        cars={cars}
                                        onUpdateCars={updateCars}
                                        onAddCars={handleAddNewLiftingTable}
                                    />
                                </div>
                            ),
                    )}

                    <header className="header">
                        <img src={logo} alt="Logo" className="header-logo" />
                        <div className="header-icons">
                            {!isLoggedIn ? (
                                <FaUser onClick={handleLoginClick} className="icon login-icon" title="Đăng nhập" />
                            ) : (
                                <>
                                    <h5 className="welcome-text">
                                        Chào Mừng {firstName} {lastName}
                                    </h5>
                                    <FiLogOut onClick={handleLogout} className="icon logout-icon" title="Đăng xuất" />
                                </>
                            )}
                        </div>
                    </header>

                    <div className="tabs">
                        <div
                            className={`tabs-content ${activeTab === 'home' ? 'active' : ''}`}
                            onClick={() => setActiveTab('home')}
                        >
                            Trang Chính
                        </div>
                        <div
                            className={`tabs-content ${activeTab === 'settings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            Cấu Hình
                        </div>
                        <div
                            className={`tabs-content ${activeTab === 'import' ? 'active' : ''}`}
                            onClick={() => setActiveTab('import')}
                        >
                            Import
                        </div>
                        <div
                            className={`tabs-content ${activeTab === 'help' ? 'active' : ''}`}
                            onClick={() => setActiveTab('help')}
                        >
                            Trợ Giúp
                        </div>
                    </div>

                    <div className="home-content">
                        <div className="card-grid">
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
                                            <a
                                                target="_blank"
                                                href="https://iky.vn/"
                                                style={{ textDecoration: 'none' }}
                                            >
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
                        </div>

                        <div className="active-tables">
                            <div className="background-container">
                                <div className="content-wrapper">
                                    <div className="border-table">
                                        <p className="data-table">Bảng dữ liệu</p>
                                        <div className="active-table lifting-table">
                                            <p className="active-table-title">DANH SÁCH BÀN NÂNG</p>
                                            <table>
                                                <thead style={{ marginLeft: '100px' }}>
                                                    <tr>
                                                        <th>Bàn nâng</th>
                                                        <th>Kĩ Thuật Viên</th>
                                                        <th>Nội dung thông báo</th>
                                                        <th>TRẠNG THÁI</th>
                                                        <th>Số thẻ</th>
                                                        <th>Khách Hàng</th>
                                                        <th>Biển số xe</th>
                                                        <th>TG sửa chửa</th>
                                                        <th>TG còn lại</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {cars?.map((car) => (
                                                        <tr
                                                            key={car._id}
                                                            onClick={() => handleRowClick(car._id)} // Sử dụng handleRowClick
                                                            className={
                                                                selectedIndex === cars.indexOf(car) ? 'active-row' : ''
                                                            }
                                                        >
                                                            <td>{isLoggedIn && car ? car.number : ''}</td>
                                                            <td>
                                                                {isLoggedIn && car ? car?.technician?.fullName : ''}
                                                            </td>
                                                            <td>{isLoggedIn && car ? car.description : ''}</td>
                                                            <td>{isLoggedIn && car ? 'đã xong' : ''}</td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="row-tables">
                                        <div className="active-table">
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
                                                    {receivedCustomers?.map((customer, index) => (
                                                        <tr
                                                            key={index}
                                                            onClick={() => setSelectedCustomerRow(index)}
                                                            className={
                                                                selectedCustomerRow === index ? 'active-row' : ''
                                                            }
                                                        >
                                                            <td>{customer?.ID || customer?.id}</td>
                                                            <td>{customer?.customer || customer?.name}</td>
                                                            <td>{customer?.licensePlate}</td>
                                                            <td>{customer?.time}</td>
                                                            <td
                                                                className="status-cell"
                                                                onClick={() =>
                                                                    handleToggleModal('isShowModalReceivingCustomer')
                                                                }
                                                            >
                                                                <span className="status status-receive">✓</span>
                                                            </td>
                                                            <td className="status-cell">
                                                                <span
                                                                    className="status status-cancel"
                                                                    onClick={() => handleCustomerReturn(index)}
                                                                >
                                                                    X
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="active-table">
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
                                                            className={
                                                                selectedReturnCarRow === index ? 'active-row' : ''
                                                            }
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
            ) : (
                <div></div>
            )}

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa bản nâng này?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Dashboard;
