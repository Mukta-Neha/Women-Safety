const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/safewo';

  try {
    // Attempt standard connection with 3-second server selection timeout
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ [SafeWo Database] MongoDB Connected to: ${mongoose.connection.host}`);
  } catch (primaryError) {
    console.warn(`⚠️ [SafeWo Database] Unable to connect to primary MongoDB at ${primaryUri}.`);
    console.warn(`⏳ [SafeWo Database] Initializing embedded MongoMemoryServer for zero-setup execution...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();

      await mongoose.connect(memoryUri);
      console.log(`✅ [SafeWo Database] In-Memory MongoDB connected: ${memoryUri}`);
      console.log(`💡 [SafeWo Database] Note: Data will be persisted in memory for this session.`);
    } catch (memoryError) {
      console.error(`❌ [SafeWo Database] Failed to initialize in-memory MongoDB:`, memoryError.message);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
