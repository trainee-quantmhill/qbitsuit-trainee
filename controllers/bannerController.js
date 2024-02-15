import cloudinary from '../config/cloudinaryConfig.js';
import upload from '../config/multerConfig.js';

//components
import Banner from '../model/bannerModel.js';



//upload Details
export const uploadDetails = async (req, res) => {
    try {
        
        const { bannerHeading, bannerParagraph } = req.body;
        const imageBuffers = req.files || [];
        
        if (!bannerHeading || !bannerParagraph || imageBuffers.length <2) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        // Find existing banner by bannerHeading
        let existingBanner = await Banner.findOne({ bannerHeading });

        // Upload each image to Cloudinary and get URLs
        const uploadPromises = imageBuffers.map((imageBuffer) => {
            
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
                    if (error) {

                        reject(`Error uploading to Cloudinary: ${error.message}`);
                    } else {
                        
                        resolve(result.secure_url);
                    }

                }).end(imageBuffer.buffer);
            });
        });

        // Wait for all uploads to complete
        const uploadedUrls = await Promise.all(uploadPromises);
        
        // If an existing banner is found, update its imageUrls
        if (existingBanner) {
            existingBanner.imageUrls = [...existingBanner.imageUrls, ...uploadedUrls];
            existingBanner = await existingBanner.save();
            res.json(existingBanner);
        } else {
            // If no existing banner is found, create a new one
            const newBanner = new Banner({
                bannerHeading,
                bannerParagraph,
                imageUrls: uploadedUrls
            });

            // Save the banner data to the database
            const savedBanner = await newBanner.save();
            res.json(savedBanner);
        }
    } catch (error) {
        console.error('Error handling file upload:', error);
        res.status(500).json({ error: `Error handling file upload: ${error.message}` });
    }
};



//Update the  Banner
export const updateBanner = async (req, res) => {
    try {
        //make array of urls
        const imageBuffers = req.files || [];
        if (imageBuffers.length !== 0) {

            // Upload each image to Cloudinary and get URLs
            const uploadPromises = imageBuffers.map((imageBuffer) => {
                return new Promise((resolve, reject) => {
                    if (!imageBuffer.buffer) {
                        reject('Empty file: Image buffer is missing.');
                        return;
                    }
                    cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
                        if (error) {
                            reject(`Error uploading to Cloudinary: ${error.message}`);
                        } else {
                            if (!result.secure_url) {
                                reject('secure_url not found in Cloudinary upload result.');
                            } else {
                                resolve(result.secure_url);
                            }
                        }
                    }).end(imageBuffer.buffer);
                });
            });

            // Wait for all uploads to complete
            const uploadedUrls = await Promise.all(uploadPromises);
            
            // Update the imageUrls in the database
            const banner = await Banner.findOneAndUpdate({}, { imageUrls: uploadedUrls }, { new: true });

            //update  the details of banner in the database 
            const updatedImage = await Banner.updateOne({}, {
                bannerHeading: req.body.bannerHeading || bannerHeading,
                bannerParagraph: req.body.bannerParagraph || bannerParagraph,
            }, { new: true });
            res.json({
                message: 'File updated successfully',
                banner
            });

        } else {
            // Update the banner details in the database
            const updatedImage = await Banner.updateOne({}, {
                bannerHeading: req.body.bannerHeading || existBannerObject.bannerHeading,
                bannerParagraph: req.body.bannerParagraph || existBannerObject.bannerParagraph,
            }, { new: true });
            res.json({
                message: 'File updated successfully',
            });
        }

    } catch (error) {
        res.status(500).json({ error: `Error handling file upload ${error.message}` });
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


//get Banner
export const getBanner = async (req, res) => {
    try {
        console.log(req.params.bannerHeading);
      
        // Find the banner based on the bannerHeading
        const foundBanner = await Banner.findOne({  });
  
        // Check if the banner is found
        if (!foundBanner) {
            return res.status(404).json({ message: 'Banner not found' });
        }
  
        // Respond with the found banner
        res.json(foundBanner);
    } catch (error) {
        console.error('Error fetching banner:', error);
        res.status(500).json({ error: `Error fetching banner: ${error.message}` });
    }
};

//delete banner

export const deleteBanner = async (req, res) => {
    try {
        console.log(req.params.bannerHeading);

        const existBannerObject = await Banner.findOne({ bannerHeading: req.params.bannerHeading });

        // Check if existBannerObject exists
        if (!existBannerObject) {
            return res.status(404).json({ success: false, message: 'Banner not found.' });
        }

        // Check if imageUrls exists and has length
        if (existBannerObject.imageUrls && existBannerObject.imageUrls.length !== 0) {
            // Delete the existing image or urls
            for (let i = 0; i < existBannerObject.imageUrls.length; i++) {
                const url = existBannerObject.imageUrls[i];
                const publicId = extractPublicIdFromUrl(url);
                if (!publicId) {
                    return res.status(400).json({ error: 'Invalid Cloudinary URL' });
                }
                await cloudinary.uploader.destroy(publicId);
            }
        }

        // Find and delete the document based on the bannerHeading
        const deletedBanner = await Banner.findOneAndDelete({ bannerHeading: req.params.bannerHeading });

        // Check if the document is found and deleted
        if (!deletedBanner) {
            return res.status(404).json({ message: 'Banner not found for deletion' });
        }

        // Respond with a success message
        res.json({ message: 'Banner deleted successfully', deletedBanner });
    } catch (error) {
        console.error('Error deleting banner:', error);
        res.status(500).json({ error: `Error deleting banner: ${error.message}` });
    }
};
