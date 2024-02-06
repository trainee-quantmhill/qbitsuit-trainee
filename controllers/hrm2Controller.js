import cloudinary from '../config/cloudinaryConfig.js';
import upload from '../config/multerConfig.js';

//components
import { Hrm2 ,Hrm2Accordian} from "../model/hrm2Model.js";

//upload Hrm2
export const uploadHrm2 = async (req, res) => {
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

            const newhrm2 = new Hrm2({
                hrm2Heading: req.body.hrm2Heading,
                hrm2Subheading: req.body.hrm2Subheading,
                hrm2Url: result.url
            });

            // Save the image data to the database
            await newhrm2.save();

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


//update hrm2 
export const updateHrm2 = async (req, res) => {
    try {
        // Check if the image exists in the database
        const exithrm2Object = await Hrm2.findById(req.params.id);

        if (!exithrm2Object) {
            return res.status(404).json({ success: false, message: 'hrm2object not found.' });
        }
        if(req.file){
            const hrm2Url = exithrm2Object.hrm2Url;

            // Extract the public ID from the Cloudinary URL
            const publicId = extractPublicIdFromUrl(hrm2Url);
    
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
            const updatedImage = await Hrm2.findByIdAndUpdate(req.params.id, {
                hrm2Heading: req.body.hrm2Heading || exithrm2Object.hrm2Heading,
                hrm2Subheading: req.body.hrm2Subheading || exithrm2Object.hrm2Subheading,
                hrm2Url: result.url
            }, { new: true });

            // Send a success response
            res.json({
                message: 'File updated successfully',
            });
        }).end(req.file.buffer);
    } 
    else{
        const updatedImage = await Hrm2.findByIdAndUpdate(req.params.id, {
            hrm2Heading: req.body.hrm2Heading || exithrm2Object.hrm2Heading,
            hrm2Subheading: req.body.hrm2Subheading || exithrm2Object.hrm2Subheading,
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


//upload hrm2Accordian
export const hrm2AccordianUpload =  async (req, res) => {
    try {
        console.log(req.body);
        const { accordian_2Heading, accordian_2Paragraph } = req.body;

        // Check if required fields are present
        if (!accordian_2Heading || !accordian_2Paragraph) {
            return res.status(400).json({ error: 'accordian_2Heading and accordian_2Paragraph are required' });
        }

        // Create a new module document
        const newHrm2Accordian = new Hrm2Accordian({
            accordian_2Heading,
            accordian_2Paragraph,
        });

        // Save the new module to the database
        await newHrm2Accordian.save();

        res.status(201).json({ message: 'Built created successfully', Hrm2Accordian: newHrm2Accordian });
    } catch (error) {
        console.error('Error creating Built:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


//update hrm2Accordian
export const updateHrm2Accord = async (req, res) => {
    const accordionId = req.params.id;

    try {
        // Find the accordion by ID
        const existingAccordion = await Hrm2Accordian.findById(accordionId);

        if (!existingAccordion) {
            return res.status(404).json({ message: 'Hrm Accordian not found' });
        }

        // Update accordion details
        existingAccordion.accordian_2Heading = req.body.accordian_2Heading || existingAccordion.accordian_2Heading;
        existingAccordion.accordian_2Paragraph = req.body.accordian_2Paragraph || existingAccordion.accordian_2Paragraph;

        // Save the updated accordion
        const updatedAccordion = await existingAccordion.save();

        res.json(updatedAccordion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};