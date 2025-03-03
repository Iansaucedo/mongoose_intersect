import mongoose from 'mongoose'
import { getdata } from './api.js'
const { Schema, model } = mongoose

const uri = 'mongodb://127.0.0.1:27017/intersect'

const options = {
  autoIndex: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4
}

const intersectSchema = new Schema({
  intersect: [
    {
      edificio: { type: String, required: true }
    }
  ],
  edificio: { type: String }
})

const Intersect = model('Intersect', intersectSchema)

async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(uri, options)
    console.log('MongoDB connected successfully')

    // Get data from API
    const query = await getdata()
    console.log('API Data received:', query)

    // Format the data properly before insertion
    const dataToInsert = {
      intersect: Array.isArray(query.intersect)
        ? query.intersect.map(item => ({
            edificio: typeof item === 'object' ? item.building : item
          }))
        : [
            {
              edificio:
                typeof query.intersect === 'object' ? query.intersect.building : query.intersect
            }
          ]
    }

    console.log('Data to insert:', JSON.stringify(dataToInsert, null, 2))

    // Create document
    const result = await Intersect.create(dataToInsert)
    console.log('Inserted document:', JSON.stringify(result, null, 2))
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await mongoose.connection.close()
    console.log('MongoDB connection closed')
    process.exit(0)
  }
}

main()
