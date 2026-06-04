const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({

    // Tên hàng hóa
    name: {
        type: String,
        trim: true
    },

    // Danh mục
    category: {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Category"},
    },

    // Ký mã hiệu
    code: {
        type: String,
        trim: true
    },

    // Thông tin kỹ thuật
    technicalSpecs: {
        type: String
    },

    // Xuất xứ
    origin: {
        type: String,
        trim: true
    },

    // Nhãn hiệu
    brand: {
        type: String,
        trim: true
    },

    // Năm sản xuất
    yrs_manu: {
        type: String,
        trim: true
    },

    // Giá
    price: {
        type: Number
    },

    // Đơn vị tính
    unit: {
        type: String,
        trim: true
    },

    // Ngày hỏi giá
    priceDate: {
        type: Date
    },

    // Nhà cung cấp
    supplier: {
        type: String,
        trim: true
    },

    // Người hỏi giá
    asker: {
        type: String,
        trim: true
    },

    // Ghi chú
    note: {
        type: String,
        trim: true
    }

}, { timestamps: true });

productSchema.index({
    name: "text",
    technicalSpecs: "text",
    brand: "text",
    code: "text",
    supplier: "text",
});

module.exports = mongoose.model("Product", productSchema);