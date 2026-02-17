const Section = require('../models/Section');
const Subsection = require('../models/SubSection'); // Standardized to capital S
const imageUploder = require('../utils/imageUploader');

const CreateSubSection = async (req, res) => {
    try {
        const { sectionId, title, timeDuration, description } = req.body;
        const video = req.files?.videoUpload;

        if (!sectionId || !title || !description || !video) {
            return res.status(403).json({
                message: "all fields are required to create a subsection",
                success: false,
            })
        }

        const cloudinaryUploadedVideo = await imageUploder(video.tempFilePath, process.env.COURSE_THUMBNAIL_FOLDER_NAME);
        const duration = (timeDuration && timeDuration !== '0') ? timeDuration : `${Math.round(cloudinaryUploadedVideo.duration)}`;

        const newCreatedSubSection = await Subsection.create({
            sectionId,
            title,
            timeDuration: duration,
            description,
            videoUrl: cloudinaryUploadedVideo.secure_url,
        })

        const updatedSection = await Section.findByIdAndUpdate(sectionId, {
            $push: { subSection: newCreatedSubSection._id }
        }, { new: true }).populate('subSection');

        return res.status(200).json({
            success: true,
            message: "successfully created the new SubSection",
            data: updatedSection,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error in subsection creation",
            error: error.message
        })
    }
}

const UpdateSubSection = async (req, resp) => {
    try {
        const { subSectionId, title, timeDuration, description } = req.body;
        if (!subSectionId) return resp.status(403).json({ message: 'subsection id is required' });

        const subSection = await Subsection.findById(subSectionId);
        if (req.files && req.files.videoUpload) {
            const uploadedVideo = await imageUploder(req.files.videoUpload.tempFilePath, process.env.COURSE_THUMBNAIL_FOLDER_NAME);
            subSection.videoUrl = uploadedVideo.secure_url;
            if (!timeDuration) subSection.timeDuration = `${Math.round(uploadedVideo.duration)}`;
        }

        if (timeDuration) subSection.timeDuration = timeDuration;
        if (title) subSection.title = title;
        if (description) subSection.description = description;

        await subSection.save();
        return resp.status(200).json({ success: true, data: subSection })
    } catch (error) {
        return resp.status(500).json({ success: false, message: 'Update failed' })
    }
}

const DeleteSubSection = async (req, resp) => {
    try {
        const { subsectionId } = req.body;
        const subSection = await Subsection.findById(subsectionId);
        if (!subSection) return resp.status(404).json({ message: 'SubSection not found' });

        const sectionId = subSection.sectionId;
        await Subsection.findByIdAndDelete(subsectionId);

        const updatedSection = await Section.findByIdAndUpdate(sectionId, {
            $pull: { subSection: subsectionId }
        }, { new: true }).populate('subSection');

        return resp.status(200).json({
            success: true,
            message: "Deleted Successfully",
            data: updatedSection,
        });

    } catch (e) {
        return resp.status(500).json({ success: false, error: e.message })
    }
}

module.exports = { CreateSubSection, UpdateSubSection, DeleteSubSection };