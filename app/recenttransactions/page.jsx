'use client'

import { useState } from 'react';
import { fetchRecentTransactions } from '../dataupdate/actions';

export default function RecentTransactions() {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);

  const handleFetchRecentTransactions = async () => {
    const transactions = await fetchRecentTransactions();
    setRecentTransactions(transactions);
    setShowTransactions(true);
  };

  const handlePrintTransaction = (transaction) => {
    const printContent = `
      <html>
        <head>
          <title>Print Transaction</title>
        </head>
        <body>
          <h2>Transaction Details</h2>
          <p><strong>Transaction ID:</strong> ${transaction._id}</p>
          <p><strong>Total Bill:</strong> $${transaction.totalBill.toFixed(2)}</p>
          <p><strong>Date:</strong> ${new Date(transaction.createdAt).toLocaleString()}</p>
          <ul>
            ${transaction.items
              .map(
                (item) =>
                  `<li>${item.name} - Qty: ${item.quantity}, Subtotal: $${item.subtotal.toFixed(2)}</li>`
              )
              .join('')}
          </ul>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      <button
        onClick={handleFetchRecentTransactions}
        className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded"
      >
        View History
      </button>

      {showTransactions && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className="bg-white rounded shadow-lg p-6 w-full max-w-3xl h-[600px] overflow-y-auto"
            id="transactionsModalContent"
          >
            <div className='flex justify-between items-center'>
            <h2 className="text-3xl  font-semibold ">Recent History</h2>
            <button
                onClick={() => setShowTransactions(false)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
            <ul>
              {recentTransactions.map((transaction) => (
                <li key={transaction._id} className="border-b py-2">
                  <p>
                    <strong>Transaction ID:</strong> {transaction._id}
                  </p>
                  <p>
                    <strong>Total Bill:</strong> $
                    {transaction.totalBill.toFixed(2)}
                  </p>
                  <p>
                    <strong>Date:</strong>{' '}
                    {new Date(transaction.createdAt).toLocaleString()}
                  </p>
                  <ul>
                    {transaction.items.map((item, i) => (
                      <li key={i}>
                        {item.name} - Qty: {item.quantity}, Subtotal: $
                        {item.subtotal.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handlePrintTransaction(transaction)}
                    className="bg-slate-500 hover:bg-black text-white px-2 py-1 mt-2 rounded"
                  >
                    Print Bill
                  </button>
                </li>
              ))}
            </ul>
            {/* <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowTransactions(false)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
}
