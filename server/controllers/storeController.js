const Store = require('../models/Store');
const User = require('../models/User');

// Thêm cửa hàng mới
// exports.createStore = async (req, res) => {
//     const { name, address } = req.body;

//     try {
//         // Kiểm tra xem tên cửa hàng đã tồn tại chưa
//         const existingStore = await Store.findOne({ name });
//         if (existingStore) {
//             return res.status(400).json({
//                 status: 400,
//                 success: false,
//                 mes: 'cửa hàng đã tồn tại',
//             });
//         }

//         // Tạo cửa hàng mới
//         const store = new Store({
//             name,
//             address,
//         });

//         // Lưu cửa hàng vào cơ sở dữ liệu
//         await store.save();
//         return res.status(400).json({
//             status: 201,
//             success: true,
//             store,
//             mes: 'Thêm mới cửa hàng thành công',
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Có lỗi xảy ra khi tạo cửa hàng.');
//     }
// };

function extractCityDistrictWard(address) {
    const parts = address.split(',').map((part) => part.trim());
    const city = parts[parts.length - 1];
    const district = parts[parts.length - 2];
    const ward = parts.length > 2 ? parts[parts.length - 3] : '';

    return { city, district, ward };
}

exports.createStore = async (req, res) => {
    const { name, address } = req.body;

    try {
        const existingStore = await Store.findOne({ name });
        if (existingStore) {
            return res.status(400).json({
                status: 400,
                success: false,
                mes: 'Cửa hàng đã tồn tại',
            });
        }

        const { city, district, ward } = extractCityDistrictWard(address);

        const store = new Store({
            name,
            address,
            city,
            district,
            ward,
        });

        await store.save();
        return res.status(201).json({
            status: 201,
            success: true,
            store,
            mes: 'Thêm mới cửa hàng thành công',
        });
    } catch (error) {
        console.error('Lỗi khi tạo cửa hàng:', error);
        res.status(500).send('Có lỗi xảy ra khi tạo cửa hàng.');
    }
};

exports.getStoreStatistics = async (req, res) => {
    try {
        const statistics = await Store.aggregate([
            {
                $group: {
                    _id: { city: '$city', district: '$district', ward: '$ward' },
                    storeCount: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json({ status: 200, success: true, statistics });
    } catch (error) {
        console.error('Lỗi khi lấy thống kê cửa hàng:', error);
        res.status(500).json({ status: 500, success: false, mes: 'Có lỗi xảy ra khi lấy thống kê cửa hàng.' });
    }
};

exports.getStores = async (req, res) => {
    try {
        const stores = await Store.find();
        return res.status(200).json({
            success: stores ? true : false,
            data: stores ? stores : 'Cannot get new blogs category',
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách cửa hàng:', error);
        res.status(500).send('Có lỗi xảy ra khi lấy danh sách cửa hàng.');
    }
};

exports.getStoresPagination = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const stores = await Store.find()
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalStores = await Store.countDocuments();
        const totalPages = Math.ceil(totalStores / limit);

        return res.status(200).json({
            success: true,
            data: stores,
            totalPages,
            totalStores,
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách cửa hàng:', error);
        res.status(500).send('Có lỗi xảy ra khi lấy danh sách cửa hàng.');
    }
};

// Sửa cửa hàng
// exports.updateStore = async (req, res) => {
//     const { id } = req.params;
//     const { name, address } = req.body;

//     try {
//         // Tìm và cập nhật cửa hàng
//         const store = await Store.findByIdAndUpdate(id, { name, address }, { new: true });

//         if (!store) {
//             return res.status(404).json({
//                 status: 404,
//                 success: false,
//                 mes: 'Cửa hàng không tồn tại',
//             });
//         }

//         return res.status(200).json({
//             status: 200,
//             success: true,
//             store,
//             mes: 'Cập nhật cửa hàng thành công',
//         });
//     } catch (error) {
//         console.error('Lỗi khi cập nhật cửa hàng:', error);
//         res.status(500).send('Có lỗi xảy ra khi cập nhật cửa hàng.');
//     }
// };

exports.updateStore = async (req, res) => {
    const { id } = req.params;
    const { name, address, userId } = req.body;

    try {
        const store = await Store.findById(id);
        if (!store) {
            return res.status(404).json({
                status: 404,
                success: false,
                mes: 'Cửa hàng không tồn tại',
            });
        }

        const user = await User.findById(userId);
        if (!user || !user.firstName || !user.lastName) {
            return res.status(400).json({
                status: 400,
                success: false,
                mes: 'Thông tin người dùng không đầy đủ',
            });
        }

        const changes = [];
        if (store.name !== name) changes.push(`Tên cửa hàng đã thay đổi từ "${store.name}" thành "${name}"`);
        if (store.address !== address) changes.push(`Địa chỉ đã thay đổi từ "${store.address}" thành "${address}"`);

        const { city, district, ward } = extractCityDistrictWard(address);

        store.name = name;
        store.address = address;
        store.city = city;
        store.district = district;
        store.ward = ward;

        store.changeHistory.push({
            user: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            changes: changes.join(', '),
        });

        await store.save();

        return res.status(200).json({
            status: 200,
            success: true,
            store,
            mes: 'Cập nhật cửa hàng thành công',
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật cửa hàng:', error);
        res.status(500).send('Có lỗi xảy ra khi cập nhật cửa hàng.');
    }
};

// Xóa cửa hàng
exports.deleteStore = async (req, res) => {
    const { id } = req.params;

    try {
        const store = await Store.findByIdAndDelete(id);

        if (!store) {
            return res.status(404).json({
                status: 404,
                success: false,
                mes: 'Cửa hàng không tồn tại',
            });
        }

        return res.status(200).json({
            status: 200,
            success: true,
            mes: 'Xóa cửa hàng thành công',
        });
    } catch (error) {
        console.error('Lỗi khi xóa cửa hàng:', error);
        res.status(500).send('Có lỗi xảy ra khi xóa cửa hàng.');
    }
};
