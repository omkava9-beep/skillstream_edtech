import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const InstructorChart = ({ courses }) => {
    const [currentChart, setCurrentChart] = useState('students');

    // Generate random colors for the chart
    const generateRandomColors = (numColors) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            const color = `hsl(${Math.random() * 360}, 70%, 60%)`;
            colors.push(color);
        }
        return colors;
    };

    // Data for students chart
    const chartDataForStudents = {
        labels: courses.map((course) => course.courseName),
        datasets: [
            {
                data: courses.map((course) => course.studentsEnrolled),
                backgroundColor: generateRandomColors(courses.length),
                borderColor: ['rgba(255, 255, 255, 0.2)'],
                borderWidth: 1,
            },
        ],
    };

    // Data for revenue chart
    const chartDataForRevenue = {
        labels: courses.map((course) => course.courseName),
        datasets: [
            {
                data: courses.map((course) => course.revenue),
                backgroundColor: generateRandomColors(courses.length),
                borderColor: ['rgba(255, 255, 255, 0.2)'],
                borderWidth: 1,
            },
        ],
    };

    // Chart options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right', // Moved legend to right for better use of horizontal space
                labels: {
                    color: '#E5E7EB',
                    font: {
                        size: 10, // Reduced font size
                    },
                    padding: 10,
                    usePointStyle: true,
                    boxWidth: 8
                },
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                titleColor: '#F9FAFB',
                bodyColor: '#E5E7EB',
                borderColor: '#FFD60A',
                borderWidth: 1,
                padding: 8, // Reduced padding
                displayColors: true,
                callbacks: {
                    label: function (context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (currentChart === 'students') {
                            label += context.parsed + ' students';
                        } else {
                            label += '₹' + context.parsed.toLocaleString();
                        }
                        return label;
                    },
                },
            },
        },
    };

    return (
        <div className="bg-gradient-to-br from-richblack-800 to-richblack-900 border border-richblack-700 rounded-lg p-4 shadow-lg hover:shadow-yellow-400/10 transition-all duration-300">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-richblack-5">
                    Visualize Analytics
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentChart('students')}
                        className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-all duration-200 ${
                            currentChart === 'students'
                                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-richblack-900 shadow-md shadow-yellow-400/20'
                                : 'bg-richblack-700 text-richblack-100 hover:bg-richblack-600 border border-richblack-600'
                        }`}
                    >
                        Students
                    </button>
                    <button
                        onClick={() => setCurrentChart('revenue')}
                        className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-all duration-200 ${
                            currentChart === 'revenue'
                                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-richblack-900 shadow-md shadow-yellow-400/20'
                                : 'bg-richblack-700 text-richblack-100 hover:bg-richblack-600 border border-richblack-600'
                        }`}
                    >
                        Revenue
                    </button>
                </div>
            </div>

            <div className="relative h-[300px] w-full flex items-center justify-center">
                <Pie
                    data={currentChart === 'students' ? chartDataForStudents : chartDataForRevenue}
                    options={options}
                />
            </div>
        </div>
    );
};

export default InstructorChart;
