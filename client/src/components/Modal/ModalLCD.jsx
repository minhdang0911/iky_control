// import React, { useState } from 'react';
// import Modal from 'react-bootstrap/Modal';
// import Form from 'react-bootstrap/Form';
// import { FaCheck, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// const ModalLCD = ({ isShowModal, onClose }) => {
//     const [isOpen, setIsOpen] = useState(true);

//     const toggleOpen = () => {
//         setIsOpen(!isOpen);
//     };

//     const colors = [
//         { code: '128,255,128', label: '128,255,128' },
//         { code: '255,255,255', label: '255,255,255' },
//         { code: '111,222,333', label: '111,222,333' },
//         { code: '145,222,141', label: '145,222,141' },
//     ];

//     const customerColors = [
//         { code: '255,225,128', label: '255,225,128' },
//         { code: '169,169,169', label: '169,169,169' },
//         { code: '254,254,254', label: '254,254,254' },
//         { code: '65,65,77', label: '65,65,77' },
//     ];

//     return (
//         <>
//             <Modal show={isShowModal} onHide={onClose} size="lg">
//                 <Modal.Header closeButton>
//                     <Modal.Title>Cấu hình thông số hiển thị LCD</Modal.Title>
//                 </Modal.Header>

//                 <Modal.Body>
//                     <div className="d-flex">
//                         <div className="flex-shrink-0" style={{ flexBasis: '30%' }}>
//                             <div
//                                 className="d-flex justify-content-between align-items-center"
//                                 onClick={toggleOpen}
//                                 style={{ cursor: 'pointer' }}
//                             >
//                                 <span>Chức năng</span>
//                                 {isOpen ? <FaChevronUp /> : <FaChevronDown />}
//                             </div>
//                             <hr />
//                             {isOpen && (
//                                 <div>
//                                     <div className="d-flex justify-content-between align-items-center mb-3">
//                                         <span>Bỏ qua</span>
//                                         <FaTimes className="text-danger" style={{ cursor: 'pointer' }} />
//                                     </div>
//                                     <div className="d-flex justify-content-between align-items-center">
//                                         <span>Đồng ý</span>
//                                         <FaCheck className="text-success" style={{ cursor: 'pointer' }} />
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         <div className="flex-grow-1 ps-4">
//                             <h5>Thông tin</h5>
//                             <Form>
//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Header:</Form.Label>
//                                     <Form.Control type="text" />
//                                 </Form.Group>
//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Footer:</Form.Label>
//                                     <Form.Control type="text" />
//                                 </Form.Group>
//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Số dòng hiển thị dữ liệu:</Form.Label>
//                                     <Form.Control type="text" />
//                                 </Form.Group>
//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Thời gian hiển thị:</Form.Label>
//                                     <Form.Control type="text" />
//                                 </Form.Group>
//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Tốc độ hiệu ứng thông báo:</Form.Label>
//                                     <Form.Control type="text" />
//                                 </Form.Group>
//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Số lần hiển thị thông báo:</Form.Label>
//                                     <Form.Control type="text" />
//                                 </Form.Group>

//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Màu chữ hiển thị thông báo</Form.Label>
//                                     <Form.Select>
//                                         {colors.map((color) => (
//                                             <option key={color.code} value={color.code}>
//                                                 {color.label}
//                                             </option>
//                                         ))}
//                                     </Form.Select>
//                                 </Form.Group>

//                                 <Form.Group className="mb-3">
//                                     <Form.Label>Màu chữ TT khách hàng</Form.Label>
//                                     <Form.Select>
//                                         {customerColors.map((color) => (
//                                             <option key={color.code} value={color.code}>
//                                                 {color.label}
//                                                 <div
//                                                     className="color-box"
//                                                     style={{
//                                                         backgroundColor: `rgb(${color.code})`,
//                                                         width: '20px',
//                                                         height: '20px',
//                                                     }}
//                                                 >
//                                                     hi
//                                                 </div>
//                                             </option>
//                                         ))}
//                                     </Form.Select>
//                                 </Form.Group>
//                             </Form>
//                         </div>
//                     </div>
//                 </Modal.Body>

//                 {/* <Modal.Footer>
//                     <Button variant="secondary" onClick={onClose}>
//                         Close
//                     </Button>
//                     <Button variant="primary">Save changes</Button>
//                 </Modal.Footer> */}
//             </Modal>
//         </>
//     );
// };

// export default ModalLCD;

import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import { FaCheck, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ModalLCD = ({ isShowModal, onClose }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const colors = [
        { code: '128,255,128', label: '128,255,128' },
        { code: '255,255,255', label: '255,255,255' },
        { code: '111,222,333', label: '111,222,333' },
        { code: '145,222,141', label: '145,222,141' },
        { code: '22,22,33', label: '22,22,33' },
    ];

    const customerColors = [
        { code: '255,225,128', label: '255,225,128' },
        { code: '169,169,169', label: '169,169,169' },
        { code: '254,254,254', label: '254,254,254' },
        { code: '65,65,77', label: '65,65,77' },
    ];

    const createColorOptions = (colorArray) =>
        colorArray.map((color) => ({
            value: color.code,
            label: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                        style={{
                            backgroundColor: `rgb(${color.code})`,
                            width: '20px',
                            height: '20px',
                            marginRight: '10px',
                            border: '1px solid #000',
                        }}
                    ></div>
                    {color.label}
                </div>
            ),
        }));

    const colorOptions = createColorOptions(colors);
    const customerColorOptions = createColorOptions(customerColors);

    return (
        <Modal show={isShowModal} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Cấu hình thông số hiển thị LCD</Modal.Title>
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
                            {[
                                'Header',
                                'Footer',
                                'Số dòng hiển thị dữ liệu',
                                'Thời gian hiển thị',
                                'Tốc độ hiệu ứng thông báo',
                                'Số lần hiển thị thông báo',
                            ].map((label, index) => (
                                <Form.Group key={index} className="mb-3">
                                    <Form.Label>{label}:</Form.Label>
                                    <Form.Control type="text" />
                                </Form.Group>
                            ))}

                            <Form.Group className="mb-3">
                                <Form.Label>Màu chữ hiển thị thông báo</Form.Label>
                                <Select options={colorOptions} />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Màu chữ TT khách hàng</Form.Label>
                                <Select options={customerColorOptions} />
                            </Form.Group>
                        </Form>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ModalLCD;
