import cloudinary from '../config/cloudinaryConfig.js';
import upload from '../config/multerConfig.js';

//components
import Collabs from '../model/collabsModel.js'


//update collab
export const updateCollabs = async (req, res) => {
    try {
        // Check if the image exists in the database
        const existingCollabs = await Collabs.findById(req.params.id);

        if (!existingCollabs) {
            return res.status(404).json({ success: false, message: 'collabobject not found.' });
        }
        if(req.file){
            const checkPointUrl = existingCollabs.checkPointUrl;

            // Extract the public ID from the Cloudinary URL
            const publicId = extractPublicIdFromUrl(checkPointUrl);
    
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

            // Update the image details in the database
            const updatedCollabs = await Collabs.findByIdAndUpdate(req.params.id, {
                collabHeading: req.body.collabHeading || existingCollabs.collabHeading,
                collabParagraph: req.body.collabParagraph || existingCollabs.collabParagraph,
                collabSubheading: req.body.collabSubheading || existingCollabs.collabSubheading,
                checkPointHeading: req.body.checkPointHeading || existingCollabs.checkPointHeading,
                checkPointParagraph: req.body.checkPointParagraph || existingCollabs.checkPointParagraph,
                checkPointUrl: result.url
            }, { new: true });

            // Send a success response
            res.json({
                message: 'File upldated successfully',
                cloudinaryResult: result
            });
        }).end(req.file.buffer);
}
    else{
        const updatedCollabs = await Collabs.findByIdAndUpdate(req.params.id, {
            collabHeading: req.body.collabHeading || existingCollabs.collabHeading,
                collabParagraph: req.body.collabParagraph || existingCollabs.collabParagraph,
                collabSubheading: req.body.collabSubheading || existingCollabs.collabSubheading,
                checkPointHeading: req.body.checkPointHeading || existingCollabs.checkPointHeading,
                checkPointParagraph: req.body.checkPointParagraph || existingCollabs.checkPointParagraph,
        }, { new: true });
        res.json({
            message: 'File updated successfully',
        });
    }
}catch (error) {
        console.error('Error handling file upload:', error);
        res.status(500).json({ error: `Error handling file upload: ${error.message}` });
    }
};

console.log("sajgd")
//upload collab
export const uploadCollabs = async (req, res) => {
    try {
        // Access the uploaded file using req.file
        const file = req.file;
        console.log("file::",file);
        // Check if file is present
        if (!file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        // Upload the file to Cloudinary using upload_stream
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
            if (err) {
                console.error('Error uploading to Cloudinary:', err);
                return res.status(500).json({ error: 'Error uploading to Cloudinary' });
            }

            const newImage = new Collabs({
                collabHeading: req.body.collabHeading,
                collabParagraph: req.body.collabParagraph,
                collabSubheading: req.body.collabSubheading,
                checkPointHeading: req.body.checkPointHeading,
                checkPointParagraph: req.body.checkPointParagraph,
                checkPointUrl: result.url
            });


            // Save the image data to the database
            await newImage.save();

            // Send a success response
            res.json({
                message: 'File uploaded successfully',
            });
        }).end(file.buffer);
    } catch (error) {
        console.error('Error handling file upload:', error);
        res.status(500).json({ error: `Error handling file upload: ${error.message}` });
    }
};

// Function to extract public ID from Cloudinary URL
const extractPublicIdFromUrl = (url) => {
    const matches = url.match(/\/upload\/v\d+\/(.+?)\./);

    if (matches && matches.length === 2) {
        return matches[1];
    }

    return null;
};