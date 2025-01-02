'use client'

import { useState, useEffect } from 'react'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from "@/components/ui/use-toast"
import { fetchSubmissions, updateSubmission, deleteSubmission } from './actions'

export default function SubmissionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [submissions, setSubmissions] = useState([])
  const [editingCell, setEditingCell] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      fetchSubmissionsData()
    }
  }, [isOpen])

  async function fetchSubmissionsData() {
    setIsLoading(true)
    try {
      const data = await fetchSubmissions()
      setSubmissions(data)
    } catch (error) {
      console.error('Error fetching submissions:', error)
      toast({
        title: "Error",
        description: "Failed to fetch submissions. Please try again.",
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
    setEditingCell(null)
  }

  function handleEdit(id, field) {
    setEditingCell({ id, field })
  }

  async function handleSave(id, field, value) {
    try {
      const result = await updateSubmission(id, { [field]: value })
      if (result.success) {
        setSubmissions(submissions.map(sub => 
          sub._id === id ? { ...sub, [field]: value } : sub
        ))
        setEditingCell(null)
        toast({
          title: "Success",
          description: "Submission updated successfully.",
        })
      } else {
        throw new Error(result.error || 'Failed to update submission')
      }
    } catch (error) {
      console.error('Error updating submission:', error)
      toast({
        title: "Error",
        description: "Failed to update submission. Please try again.",
        variant: "destructive",
      })
    }
  }

  async function handleDelete(id) {
    try {
      const result = await deleteSubmission(id)
      if (result.success) {
        setSubmissions(submissions.filter(sub => sub._id !== id))
        toast({
          title: "Success",
          description: "Submission deleted successfully.",
        })
      } else {
        throw new Error(result.error || 'Failed to delete submission')
      }
    } catch (error) {
      console.error('Error deleting submission:', error)
      toast({
        title: "Error",
        description: "Failed to delete submission. Please try again.",
        variant: "destructive",
      })
    }
  }

  function EditableCell({ submission, field }) {
    const isEditing = editingCell?.id === submission._id && editingCell.field === field
    const value = submission[field]

    if (isEditing) {
      return (
        <Input
          defaultValue={value}
          onBlur={(e) => handleSave(submission._id, field, e.target.value)}
          autoFocus
        />
      )
    }

    return (
      <div onClick={() => handleEdit(submission._id, field)}>
        {value}
      </div>
    )
  }

  return (
    <div>
      <Button onClick={openModal} variant="default" className="bg-rose-600 hover:bg-rose-500">
        View Customers
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative w-[100%] max-w-6xl mx-auto my-6">
            <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-slate-200">
                <h3 className="text-3xl font-semibold">
                  Our Customers
                </h3>
                <button
                  className="float-right p-1 ml-auto text-3xl font-semibold leading-none text-black bg-transparent border-0 outline-none opacity-5 focus:outline-none"
                  onClick={closeModal}
                >
                  <span className="block w-6 h-6 text-2xl text-black bg-transparent outline-none opacity-5 focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
              <div className="relative flex-auto p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <div className='overflow-auto'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone Number</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((submission) => (
                        <TableRow key={submission._id}>
                          <TableCell>
                            <EditableCell submission={submission} field="name" />
                          </TableCell>
                          <TableCell>
                            <EditableCell submission={submission} field="email" />
                          </TableCell>
                          <TableCell>
                            <EditableCell submission={submission} field="PhoneNumber" />
                          </TableCell>
                          <TableCell>
                            {new Date(submission.createdAt).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Button 
                              onClick={() => handleDelete(submission._id)}
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
    </div>
  )
}

