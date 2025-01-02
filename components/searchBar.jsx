"use client";

import { useState, useEffect } from "react";
import {
  searchProducts,
  submitCartToDatabase,
} from "../app/dataupdate/actions";
import { Pencil } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [sgst, setSgst] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [includeSgst, setIncludeSgst] = useState(false);
  const [includeCgst, setIncludeCgst] = useState(false);

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

  const addToCart = (product) => {
    setCart((prevCart) => [
      ...prevCart,
      { ...product, quantity: 0, amount: product.price, subtotal: 0 },
    ]);
    setResults([]);
    setQuery("");
  };

  const handlePrint = async () => {
    try {
      // Calculate subtotal, SGST, CGST, and total
      const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
      const sgstAmount = includeSgst ? (subtotal * 2.5) / 100 : 0;
      const cgstAmount = includeCgst ? (subtotal * 2.5) / 100 : 0;
      const total = subtotal + sgstAmount + cgstAmount;

      // Submit cart data to the database (optional)
      const result = await submitCartToDatabase(cart, sgstAmount, cgstAmount);
      if (result.success) {
        console.log(
          "Cart data submitted successfully. Transaction ID:",
          result.transactionId
        );
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
            </style>
          </head>
          <body>
            <h2 style="text-align: center;">Desu Provisions</h2>
            ${
              includeSgst || includeCgst
                ? `<p style="text-align: center;">GSTIN - 37BCNPA9844A1ZM</p>`
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
<td style="max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
  ${item.name}
</td>                    <td>${item.quantity}</td>
                    <td>$${item.amount.toFixed(2)}</td>
                    <td>$${item.subtotal.toFixed(2)}</td>
                  </tr>`
                  )
                  .join("")}
                <tr class="total-row">
                  <td colspan="4" class="text-right">Subtotal</td>
                  <td>$${subtotal.toFixed(2)}</td>
                </tr>
                ${
                  includeSgst
                    ? `<tr>
                    <td colspan="4" class="text-right">SGST (2.5%)</td>
                    <td>$${sgstAmount.toFixed(2)}</td>
                  </tr>`
                    : ""
                }
                ${
                  includeCgst
                    ? `<tr>
                    <td colspan="4" class="text-right">CGST (2.5%)</td>
                    <td>$${cgstAmount.toFixed(2)}</td>
                  </tr>`
                    : ""
                }
                <tr class="total-row">
                  <td colspan="4" class="text-right">Total</td>
                  <td>$${total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
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
            quantity: value,
            subtotal: value * item.amount,
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
            subtotal: item.quantity * parseFloat(value || 0),
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
      <div className=" w-full max-w-[400px] flex flex-row justify-between items-start">
        <div className="relative w-[100%] max-w-[400px]">
          <p className="text-sm md:text-lg text-slate-700 my-4 md:my-6">
            Search your products...
          </p>
          <form
            onSubmit={handleSearch}
            className="relative w-full max-w-[400px]"
          >
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search for groceries..."
              className="relative w-full p-2 pr-10 text-rose-600 border border-rose-400 rounded-md appearance-none focus:outline-none"
            />
            <button type="submit" className="absolute top-3 right-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>
          {results.length > 0 && (
            <ul className="absolute w-[100%] max-h-[400px] overflow-y-auto bg-white border border-gray-300 rounded-md">
              {results.map((product) => (
                <li
                  key={product._id}
                  onClick={() => addToCart(product)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {product.name} - ${product.price}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
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
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Qty
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cart.map((item, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap text-center py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                    {index + 1}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {item.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          index,
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-[60px] border rounded p-1 text-center"
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <input
                        type="number"
                        step={0.01}
                        value={item.amount}
                        onChange={(e) =>
                          handleAmountChange(
                            index,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-[60px] border rounded p-1 text-center"
                      />
                      <button
                        className="ml-2 text-blue-500 hover:text-blue-700"
                        onClick={() => handleAmountChange(index, item.price)}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    ${item.subtotal.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="font-semibold border-t">
                <td colSpan="2" className="p-2 text-right">
                  Total Quantity:
                </td>
                <td className="p-2 text-center">{totalQuantity}</td>
                <td colSpan="1" className="p-2 text-right">
                  Amount:
                </td>
                <td className="p-2">$ {subtotal}</td>
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
            <p className="text-lg font-semibold">
              Total: ${calculateTotal().toFixed(2)}
            </p>
            <div className="mt-2 flex gap-4">
              <button
                onClick={handleClearCart}
                className="text-slate-600 hover:text-black border border-slate-600 px-4 py-2 rounded"
              >
                Clear Cart
              </button>
              <button
                onClick={handlePrint}
                className="hover:bg-rose-500 bg-rose-600 text-white px-4 py-2 rounded"
              >
                Print Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
