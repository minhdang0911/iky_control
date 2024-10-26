const LiftTable = require('../models/LiftTable');
const Technician = require('../models/Technician');
const Store = require('../models/Store');

exports.createLiftTable = async (req, res) => {
    const { number, technician, store, description } = req.body;

    console.log('Số bàn nâng cần tạo:', number);
    try {
        const existingStore = await Store.findById(store);
        if (!existingStore) {
            return res.status(400).json({
                success: false,
                mes: 'Cửa hàng không tồn tại',
            });
        }

        const existingTechnician = await Technician.findOne({ _id: technician, store });
        if (!existingTechnician) {
            return res.status(400).json({
                success: false,
                mes: 'Kỹ thuật viên không tồn tại hoặc không thuộc cửa hàng này',
            });
        }

        // Kiểm tra xem số bàn nâng đã tồn tại cho cửa hàng cụ thể chưa
        const existingLiftTable = await LiftTable.findOne({ number, store });
        if (existingLiftTable) {
            console.log('Bàn nâng đã tồn tại:', existingLiftTable);
            return res.status(400).json({
                success: false,
                mes: 'Số bàn nâng đã tồn tại. Vui lòng chọn số khác.',
            });
        }

        // Tạo bàn nâng mới
        const liftTable = new LiftTable({
            number,
            technician,
            store,
            description,
        });

        await liftTable.save();

        res.status(201).json({
            success: true,
            mes: 'Thêm bàn nâng thành công',
            data: liftTable,
        });
    } catch (error) {
        console.error('Lỗi khi thêm bàn nâng:', error);
        res.status(500).send('Có lỗi xảy ra khi thêm bàn nâng.');
    }
};

exports.getLiftTables = async (req, res) => {
    const { storeId } = req.query;

    try {
        const query = storeId ? { store: storeId } : {};

        // Lấy danh sách bàn nâng và populate thông tin kỹ thuật viên và cửa hàng
        const liftTables = await LiftTable.find(query).populate('technician', 'fullName').populate('store', 'name');

        res.status(200).json({
            success: true,
            data: liftTables,
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bàn nâng:', error);
        res.status(500).json({
            success: false,
            mes: 'Có lỗi xảy ra khi lấy danh sách bàn nâng.',
        });
    }
};

exports.deleteLiftTable = async (req, res) => {
    const { id } = req.params; // Lấy ID từ params

    try {
        // Tìm và xóa bàn nâng
        const liftTable = await LiftTable.findByIdAndDelete(id);

        // Kiểm tra nếu bàn nâng không tồn tại
        if (!liftTable) {
            return res.status(404).json({
                success: false,
                mes: 'Bàn nâng không tồn tại',
            });
        }

        res.status(200).json({
            success: true,
            mes: 'Xóa bàn nâng thành công',
            data: liftTable,
        });
    } catch (error) {
        console.error('Lỗi khi xóa bàn nâng:', error);
        res.status(500).json({
            success: false,
            mes: 'Có lỗi xảy ra khi xóa bàn nâng.',
        });
    }
};

exports.updateLiftTable = async (req, res) => {
    const { id } = req.params;
    const { number, technician, store, description } = req.body;

    try {
        console.log('Số bàn nâng:', number);
        console.log('Cửa hàng:', store);

        // Check if another lift table with the same number and store exists
        // Check if another lift table with the same number and store exists
        const existingLiftTable = await LiftTable.findOne({
            number,
            store,
            _id: { $ne: id }, // Exclude the current lift table being updated
        });

        if (existingLiftTable) {
            return res.status(400).json({
                status: 400,
                success: false,
                mes: 'Số bàn nâng đã tồn tại. Vui lòng chọn số khác.',
            });
        }

        // Cập nhật bàn nâng
        const updatedLiftTable = await LiftTable.findByIdAndUpdate(
            id,
            { number, technician, store, description },
            { new: true },
        );

        if (!updatedLiftTable) {
            return res.status(404).json({
                success: false,
                mes: 'Bàn nâng không tồn tại',
            });
        }

        // Lấy thông tin kỹ thuật viên
        const technicianData = await Technician.findById(technician);

        res.status(200).json({
            status: 200,
            success: true,
            mes: 'Cập nhật bàn nâng thành công',
            data: {
                _id: updatedLiftTable._id,
                number: updatedLiftTable.number,
                technician: {
                    _id: technicianData._id,
                    fullName: technicianData.fullName,
                },
                store: updatedLiftTable.store,
                description: updatedLiftTable.description,
            },
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật bàn nâng:', error);
        res.status(500).json({
            success: false,
            mes: 'Có lỗi xảy ra khi cập nhật bàn nâng.',
        });
    }
};
