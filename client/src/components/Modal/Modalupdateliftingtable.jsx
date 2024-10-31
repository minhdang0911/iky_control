import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Button } from 'antd';
import { apiUpdateLiftTable } from '../../api/lifttable';
import { apiGetTechnicalByStore } from '../../api/store';
import { toast } from 'react-toastify';

const ModalUpdateLiftingTable = ({ isShowModal, onClose, selectedCar, onUpdateCars, dataUser }) => {
    const [liftingTable, setLiftingTable] = useState('');
    const [technician, setTechnician] = useState('');
    const [description, setDescription] = useState('');
    const [dataTech, setDataTech] = useState([]);

    const { storeId } = dataUser;

    // Fetch technicians only when storeId changes
    const fetchTechnicalByStore = useCallback(async () => {
        if (!storeId) return;

        try {
            const response = await apiGetTechnicalByStore(storeId);
            if (response.data) {
                setDataTech(response.data);
            }
        } catch (error) {
            console.error('Error fetching technicians:', error);
        }
    }, [storeId]);

    useEffect(() => {
        fetchTechnicalByStore();
    }, [fetchTechnicalByStore]);

    useEffect(() => {
        if (selectedCar) {
            setLiftingTable(selectedCar.number || '');
            setTechnician(selectedCar.technician?._id || '');
            setDescription(selectedCar.description || '');
        }
    }, [selectedCar]);

    const handleUpdateModal = async () => {
        const updatedData = {
            number: liftingTable,
            technician,
            store: storeId,
            description,
        };

        try {
            const response = await apiUpdateLiftTable(selectedCar?._id, updatedData);

            if (response.status === 400) {
                toast.error('Số bàn nâng đã tồn tại');
                return;
            }

            if (response.success) {
                const updatedCar = {
                    ...selectedCar,
                    number: response.data?.number,
                    technician: {
                        _id: response.data?.technician?._id,
                        fullName: response.data?.technician?.fullName,
                    },
                    description: response.data?.description,
                    store: storeId,
                };
                onUpdateCars(updatedCar);
                onClose();
                toast.success('Cập nhật thành công');
            }
        } catch (error) {
            console.error('Error updating lift table:', error);
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
                            {selectedCar?.technician && (
                                <option value={selectedCar.technician._id}>{selectedCar.technician.fullName}</option>
                            )}
                            {dataTech
                                .filter((tech) => tech._id !== selectedCar?.technician?._id)
                                .map((tech) => (
                                    <option key={tech._id} value={tech._id}>
                                        {tech.fullName}
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
                <Button type="primary" onClick={handleUpdateModal}>
                    Cập nhật
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalUpdateLiftingTable;
