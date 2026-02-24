const fs = require('fs');
const path = './components/searchBar.jsx';
let content = fs.readFileSync(path, 'utf8');

const newLayout = `  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full min-h-[500px] h-auto lg:h-[calc(100vh-220px)] mt-2">
      
      {/* LEFT COLUMN: Product Search & Cart Table (approx 70%) */}
      <div className="flex-1 flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden relative z-10">
        
        {/* Top Search Bar for Products */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex-none relative z-20">
            <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">Add Product to Bill</p>
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                ref={searchInputRef}
                placeholder="Scan barcode or search for groceries..."
                className="w-full p-4 pl-12 text-lg border border-rose-200 rounded-lg shadow-inner focus:ring-2 focus:ring-rose-400 focus:outline-none transition-all bg-white font-medium text-gray-800"
              />
              <Search className="absolute top-4 left-4 h-6 w-6 text-rose-400" />
            </form>
            {results.length > 0 && (
              <ul className="absolute left-4 right-4 mt-2 max-h-[300px] overflow-y-auto bg-white border border-gray-200 shadow-xl rounded-lg z-50">
                {results.map((product) => (
                  <li
                    key={product._id}
                    onClick={() => handleProductSelect(product)}
                    className="p-4 hover:bg-rose-50 cursor-pointer border-b last:border-0 font-medium text-gray-700 flex justify-between items-center transition-colors"
                  >
                    <span className="text-lg">{product.name}</span>
                    <span className="text-rose-600 font-bold bg-rose-50 px-3 py-1 rounded-full text-lg">₹ {product.price}</span>
                  </li>
                ))}
              </ul>
            )}
        </div>

        {/* Invoice Table Container (Always visible, scrollable body) */}
        <div className="flex-1 overflow-auto bg-white">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-[#e42529] sticky top-0 z-10 shadow-sm">
              <tr>
                <th scope="col" className="w-[8%] py-3.5 px-4 text-left text-xs font-bold text-white uppercase tracking-wider">S.No</th>
                <th scope="col" className="w-[35%] py-3.5 px-4 text-left text-xs font-bold text-white uppercase tracking-wider">Product Description</th>
                <th scope="col" className="w-[22%] py-3.5 px-4 text-left text-xs font-bold text-white uppercase tracking-wider">Quantity</th>
                <th scope="col" className="w-[15%] py-3.5 px-4 text-center text-xs font-bold text-white uppercase tracking-wider">Rate (₹)</th>
                <th scope="col" className="w-[20%] py-3.5 px-4 text-right text-xs font-bold text-white uppercase tracking-wider">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {cart.length === 0 ? (
                 <tr>
                    <td colSpan="5" className="py-24 text-center text-gray-400">
                       <div className="flex flex-col items-center">
                          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                             <Search className="h-10 w-10 text-gray-300" />
                          </div>
                          <p className="text-xl font-bold text-gray-500">Cart is Empty</p>
                          <p className="text-md mt-2">Search and select items to begin billing.</p>
                       </div>
                    </td>
                 </tr>
              ) : (
                cart.map((item, index) => (
                  <tr key={index} className="hover:bg-rose-50/40 transition-colors group">
                     <td className="px-4 py-3 text-sm font-bold text-gray-400">{index + 1}</td>
                     <td className="px-4 py-3 text-sm text-gray-800 font-bold truncate text-base">{item.name}</td>
                     <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-md border border-gray-200">
                          <input type="number" step="0.01" value={item.quantity} onChange={(e) => handleQuantityChange(index, Number.parseFloat(e.target.value) || 0)} className="w-[70px] bg-transparent border-none text-center focus:ring-0 font-bold text-base text-gray-800" />
                          <div className="w-px h-6 bg-gray-300 mx-1"></div>
                          <select value={item.unit || "kg"} onChange={(e) => handleUnitChange(index, e.target.value)} className="bg-transparent border-none text-sm font-bold text-gray-600 focus:ring-0 cursor-pointer pr-4">
                            <option value="kg">kg</option>
                            <option value="grams">g</option>
                            <option value="pcs">pcs</option>
                          </select>
                        </div>
                     </td>
                     <td className="px-4 py-3 text-sm text-center">
                        <input type="number" step="0.01" value={item.amount} onChange={(e) => handleAmountChange(index, Number.parseFloat(e.target.value) || 0)} className="w-[80px] border border-gray-300 rounded-md p-1.5 text-center focus:ring-1 focus:ring-rose-500 font-bold text-base text-gray-700 bg-gray-50 mx-auto" />
                     </td>
                     <td className="px-4 py-3 text-base font-black text-right text-gray-900 pr-6">₹ {(item.subtotal || 0).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT COLUMN: Customer & Summary (approx 30%) */}
      <div className="w-full lg:w-[420px] flex-none flex flex-col gap-6 z-10 h-full">
        
        {/* Customer Details Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 relative flex-none">
           <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
              <div className="p-2 bg-rose-50 rounded-lg">
                <User className="h-6 w-6 text-[#e42529]" />
              </div>
              <h3 className="text-xl font-black text-gray-800 tracking-tight">Customer Details</h3>
           </div>
           
           <div className="space-y-5">
            <div className="relative">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Mobile Number</label>
              <div className="relative flex items-center group">
                <Phone className="absolute left-3.5 h-5 w-5 text-gray-400 group-focus-within:text-[#e42529] transition-colors" />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={handleCustomerPhoneChange}
                  onBlur={() => setTimeout(() => setCustomerSuggestions([]), 200)}
                  placeholder="Enter 10-digit number"
                  className="w-full p-3 pl-11 text-lg border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#e42529] focus:border-[#e42529] font-bold text-gray-800 transition-all"
                />
                <button onClick={searchCustomer} className="absolute right-2 p-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors group-hover:opacity-100">
                  <Search className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              {customerSuggestions.length > 0 && (
                <ul className="absolute left-0 right-0 top-full mt-2 z-[100] bg-white border border-gray-200 rounded-xl shadow-2xl max-h-56 overflow-y-auto w-full">
                  {customerSuggestions.map((c) => (
                    <li key={c._id} onClick={() => handleSelectCustomer(c)} className="p-4 hover:bg-rose-50 cursor-pointer border-b border-gray-100 last:border-0 flex justify-between items-center transition-colors">
                      <span className="font-extrabold text-gray-800 text-lg">{c.phone}</span>
                      <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-md">{c.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Customer Name</label>
              <div className="relative group">
                 <User className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-[#e42529] transition-colors" />
                 <input
                   type="text"
                   value={customerName}
                   onChange={(e) => setCustomerName(e.target.value)}
                   placeholder="Enter Name"
                   className="w-full p-3 pl-11 text-lg border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#e42529] focus:border-[#e42529] font-bold text-gray-800 transition-all"
                 />
              </div>
            </div>

            {customerPhone && customerName && (
              <div className="flex gap-3 pt-3">
                <button onClick={saveCustomer} className="flex-1 py-3 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition-all shadow-md active:scale-95 text-sm uppercase tracking-wider">
                  {customerExists ? "Update" : "Save"}
                </button>
                {customerExists && (
                  <button onClick={handleViewHistory} className="flex-1 py-3 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900 transition-all shadow-md active:scale-95 text-sm uppercase tracking-wider">
                    View History
                  </button>
                )}
              </div>
            )}
           </div>
        </div>

        {/* Billing Summary Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col overflow-hidden relative flex-1">
           <div className="p-6 flex-1 overflow-y-auto">
              <div>
                <h3 className="text-xl font-black text-gray-800 mb-5 pb-4 border-b border-gray-100 tracking-tight flex items-center gap-2">
                   💳 Bill Summary
                </h3>
                
                <div className="space-y-4 mb-6">
                   <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <span className="text-gray-600 font-bold uppercase text-xs tracking-wider">Total Items</span>
                      <span className="text-gray-900 font-black text-xl">{totalQuantity} <span className="text-sm text-gray-500 font-bold lowercase">qty</span></span>
                   </div>
                   <div className="flex justify-between items-center px-2 py-1">
                      <span className="text-gray-500 font-bold uppercase text-xs tracking-wider">Subtotal</span>
                      <span className="text-gray-900 font-black text-lg">₹ {subtotal.toFixed(2)}</span>
                   </div>
                   
                   <div className="mt-4 border-t border-dashed border-gray-200 pt-4 space-y-3">
                     <div className="flex items-center justify-between px-2 hover:bg-rose-50 p-2 rounded-lg transition-colors cursor-pointer" onClick={() => setIncludeSgst(!includeSgst)}>
                        <div className="flex items-center gap-3 pointer-events-none">
                          <input type="checkbox" checked={includeSgst} readOnly className="w-5 h-5 rounded text-[#e42529] border-gray-300 focus:ring-[#e42529]" />
                          <span className="text-sm font-bold text-gray-800">Add SGST <span className="text-gray-400">(2.5%)</span></span>
                        </div>
                        <span className="font-extrabold text-gray-700">₹ {includeSgst ? ((subtotal * 2.5) / 100).toFixed(2) : '0.00'}</span>
                     </div>
                     <div className="flex items-center justify-between px-2 hover:bg-rose-50 p-2 rounded-lg transition-colors cursor-pointer" onClick={() => setIncludeCgst(!includeCgst)}>
                        <div className="flex items-center gap-3 pointer-events-none">
                          <input type="checkbox" checked={includeCgst} readOnly className="w-5 h-5 rounded text-[#e42529] border-gray-300 focus:ring-[#e42529]" />
                          <span className="text-sm font-bold text-gray-800">Add CGST <span className="text-gray-400">(2.5%)</span></span>
                        </div>
                        <span className="font-extrabold text-gray-700">₹ {includeCgst ? ((subtotal * 2.5) / 100).toFixed(2) : '0.00'}</span>
                     </div>
                   </div>
                </div>
              </div>
           </div>
           
           {/* Grand Total & Action Buttons (sticky bottom of summary) */}
           <div className="bg-gray-50 border-t border-gray-200 p-6 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
               <div className="bg-white border-2 border-[#e42529] rounded-xl p-5 flex justify-between items-center mb-5 shadow-sm transform transition-transform hover:scale-[1.02]">
                   <span className="text-sm font-black text-gray-500 uppercase tracking-widest">Grand Total</span>
                   <span className="text-4xl font-black text-[#e42529] tracking-tight">₹ {(calculateTotal() || 0).toFixed(2)}</span>
               </div>

               <div className="grid grid-cols-2 gap-3 pb-2">
                 <button onClick={handleClearCart} className="col-span-2 py-3.5 bg-white border border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-100 hover:text-[#e42529] transition-all flex justify-center items-center gap-2 shadow-sm uppercase tracking-wide text-xs">
                    <X className="h-4 w-4" /> Clear Entire Bill
                 </button>
                 <button onClick={() => handlePrint('english')} disabled={cart.length === 0} className="py-4 bg-slate-800 text-white rounded-xl font-black hover:bg-slate-900 transition-all shadow-md active:scale-95 text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide flex flex-col justify-center items-center gap-1">
                   <span>Print Bill</span>
                   <span className="text-[10px] text-gray-400 font-semibold">(English)</span>
                 </button>
                 <button onClick={() => handlePrint('telugu')} disabled={cart.length === 0} className="py-4 bg-[#e42529] text-white rounded-xl font-black hover:bg-rose-700 transition-all shadow-md active:scale-95 text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide flex flex-col justify-center items-center gap-1">
                   <span>Print Bill</span>
                   <span className="text-[10px] text-rose-200 font-semibold">(Telugu)</span>
                 </button>
               </div>
           </div>
        </div>
      </div>

      {/* Customer Verification Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200]">
          <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 max-w-md w-full border-t-[6px] border-[#e42529] transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gray-800 tracking-tight">Setup Customer</h3>
              <button onClick={() => setShowCustomerModal(false)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-rose-50 text-rose-800 p-4 rounded-xl border border-rose-100 text-sm font-medium flex items-start gap-3">
                 <div className="p-1 bg-white rounded-full mt-0.5"><Phone className="h-4 w-4 text-rose-500" /></div>
                 Please quickly establish a customer record for this bill. New users will be automatically saved!
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Mobile Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-3.5 h-6 w-6 text-gray-400 group-focus-within:text-[#e42529] transition-colors" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    onBlur={searchCustomer}
                    placeholder="Enter phone number"
                    autoFocus
                    className="w-full p-4 pl-14 text-xl border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-[#e42529] font-bold text-gray-800 transition-all"
                  />
                </div>
              </div>

              {isVerifyingCustomer && (
                 <div className="flex items-center gap-3 text-blue-600 font-bold bg-blue-50 p-3 rounded-lg border border-blue-100">
                   <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                   Checking records...
                 </div>
              )}

              {customerExists ? (
                <div className="p-5 bg-emerald-50 border-2 border-emerald-200 rounded-xl flex items-center gap-4 shadow-inner">
                  <div className="p-3 bg-white rounded-full text-emerald-600 shadow-sm"><User className="h-8 w-8" /></div>
                  <div>
                    <p className="text-emerald-900 font-black text-xl">{customerName}</p>
                    <p className="text-sm text-emerald-600 font-bold uppercase tracking-wider mt-1">Verified Member</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm font-bold flex gap-2">
                    <span>New customer! Enter name to register.</span>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Customer Name</label>
                     <div className="relative group">
                       <User className="absolute left-4 top-3.5 h-6 w-6 text-gray-400 group-focus-within:text-[#e42529] transition-colors" />
                       <input
                         type="text"
                         value={customerName}
                         onChange={(e) => setCustomerName(e.target.value)}
                         placeholder="Enter full name"
                         className="w-full p-4 pl-14 text-xl border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-[#e42529] font-bold text-gray-800 transition-all"
                       />
                     </div>
                  </div>

                  {customerName && (
                    <button onClick={saveCustomer} className="w-full py-4 mt-2 bg-emerald-500 text-white rounded-xl font-black text-lg hover:bg-emerald-600 transition shadow-lg active:scale-95 uppercase tracking-wide">
                      Register Customer
                    </button>
                  )}
                </div>
              )}

              <div className="flex gap-4 pt-6 border-t border-gray-100 mt-4">
                <button onClick={() => setShowCustomerModal(false)} className="flex-1 py-3.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 hover:text-gray-900 transition uppercase tracking-wide text-sm">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    addToCart(selectedProduct)
                    setTimeout(() => searchInputRef.current?.focus(), 100)
                  }}
                  disabled={!customerPhone || (!customerExists && !customerName)}
                  className={\`flex-[2] py-3.5 rounded-xl font-black text-white transition shadow-lg uppercase tracking-wide text-sm \${customerPhone && (customerExists || customerName) ? "bg-[#e42529] hover:bg-rose-700 hover:shadow-xl active:scale-95" : "bg-gray-300 cursor-not-allowed opacity-70"}\`}
                >
                  Continue to Bill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[200]">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col m-4 border border-gray-200">
            <div className="px-8 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center gap-4">
                 <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100"><User className="h-8 w-8 text-blue-600" /></div>
                 <div>
                   <h3 className="text-2xl font-black text-gray-800 tracking-tight">Purchase History</h3>
                   <p className="text-sm font-bold mt-1 text-gray-500">Customer: <span className="text-blue-600 uppercase tracking-widest mx-1">{customerName}</span> | <span className="tracking-widest ml-1">{customerPhone}</span></p>
                 </div>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="p-3 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all shadow-sm">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
              {isLoadingHistory ? (
                <div className="flex justify-center items-center h-64">
                   <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
                </div>
              ) : customerHistory.length > 0 ? (
                <div className="space-y-8">
                  {customerHistory.map((tx, idx) => (
                    <div key={tx._id} className="bg-white border hover:border-blue-200 transition-colors border-gray-200 rounded-2xl shadow-sm overflow-hidden group">
                      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex flex-wrap justify-between items-center">
                        <div className="flex items-center gap-4">
                          <span className="bg-white border border-gray-200 text-gray-500 px-3 py-1 rounded-lg font-bold text-sm shadow-sm">#{customerHistory.length - idx}</span>
                          <span className="font-bold text-gray-700 text-sm tracking-wide">
                            <span className="mr-2">📅 {new Date(tx.createdAt).toLocaleDateString()}</span>
                            <span className="text-gray-400">|</span>
                            <span className="ml-2">🕒 {new Date(tx.createdAt).toLocaleTimeString()}</span>
                          </span>
                        </div>
                        <span className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-1.5 rounded-lg font-black text-lg shadow-sm">₹ {tx.totalBill?.toFixed(2)}</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="text-gray-500 bg-white border-b border-gray-100 text-xs uppercase tracking-wider">
                            <tr>
                              <th className="px-6 py-4 font-bold">Product Description</th>
                              <th className="px-6 py-4 font-bold text-center">Unit/Wt</th>
                              <th className="px-6 py-4 font-bold text-right">M.R.P</th>
                              <th className="px-6 py-4 font-bold text-right">Value</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {tx.items?.map((item, idxx) => (
                              <tr key={idxx} className="hover:bg-blue-50/30 transition-colors">
                                <td className="px-6 py-3.5 font-bold text-gray-800 text-base">{item.name}</td>
                                <td className="px-6 py-3.5 text-center font-semibold text-gray-600 border-x border-gray-50">{item.quantity} <span className="text-xs text-gray-400 font-bold ml-1 uppercase">{item.unit || 'kg'}</span></td>
                                <td className="px-6 py-3.5 text-right font-bold text-gray-600 border-r border-gray-50">₹{item.amount?.toFixed(2)}</td>
                                <td className="px-6 py-3.5 font-black text-gray-900 text-right text-base text-blue-900">₹{item.subtotal?.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
                   <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                      <span className="text-5xl">🛒</span>
                   </div>
                   <h4 className="text-2xl font-black text-gray-800 mb-2">No Previous Visits</h4>
                   <p className="text-gray-500 font-medium text-lg">This customer hasn't completed any transactions yet.</p>
                </div>
              )}
            </div>
            <div className="px-8 py-5 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-8 py-3.5 bg-gray-800 text-white font-black text-sm uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-md active:scale-95"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
`
