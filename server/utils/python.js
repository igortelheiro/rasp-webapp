const { spawn } = require("child_process");

const pythonFaceValidatorPath = "../../face-recon/face-validator.py";

let pythonProcess = null;

function restartFaceValidator() {
    if (pythonProcess) {
        pythonProcess.kill();
    }
    pythonProcess = spawn("python3", [pythonFaceValidatorPath], {
        stdio: "inherit", // Helps debug by showing output in the console
    });

    pythonProcess.on("error", (err) => {
        console.error("Failed to start faceValidator:", err);
    });

    pythonProcess.on("exit", (code, signal) => {
        console.log(`faceValidator exited with code ${code}, signal ${signal}`);
    });
}

module.exports = { restartFaceValidator };
