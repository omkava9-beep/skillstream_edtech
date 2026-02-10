const Section = require('../models/Section');
const Subsection = require('../models/Subsection');
const imageUploder = require('../utils/imageUploader');

const CreateSubSection = async (req, res) => {
    try {
        console.log("CREATE_SUBSECTION_REQUEST:", { ...req.body, video: !!req.files?.videoUpload });
        const { sectionId, title, timeDuration, description } = req.body;

        const video = req.files?.videoUpload;
        if (!sectionId || !title || !description || !video) {
            console.log("SUBSECTION_MISSING_FIELDS:", { sectionId, title, description, video: !!video });
            return res.status(403).json({
                message: "all fields are required to create a subsection",
                success: false,
            })
        }
        const cloudinaryUploadedVideo = await imageUploder(video.tempFilePath, process.env.COURSE_THUMBNAIL_FOLDER_NAME);

        const newCreatedSubSection = await Subsection.create({
            sectionId,
            title,
            timeDuration,
            description,
            videoUrl: cloudinaryUploadedVideo.secure_url,
        })

        //now we have to update the section here
        //so we will first get the section according to the given sectionid
        //if we got the section then we just have to insert in that section

        const updatedSection = await Section.findByIdAndUpdate(sectionId, {
            $push: {
                subSection: newCreatedSubSection._id
            }
        }, { new: true }).populate({
            path: 'subSection'
        });


        return res.status(200).json({
            success: true,
            message: "successfully created the new SubSection",
            data: updatedSection,
        })

    } catch (error) {
        console.error("SUBSECTION_CREATE_ERROR:", error);
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

        if (!subSectionId) {
            return resp.status(403).json({
                message: 'subsection id is required for updating the subsection'
            })
        }
        const subSection = await Subsection.findById(subSectionId);
        if (req.files && req.files.videoUpload) {
            const uploadVideo = req.files.videoUpload;
            const uploadedVideo = await imageUploder(uploadVideo.tempFilePath, process.env.COURSE_THUMBNAIL_FOLDER_NAME);
            subSection.videoUrl = uploadedVideo.secure_url;
        }

        if (timeDuration) {
            subSection.timeDuration = timeDuration;
        }
        if (title) {
            subSection.title = title;
        }
        if (description) {
            subSection.description = description;
        }
        await subSection.save();
        return resp.status(200).json({
            success: true,
            message: 'Updated subsection successfully.',
            data: subSection

        })
    } catch (error) {
        return resp.status(500).json({
            success: false,
            message: 'Something went Wrong while updating Subsection..'
        })
    }


}

const DeleteSubSection = async (req, resp) => {
    try {
        const { subsectionId } = req.body;
        if (!subsectionId) {
            return resp.status(400).json({
                message: "All fields required to delete the SubSection.",
                success: false,
            })
        }

        const subSection = await Subsection.findById(subsectionId);
        if (!subSection) {
            return resp.status(404).json({
                message: 'SubSection does not exist.',
                success: false,
            })
        }
        const sectionId = subSection.sectionId;
        const section = await Section.findById(sectionId);
        if (!section) {
            return resp.status(404).json({
                message: 'Section does not exist.',
                success: false,
            })
        }
        const deleteSection = await Subsection.findByIdAndDelete(subsectionId);
        if (!deleteSection) {
            return resp.status(404).json({
                message: 'This subSection does not exist so we cannot delete it.',
                success: false,
            })
        }

        const updatedSection = await Section.findByIdAndUpdate(sectionId, {
            $pull: {
                subSection: subsectionId,
            }
        }, {
            new: true,
            runValidators: true
        }).populate('subSection');


        return resp.status(200).json({
            message: "the subSection is deleted Successfully",
            data: updatedSection,
            success: true,
        });

    } catch (e) {
        return resp.status(500).json({
            message: 'something went wrong while deleting the data',
            error: e.message,
            success: false
        })
    }
}
module.exports = { CreateSubSection, UpdateSubSection, DeleteSubSection };
