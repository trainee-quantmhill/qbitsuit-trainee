import cloudinary from '../config/cloudinaryConfig.js';
import upload from '../config/multerConfig.js';

import { Hrm1, HrmAccordian } from '../model/hrm1Model.js';


//upload hrm
export const uploadHrm = async (req, res) => {
    try {

        // Access the uploaded file using req.file
        const file = req.file;
        const { hrmHeading, hrmSubheading } = req.body;
        // Check if file is present
        if (!file) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (!hrmHeading || !hrmSubheading) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        // Upload the file to Cloudinary using upload_stream
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error uploading to Cloudinary' });
            }

            const newHrm = new Hrm1({
                hrmHeading,
                hrmSubheading,
                hrmUrl: result.url
            });

            
            // Save the image data to the database
            await newHrm.save();

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

//Hrm  update
// export const updateHrm = async (req, res) => {
//     try {
//         // Check if the image exists in the database
//         const existhrmObject = await Hrm1.findById(req.params.id);

//         if (!existhrmObject) {
//             return res.status(404).json({ success: false, message: 'Image not found.' });
//         }
//         if (req.file) {
//             const hrmUrl = existhrmObject.hrmUrl;

//             // Extract the public ID from the Cloudinary URL
//             const publicId = extractPublicIdFromUrl(hrmUrl);

//             if (!publicId) {
//                 return res.status(400).json({ error: 'Invalid Cloudinary URL' });
//             }

//             // Delete the image from Cloudinary using its public ID
//             await cloudinary.uploader.destroy(publicId);


//             // Upload the new image to Cloudinary
//             cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
//                 if (err) {
//                     console.error('Error uploading to Cloudinary:', err);
//                     return res.status(500).json({ error: 'Error updating to Cloudinary' });
//                 }

//                 // Update the image details in the database
//                 const updatedImage = await Hrm1.findByIdAndUpdate(req.params.id, {
//                     hrmHeading: req.body.hrmHeading || existhrmObject.hrmHeading,
//                     hrmSubheading: req.body.hrmSubheading || existhrmObject.hrmSubheading,
//                     hrmUrl: result.url
//                 }, { new: true });

//                 // Send a success response
//                 res.json({
//                     message: 'File upldated successfully',
//                 });
//             }).end(req.file.buffer);
//         }
//         else {
//             const updatedImage = await Hrm1.findByIdAndUpdate(req.params.id, {
//                 hrmHeading: req.body.hrmHeading || existhrmObject.hrmHeading,
//                 hrmSubheading: req.body.hrmSubheading || existhrmObject.hrmSubheading,
//             }, { new: true });
//             res.json({
//                 message: 'File updated successfully',
//             });
//         }
//     } catch (error) {
//         res.status(500).json({ error: `Error handling file upload: ${error.message}` });
//     }
// };


export const updateHrm = async (req, res) => {
    try {
        if (req.file) {
            // Upload the new image to Cloudinary
            cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error updating to Cloudinary' });
                }

                // Update the image URL and Hrm1 details in the database
                await Hrm1.updateOne({}, {
                    hrmUrl: result.url,
                    hrmHeading: req.body.hrmHeading || hrmHeading,
                    hrmSubheading: req.body.hrmSubheading || hrmSubheading,
                }, { new: true });


                const hrm1 = await Hrm1.findOne({});
                // Send a success response
                res.json({
                    message: 'File and hrm1 details updated successfully',
                    hrm1,
                });
            }).end(req.file.buffer);
        } else {
            // Update the Laravel details in the database without changing the image URL
             await Hrm1.updateOne({}, {
                hrmHeading: req.body.hrmHeading || hrmHeading,
                hrmSubheading: req.body.hrmSubheading || hrmSubheading,
            }, { new: true });

            const hrm1 = await Hrm1.findOne({});
                // Send a success response
                res.json({
                    message: 'File and hrm1 details updated successfully',
                    hrm1,
                });
        }
    } catch (error) {
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


//get hrm1
export const getHrm1 = async (req, res) => {
    try {

        // Find the document based on the 
        const foundHrm1 = await Hrm1.findOne({});

        // Check if the document is found
        if (!foundHrm1) {
            return res.status(404).json({ message: 'Hrm1 content not found' });
        }

        // Respond with the found document
        res.json(foundHrm1);
    } catch (error) {
        console.error('Error fetching Hrm1 content:', error);
        res.status(500).json({ error: `Error fetching Hrm1 content: ${error.message}` });
    }
};

//delete hrm1

export const deleteHrm1 = async (req, res) => {
    try {

        // Find the document based on the accountHeading
        const existingHrm1Object = await Hrm1.findOne({ hrmHeading: req.params.hrmHeading });

        if (!existingHrm1Object) {
            return res.status(404).json({ success: false, message: 'Account not found.' });
        }

        const hrmUrl = existingHrm1Object.hrmUrl;

        // Extract the public ID from the Cloudinary URL
        const publicId = extractPublicIdFromUrl(hrmUrl);
        if (!publicId) {
            return res.status(400).json({ error: 'Invalid Cloudinary URL' });
        }

        // Delete the image from Cloudinary using its public ID
        await cloudinary.uploader.destroy(publicId);

        // Find and delete the document based on the hrmHeading
        const deletedHrm1 = await Hrm1.findOneAndDelete({ hrmHeading: req.params.hrmHeading });

        // Check if the document is found and deleted
        if (!deletedHrm1) {
            return res.status(404).json({ message: 'HRM1 not found for deletion' });
        }

        // Respond with a success message
        res.json({ message: 'HRM1 deleted successfully', deletedHrm1 });
    } catch (error) {
        console.error('Error deleting HRM1:', error);
        res.status(500).json({ error: `Error deleting HRM1: ${error.message}` });
    }
};


//upload HrmAccord
export const uploadHrmAccord = async (req, res) => {
    try {
        const { accordian_1Heading, accordian_1Paragraph } = req.body;

        // Check if required fields are present
        if (!accordian_1Heading || !accordian_1Paragraph) {
            return res.status(400).json({ error: 'moduleHeading and moduleSubheading are required' });
        }

        // Create a new module document
        const newAccord = new HrmAccordian({
            accordian_1Heading,
            accordian_1Paragraph,
        });

        // Save the new module to the database
        await newAccord.save();

        res.status(201).json({ message: 'Built created successfully', Accord: newAccord });
    } catch (error) {
        console.error('Error creating Built:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//update hrm ACcord
export const updateHrmAccord = async (req, res) => {
    try {
        // Assuming you have some criteria to uniquely identify the document to update
        const filter = {}; // Add your filter criteria here

        const update = {
            accordian_1Heading: req.body.accordian_1Heading || accordian_1Heading,
            accordian_1Paragraph: req.body.accordian_1Paragraph || accordian_1Paragraph,
        };

        const options = { new: true }; // This ensures that the updated document is returned

        const updatedHrmAccord = await HrmAccordian.updateOne(filter, update, options);

        res.json({
            message: "Update successfully",
            updatedHrmAccord,
        });
    } catch (error) {
        res.status(500).json({ error: `${error}` });
    }
};

//get hrm1 Accordian
export const getHrm1Accordian = async (req, res) => {
    try {

        // Find the document based on the 
        const foundHrmAccordian = await HrmAccordian.findOne({});

        // Check if the document is found
        if (!foundHrmAccordian) {
            return res.status(404).json({ message: 'HrmAccordian content not found' });
        }

        // Respond with the found document
        res.json(foundHrmAccordian);
    } catch (error) {
        console.error('Error fetching HrmAccordian content:', error);
        res.status(500).json({ error: `Error fetching HrmAccordian content: ${error.message}` });
    }
};

//delete hrm1 accordian

export const deleteHrm1Accordian = async (req, res) => {
    try {
        // Find and delete the document based on the accordian_1Heading
        const deletedHrmAccordian = await HrmAccordian.findOneAndDelete({ accordian_1Heading: req.params.accordian_1Heading });

        // Check if the document is found and deleted
        if (!deletedHrmAccordian) {
            return res.status(404).json({ message: 'HRM Accordian not found for deletion' });
        }

        // Respond with a success message
        res.json({ message: 'HRM Accordian deleted successfully', deletedHrmAccordian });
    } catch (error) {
        console.error('Error deleting HRM Accordian:', error);
        res.status(500).json({ error: `Error deleting HRM Accordian: ${error.message}` });
    }
};

