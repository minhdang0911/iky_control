import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { FaCheck, FaTimes, FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { apiGetCategories } from '../../api/category';
import { apiGetLiftTable } from '../../api/lifttable';
import moment from 'moment';

const ModalReceivingCustomer = ({ isShowModal, onHandle, onClose, receivedCustomers, dataUser, selectedCustomer }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [customer, setCustomer] = useState('');
    const [ID, setId] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [time, setTime] = useState(0); // Tổng thời gian tính bằng phút
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [customers, setCustomers] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [category, setCategory] = useState([]);
    const [liftTable, setLiftTable] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(''); // Trạng thái dịch vụ được chọn

    useEffect(() => {
        console.log('Selected Customer in Modal:', selectedCustomer);
        if (selectedCustomer) {
            setCustomer(selectedCustomer.fullName);
            setId(selectedCustomer.ID);
            setLicensePlate(selectedCustomer.licensePlate);
            setTime(selectedCustomer.repairStartTime || 0); // Khởi tạo thời gian
            setServices(selectedCustomer.services || []);

            const totalMinutes = selectedCustomer.repairStartTime || 0;
            setHours(Math.floor(totalMinutes / 60));
            setMinutes(totalMinutes % 60);
        }
    }, [selectedCustomer]);

    useEffect(() => {
        const savedCustomers = JSON.parse(localStorage.getItem('customers')) || [];
        setCustomers(savedCustomers);
    }, []);

    useEffect(() => {
        setCustomers((prev) => [...prev, ...receivedCustomers]);
    }, [receivedCustomers]);

    const toggleOpen = () => setIsOpen((prev) => !prev);

    const handleSubmit = () => {
        const newCustomer = { customer, ID, licensePlate, time };
        const updatedCustomers = [...customers, newCustomer];

        localStorage.setItem('customers', JSON.stringify(updatedCustomers));
        setCustomers(updatedCustomers);
        onHandle(newCustomer);
        onClose();
    };

    const handleAddService = () => {
        const selectedCategory = category.find((cat) => cat._id === selectedService);
        if (selectedCategory) {
            const serviceTime = selectedCategory.time || 0; // Lấy thời gian dịch vụ
            setServices((prev) => [
                ...prev,
                {
                    _id: selectedCategory._id,
                    name: selectedCategory.name,
                    abbreviation: selectedCategory.abbreviation,
                    time: serviceTime,
                },
            ]);

            // Cập nhật thời gian
            setTime((prevTime) => {
                const newTime = prevTime + serviceTime;
                const newHours = Math.floor(newTime / 60);
                const newMinutes = newTime % 60;
                setHours(newHours); // Cập nhật giờ
                setMinutes(newMinutes); // Cập nhật phút
                console.log('New total time:', newTime);
                return newTime;
            });

            setSelectedService(''); // Reset trạng thái dịch vụ được chọn
        } else {
            toast.error('Vui lòng chọn một dịch vụ hợp lệ');
        }
    };

    const handleDeleteService = () => {
        const deletedServiceTime = services[selectedIndex]?.time || 0; // Lấy thời gian dịch vụ bị xóa
        setServices((prev) => prev.filter((_, index) => index !== selectedIndex));
        setTime((prevTime) => prevTime - deletedServiceTime); // Giảm thời gian khi xóa dịch vụ
        setShowConfirm(false);
        setSelectedIndex(null);
        toast.success('Dịch vụ đã được xóa');
    };

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
        const { storeId } = dataUser;
        const fetchLiftTables = async () => {
            const response = await apiGetLiftTable(storeId);
            if (response.success === true) {
                setLiftTable(response.data);
            }
        };
        fetchLiftTables();
    }, []);

    return (
        <>
            <Modal show={isShowModal} onHide={onClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Tiếp nhận khách</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="d-flex">
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
                                <div className="mb-3">
                                    <Form.Group>
                                        <Form.Label>Bàn nâng</Form.Label>
                                        <Form.Select className="input-customer">
                                            <option>Chọn bàn nâng</option>
                                            {liftTable
                                                ?.filter((item) => moment(item.createdAt).isSame(moment(), 'day'))
                                                .map((item) => (
                                                    <option value={item?._id} key={item?._id}>
                                                        {`Bàn nâng ${item?.number}`}
                                                    </option>
                                                ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>

                                <div className="mb-2">
                                    <Form.Label>Thời gian dự kiến</Form.Label>
                                </div>

                                <div className="row mb-2 customer-container">
                                    <div className="col-12 col-md-6">
                                        <Form.Group>
                                            <Form.Label>Giờ</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Giờ"
                                                value={hours}
                                                onChange={(e) => setHours(e.target.value)}
                                                className="input-customer"
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <Form.Group>
                                            <Form.Label>Phút</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Phút"
                                                value={minutes}
                                                onChange={(e) => setMinutes(e.target.value)}
                                                className="input-customer"
                                            />
                                        </Form.Group>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <Form.Group>
                                        <Form.Label>Nội dung sửa chữa</Form.Label>
                                        <Form.Select
                                            className="input-customer"
                                            value={selectedService}
                                            onChange={(e) => setSelectedService(e.target.value)}
                                        >
                                            <option>Chọn dịch vụ</option>
                                            {category?.map((items) => (
                                                <option key={items._id} value={items._id}>
                                                    {items?.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>

                                <Form.Group className="ms-3">
                                    <Button variant="primary" onClick={handleAddService}>
                                        Thêm
                                    </Button>
                                </Form.Group>
                            </Form>

                            <h5 className="mt-4">Danh sách dịch vụ</h5>
                            <div className="table-responsive">
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Tên viết tắt</th>
                                            <th>Tên dịch vụ</th>
                                            <th>Thời gian</th>
                                            <th>Xóa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {services?.map((item, index) => (
                                            <tr key={item._id}>
                                                <td>{item?.abbreviation}</td>
                                                <td>{item?.name}</td>
                                                <td>{item?.time}</td>
                                                <td>
                                                    <Button
                                                        className="btn btn-danger"
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

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Bạn có chắc chắn muốn xóa dịch vụ này không?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleDeleteService}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalReceivingCustomer;
