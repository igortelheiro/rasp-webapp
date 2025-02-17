const path = require('path');
const { spawn } = require("child_process");

const pythonVirtualEnvironmentPath = path.join(__dirname, "../venv/bin/python");
const pythonFaceValidatorPath = "face-validator.py";

let pythonProcess = null;

function restartFaceValidator() {
    if (pythonProcess) {
        pythonProcess.kill();
    }
    pythonProcess = spawn(pythonVirtualEnvironmentPath, [pythonFaceValidatorPath], {
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
