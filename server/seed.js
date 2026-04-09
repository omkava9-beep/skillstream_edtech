const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: __dirname + '/.env' });

// Models
const User = require('./models/User');
const Profile = require('./models/Profile');
const Course = require('./models/Course');
const Category = require('./models/Catagory');
const Section = require('./models/Section');
const SubSection = require('./models/SubSection');
const CourseProgress = require('./models/CourseProgress');
const RatingAndReviews = require('./models/RatingAndReviews');

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...', process.env.MONGO_URL ? 'URL found' : 'URL NOT FOUND');
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to Database successfully!');

    // Fixed password for all seeded users
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create Categories
    console.log('Seeding Categories...');
    const catWebDev = new Category({ name: 'Web Development', description: 'Learn modern web application development.' });
    await catWebDev.save();

    const catDataScience = new Category({ name: 'Data Science', description: 'Master machine learning and AI.' });
    await catDataScience.save();

    const catDesign = new Category({ name: 'Design', description: 'Master UI/UX design, tools, and visual aesthetics.' });
    await catDesign.save();

    const catBusiness = new Category({ name: 'Business', description: 'Learn marketing, sales, and management.' });
    await catBusiness.save();
    
    // 2. Create Instructors
    console.log('Seeding Instructors...');
    const instructor1Profile = await Profile.create({ gender: 'Male', about: 'Senior Web Developer.', contact: 1234567890 });
    const instructor1 = await User.create({ firstName: 'John', lastName: 'Doe', email: 'instructor1@seed.com', password: hashedPassword, accountType: 'Instructor', additionalDetails: instructor1Profile._id, image: `https://api.dicebear.com/5.x/initials/svg?seed=John%20Doe`, active: true });

    const instructor2Profile = await Profile.create({ gender: 'Female', about: 'Data Scientist.', contact: 9876543210 });
    const instructor2 = await User.create({ firstName: 'Jane', lastName: 'Smith', email: 'instructor2@seed.com', password: hashedPassword, accountType: 'Instructor', additionalDetails: instructor2Profile._id, image: `https://api.dicebear.com/5.x/initials/svg?seed=Jane%20Smith`, active: true });

    const instructor3Profile = await Profile.create({ gender: 'Male', about: 'UI/UX Lead Designer.', contact: 1112223334 });
    const instructor3 = await User.create({ firstName: 'Alex', lastName: 'Design', email: 'instructor3@seed.com', password: hashedPassword, accountType: 'Instructor', additionalDetails: instructor3Profile._id, image: `https://api.dicebear.com/5.x/initials/svg?seed=Alex%20Design`, active: true });

    // 3. Create Students
    console.log('Seeding Students...');
    const student1Profile = await Profile.create({ gender: 'Male', about: 'Enthusiastic beginner in coding.' });
    const student1 = await User.create({ firstName: 'Alice', lastName: 'Johnson', email: 'student1@seed.com', password: hashedPassword, accountType: 'Student', additionalDetails: student1Profile._id, image: `https://api.dicebear.com/5.x/initials/svg?seed=Alice%20Johnson`, active: true });

    const student2Profile = await Profile.create({ gender: 'Female', about: 'Looking to upskill my career.' });
    const student2 = await User.create({ firstName: 'Bob', lastName: 'Williams', email: 'student2@seed.com', password: hashedPassword, accountType: 'Student', additionalDetails: student2Profile._id, image: `https://api.dicebear.com/5.x/initials/svg?seed=Bob%20Williams`, active: true });

    // Helper URLs for video content (Using HTTPS to avoid blocked mixed content!)
    const vids = [
        "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"
    ];

    // 4. Create Courses
    console.log('Seeding Courses...');
    const buildCourse = async (name, desc, ins, cat, thumb, price, sectionsData) => {
        const course = await Course.create({ courseName: name, courseDescription: desc, instructor: ins._id, whatYouWillLearn: 'Everything from zero to hero.', catagory: cat._id, tag: ['featured'], thumbnail: thumb, price: price, status: 'Published' });
        cat.courses.push(course._id);
        await cat.save();
        ins.courses.push(course._id);
        await ins.save();

        for (const [sIdx, secName] of sectionsData.entries()) {
            const sec = await Section.create({ sectionName: secName, courseId: course._id });
            course.courseContent.push(sec._id);
            for (let i = 1; i <= 2; i++) {
                const sub = await SubSection.create({ sectionId: sec._id, title: `Lesson ${i} in ${secName}`, timeDuration: '10:00', description: `This is a high quality lecture demonstrating lesson ${i}.`, videoUrl: vids[(sIdx + i) % vids.length] });
                sec.subSection.push(sub._id);
            }
            await sec.save();
        }
        await course.save();
        return course;
    };

    const c1 = await buildCourse('Modern React Mastery', 'Learn React 18, Redux, and Next.js', instructor1, catWebDev, 'https://res.cloudinary.com/dnxirgypl/image/upload/v1771343729/MERN-Stack_qf2y9t.png', 4999, ['Basics of React', 'Advanced State Management', 'Next.js SSR']);
    const c2 = await buildCourse('Complete Node.js Backend', 'Build scalable APIs with Express and Node.js', instructor1, catWebDev, 'https://res.cloudinary.com/dnxirgypl/image/upload/v1771343730/Data-Science_xz2y9u.png', 3999, ['Node Architecture', 'Express Framework', 'Database Integration']);
    const c3 = await buildCourse('Python for Data Science', 'Pandas, NumPy, and Scikit-Learn', instructor2, catDataScience, 'https://res.cloudinary.com/dnxirgypl/image/upload/v1771343729/MERN-Stack_qf2y9t.png', 5999, ['Python Basics', 'Data Manipulation', 'Machine Learning Algorithms']);
    const c4 = await buildCourse('Deep Learning with PyTorch', 'Build Neural Networks from scratch', instructor2, catDataScience, 'https://res.cloudinary.com/dnxirgypl/image/upload/v1771343730/Data-Science_xz2y9u.png', 6999, ['Neural Network Basics', 'CNNs for Vision', 'RNNs for Text']);
    const c5 = await buildCourse('UI/UX Design Masterclass', 'Figma, Prototyping, and Design Systems', instructor3, catDesign, 'https://res.cloudinary.com/dnxirgypl/image/upload/v1771343729/MERN-Stack_qf2y9t.png', 2999, ['Color Theory', 'Typography', 'Figma Mastery']);
    const c6 = await buildCourse('Business Strategy & Growth', 'Scale your startup to 1M MRR', instructor1, catBusiness, 'https://res.cloudinary.com/dnxirgypl/image/upload/v1771343730/Data-Science_xz2y9u.png', 8999, ['Market Research', 'Sales Tactics', 'Scaling Operations']);

    console.log('Courses & Videos seeded successfully!');

    // 5. Enroll Students & Add Reviews
    console.log('Enrolling students & adding reviews...');
    
    // Student 1 enrollments
    c1.studentsEnrolled.push(student1._id); await c1.save(); student1.courses.push(c1._id);
    c2.studentsEnrolled.push(student1._id); await c2.save(); student1.courses.push(c2._id);
    c5.studentsEnrolled.push(student1._id); await c5.save(); student1.courses.push(c5._id);
    await student1.save();
    
    // Student 2 enrollments
    c3.studentsEnrolled.push(student2._id); await c3.save(); student2.courses.push(c3._id);
    c4.studentsEnrolled.push(student2._id); await c4.save(); student2.courses.push(c4._id);
    c6.studentsEnrolled.push(student2._id); await c6.save(); student2.courses.push(c6._id);
    await student2.save();

    // Add some reviews
    const r1 = await RatingAndReviews.create({ user: student1._id, rating: 5, review: 'Fantastic course, exactly what I needed to level up.', course: c1._id }); c1.ratingAndReviews.push(r1._id); await c1.save();
    const r2 = await RatingAndReviews.create({ user: student1._id, rating: 4, review: 'Great material but slightly fast-paced.', course: c2._id }); c2.ratingAndReviews.push(r2._id); await c2.save();
    const r3 = await RatingAndReviews.create({ user: student2._id, rating: 5, review: 'Best data science tutorial on the internet.', course: c3._id }); c3.ratingAndReviews.push(r3._id); await c3.save();

    console.log('Seeding process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
