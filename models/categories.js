const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },

    note: {
        type: String,
        trim: true
    }

}, { timestamps: true });

// Add text index for searching `name` and `note`
categorySchema.index({ name: 'text', note: 'text' });

module.exports = mongoose.model("Category", categorySchema);