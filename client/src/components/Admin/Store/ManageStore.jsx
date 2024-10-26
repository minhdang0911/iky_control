import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { apiCreateStore, apiGetStore, apiUpdateStore, apiDeleteStore } from '../../../api/store';
import { toast } from 'react-toastify';
import { Button, Form, Input, Table, Pagination, Modal, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import './ManageStore.scss';

const { Column } = Table;

const CreateStore = () => {
    const [formData, setFormData] = useState({ name: '', address: '' });
    const [stores, setStores] = useState([]);
    const [editingStore, setEditingStore] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState({ visible: false, id: null });
    const [page, setPage] = useState(1);
    const [totalStores, setTotalStores] = useState(0);

    useEffect(() => {
        document.title = 'Quản lý cửa hàng';
        fetchStores();
    }, [page]);

    const fetchStores = useCallback(async () => {
        try {
            const response = await apiGetStore(page);
            if (response.success) {
                setStores(response.data);
                setTotalStores(response.totalStores);
            } else {
                toast.error('Không thể lấy danh sách cửa hàng');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi lấy danh sách cửa hàng.');
        }
    }, [page]);

    const handleCreateStore = useCallback(async () => {
        const payload = { name: formData.name, address: formData.address };
        try {
            const response = await apiCreateStore(payload);

            if (response.status === 400) {
                toast.error('Cửa hàng đã tồn tại');
            }

            if (response.status === 201) {
                toast.success('Tạo cửa hàng thành công!');
                fetchStores();
                resetForm();
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tạo cửa hàng.');
        }
    }, [formData, fetchStores]);

    const handleUpdateStore = useCallback(async () => {
        if (!editingStore) return; // Đảm bảo có cửa hàng để cập nhật
        const payload = { name: formData.name, address: formData.address };
        try {
            const response = await apiUpdateStore(editingStore._id, payload);
            if (response.status === 200) {
                toast.success('Cập nhật cửa hàng thành công!');
                fetchStores();
                resetForm();
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi cập nhật cửa hàng.');
        }
    }, [editingStore, formData, fetchStores]);

    const resetForm = () => {
        setFormData({ name: '', address: '' });
        setEditingStore(null);
        setShowModal(false);
    };

    const handleAddStore = () => {
        resetForm();
        setShowModal(true);
    };

    const handleEditStore = (store) => {
        setFormData({ name: store.name, address: store.address });
        setEditingStore(store);
        setShowModal(true);
    };

    const handleDeleteStore = useCallback(async () => {
        if (confirmDelete.id) {
            try {
                const response = await apiDeleteStore(confirmDelete.id);
                if (response.status === 200) {
                    toast.success('Xóa cửa hàng thành công!');
                    fetchStores();
                }
            } catch (error) {
                toast.error('Có lỗi xảy ra khi xóa cửa hàng.');
            }
        }
        setConfirmDelete({ visible: false, id: null });
    }, [confirmDelete.id, fetchStores]);

    const startIndex = useMemo(() => (page - 1) * 10 + 1, [page]);
    const endIndex = useMemo(() => Math.min(page * 10, totalStores), [page, totalStores]);

    return (
        <div className="container my-4 manage-store">
            <h2 className="mb-4">Quản lý cửa hàng</h2>

            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddStore}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 16px',
                    fontSize: '16px',
                    borderRadius: '8px',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                    marginBottom: '10px',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                }}
            >
                Thêm
            </Button>

            {/* Store Modal */}
            <Modal
                title={editingStore ? 'Cập Nhật Cửa Hàng' : 'Tạo Cửa Hàng'}
                visible={showModal}
                onCancel={resetForm}
                footer={[
                    <Button key="cancel" onClick={resetForm}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={editingStore ? handleUpdateStore : handleCreateStore}>
                        {editingStore ? 'Cập Nhật' : 'Tạo'}
                    </Button>,
                ]}
            >
                <Form layout="vertical">
                    <Form.Item label="Tên Cửa Hàng" required>
                        <Input
                            placeholder="Nhập tên cửa hàng"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Địa Chỉ" required>
                        <Input
                            placeholder="Nhập địa chỉ cửa hàng"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Confirm Delete Modal */}
            <Modal
                title="Xác nhận xóa"
                visible={confirmDelete.visible}
                onCancel={() => setConfirmDelete({ visible: false, id: null })}
                footer={[
                    <Button key="cancel" onClick={() => setConfirmDelete({ visible: false, id: null })}>
                        Hủy
                    </Button>,
                    <Button key="confirm" type="primary" danger onClick={handleDeleteStore}>
                        Xóa
                    </Button>,
                ]}
            >
                Bạn có chắc chắn muốn xóa cửa hàng này không?
            </Modal>

            <Table dataSource={stores} rowKey="_id" pagination={false} responsive bordered>
                <Column title="Tên" dataIndex="name" key="name" />
                <Column title="Địa Chỉ" dataIndex="address" key="address" />
                <Column
                    title="Hành Động"
                    key="action"
                    render={(text, store) => (
                        <Space size="middle">
                            <Button
                                icon={<EditOutlined />}
                                onClick={() => handleEditStore(store)}
                                color="primary"
                                variant="outlined"
                            >
                                Sửa
                            </Button>
                            <Button
                                icon={<DeleteOutlined />}
                                danger
                                onClick={() => setConfirmDelete({ visible: true, id: store._id })}
                            >
                                Xóa
                            </Button>
                        </Space>
                    )}
                />
            </Table>

            {/* Pagination and Page Information */}
            <div className="page-store">
                <Pagination current={page} total={totalStores} pageSize={10} onChange={setPage} />
                <div style={{ marginTop: 16 }}>
                    Hiển thị cửa hàng từ {startIndex} đến {endIndex} trên tổng số {totalStores} cửa hàng.
                </div>
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                    Trang {page} / {Math.ceil(totalStores / 10)}
                </div>
            </div>
        </div>
    );
};

export default CreateStore;
