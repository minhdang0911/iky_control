// import React, { useState } from 'react';
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';
// import Form from 'react-bootstrap/Form';
// import Table from 'react-bootstrap/Table';
// import { FaCheck, FaTimes, FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';

// const ModalCreateCustomer = ({ isShowModal, onHandle, onClose }) => {
//     const [isOpen, setIsOpen] = useState(true);
//     const [name, setName] = useState(''); // Đổi sang chuỗi rỗng
//     const [id, setId] = useState(''); // Đổi sang chuỗi rỗng
//     const [licensePlate, setLicensePlate] = useState(''); // Đổi sang chuỗi rỗng
//     const [time, setTime] = useState(''); // Đổi sang chuỗi rỗng

//     const fakeData = [
//         { shortName: 'DVS1', serviceName: 'Dịch vụ 1', time: '30 phút' },
//         { shortName: 'DVS2', serviceName: 'Dịch vụ 2', time: '45 phút' },
//         { shortName: 'DVS3', serviceName: 'Dịch vụ 3', time: '60 phút' },
//     ];

//     const toggleOpen = () => {
//         setIsOpen(!isOpen);
//     };

//     const handleSubmit = () => {
//         onHandle({ name, id, licensePlate, time });
//         onClose();
//     };

//     return (
//         <Modal show={isShowModal} onHide={onClose} size="xl">
//             <Modal.Header closeButton>
//                 <Modal.Title>Tiếp nhận khách</Modal.Title>
//             </Modal.Header>

//             <Modal.Body>
//                 <div className="d-flex">
//                     <div className="flex-shrink-0" style={{ flexBasis: '30%' }}>
//                         <div
//                             className="d-flex justify-content-between align-items-center"
//                             onClick={toggleOpen}
//                             style={{ cursor: 'pointer' }}
//                         >
//                             <span>Chức năng</span>
//                             {isOpen ? <FaChevronUp /> : <FaChevronDown />}
//                         </div>
//                         <hr />
//                         {isOpen && (
//                             <div>
//                                 <div
//                                     className="d-flex justify-content-between align-items-center mb-3"
//                                     style={{ cursor: 'pointer' }}
//                                 >
//                                     <span onClick={onClose}>Bỏ qua</span>
//                                     <FaTimes className="text-danger" />
//                                 </div>
//                                 <div
//                                     onClick={handleSubmit}
//                                     className="d-flex justify-content-between align-items-center"
//                                     style={{ cursor: 'pointer' }}
//                                 >
//                                     <span>Đồng ý</span>
//                                     <FaCheck className="text-success" />
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     <div className="flex-grow-1 ps-4">
//                         <h5>Thông tin khách hàng</h5>
//                         <Form>
//                             <div className="d-flex mb-3">
//                                 <Form.Group className="me-3" style={{ flex: 1 }}>
//                                     <Form.Label>Họ tên</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         placeholder="Nhập họ tên"
//                                         value={name}
//                                         onChange={(e) => setName(e.target.value)}
//                                     />
//                                 </Form.Group>

//                                 <Form.Group style={{ flex: 1 }}>
//                                     <Form.Label>Số thẻ</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         placeholder="Nhập số thẻ"
//                                         value={id}
//                                         onChange={(e) => setId(e.target.value)}
//                                     />
//                                 </Form.Group>
//                             </div>

//                             <div className="d-flex mb-3">
//                                 <Form.Group className="me-3" style={{ flex: 1 }}>
//                                     <Form.Label>Biển số xe</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         placeholder="Nhập biển số xe"
//                                         value={licensePlate}
//                                         onChange={(e) => setLicensePlate(e.target.value)}
//                                     />
//                                 </Form.Group>

//                                 <Form.Group style={{ flex: 1 }}>
//                                     <Form.Label>Hạng mục</Form.Label>
//                                     <Form.Select>
//                                         <option>Chọn hạng mục</option>
//                                         <option value="1">Hạng mục 1</option>
//                                         <option value="2">Hạng mục 2</option>
//                                         <option value="3">Hạng mục 3</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                             </div>

//                             <div className="d-flex mb-2">
//                                 <Form.Label>Thời gian dự kiến</Form.Label>
//                             </div>

//                             <div className="d-flex mb-2">
//                                 <Form.Group className="me-3" style={{ flex: 1 }}>
//                                     <Form.Label>Giờ</Form.Label>
//                                     <Form.Control type="text" placeholder="Giờ" />
//                                 </Form.Group>

//                                 <Form.Group style={{ flex: 1 }}>
//                                     <Form.Label>Phút</Form.Label>
//                                     <Form.Control
//                                         type="text"
//                                         placeholder="Phút"
//                                         value={time}
//                                         onChange={(e) => setTime(e.target.value)}
//                                     />
//                                 </Form.Group>
//                             </div>

//                             <div className="d-flex mb-3">
//                                 <Form.Group style={{ flex: 1 }}>
//                                     <Form.Label>Nội dung sửa chữa</Form.Label>
//                                     <Form.Select>
//                                         <option>Chọn dịch vụ</option>
//                                         <option value="1">Nội dung 1</option>
//                                         <option value="2">Nội dung 2</option>
//                                         <option value="3">Nội dung 3</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                             </div>
//                             <Form.Group className="ms-3" style={{ flex: 1 }}>
//                                 <Button variant="primary">Thêm</Button>
//                             </Form.Group>
//                         </Form>

//                         <h5 className="mt-4">Danh sách dịch vụ</h5>
//                         <Table striped bordered hover>
//                             <thead>
//                                 <tr>
//                                     <th>Tên viết tắt</th>
//                                     <th>Tên dịch vụ</th>
//                                     <th>Thời gian</th>
//                                     <th>Xóa</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {fakeData.map((item, index) => (
//                                     <tr key={index}>
//                                         <td>{item.shortName}</td>
//                                         <td>{item.serviceName}</td>
//                                         <td>{item.time}</td>
//                                         <td>
//                                             <Button variant="danger">
//                                                 <FaTrash />
//                                             </Button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </Table>
//                     </div>
//                 </div>
//             </Modal.Body>
//         </Modal>
//     );
// };

// export default ModalCreateCustomer;

import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { FaCheck, FaTimes, FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import { apiGetCategories } from '../../api/category';
import { apiGetUserById } from '../../api/user';
import Swal from 'sweetalert2';
import { apiCreateCustomer } from '../../api/customer';
import Cookies from 'js-cookie';

const ModalCreateCustomer = ({ isShowModal, onHandle, onClose, receivedCustomers }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [customer, setCustomer] = useState('');
    const [ID, setId] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [repairStartHours, setRepairStartHours] = useState('');
    const [repairStartMinutes, setRepairStartMinutes] = useState('');
    const [repairCompletionTime, setRepairCompletionTime] = useState('');
    const [customers, setCustomers] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [category, setCategory] = useState([]);
    const [services, setServices] = useState([]);
    const [storeID, setStoreId] = useState('');
    const [userId, setUserId] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [totalTime, setTotalTime] = useState(0);

    useEffect(() => {
        const fetchCategory = async () => {
            const response = await apiGetCategories();
            if (response) {
                setCategory(response.categories);
            }
        };
        fetchCategory();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = Cookies.get('token');
            if (!token) {
                console.log('Token không tồn tại, người dùng cần đăng nhập lại.');
                return;
            }
            try {
                const response = await apiGetUserById(token);
                if (response.success) {
                    setStoreId(response.rs.storeId);
                    setUserId(response.rs._id);
                    setFirstName(response.rs.firstName);
                    setLastName(response.rs.lastName);
                    setTokenExpiration();
                } else {
                    console.log('Lỗi xác thực người dùng:', response.data.message);
                }
            } catch (error) {
                handleError(error);
            }
        };

        const setTokenExpiration = () => {
            const expirationTime = 6000 * 1000;
            const timeoutId = setTimeout(handleTokenExpired, expirationTime);
            return () => clearTimeout(timeoutId);
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
                    window.location.href = '/login';
                }
            });
        };

        const handleError = (error) => {
            if (error.response && error.response.status === 402) {
                handleTokenExpired();
            } else {
                console.error('Lỗi từ server:', error.response?.data || error.message);
            }
        };

        fetchUserData();
    }, []);

    const toggleOpen = () => setIsOpen((prev) => !prev);

    const handleSubmit = async () => {
        const token = Cookies.get('token');
        const repairStartTimeFromInput = (parseInt(repairStartHours) || 0) * 60 + (parseInt(repairStartMinutes) || 0);
        const repairStartTime = repairStartTimeFromInput || totalTime; // Use input or total time

        const newCustomer = {
            fullName: customer,
            cardNumber: ID,
            licensePlate: licensePlate,
            repairStartTime: repairStartTime,
            repairCompletionTime: repairCompletionTime || repairStartTime,
            services: services.map((service) => ({
                _id: service._id,
                abbreviation: service.abbreviation,
                time: service.time,
                name: service.name,
            })),
            userId: userId,
            firstName: firstName,
            lastName: lastName,
            storeId: storeID,
        };

        console.log('Payload to create customer:', newCustomer); // Check payload

        try {
            const response = await apiCreateCustomer(newCustomer, token);

            if (response.success === true) {
                toast.success('Khách hàng đã được thêm thành công');
                onHandle(newCustomer);
                onClose();
            }
        } catch (error) {
            console.error('Lỗi khi thêm khách hàng:', error);
            toast.error('Có lỗi xảy ra khi thêm khách hàng');
        }
    };

    const handleDelete = (index) => {
        const updatedServices = services.filter((_, i) => i !== index);
        setServices(updatedServices);
        toast.success('Xóa dịch vụ thành công');
        setShowConfirm(false);
        setSelectedIndex(null);
        calculateTotalTime(updatedServices); // Recalculate total time after deletion
    };

    const handleServiceSelect = () => {
        const selectedServiceData = category.find((service) => service._id === selectedService);
        if (selectedServiceData && !services.some((s) => s._id === selectedServiceData._id)) {
            setServices((prevServices) => [
                ...prevServices,
                {
                    _id: selectedServiceData._id,
                    name: selectedServiceData.name,
                    abbreviation: selectedServiceData.abbreviation,
                    time: selectedServiceData.time,
                },
            ]);

            setSelectedService('');
            toast.success(`Thêm dịch vụ: ${selectedServiceData.name} thành công`);
            calculateTotalTime([...services, selectedServiceData]); // Calculate total time after adding a service
        } else {
            toast.error('Dịch vụ đã được thêm hoặc không hợp lệ.');
        }
    };

    // Function to calculate total time
    const calculateTotalTime = (servicesArray) => {
        const total = servicesArray.reduce((sum, service) => sum + (service.time || 0), 0);
        setTotalTime(total);
    };

    useEffect(() => {
        calculateTotalTime(services);
    }, [services]);

    return (
        <Modal show={isShowModal} onHide={onClose} size="lg" className="modal-responsive">
            <Modal.Header closeButton>
                <Modal.Title>Tiếp nhận khách</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="d-flex flex-column flex-md-row">
                    <div className="flex-shrink-0" style={{ flexBasis: '30%' }}>
                        <div
                            className="d-flex justify-content-between align-items-center"
                            onClick={toggleOpen}
                            style={{ cursor: 'pointer' }}
                        >
                            <span>Chức năng</span>
                            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                        <hr />
                        {isOpen && (
                            <div>
                                <div
                                    className="d-flex justify-content-between align-items-center mb-3"
                                    style={{ cursor: 'pointer' }}
                                    onClick={onClose}
                                >
                                    <span>Bỏ qua</span>
                                    <FaTimes className="text-danger" />
                                </div>
                                <div
                                    className="d-flex justify-content-between align-items-center"
                                    style={{ cursor: 'pointer' }}
                                    onClick={handleSubmit}
                                >
                                    <span>Đồng ý</span>
                                    <FaCheck className="text-success" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-grow-1 ps-4">
                        <h5>Thông tin khách hàng</h5>
                        <Form>
                            <div className="row mb-3 customer-container">
                                <div className="col-12 col-md-6">
                                    <Form.Group>
                                        <Form.Label>Họ tên</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập họ tên"
                                            value={customer}
                                            onChange={(e) => setCustomer(e.target.value)}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-12 col-md-6">
                                    <Form.Group>
                                        <Form.Label>Số Thẻ</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập số thẻ"
                                            value={ID}
                                            onChange={(e) => setId(e.target.value)}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                            <div className="row mb-3 customer-container">
                                <div className="col-12 col-md-6">
                                    <Form.Group>
                                        <Form.Label>Biển số xe</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập biển số xe"
                                            value={licensePlate}
                                            onChange={(e) => setLicensePlate(e.target.value)}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-12 col-md-6">
                                    <Form.Group>
                                        <Form.Label>Thời gian dự kiến</Form.Label>
                                        <div className="d-flex align-items-center">
                                            <Form.Select
                                                className="me-2"
                                                value={repairStartHours}
                                                onChange={(e) => setRepairStartHours(e.target.value)}
                                            >
                                                <option value="">Giờ</option>
                                                {Array.from({ length: 24 }, (_, i) => (
                                                    <option key={i} value={i}>
                                                        {i < 10 ? `0${i}` : i}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                            <Form.Select
                                                value={repairStartMinutes}
                                                onChange={(e) => setRepairStartMinutes(e.target.value)}
                                            >
                                                <option value="">Phút</option>
                                                {Array.from({ length: 60 }, (_, i) => (
                                                    <option key={i} value={i}>
                                                        {i < 10 ? `0${i}` : i}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </div>
                                    </Form.Group>
                                </div>
                            </div>

                            <div className="row mb-3 customer-container">
                                <div className="col-12 col-md-6">
                                    <Form.Group>
                                        <Form.Label>Thời gian hoàn thành</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập thời gian hoàn thành"
                                            value={repairCompletionTime}
                                            onChange={(e) => setRepairCompletionTime(e.target.value)}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-12 col-md-6">
                                    <Form.Group>
                                        <Form.Label>Tổng thời gian</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Tổng thời gian"
                                            value={totalTime}
                                            readOnly
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                        </Form>

                        <h5 className="mt-4">Dịch vụ</h5>
                        <Form.Select
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            className="mb-3"
                        >
                            <option value="">Chọn dịch vụ</option>
                            {category.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </Form.Select>
                        <Button onClick={handleServiceSelect}>Thêm dịch vụ</Button>

                        <div className="table-create-customer">
                            <Table striped bordered hover className="mt-3">
                                <thead>
                                    <tr>
                                        <th>Dịch vụ</th>
                                        <th>Thời gian</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {services.map((service, index) => (
                                        <tr key={index}>
                                            <td>{service.name}</td>
                                            <td>{service.time} phút</td>
                                            <td>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => {
                                                        setShowConfirm(true);
                                                        setSelectedIndex(index);
                                                    }}
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ModalCreateCustomer;
