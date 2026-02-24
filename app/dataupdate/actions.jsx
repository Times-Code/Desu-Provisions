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
    const bulkOps = groceryList.map(item => ({
      updateOne: {
        filter: { name: item.name.trim() },
        update: {
          $set: {
            price: parseFloat(item.price) || 0,
            currency: '₹',
            inStock: true,
            updatedAt: new Date()
          },
          $setOnInsert: {
            createdAt: new Date()
          }
        },
        upsert: true
      }
    }));

    const result = await productsCollection.bulkWrite(bulkOps);
    return {
      success: true,
      message: `Added/Updated ${bulkOps.length} items successfully`
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

export async function submitCartToDatabase(cart, sgst, cgst, includeSgst, includeCgst, customerPhone) {
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
      customerPhone: customerPhone || null,
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

export async function searchCustomerByPhone(phoneNumber) {
  const db = await getMongoDb();
  const submissionsCollection = db.collection("submissions");

  try {
    // Search for customer by phone number in the submissions collection
    const customer = await submissionsCollection.findOne({ PhoneNumber: phoneNumber });

    if (customer) {
      return {
        name: customer.name,
        phone: customer.PhoneNumber,
        email: customer.email,
      };
    }

    return null;
  } catch (error) {
    console.error("Error searching customer:", error);
    return null;
  }
}

export async function suggestCustomers(query) {
  const db = await getMongoDb();
  const submissionsCollection = db.collection("submissions");

  try {
    const customers = await submissionsCollection.find({
      PhoneNumber: { $regex: query, $options: 'i' }
    }).limit(10).toArray();

    return customers.map(c => ({
      name: c.name,
      phone: c.PhoneNumber,
      email: c.email,
      _id: c._id.toString()
    }));
  } catch (error) {
    console.error("Error suggesting customers:", error);
    return [];
  }
}


export async function addCustomerToDatabase(customerData) {
  const db = await getMongoDb();
  const submissionsCollection = db.collection("submissions");

  try {
    // Check if customer already exists
    const existingCustomer = await submissionsCollection.findOne({
      PhoneNumber: customerData.PhoneNumber,
    });

    if (existingCustomer) {
      return { success: false, error: "Customer with this phone number already exists" };
    }

    // Insert new customer
    await submissionsCollection.insertOne({
      ...customerData,
      createdAt: new Date(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding customer:", error);
    return { success: false, error: "Failed to add customer" };
  }
}

export async function updateCustomerInDatabase(customerData) {
  const db = await getMongoDb();
  const submissionsCollection = db.collection("submissions");

  try {
    // Update existing customer information
    const result = await submissionsCollection.updateOne(
      { PhoneNumber: customerData.PhoneNumber },
      {
        $set: {
          name: customerData.name,
          ...(customerData.email && { email: customerData.email }),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: "Customer not found" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating customer:", error);
    return { success: false, error: "Failed to update customer" };
  }
}

export async function fetchCustomerHistory(phoneNumber) {
  const db = await getMongoDb();
  const transactionsCollection = db.collection('transactions');

  try {
    const history = await transactionsCollection
      .find({ customerPhone: phoneNumber })
      .sort({ createdAt: -1 })
      .toArray();

    return history.map(t => ({
      ...t,
      _id: t._id.toString()
    }));
  } catch (error) {
    console.error('Fetch customer history error:', error);
    return [];
  }
}

