let guid = require("./guid.json");

exports.cnerror = (errorName) => {
    console.warn("⚠ An error has occured: " + errorName);
    console.warn("⚠ Error info: " + guid[errorName]["ei"]);
    console.warn("⚠ You can see solutions on: " + guid[errorName]["sol"]);
    console.log("------------------------------");
    process.exit(-1);
}

exports.anerror = (errorName) => {
    console.warn("⚠ An error has occured: " + errorName);
    console.warn("⚠ Error info: " + guid[errorName]["ei"]);
    console.warn("⚠ You can see solutions on: " + guid[errorName]["sol"]);
    console.log("------------------------------");
}

exports.onerror = (errorName , fileName) => {
    console.warn("⚠ An error has occured in " + fileName + ": " + errorName);
    console.warn("⚠ Error info: " + guid[errorName]["ei"]);
    console.warn("⚠ You can see solutions on: " + guid[errorName]["sol"]);
    console.log("------------------------------");
}