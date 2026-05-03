const fs = require('fs/promises');
const { XMLParser } = require('fast-xml-parser');

class XmlImport {
  constructor(sequelizer) {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: '#text',
      allowBooleanAttributes: true,
    });
    this.sequelizer = sequelizer;
  }

  async import(xmlPayload) {
    try {
      // Parse the XML
      const parsed = this.parser.parse(xmlPayload);

      // The root is <unload>, and inside it there's the table element, e.g., <sys_dictionary>
      const unload = parsed.unload;
      if (!unload) {
        throw new Error('Invalid XML: No <unload> element found');
      }

      // Get the table name from the child element
      const tableNames = Object.keys(unload).filter((key) => key !== '@_unload_date');
      if (tableNames.length !== 1) {
        throw new Error('Invalid XML: Expected exactly one table element under <unload>');
      }

      const tableName = tableNames[0];
      const tableData = unload[tableName];

      // Get the action attribute
      const action = tableData['@_action'];
      if (!action) {
        throw new Error('Invalid XML: No action attribute found on table element');
      }

      // Extract the fields
      const fields = {};
      for (const [key, value] of Object.entries(tableData)) {
        if (key.startsWith('@_')) continue; // Skip attributes
        // Handle tags with attributes and text (e.g. <tag attr="1">Text</tag>)
        if (value !== null && typeof value === 'object') {
          if (value['#text'] !== undefined) {
            fields[key] = value['#text'];
          } else {
            // It's an object with attributes but no text content 
            // e.g., <super_class display_value=""/>
            fields[key] = ""; 
          }
        } else {
          // Handle simple tags with no attributes (e.g. <tag>Text</tag> or empty string)
          fields[key] = value;
        }
      }

      // Now, based on action, perform insert or update
      if (action === 'INSERT_OR_UPDATE') {
        return await this.insertOrUpdate(tableName, fields);
      }

      throw new Error(`Unsupported action: ${action}`);
    } catch (error) {
      console.error('XML Import error:', error);
      return { status: 'fail', err: error.message };
    }
  }

  async importFile(filePath) {
    let fileContents;
    try {
      fileContents = await fs.readFile(filePath, 'utf8');
      if (!fileContents.trim().startsWith('<?xml') || !fileContents.includes('<unload')) {
        throw new Error('Invalid XML file format');
      }
      return await this.import(fileContents);
    } finally {
      await this.safeRemoveFile(filePath);
    }
  }

  async safeRemoveFile(filePath) {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.warn(`[XmlImport] Failed to remove temp file ${filePath}:`, error.message);
    }
  }

  async insertOrUpdate(tableName, fields) {
    const sys_id = fields.sys_id;
    if (!sys_id) {
      throw new Error('sys_id is required for INSERT_OR_UPDATE');
    }

    // Get the model
    const Model = await this.sequelizer.getTableMapping(tableName);

    // Check if record exists
    const existing = await Model.findByPk(sys_id);
    if (existing) {
      // Update
      await Model.update(fields, { where: { sys_id } });
      return { status: 'success', operation: 'update', sys_id };
    } else {
      // Insert
      const result = await Model.create(fields);
      return { status: 'success', operation: 'insert', sys_id: result.sys_id };
    }
  }
}

module.exports = XmlImport;