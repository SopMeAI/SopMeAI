import axios from 'axios'
require('dotenv').config()
// interfaces
interface Parameters {
    min_length?: number, // integer
    max_length?: number, // integer
    top_k?: number, // integer
    top_p?: number, // float
    temperature?: number, // float 0.0 - 100.0
    repetition_penalty?: number // float 0.0 - 100.0
}

interface Options {
    use_cache?: boolean, // default true
    wait_for_model?: boolean // default false
}

interface Request {
    inputs: string,
    parameters?: Parameters,
    options?: Options
}

// Connection requirements
const ENDPOINT = "https://api-inference.huggingface.co/models/google/flan-t5-xxl"
const API_TOKEN = process.env.HUGGINGFACE_API_TOKEN

// functions
export async function query(data: Request) {
    if (!API_TOKEN) return "Missing API TOKEN"

    const config = {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
    }
    const body = JSON.stringify(data)
    console.log(body)

	await axios.post(ENDPOINT, body, config)
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            console.log('Error sending prompt')
            throw (error)
        }
    )
    return "Error returning completion"
}