import React, { useCallback, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import { FaPlus, FaEdit, FaSave, FaTrash } from 'react-icons/fa';
import { Container, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { apiCreateCategory, apiDeleteCategory, apiGetCategories, apiUpdateCategory } from '../../api/category';

const ModalCategory = ({ isShowModal, onClose, token }) => {
    const [name, setName] = useState('');
    const [time, setTime] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [dataCategory, setDataCategory] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [searchAbbreviation, setSearchAbbreviation] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await apiGetCategories();
            setDataCategory(response.categories);
            setFilteredCategories(response.categories);
        } catch (error) {
            console.error('Không thể lấy danh mục:', error);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        setFilteredCategories(dataCategory); // Đồng bộ hóa filteredCategories khi dataCategory thay đổi
    }, [dataCategory]);

    const handleSave = async () => {
        const token = localStorage.getItem('token');
        if (name && time !== '') {
            try {
                const payload = {
                    name,
                    time: parseInt(time, 10),
                };

                if (selectedIndex !== null) {
                    // Chế độ sửa
                    const categoryId = dataCategory[selectedIndex]._id;
                    const response = await apiUpdateCategory(categoryId, payload, token);

                    if (response && response.status === 200 && response.success) {
                        const updatedCategory = response.category;
                        setDataCategory((prevCategories) =>
                            prevCategories.map((category, index) =>
                                index === selectedIndex ? updatedCategory : category,
                            ),
                        );
                        toast.success('Cập nhật danh mục thành công!');
                    } else {
                        toast.error(response.message || 'Có lỗi xảy ra khi cập nhật danh mục');
                    }
                } else {
                    // Chế độ thêm mới
                    const response = await apiCreateCategory(payload, token);
                    if (response && response.status === 201 && response.success) {
                        const newCategory = response.category;
                        setDataCategory((prevCategories) => [...prevCategories, newCategory]);
                        toast.success('Thêm mới danh mục thành công!');
                    } else {
                        toast.error(response.message || 'Có lỗi xảy ra khi thêm danh mục');
                    }
                }

                resetForm();
            } catch (error) {
                toast.error('Lỗi: Không thể thêm hoặc cập nhật danh mục');
            }
        } else {
            toast.error('Vui lòng điền đầy đủ thông tin!');
        }
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        if (selectedIndex !== null) {
            const categoryId = dataCategory[selectedIndex]._id;

            try {
                await apiDeleteCategory(categoryId, token);
                toast.success('Xóa thành công');

                setDataCategory((prevCategories) => {
                    const newCategories = prevCategories.filter((_, index) => index !== selectedIndex);
                    return newCategories;
                });

                resetForm();
            } catch (error) {
                console.error('Error deleting category:', error);
                toast.error('Có lỗi xảy ra khi xóa danh mục.');
            }
        }
    };

    const resetForm = () => {
        setName('');
        setTime('');
        setSelectedIndex(null);
        setSearchAbbreviation('');
    };

    const handleRowClick = (index) => {
        const selectedItem = filteredCategories[index];
        setSelectedIndex(dataCategory.indexOf(selectedItem));
        setName(selectedItem.name);
        setTime(selectedItem.time);
    };

    const handleFind = () => {
        const foundCategory = dataCategory.filter((item) => item.abbreviation === searchAbbreviation);
        if (foundCategory.length > 0) {
            setFilteredCategories(foundCategory);
            setSelectedIndex(0);
            setName(foundCategory[0].name);
            setTime(foundCategory[0].time);
        } else {
            toast.error('Không tìm thấy danh mục với tên viết tắt này.');
            setFilteredCategories([]);
        }
    };

    const handleClear = () => {
        setSearchAbbreviation('');
        setFilteredCategories(dataCategory);
    };

    return (
        <>
            <Modal show={isShowModal} onHide={onClose} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Khai báo danh mục thời gian sửa chữa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container fluid>
                        <Row>
                            <Col xs={12} md={4} className="mb-3">
                                <div className="d-flex flex-column">
                                    <Button variant="primary" className="mb-2" onClick={resetForm}>
                                        <FaPlus /> Thêm mới
                                    </Button>

                                    <Button
                                        variant="warning"
                                        className="mb-2"
                                        onClick={() => {
                                            if (selectedIndex !== null) {
                                                const selectedItem = filteredCategories[selectedIndex];
                                                setName(selectedItem.name);
                                                setTime(selectedItem.time);
                                            }
                                        }}
                                    >
                                        <FaEdit /> Sửa
                                    </Button>

                                    <Button variant="success" onClick={handleSave}>
                                        <FaSave /> Lưu
                                    </Button>
                                </div>
                            </Col>
                            <Col xs={12} md={8}>
                                <h5>Thông tin</h5>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tên</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập tên"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Thời gian (phút)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Nhập thời gian (phút)"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3 d-flex align-items-center">
                                        <Form.Control
                                            type="text"
                                            placeholder="Nhập tên viết tắt để tìm"
                                            value={searchAbbreviation}
                                            onChange={(e) => setSearchAbbreviation(e.target.value)}
                                        />
                                        <Button variant="primary" onClick={handleFind} className="ms-2">
                                            Tìm
                                        </Button>
                                        <Button variant="secondary" onClick={handleClear} className="ms-2">
                                            Xóa
                                        </Button>
                                    </Form.Group>
                                </Form>
                                <div className="table-category-responsive">
                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        <Table striped bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>Tên viết tắt</th>
                                                    <th>Tên</th>
                                                    <th>Thời gian (phút)</th>
                                                    <th>Xóa</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredCategories.slice(0, 500).map((item, index) => (
                                                    <tr key={item._id} onClick={() => handleRowClick(index)}>
                                                        <td>{item.abbreviation}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.time || '-'}</td>
                                                        <td>
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedIndex(index);
                                                                    setShowConfirm(true);
                                                                }}
                                                                className="btn-delete-category"
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
                            </Col>
                        </Row>
                    </Container>
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

export default ModalCategory;
