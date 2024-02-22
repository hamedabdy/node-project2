// CHALK LOGGING
const chalk = require("chalk");
const log = console.log;
const warning = chalk.bold.hex("#FFA500"); // Orange color

const { v1: uuidv1, v5: uuidv5 } = require("uuid");

class Utils {
  constructor() {}

  /**
   * print to console using chalk
   * @param {string} message message string
   * @param  {...any} args
   */
  warn(message, ...args) {
    log("\n\n" + warning(message) + "\n\n", ...args);
  }

  /**
   * checks if the attribute is nil
   * @param {*} attribute any type attribute
   * @returns true|false
   */
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
    )
      return true;
    else return false;
  }

  /**
   * generate a 32 character unique sys_id
   * @returns {string} sys_id
   */
  generateSysID() {
    // Generate a UUIDv1
    const uuidv1Output = uuidv1().replace(/-/g, "");
    // Use the output of UUIDv1 as the input for UUIDv5
    return uuidv5(uuidv1Output, uuidv5.DNS).replace(/-/g, "");
  }
}

module.exports = Utils;
