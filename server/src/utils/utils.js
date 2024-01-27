// CHALK LOGGING
const chalk = require("chalk");
const log = console.log;
const warning = chalk.bgWhite.bold.hex("#FFA500"); // Orange color

class Utils {
  constructor() {}

  nil(attribute) {
    if (
      !attribute ||
      attribute === "" ||
      attribute === null ||
      attribute === undefined ||
      typeof attribute === "undefined" ||
      Number.isNaN(attribute)
    ) {
      log(warning("The attribute is empty, null, undefined, or NaN"));
      return true;
    } else {
      log(warning("The attribute is defined and not empty, null, or NaN"));
      return false;
    }
  }
}

module.exports = Utils;
