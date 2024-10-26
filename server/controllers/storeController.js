const Store = require('../models/Store');

// Thêm cửa hàng mới
exports.createStore = async (req, res) => {
    const { name, address } = req.body;

    try {
        // Kiểm tra xem tên cửa hàng đã tồn tại chưa
        const existingStore = await Store.findOne({ name });
        if (existingStore) {
            return res.status(400).json({
                status: 400,
                success: false,
                mes: 'cửa hàng đã tồn tại',
            });
        }

        // Tạo cửa hàng mới
        const store = new Store({
            name,
            address,
        });

        // Lưu cửa hàng vào cơ sở dữ liệu
        await store.save();
        return res.status(400).json({
            status: 201,
            success: true,
            store,
            mes: 'Thêm mới cửa hàng thành công',
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Có lỗi xảy ra khi tạo cửa hàng.');
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
exports.updateStore = async (req, res) => {
    const { id } = req.params;
    const { name, address } = req.body;

    try {
        // Tìm và cập nhật cửa hàng
        const store = await Store.findByIdAndUpdate(id, { name, address }, { new: true });

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
