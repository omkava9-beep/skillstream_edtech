const mongoose = require('mongoose');

const SubSectionSchema = new mongoose.Schema({
    sectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section"
    },
    title: {
        type: String,
        required: true
    },
    marked: {
        type: Boolean,
        default: false,
    },
    timeDuration: {
        type: String,
    },
    description: {
        type: String,
    },
    videoUrl: {
        type: String
    }
});

// The check "mongoose.models.SubSection" prevents the OverwriteModelError
module.exports = mongoose.models.SubSection || mongoose.model('SubSection', SubSectionSchema);