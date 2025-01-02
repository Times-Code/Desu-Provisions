import { getMongoDb } from './mangodb-data'
import { ObjectId } from 'mongodb'

const COLLECTION_NAME = 'products'

export async function getProductCollection() {
  const db = await getMongoDb()
  return db.collection(COLLECTION_NAME)
}

export async function getAllProducts() {
  const collection = await getProductCollection()
  const products = await collection.find({}).toArray()
  return products.map(product => ({
    ...product,
    _id: product._id.toString()
  }))
}

export async function getProductById(id) {
  const collection = await getProductCollection()
  const product = await collection.findOne({ _id: new ObjectId(id) })
  if (product) {
    product._id = product._id.toString()
  }
  return product
}

export async function createProduct(productData) {
  const collection = await getProductCollection()
  const result = await collection.insertOne(productData)
  return { ...productData, _id: result.insertedId.toString() }
}

export async function updateProduct(id, updateData) {
  const collection = await getProductCollection()
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: 'after' }
  )
  if (result.value) {
    result.value._id = result.value._id.toString()
  }
  return result.value
}

export async function deleteProduct(id) {
  const collection = await getProductCollection()
  const result = await collection.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount === 1
}

export async function searchProducts(query) {
  const collection = await getProductCollection()
  const products = await collection.find({
    name: { $regex: query, $options: 'i' }
  }).toArray()
  return products.map(product => ({
    ...product,
    _id: product._id.toString()
  }))
}

export async function addGroceryItems(items) {
  const collection = await getProductCollection()
  const result = await collection.insertMany(items)
  return result.insertedIds
}

