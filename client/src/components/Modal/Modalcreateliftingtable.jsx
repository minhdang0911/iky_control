import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { FaCheck, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { apiCreateLiftTable } from '../../api/lifttable';
import { apiGetTechnicalByStore } from '../../api/store';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const ModalCreateLiftingTable = ({ isShowModal, onClose, onAddCars }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [liftingTable, setLiftingTable] = useState('');
    const [description, setDescription] = useState('');
    const [technician, setTechnician] = useState('');
    const [technicians, setTechnicians] = useState([]);
    const [storeId, setStoreId] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                console.log('Token không tồn tại, người dùng cần đăng nhập lại.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/user/getUser', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.data.success) {
                    const user = response.data.rs;
                    setStoreId(user.storeId);
                    await fetchTechnicians(user.storeId);
                    setTokenExpiration();
                } else {
                    console.log('Lỗi xác thực người dùng:', response.data.message);
                }
            } catch (error) {
                handleError(error);
            }
        };

        const fetchTechnicians = async (storeId) => {
            const techniciansResponse = await apiGetTechnicalByStore(storeId);
            if (techniciansResponse.success) {
                setTechnicians(techniciansResponse.data);
            } else {
                console.log('Lỗi khi lấy danh sách kỹ thuật viên:', techniciansResponse.data.message);
            }
        };

        const setTokenExpiration = () => {
            const expirationTime = 6000 * 1000; // 10 phút
            setTimeout(handleTokenExpired, expirationTime);
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

        return () => clearTimeout(setTokenExpiration);
    }, []);

    const toggleOpen = () => setIsOpen((prev) => !prev);

    const handleSubmit = async () => {
        const data = {
            number: liftingTable,
            technician: technician,
            store: storeId,
            description: description,
        };

        try {
            const response = await apiCreateLiftTable(data);

            if (response.success) {
                // Gọi onSubmit để cập nhật dữ liệu ngay lập tức
                onAddCars({
                    _id: response.data._id,
                    number: response.data.number,
                    technician: {
                        _id: technician,
                        fullName: technicians.find((tech) => tech._id === technician)?.fullName || '',
                    },
                    store: response.data.store,
                    description: response.data.description,
                });
                toast.success('Thêm bàn nâng thành công');
                resetForm();
                onClose();
            } else {
                toast.error(response.mes || 'Lỗi: ' + response.data.mes);
            }
        } catch (error) {
            toast.error('Vui lòng đăng nhập để tạo bảng nâng');
        }
    };

    const resetForm = () => {
        setDescription('');
        setLiftingTable('');
        setTechnician('');
    };

    return (
        <Modal show={isShowModal} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Tạo bàn nâng</Modal.Title>
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
                        <h5>Thông tin</h5>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Bàn nâng</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập thông tin bàn nâng"
                                    value={liftingTable}
                                    onChange={(e) => setLiftingTable(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Kỹ thuật viên</Form.Label>
                                <Form.Select value={technician} onChange={(e) => setTechnician(e.target.value)}>
                                    <option value="">Chọn kỹ thuật viên</option>
                                    {technicians.map((tech) => (
                                        <option key={tech._id} value={tech._id}>
                                            {tech.fullName}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Mô tả</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nhập thông tin mô tả"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ModalCreateLiftingTable;
