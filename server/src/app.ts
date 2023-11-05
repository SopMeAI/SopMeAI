import express, { type Request } from 'express'
import cors from 'cors'
import multer from 'multer'

const upload = multer()
const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/aws/textract', upload.array('images'), (request: Request, response) => {
  /* upload.array('images') -> 'images' name is derived from the formData key/value pair, 
     e.g formData.append('images', image).
     Image(s) and other related data is found in the request.file header
     e.g 
     console.log('Uploaded image was', (request as any).files)
  */
  console.log('Uploaded image was', request.files)
  response.send('file upload successful')
})

export default app
