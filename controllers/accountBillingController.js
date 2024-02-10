import cloudinary from '../config/cloudinaryConfig.js';
import upload from '../config/multerConfig.js';


//components
import { Account, Module, Accordian } from '../model/AccountBillingModel.js';


//uploadModule
export const uploadModule =  async (req, res) => {
    try {
        console.log(req.body);
        const { moduleHeading, moduleSubheading } = req.body;

        // Check if required fields are present
        if (!moduleHeading || !moduleSubheading) {
            return res.status(400).json({ error: 'moduleHeading and moduleSubheading are required' });
        }

        // Create a new module document
        const newModule = new Module({
            moduleHeading,
            moduleSubheading,
        });

        // Save the new module to the database
        await newModule.save();

        res.status(201).json({ message: 'Module created successfully', module: newModule });
    } catch (error) {
        console.error('Error creating module:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


//get module
export const getModule = async (req, res) => {
    try {
      console.log(req.params.moduleHeading);
  
      // Find the module based on the moduleHeading
      const foundModule = await Module.findOne({ moduleHeading: req.params.moduleHeading });
  
      // Check if the module is found
      if (!foundModule) {
        return res.status(404).json({ message: 'Module not found' });
      }
  
      // Respond with the found module
      res.json(foundModule);
    } catch (error) {
      console.error('Error fetching module:', error);
      res.status(500).json({ error: `Error fetching module: ${error.message}` });
    }
  };
  

//updateModule
export const updateModule= async (req, res) => {
    const moduleId = req.params.id; 
    try {
        // Find the module by ID
        const existingModule = await Module.findById(moduleId);
        console.log(req.body);
        if (!existingModule) {
            return res.status(404).json({ message: 'Module not found' });
        }

        // Update module details
        existingModule.moduleHeading = req.body.moduleHeading || existingModule.moduleHeading;
        existingModule.moduleSubheading = req.body.moduleSubheading || existingModule.moduleSubheading;

        // Save the updated module
        const updatedModule = await existingModule.save();

        res.json({
            message:"update sucessfully",
            updatedModule
        });
    } catch (error) {
        res.status(500).json({ error: `${error}` });
    }
};

//deleteModule

export const deleteModule = async (req, res) => {
    try {
        console.log(req.params.moduleHeading);

        // Find and delete the document based on the moduleHeading
        const deletedModule = await Module.findOneAndDelete({ moduleHeading: req.params.moduleHeading });

        // Check if the document is found and deleted
        if (!deletedModule) {
            return res.status(404).json({ message: 'Module not found for deletion' });
        }

        // Respond with a success message
        res.json({ message: 'Module deleted successfully', deletedModule });
    } catch (error) {
        console.error('Error deleting module:', error);
        res.status(500).json({ error: `Error deleting module: ${error.message}` });
    }
};



//uploadAccount
export const uploadAccount = async (req, res) => {
    try {
        // Access the uploaded file using req.file
        const file = req.file;
        console.log("file:",file);

        const {accountHeading,accountSubheading}=req.body;
        // Check if file is present
        if (!file) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!accountHeading || !accountSubheading) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        // Upload the file to Cloudinary using upload_stream
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, async (err, result) => {
            if (err) {
                console.error('Error uploading to Cloudinary:', err);
                return res.status(500).json({ error: 'Error uploading to Cloudinary' });
            }

            const newAccount = new Account({
                accountHeading,
                accountSubheading,
                accountImageUrl: result.url
            });

            // Save the image data to the database
            await newAccount.save();

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

//updateAccount
export const updateAcoount = async (req, res) => {
    try {
        // Check if the image exists in the database
        const existingAccountObject = await Account.findById(req.params.id);

        if (!existingAccountObject) {
            return res.status(404).json({ success: false, message: 'Image not found.' });
        }
        if(req.file){
            const accountImageUrl = existingAccountObject.accountImageUrl;

            // Extract the public ID from the Cloudinary URL
            const publicId = extractPublicIdFromUrl(accountImageUrl);
    
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
            const updatedCollabs = await Account.findByIdAndUpdate(req.params.id, {
                accountHeading: req.body.accountHeading || existingAccountObject.accountHeading,
                accountSubheading: req.body.accountSubheading || existingAccountObject.accountSubheading, 
                accountImageUrl: result.url      
            }, { new: true });

            console.log(updatedCollabs);
            // Send a success response
            res.json({
                message: 'File upldated successfully',
                cloudinaryResult: result
            });
        }).end(req.file.buffer);
    } 
    else{
        const updatedCollabs = await Account.findByIdAndUpdate(req.params.id, {
            accountHeading: req.body.accountHeading || existingAccountObject.accountHeading,
            accountSubheading: req.body.accountSubheading || existingAccountObject.accountSubheading,
        }, { new: true });
        res.json({
            message: 'File updated successfully',
        });
    }
}catch (error) {
        console.error('Error handling file upload:', error);
        res.status(500).json({ error: `Error handling file upload: ${error.message}` });
    }
};

//get account
export const getAccount = async (req, res) => {
    try {
        console.log(req.params.accountHeading);
      // Find the account based on the accountHeading
      const foundAccount = await Account.findOne({accountHeading: req.params.accountHeading });
  
      // Check if the account is found
      if (!foundAccount) {
        return res.status(404).json({ message: 'Account not found' });
      }
  
      // Respond with the found account
      res.json(foundAccount);
    } catch (error) {
      console.error('Error fetching account:', error);
      res.status(500).json({ error: `Error fetching account: ${error.message}` });
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

//delete account
export const deleteAccount = async (req, res) => {
    try {
        console.log(req.params.accountHeading);

        // Find the document based on the accountHeading
        const existingAccountObject = await Account.findOne({ accountHeading: req.params.accountHeading });

        if (!existingAccountObject) {
            return res.status(404).json({ success: false, message: 'Account not found.' });
        }

        const accountImageUrl = existingAccountObject.accountImageUrl;

        // Extract the public ID from the Cloudinary URL
        const publicId = extractPublicIdFromUrl(accountImageUrl);
        console.log("public id :",publicId);
        if (!publicId) {
            return res.status(400).json({ error: 'Invalid Cloudinary URL' });
        }

        // Delete the image from Cloudinary using its public ID
        await cloudinary.uploader.destroy(publicId);

        // Find and delete the document based on the accountHeading
        const deletedAccount = await Account.findOneAndDelete({ accountHeading: req.params.accountHeading });

        // Check if the document is found and deleted
        if (!deletedAccount) {
            return res.status(404).json({ message: 'Account not found for deletion' });
        }

        // Respond with a success message
        res.json({ message: 'Account deleted successfully', deletedAccount });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ error: `Error deleting account: ${error.message}` });
    }
};

//upload accordian
export const uploadAcccordian =  async (req, res) => {
    try {
        console.log(req.body);
        const { accordianHeading, accordianParagraph } = req.body;

        // Check if required fields are present
        if (!accordianHeading || !accordianParagraph) {
            return res.status(400).json({ error: 'accordianHeading and accordianParagraph are required' });
        }

        // Create a new module document
        const newAccordian = new Accordian({
            accordianHeading,
            accordianParagraph,
        });

        // Save the new module to the database
        await newAccordian.save();

        res.status(201).json({ message: 'Accordian created successfully', Accordian: newAccordian });
    } catch (error) {
        console.error('Error creating Accordian:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


//update accordian
export const updateAccordian = async (req, res) => {
    const accordionId = req.params.id;

    try {
        // Find the accordion by ID
        const existingAccordion = await Accordian.findById(accordionId);

        if (!existingAccordion) {
            return res.status(404).json({ message: 'Accordion not found' });
        }

        // Update accordion details
        existingAccordion.accordianHeading = req.body.accordianHeading || existingAccordion.accordianHeading;
        existingAccordion.accordianParagraph = req.body.accordianParagraph || existingAccordion.accordianParagraph;

        // Save the updated accordion
        const updatedAccordion = await existingAccordion.save();

        res.json(updatedAccordion);
    } catch (error) {
        console.error(error);
        res.status(500).json({error:`${error}` });
    }
};

export const getAccordian = async (req, res) => {
    try {
  
        console.log(req.params.accordianHeading);
      // Find the module based on the moduleHeading
      const foundAccordian = await Accordian.findOne({ accordianHeading: req.params.accordianHeading });
  
      // Check if the module is found
      if (!foundAccordian) {
        return res.status(404).json({ message: 'Module not found' });
      }
  
      // Respond with the found module
      res.json(foundAccordian);
    } catch (error) {
      console.error('Error fetching module:', error);
      res.status(500).json({ error: `Error fetching module: ${error.message}` });
    }
  };


//delete Accordian


export const deleteAccordian = async (req, res) => {
    try {
        console.log(req.params.accordianHeading);

        // Find the document based on the accordianHeading
        const existingAccordianObject = await Accordian.findOne({ accordianHeading: req.params.accordianHeading });

        if (!existingAccordianObject) {
            return res.status(404).json({ success: false, message: 'Accordian not found.' });
        }

        // Find and delete the document based on the accordianHeading
        const deletedAccordian = await Accordian.findOneAndDelete({ accordianHeading: req.params.accordianHeading });

        // Check if the document is found and deleted
        if (!deletedAccordian) {
            return res.status(404).json({ message: 'Accordian not found for deletion' });
        }

        // Respond with a success message
        res.json({ message: 'Accordian deleted successfully', deletedAccordian });
    } catch (error) {
        console.error('Error deleting accordian:', error);
        res.status(500).json({ error: `Error deleting accordian: ${error.message}` });
    }
};
