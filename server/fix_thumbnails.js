const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });
const Course = require('./models/Course');

const fixThumbnails = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to DB');
    
    // Some reliable high quality image placeholders for courses
    const reliableThumbnails = [
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    ];

    const courses = await Course.find({});
    console.log(`Found ${courses.length} courses to check/update.`);

    let updatedCount = 0;
    for (let i = 0; i < courses.length; i++) {
        let course = courses[i];
        // Ensure all seeded courses get a nice random Unsplash tech thumbnail
        // Using modulo to cycle through the reliable thumbnails based on course index
        course.thumbnail = reliableThumbnails[i % reliableThumbnails.length];
        await course.save();
        updatedCount++;
    }

    console.log(`Successfully updated ${updatedCount} course thumbnails with high-quality tech images.`);
    process.exit(0);
  } catch (err) {
    console.error('Error fixing thumbnails:', err);
    process.exit(1);
  }
}
fixThumbnails();
