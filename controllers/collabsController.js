import cloudinary from '../config/cloudinaryConfig.js';
import upload from '../config/multerConfig.js';

//components
import Collabs from '../model/collabsModel.js'


//update collab
// export const updateCollabs = async (req, res) => {
//     try {
//         // Check if the image exists in the database
//         const existingCollabs = await Collabs.findById(req.params.id);

//         if (!existingCollabs) {
//             return res.status(404).json({ success: false, message: 'collabobject not found.' });
//         }
//         if (req.file) {
//             const checkPointUrl = existingCollabs.checkPointUrl;

//             // Extract the public ID from the Cloudinary URL
//             const publicId = extractPublicIdFromUrl(checkPointUrl);

//             if (!publicId) {
//                 return res.status(400).json({ error: 'Invalid Cloudinary URL' });
//             }

//             // Delete the image from Cloudinary using its public ID
//             await cloudinary.uploader.destroy(publicId);

//             // Upload the new image to Cloudinary
//             cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
//                 if (err) {
//                     return res.status(500).json({ error: 'Error updating to Cloudinary' });
//                 }

//                 // Update the image details in the database
//                 const updatedCollabs = await Collabs.findByIdAndUpdate(req.params.id, {
//                     collabHeading: req.body.collabHeading || existingCollabs.collabHeading,
//                     collabParagraph: req.body.collabParagraph || existingCollabs.collabParagraph,
//                     collabSubheading: req.body.collabSubheading || existingCollabs.collabSubheading,
//                     checkPointHeading: req.body.checkPointHeading || existingCollabs.checkPointHeading,
//                     checkPointParagraph: req.body.checkPointParagraph || existingCollabs.checkPointParagraph,
//                     checkPointUrl: result.url
//                 }, { new: true });

//                 // Send a success response
//                 res.json({
//                     message: 'File upldated successfully',
//                     cloudinaryResult: result
//                 });
//             }).end(req.file.buffer);
//         }
//         else {
//             const updatedCollabs = await Collabs.findByIdAndUpdate(req.params.id, {
//                 collabHeading: req.body.collabHeading || existingCollabs.collabHeading,
//                 collabParagraph: req.body.collabParagraph || existingCollabs.collabParagraph,
//                 collabSubheading: req.body.collabSubheading || existingCollabs.collabSubheading,
//                 checkPointHeading: req.body.checkPointHeading || existingCollabs.checkPointHeading,
//                 checkPointParagraph: req.body.checkPointParagraph || existingCollabs.checkPointParagraph,
//             }, { new: true });
//             res.json({
//                 message: 'File updated successfully',
//             });
//         }
//     } catch (error) {
//         console.error('Error handling file upload:', error);
//         res.status(500).json({ error: `Error handling file upload: ${error.message}` });
//     }
// };

export const updateCollabs = async (req, res) => {
    try {
        if (req.file) {
            // Upload the new image to Cloudinary
            cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error updating to Cloudinary' });
                }

                // Update the image URL and Laravel details in the database
                const collab = await Collabs.updateOne({}, {
                    collabHeading: req.body.collabHeading || collabHeading,
                    collabParagraph: req.body.collabParagraph || collabParagraph,
                    collabSubheading: req.body.collabSubheading || collabSubheading,
                    checkPointHeading: req.body.checkPointHeading || checkPointHeading,
                    checkPointParagraph: req.body.checkPointParagraph || checkPointParagraph,
                    checkPointUrl: result.url,
                }, { new: true });

                // Send a success response
                res.json({
                    message: 'File and Collabs details updated successfully',
                    collab,
                });
            }).end(req.file.buffer);
        } else {
            // Update the Laravel details in the database without changing the image URL
            const collab = await Collabs.updateOne({}, {
                collabHeading: req.body.collabHeading || collabHeading,
                collabParagraph: req.body.collabParagraph || collabParagraph,
                collabSubheading: req.body.collabSubheading || collabSubheading,
                checkPointHeading: req.body.checkPointHeading || checkPointHeading,
                checkPointParagraph: req.body.checkPointParagraph || checkPointParagraph,
            }, { new: true });

            res.json({
                message: 'collab details updated successfully',
                collab,
            });
        }
    } catch (error) {
        res.status(500).json({ error: `Error handling file upload: ${error.message}` });
    }
};


//upload collab
export const uploadCollabs = async (req, res) => {
    try {
        // Access the uploaded file using req.file
        const file = req.file;
        console.log("file::", file);
        console.log(req.body);

        const { collabHeading, collabParagraph, collabSubheading, checkPointHeading, checkPointParagraph } = req.body

        // Check if file is present
        if (!file) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!collabHeading || !collabParagraph || !collabSubheading || !checkPointHeading || !checkPointParagraph) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        // Upload the file to Cloudinary using upload_stream
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
            if (err) {
                console.error('Error uploading to Cloudinary:', err);
                return res.status(500).json({ error: 'Error uploading to Cloudinary' });
            }

            const newImage = new Collabs({
                collabHeading,
                collabParagraph,
                collabSubheading,
                checkPointHeading,
                checkPointParagraph,
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

//get collabe
export const getCollab = async (req, res) => {
    try {

        // Find the document based on the 
        const foundCollab = await Collabs.findOne({});

        // Check if the document is found
        if (!foundCollab) {
            return res.status(404).json({ message: 'Collaboration not found' });
        }

        // Respond with the found document
        res.json(foundCollab);
    } catch (error) {
        console.error('Error fetching collaboration:', error);
        res.status(500).json({ error: `Error fetching collaboration: ${error.message}` });
    }
};

//delete-collab
export const deleteCollab = async (req, res) => {
    try {
        // Find the document based on the accountHeading
        const existingCollabObject = await Collabs.findOne({ collabHeading: req.params.collabHeading });

        if (!existingCollabObject) {
            return res.status(404).json({ success: false, message: 'Account not found.' });
        }

        const checkImageUrl = existingCollabObject.checkPointUrl;

        // Extract the public ID from the Cloudinary URL
        const publicId = extractPublicIdFromUrl(checkImageUrl);
        if (!publicId) {
            return res.status(400).json({ error: 'Invalid Cloudinary URL' });
        }

        // Delete the image from Cloudinary using its public ID
        await cloudinary.uploader.destroy(publicId);

        // Find and delete the document based on the collabHeading
        const deletedCollab = await Collabs.findOneAndDelete({ collabHeading: req.params.collabHeading });

        // Check if the document is found and deleted
        if (!deletedCollab) {
            return res.status(404).json({ message: 'Collab not found for deletion' });
        }

        // Respond with a success message
        res.json({ message: 'Collab deleted successfully', deletedCollab });
    } catch (error) {
        console.error('Error deleting collab:', error);
        res.status(500).json({ error: `Error deleting collab: ${error.message}` });
    }
};

