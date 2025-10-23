const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary using environment variables. This prevents empty
// strings from being used and failing silently.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

const storage = new multer.memoryStorage();

async function imageUploadUtil(file) {
  console.log('Cloudinary config check:', {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
    apiKey: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
    apiSecret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing',
  });

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error(
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in your .env'
    );
  }

  try {
    console.log('Starting Cloudinary upload');
    // file can be a data URL or a buffer/string path. We support data URLs
    // because the client posts the file as multipart and we convert to base64.
    const result = await cloudinary.uploader.upload(file, {
      resource_type: 'auto',
    });
    console.log('Cloudinary upload successful:', result.url);
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error.message);
    throw error; // Re-throw to be handled by the controller
  }
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };
