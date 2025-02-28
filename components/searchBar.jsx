"use client";

import { useState, useEffect } from "react";
import {
  searchProducts,
  submitCartToDatabase,
  searchCustomerByPhone,
  addCustomerToDatabase,
  updateCustomerInDatabase,
} from "../app/dataupdate/actions";
import { Search, User, Phone, X } from "lucide-react";
import logo1 from "../public/LogoPNG.png"

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [sgst, setSgst] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [includeSgst, setIncludeSgst] = useState(false);
  const [includeCgst, setIncludeCgst] = useState(false);
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerExists, setCustomerExists] = useState(false);
  const [location, setLocation] = useState("Main Branch"); // Default location
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isVerifyingCustomer, setIsVerifyingCustomer] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      const results = await searchProducts(query);
      const filteredResults = results.filter((product) =>
        product.name.toLowerCase().startsWith(query.toLowerCase())
      );
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      const results = await searchProducts(value);
      const filteredResults = results.filter((product) =>
        product.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  };

  const searchCustomer = async () => {
    setIsVerifyingCustomer(true);
    if (customerPhone.trim()) {
      const customer = await searchCustomerByPhone(customerPhone);
      if (customer) {
        setCustomerName(customer.name);
        setCustomerExists(true);
      } else {
        setCustomerName("");
        setCustomerExists(false);
        setShowCustomerModal(true); // Show modal to add new customer
      }
    }
    setIsVerifyingCustomer(false);
  };

  const saveCustomer = async () => {
    if (customerPhone.trim() && customerName.trim()) {
      if (customerExists) {
        const result = await updateCustomerInDatabase({
          name: customerName,
          PhoneNumber: customerPhone,
        });
        if (result.success) {
          alert("Customer updated successfully!");
        } else {
          alert("Failed to update customer. Please try again.");
        }
      } else {
        const result = await addCustomerToDatabase({
          name: customerName,
          PhoneNumber: customerPhone,
        });
        if (result.success) {
          setCustomerExists(true);
          setShowCustomerModal(false);
        } else {
          alert("Failed to add customer. Please try again.");
        }
      }
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    if (!customerPhone) {
      setShowCustomerModal(true);
    } else {
      addToCart(product);
    }
    setResults([]);
    setQuery("");
  };

  const addToCart = (product) => {
    if (!product) return;

    // Regular expression to match and remove all non-Telugu characters/words
    const teluguName = product.name.replace(/[^\u0C00-\u0C7F\s]/g, "").trim(); // Unicode range for Telugu characters

    // Add the product with the filtered Telugu name to the cart
    setCart((prevCart) => [
      ...prevCart,
      {
        ...product,
        name: teluguName, // Use the filtered Telugu name
        quantity: 1, // Set initial quantity to 1
        unit: "kg", // Default unit
        amount: product.price,
        subtotal: product.price, // Initial subtotal based on quantity 1
      },
    ]);

    setShowCustomerModal(false);
    setSelectedProduct(null);
  };

  const closeModal = () => {
    setShowCustomerModal(false);
    setSelectedProduct(null);
  };

  const handlePrint = async () => {
    try {
      // Calculate subtotal, SGST, CGST, and total
      const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
      const sgstAmount = includeSgst ? (subtotal * 2.5) / 100 : 0;
      const cgstAmount = includeCgst ? (subtotal * 2.5) / 100 : 0;
      const total = subtotal + sgstAmount + cgstAmount;
      const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

      // Save customer if needed
      if (customerPhone && customerName && !customerExists) {
        await saveCustomer();
      }

      // Submit cart data to the database (optional)
      const result = await submitCartToDatabase(
        cart,
        sgstAmount,
        cgstAmount,
        customerPhone || null
      );

      if (result.success) {
        console.log("Cart data submitted successfully. Transaction ID:", result.transactionId);
      } else {
        console.error("Failed to submit cart data:", result.error);
      }

      // Prepare cart content for printing
      const cartContent = `
        <html>
          <head>
            <title>Cart Print</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 10px;
                max-width: 320px;
                margin: auto;
              }
              .logo {
                text-align: center;
                margin-bottom: 10px;
              }
              .logo img {
                max-width: 100px;
                height: auto;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f4f4f4;
                font-weight: bold;
              }
              .total-row {
                font-weight: bold;
              }
              .text-right {
                text-align: right;
              }
              .customer-info {
                margin: 10px 0;
                padding: 5px;
                border: 1px solid #ddd;
                border-radius: 5px;
              }
              .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 12px;
                border-top: 1px dashed #ccc;
                padding-top: 10px;
              }
            </style>
          </head>
          <body>
            <div class="logo">
              <img src="${logo1.src}" alt="Desu Provisions Logo" />
            </div>
            <h2 style="text-align: center;">Desu Provisions</h2>
            <p style="text-align: center;">Location: ${location}</p>
            ${includeSgst || includeCgst ? `<p style="text-align: center;">GSTIN - 37BCNPA9844A1ZM</p>` : ""}
            ${
              customerName && customerPhone
                ? `<div class="customer-info">
                    <p><strong>Customer:</strong> ${customerName}</p>
                    <p><strong>Phone:</strong> ${customerPhone}</p>
                   </div>`
                : ""
            }
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Qty</th>
                  <th>Amount</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${cart
                  .map(
                    (item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td style="max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size:13px;">
                      ${item.name}
                    </td>
                    <td>${item.quantity}</td>
                    <td>₹ ${item.amount.toFixed(2)}</td>
                    <td>₹ ${item.subtotal.toFixed(2)}</td>
                  </tr>`
                  )
                  .join("")}
                  <tr class="total-row">
                  <td colspan="4" class="text-right">Total Quantity</td>
                  <td>${totalQuantity.toFixed(2)} kg</td>
                </tr>
                <tr class="total-row">
                  <td colspan="4" class="text-right">Subtotal</td>
                  <td>₹ ${subtotal.toFixed(2)}</td>
                </tr>
                ${
                  includeSgst
                    ? `<tr>
                    <td colspan="4" class="text-right">SGST (2.5%)</td>
                    <td>₹ ${sgstAmount.toFixed(2)}</td>
                  </tr>`
                    : ""
                }
                ${
                  includeCgst
                    ? `<tr>
                    <td colspan="4" class="text-right">CGST (2.5%)</td>
                    <td>₹ ${cgstAmount.toFixed(2)}</td>
                  </tr>`
                    : ""
                }
                <tr class="total-row">
                  <td colspan="4" class="text-right">Total</td>
                  <td>₹ ${total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <div class="footer">
              <p><strong>Desu Provisions</strong></p>
              <p>123 Main Street, Hyderabad, Telangana</p>
              <p>Phone: +91 9876543210</p>
              <p>Thank you for your business!</p>
            </div>
          </body>
        </html>
      `;

      const printWindow = window.open("", "", "width=800,height=600");
      printWindow.document.write(cartContent);
      printWindow.document.close();
      printWindow.print();
    } catch (error) {
      console.error("Error during print operation:", error);
    }
  };

  const handleQuantityChange = (index, value) => {
    const updatedCart = cart.map((item, i) =>
      i === index
        ? {
            ...item,
            quantity: Number.parseFloat(value) || 0,
            subtotal: (Number.parseFloat(value) || 0) * item.amount * (item.unit === "grams" ? 0.001 : 1),
          }
        : item
    );
    setCart(updatedCart);
  };

  const handleUnitChange = (index, unit) => {
    const updatedCart = cart.map((item, i) =>
      i === index
        ? {
            ...item,
            unit,
            subtotal: item.quantity * item.amount * (unit === "grams" ? 0.001 : 1),
          }
        : item
    );
    setCart(updatedCart);
  };

  const handleAmountChange = (index, value) => {
    const updatedCart = cart.map((item, i) =>
      i === index
        ? {
            ...item,
            amount: value,
            subtotal: item.quantity * Number.parseFloat(value || 0),
          }
        : item
    );
    setCart(updatedCart);
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const sgstAmount = includeSgst ? (subtotal * 2.5) / 100 : 0;
    const cgstAmount = includeCgst ? (subtotal * 2.5) / 100 : 0;
    return subtotal + sgstAmount + cgstAmount;
  };

  const handleClearCart = () => {
    const confirmClear = confirm("Are you sure you want to clear the cart?");
    if (confirmClear) {
      setCart([]);
      localStorage.removeItem("cart");
    }
  };
  const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex justify-between items-center flex-col xl:flex-row gap-8 xl:items-start">
      <div className="w-full max-w-[400px] flex flex-col justify-between items-start">
        <div className="relative w-[100%] max-w-[400px]">
          <p className="text-sm md:text-lg text-slate-700 my-4 md:my-6">Search your products...</p>
          <form onSubmit={handleSearch} className="relative w-full max-w-[400px]">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search for groceries..."
              className="relative w-full p-2 pr-10 text-rose-600 border border-rose-400 rounded-md appearance-none focus:outline-none"
            />
            <button type="submit" className="absolute top-3 right-2">
              <Search className="h-5 w-5 text-gray-400" />
            </button>
          </form>
          {results.length > 0 && (
            <ul className="absolute w-[100%] max-h-[400px] overflow-y-auto bg-white border border-gray-300 rounded-md z-10">
              {results.map((product) => (
                <li
                  key={product._id}
                  onClick={() => handleProductSelect(product)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {product.name} - ₹ {product.price}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Customer details section - now only shown when cart has items */}
        {cart.length > 0 && (
          <div className="mt-6 w-full border p-4 rounded-md shadow-sm">
            <h3 className="text-lg font-medium mb-3">Customer Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gray-500" />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Customer Phone Number"
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                />
                <button onClick={searchCustomer} className="p-2 bg-gray-100 rounded-md hover:bg-gray-200">
                  <Search className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer Name"
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="Main Branch">Main Branch</option>
                  <option value="City Center">City Center</option>
                  <option value="Suburb Store">Suburb Store</option>
                </select>
              </div>
              {customerPhone && customerName && (
                <button
                  onClick={saveCustomer}
                  className="w-full p-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
                >
                  {customerExists ? "Update Customer" : "Save Customer"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Customer verification modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Customer Verification</h3>
              <button onClick={() => setShowCustomerModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">Please enter customer information</p>

              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gray-500" />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  onBlur={searchCustomer}
                  placeholder="Customer Phone Number"
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                />
              </div>

              {isVerifyingCustomer && <p className="text-sm text-blue-600">Searching for customer...</p>}

              {customerExists ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-700">
                    Customer found: <span className="font-medium">{customerName}</span>
                  </p>
                  <p className="text-sm text-green-600">Phone: {customerPhone}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-700">Customer not found. Please add new customer.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Customer Name"
                      className="flex-1 p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {customerName && (
                    <button
                      onClick={saveCustomer}
                      className="w-full p-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
                    >
                      Save New Customer
                    </button>
                  )}
                </div>
              )}

              <div className="flex justify-between pt-4 border-t">
                <button
                  onClick={() => setShowCustomerModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => addToCart(selectedProduct)}
                  disabled={!customerPhone || (!customerExists && !customerName)}
                  className={`px-4 py-2 rounded-md text-white ${
                    customerPhone && (customerExists || customerName)
                      ? "bg-rose-600 hover:bg-rose-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {cart.length > 0 && (
        <div
          id="cart"
          className="max-w-[720px] w-[100%] h-[400px] border shadow-lg	 p-6 rounded-md overflow-y-auto overflow-x-auto"
        >
          <h3 className="text-xl font-semibold mb-2">Invoice</h3>
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4  text-left text-center text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  S.No
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Qty(kg)
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Amount(₹)
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Subtotal(₹)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cart.map((item, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap text-center py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    {index + 1}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{item.name}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <input
                      type="number"
                      step="0.01" // Allows decimal values like 2.5
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, Number.parseFloat(e.target.value) || 0)}
                      className="w-[60px] border rounded p-1 text-center"
                    />
                  </td>

                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <input
                        type="number"
                        step={0.01}
                        value={item.amount}
                        onChange={(e) => handleAmountChange(index, Number.parseFloat(e.target.value) || 0)}
                        className="w-[60px] border rounded p-1 text-center"
                      />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">₹ {item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="font-semibold border-t">
                <td colSpan="2" className="p-2 text-right">
                  Total Weight:
                </td>
                <td className="p-2 text-left">{totalQuantity} kgs</td>
                <td colSpan="1" className="p-2 text-right">
                  Amount:
                </td>
                <td className="p-2">₹ {subtotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4 w-[100%] flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeSgst}
                className="w-4 size-8"
                onChange={() => setIncludeSgst((prev) => !prev)}
              />
              <span className="text-sm"> Include SGST (2.5%):</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeCgst}
                className="w-4 size-8"
                onChange={() => setIncludeCgst((prev) => !prev)}
              />
              <span className="text-sm"> Include CGST (2.5%):</span>
            </label>
          </div>

          <div className="mt-4 flex flex-col items-end">
            <p className="text-lg font-semibold">Total: ₹ {calculateTotal().toFixed(2)}</p>
            <div className="mt-2 flex gap-4">
              <button
                onClick={handleClearCart}
                className="text-slate-600 hover:text-black border border-slate-600 px-4 py-2 rounded"
              >
                Clear Cart
              </button>
              <button onClick={handlePrint} className="hover:bg-rose-500 bg-rose-600 text-white px-4 py-2 rounded">
                Print Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}