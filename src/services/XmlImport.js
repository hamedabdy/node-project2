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
      if (tableNames.length == 0) {
        throw new Error('Invalid XML: No table element found under <unload>');
      }

      const results = [];

      for (const tableName of tableNames) {
        // Normalise to array to support both single and multi-record payloads.
        const rawData = unload[tableName];
        const records = Array.isArray(rawData) ? rawData : [rawData];

        for (const tableData of records) {
          const action = tableData['@_action'];
          if (!action) {
            throw new Error('Invalid XML: No action attribute found on table element');
          }

          const fields = this._extractFields(tableData);

          if (action === 'INSERT_OR_UPDATE')
            results.push(await this.insertOrUpdate(tableName, fields));
          else
            throw new Error(`Unsupported action: ${action}`);
        }
      }

      // Return a single result object for single-record payloads (backwards-compatible),
      // or a summary object for multi-record payloads.
      if (results.length === 1)
        return results[0];

      const failed = results.filter((r) => r.status === 'fail');
      return {
        status: failed.length === 0 ? 'success' : 'partial',
        total: results.length,
        succeeded: results.length - failed.length,
        failed: failed.length,
        results,
      };
    } catch (error) {
      console.error('XML Import error:', error);
      return { status: 'fail', err: error.message };
    }
  }

  async importFile(filePath) {
    let fileContents;
    try {
      fileContents = await fs.readFile(filePath, 'utf8');
      if (!fileContents.trim().startsWith('<?xml') || !fileContents.includes('<unload'))
        throw new Error('Invalid XML file format');
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

    /**
   * Extracts plain field values from a parsed table-row object.
   * Handles three cases:
   *   1. Simple text node:          <field>value</field>           → "value"
   *   2. Text node with attributes: <field attr="x">value</field>  → "value"
   *   3. Attribute-only node:       <field display_value=""/>      → ""
   */
  _extractFields(tableData) {
    const fields = {};
    for (const [key, value] of Object.entries(tableData)) {
      if (key.startsWith('@_')) continue;

      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        fields[key] = value['#text'] !== undefined ? value['#text'] : '';
      } else {
        fields[key] = value ?? '';
      }
    }
    return fields;
  }

  async insertOrUpdate(tableName, fields) {
    const sys_id = fields.sys_id;
    if (!sys_id)
      throw new Error('sys_id is required for INSERT_OR_UPDATE');

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