import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const checkDatabases = async () => {
    try {
        console.log('Connecting to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to: ${conn.connection.host}`);

        // Use the native MongoDB driver to list databases
        const admin = new mongoose.mongo.Admin(mongoose.connection.db);
        const result = await admin.listDatabases();

        console.log('\n--- DATABASES FOUND IN CLUSTER ---');
        result.databases.forEach(db => {
            console.log(` - ${db.name}\t(${db.sizeOnDisk} bytes)`);
        });
        console.log('----------------------------------\n');

        const dbName = mongoose.connection.name;
        console.log(`Current Mongoose connection is using database: "${dbName}"`);

        // Check if our specific collections exist
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`\nCollections in "${dbName}":`);
        collections.forEach(c => console.log(` - ${c.name}`));

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkDatabases();
