import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './.env'
});

const PORT = process.env.PORT || 8000;

connectDB()
.then(() => {
    app.on('error', (error) => {
        console.log("Express app error: ", error);
        throw error;
    });
    
    app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
        console.log(`🚀 API is available at http://localhost:${PORT}/api/v1`);
        console.log(`💚 Health check at http://localhost:${PORT}/health`);
    }) 
})
.catch((err) => {
    console.log("❌ MONGO DB connection failed!", err);
    process.exit(1);
})