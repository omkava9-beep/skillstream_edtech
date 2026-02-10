const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
    sectionName: {
        type: String,
        required: true,
    },
    subSection: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubSection',
        }
    ],
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }
})

module.exports = mongoose.model('Section', SectionSchema);
