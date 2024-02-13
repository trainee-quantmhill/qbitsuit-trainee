import multer from 'multer';

// Set up Multer for handling file uploads


const storage = multer.memoryStorage();
export const Update =multer({
    storage: storage,
    limits: { files: 2}
  });


export const Upload = multer({
    storage: storage,
  });