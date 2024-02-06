import cloudinary from '../config/cloudinaryConfig.js';
import upload from '../config/multerConfig.js';

//components
import Banner from '../model/bannerModel.js';



//upload Details
export const uploadDetails = async (req, res) => {
    try {
        console.log("details");
        const { bannerHeading, bannerParagraph } = req.body;
        const imageBuffers = req.files || [];
        
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
        const existBannerObject = await Banner.findById(req.params.id);

        //make array of urls
        const imageBuffers = req.files || [];


        //check existBannerObject exit or not 
        if (!existBannerObject) {
            return res.status(404).json({ success: false, message: 'Image not found.' });
        }

        if (existBannerObject.imageUrls.length !== 0) {

            //Delete the existing image or urls
            for (let i = 0; i < req.files.length; i++) {
                const url = existBannerObject.imageUrls[i];
                const publicId = extractPublicIdFromUrl(url);
                if (!publicId) {
                    return res.status(400).json({ error: 'Invalid Clodinary URL' });
                }
                await cloudinary.uploader.destroy(publicId);
            }

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
            
            //update  the image urls in the database 
            for (let i = 0; i < uploadedUrls.length; i++) {
                existBannerObject.imageUrls[i] = uploadedUrls[i];
            }
            await existBannerObject.save();

            //update  the details of banner in the database 
            const updatedImage = await Banner.findByIdAndUpdate(req.params.id, {
                bannerHeading: req.body.bannerHeading || existBannerObject.bannerHeading,
                bannerParagraph: req.body.bannerParagraph || existBannerObject.bannerParagraph,
            }, { new: true });
            res.json({
                message: 'File updated successfully',
            });

        } else {
            // Update the banner details in the database
            const updatedImage = await Banner.findByIdAndUpdate(req.params.id, {
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



