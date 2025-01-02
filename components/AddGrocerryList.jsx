'use client'

import { useState } from 'react'
import { addGroceryList } from '../app/dataupdate/actions'
import { Trash2 } from 'lucide-react';

export default function AddGroceryModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState([{ name: '', price: ''}])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAddItem = () => {
    setItems([...items, { name: '', price: '' }])
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...items]
    newItems[index][field] = value
    setItems(newItems)
  }

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')
    const result = await addGroceryList(items)
    setIsLoading(false)
    if (result.success) {
      setMessage(result.message)
      setItems([{ name: '', price: ''}])
      // setIsOpen(false) // Close the modal on successful submission
    } else {
      setMessage(result.error)
    }
  }

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setMessage('')
    setItems([{ name: '', price: ''}]) 
  }

  return (
    <div className="max-w-md mt-10">
      {/* Initial Add Grocery Button */}
      <button
        onClick={openModal}
        className="w-fit bg-rose-600 text-white text-[16px] px-4 p-2 rounded-md hover:bg-rose-500"
      >
        Add Grocery
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl ">
            <div className='flex justify-between  items-center mb-6'>
            <h2 className="text-2xl font-bold">Add Grocery List</h2>

            <button
              onClick={closeModal}
              className=" px-2 py-1 border border-rose-500 rounded-md text-rose-600 top-2 right-2 text-gray-500 hover:text-gray-700"
            >
            Close
            </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex space-x-2 items-center">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      handleItemChange(index, 'name', e.target.value)
                    }
                    placeholder="Item name"
                    className="flex-1 p-2 border rounded"
                    required
                  />
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(index, 'price', parseFloat(e.target.value))
                    }
                    placeholder="Price"
                    className="w-20 p-2 border rounded"
                    step="0.01"
                  />
                  {/* <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, 'quantity', parseFloat(e.target.value))
                    }
                    placeholder="quantity"
                    className="w-24 p-2 border rounded"
                  /> */}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="bg-rose-50 p-2 rounded text-red-500 hover:text-red-700"
                    title="Remove Item"
                  >
                        <Trash2 />
                  </button>
                </div>
              ))}
              <div className='flex gap-10'>
              <button
                type="button"
                onClick={handleAddItem}
                className="w-full bg-slate-500 text-white p-2 rounded hover:bg-black"
              >
                Add Another Item
              </button>
              <button
                type="submit"
                className="w-full bg-rose-600 text-white p-2 rounded hover:bg-rose-500"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Grocery List'}
              </button>
              </div>
              
            </form>
            {message && <p className="mt-4 text-center">{message}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
