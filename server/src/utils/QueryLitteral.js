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
    let where = {};
    let currentOrGroup = [];

    // Define a regex to match the field, operator, and value
    const conditionRegex =
      /([^=<>!]+)([=<>!]+|startswith|endswith|contains|doesnotcontain|between|isempty|isnotempty)(.+)/i;

    conditions.forEach((condition) => {
      //   utils.warn("querylitteral - condtion : %s", condition);
      // Trim whitespace
      condition = condition.trim();

      // Handle OR conditions
      if (condition.toUpperCase().startsWith("OR")) {
        if (currentOrGroup.length > 0) {
          where[Op.or] = where[Op.or] || [];
          where[Op.or].push(currentOrGroup);
          currentOrGroup = []; // Reset current OR group
        }
        condition = condition.replace(/^OR/, "").trim();
      }

      // TODO : Handle New Query (NQ)
      if (condition.toUpperCase().startsWith("NQ")) {
        // utils.warn("querylitteral - inside NQ condtion : %s", condition);

        if (currentOrGroup.length > 0) {
          where[Op.or] = where[Op.or] || [];
          where[Op.or].push(currentOrGroup);
          currentOrGroup = []; // Reset current OR group
        }
        // return; // Skip adding NQ itself
      }

      // Match the condition using regex
      const match = condition.match(conditionRegex);
      if (match) {
        // utils.warn("querylitteral - inside match - condition : %s", condition);
        const field = match[1].trim();
        const operator = match[2].trim();
        let value = match[3].trim();

        if (value.toLowerCase() === "true") value = true;
        else if (value.toLowerCase() === "false") value = false;

        // utils.warn(
        //   "querylitteral - inside match - field : %s\noperator : %s\nvalue : %s",
        //   field,
        //   operator,
        //   value
        // );

        // Map the operator to Sequelize
        const sequelizeOperator = this._operatorToSequelize(operator);

        // Create the condition object
        const conditionObject = { [field]: { [sequelizeOperator]: value } };
        // utils.warn(
        //   "querylitteral - inside match - condition object : %o",
        //   conditionObject
        // );
        currentOrGroup.push(conditionObject);
      }
    });

    // Push any remaining conditions in the current OR group
    if (currentOrGroup.length > 0) {
      where[Op.or] = where[Op.or] || [];
      where[Op.or].push(currentOrGroup);
    }

    // utils.warn("querylitteral - inside match - where : %o", where);

    return where;
  }

  _operatorToSequelize(operator) {
    return op_map[operator] ?? Op.eq;
  }
}

module.exports = QueryLitteral;
