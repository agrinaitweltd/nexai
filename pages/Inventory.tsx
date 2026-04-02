import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { InventoryItem, Client } from '../types';
import { Search, PlusCircle, Truck, DollarSign, Hash, User, Settings2, Trash2, MapPin, AlertTriangle, Check, X, ChevronRight } from 'lucide-react';

export default function Inventory() {
  const { inventory, addToInventory, bulkUpdateInventory, deleteInventoryItems, user, clients, financeAccounts } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Bulk actions UI
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkLocation, setBulkLocation] = useState('');
  const [bulkThreshold, setBulkThreshold] = useState<number | ''>('');

  // Stock In Form
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    unit: user?.sector === 'EXPORT' ? 'tonnes' : 'kg'
  });
  
  // Expense Tracking
  const [isExpense, setIsExpense] = useState(false);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [costAmount, setCostAmount] = useState<number>(0);
  const [paymentAccountId, setPaymentAccountId] = useState<string>('');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [referenceNum, setReferenceNum] = useState<string>('');

  const filteredInventory = inventory.filter(item => 
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Define suppliers by filtering clients by type 'SUPPLIER'
  const suppliers = clients.filter(c => c.type === 'SUPPLIER');

  useEffect(() => {
    if (unitPrice && newItem.quantity) {
        setCostAmount(unitPrice * newItem.quantity);
    }
  }, [unitPrice, newItem.quantity]);

  const handleStockIn = () => {
    if (newItem.productName && newItem.quantity) {
        const supplier = clients.find(c => c.id === selectedSupplierId);
        
        addToInventory({
            ...newItem,
            id: crypto.randomUUID(),
            lastUpdated: new Date().toISOString(),
            location: newItem.location || 'Main Warehouse',
            costPerUnit: unitPrice > 0 ? unitPrice : undefined
        } as InventoryItem, isExpense ? { 
            cost: costAmount, 
            method: paymentAccountId ? (financeAccounts?.find(a => a.id === paymentAccountId)?.name || 'Account') : 'BANK_TRANSFER', 
            accountId: paymentAccountId || undefined,
            supplierName: supplier?.name, 
            reference: referenceNum 
        } : undefined);
        
        setShowModal(false);
        setNewItem({ unit: user?.sector === 'EXPORT' ? 'tonnes' : 'kg' });
        setIsExpense(false);
        setCostAmount(0);
        setUnitPrice(0);
        setSelectedSupplierId('');
        setReferenceNum('');
        setPaymentAccountId('');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredInventory.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredInventory.map(i => i.id)));
    }
  };

  const toggleSelectItem = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkUpdateLocation = () => {
    if (bulkLocation) {
      bulkUpdateInventory(Array.from(selectedIds), { location: bulkLocation });
      setBulkLocation('');
      setSelectedIds(new Set());
      setShowBulkActions(false);
    }
  };

  const handleBulkSetLowStock = () => {
    if (bulkThreshold !== '') {
      bulkUpdateInventory(Array.from(selectedIds), { lowStockThreshold: Number(bulkThreshold) });
      setBulkThreshold('');
      setSelectedIds(new Set());
      setShowBulkActions(false);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.size} items?`)) {
      deleteInventoryItems(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const PRODUCT_CATALOG: Record<string, string[]> = {
    'Fruits': ['Mangoes', 'Avocado', 'Bananas', 'Pineapples', 'Passion Fruit', 'Papaya', 'Oranges', 'Lemons', 'Limes', 'Watermelon', 'Grapes', 'Apples', 'Strawberries', 'Blueberries', 'Jackfruit', 'Guava', 'Dragon Fruit', 'Coconut', 'Pomegranate', 'Lychee'],
    'Vegetables': ['Tomatoes', 'Onions', 'Cabbage', 'Carrots', 'Spinach', 'Kale', 'Broccoli', 'Green Peppers', 'Chili Peppers', 'Eggplant', 'Cucumber', 'Lettuce', 'Garlic', 'Ginger', 'Sweet Potatoes', 'Irish Potatoes', 'Cauliflower', 'Pumpkin', 'Okra', 'Beetroot'],
    'Lentils & Pulses': ['Red Lentils', 'Green Lentils', 'Brown Lentils', 'Black Lentils', 'Chickpeas', 'Pigeon Peas', 'Cowpeas', 'Mung Beans', 'Black-eyed Peas', 'Split Peas'],
    'Grains & Cereals': ['Maize', 'Rice', 'Wheat', 'Sorghum', 'Millet', 'Barley', 'Oats', 'Quinoa', 'Teff', 'Amaranth'],
    'Coffee & Tea': ['Arabica Coffee', 'Robusta Coffee', 'Green Tea', 'Black Tea', 'White Tea', 'Herbal Tea'],
    'Nuts & Seeds': ['Macadamia', 'Cashew Nuts', 'Groundnuts', 'Sesame Seeds', 'Sunflower Seeds', 'Chia Seeds', 'Flax Seeds', 'Shea Nuts', 'Almonds', 'Walnuts'],
    'Spices & Herbs': ['Vanilla', 'Cardamom', 'Cinnamon', 'Turmeric', 'Cloves', 'Black Pepper', 'Coriander', 'Cumin', 'Rosemary', 'Basil'],
    'Farm Inputs': ['Fertilizer (NPK)', 'Fertilizer (Urea)', 'Organic Compost', 'Pesticides', 'Herbicides', 'Seeds (Hybrid)', 'Seeds (Open Pollinated)', 'Animal Feed', 'Veterinary Drugs'],
  };

  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const getProductOptions = () => {
    if (selectedCategory && PRODUCT_CATALOG[selectedCategory]) {
      return PRODUCT_CATALOG[selectedCategory];
    }
    return Object.values(PRODUCT_CATALOG).flat();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Inventory Management</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Track stock levels and perform bulk warehouse operations.</p>
        </div>
        <div className="flex space-x-3">
            <button 
                onClick={() => setShowModal(true)}
                className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary-500/20 active:scale-95"
            >
                <PlusCircle size={18} />
                <span>Restock Inventory</span>
            </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
          <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-4 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-center space-x-4">
                  <span className="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">{selectedIds.size}</span>
                  <p className="font-bold text-sm">Items Selected</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                  <div className="flex bg-white/10 dark:bg-slate-100 rounded-xl overflow-hidden border border-white/10">
                      <input 
                        type="text" 
                        placeholder="New Location..." 
                        className="bg-transparent px-4 py-2 text-xs outline-none w-32 placeholder:text-slate-400"
                        value={bulkLocation}
                        onChange={e => setBulkLocation(e.target.value)}
                      />
                      <button 
                        onClick={handleBulkUpdateLocation}
                        className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold hover:bg-emerald-700 transition-colors"
                      >
                        Update Location
                      </button>
                  </div>
                  <div className="flex bg-white/10 dark:bg-slate-100 rounded-xl overflow-hidden border border-white/10">
                      <input 
                        type="number" 
                        placeholder="Min Threshold..." 
                        className="bg-transparent px-4 py-2 text-xs outline-none w-32 placeholder:text-slate-400"
                        value={bulkThreshold}
                        onChange={e => setBulkThreshold(e.target.value === '' ? '' : Number(e.target.value))}
                      />
                      <button 
                        onClick={handleBulkSetLowStock}
                        className="bg-amber-500 text-white px-4 py-2 text-xs font-bold hover:bg-amber-600 transition-colors"
                      >
                        Set Low Stock
                      </button>
                  </div>
                  <button 
                    onClick={handleBulkDelete}
                    className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                    title="Delete Selected"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button 
                    onClick={() => setSelectedIds(new Set())}
                    className="p-2 text-slate-400 hover:text-white dark:hover:text-slate-900"
                  >
                    <X size={18} />
                  </button>
              </div>
          </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center space-x-4 transition-colors">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text" 
                placeholder="Search products, grades..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
        <select className="border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg px-4 py-2 text-slate-600 outline-none focus:border-primary-500 transition-colors">
            <option>All Locations</option>
            <option>Main Warehouse</option>
            <option>Cold Storage</option>
            <option>Farm Storage</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                        <th className="px-6 py-4 w-10">
                            <input 
                              type="checkbox" 
                              className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" 
                              checked={filteredInventory.length > 0 && selectedIds.size === filteredInventory.length}
                              onChange={toggleSelectAll}
                            />
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Product Name</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Grade/Variety</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredInventory.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                <div className="flex flex-col items-center">
                                    <Truck size={40} className="mb-2 opacity-20" />
                                    <p>No stock items found. Add some stock to get started.</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        filteredInventory.map(item => {
                            const isLow = item.quantity < (item.lowStockThreshold || 500);
                            return (
                                <tr key={item.id} className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${selectedIds.has(item.id) ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                                    <td className="px-6 py-4">
                                        <input 
                                          type="checkbox" 
                                          className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" 
                                          checked={selectedIds.has(item.id)}
                                          onChange={() => toggleSelectItem(item.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                                        {item.productName}
                                        {item.lowStockThreshold && (
                                            <p className="text-[9px] text-slate-400 uppercase font-medium mt-0.5">Threshold: {item.lowStockThreshold} {item.unit}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded text-[10px] font-bold border border-slate-200 dark:border-slate-600 uppercase tracking-wider">
                                            {item.grade}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-bold ${isLow ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                            {item.quantity.toLocaleString()} {item.unit}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {isLow ? (
                                            <div className="flex items-center text-red-500 font-bold text-[10px] uppercase tracking-widest bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full w-fit">
                                                <AlertTriangle size={10} className="mr-1" /> Low Stock
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-emerald-500 font-bold text-[10px] uppercase tracking-widest bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full w-fit">
                                                <Check size={10} className="mr-1" /> Healthy
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm">
                                        <div className="flex items-center">
                                            <MapPin size={12} className="mr-1 text-slate-400" />
                                            {item.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 text-xs font-bold uppercase tracking-widest">Details</button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Stock In Modal - Mission Builder Style */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3 md:p-6 backdrop-blur-md overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-[2rem] w-full max-w-4xl shadow-2xl border border-white/5 my-auto flex flex-col max-h-[95vh]">
                {/* Header */}
                <div className="p-5 md:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Stock Acquisition Builder</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-xs md:text-sm mt-1">Record incoming stock and link it to your finance ledger.</p>
                    </div>
                    <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:rotate-90 transition-all shadow-sm shrink-0"><X size={20}/></button>
                </div>

                <div className="p-5 md:p-8 space-y-6 overflow-y-auto scrollbar-thin">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                        {/* LEFT: Product + Stock */}
                        <div className="space-y-6">
                            <section className="space-y-4">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center border-b dark:border-slate-800 pb-2">
                                    <Truck size={13} className="mr-2 text-blue-500" /> Product Allocation
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Category</label>
                                        <select
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white shadow-inner text-sm"
                                            value={selectedCategory}
                                            onChange={e => { setSelectedCategory(e.target.value); setNewItem({...newItem, productName: ''}); }}
                                        >
                                            <option value="">All Categories</option>
                                            {Object.keys(PRODUCT_CATALOG).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Product</label>
                                        <select
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white shadow-inner text-sm"
                                            value={newItem.productName || ''}
                                            onChange={e => setNewItem({...newItem, productName: e.target.value})}
                                        >
                                            <option value="">Select Product</option>
                                            {getProductOptions().map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Grade / Quality</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white shadow-inner text-sm"
                                        placeholder="e.g. Premium Grade A"
                                        value={newItem.grade || ''}
                                        onChange={e => setNewItem({...newItem, grade: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Quantity</label>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white shadow-inner"
                                            placeholder="0.00"
                                            value={newItem.quantity || ''}
                                            onChange={e => setNewItem({...newItem, quantity: parseFloat(e.target.value) || 0})}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Unit</label>
                                        <select
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white shadow-inner text-sm"
                                            value={newItem.unit || 'kg'}
                                            onChange={e => setNewItem({...newItem, unit: e.target.value as any})}
                                        >
                                            <option value="kg">kg</option>
                                            <option value="tonnes">tonnes</option>
                                            <option value="bags">bags</option>
                                            <option value="liters">liters</option>
                                            <option value="pieces">pieces</option>
                                            <option value="heads">heads</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Storage Location</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white shadow-inner text-sm"
                                        placeholder="e.g. Main Warehouse, Cold Store"
                                        value={newItem.location || ''}
                                        onChange={e => setNewItem({...newItem, location: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Low Stock Alert Threshold</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white shadow-inner text-sm"
                                        placeholder="e.g. 100"
                                        value={newItem.lowStockThreshold || ''}
                                        onChange={e => setNewItem({...newItem, lowStockThreshold: parseFloat(e.target.value) || undefined})}
                                    />
                                </div>
                            </section>
                        </div>

                        {/* RIGHT: Supplier + Finance */}
                        <div className="space-y-6">
                            <section className="space-y-4">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center border-b dark:border-slate-800 pb-2">
                                    <User size={13} className="mr-2 text-emerald-500" /> Supplier Details
                                </h3>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Supplier</label>
                                    <select
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/20 font-bold dark:text-white shadow-inner text-sm"
                                        value={selectedSupplierId}
                                        onChange={e => setSelectedSupplierId(e.target.value)}
                                    >
                                        <option value="">-- Choose Supplier (optional) --</option>
                                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Invoice / Reference #</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/20 font-bold dark:text-white shadow-inner text-sm"
                                        placeholder="INV-XXXX"
                                        value={referenceNum}
                                        onChange={e => setReferenceNum(e.target.value)}
                                    />
                                </div>
                            </section>

                            <section className="space-y-4">
                                <div className="flex items-center justify-between border-b dark:border-slate-800 pb-2">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
                                        <DollarSign size={13} className="mr-2 text-amber-500" /> Finance Linkage
                                    </h3>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={isExpense} onChange={e => setIsExpense(e.target.checked)} className="sr-only peer" />
                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                                        <span className="ml-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">Record Expense</span>
                                    </label>
                                </div>

                                {isExpense && (
                                    <div className="space-y-4 animate-in fade-in duration-300">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Unit Price</label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 rounded-xl outline-none focus:ring-4 focus:ring-amber-500/20 font-bold dark:text-white shadow-inner text-sm"
                                                    placeholder="0.00"
                                                    value={unitPrice || ''}
                                                    onChange={e => setUnitPrice(parseFloat(e.target.value) || 0)}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Total Cost</label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 rounded-xl outline-none focus:ring-4 focus:ring-amber-500/20 font-black text-emerald-600 shadow-inner text-sm"
                                                    value={costAmount || ''}
                                                    readOnly={unitPrice > 0}
                                                    onChange={e => setCostAmount(parseFloat(e.target.value) || 0)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Debit Account</label>
                                            <select
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 rounded-xl outline-none focus:ring-4 focus:ring-amber-500/20 font-bold dark:text-white shadow-inner text-sm"
                                                value={paymentAccountId}
                                                onChange={e => setPaymentAccountId(e.target.value)}
                                            >
                                                <option value="">-- Select Account (optional) --</option>
                                                {(financeAccounts || []).map(a => (
                                                    <option key={a.id} value={a.id}>{a.provider} ({a.currency || user?.preferredCurrency}) {a.balance.toLocaleString()}</option>
                                                ))}
                                            </select>
                                            {paymentAccountId && (() => {
                                                const acc = financeAccounts?.find(a => a.id === paymentAccountId);
                                                if (!acc) return null;
                                                const shortfall = costAmount - acc.balance;
                                                return shortfall > 0 ? (
                                                    <p className="text-[10px] text-red-500 font-bold mt-1 px-2 flex items-center"><AlertTriangle size={10} className="mr-1" /> Shortfall: {(acc.currency || user?.preferredCurrency)} {shortfall.toLocaleString()}</p>
                                                ) : (
                                                    <p className="text-[10px] text-emerald-500 font-bold mt-1 px-2 flex items-center"><Check size={10} className="mr-1" /> Remaining: {(acc.currency || user?.preferredCurrency)} {(acc.balance - costAmount).toLocaleString()}</p>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                )}

                                {!isExpense && (
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-dashed border-slate-200 dark:border-slate-700 text-center">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Toggle to record this as a financial expense</p>
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 md:p-8 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
                    <div className="text-sm">
                        {newItem.productName && newItem.quantity ? (
                            <span className="font-bold text-slate-900 dark:text-white">{newItem.quantity} {newItem.unit} of {newItem.productName}</span>
                        ) : (
                            <span className="text-slate-400 text-xs font-medium">Fill in product details above</span>
                        )}
                    </div>
                    <div className="flex space-x-3">
                        <button onClick={() => setShowModal(false)} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-sm">Cancel</button>
                        <button onClick={handleStockIn} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
                            Confirm Acquisition
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}