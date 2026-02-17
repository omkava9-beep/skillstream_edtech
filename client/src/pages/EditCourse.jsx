import React from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import AddCourse from '../commponents/dashboard/AddCourse';

const EditCourse = () => {
    // The AddCourse component will handle the logic of checking for courseId 
    // and fetching the course details to populate the form.
    return (
        <div className=''>
            <AddCourse />
        </div>
    );
};

export default EditCourse;
