'use server'

import { getMongoDb } from '../../lib/mangodb-data'
import { ObjectId } from 'mongodb'

export async function submitForm(formData) {
  const db = await getMongoDb()
  const submissionsCollection = db.collection('submissions')

  const name = formData.get('name')
  const email = formData.get('email')
  const PhoneNumber = formData.get('PhoneNumber')

  try {
    await submissionsCollection.insertOne({
      name,
      email,
      PhoneNumber,
      createdAt: new Date()
    })

    const count = await submissionsCollection.countDocuments()

    return { success: true, count }
  } catch (error) {
    console.error('Submission error:', error)
    return { success: false, error: 'Failed to submit form' }
  }
}

export async function fetchSubmissions() {
  const db = await getMongoDb()
  const submissionsCollection = db.collection('submissions')

  try {
    const submissions = await submissionsCollection.find({}).toArray()
    return submissions.map(sub => ({
      ...sub,
      _id: sub._id.toString()
    }))
  } catch (error) {
    console.error('Fetch submissions error:', error)
    return []
  }
}


export async function updateSubmission(id, updatedData) {
  const db = await getMongoDb()
  const submissionsCollection = db.collection('submissions')

  try {
    const result = await submissionsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    )
    return { success: result.modifiedCount === 1 }
  } catch (error) {
    console.error('Update submission error:', error)
    return { success: false, error: 'Failed to update submission' }
  }
}

export async function deleteSubmission(id) {
  const db = await getMongoDb()
  const submissionsCollection = db.collection('submissions')

  try {
    const result = await submissionsCollection.deleteOne({ _id: new ObjectId(id) })
    return { success: result.deletedCount === 1 }
  } catch (error) {
    console.error('Delete submission error:', error)
    return { success: false, error: 'Failed to delete submission' }
  }
}

export async function fetchProducts() {
  const db = await getMongoDb()
  const productsCollection = db.collection('products')

  try {
    const products = await productsCollection.find({}).toArray()
    return products.map(product => ({
      ...product,
      _id: product._id.toString()
    }))
  } catch (error) {
    console.error('Fetch products error:', error)
    return []
  }
}

export async function searchProducts(query) {
  const db = await getMongoDb()
  const productsCollection = db.collection('products')

  try {
    const products = await productsCollection.find({
      name: { $regex: query, $options: 'i' }
    }).toArray()
    return products.map(product => ({
      ...product,
      _id: product._id.toString()
    }))
  } catch (error) {
    console.error('Search products error:', error)
    return []
  }
}

export async function addProduct(productData) {
  const db = await getMongoDb()
  const productsCollection = db.collection('products')

  try {
    const result = await productsCollection.insertOne({
      ...productData,
      createdAt: new Date()
    })
    return { 
      success: true, 
      product: { ...productData, _id: result.insertedId.toString() } 
    }
  } catch (error) {
    console.error('Add product error:', error)
    return { success: false, error: 'Failed to add product' }
  }
}

export async function updateProduct(id, updateData) {
  const db = await getMongoDb()
  const productsCollection = db.collection('products')

  try {
    const result = await productsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    if (result.value) {
      result.value._id = result.value._id.toString()
    }
    return { success: true, product: result.value }
  } catch (error) {
    console.error('Update product error:', error)
    return { success: false, error: 'Failed to update product' }
  }
}

export async function deleteProduct(id) {
  const db = await getMongoDb()
  const productsCollection = db.collection('products')

  try {
    const result = await productsCollection.deleteOne({ _id: new ObjectId(id) })
    return { success: result.deletedCount === 1 }
  } catch (error) {
    console.error('Delete product error:', error)
    return { success: false, error: 'Failed to delete product' }
  }
}

export async function addToCart(productId) {
  const db = await getMongoDb()
  const productsCollection = db.collection('products')

  try {
    const product = await productsCollection.findOne({ _id: new ObjectId(productId) })
    if (!product) {
      return { success: false, error: 'Product not found' }
    }
    // Here you would typically update a user's cart in the database
    // For now, we'll just return a success message with the product details
    return { 
      success: true, 
      message: 'Product added to cart', 
      product: { ...product, _id: product._id.toString() } 
    }
  } catch (error) {
    console.error('Add to cart error:', error)
    return { success: false, error: 'Failed to add product to cart' }
  }
}

export async function addGroceryList(groceryList) {
  const db = await getMongoDb();
  const productsCollection = db.collection('products');

  try {
    // Step 1: Check for existing items
    const itemNames = groceryList.map(item => item.name.trim().toLowerCase());
    const existingItems = await productsCollection
      .find({ name: { $in: itemNames } })
      .toArray();

    if (existingItems.length > 0) {
      const existingItemNames = existingItems.map(item => item.name).join(', ');
      return {
        success: false,
        error: `Items already exist in the Store: ${existingItemNames}`
      };
    }

    // Step 2: Prepare items for insertion
    const items = groceryList.map(item => ({
      name: item.name.trim(),
      price: parseFloat(item.price) || 0,
      currency: '₹',
      // Quantity: item.quantity || 'Uncategorized',
      inStock: true,
      createdAt: new Date()
    }));

    // Step 3: Insert items
    const result = await productsCollection.insertMany(items);
    return { 
      success: true, 
      message: `Added ${Object.keys(result.insertedIds).length} items successfully` 
    };
  } catch (error) {
    console.error('Add grocery list error:', error);
    return { success: false, error: 'Failed to add grocery list' };
  }
}
// export async function fetchProducts() {
//   const db = await getMongoDb()
//   const productsCollection = db.collection('products')

//   try {
//     const products = await productsCollection.find({}).toArray()
//     return products.map(product => ({
//       ...product,
//       _id: product._id.toString()
//     }))
//   } catch (error) {
//     console.error('Fetch products error:', error)
//     return []
//   }
// }

// export async function searchProducts(query) {
//   const db = await getMongoDb()
//   const productsCollection = db.collection('products')

//   try {
//     const products = await productsCollection.find({
//       name: { $regex: query, $options: 'i' }
//     }).toArray()
//     return products.map(product => ({
//       ...product,
//       _id: product._id.toString()
//     }))
//   } catch (error) {
//     console.error('Search products error:', error)
//     return []
//   }
// }

// export async function deleteProduct(id) {
//   const db = await getMongoDb()
//   const productsCollection = db.collection('products')

//   try {
//     const result = await productsCollection.deleteOne({ _id: new ObjectId(id) })
//     return { success: result.deletedCount === 1 }
//   } catch (error) {
//     console.error('Delete product error:', error)
//     return { success: false, error: 'Failed to delete product' }
//   }
// }


function calculateTotal(cart, sgst, cgst, includeSgst, includeCgst) {
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const sgstAmount = includeSgst ? (subtotal * sgst) / 100 : 0;
  const cgstAmount = includeCgst ? (subtotal * cgst) / 100 : 0;
  return subtotal + sgstAmount + cgstAmount;
}

export async function submitCartToDatabase(cart, sgst, cgst, includeSgst, includeCgst) {
  const db = await getMongoDb()
  const transactionsCollection = db.collection('transactions')

  const totalBill = calculateTotal(cart, sgst, cgst, includeSgst, includeCgst);

  try {
    const result = await transactionsCollection.insertOne({
      items: cart,
      totalBill,
      sgst: includeSgst ? sgst : 0,
      cgst: includeCgst ? cgst : 0,
      includeSgst,
      includeCgst,
      createdAt: new Date()
    })
    return { success: true, transactionId: result.insertedId.toString() }
  } catch (error) {
    console.error('Submit cart error:', error)
    return { success: false, error: 'Failed to submit cart data' }
  }
}

export async function fetchRecentTransactions(limit = 15) {
  const db = await getMongoDb();
  const transactionsCollection = db.collection('transactions');

  try {
    const transactions = await transactionsCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return transactions.map(transaction => ({
      ...transaction,
      _id: transaction._id.toString(),
    }));
  } catch (error) {
    console.error('Fetch recent transactions error:', error);
    return [];
  }
}