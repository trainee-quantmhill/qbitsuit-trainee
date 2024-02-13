import cloudinary from '../config/cloudinaryConfig.js';
import upload from '../config/multerConfig.js';
import Laravel from "../model/laravelModel.js";

//upload Laravel
export const uploadLaravel = async (req, res) => {
    try {
        const file = req.file;
        const { laravelHeading, laravelSubheading } = req.body;
        // Check if file is exit
        if (!file) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (!laravelHeading || !laravelSubheading) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        // Upload the file to Cloudinary using upload_stream
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error uploading to Cloudinary' });
            }

            const newImage = new Laravel({
                laravelHeading,
                laravelSubheading,
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
        // const existlaravelObject = await Laravel.findById(req.params.id);

        // if (!existlaravelObject) {
        //     return res.status(404).json({ success: false, message: 'laravelobject not found.' });
        // }
        if(req.file){
            // const laravelUrl = existlaravelObject.laravelUrl;

            // // Extract the public ID from the Cloudinary URL
            // const publicId = extractPublicIdFromUrl(laravelUrl);
    
            // if (!publicId) {
            //     return res.status(400).json({ error: 'Invalid Cloudinary URL' });
            // }
    
            // // Delete the image from Cloudinary using its public ID
            // await cloudinary.uploader.destroy(publicId);
    
        
        // Upload the new image to Cloudinary
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error updating to Cloudinary' });
            }
            
            // Update the image details in the database
            const updatedImage = await Laravel.updateOne({}, {
                laravelHeading: req.body.laravelHeading || laravelHeading,
                laravelSubheading: req.body.laravelSubheading || laravelSubheading,
                laravelUrl: result.url
            }, { new: true });

            // Send a success response
            res.json({
                message: 'File updated successfully',
            });
        }).end(req.file.buffer);
    } 
    else{
        const updatedImage = await Laravel.updateOne({}, {
            laravelHeading: req.body.laravelHeading || laravelHeading,
            laravelSubheading: req.body.laravelSubheading || laravelSubheading,
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

//get laravel
export const getLaravel = async (req, res) => {
    try {
        // Find the document based on the laravelHeading
        const foundLaravel = await Laravel.findOne({ laravelHeading: req.params.laravelHeading });

        // Check if the document is found
        if (!foundLaravel) {
            return res.status(404).json({ message: 'Laravel content not found' });
        }

        // Respond with the found document
        res.json(foundLaravel);
    } catch (error) {
        console.error('Error fetching Laravel content:', error);
        res.status(500).json({ error: `Error fetching Laravel content: ${error.message}` });
    }
};


//delete laravel
export const deleteLaravel = async (req, res) => {
    try {

        // Find the document based on the accountHeading
        const existingLaravelObject = await Laravel.findOne({ laravelHeading: req.params.laravelHeading });

        if (!existingLaravelObject) {
            return res.status(404).json({ success: false, message: 'Account not found.' });
        }

        const laravelUrl = existingLaravelObject.laravelUrl;

        // Extract the public ID from the Cloudinary URL
        const publicId = extractPublicIdFromUrl(laravelUrl);
        if (!publicId) {
            return res.status(400).json({ error: 'Invalid Cloudinary URL' });
        }

        // Delete the image from Cloudinary using its public ID
        await cloudinary.uploader.destroy(publicId);


        // Find and delete the document based on the laravelHeading
        const deletedLaravel = await Laravel.findOneAndDelete({ laravelHeading: req.params.laravelHeading });

        // Check if the document is found and deleted
        if (!deletedLaravel) {
            return res.status(404).json({ message: 'Laravel not found for deletion' });
        }

        // Respond with a success message
        res.json({ message: 'Laravel deleted successfully', deletedLaravel });
    } catch (error) {
        console.error('Error deleting Laravel:', error);
        res.status(500).json({ error: `Error deleting Laravel: ${error.message}` });
    }
};
