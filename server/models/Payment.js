const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    paymentId: {
        type: String,
        required: true,
    },
    signature: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Payment", PaymentSchema);
