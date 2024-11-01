const Technician = require('../models/Technician');
const Store = require('../models/Store');

exports.createTechnician = async (req, res) => {
    const { fullName, phoneNumber, store } = req.body;

    console.log('Adding technician:', { fullName, phoneNumber, store });

    try {
        const existingStore = await Store.findById(store);
        if (!existingStore) {
            return res.status(400).send('Cửa hàng không tồn tại.');
        }

        // Kiểm tra số điện thoại đã tồn tại
        const existingTechnician = await Technician.findOne({ phoneNumber });
        if (existingTechnician) {
            return res.json({
                status: 405,
                success: false,
                mes: 'Số điện thoại đã được sử dụng',
            });
        }

        // Kiểm tra định dạng số điện thoại
        if (!/^(0\d{9})$/.test(phoneNumber)) {
            return res
                .status(400)
                .send('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại 10 ký tự bắt đầu bằng 0.');
        }

        // Kiểm tra tên không chứa số
        if (/[^a-zA-ZÀ-ỹ\s]/.test(fullName)) {
            return res.json({
                status: 401,
                success: false,
                mes: 'Tên không được chứa số hoặc ký tự đặc biệt',
            });
        }

        const technician = new Technician({
            fullName,
            phoneNumber,
            store,
        });
        await technician.save();
        await Store.findByIdAndUpdate(store, {
            $addToSet: { technicians: technician._id },
        });

        return res.json({
            status: 201,
            success: true,
            mes: 'Tạo mới thành công',
        });
    } catch (error) {
        console.error('Error creating technician:', error);
        res.status(400).send('Không thể tạo kỹ thuật viên.');
    }
};

// Lấy danh sách kỹ thuật viên theo cửa hàng
// exports.getTechniciansByStore = async (req, res) => {
//     const { store } = req.body;

//     try {
//         const technicians = await Technician.find({ store });
//         res.status(200).send(technicians);
//     } catch (error) {
//         res.status(500).send('Có lỗi xảy ra khi lấy danh sách kỹ thuật viên.');
//     }
// };

exports.getTechniciansByStore = async (req, res) => {
    const { store } = req.query; // Lấy từ query parameters

    try {
        const technicians = await Technician.find({ store });
        return res.json({
            success: technicians.length > 0,
            mes: technicians.length > 0 ? 'Lấy danh sách thành công' : 'Không có kỹ thuật viên nào',
            data: technicians,
        });
    } catch (error) {
        res.status(500).send('Có lỗi xảy ra khi lấy danh sách kỹ thuật viên.');
    }
};
// technicianController.js
// technicianController.js
exports.getAllTechnical = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Định nghĩa limit từ query hoặc mặc định là 10

    try {
        // Tính toán số lượng bản ghi cần skip dựa trên page và limit
        const skip = (page - 1) * limit;

        // Lấy kỹ thuật viên với phân trang và populate tên cửa hàng
        const technicians = await Technician.find()
            .populate({
                path: 'store',
                select: 'name',
            })
            .skip(skip)
            .limit(limit);

        const data = technicians.map((tech) => ({
            _id: tech._id,
            fullName: tech.fullName,
            phoneNumber: tech.phoneNumber,
            store: tech.store
                ? {
                      id: tech.store._id,
                      name: tech.store.name,
                  }
                : null,
        }));

        // Tính tổng số kỹ thuật viên
        const totalTechnicians = await Technician.countDocuments();
        const totalPages = Math.ceil(totalTechnicians / limit);

        return res.json({
            success: true,
            mes: 'Lấy danh sách kỹ thuật viên thành công',
            data: data,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalTechnicians: totalTechnicians,
            },
        });
    } catch (error) {
        console.error('Error fetching technicians:', error);
        res.status(500).send('Có lỗi xảy ra khi lấy danh sách kỹ thuật viên.');
    }
};

// Xóa kỹ thuật viên theo ID
// technicianController.js
exports.deleteTechnician = async (req, res) => {
    const { id } = req.params;

    try {
        const technician = await Technician.findByIdAndDelete(id);
        if (!technician) {
            return res.status(404).send('Kỹ thuật viên không tồn tại.');
        }

        // Cập nhật cửa hàng để xóa kỹ thuật viên khỏi danh sách
        await Store.findByIdAndUpdate(technician.store, {
            $pull: { technicians: id },
        });

        res.status(200).send('Xóa kỹ thuật viên thành công.');
    } catch (error) {
        console.error('Error deleting technician:', error);
        res.status(500).send('Có lỗi xảy ra khi xóa kỹ thuật viên.');
    }
};

// Sửa thông tin kỹ thuật viên theo ID
exports.updateTechnician = async (req, res) => {
    const { id } = req.params; // Lấy ID từ params
    const { fullName, phoneNumber } = req.body; // Lấy dữ liệu từ body

    try {
        // Kiểm tra xem kỹ thuật viên có tồn tại hay không
        const technician = await Technician.findById(id);
        if (!technician) {
            return res.status(404).send('Kỹ thuật viên không tồn tại.');
        }

        // Kiểm tra số điện thoại đã tồn tại
        const existingTechnician = await Technician.findOne({ phoneNumber, _id: { $ne: id } });
        if (existingTechnician) {
            return res.json({
                status: 405,
                success: false,
                mes: 'Số điện thoại đã được sử dụng.',
            });
        }

        // Kiểm tra định dạng số điện thoại
        if (!/^(0\d{9})$/.test(phoneNumber)) {
            return res
                .status(400)
                .send('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại 10 ký tự bắt đầu bằng 0.');
        }

        // Kiểm tra tên không chứa số
        if (/[^a-zA-ZÀ-ỹ\s]/.test(fullName)) {
            return res.json({
                status: 401,
                success: false,
                mes: 'Tên không được chứa số hoặc ký tự đặc biệt',
            });
        }

        // Cập nhật thông tin kỹ thuật viên
        technician.fullName = fullName || technician.fullName;
        technician.phoneNumber = phoneNumber || technician.phoneNumber;

        await technician.save();

        return res.json({
            status: 200,
            success: true,
            mes: 'Cập nhật thông tin kỹ thuật viên thành công.',
            data: technician,
        });
    } catch (error) {
        console.error('Error updating technician:', error);
        res.status(500).send('Có lỗi xảy ra khi cập nhật kỹ thuật viên.');
    }
};
