import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Form, Input, Select, Button, Table, Pagination, Modal, Typography } from 'antd';
import { apiGetAllTechnical, apiCreateTechnician, apiDeleteTechnician, apiUpdateTechnician } from '../../api/technical';
import { apiGetAllStore } from '../../api/store';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Text } = Typography;

const CreateTechnicianForm = () => {
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [storeId, setStoreId] = useState('');
    const [stores, setStores] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTechnicians, setTotalTechnicians] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const limit = 10;
    const [editingTechnician, setEditingTechnician] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [deletingTechnicianId, setDeletingTechnicianId] = useState(null);

    const fetchStores = async () => {
        try {
            const response = await apiGetAllStore();
            setStores(response.data);
        } catch (error) {
            console.error('Error fetching stores:', error);
            toast.error('Không thể tải cửa hàng. Vui lòng thử lại.');
        }
    };

    const fetchTechnicians = async (sortField = 'fullName', sortOrder = 'ascend') => {
        const token = localStorage.getItem('token');
        try {
            const response = await apiGetAllTechnical(token, currentPage, limit, sortField, sortOrder, searchQuery);
            setTechnicians(response.data);
            setTotalTechnicians(response.pagination.totalTechnicians);
        } catch (error) {
            console.error('Error fetching technicians:', error);
            toast.error('Không thể tải kỹ thuật viên. Vui lòng thử lại.');
        }
    };

    useEffect(() => {
        fetchStores();
        fetchTechnicians();
    }, [currentPage, searchQuery]);

    const handleModalOpen = (technician) => {
        if (technician) {
            setFullName(technician.fullName);
            setPhoneNumber(technician.phoneNumber);
            setStoreId(technician.store ? technician.store._id : '');
            setEditingTechnician(technician);
        } else {
            resetForm();
            setEditingTechnician(null);
        }
        setIsModalVisible(true);
    };

    const handleDeleteModalOpen = (id) => {
        setDeletingTechnicianId(id);
        setIsDeleteModalVisible(true);
    };

    const handleCreateTechnician = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await apiCreateTechnician(fullName, phoneNumber, storeId, token);
            handleResponse(response, 'Thêm mới thành công');
        } catch (error) {
            console.error('Error creating technician:', error);
            toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    const handleUpdateTechnician = async () => {
        const token = localStorage.getItem('token');
        if (editingTechnician) {
            try {
                const response = await apiUpdateTechnician(
                    editingTechnician._id,
                    { fullName, phoneNumber, storeId },
                    token,
                );
                handleResponse(response, 'Cập nhật kỹ thuật viên thành công');
            } catch (error) {
                console.error('Error updating technician:', error);
                toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
            }
        } else {
            toast.error('Vui lòng chọn kỹ thuật viên để cập nhật.');
        }
    };

    const handleResponse = (response, successMessage) => {
        switch (response.status) {
            case 405:
                toast.error('Số điện thoại đã được sử dụng');
                break;
            case 400:
                toast.error('Định dạng sđt không hợp lệ');
                break;
            case 404:
                toast.error('Kĩ thuật viên đã tồn tại');
                break;
            case 401:
                toast.error('Tên không được chứa số hoặc ký tự đặc biệt');
                break;
            case 201:
            case 200:
                toast.success(successMessage);
                resetForm();
                setIsModalVisible(false);
                fetchTechnicians();
                break;
            default:
                toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
                break;
        }
    };

    const resetForm = () => {
        setFullName('');
        setPhoneNumber('');
        setStoreId('');
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        try {
            await apiDeleteTechnician(deletingTechnicianId, token);
            toast.success('Xóa kỹ thuật viên thành công');
            setIsDeleteModalVisible(false);
            fetchTechnicians();
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa kỹ thuật viên');
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const startIndex = useMemo(() => (currentPage - 1) * limit + 1, [currentPage, limit]);
    const endIndex = useMemo(
        () => Math.min(currentPage * limit, totalTechnicians),
        [currentPage, totalTechnicians, limit],
    );

    const displayedTechnicians = useMemo(() => {
        return technicians
            .filter(
                (technician) =>
                    technician.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    technician.phoneNumber.includes(searchQuery),
            )
            .map((technician) => ({
                ...technician,
                store: technician.store ? technician.store.name : 'Chưa có cửa hàng',
            }));
    }, [technicians, searchQuery]);

    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'fullName',
            key: 'fullName',
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Cửa hàng',
            dataIndex: 'store',
            key: 'store',
            render: (store) => store || 'Chưa có cửa hàng',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button icon={<EditOutlined />} onClick={() => handleModalOpen(record)} style={{ marginLeft: 10 }}>
                        Sửa
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteModalOpen(record._id)}
                        danger
                        style={{ marginLeft: 10 }}
                    >
                        Xóa
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <h3>Quản Lý Kỹ Thuật Viên</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <Button icon={<PlusOutlined />} onClick={() => handleModalOpen(null)}>
                    Thêm
                </Button>
                <Input
                    placeholder="Tìm kiếm theo tên hoặc số điện thoại"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    suffix={<SearchOutlined />}
                    style={{ width: '300px' }}
                />
            </div>

            <Table
                dataSource={displayedTechnicians}
                columns={columns}
                rowKey="_id"
                pagination={false}
                scroll={{ x: 'max-content' }}
                onChange={(pagination, filters, sorter) => {
                    const sortOrder = sorter.order || 'ascend';
                    const sortField = sorter.field || 'fullName';
                    fetchTechnicians(sortField, sortOrder);
                }}
            />

            <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Text>
                    Hiển thị kỹ thuật viên từ {startIndex} đến {endIndex} trên tổng số {totalTechnicians} kỹ thuật viên.
                </Text>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <Pagination
                    current={currentPage}
                    pageSize={limit}
                    total={totalTechnicians}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                />
            </div>

            <Modal
                title={editingTechnician ? 'Sửa Kỹ Thuật Viên' : 'Thêm Kỹ Thuật Viên'}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsModalVisible(false)}>
                        Hủy
                    </Button>,
                    <Button
                        key="create"
                        type="primary"
                        onClick={handleCreateTechnician}
                        disabled={editingTechnician !== null}
                    >
                        Thêm
                    </Button>,
                    <Button
                        key="update"
                        type="primary"
                        onClick={handleUpdateTechnician}
                        disabled={editingTechnician === null}
                    >
                        Cập nhật
                    </Button>,
                ]}
            >
                <Form layout="vertical">
                    <Form.Item label="Họ tên" required>
                        <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Số điện thoại" required>
                        <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Cửa hàng">
                        <Select value={storeId} onChange={(value) => setStoreId(value)}>
                            <Option value="">Chọn cửa hàng</Option>
                            {stores.map((store) => (
                                <Option key={store._id} value={store._id}>
                                    {store.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Xóa Kỹ Thuật Viên"
                visible={isDeleteModalVisible}
                onCancel={() => setIsDeleteModalVisible(false)}
                onOk={handleDelete}
                okText="Xóa"
                cancelText="Hủy"
            >
                <Text>Bạn có chắc chắn muốn xóa kỹ thuật viên này không?</Text>
            </Modal>
        </div>
    );
};

export default CreateTechnicianForm;
