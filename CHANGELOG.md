# Changelog

All notable changes to the core-server project will be documented in this file.

## [Unreleased]

### Changed
- Modified `SysDictionary.js` to retrieve `internal_type` name from `sys_glide_object` table:
  - Implemented `getGlideObjectNameBySysId` in `SysGlideObject.js` to fetch the name attribute for a given sys_id.
  - Updated `_createColumn` and `updateColumn` methods in `SysDictionary.js` to use this new function, mapping the `internal_type` sys_id to its corresponding name for custom types.
- Enhanced sys_dictionary table query handling in Sequelizer.js:
  - Added automatic filtering to exclude collection type records
  - Improved data consistency in frontend views
  - Utilized SysDictionary's getRows method for better query handling

### Added
- Added `getReferenceKeyBySysId` function in `core-server/src/services/Sequelizer.js` to retrieve the display value for a reference key.
- Added new API endpoint `/reference_key/:table_name/:sys_id` in `core-server/src/routes/tableApi.js` to expose the `getReferenceKeyBySysId` functionality.

### Added
- Enhanced sys_name field handling in Sequelizer.js:
  - sys_name now automatically uses the value of the field marked as display=true in sys_dictionary
  - Falls back to the name field if no display field is configured
  - Improves data consistency and user experience by using meaningful display values

### Added
- Added automatic sys_class_name defaulting in Sequelizer.js:
  - sys_class_name is now automatically set to the table name during record insertion
  - Improves data consistency and reduces manual input requirements
  - Applied in insertRow method of Sequelizer service

### Fixed
- Fixed duplicate column creation issue in SysDictionary:
  - Modified _copyParentFields to exclude system fields (sys_*) during inheritance
  - Prevents duplicate column creation attempts by respecting system fields created by table initialization
  - System fields are now handled only by the initial table creation

### Fixed
- Fixed duplicate field creation issue in SysDictionary.js:
  - Removed redundant _copyParentFields call in createCollection method
  - Fields are now copied only once during table creation in SysDbObject.create
  - Fixed race condition between table creation and field inheritance

### Fixed
- Fixed sys_name handling in SysDictionary.js to prevent override of collection names:
  - Modified create method to preserve sys_name when already set
  - Ensures collection records maintain correct sys_name value
  - Prevents sys_name from being overridden by element value for collections

### Added
- Added database backup script `backup_node_project_db.sh` for backing up the node-project database from core-db container
- Implemented cascade delete for sys_db_object records:
  - Deletes corresponding record in sys_metadata (matching sys_id)
  - Deletes all related records in sys_dictionary table
- Implemented cascade delete for sys_dictionary records:
  - When deleting a table's records, deletes corresponding sys_metadata records
  - Deletes both collection and field records for the table
- Added documentation for table relationships:
  - sys_db_object → sys_metadata (1:1 relationship, shared sys_id)
  - sys_db_object → sys_dictionary (1:n relationship):
    - One collection record per table
    - Multiple column records for table fields
  - sys_dictionary → sys_metadata (1:1 relationship, shared sys_id)

### Changed
- Modified `SysDbObject.create` method to format `sys_name` using proper capitalization and spaces (e.g., "sys_app_module" becomes "Sys App Module")
- Enhanced record creation process in `SysDbObject`:
  - Creates matching record in sys_metadata with same sys_id
  - Creates collection record in sys_dictionary with table name
  - Creates column records in sys_dictionary for inherited fields
- Fixed issue with undefined `name` parameter in `SysDictionary._copyParentFields`
- Added proper async/await handling in `SysDbObject.create` method
- Added validation for `tableName` and `superClassName` in `SysDictionary._copyParentFields`
- Ensured `sys_name` in `sys_dictionary` collection records matches the table name exactly

### Fixed
- Fixed WHERE parameter "name" undefined error in `SysDictionary._copyParentFields`
- Added proper error handling and validation in parent field copying process
- Fixed "Cannot read properties of undefined (reading 'ne')" error in `SysDictionary.deleteCollection` by properly importing and using Sequelize Op operators

### Technical Documentation
#### Table Relationships
1. When a record is created in `sys_db_object`:
   - A matching record with the same sys_id is created in `sys_metadata`
   - A collection record is created in `sys_dictionary` with:
     - type = "collection"
     - name = table name
     - Different sys_id from the original record
   - Column records are created in `sys_dictionary` for each field

2. When a record is deleted from `sys_db_object`:
   - The matching record in `sys_metadata` (same sys_id) is deleted
   - All related records in `sys_dictionary` are deleted:
     - The collection record (matching table name)
     - All column records for that table
