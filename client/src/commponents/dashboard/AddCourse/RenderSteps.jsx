import React from 'react';
import CourseInformationForm from './CourseInformationForm';
import CourseBuilderForm from './CourseBuilderForm';
import PublishCourse from './PublishCourse';

const RenderSteps = ({
  currentStep,
  setCurrentStep,
  courseInfo,
  setCourseInfo,
  courseBuilder,
  setCourseBuilder,
  publishSettings,
  setPublishSettings,
  saveDraft,
  clearDraft,
  token,
  navigate,
  editCourse,
}) => {
  switch (currentStep) {
    case 1:
      return (
        <CourseInformationForm
          courseInfo={courseInfo}
          setCourseInfo={setCourseInfo}
          setCurrentStep={setCurrentStep}
          saveDraft={saveDraft}
          editCourse={editCourse}
        />
      );
    case 2:
      return (
        <CourseBuilderForm
          courseBuilder={courseBuilder}
          setCourseBuilder={setCourseBuilder}
          setCurrentStep={setCurrentStep}
          saveDraft={saveDraft}
          editCourse={editCourse}
        />
      );
    case 3:
      return (
        <PublishCourse
          courseInfo={courseInfo}
          courseBuilder={courseBuilder}
          publishSettings={publishSettings}
          setPublishSettings={setPublishSettings}
          setCurrentStep={setCurrentStep}
          clearDraft={clearDraft}
          token={token}
          navigate={navigate}
          editCourse={editCourse}
        />
      );
    default:
      return null;
  }
};

export default RenderSteps;
