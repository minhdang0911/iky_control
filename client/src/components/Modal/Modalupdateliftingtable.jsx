import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { apiUpdateLiftTable } from '../../api/lifttable';
import { apiGetTechnicalByStore } from '../../api/store';
import { toast } from 'react-toastify';

const ModalUpdateLiftingTable = ({ isShowModal, onClose, selectedCar, onUpdateCars, dataUser, cars }) => {
    const [liftingTable, setLiftingTable] = useState('');
    const [technician, setTechnician] = useState('');
    const [description, setDescription] = useState('');
    const [dataTech, setDataTech] = useState([]);

    const { storeId } = dataUser;

    // Gọi API để lấy danh sách kỹ thuật viên theo cửa hàng
    useEffect(() => {
        const fetchTechnicalByStore = async () => {
            try {
                const response = await apiGetTechnicalByStore(storeId);
                if (response.data) {
                    setDataTech(response.data);
                }
            } catch (error) {
                console.error('Error fetching technicians:', error);
            }
        };

        fetchTechnicalByStore();
    }, [storeId]);

    console.log('selectedCar', selectedCar);

    useEffect(() => {
        if (selectedCar) {
            setLiftingTable(selectedCar?.number || '');
            setTechnician(selectedCar?.technician._id || '');
            setDescription(selectedCar?.description || '');
        }
    }, [selectedCar]);

    // Xử lý cập nhật bàn nâng
    const handleUpdateModal = async () => {
        const updatedData = {
            number: liftingTable,
            technician,
            store: storeId, // Đảm bảo storeId có giá trị
            description,
        };

        try {
            const response = await apiUpdateLiftTable(selectedCar?._id, updatedData);

            // Kiểm tra nếu mã trạng thái là 400
            if (response.status === 400) {
                toast.error('Số bàn nâng đã tồn tại');
                return; // Thoát ra nếu có lỗi
            }

            // Kiểm tra thành công
            if (response.success) {
                const updatedCar = {
                    ...selectedCar,
                    number: response?.data?.number,
                    technician: {
                        _id: response?.data?.technician?._id, // Giữ _id
                        fullName: response?.data?.technician?.fullName, // Giữ fullName để hiển thị
                    },
                    description: response?.data?.description,
                    store: storeId,
                };
                onUpdateCars(updatedCar); // Gọi hàm updateCars với dữ liệu mới
                onClose(); // Đóng modal
                toast.success('Cập nhật thành công'); // Hiển thị toast thông báo
            }
        } catch (error) {
            console.error('Error updating lift table: ', error);
        }
    };

    return (
        <Modal show={isShowModal} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật bàn nâng</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Bàn nâng</Form.Label>
                        <Form.Control
                            type="text"
                            value={liftingTable}
                            onChange={(e) => setLiftingTable(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Kỹ thuật viên</Form.Label>
                        <Form.Select
                            aria-label="Chọn kỹ thuật viên"
                            value={technician}
                            onChange={(e) => setTechnician(e.target.value)}
                        >
                            {/* Hiển thị kỹ thuật viên đã chọn */}
                            {selectedCar && selectedCar?.technician && (
                                <option value={selectedCar?.technician?._id}>
                                    {selectedCar?.technician?.fullName}
                                </option>
                            )}
                            {/* Hiển thị các kỹ thuật viên từ dataTech, loại trừ kỹ thuật viên đã chọn */}
                            {dataTech
                                .filter((tech) => tech?._id !== selectedCar?.technician?._id)
                                .map((tech) => (
                                    <option key={tech?._id} value={tech?._id}>
                                        {tech?.fullName}
                                    </option>
                                ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <button onClick={handleUpdateModal}>Cập nhật</button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalUpdateLiftingTable;
