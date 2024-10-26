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

const ModalCreateCustomer = ({ isShowModal, onHandle, onClose, receivedCustomers }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [customer, setCustomer] = useState('');
    const [ID, setId] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [time, setTime] = useState('');
    const [customers, setCustomers] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const [data, setData] = useState([
        { shortName: 'DVS1', serviceName: 'Dịch vụ 1', time: '30 phút' },
        { shortName: 'DVS2', serviceName: 'Dịch vụ 2', time: '45 phút' },
        { shortName: 'DVS3', serviceName: 'Dịch vụ 3', time: '60 phút' },
    ]);

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

    const handleDelete = (index) => {
        const updatedData = data.filter((_, index) => index !== selectedIndex);
        setData(updatedData);
        toast.success('Xóa thành công');
        setShowConfirm(false);
        setSelectedIndex(null);
    };

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
                                <div className="row mb-3 customer-container">
                                    <div className="col-12 col-md-6">
                                        <Form.Group>
                                            <Form.Label>Họ tên</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Nhập họ tên"
                                                value={customer}
                                                onChange={(e) => setCustomer(e.target.value)}
                                                className="input-customer"
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <Form.Group>
                                            <Form.Label>Số thẻ</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Nhập số thẻ"
                                                value={ID}
                                                onChange={(e) => setId(e.target.value)}
                                                className="input-customer"
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
                                                className="input-customer"
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <Form.Group>
                                            <Form.Label>Hạng mục</Form.Label>
                                            <Form.Select className="input-customer">
                                                <option>Chọn hạng mục</option>
                                                <option value="1">Hạng mục 1</option>
                                                <option value="2">Hạng mục 2</option>
                                                <option value="3">Hạng mục 3</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <Form.Label>Thời gian dự kiến</Form.Label>
                                </div>

                                <div className="row mb-2 customer-container">
                                    <div className="col-12 col-md-6">
                                        <Form.Group>
                                            <Form.Label>Giờ</Form.Label>
                                            <Form.Control type="text" placeholder="Giờ" className="input-customer" />
                                        </Form.Group>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <Form.Group>
                                            <Form.Label>Phút</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Phút"
                                                value={time}
                                                onChange={(e) => setTime(e.target.value)}
                                                className="input-customer"
                                            />
                                        </Form.Group>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <Form.Group>
                                        <Form.Label>Nội dung sửa chữa</Form.Label>
                                        <Form.Select className="input-customer">
                                            <option>Chọn dịch vụ</option>
                                            <option value="1">Nội dung 1</option>
                                            <option value="2">Nội dung 2</option>
                                            <option value="3">Nội dung 3</option>
                                        </Form.Select>
                                    </Form.Group>
                                </div>

                                <Form.Group className="ms-3">
                                    <Button variant="primary">Thêm</Button>
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
                                        {data?.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.shortName}</td>
                                                <td>{item.serviceName}</td>
                                                <td>{item.time}</td>
                                                <td>
                                                    <Button
                                                        className="button-important"
                                                        variant="danger"
                                                        onClick={() => {
                                                            setSelectedIndex(index);
                                                            setShowConfirm(true);
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

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa mục này?</Modal.Body>
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

export default ModalCreateCustomer;
