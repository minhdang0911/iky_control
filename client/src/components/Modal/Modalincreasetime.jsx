import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { FaCheck, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ModalIncreaseTime = ({ isShowModal, onClose, onIncreaseTime }) => {
    const [isOpen, setIsOpen] = useState(true);

    const [increaseTime, setIncreaseTime] = useState('');

    const toggleOpen = () => setIsOpen((prev) => !prev);

    const handleConfirm = () => {
        const timeToIncrease = Number(increaseTime) || 0;
        console.log('Giá trị tăng:', timeToIncrease);
        onIncreaseTime(timeToIncrease);
        onClose();
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
                                    placeholder="Nhập thời gian tăng"
                                    value={increaseTime}
                                    onChange={(e) => setIncreaseTime(e.target.value)} // Cập nhật giá trị tăng
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

export default ModalIncreaseTime;
