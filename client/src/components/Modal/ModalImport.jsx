import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { FaSave } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { apiGetCategories, apiImportCategories } from '../../api/category';
import { toast } from 'react-toastify';

const ModalImport = ({ isShowModal, onClose }) => {
    const [data, setData] = useState([]);
    const [tempData, setTempData] = useState([]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                const filteredData = jsonData
                    .map(({ Tên: name, 'Thời gian': time }) => ({ name, time }))
                    .filter(({ name, time }) => name && time); // Ensure both fields are present

                setTempData(filteredData);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    useEffect(() => {
        const fetchDataCategory = async () => {
            try {
                const response = await apiGetCategories();
                if (response && response.categories) {
                    setData(response.categories);
                } else {
                    setData([]);
                }
                console.log('data', response.categories);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setData([]);
            }
        };

        fetchDataCategory();
    }, []);

    const handleSave = async () => {
        try {
            console.log('Dữ liệu tạm thời trước khi nhập:', tempData); // Log dữ liệu tạm thời
            await apiImportCategories(tempData);
            setData((prevData) => [...prevData, ...tempData]);
            setTempData([]);
            toast.success('Import thành công');
        } catch (error) {
            console.error('Lỗi khi import:', error);
            toast.error('Import thất bại');
        }
    };

    return (
        <Modal show={isShowModal} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Khai báo danh mục thời gian sửa chữa</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col-12 col-md-3 mb-3 mb-md-0">
                        <Button variant="success" onClick={handleSave}>
                            <FaSave /> Lưu
                        </Button>
                    </div>
                    <div className="col-12 col-md-9">
                        <h5>Thông tin</h5>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="file"
                                    accept=".xlsx, .xls" // Chỉ cho phép chọn tệp Excel
                                    onChange={handleFileChange}
                                />
                            </Form.Group>
                        </Form>
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {/* Thanh cuộn */}
                            <Table striped bordered hover responsive="md">
                                <thead>
                                    <tr>
                                        <th>Tên viết tắt</th>
                                        <th>Tên</th>
                                        <th>Thời gian</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.slice(0, 8).map((items) => (
                                        <tr key={items._id}>
                                            <td>{items?.abbreviation}</td>
                                            <td>{items?.name}</td>
                                            <td>{items?.time}</td>
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

export default ModalImport;
