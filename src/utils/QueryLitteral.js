const { Op } = require("sequelize");

const utils = new (require("../utils/utils"))();

const op_map = {
  "=": Op.eq,
  "!=": Op.ne,
  ">": Op.gt,
  "<": Op.lt,
  ">=": Op.gte,
  "<=": Op.lte,
  STARTSWITH: Op.startsWith,
  ENDSWITH: Op.endsWith,
  CONTAINS: Op.like, // Use LIKE for contains
  DOESNOTCONTAIN: Op.notLike,
};

class QueryLitteral {
  constructor() {}

  // Function to convert encoded query to Sequelize query
  encodedQueryToSequelize(encodedQuery) {
    const conditions = encodedQuery.split("^");
    let where = { [Op.or]: [] }; // Initialize the query with an OR group
    let currentAndGroup = []; // Temporary array to hold AND conditions

    // Define a regex to match the field, operator, and value
    const conditionRegex =
      /([^=<>!]+)([=<>!]+|startswith|endswith|contains|doesnotcontain|between|isempty|isnotempty)(.+)/i;

    conditions.forEach((condition) => {
      condition = condition.trim();

      // Match the condition using regex
      const match = condition.match(conditionRegex);
      if (match) {
        let field = match[1].trim().toLowerCase();

        // Ensure the field name does not include the 'OR' prefix
        if (field.toUpperCase().startsWith("OR")) {
          field = field.replace(/^OR/i, "").trim();
        }

        const operator = match[2].trim();
        let value = match[3].trim().toLowerCase();

        if (value === "true") value = true;
        else if (value === "false") value = false;

        const sequelizeOperator = this._operatorToSequelize(operator);
        const conditionObject = { [field]: { [sequelizeOperator]: value } };

        // Handle OR conditions
        if (condition.toUpperCase().startsWith("OR")) {
          if (currentAndGroup.length > 0) {
            where[Op.or].push({ [Op.and]: currentAndGroup });
            currentAndGroup = []; // Reset the AND group
          }
          where[Op.or].push(conditionObject);
        } else {
          // Add to the current AND group
          currentAndGroup.push(conditionObject);
        }
      }
    });

    // Push the last AND group if it exists
    if (currentAndGroup.length > 0) {
      where[Op.or].push({ [Op.and]: currentAndGroup });
    }

    return where;
  }

  _operatorToSequelize(operator) {
    return op_map[operator] ?? Op.eq;
  }
}

module.exports = QueryLitteral;
