
import cloudinary from '../config/cloudinaryConfig.js';
import upload from '../config/multerConfig.js';

//Components
import  {Cases,FashionBox} from "../model/fashionBoxModel.js";


//upload FashionBox
export const uploadFashionBox =  async (req, res) => {
    try {
        console.log(req.body);
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
export const updateFashionBox =  async (req, res) => {
    try {
        console.log(req.params.id);
        // Find the FashionBox entry by ID
        const existingFashionBoxObject = await FashionBox.findById(req.params.id);
        console.log(existingFashionBoxObject)
        if (!existingFashionBoxObject) {
            return res.status(404).json({ message: 'FashionBox not found' });
        }

        // Update FashionBox details
        existingFashionBoxObject.fashionBoxHeading = req.body.fashionBoxHeading || existingFashionBoxObject.fashionBoxHeading;
        existingFashionBoxObject.fashionBoxSubheading = req.body.fashionBoxSubheading || existingFashionBoxObject.fashionBoxSubheading;

        // Save the updated FashionBox
        const updatedFashionBox = await existingFashionBoxObject.save();

        res.json(updatedFashionBox);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


//get fashion box
export const getFashionBox = async (req, res) => {
    try {
        console.log(req.params.fashionBoxHeading);

        // Find the document based on the fashionBoxHeading
        const foundFashionBox = await FashionBox.findOne({ fashionBoxHeading: req.params.fashionBoxHeading });

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
        const deletedFashionBox = await FashionBox.findOneAndDelete({ fashionBoxHeading:req.params.fashionBoxHeading});

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
        // Check if the image exists in the database
        
        const updateCases = await Cases.findById(req.params.id);

        if (!updateCases) {
            return res.status(404).json({ success: false, message: 'builtTechobject not found.' });
        }
        if(req.file){ 
        const fashionBoxUrl = updateCases.fashionBoxUrl;

            // Extract the public ID from the Cloudinary URL
            const publicId = extractPublicIdFromUrl(fashionBoxUrl);
    
            if (!publicId) {
                return res.status(400).json({ error: 'Invalid Cloudinary URL' });
            }
    
            // Delete the image from Cloudinary using its public ID
            await cloudinary.uploader.destroy(publicId);
    
            console.log("image deleted ");
        
        // Upload the new image to Cloudinary
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
            if (err) {
                console.error('Error uploading to Cloudinary:', err);
                return res.status(500).json({ error: 'Error updating to Cloudinary' });
            }

            // Update the image details in the database
            const updatedImage = await Cases.findByIdAndUpdate(req.params.id, {
                heading: req.body.heading || updateBuiltTechCards.heading,
                paragraph: req.body.paragraph || updateBuiltTechCards.paragraph,
                fashionBoxUrl: result.url
            }, { new: true });

            
            // Send a success response
            res.json({
                message: 'File upldated successfully',
            });
        }).end(req.file.buffer);
    } 
    else{
        const updatedImage = await Cases.findByIdAndUpdate(req.params.id, {
            heading: req.body.heading || updateBuiltTechCards.heading,
            paragraph: req.body.paragraph || updateBuiltTechCards.paragraph
        }, { new: true });
        res.json({
            message: 'File upldated successfully',
        });
    }
}catch (error) {
        console.error('Error handling file upload:', error);
        res.status(500).json({ error: `Error handling file upload: ${error.message}` });
    }
};



export const getFashionBoxCases = async (req, res) => {
    try {
        console.log(req.params.heading);

        // Find the document based on the heading
        const foundCase = await Cases.findOne({ heading: req.params.heading });

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
        const deletedCase = await Cases.findOneAndDelete({ heading :req.params.heading});

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
