import multer from 'multer';

// Set up Multer for handling file uploads
const storage = multer.memoryStorage();


export const update = multer({
    storage: storage,
    limits: {
      fileSize: 2 * 1024 * 1024, // 2 MB limit for each file
    },
  });