import cloudinary from '../config/cloudinaryConfig.js';
import upload from '../config/multerConfig.js';
import Laravel from "../model/laravelModel.js";

//upload Laravel
export const uploadLaravel = async (req, res) => {
    try {
        const file = req.file;

        // Check if file is exit
        if (!file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        // Upload the file to Cloudinary using upload_stream
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error uploading to Cloudinary' });
            }

            const newImage = new Laravel({
                laravelHeading: req.body.laravelHeading,
                laravelSubheading: req.body.laravelSubheading,
                laravelUrl: result.url
            });


            // Save the object  to the database
            await newImage.save();

            // Send a success response
            res.json({
                message: 'File uploaded successfully',
            });
        }).end(file.buffer);
    } catch (error) {
        res.status(500).json({ error: `Error handling file upload: ${error.message}` });
    }
};

//update Laravel
export const updateLaravel = async (req, res) => {
    try {
        // Check if the image exists in the database
        const existlaravelObject = await Laravel.findById(req.params.id);

        if (!existlaravelObject) {
            return res.status(404).json({ success: false, message: 'laravelobject not found.' });
        }
        if(req.file){
            const laravelUrl = existlaravelObject.laravelUrl;

            
            // Extract the public ID from the Cloudinary URL
            const publicId = extractPublicIdFromUrl(laravelUrl);
    
            if (!publicId) {
                return res.status(400).json({ error: 'Invalid Cloudinary URL' });
            }
    
            // Delete the image from Cloudinary using its public ID
            await cloudinary.uploader.destroy(publicId);
    
        
        // Upload the new image to Cloudinary
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error updating to Cloudinary' });
            }
            console.log("url:",result.url);
            // Update the image details in the database
            const updatedImage = await Laravel.findByIdAndUpdate(req.params.id, {
                laravelHeading: req.body.laravelHeading || existlaravelObject.laravelHeading,
                laravelSubheading: req.body.laravelSubheading || existlaravelObject.laravelSubheading,
                laravelUrl: result.url
            }, { new: true });

            // Send a success response
            res.json({
                message: 'File updated successfully',
            });
        }).end(req.file.buffer);
    } 
    else{
        const updatedImage = await Laravel.findByIdAndUpdate(req.params.id, {
            laravelHeading: req.body.laravelHeading || existlaravelObject.laravelHeading,
            laravelSubheading: req.body.laravelSubheading || existlaravelObject.laravelSubheading,
        }, { new: true });
        res.json({
            message: 'File updated successfully',
        });
    }
}catch (error) {
        res.status(500).json({ error: `Error handling file upload: ${error.message}` });
    }
};
const extractPublicIdFromUrl = (url) => {
    const matches = url.match(/\/upload\/v\d+\/(.+?)\./);

    if (matches && matches.length === 2) {
        return matches[1];
    }
    return null;
};