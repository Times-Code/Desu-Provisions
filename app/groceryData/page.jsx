'use client'

import { useState, useEffect } from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from "@/components/ui/use-toast"
import { fetchProducts, deleteProduct, searchProducts } from '../dataupdate/actions'

export default function GroceryDataTable() {
  const [isOpen, setIsOpen] = useState(false)
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      fetchProductsData()
    }
  }, [isOpen]) // eslint-disable-next-line react-hooks/exhaustive-deps

  async function fetchProductsData() {
    setIsLoading(true)
    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

  async function handleSearchChange(e) {
    const value = e.target.value
    setSearchQuery(value)
    setIsLoading(true)
    try {
      let data;
      if (value.trim() === '') {
        data = await fetchProducts()
      } else {
        const results = await searchProducts(value)
        data = results.filter((product) => product.name.toLowerCase().includes(value.toLowerCase()))
      }
      setProducts(data)
    } catch (error) {
      console.error('Error searching products:', error)
      toast({
        title: "Error",
        description: "Failed to search products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(id) {
    try {
      const result = await deleteProduct(id)
      if (result.success) {
        setProducts(products.filter(product => product._id !== id))
        toast({
          title: "Success",
          description: "Product deleted successfully.",
        })
      } else {
        throw new Error(result.error || 'Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <button
        onClick={openModal}
        className="bg-rose-600 hover:bg-rose-500 text-white py-2 px-6 rounded-md font-semibold transition-all active:scale-95 shadow-sm"
      >
        View Grocery
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
          <div className="relative w-[100%] max-w-2xl mx-auto my-6">
            <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-slate-200">
                <h3 className="text-3xl font-semibold">
                  Grocery Data
                </h3>
                <button
                  className="float-right p-1 ml-auto text-lg border font-semibold leading-none text-rose-600 px-2 rounded border-rose-400"
                  onClick={closeModal}
                >
                  X
                </button>
              </div>
              <div className="relative flex-auto p-6">
                <form onSubmit={(e) => e.preventDefault()} className="mb-4">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="flex-grow"
                    />
                  </div>
                </form>
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <div className="max-h-[300px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>In Stock</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>₹ {product.price.toFixed(2)}</TableCell>
                            <TableCell>{product.inStock ? 'Yes' : 'No'}</TableCell>
                            <TableCell>
                              <Button
                                onClick={() => handleDelete(product._id)}
                                variant="destructive"
                                size="sm"
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-slate-200">
                <Button onClick={closeModal} variant="outline" className="mr-2">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

