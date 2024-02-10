import cloudinary from '../config/cloudinaryConfig.js';
import upload from '../config/multerConfig.js';'multer';



// import builtModel from 'path-to-your-model'; // Update the path accordingly
import {Built,Cards} from '../model/builtTechModel.js';



//uploadBuiltTech
export const uploadBuiltTech =  async (req, res) => {
    try {
        const { builtHeading, builtSubheading } = req.body;

        // Check if required fields are present
        if (!builtHeading || !builtSubheading) {
            return res.status(400).json({ error: 'moduleHeading and moduleSubheading are required' });
        }

        // Create a new module document
        const newBuilt = new Built({
            builtHeading,
            builtSubheading,
        });

        // Save the new module to the database
        await newBuilt.save();

        res.status(201).json({ message: 'Built created successfully', Built: newBuilt });
    } catch (error) {
        console.error('Error creating Built:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//update builtTech
export const updateBuiltTech= async (req, res) => {
    const itemId = req.params.id;

    try {
        // Find the item by ID
        const existingItem = await Built.findById(itemId);

        if (!existingItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Update item details using the provided fields from req.body
        existingItem.builtHeading = req.body.builtHeading || existingItem.builtHeading;
        existingItem.builtSubheading = req.body.builtSubheading || existingItem.builtSubheading;

        // Save the updated item
        const updatedItem = await existingItem.save();

        res.json(updatedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


//get builtTech
export const getBuiltTech = async (req, res) => {
    try {
        console.log(req.params.builtHeading);

        // Find the document based on the builtHeading
        const foundBuilt = await Built.findOne({ builtHeading: req.params.builtHeading });

        // Check if the document is found
        if (!foundBuilt) {
            return res.status(404).json({ message: 'Built content not found' });
        }

        // Respond with the found document
        res.json(foundBuilt);
    } catch (error) {
        console.error('Error fetching built content:', error);
        res.status(500).json({ error: `Error fetching built content: ${error.message}` });
    }
};

//delete
export const deleteBuiltTech = async (req, res) => {
    try {
        console.log(req.params.builtHeading);

        // Find and delete the document based on the builtHeading
        const deletedBuilt = await Built.findOneAndDelete({ builtHeading: req.params.builtHeading });

        // Check if the document is found and deleted
        if (!deletedBuilt) {
            return res.status(404).json({ message: 'Built content not found for deletion' });
        }

        // Respond with a success message
        res.json({ message: 'Built content deleted successfully', deletedBuilt });
    } catch (error) {
        console.error('Error deleting built content:', error);
        res.status(500).json({ error: `Error deleting built content: ${error.message}` });
    }
};

//upload cards
export const uploadBuiltTechCards = async (req, res) => {
    try {

        // Access the uploaded file using req.file
        const file = req.file;
        const {cardheading,cardParagraph}=req.body;
        // Check if file is present
        if (!file) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!cardheading ||  !cardParagraph) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        // Upload the file to Cloudinary using upload_stream
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error uploading to Cloudinary' });
            }

            const newCard = new Cards({
                cardheading,
                cardParagraph,
                cardUrl: result.url
            });

            // Save the image data to the database
            await newCard.save();

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


//update Cases
export const updateBuiltTechCards = async (req, res) => {
    try {
        // Check if the image exists in the database
        
        const updateBuiltTechCards = await Cards.findById(req.params.id);

        if (!updateBuiltTechCards) {
            return res.status(404).json({ success: false, message: 'builtTechobject not found.' });
        }
        if(req.file){ 
        const cardUrl = updateBuiltTechCards.cardUrl;

            // Extract the public ID from the Cloudinary URL
            const publicId = extractPublicIdFromUrl(cardUrl);
    
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
            const updatedImage = await Cards.findByIdAndUpdate(req.params.id, {
                cardheading: req.body.cardheading || updateBuiltTechCards.cardheading,
                cardParagraph: req.body.cardParagraph || updateBuiltTechCards.cardParagraph,
                
                cardUrl: result.url
            }, { new: true });

            
            // Send a success response
            res.json({
                message: 'File upldated successfully',
                cloudinaryResult: result
            });
        }).end(req.file.buffer);
    } 
    else{
        const updatedImage = await Cards.findByIdAndUpdate(req.params.id, {
            cardheading: req.body.cardheading || updateBuiltTechCards.cardheading,
            cardParagraph: req.body.cardParagraph || updateBuiltTechCards.cardParagraph,
            
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


// Function to extract public ID from Cloudinary URL
const extractPublicIdFromUrl = (url) => {
    const matches = url.match(/\/upload\/v\d+\/(.+?)\./);

    if (matches && matches.length === 2) {
        return matches[1];
    }

    return null;
};


//get builtTech Cards
export const getBuiltTechCards= async (req, res) => {
    try {
        console.log(req.params.cardHeading);

        // Find the document based on the cardHeading
        const foundCard = await Cards.findOne({ cardHeading: req.params.cardHeading });

        // Check if the document is found
        if (!foundCard) {
            return res.status(404).json({ message: 'Card not found' });
        }

        // Respond with the found document
        res.json(foundCard);
    } catch (error) {
        console.error('Error fetching card:', error);
        res.status(500).json({ error: `Error fetching card: ${error.message}` });
    }
};


export const deleteBuiltTechCards = async (req, res) => {
    try {
        const existingCardObject = await Cards.findOne({ cardheading: req.params.cardheading });
        console.log("existingCardObject:", existingCardObject);

        if (!existingCardObject) {
            return res.status(404).json({ success: false, message: 'Card not found.' });
        }

        const cardUrl = existingCardObject.cardUrl;

        // Extract the public ID from the Cloudinary URL
        const publicId = extractPublicIdFromUrl(cardUrl);
        if (!publicId) {
            return res.status(400).json({ error: 'Invalid Cloudinary URL' });
        }

        // Delete the image from Cloudinary using its public ID
        await cloudinary.uploader.destroy(publicId);

        const deletedCard = await Cards.findOneAndDelete({ cardheading: req.params.cardheading }); // Use cardheading here

        // Check if the document is found and deleted
        if (!deletedCard) {
            return res.status(404).json({ message: 'Card not found for deletion' });
        }

        // Respond with a success message
        res.json({ message: 'Card deleted successfully', deletedCard });
    } catch (error) {
        console.error('Error deleting card:', error);
        res.status(500).json({ error: `Error deleting card: ${error.message}` });
    }
};
