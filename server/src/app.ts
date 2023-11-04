import express from 'express'

const cors = require('cors')
//Multer is used to handle image upload from frontend to backend
const multer = require('multer')
const upload = multer()
const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/aws/textract', upload.array('images'), (request, response) => {
  /* upload.array('images') -> 'images' name is derived from the formData key/value pair, 
     e.g formData.append('images', image).
     Image(s) and other related data is found in the request.file header
     e.g 
     console.log('Uploaded image was', (request as any).files)
  */
  console.log('Uploaded image was', (request as any).files)
  response.send('file upload successful')
})

export default app
