import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { FaCheck, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ModalDecreaseTime = ({ isShowModal, onClose, onDecreaseTime }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [decreaseTime, setDecreaseTime] = useState('');

    const toggleOpen = () => setIsOpen((prev) => !prev);

    const handleConfirm = () => {
        const timeToDecrease = Number(decreaseTime); // Chuyển đổi thành số
        console.log('Giá trị giảm:', timeToDecrease); // Kiểm tra giá trị
        onDecreaseTime(timeToDecrease); // Gọi hàm onDecreaseTime
        onClose(); // Đóng modal
    };

    return (
        <Modal show={isShowModal} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh thời gian</Modal.Title>
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
                                    onClick={handleConfirm} // Gọi hàm xác nhận
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
                            <Form.Group className="mb-3 d-flex">
                                <Form.Label style={{ whiteSpace: 'nowrap' }}>Thời gian (phút)</Form.Label>
                                <Form.Control
                                    placeholder="Nhập thời gian giảm"
                                    value={decreaseTime}
                                    onChange={(e) => setDecreaseTime(e.target.value)} // Cập nhật giá trị giảm
                                    style={{ marginLeft: '10px' }}
                                    type="number"
                                />
                            </Form.Group>
                        </Form>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ModalDecreaseTime;
