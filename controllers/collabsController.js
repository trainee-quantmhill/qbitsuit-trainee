import cloudinary from '../config/cloudinaryConfig.js';
import upload from '../config/multerConfig.js';

//components
import {Collabs,CheckPoint} from '../model/collabsModel.js'


//update collab


// export const updateCollabs = async (req, res) => {
//     try {
//         if (req.file) {
//             // Upload the new image to Cloudinary
//             cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
//                 if (err) {
//                     return res.status(500).json({ error: 'Error updating to Cloudinary' });
//                 }

//                 // Update the image URL and Laravel details in the database
//                 const collab = await Collabs.updateOne({}, {
//                     collabHeading: req.body.collabHeading || collabHeading,
//                     collabParagraph: req.body.collabParagraph || collabParagraph,
//                     collabSubheading: req.body.collabSubheading || collabSubheading,
//                     checkPointHeading: req.body.checkPointHeading || checkPointHeading,
//                     checkPointParagraph: req.body.checkPointParagraph || checkPointParagraph,
//                     checkPointUrl: result.url,
//                 }, { new: true });

//                 const Collab = await Collabs.findOne({});
//                 // Send a success response
//                 res.json(Collab);
//             }).end(req.file.buffer);
//         } else {
//             // Update the Laravel details in the database without changing the image URL
//             const collab = await Collabs.updateOne({}, {
//                 collabHeading: req.body.collabHeading || collabHeading,
//                 collabParagraph: req.body.collabParagraph || collabParagraph,
//                 collabSubheading: req.body.collabSubheading || collabSubheading,
//                 checkPointHeading: req.body.checkPointHeading || checkPointHeading,
//                 checkPointParagraph: req.body.checkPointParagraph || checkPointParagraph,
//             }, { new: true });


//             const Collab = await Collabs.findOne({});            
//             res.json(Collab);
//         }
//     } catch (error) {
//         res.status(500).json({ error: `Error handling file upload: ${error.message}` });
//     }
// };





export const updateCollabs = async (req, res) => {
    try {
        // Assuming you have some criteria to uniquely identify the document to update
        const filter = {}; // Add your filter criteria here

        const update = {
            collabHeading: req.body.collabHeading || collabHeading,
            collabParagraph: req.body.collabParagraph || collabParagraph,
            collabSubheading: req.body.collabSubheading || collabSubheading,
            // Add other fields you want to update
        };

        const options = { new: true }; // This ensures that the updated document is returned

        const updateCollabs = await Collabs.updateOne(filter, update, options);

        const module = await Collabs.findOne({});
        res.json(module);
    } catch (error) {
        res.status(500).json({ error: `${error}` });
    }
};


//upload collab
export const uploadCollabs =  async (req, res) => {
    try {
        console.log(req.body);
        const { collabHeading, collabParagraph, collabSubheading } = req.body

        // Check if required fields are present
        if (!collabHeading || !collabParagraph   ||  !collabSubheading) {
            return res.status(400).json({ error: 'collabHeading and collabParagraph  and collabSubheading  are required' });
        }

        // Create a new module document
        const newCollab = new Collabs({
            collabHeading,
            collabParagraph,
            collabSubheading
        });


        // Save the new module to the database
        await newCollab.save();

        res.status(201).json({ message: 'Collab created successfully', collab: newCollab });
    } catch (error) {
        console.error('Error creating collab:', error);
        res.status(500).json({ error: 'Internal Server Error' });
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



// uploadcheckPoints
export const uploadcheckPoints = async (req, res) => {
    try {

        console.log("hello");
        // Access the uploaded file using req.file
        const file = req.file;
        const { checkPointHeading, checkPointParagraph } = req.body;
        // Check if file is present
        if (!file) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (!checkPointHeading || !checkPointParagraph) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        // Upload the file to Cloudinary using upload_stream
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error uploading to Cloudinary' });
            }

            const newCheckPoint = new CheckPoint ({
                checkPointHeading,
                checkPointParagraph,
                checkPointUrl: result.url
            });

            
            // Save the image data to the database
            await newCheckPoint.save();

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



// updatecheckPoints
export const updatecheckPoints = async (req, res) => {
    try {
        if (req.file) {
            // Upload the new image to Cloudinary
            cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error updating to Cloudinary' });
                }

                // Update the image URL and Hrm1 details in the database
                await CheckPoint.updateOne({}, {
                    checkPointUrl: result.url,
                    checkPointHeading: req.body.checkPointHeading || checkPointHeading,
                    checkPointParagraph: req.body.checkPointParagraph || checkPointParagraph,
                }, { new: true });


                const checkPoint = await CheckPoint.findOne({});
                // Send a success response
                res.json(checkPoint);
            }).end(req.file.buffer);
        } else {
            // Update the Laravel details in the database without changing the image URL
             await CheckPoint.updateOne({}, {
                checkPointHeading: req.body.checkPointHeading || checkPointHeading,
                checkPointParagraph: req.body.checkPointParagraph || checkPointParagraph,
            }, { new: true });

            const checkPoint = await CheckPoint.findOne({});
                // Send a success response
                res.json(checkPoint);
        }
    } catch (error) {
        res.status(500).json({ error: `Error handling file upload: ${error.message}` });
    }
};




//get CheckPoints
export const getcheckPoints = async (req, res) => {
    try {
        // Find the document based on the 
        const foundCheckpoint = await CheckPoint.findOne({});

        // Check if the document is found
        if (!foundCheckpoint) {
            return res.status(404).json({ message: 'Hrm1 content not found' });
        }

        // Create an array with the properties of foundCheckpoint
        const checkPointArray = [
            foundCheckpoint._id,
            foundCheckpoint.checkPointHeading,
            foundCheckpoint.checkPointParagraph,
            foundCheckpoint.checkPointUrl
        ];

        // Respond with the found document
        res.json(checkPointArray);
    } catch (error) {
        console.error('Error fetching Hrm1 content:', error);
        res.status(500).json({ error: `Error fetching Checkpoint content: ${error.message}` });
    }
};


