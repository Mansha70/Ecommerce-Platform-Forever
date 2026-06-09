import fs from 'fs'
import path from 'path'
import multer from 'multer'

const uploadsDir = path.resolve('uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadsDir)
  },
  filename: function (req, file, callback) {
    const ext = path.extname(file.originalname)
    const uniqueName = `${file.fieldname}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${ext}`
    callback(null, uniqueName)
  },
})

const upload = multer({ storage })

export default upload
