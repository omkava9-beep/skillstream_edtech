const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });
const SubSection = require('./models/SubSection');

const fixVideos = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to DB');
    
    const subs = await SubSection.find({});
    console.log(`Found ${subs.length} subsections.`);
    for (let sub of subs) {
        if (sub.videoUrl && typeof sub.videoUrl === 'string') {
            // Replace http:// with https:// and commondatastorage with storage
            let newUrl = sub.videoUrl.replace('http://', 'https://');
            newUrl = newUrl.replace('commondatastorage.googleapis.com', 'storage.googleapis.com');
            sub.videoUrl = newUrl;
            await sub.save();
        }
    }
    console.log('Updated video URLs successfully.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
fixVideos();
