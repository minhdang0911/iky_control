import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { FaCheck, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ModalUpdateDatabase = ({ isShowModal, onClose }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleOpen = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <Modal show={isShowModal} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật bảng Leb</Modal.Title>
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
                                >
                                    <span onClick={onClose}>Bỏ qua</span>
                                    <FaTimes className="text-danger" />
                                </div>
                                <div
                                    className="d-flex justify-content-between align-items-center"
                                    style={{ cursor: 'pointer' }}
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
                            {['Host', 'Port', 'Name instanced', 'Database', 'User Name', 'Password', 'Schema'].map(
                                (label, index) => (
                                    <Form.Group className="d-flex mt-3" key={index}>
                                        <Form.Label style={{ whiteSpace: 'nowrap' }}>{label}</Form.Label>
                                        <Form.Control type="text" style={{ marginLeft: '10px' }} />
                                    </Form.Group>
                                ),
                            )}
                        </Form>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ModalUpdateDatabase;
