import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Form, Input, Select, Button, Table, Pagination, Modal, Typography } from 'antd';
import { apiGetAllTechnical, apiCreateTechnician, apiDeleteTechnician, apiUpdateTechnician } from '../../api/technical';
import { apiGetAllStore } from '../../api/store';
import { DeleteOutlined, EditOutlined, ExportOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const { Option } = Select;
const { Text } = Typography;

const ManageTechnical = () => {
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
        document.title = 'Quản lý kĩ thuật viên';
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

    const exportToExcel = async () => {
        const allTechnicians = []; // Mảng để chứa tất cả kỹ thuật viên
        const totalPages = Math.ceil(totalTechnicians / 10); // Tính số trang

        // Lặp qua từng trang để lấy dữ liệu kỹ thuật viên
        for (let page = 1; page <= totalPages; page++) {
            try {
                const token = localStorage.getItem('token');
                const response = await apiGetAllTechnical(token, page, 10);
                allTechnicians.push(...response.data); // Lưu dữ liệu vào mảng
            } catch (error) {
                console.error('Error fetching technicians:', error);
                toast.error('Không thể tải kỹ thuật viên. Vui lòng thử lại.');
                return; // Dừng hàm nếu có lỗi
            }
        }

        const workbook = XLSX.utils.book_new();
        const currentDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-'); // Định dạng ngày

        // Tạo worksheet cho từng trang với dữ liệu riêng biệt
        for (let page = 1; page <= totalPages; page++) {
            const token = localStorage.getItem('token');
            let techniciansForPage = [];

            try {
                const response = await apiGetAllTechnical(token, page, 10);
                techniciansForPage = response.data; // Lấy dữ liệu cho trang hiện tại
            } catch (error) {
                console.error('Error fetching technicians:', error);
                toast.error('Không thể tải kỹ thuật viên. Vui lòng thử lại.');
                return; // Dừng hàm nếu có lỗi
            }

            // Chuyển đổi dữ liệu thành định dạng Excel cho trang hiện tại
            const worksheet = XLSX.utils.json_to_sheet(
                techniciansForPage.map((technician, index) => ({
                    STT: (page - 1) * 10 + index + 1, // Tính STT cho từng kỹ thuật viên
                    'Họ tên': technician.fullName,
                    'Số điện thoại': technician.phoneNumber,
                    'Cửa hàng': technician.store ? technician.store.name : 'Chưa có cửa hàng',
                })),
            );

            // Thêm worksheet vào workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, `Danh sách ${page}`);
        }

        // Xuất file
        XLSX.writeFile(workbook, `danh_sach_ki_thuat_vien-${currentDate}.xlsx`);
    };

    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'fullName',
            key: 'fullName',
            sorter: (a, b) => a.fullName.localeCompare(b.fullName),
            width: '30%',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: '30%',
        },
        {
            title: 'Cửa hàng',
            dataIndex: 'store',
            key: 'store',
            render: (store) => store || 'Chưa có cửa hàng',
            width: '30%',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleModalOpen(record)}
                        size="small"
                        style={{ marginLeft: 5 }}
                    >
                        Sửa
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteModalOpen(record._id)}
                        danger
                        size="small"
                        style={{ marginLeft: 5 }}
                    >
                        Xóa
                    </Button>
                </>
            ),
            width: '10%',
        },
    ];

    return (
        <div
            style={{
                padding: '20px',
                maxWidth: '800px',
                margin: '0 auto',
                borderRadius: '8px',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
        >
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Quản Lý Kỹ Thuật Viên</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <Button icon={<PlusOutlined />} onClick={() => handleModalOpen(null)} type="primary">
                    Thêm
                </Button>
                <Button icon={<ExportOutlined />} onClick={exportToExcel} type="default">
                    Xuất Excel
                </Button>
                <Input
                    placeholder="Tìm kiếm theo tên hoặc số điện thoại"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    suffix={<SearchOutlined />}
                    style={{ width: '300px', borderRadius: '4px' }}
                />
            </div>

            <Table
                dataSource={displayedTechnicians}
                columns={columns}
                rowKey="_id"
                pagination={false}
                scroll={{ x: '100%' }} // Điều chỉnh chiều rộng bảng
                style={{ borderRadius: '4px' }} // Thêm padding cho bảng
                onChange={(pagination, filters, sorter) => {
                    const sortOrder = sorter.order || 'ascend';
                    const sortField = sorter.field || 'fullName';
                    fetchTechnicians(sortField, sortOrder);
                }}
            />

            <Pagination
                current={currentPage}
                pageSize={limit}
                total={totalTechnicians}
                onChange={handlePageChange}
                style={{ marginTop: '16px', textAlign: 'right', display: 'flex', justifyContent: 'center' }}
            />

            <p style={{ textAlign: 'center', marginTop: '5px' }}>
                Hiển thị {startIndex} đến {endIndex} của {totalTechnicians} kĩ thuật viên
            </p>

            <Modal
                title={editingTechnician ? 'Cập nhật kỹ thuật viên' : 'Thêm kỹ thuật viên'}
                visible={isModalVisible}
                onOk={editingTechnician ? handleUpdateTechnician : handleCreateTechnician}
                onCancel={() => setIsModalVisible(false)}
                okText={editingTechnician ? 'Cập nhật' : 'Thêm'}
            >
                <Form layout="vertical">
                    <Form.Item label="Họ tên">
                        <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Số điện thoại">
                        <Input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    </Form.Item>
                    {!editingTechnician && (
                        <Form.Item label="Cửa hàng">
                            <Select value={storeId} onChange={setStoreId} placeholder="Chọn cửa hàng">
                                {stores.map((store) => (
                                    <Option key={store._id} value={store._id}>
                                        {store.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    )}
                </Form>
            </Modal>

            <Modal
                title="Xóa Kỹ Thuật Viên"
                visible={isDeleteModalVisible}
                onOk={handleDelete}
                onCancel={() => setIsDeleteModalVisible(false)}
                okText="Xóa"
                cancelText="Hủy"
                closable={false}
            >
                <Text>Bạn có chắc chắn muốn xóa kỹ thuật viên này không?</Text>
            </Modal>
        </div>
    );
};

export default ManageTechnical;
