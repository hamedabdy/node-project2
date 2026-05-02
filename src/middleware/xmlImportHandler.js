const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const multer = require('multer');

const uploadDir = path.join('/tmp', 'praxion-import-agent');
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
      cb(null, `${Date.now()}-${safeName}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.xml' && !file.mimetype.includes('xml')) {
      return cb(new Error('Only XML files are accepted'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 200 * 1024 * 1024, // 200 MB
  },
});

async function ensureUploadDirExists() {
  await fsPromises.mkdir(uploadDir, { recursive: true });
}

function createXmlImportMiddleware(sequelizer) {
  return async function xmlImportMiddleware(req, res) {
    try {
      if (!req.file || !req.file.path) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const ext = path.extname(req.file.originalname).toLowerCase();
      if (ext !== '.xml' && !req.file.mimetype.includes('xml')) {
        return res.status(400).json({ error: 'Uploaded file must be XML' });
      }

      await ensureUploadDirExists();

      const result = await sequelizer.xmlImport.importFile(req.file.path);
      return res.json(result);
    } catch (error) {
      console.error('XML IMPORT - middleware error: ', error);
      return res.status(500).json({ error: 'XML IMPORT : Internal Server Error', message: error.message });
    }
  };
}

module.exports = {
  upload,
  createXmlImportMiddleware,
};
