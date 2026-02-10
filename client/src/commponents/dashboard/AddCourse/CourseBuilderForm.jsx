import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiChevronLeft, FiChevronRight, FiPlus, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiVideo } from 'react-icons/fi';
import VideoUpload from './VideoUpload.jsx';

const CourseBuilderForm = ({ courseBuilder, setCourseBuilder, setCurrentStep, saveDraft }) => {
  const [editingSection, setEditingSection] = useState(null);
  const [editingSubSection, setEditingSubSection] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  // Section Management
  const addSection = () => {
    const newSection = {
      id: `temp-section-${Date.now()}`,
      sectionName: '',
      subSections: [],
    };
    setCourseBuilder((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
    setEditingSection(newSection.id);
  };

  const updateSection = (sectionId, sectionName) => {
    setCourseBuilder((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId ? { ...section, sectionName } : section
      ),
    }));
  };

  const deleteSection = (sectionId) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      setCourseBuilder((prev) => ({
        ...prev,
        sections: prev.sections.filter((section) => section.id !== sectionId),
      }));
      toast.success('Section deleted');
    }
  };

  // SubSection Management
  const addSubSection = (sectionId) => {
    const newSubSection = {
      id: `temp-subsection-${Date.now()}`,
      title: '',
      description: '',
      video: null,
    };
    setCourseBuilder((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? { ...section, subSections: [...section.subSections, newSubSection] }
          : section
      ),
    }));
    setEditingSubSection(newSubSection.id);
    setExpandedSections((prev) => ({ ...prev, [sectionId]: true }));
  };

  const updateSubSection = (sectionId, subSectionId, field, value) => {
    setCourseBuilder((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              subSections: section.subSections.map((sub) =>
                sub.id === subSectionId ? { ...sub, [field]: value } : sub
              ),
            }
          : section
      ),
    }));
  };

  const deleteSubSection = (sectionId, subSectionId) => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      setCourseBuilder((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === sectionId
            ? {
                ...section,
                subSections: section.subSections.filter((sub) => sub.id !== subSectionId),
              }
            : section
        ),
      }));
      toast.success('Lecture deleted');
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleBack = () => {
    saveDraft();
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    // Validation
    if (courseBuilder.sections.length === 0) {
      toast.error('Please add at least one section');
      return;
    }

    const hasEmptySections = courseBuilder.sections.some((section) => !section.sectionName.trim());
    if (hasEmptySections) {
      toast.error('Please provide names for all sections');
      return;
    }

    const hasEmptySubSections = courseBuilder.sections.some((section) =>
      section.subSections.some((sub) => !sub.title.trim())
    );
    if (hasEmptySubSections) {
      toast.error('Please provide titles for all lectures');
      return;
    }

    saveDraft();
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-richblack-5 text-2xl font-semibold">
          Course Builder
        </h2>
        <button
          type="button"
          onClick={addSection}
          className="flex items-center gap-2 bg-caribbeangreen-700 text-caribbeangreen-50 px-4 py-2 rounded-lg hover:bg-caribbeangreen-600 transition-colors"
        >
          <FiPlus size={18} />
          Add Section
        </button>
      </div>

      {courseBuilder.sections.length === 0 ? (
        <div className="bg-richblack-700 border border-richblack-600 rounded-xl p-12 text-center">
          <p className="text-richblack-300 mb-4">No sections added yet</p>
          <button
            type="button"
            onClick={addSection}
            className="bg-yellow-50 text-richblack-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-100 transition-colors"
          >
            Create Your First Section
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {courseBuilder.sections.map((section, sectionIndex) => (
            <div
              key={section.id}
              className="bg-richblack-700 border border-richblack-600 rounded-xl overflow-hidden"
            >
              {/* Section Header */}
              <div className="p-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="text-richblack-300 hover:text-richblack-5 transition-colors"
                >
                  {expandedSections[section.id] ? (
                    <FiChevronUp size={20} />
                  ) : (
                    <FiChevronDown size={20} />
                  )}
                </button>

                {editingSection === section.id ? (
                  <input
                    type="text"
                    value={section.sectionName}
                    onChange={(e) => updateSection(section.id, e.target.value)}
                    onBlur={() => setEditingSection(null)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') setEditingSection(null);
                    }}
                    placeholder="Enter section name"
                    autoFocus
                    className="flex-1 bg-richblack-600 text-richblack-5 border border-richblack-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-caribbeangreen-300"
                  />
                ) : (
                  <h3
                    className="flex-1 text-richblack-5 font-semibold cursor-pointer"
                    onClick={() => setEditingSection(section.id)}
                  >
                    {section.sectionName || `Section ${sectionIndex + 1}`}
                  </h3>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => addSubSection(section.id)}
                    className="p-2 text-caribbeangreen-200 hover:bg-richblack-600 rounded-lg transition-colors"
                    title="Add lecture"
                  >
                    <FiPlus size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingSection(section.id)}
                    className="p-2 text-richblack-300 hover:bg-richblack-600 rounded-lg transition-colors"
                    title="Edit section"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSection(section.id)}
                    className="p-2 text-pink-200 hover:bg-richblack-600 rounded-lg transition-colors"
                    title="Delete section"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>

              {/* SubSections */}
              {expandedSections[section.id] && (
                <div className="border-t border-richblack-600 bg-richblack-800 p-4">
                  {section.subSections.length === 0 ? (
                    <p className="text-richblack-400 text-sm text-center py-4">
                      No lectures added. Click + to add a lecture.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {section.subSections.map((subSection, subIndex) => (
                        <div
                          key={subSection.id}
                          className="bg-richblack-700 border border-richblack-600 rounded-lg p-4"
                        >
                          {editingSubSection === subSection.id ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={subSection.title}
                                onChange={(e) =>
                                  updateSubSection(section.id, subSection.id, 'title', e.target.value)
                                }
                                placeholder="Lecture title"
                                className="w-full bg-richblack-600 text-richblack-5 border border-richblack-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-caribbeangreen-300"
                              />
                              <textarea
                                value={subSection.description}
                                onChange={(e) =>
                                  updateSubSection(section.id, subSection.id, 'description', e.target.value)
                                }
                                placeholder="Lecture description"
                                rows={2}
                                className="w-full bg-richblack-600 text-richblack-5 border border-richblack-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-caribbeangreen-300 resize-none"
                              />
                              <div>
                                <label className="block text-richblack-5 text-sm font-medium mb-2">
                                  Upload Video
                                </label>
                                <VideoUpload
                                  video={subSection.video}
                                  setVideo={(file) =>
                                    updateSubSection(section.id, subSection.id, 'video', file)
                                  }
                                  subSectionId={subSection.id}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => setEditingSubSection(null)}
                                className="bg-caribbeangreen-700 text-caribbeangreen-50 px-4 py-2 rounded-lg hover:bg-caribbeangreen-600 transition-colors text-sm"
                              >
                                Done
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-richblack-5 font-medium mb-1">
                                  {subSection.title || `Lecture ${subIndex + 1}`}
                                </h4>
                                {subSection.description && (
                                  <p className="text-richblack-400 text-sm mb-1">
                                    {subSection.description}
                                  </p>
                                )}
                                {subSection.video && (
                                  <p className="text-caribbeangreen-200 text-xs flex items-center gap-1">
                                    <FiVideo size={12} />
                                    Video uploaded: {subSection.video.name}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <button
                                  type="button"
                                  onClick={() => setEditingSubSection(subSection.id)}
                                  className="p-1.5 text-richblack-300 hover:bg-richblack-600 rounded transition-colors"
                                  title="Edit lecture"
                                >
                                  <FiEdit2 size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteSubSection(section.id, subSection.id)}
                                  className="p-1.5 text-pink-200 hover:bg-richblack-600 rounded transition-colors"
                                  title="Delete lecture"
                                >
                                  <FiTrash2 size={16} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-richblack-700">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 bg-richblack-700 text-richblack-5 px-6 py-3 rounded-lg font-semibold hover:bg-richblack-600 transition-colors"
        >
          <FiChevronLeft size={20} />
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 bg-yellow-50 text-richblack-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-100 transition-all duration-200 hover:scale-105"
        >
          Next
          <FiChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default CourseBuilderForm;
