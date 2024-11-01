import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { apiCreateStore, apiGetStore, apiUpdateStore, apiDeleteStore } from '../../../api/store';
import { toast } from 'react-toastify';
import { Button, Form, Input, Table, Pagination, Modal, Space, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExportOutlined, SearchOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import './ManageStore.scss';
import axios from 'axios';
import Swal from 'sweetalert2';
import { apiGetUserById } from '../../../api/user';
import Cookies from 'js-cookie';

const { Column } = Table;
const { Option } = Select;

const CreateStore = ({ dataUser }) => {
    const [formData, setFormData] = useState({ name: '', address: '' });
    const [stores, setStores] = useState([]);
    const [editingStore, setEditingStore] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState({ visible: false, id: null });
    const [page, setPage] = useState(1);
    const [totalStores, setTotalStores] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [changeHistoryModalVisible, setChangeHistoryModalVisible] = useState(false);
    const [selectedChangeHistory, setSelectedChangeHistory] = useState([]);
    const [storeID, setStoreId] = useState([]);
    const [userId, setUserId] = useState('');
    const [tinh, setTinh] = useState([]);
    const [quan, setQuan] = useState([]);
    const [phuong, setPhuong] = useState([]);
    const [selectedTinh, setSelectedTinh] = useState(null);
    const [selectedQuan, setSelectedQuan] = useState(null);
    const [selectedPhuong, setSelectedPhuong] = useState(null);

    useEffect(() => {
        document.title = 'Quản lý cửa hàng';
        fetchStores();
        fetchTinh();
    }, [page]);

    useEffect(() => {
        if (selectedTinh) {
            fetchQuan(selectedTinh);
        }
    }, [selectedTinh]);

    useEffect(() => {
        if (selectedQuan) {
            fetchPhuong(selectedQuan);
        }
    }, [selectedQuan]);

    const fetchTinh = async () => {
        try {
            const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');

            if (response.data) {
                setTinh(response.data.data);
            }
            console.log('Tỉnh1:', response.data.data);
        } catch (error) {
            console.error('Error fetching Tỉnh:', error);
        }
    };

    const fetchQuan = async (idtinh) => {
        try {
            const response = await axios.get(`https://esgoo.net/api-tinhthanh/2/${idtinh}.htm`);
            if (response.data) {
                setQuan(response.data.data);
                setPhuong([]); // Reset Phường when Tỉnh changes
                setSelectedQuan(null); // Reset selected Quan
            }
        } catch (error) {
            console.error('Error fetching Quận:', error);
        }
    };

    const fetchPhuong = async (idquan) => {
        try {
            const response = await axios.get(`https://esgoo.net/api-tinhthanh/3/${idquan}.htm`);
            if (response.data) {
                setPhuong(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching Phường:', error);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const token = Cookies.get('token');

            if (!token) {
                console.log('Token không tồn tại, người dùng cần đăng nhập lại.');
                return;
            }

            try {
                const response = await apiGetUserById(token);

                if (response.success === true) {
                    const user = response.rs;
                    console.log('user', user);
                    setStoreId(user.storeId);
                    setUserId(user._id);
                    setTokenExpiration();
                } else {
                    console.log('Lỗi xác thực người dùng:', response.data.message);
                }
            } catch (error) {
                handleError(error);
            }
        };

        const setTokenExpiration = () => {
            const expirationTime = 6000 * 1000; // 10 phút
            setTimeout(handleTokenExpired, expirationTime);
        };

        const handleTokenExpired = () => {
            Swal.fire({
                title: 'Phiên đăng nhập đã hết hạn!',
                text: 'Vui lòng đăng nhập lại.',
                icon: 'warning',
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    Cookies.remove('token');
                    window.location.href = '/login';
                }
            });
        };

        const handleError = (error) => {
            if (error.response && error.response.status === 402) {
                handleTokenExpired();
            } else {
                console.error('Lỗi từ server:', error.response?.data || error.message);
            }
        };

        fetchUserData();

        return () => clearTimeout(setTokenExpiration);
    }, []);

    const fetchStores = useCallback(async () => {
        try {
            const response = await apiGetStore(page);
            if (response.success) {
                const fetchedStores = response.data;
                const totalFetchedStores = response.totalStores;

                // Tính tổng số trang dựa trên tổng số cửa hàng và số item mỗi trang
                const totalPages = Math.ceil(totalFetchedStores / 10); // 10 là số item mỗi trang

                // Nếu trang hiện tại vượt quá số trang hiện có hoặc chỉ có 1 trang kết quả, chuyển về trang 1
                if ((page > totalPages && totalPages > 0) || totalPages === 1) {
                    setPage(1);
                } else {
                    setStores(fetchedStores);
                    setTotalStores(totalFetchedStores);
                }
            } else {
                toast.error('Không thể lấy danh sách cửa hàng');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi lấy danh sách cửa hàng.');
        }
    }, [page]);

    const filteredStores = useMemo(() => {
        return stores.filter((store) => {
            // Điều kiện khớp với từ khóa tìm kiếm
            const matchesSearchTerm =
                store.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                store.address?.toLowerCase().includes(searchTerm.toLowerCase());

            // Điều kiện khớp với thành phố
            const selectedTinhName = tinh.find((item) => item.id === selectedTinh)?.name;
            const matchesTinh = selectedTinhName
                ? store.city?.toLowerCase().includes(selectedTinhName.toLowerCase())
                : true;

            // Điều kiện khớp với quận
            const selectedQuanName = quan.find((item) => item.id === selectedQuan)?.name;
            const matchesQuan = selectedQuanName
                ? new RegExp(`(Huyện|Quận)\\s*${selectedQuanName}`, 'i').test(store.district)
                : true;

            // Điều kiện khớp với phường
            const selectedPhuongName = phuong.find((item) => item.id === selectedPhuong)?.name;
            const matchesPhuong = selectedPhuongName
                ? store.ward?.toLowerCase().includes(selectedPhuongName.toLowerCase())
                : true;

            // Trả về kết quả dựa trên các điều kiện
            if (selectedTinh && !selectedQuan && !selectedPhuong) {
                return matchesSearchTerm && matchesTinh;
            } else if (selectedTinh && selectedQuan && !selectedPhuong) {
                return matchesSearchTerm && matchesTinh && matchesQuan;
            } else if (selectedTinh && selectedQuan && selectedPhuong) {
                return matchesSearchTerm && matchesTinh && matchesQuan && matchesPhuong;
            }

            // Mặc định: nếu không có điều kiện nào, trả về tất cả
            return matchesSearchTerm;
        });
    }, [stores, searchTerm, selectedTinh, selectedQuan, selectedPhuong, tinh, quan, phuong]);

    const handleSelectTinh = (value) => {
        if (value === null) {
            setSelectedTinh(null);
            setSelectedQuan(null);
            setPhuong([]);
        } else {
            setSelectedTinh(value);
            setSelectedQuan(null);
            setPhuong([]);
        }
    };

    const handleSelectQuan = (value) => {
        if (value === null) {
            setSelectedQuan(null);
            setPhuong([]);
        } else {
            setSelectedQuan(value);
        }
    };

    const handleSelectPhuong = (value) => {
        if (value === null) {
            setSelectedPhuong(null);
        } else {
            setSelectedPhuong(value);
        }
    };
    const handleSearch = (value) => {
        setSearchTerm(value);
    };

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
        if (!editingStore) return;

        const payload = { name: formData.name, address: formData.address, userId: userId };

        try {
            const response = await apiUpdateStore(editingStore._id, payload);
            console.log(payload);
            console.log(response);

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

    const handleShowChangeHistory = (history) => {
        console.log(history); // Kiểm tra dữ liệu history
        setSelectedChangeHistory(history);
        setChangeHistoryModalVisible(true);
    };

    const exportToExcel = async () => {
        const pageSize = 10;
        const totalPages = Math.ceil(totalStores / pageSize);
        const workbook = XLSX.utils.book_new();
        const date = new Date();
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        const fileName = `Danh sách cửa hàng ${formattedDate}.xlsx`;

        for (let page = 1; page <= totalPages; page++) {
            try {
                const response = await fetch(`http://localhost:5000/api/store?page=${page}&limit=${pageSize}`);
                const data = await response.json();

                if (data.success) {
                    const formattedData = data.data.map((store) => ({
                        'Tên Cửa Hàng': store.name,
                        'Địa Chỉ': store.address,
                    }));

                    const worksheet = XLSX.utils.json_to_sheet(formattedData);
                    XLSX.utils.book_append_sheet(workbook, worksheet, `Danh sách ${page}`);
                }
            } catch (error) {
                console.error('Có lỗi xảy ra khi lấy dữ liệu:', error);
                toast.error('Không thể xuất dữ liệu.');
                return;
            }
        }

        XLSX.writeFile(workbook, fileName);
    };

    console.log(selectedChangeHistory);

    return (
        <div className="container my-4 manage-store">
            <h2 style={{ marginBottom: '20px' }}>Quản lý cửa hàng</h2>
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <Select
                    value={selectedTinh || null}
                    placeholder="Chọn Tỉnh Thành"
                    onChange={handleSelectTinh}
                    style={{ width: '25%', marginRight: '10px' }}
                >
                    <Option value={null}>Chọn</Option>
                    {tinh.map((item) => (
                        <Option key={item.id} value={item.id}>
                            {item.full_name}
                        </Option>
                    ))}
                </Select>
                <Select
                    value={selectedQuan || null}
                    placeholder="Chọn Quận Huyện"
                    onChange={handleSelectQuan}
                    style={{ width: '25%', marginRight: '10px' }}
                    disabled={!selectedTinh} // Disable if no Tỉnh is selected
                >
                    <Option value={null}>Chọn</Option>
                    {quan.map((item) => (
                        <Option key={item.id} value={item.id}>
                            {item.full_name}
                        </Option>
                    ))}
                </Select>
                <Select
                    value={selectedPhuong || null}
                    placeholder="Chọn Phường Xã"
                    onChange={handleSelectPhuong}
                    style={{ width: '25%' }}
                    disabled={!selectedQuan} // Disable if no Quan is selected
                >
                    <Option value={null}>Chọn</Option>
                    {phuong.map((item) => (
                        <Option key={item.id} value={item.id}>
                            {item.full_name}
                        </Option>
                    ))}
                </Select>
            </div>

            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                <Input
                    placeholder="Tìm kiếm theo tên hoặc địa chỉ"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    prefix={<SearchOutlined />}
                    style={{ width: '300px', marginRight: '10px' }}
                />
            </div>

            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddStore} style={{ marginBottom: '10px' }}>
                Thêm
            </Button>

            <Button
                type="default"
                icon={<ExportOutlined />}
                onClick={exportToExcel}
                style={{ marginBottom: '10px', marginLeft: '10px' }}
            >
                Xuất Excel
            </Button>

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
                            placeholder="Nhập địa chỉ"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                    </Form.Item>
                </Form>
            </Modal>

            <Table
                dataSource={filteredStores}
                pagination={false}
                rowKey="_id"
                scroll={{ x: 'max-content' }} // Cho phép cuộn ngang
            >
                <Column title="Tên Cửa Hàng" dataIndex="name" key="name" />
                <Column title="Địa Chỉ" dataIndex="address" key="address" />
                <Column
                    title="Lịch Sử Thay Đổi"
                    key="history"
                    render={(text, record) => (
                        <Button onClick={() => handleShowChangeHistory(record.changeHistory)}>Xem lịch sử</Button>
                    )}
                />
                <Column
                    title="Thao Tác"
                    key="action"
                    render={(text, record) => (
                        <Space size="middle">
                            <Button icon={<EditOutlined />} onClick={() => handleEditStore(record)} />
                            <Button
                                icon={<DeleteOutlined />}
                                onClick={() => setConfirmDelete({ visible: true, id: record._id })}
                            />
                        </Space>
                    )}
                />
            </Table>

            <Pagination
                current={page}
                total={totalStores}
                pageSize={10}
                onChange={(page) => setPage(page)}
                style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
            />
            <p style={{ textAlign: 'center' }}>
                Hiển thị {Math.min((page - 1) * 10 + 1, totalStores)} đến {Math.min(page * 10, totalStores)} của{' '}
                {totalStores} cửa hàng
            </p>

            <Modal
                title="Xác nhận"
                visible={confirmDelete.visible}
                onOk={handleDeleteStore}
                onCancel={() => setConfirmDelete({ visible: false, id: null })}
            >
                <p>Bạn có chắc chắn muốn xóa cửa hàng này không?</p>
            </Modal>
            <Modal
                title="Lịch Sử Thay Đổi"
                visible={changeHistoryModalVisible}
                onCancel={() => setChangeHistoryModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setChangeHistoryModalVisible(false)}>
                        Đóng
                    </Button>,
                ]}
            >
                {selectedChangeHistory.length > 0 ? (
                    <Table dataSource={selectedChangeHistory} rowKey="_id" pagination={false}>
                        <Column
                            title="Người Thay Đổi"
                            key="user"
                            render={(text, record) => `${record.firstName} ${record.lastName}`}
                        />
                        <Column
                            title="Thay Đổi"
                            dataIndex="changes"
                            key="changes"
                            render={(text) => (
                                <div
                                    style={{
                                        maxWidth: '300px', // Chiều rộng tối đa cho cột
                                        whiteSpace: 'normal', // Cho phép xuống dòng
                                        overflow: 'hidden', // Ẩn nội dung vượt quá
                                        textOverflow: 'ellipsis', // Hiển thị dấu '...' nếu nội dung quá dài
                                    }}
                                >
                                    {text}
                                </div>
                            )}
                        />
                        <Column
                            title="Ngày Thay Đổi"
                            dataIndex="timestamp"
                            key="timestamp"
                            render={(timestamp) => new Date(timestamp).toLocaleString()}
                        />
                    </Table>
                ) : (
                    <p>Không có lịch sử thay đổi.</p>
                )}
            </Modal>
        </div>
    );
};

export default CreateStore;
