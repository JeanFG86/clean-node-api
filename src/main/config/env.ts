export default {
    mongoUrl:
        process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
    port: process.env.PORT || 4444,
    jwtSecret: process.env.JWT_SECRET || 'thr6G9h',
};
