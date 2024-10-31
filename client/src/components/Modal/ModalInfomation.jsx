import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import logo from '../../assets/img/logo.png';

const ModalInformation = ({ isShowModal, onClose }) => {
    return (
        <Modal show={isShowModal} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>About IKY.Control</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="d-flex">
                    <div className="flex-shrink-0" style={{ width: '30%' }}>
                        <img src={logo} alt="IKY Logo" style={{ width: '100%' }} loading="lazy" />
                    </div>

                    <div className="flex-grow-1 ps-4">
                        <h5 style={{ fontSize: '30px' }}>IKY Control</h5>
                        <p style={{ fontSize: '30px' }}>Version 1.5.1.5</p>
                        <p style={{ fontSize: '30px' }}>Copyright © IKY 2017</p>
                        <p style={{ fontSize: '30px' }}>Công ty cổ phần công nghệ tiện ích thông minh</p>

                        <Form.Group className="mb-3">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                readOnly
                                defaultValue="Bên bạn khi cần"
                                style={{ resize: 'none' }}
                            />
                        </Form.Group>
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Ok
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalInformation;
