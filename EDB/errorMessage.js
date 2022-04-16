let guid = require("./guid.json");

exports.cnerror = (errorName) => {
    console.warn("⚠ An error has occured: " + errorName);
    console.warn("⚠ Error info: " + guid[errorName]["ei"]);
    console.warn("⚠ You can see solutions on: " + guid[errorName]["sol"]);
    process.exit(-1);
}