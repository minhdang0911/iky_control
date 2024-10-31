const Customer = require('../models/Customer');
const User = require('../models/User');
const moment = require('moment');

exports.addCustomer = async (req, res) => {
    try {
        const { fullName, cardNumber, licensePlate, repairStartTime, services, userId, firstName, lastName, storeId } =
            req.body;

        if (
            !fullName ||
            !cardNumber ||
            !licensePlate ||
            services.length === 0 ||
            !userId ||
            !firstName ||
            !lastName ||
            !storeId
        ) {
            return res.status(400).json({
                success: false,
                message: 'Tất cả các trường là bắt buộc và services phải là một mảng không rỗng.',
            });
        }

        // Lấy ngày hiện tại
        const todayStart = moment().startOf('day').toDate();
        const todayEnd = moment().endOf('day').toDate();

        // Tìm khách hàng trùng số thẻ trong cửa hàng ngày hôm nay
        const existingCustomerToday = await Customer.findOne({
            storeId,
            cardNumber,
            createdAt: { $gte: todayStart, $lte: todayEnd },
        });

        if (existingCustomerToday) {
            return res.status(400).json({
                success: false,
                message: `Số thẻ '${cardNumber}' đã tồn tại trong cửa hàng này hôm nay. Vui lòng sử dụng số thẻ khác.`,
            });
        }

        // Tạo khách hàng mới nếu không có trùng lặp trong ngày
        const newCustomer = new Customer({
            fullName,
            cardNumber,
            licensePlate,
            repairStartTime,
            repairCompletionTime: repairStartTime,
            user: {
                userId,
                firstName,
                lastName,
            },
            storeId,
            services,
        });

        await newCustomer.save();

        return res.status(201).json({
            success: true,
            message: 'Khách hàng đã được thêm thành công',
            customer: newCustomer,
        });
    } catch (error) {
        console.error('Lỗi khi thêm khách hàng:', error);
        if (error.name === 'MongoServerError' && error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Số thẻ đã tồn tại cho cửa hàng này.',
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Lỗi server nội bộ',
        });
    }
};

exports.getCustomers = async (req, res) => {
    try {
        // Lấy storeId từ thông tin người dùng đã đăng nhập
        const { storeId } = req.user; // Giả sử thông tin người dùng được lưu trong req.user

        // Kiểm tra xem storeId có tồn tại không
        if (!storeId) {
            return res.status(400).json({
                success: false,
                message: 'Bạn phải đăng nhập vào cửa hàng để lấy danh sách khách hàng.',
            });
        }

        // Tìm danh sách khách hàng có storeId trùng khớp
        const customers = await Customer.find({ storeId });

        return res.status(200).json({
            success: true,
            message: 'Danh sách khách hàng đã được lấy thành công.',
            customers,
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách khách hàng:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server nội bộ',
        });
    }
};
