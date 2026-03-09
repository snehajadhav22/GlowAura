const mongoose = require('mongoose');
require('dotenv').config({ path: 'server/.env' });

async function search() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const col of collections) {
        const data = await mongoose.connection.db.collection(col.name).find({}).toArray();
        const str = JSON.stringify(data);
        if (str.includes('Velvet')) {
            console.log(`Found "Velvet" in collection: ${col.name}`);
            const matches = data.filter(d => JSON.stringify(d).includes('Velvet'));
            console.log('Matches:', JSON.stringify(matches, null, 2));
        }
    }
    await mongoose.disconnect();
}

search().catch(console.error);
