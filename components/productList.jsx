'use client'

import { useState, useEffect } from 'react'
import { fetchProducts, addToCart } from '../app/dataupdate/actions'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      const fetchedProducts = await fetchProducts()
      setProducts(fetchedProducts)
      setLoading(false)
    }
    loadProducts()
  }, [])

  const handleAddToCart = async (productId) => {
    const result = await addToCart(productId)
    if (result.success) {
      alert('Product added to cart!')
    } else {
      alert('Failed to add product to cart')
    }
  }

  if (loading) {
    return <div>Loading products...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product._id} className="border p-4 rounded-md">
          <h3 className="font-bold">{product.name}</h3>
          <p>Rs{product.price.toFixed(2)}</p>
          <button
            onClick={() => handleAddToCart(product._id)}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  )
}

