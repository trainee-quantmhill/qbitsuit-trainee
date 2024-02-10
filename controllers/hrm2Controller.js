import cloudinary from '../config/cloudinaryConfig.js';
import upload from '../config/multerConfig.js';

//components
import { Hrm2 ,Hrm2Accordian} from "../model/hrm2Model.js";

//upload Hrm2
export const uploadHrm2 = async (req, res) => {
    try {

        // Access the uploaded file using req.file
        const file = req.file;
        const { hrm2Heading, hrm2Subheading } = req.body;
        // Check if file is present
        if (!file) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!hrm2Heading || !hrm2Subheading) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        // Upload the file to Cloudinary using upload_stream
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error uploading to Cloudinary' });
            }

            const newhrm2 = new Hrm2({
                hrm2Heading,
                hrm2Subheading,
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

//delete hrm2
export const deleteHrm2 = async (req, res) => {
    try {

        console.log(req.params.hrm2Heading);

        // Find the document based on the accountHeading
        const existinghrm2Object = await Hrm2.findOne({ hrm2Heading: req.params.hrm2Heading });

        if (!existinghrm2Object) {
            return res.status(404).json({ success: false, message: 'Account not found.' });
        }

        const hrm2Url = existinghrm2Object.hrm2Url;

        // Extract the public ID from the Cloudinary URL
        const publicId = extractPublicIdFromUrl(hrm2Url);
        console.log("public id :",publicId);
        if (!publicId) {
            return res.status(400).json({ error: 'Invalid Cloudinary URL' });
        }

        // Delete the image from Cloudinary using its public ID
        await cloudinary.uploader.destroy(publicId);

        
        // Find and delete the document based on the hrm2Heading
        const deletedHrm2 = await Hrm2.findOneAndDelete({hrm2Heading: req.params.hrm2Heading });

        // Check if the document is found and deleted
        if (!deletedHrm2) {
            return res.status(404).json({ message: 'HRM2 not found for deletion' });
        }

        // Respond with a success message
        res.json({ message: 'HRM2 deleted successfully', deletedHrm2 });
    } catch (error) {
        console.error('Error deleting HRM2:', error);
        res.status(500).json({ error: `Error deleting HRM2: ${error.message}` });
    }
};


//get hrm2
export const getHrm2 = async (req, res) => {
    try {
        console.log(req.params.hrm2Heading);

        // Find the document based on the hrm2Heading
        const foundHrm2 = await Hrm2.findOne({ hrm2Heading: req.params.hrm2Heading });

        // Check if the document is found
        if (!foundHrm2) {
            return res.status(404).json({ message: 'Hrm2 content not found' });
        }

        // Respond with the found document
        res.json(foundHrm2);
    } catch (error) {
        console.error('Error fetching Hrm2 content:', error);
        res.status(500).json({ error: `Error fetching Hrm2 content: ${error.message}` });
    }
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

//get hrm2 Accordian
export const getHrm2Accordian = async (req, res) => {
    try {
        console.log(req.params.accordian_2Heading);

        // Find the document based on the accordian_2Heading
        const foundHrm2Accordian = await Hrm2Accordian.findOne({ accordian_2Heading: req.params.accordian_2Heading });

        // Check if the document is found
        if (!foundHrm2Accordian) {
            return res.status(404).json({ message: 'Hrm2 Accordian content not found' });
        }

        // Respond with the found document
        res.json(foundHrm2Accordian);
    } catch (error) {
        console.error('Error fetching Hrm2 Accordian content:', error);
        res.status(500).json({ error: `Error fetching Hrm2 Accordian content: ${error.message}` });
    }
};


//delete hrm2 accordian

export const deleteHrm2Accordian = async (req, res) => {
    try {

        // Find and delete the document based on the accordian_2Heading
        const deletedHrm2Accordian = await Hrm2Accordian.findOneAndDelete({accordian_2Heading: req.params.accordian_2Heading });

        // Check if the document is found and deleted
        if (!deletedHrm2Accordian) {
            return res.status(404).json({ message: 'HRM2 Accordian not found for deletion' });
        }

        // Respond with a success message
        res.json({ message: 'HRM2 Accordian deleted successfully', deletedHrm2Accordian });
    } catch (error) {
        console.error('Error deleting HRM2 Accordian:', error);
        res.status(500).json({ error: `Error deleting HRM2 Accordian: ${error.message}` });
    }
};
