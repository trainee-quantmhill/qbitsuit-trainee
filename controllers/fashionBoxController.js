
import cloudinary from '../config/cloudinaryConfig.js';
import upload from '../config/multerConfig.js';

//Components
import { Cases, FashionBox } from "../model/fashionBoxModel.js";


//upload FashionBox
export const uploadFashionBox = async (req, res) => {
    try {
        const { fashionBoxHeading, fashionBoxSubheading } = req.body;

        // Check if required fields are present
        if (!fashionBoxHeading || !fashionBoxSubheading) {
            return res.status(400).json({ error: 'fashionHeading and fashionSubheading are required' });
        }

        // Create a new module document
        const newFashionBox = new FashionBox({
            fashionBoxHeading,
            fashionBoxSubheading,
        });

        // Save the new module to the database
        await newFashionBox.save();

        res.status(201).json({ message: 'Fashion created successfully', Fashion: newFashionBox });
    } catch (error) {
        console.error('Error creating module:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//update FashionBox
export const updateFashionBox = async (req, res) => {
    try {
        // Assuming you have some criteria to uniquely identify the document to update
        const filter = {}; // Add your filter criteria here

        const update = {
            fashionBoxHeading: req.body.fashionBoxHeading || fashionBoxHeading,
            fashionBoxSubheading: req.body.fashionBoxSubheading || fashionBoxSubheading,
            // Add other fields you want to update
        };

        const options = { new: true }; // This ensures that the updated document is returned

         await FashionBox.updateOne(filter, update, options);


        const fashionBox = await FashionBox.findOne({});
        res.json({
            message: "Update successfully",
            fashionBox,
        });
    } catch (error) {
        res.status(500).json({ error: `${error}` });
    }
};

//get fashion box
export const getFashionBox = async (req, res) => {
    try {

        // Find the document based on the 
        const foundFashionBox = await FashionBox.findOne({});

        // Check if the document is found
        if (!foundFashionBox) {
            return res.status(404).json({ message: 'Fashion Box not found' });
        }

        // Respond with the found document
        res.json(foundFashionBox);
    } catch (error) {
        console.error('Error fetching Fashion Box:', error);
        res.status(500).json({ error: `Error fetching Fashion Box: ${error.message}` });
    }
};

//delete FashionBox

export const deleteFashionBox = async (req, res) => {
    try {
        // Find and delete the document based on the fashionBoxHeading
        const deletedFashionBox = await FashionBox.findOneAndDelete({ fashionBoxHeading: req.params.fashionBoxHeading });

        // Check if the document is found and deleted
        if (!deletedFashionBox) {
            return res.status(404).json({ message: 'Fashion Box not found for deletion' });
        }

        // Respond with a success message
        res.json({ message: 'Fashion Box deleted successfully', deletedFashionBox });
    } catch (error) {
        console.error('Error deleting Fashion Box:', error);
        res.status(500).json({ error: `Error deleting Fashion Box: ${error.message}` });
    }
};


//upload cases
export const uploadCases = async (req, res) => {
    try {

        // Access the uploaded file using req.file
        const file = req.file;
        const { heading, paragraph } = req.body;
        // Check if file is present
        if (!file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        if (!heading || !paragraph) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Upload the file to Cloudinary using upload_stream
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error uploading to Cloudinary' });
            }

            const newCase = new Cases({
                heading,
                paragraph,
                fashionBoxUrl: result.url
            });

            // Save the image data to the database
            await newCase.save();

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

//update cases
export const updateCases = async (req, res) => {
    try {
        if (req.file) {
            // Upload the new image to Cloudinary
            cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Error updating to Cloudinary' });
                }

                // Update the image URL and Laravel details in the database
                 await Cases.updateOne({}, {
                    fashionBoxUrl: result.url,
                    heading: req.body.heading || heading,
                    paragraph: req.body.paragraph || paragraph,
                }, { new: true });

                const cases = await Cases.findOne({});
                
                // Send a success response
                res.json({
                    message: 'File and cases details updated successfully',
                    cases,
                });
            }).end(req.file.buffer);
        } else {
            // Update the Laravel details in the database without changing the image URL
             await Cases.updateOne({}, {
                heading: req.body.heading || heading,
                paragraph: req.body.paragraph || paragraph,
            }, { new: true });

            const cases = await Cases.findOne({});
            res.json({
                message: 'cases details updated successfully',
                cases,
            });
        }
    } catch (error) {
        res.status(500).json({ error: `Error handling file upload: ${error.message}` });
    }
};

export const getFashionBoxCases = async (req, res) => {
    try {

        // Find the document based on the 
        const foundCase = await Cases.findOne({});

        // Check if the document is found
        if (!foundCase) {
            return res.status(404).json({ message: 'Case not found' });
        }

        // Respond with the found document
        res.json(foundCase);
    } catch (error) {
        console.error('Error fetching case:', error);
        res.status(500).json({ error: `Error fetching case: ${error.message}` });
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

//delete fashion cases
export const deleteFashionBoxCases = async (req, res) => {
    try {
        // Find the document based on the accountHeading
        const existingFashionCaseObject = await Cases.findOne({ heading: req.params.heading });

        if (!existingFashionCaseObject) {
            return res.status(404).json({ success: false, message: 'Account not found.' });
        }

        const fashionBoxUrl = existingFashionCaseObject.fashionBoxUrl;

        // Extract the public ID from the Cloudinary URL
        const publicId = extractPublicIdFromUrl(fashionBoxUrl);
        if (!publicId) {
            return res.status(400).json({ error: 'Invalid Cloudinary URL' });
        }

        // Delete the image from Cloudinary using its public ID
        await cloudinary.uploader.destroy(publicId);
        // Find and delete the document based on the heading
        const deletedCase = await Cases.findOneAndDelete({ heading: req.params.heading });

        // Check if the document is found and deleted
        if (!deletedCase) {
            return res.status(404).json({ message: 'Case not found for deletion' });
        }

        // Respond with a success message
        res.json({ message: 'Case deleted successfully', deletedCase });
    } catch (error) {
        console.error('Error deleting Case:', error);
        res.status(500).json({ error: `Error deleting Case: ${error.message}` });
    }
};
