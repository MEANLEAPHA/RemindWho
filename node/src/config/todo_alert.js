const fs= require("fs/promises");
const moment = require("moment");
const alert = async (controller, message, res) => {
    try {
        // Append the log message to the file (create the file if it doesn't exist)
        const timestamp = moment().format("DD/MM/YYYY HH:mm:ss"); // Use 'moment' for timestamp
        const date= moment().format("DD-MM-YYYY ");
        const path = "./alerts/" + controller + "_" +  date + ".txt";
        const logMessage = "[" + timestamp + "] " + message + "\n";
        await fs.appendFile(path, logMessage);
    } catch (error) {
        console.error("Error writing to log file:", error);
         res.status(500).send("Internal Server Error!");
    }
   
};
// Only send response if res parameter is provided
    
module.exports = alert;
