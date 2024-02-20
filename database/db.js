import mongoose from 'mongoose';
import {Cards} from '../model/builtTechModel.js'
const Connection = async () => {
    const URL = 'mongodb+srv://udaysingh:hZi68bGMf9LmZ7SG@cluster0.wvpotiy.mongodb.net/qbitsuitDatabase';
    try {
        await mongoose.connect(URL)
        console.log('Database connected successfully');

        // Access the database
        // const db = mongoose.connection.db;

        // // List all collections
        // const collections = await db.listCollections().toArray();

        // // Extract collection names
        // const collectionNames = collections.map(collection => collection.name);

        // // Log the collection names
        // console.log('Collections:', collectionNames);

        // const url="http://res.cloudinary.com/dcw1yixys/image/upload/v1707841935/nzk7vimrhk2hsleqmixv.jpg"
        // let urlExists = false;

        // for (const specificCollectionName of collectionNames) {
        //     const documentWithUrl = await db.collection(specificCollectionName).findOne({});

        //     if (documentWithUrl) {
        //         console.log(documentWithUrl)
        //         console.log("exist");
        //         urlExists = true;
        //         break;
        //     }
        //     else
        //         console.log("not exist");
        // }
        

    } catch (error) {
        if (error instanceof mongoose.Error.ServerSelectionError) {
            console.error('Server Selection Error:', error);
        } else if (error instanceof mongoose.Error.MongoNetworkError) {
            console.error('MongoNetworkError:', error);
        }
    }
};

export default Connection;