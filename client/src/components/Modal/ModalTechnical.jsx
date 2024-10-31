import React, { useEffect, useState, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { FaPlus, FaEdit, FaSave } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { apiGetTechnicalByStore } from '../../api/store';
import { apiCreateTechnician, apiDeleteTechnician, apiUpdateTechnician } from '../../api/technical';

const ModalTechnical = ({ dataUser, isShowModal, onClose }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [data, setData] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const { storeId } = dataUser;

    const fetchTechnicalByStore = useCallback(async () => {
        if (!storeId) return;
        try {
            const response = await apiGetTechnicalByStore(storeId);
            if (response.data) {
                setData(response.data);
            }
        } catch (error) {
            console.error('Error fetching technicians:', error);
            toast.error('Có lỗi xảy ra khi lấy danh sách kỹ thuật viên.');
        }
    }, [storeId]);

    useEffect(() => {
        if (isShowModal) {
            fetchTechnicalByStore();
        }
    }, [isShowModal, fetchTechnicalByStore]);

    const handleAddTechnician = async () => {
        if (name && phone) {
            if (!/^(0\d{9})$/.test(phone)) {
                return toast.error('Số điện thoại không hợp lệ');
            }
            if (/[^a-zA-ZÀ-ỹ\s]/.test(name)) {
                return toast.error('Tên không được chứa số hoặc ký tự đặc biệt');
            }
            try {
                const token = localStorage.getItem('token');
                const response = await apiCreateTechnician(name, phone, storeId, token);
                if (response.status === 201) {
                    toast.success('Thêm mới kỹ thuật viên thành công');
                    resetForm();
                    fetchTechnicalByStore();
                } else if (response.status === 405) {
                    toast.error('Số điện thoại đã được sử dụng');
                }
            } catch (error) {
                console.error('Error adding technician:', error);
                if (error.response && error.response.status !== 405) {
                    toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
                }
            }
        } else {
            toast.error('Vui lòng điền đầy đủ thông tin.');
        }
    };

    const handleUpdateTechnician = async () => {
        const token = localStorage.getItem('token');
        if (selectedIndex !== null) {
            const updatedTechnicianId = data[selectedIndex]._id;
            if (!/^(0\d{9})$/.test(phone)) {
                return toast.error('Định dạng số điện thoại không hợp lệ');
            }
            try {
                const response = await apiUpdateTechnician(
                    updatedTechnicianId,
                    { fullName: name, phoneNumber: phone },
                    token,
                );
                if (response.status === 200) {
                    const updatedData = [...data];
                    updatedData[selectedIndex] = { ...updatedData[selectedIndex], fullName: name, phoneNumber: phone };
                    setData(updatedData);
                    toast.success('Cập nhật kỹ thuật viên thành công');
                    resetForm();
                } else if (response.status === 400) {
                    toast.error('Số điện thoại đã được sử dụng');
                } else if (response.status === 401) {
                    toast.error('Tên không được chứa số hoặc ký tự đặc biệt');
                }
            } catch (error) {
                console.error('Error updating technician:', error);
            }
        } else {
            toast.error('Vui lòng chọn kỹ thuật viên để cập nhật.');
        }
    };

    const handleSave = () => {
        if (selectedIndex !== null) {
            handleUpdateTechnician();
        } else {
            handleAddTechnician();
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        if (selectedIndex !== null) {
            const technicianId = data[selectedIndex]._id;
            try {
                await apiDeleteTechnician(technicianId, token);
                toast.success('Xóa thành công');
                setData(data.filter((_, index) => index !== selectedIndex));
            } catch (error) {
                console.error('Error deleting technician:', error);
                toast.error('Có lỗi xảy ra khi xóa kỹ thuật viên.');
            } finally {
                resetForm();
                setShowConfirm(false);
            }
        }
    };

    const resetForm = () => {
        setName('');
        setPhone('');
        setSelectedIndex(null);
    };

    const handleRowClick = (index) => {
        const selectedItem = data[index];
        setSelectedIndex(index);
        setName(selectedItem.fullName);
        setPhone(selectedItem.phoneNumber);
    };

    return (
        <>
            <Modal show={isShowModal} onHide={onClose} size="lg" className="modal-technical">
                <Modal.Header closeButton>
                    <Modal.Title>Khai báo kỹ thuật viên</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex">
                        <div className="flex-shrink-0" style={{ flexBasis: '30%' }}>
                            <div className="d-flex flex-column">
                                <Button variant="primary" className="mb-2" onClick={resetForm}>
                                    <FaPlus /> Thêm mới
                                </Button>
                                <Button
                                    variant="warning"
                                    className="mb-2"
                                    onClick={() => {
                                        if (selectedIndex !== null) handleRowClick(selectedIndex);
                                        else toast.error('Vui lòng chọn kỹ thuật viên để sửa.');
                                    }}
                                >
                                    <FaEdit /> Sửa
                                </Button>
                                <Button variant="danger" className="mb-2" onClick={() => setShowConfirm(true)}>
                                    <IoClose /> Xóa
                                </Button>
                                <Button variant="success" onClick={handleSave}>
                                    <FaSave /> Lưu
                                </Button>
                            </div>
                        </div>
                        <div className="flex-grow-1 ps-4">
                            <h5>Thông tin</h5>
                            <Form>
                                <div className="d-flex mb-3 container-technical">
                                    <Form.Group className="me-3" style={{ flex: 1 }}>
                                        <Form.Label>Họ tên(*)</Form.Label>
                                        <Form.Control
                                            className="input-technical"
                                            type="text"
                                            placeholder="Nhập họ tên"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group style={{ flex: 1 }}>
                                        <Form.Label>Số điện thoại</Form.Label>
                                        <Form.Control
                                            className="input-technical"
                                            type="text"
                                            placeholder="Nhập số điện thoại"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </Form.Group>
                                </div>
                            </Form>
                            <Table striped bordered hover className="table-technical">
                                <thead>
                                    <tr>
                                        <th>Họ và tên</th>
                                        <th>Số điện thoại</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.map((item, index) => (
                                        <tr key={item._id} onClick={() => handleRowClick(index)}>
                                            <td>{item.fullName}</td>
                                            <td>{item.phoneNumber}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có muốn xóa kĩ thuật viên này</Modal.Body>
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

export default ModalTechnical;
