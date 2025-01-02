"use client";

import { useState } from "react";
import { submitForm } from "./actions";

export default function HomePageForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [count, setCount] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setError(null); 
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.target);

    try {
      const result = await submitForm(formData);
      if (result.success) {
        setCount(result.count);
        event.target.reset(); // Reset form fields after successful submission
        closeModal(); 
      } else {
        setError(
          result.error || "An error occurred while submitting the form."
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      setError(
        "An error occurred while submitting the form. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Button to open the modal */}
      <button
        onClick={openModal}
        className="bg-rose-600 hover:bg-rose-500 text-white py-2 px-4 rounded-md"
      >
        Add Customer
      </button>

      {/* Modal for the form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full space-y-4">
            <h2 className="text-2xl font-bold text-center">Submit Form</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="PhoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="PhoneNumber"
                  name="PhoneNumber"
                  required
                  maxlength="10"
                  placeholder="Enter 10-digit phone number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  oninput="this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10)"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
            {error && <p className="mt-4 text-center text-red-600">{error}</p>}
            {count !== null && (
              <p className="mt-4 text-center text-green-600">
                Form submitted successfully! Total submissions: {count}
              </p>
            )}
            <button
              onClick={closeModal}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
