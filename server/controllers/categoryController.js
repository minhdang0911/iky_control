const Category = require('../models/Category'); // Đường dẫn đến model Category

// Hàm tạo tên viết tắt từ tên danh mục
function createAbbreviation(name) {
    const words = name.split(' ');
    const abbreviation = 'C.' + words.map((word) => word.charAt(0).toUpperCase()).join('');
    return abbreviation;
}

// Controller để tạo danh mục mới
exports.createCategory = async (req, res) => {
    const { name, time } = req.body; // Đổi createdAt thành time

    try {
        if (!name || time === undefined) {
            // Kiểm tra nếu name và time đã được cung cấp
            return res.status(400).json({ message: 'Tên danh mục và thời gian là bắt buộc' });
        }

        // Kiểm tra xem tên danh mục đã tồn tại trong cơ sở dữ liệu chưa
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Tên danh mục đã tồn tại' });
        }

        const abbreviation = createAbbreviation(name);

        const newCategory = new Category({
            name,
            abbreviation,
            time,
        });

        await newCategory.save();
        res.status(201).json({
            status: 201,
            message: 'Danh mục được thêm thành công',
            category: newCategory,
            success: true,
        });
    } catch (error) {
        console.error('Lỗi khi tạo danh mục:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi tạo danh mục', error });
    }
};

// Controller để lấy danh sách danh mục
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find(); // Lấy tất cả danh mục từ cơ sở dữ liệu
        res.status(200).json({
            status: 200,
            message: 'Lấy danh sách danh mục thành công',
            categories: categories,
            success: true,
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh mục', error });
    }
};

exports.deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                mes: 'Danh mục ko tồn tại',
            });
        }

        res.status(200).json({
            success: true,
            mes: 'Xóa bàn nâng thành công',
            data: category,
        });
    } catch (error) {
        console.error('Lỗi khi xóa bàn nâng:', error);
        res.status(500).json({
            success: false,
            mes: 'Có lỗi xảy ra khi xóa bàn nâng.',
        });
    }
};

// Controller để cập nhật danh mục
exports.updateCategory = async (req, res) => {
    const { id } = req.params; // Lấy ID danh mục từ URL
    const { name, time } = req.body; // Lấy tên và thời gian từ body

    try {
        // Kiểm tra nếu danh mục có tồn tại không
        const existingCategory = await Category.findById(id);
        if (!existingCategory) {
            return res.status(404).json({ message: 'Danh mục không tồn tại' });
        }

        // Cập nhật danh mục
        existingCategory.name = name;
        existingCategory.time = time;

        const abbreviation = createAbbreviation(name);
        existingCategory.abbreviation = abbreviation;

        await existingCategory.save();

        res.status(200).json({
            status: 200,
            message: 'Cập nhật danh mục thành công',
            category: existingCategory,
            success: true,
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật danh mục:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật danh mục', error });
    }
};

exports.importCategories = async (req, res) => {
    const categories = req.body;

    try {
        const newCategories = [];
        const existingCategories = await Category.find({}, 'name abbreviation') // Lấy tất cả tên và viết tắt danh mục đã tồn tại
            .lean();

        // Tạo một danh sách tên và viết tắt hiện có để kiểm tra
        const existingNames = existingCategories.map((c) => c.name);
        const existingAbbreviations = existingCategories.map((c) => c.abbreviation);

        // Mảng để lưu tên danh mục không hợp lệ
        const invalidNames = [];

        for (const category of categories) {
            const { name, time } = category;

            // Kiểm tra nếu tên và thời gian đã được cung cấp
            if (!name || time === undefined) {
                return res.status(400).json({ message: 'Tên và thời gian là bắt buộc trong file nhập' });
            }

            // Kiểm tra nếu danh mục đã tồn tại
            if (existingNames.includes(name)) {
                invalidNames.push(name); // Thêm tên đã tồn tại vào danh sách không hợp lệ
                continue; // Bỏ qua danh mục này và tiếp tục với danh mục khác
            }

            // Tạo viết tắt
            const abbreviation = createAbbreviation(name);

            // Kiểm tra nếu viết tắt đã tồn tại
            if (existingAbbreviations.includes(abbreviation)) {
                invalidNames.push(name); // Thêm vào danh sách không hợp lệ nếu viết tắt đã tồn tại
                continue;
            }

            // Nếu không tồn tại, tạo danh mục mới
            const newCategory = new Category({
                name,
                abbreviation,
                time,
            });
            await newCategory.save();
            newCategories.push(newCategory);
        }

        // Kiểm tra nếu không có danh mục mới nào được thêm vào
        if (newCategories.length === 0) {
            if (invalidNames.length > 0) {
                return res.status(400).json({
                    message: 'Tất cả danh mục đã tồn tại',
                    existing: invalidNames, // Trả về danh sách các tên đã tồn tại
                });
            } else {
                return res.status(400).json({
                    message: 'Không có danh mục nào được nhập',
                });
            }
        }

        res.status(201).json({
            status: 201,
            message: 'Import danh mục thành công',
            categories: newCategories,
            success: true,
        });
    } catch (error) {
        console.error('Lỗi khi import danh mục:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi import danh mục', error });
    }
};
