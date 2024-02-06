import cloudinary from '../config/cloudinaryConfig.js';
import upload from '../config/multerConfig.js';

import { Hrm1 ,HrmAccordian} from '../model/hrm1Model.js';


//upload hrm
export const uploadHrm = async (req, res) => {
    try {

        // Access the uploaded file using req.file
        const file = req.file;

        // Check if file is present
        if (!file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        // Upload the file to Cloudinary using upload_stream
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error uploading to Cloudinary' });
            }

            const newHrm = new Hrm1({
                hrmHeading: req.body.hrmHeading,
                hrmSubheading: req.body.hrmSubheading,
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
export const updateHrm = async (req, res) => {
    try {
        // Check if the image exists in the database
        const existhrmObject = await Hrm1.findById(req.params.id);

        if (!existhrmObject) {
            return res.status(404).json({ success: false, message: 'Image not found.' });
        }
        if(req.file){
            const hrmUrl = existhrmObject.hrmUrl;

            // Extract the public ID from the Cloudinary URL
            const publicId = extractPublicIdFromUrl(hrmUrl);
    
            if (!publicId) {
                return res.status(400).json({ error: 'Invalid Cloudinary URL' });
            }
    
            // Delete the image from Cloudinary using its public ID
            await cloudinary.uploader.destroy(publicId);
    
            
        // Upload the new image to Cloudinary
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
            if (err) {
                console.error('Error uploading to Cloudinary:', err);
                return res.status(500).json({ error: 'Error updating to Cloudinary' });
            }

            // Update the image details in the database
            const updatedImage = await Hrm1.findByIdAndUpdate(req.params.id, {
                hrmHeading: req.body.hrmHeading || existhrmObject.hrmHeading,
                hrmSubheading: req.body.hrmSubheading || existhrmObject.hrmSubheading,
                hrmUrl: result.url
            }, { new: true });

            // Send a success response
            res.json({
                message: 'File upldated successfully',
            });
        }).end(req.file.buffer);
    } 
    else{
        const updatedImage = await Hrm1.findByIdAndUpdate(req.params.id, {
            hrmHeading: req.body.hrmHeading || existhrmObject.hrmHeading,
            hrmSubheading: req.body.hrmSubheading || existhrmObject.hrmSubheading,
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


//upload HrmAccord
export const uploadHrmAccord =  async (req, res) => {
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
        // Find the accordion by ID
        const existingAccordion = await HrmAccordian.findById(req.params.id);

        if (!existingAccordion) {
            return res.status(404).json({ message: 'Hrm Accordian not found' });
        }

        // Update accordion details
        existingAccordion.accordian_1Heading = req.body.accordian_1Heading || existingAccordion.accordian_1Heading;
        existingAccordion.accordian_1Paragraph = req.body.accordian_1Paragraph || existingAccordion.accordian_1Paragraph;

        // Save the updated accordion
        const updatedAccordion = await existingAccordion.save();

        res.json({
            message:"updated sucessfully",
            updatedAccordion
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};