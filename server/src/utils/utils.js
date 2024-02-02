// CHALK LOGGING
const chalk = require("chalk");
const log = console.log;
const warning = chalk.bgWhite.bold.hex("#FFA500"); // Orange color

const { v1: uuidv1, v5: uuidv5 } = require("uuid");

class Utils {
  constructor() {}

  nil(attribute) {
    if (
      !attribute ||
      attribute === "" ||
      attribute === null ||
      attribute === undefined ||
      typeof attribute === "undefined" ||
      Number.isNaN(attribute) ||
      (Array.isArray(attribute) && attribute.length === 0) || // Check if attribute is an empty array
      (Array.isArray(attribute) && attribute.every((val) => val === null)) // Check if attribute is an array with only null values
    ) {
      // log(warning("The attribute is empty, null, undefined, or NaN"));
      return true;
    } else {
      // log(warning("The attribute is defined and not empty, null, or NaN"));
      return false;
    }
  }

  generateSysID() {
    // Generate a UUIDv1
    const uuidv1Output = uuidv1().replace(/-/g, "");
    // Use the output of UUIDv1 as the input for UUIDv5
    return uuidv5(uuidv1Output, uuidv5.DNS).replace(/-/g, "");
  }
}

module.exports = Utils;
