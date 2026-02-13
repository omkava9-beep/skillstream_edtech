import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    courseSectionData: [],
    courseEntireData: [],
    completedLectures: [],
    totalNoOfLectures: 0,
}

const viewCourseSlice = createSlice({
    name: "viewCourse",
    initialState,
    reducers: {
        setCourseSectionData: (state, action) => {
            state.courseSectionData = action.payload
        },
        setEntireCourseData: (state, action) => {
            state.courseEntireData = action.payload
        },
        setTotalNoOfLectures: (state, action) => {
            state.totalNoOfLectures = action.payload
        },
        setCompletedLectures: (state, action) => {
            state.completedLectures = action.payload
        },
        updateCompletedLectures: (state, action) => {
            const index = state.completedLectures.indexOf(action.payload)
            if (index !== -1) {
                // If already present, remove it
                state.completedLectures.splice(index, 1)
            } else {
                // If not present, add it
                state.completedLectures.push(action.payload)
            }
        },
    },
})

export const {
    setCourseSectionData,
    setEntireCourseData,
    setTotalNoOfLectures,
    setCompletedLectures,
    updateCompletedLectures,
} = viewCourseSlice.actions

export default viewCourseSlice.reducer
