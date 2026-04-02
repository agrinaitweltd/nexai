import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExportOrder } from '../types';
import { FileText, Ship, CheckCircle, AlertCircle, Plus, UploadCloud, User, DollarSign, Download, Phone, Mail, MapPin, Anchor, Landmark, Globe, Warehouse, FileCheck, FileArchive, Eye, X, Truck, Navigation, ChevronDown, Wallet, Calendar, Plane, Activity, Clock, Box, ShoppingBag, ArrowRight, RefreshCw } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function Exports() {
  const { exports, createExport, updateExportPayment, updateExportStatus, inventory, clients, user, formatCurrency, financeAccounts, updateFinanceAccount } = useApp();
  
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  
  const [selectedExport, setSelectedExport] = useState<ExportOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [missionType, setMissionType] = useState<'EXPORT' | 'LOCAL' | null>(null);

  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  const [paymentAccountId, setPaymentAccountId] = useState('');
  const [paymentOverdraft, setPaymentOverdraft] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const [newOrder, setNewOrder] = useState<Partial<ExportOrder>>({
    unit: 'tonnes',
    status: 'PENDING',
    amountPaid: 0,
    pricePerUnit: 0,
    shippingCost: 0,
    transportMethod: 'SEA',
    transitPorts: '',
    originLocation: '',
    portOfExit: '',
    destinationPort: '',
    destinationCountry: '',
    tradeTerms: 'FOB',
  });

  const [initialPayment, setInitialPayment] = useState<number>(0);
  const [selectedStockId, setSelectedStockId] = useState<string>('');
  const [initialPaymentAccountId, setInitialPaymentAccountId] = useState('');
  const [initialPaymentOverdraft, setInitialPaymentOverdraft] = useState(false);

  const calculateTotal = (qty: number, price: number, ship: number) => {
      return (qty * price) + ship;
  };

  const handleTypeSelect = (type: 'EXPORT' | 'LOCAL') => {
      setMissionType(type);
      setShowTypeSelector(false);
      setShowModal(true);
      setNewOrder(prev => ({ 
          ...prev, 
          missionType: type,
          transportMethod: type === 'EXPORT' ? 'SEA' : 'ROAD' 
      }));
  };

  const handleCreate = async () => {
    setError(null);
    if (!selectedStockId) {
        setError("Please select source stock from current inventory.");
        return;
    }
    
    const stockItem = inventory.find(i => i.id === selectedStockId);
    if (!stockItem) return;

    if (!newOrder.quantity || newOrder.quantity <= 0) {
        setError("Please specify a valid shipment quantity.");
        return;
    }

    if (newOrder.quantity > stockItem.quantity) {
        setError(`INSUFFICIENT STOCK: Available: ${stockItem.quantity} ${stockItem.unit}`);
        return;
    }

    if (!newOrder.buyerName || !newOrder.originLocation) {
        setError("Missing basic mission parameters (Buyer or Origin Hub).");
        return;
    }

    const totalValue = calculateTotal(newOrder.quantity || 0, newOrder.pricePerUnit || 0, newOrder.shippingCost || 0);

    // Validate initial payment account balance
    if (initialPaymentAccountId && initialPayment > 0) {
      const acct = financeAccounts.find(a => a.id === initialPaymentAccountId);
      if (acct && acct.balance < initialPayment && !initialPaymentOverdraft) {
        setError(`Insufficient funds in ${acct.provider}. Balance: ${formatCurrency(acct.balance)}. Check "Allow overdraft" to proceed.`);
        return;
      }
    }

    const order = {
        ...newOrder,
        id: crypto.randomUUID(),
        missionType,
        productName: stockItem.productName,
        grade: stockItem.grade,
        date: new Date().toISOString(),
        totalValue,
        amountPaid: initialPayment,
        paymentAccountId: initialPaymentAccountId || undefined,
        shipmentNumber: `${missionType === 'EXPORT' ? 'EXP' : 'LOC'}-${Math.floor(Math.random() * 900000) + 100000}`
    } as ExportOrder;

    const success = await createExport(order, initialPayment, paymentMethod);
    
    if (success) {
        // Deduct from payment account if selected
        if (initialPaymentAccountId && initialPayment > 0) {
          const acct = financeAccounts.find(a => a.id === initialPaymentAccountId);
          if (acct) {
            updateFinanceAccount({ ...acct, balance: acct.balance - initialPayment, lastUpdated: new Date().toISOString() });
          }
        }

        setShowModal(false);
        setInitialPayment(0);
        setInitialPaymentAccountId('');
        setInitialPaymentOverdraft(false);
        setMissionType(null);
        setNewOrder({ unit: 'tonnes', status: 'PENDING', amountPaid: 0, pricePerUnit: 0, shippingCost: 0, transportMethod: 'SEA', tradeTerms: 'FOB' });

        if (confirm(`${missionType === 'EXPORT' ? 'Export' : 'Domestic Sale'} mission launched! Download manifest/invoice?`)) {
            generateMissionPDF(order);
        }
    }
  };

  const generateMissionPDF = (order: ExportOrder) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    doc.setFillColor(10, 10, 26);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    doc.setTextColor(0, 194, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text("NEXA", 15, 25);
    doc.setTextColor(0, 223, 130);
    doc.text("AGRI", 45, 25);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
doc.text(`${order.missionType === 'EXPORT' ? 'International Trade' : 'Domestic Sale'} Manifest`, 15, 33);
    
    doc.setFontSize(12);
    doc.text(`REF: ${order.shipmentNumber}`, pageWidth - 15, 25, { align: 'right' });
    
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.text("PROVIDER:", 15, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(user?.companyName || 'NexaAgri Unit', 15, 70);

    doc.setFont('helvetica', 'bold');
    doc.text("RECEIVER:", pageWidth / 2, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(order.buyerName, pageWidth / 2, 70);

    let y = 90;
    doc.setFillColor(245, 245, 245);
    doc.rect(15, y, pageWidth - 30, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text("Description", 20, y + 7);
    doc.text("Qty", 110, y + 7, { align: 'right' });
    doc.text("Rate", 145, y + 7, { align: 'right' });
    doc.text("Total", pageWidth - 20, y + 7, { align: 'right' });

    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(`${order.productName} (${order.grade})`, 20, y + 8);
    doc.text(`${order.quantity} ${order.unit}`, 110, y + 8, { align: 'right' });
    doc.text(formatCurrency(order.pricePerUnit || 0), 145, y + 8, { align: 'right' });
    doc.text(formatCurrency((order.quantity || 0) * (order.pricePerUnit || 0)), pageWidth - 20, y + 8, { align: 'right' });

    y += 20;
    doc.setFont('helvetica', 'bold');
    doc.text("GRAND TOTAL:", 120, y);
    doc.text(formatCurrency(order.totalValue), pageWidth - 20, y, { align: 'right' });

    doc.save(`Mission_${order.shipmentNumber}.pdf`);
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Mission Control</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Unified command for Global Export and Local Supply chains.</p>
        </div>
        <button 
            onClick={() => setShowTypeSelector(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center"
        >
            <Plus size={18} className="mr-2" />
            <span>Initialize Mission</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-20">
        {exports.length === 0 ? (
             <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors">
                <Ship size={64} className="mx-auto text-slate-200 dark:text-slate-700 mb-6" />
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em]">No Supply Missions Logged</p>
             </div>
        ) : exports.slice().reverse().map(order => (
          <div key={order.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 p-8 transition-all hover:shadow-2xl hover:border-emerald-500 group relative overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  {order.missionType === 'EXPORT' ? <Globe size={120} /> : <Truck size={120} />}
              </div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                      <div className="flex items-center space-x-2">
                           <h3 className="font-bold text-xl text-slate-900 dark:text-white truncate max-w-[200px]">{order.buyerName}</h3>
                           <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${order.missionType === 'EXPORT' ? 'border-blue-500 text-blue-500' : 'border-emerald-500 text-emerald-500'}`}>
                               {order.missionType || 'EXPORT'}
                           </span>
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center space-x-2 mt-1 font-bold uppercase tracking-widest">
                          <MapPin size={10} className="text-emerald-500" />
                          <span>{order.destinationCountry || order.buyerCountry}</span>
                          <span>•</span>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded tracking-tighter">{order.shipmentNumber}</span>
                      </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => generateMissionPDF(order)} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-emerald-600 transition-all shadow-sm"><Download size={18} /></button>
                    <select 
                        className={`pl-4 pr-10 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm outline-none cursor-pointer border-none transition-all appearance-none bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300`}
                        value={order.status}
                        onChange={(e) => updateExportStatus(order.id, e.target.value as any)}
                    >
                        <option value="PENDING">Processing</option>
                        <option value="IN_TRANSIT">In-Transit</option>
                        <option value="DELIVERED">Complete</option>
                        <option value="PAID">Settled</option>
                    </select>
                  </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 relative z-10">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Port</p>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">{order.destinationPort || 'Local Hub'}</span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Provider</p>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">{order.transportProvider || 'Internal'}</span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Origin</p>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">{order.originLocation || 'Dispatch'}</span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Weight</p>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">{order.quantity} {order.unit}</span>
                  </div>
              </div>

              <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 mb-6">
                  <div className="flex justify-between items-end mb-4">
                      <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate Mission Value</p>
                          <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mt-1">{formatCurrency(order.totalValue)}</p>
                      </div>
                      <div className="text-right">
                          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Settled</p>
                          <p className="text-lg font-bold text-emerald-600 leading-none mt-1">{formatCurrency(order.amountPaid)}</p>
                      </div>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (order.amountPaid / order.totalValue) * 100)}%` }} />
                  </div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-2">Outstanding: {formatCurrency(order.totalValue - order.amountPaid)}</p>
              </div>

              <div className="flex space-x-3 relative z-10">
                  <button 
                      onClick={() => setSelectedExport(order)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest shadow-sm transition-all"
                  >
                      <FileArchive size={14} />
                      <span>Documentation</span>
                  </button>
                  
                  {user?.role === 'ADMIN' && order.amountPaid < order.totalValue && (
                       <button 
                          onClick={() => { setSelectedExport(order); setPaymentAmount(order.totalValue - order.amountPaid); setShowPayModal(true); }}
                          className="flex-1 flex items-center justify-center space-x-2 bg-emerald-600 text-white py-3.5 rounded-2xl hover:bg-emerald-700 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
                      >
                          <DollarSign size={14} />
                          <span>Record Payment</span>
                      </button>
                  )}
              </div>
          </div>
        ))}
      </div>

      {/* TYPE SELECTOR MODAL */}
      {showTypeSelector && (
          <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center z-[120] p-4 md:p-6 backdrop-blur-xl animate-in fade-in duration-300">
              <div className="w-full max-w-3xl space-y-6 md:space-y-8">
                  <div className="text-center space-y-2 md:space-y-3">
                      <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter">Mission Scoping</h2>
                      <p className="text-slate-400 text-sm md:text-base font-medium">Create an Export Plan or a Domestic Sale Plan?</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <button 
                        onClick={() => handleTypeSelect('EXPORT')}
                        className="group bg-slate-900 border border-white/10 p-6 md:p-8 rounded-2xl md:rounded-3xl text-left hover:border-nexa-blue hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl relative overflow-hidden"
                      >
                          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Globe size={100}/></div>
                          <div className="w-12 h-12 bg-nexa-blue rounded-xl flex items-center justify-center text-white mb-4 shadow-xl"><Ship size={24}/></div>
                          <h3 className="text-xl md:text-2xl font-black text-white mb-2">Export Plan</h3>
                          <p className="text-slate-400 font-medium text-sm mb-4 leading-relaxed">International trade with maritime logistics and customs parameters.</p>
                          <div className="flex items-center text-nexa-blue font-black uppercase text-[10px] tracking-widest">Initialize <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" /></div>
                      </button>

                      <button 
                        onClick={() => handleTypeSelect('LOCAL')}
                        className="group bg-slate-900 border border-white/10 p-6 md:p-8 rounded-2xl md:rounded-3xl text-left hover:border-nexa-green hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl relative overflow-hidden"
                      >
                          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Truck size={100}/></div>
                          <div className="w-12 h-12 bg-nexa-green rounded-xl flex items-center justify-center text-white mb-4 shadow-xl"><Box size={24}/></div>
                          <h3 className="text-xl md:text-2xl font-black text-white mb-2">Domestic Sale Plan</h3>
                          <p className="text-slate-400 font-medium text-sm mb-4 leading-relaxed">Sell directly to buyers inside the country — no customs or export logistics required.</p>
                          <div className="flex items-center text-nexa-green font-black uppercase text-[10px] tracking-widest">Initialize <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" /></div>
                      </button>
                  </div>

                  <div className="text-center pt-4">
                      <button onClick={() => setShowTypeSelector(false)} className="text-slate-500 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">Cancel</button>
                  </div>
              </div>
          </div>
      )}

      {/* CREATE MISSION MODAL */}
      {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[110] p-3 md:p-6 backdrop-blur-md overflow-y-auto">
              <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-[2rem] w-full max-w-4xl shadow-2xl transition-all border border-white/5 my-auto flex flex-col max-h-[95vh]">
                  <div className="p-5 md:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
                      <div>
                          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{missionType === 'EXPORT' ? 'Export' : 'Domestic Sale'} Mission Builder</h2>
                          <p className="text-slate-500 dark:text-slate-400 font-medium text-xs md:text-sm mt-1">Define routing and stock allocation.</p>
                      </div>
                      <button onClick={() => {setShowModal(false); setMissionType(null);}} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:rotate-90 transition-all shadow-sm shrink-0"><X size={20}/></button>
                  </div>
                  
                  <div className="p-5 md:p-8 space-y-6 md:space-y-8 overflow-y-auto scrollbar-thin">
                      {error && (
                          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center space-x-3 text-sm font-bold animate-in slide-in-from-top-4 duration-300 border border-red-100 dark:border-red-900/50">
                              <AlertCircle size={20} />
                              <span>{error}</span>
                          </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                          <div className="space-y-6">
                              <section className="space-y-4">
                                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center border-b dark:border-slate-800 pb-2">
                                      <Box size={13} className="mr-2 text-primary-500" /> Stock Allocation
                                  </h3>
                                  <div className="space-y-3">
                                      <div className="space-y-1.5">
                                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Warehouse Lot</label>
                                          <select 
                                              className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 md:p-4 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/20 font-bold dark:text-white shadow-inner text-sm"
                                              onChange={e => setSelectedStockId(e.target.value)}
                                              value={selectedStockId}
                                          >
                                              <option value="">-- Choose Stock Lot --</option>
                                              {inventory.map(item => (
                                                  <option key={item.id} value={item.id}>{item.productName} ({item.grade}) - {item.quantity} {item.unit}</option>
                                              ))}
                                          </select>
                                      </div>
                                      <div className="grid grid-cols-2 gap-3">
                                          <div className="space-y-1.5">
                                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Quantity</label>
                                              <input 
                                                  type="number"
                                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 md:p-4 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/20 font-bold dark:text-white shadow-inner"
                                                  placeholder="0.00"
                                                  value={newOrder.quantity || ''}
                                                  onChange={e => setNewOrder({...newOrder, quantity: parseFloat(e.target.value) || 0})}
                                              />
                                          </div>
                                          <div className="space-y-1.5">
                                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Unit</label>
                                              <select
                                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 md:p-4 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/20 font-bold dark:text-white shadow-inner text-sm"
                                                  value={newOrder.unit || 'tonnes'}
                                                  onChange={e => {
                                                      const newUnit = e.target.value as any;
                                                      let qty = newOrder.quantity || 0;
                                                      if (newUnit === 'tonnes' && newOrder.unit === 'kg') qty = parseFloat((qty / 1000).toFixed(4));
                                                      else if (newUnit === 'kg' && newOrder.unit === 'tonnes') qty = parseFloat((qty * 1000).toFixed(2));
                                                      setNewOrder({...newOrder, unit: newUnit, quantity: qty});
                                                  }}
                                              >
                                                  <option value="kg">kg (Kilograms)</option>
                                                  <option value="tonnes">Tonnes (MT)</option>
                                                  <option value="bags">Bags</option>
                                                  <option value="units">Units</option>
                                              </select>
                                          </div>
                                      </div>
                                      <div className="space-y-1.5">
                                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Rate per {newOrder.unit || 'tonne'} ({user?.preferredCurrency || '$'})</label>
                                          <input 
                                              type="number"
                                              className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 md:p-4 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/20 font-bold dark:text-white shadow-inner"
                                              placeholder="0.00"
                                              value={newOrder.pricePerUnit || ''}
                                              onChange={e => setNewOrder({...newOrder, pricePerUnit: parseFloat(e.target.value)})}
                                          />
                                      </div>
                                  </div>
                              </section>

                              <section className="space-y-4">
                                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center border-b dark:border-slate-800 pb-2">
                                      <User size={13} className="mr-2 text-primary-500" /> Buyer Details
                                  </h3>
                                  <div className="space-y-3">
                                      <div className="space-y-1.5">
                                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Buyer Name</label>
                                          <input 
                                              className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 md:p-4 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/20 font-bold dark:text-white shadow-inner"
                                              placeholder="e.g. Global Exports Ltd"
                                              value={newOrder.buyerName || ''}
                                              onChange={e => setNewOrder({...newOrder, buyerName: e.target.value})}
                                          />
                                      </div>
                                      <div className="grid grid-cols-2 gap-3">
                                          <div className="space-y-1.5">
                                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Email</label>
                                              <input 
                                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 md:p-4 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/20 font-bold dark:text-white shadow-inner"
                                                  placeholder="buyer@email.com"
                                                  value={newOrder.buyerEmail || ''}
                                                  onChange={e => setNewOrder({...newOrder, buyerEmail: e.target.value})}
                                              />
                                          </div>
                                          <div className="space-y-1.5">
                                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Phone</label>
                                              <input 
                                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 md:p-4 rounded-xl outline-none focus:ring-4 focus:ring-primary-500/20 font-bold dark:text-white shadow-inner"
                                                  placeholder="+256..."
                                                  value={newOrder.buyerPhone || ''}
                                                  onChange={e => setNewOrder({...newOrder, buyerPhone: e.target.value})}
                                              />
                                          </div>
                                      </div>
                                  </div>
                              </section>
                          </div>

                          <div className="space-y-6">
                              <section className="space-y-4">
                                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center border-b dark:border-slate-800 pb-2">
                                      <Navigation size={13} className="mr-2 text-blue-500" /> Route & Logistics
                                  </h3>
                                  <div className="space-y-3">
                                      {/* Transport Mode (first — drives all field labels) */}
                                      <div className="grid grid-cols-2 gap-3">
                                          <div className="space-y-1.5">
                                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Transport Mode</label>
                                              <select
                                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 md:p-4 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white shadow-inner uppercase tracking-widest text-xs"
                                                  value={newOrder.transportMethod}
                                                  onChange={e => setNewOrder({...newOrder, transportMethod: e.target.value as any, portOfExit: '', transitPorts: '', destinationPort: ''})}
                                              >
                                                  <option value="SEA">🚢  Maritime (Sea)</option>
                                                  <option value="AIR">✈️  Aviation (Air)</option>
                                                  <option value="ROAD">🚛  Ground (Road)</option>
                                                  <option value="RAIL">🚂  Ground (Rail)</option>
                                              </select>
                                          </div>
                                          <div className="space-y-1.5">
                                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Logistics Cost ({user?.preferredCurrency || '$'})</label>
                                              <input
                                                  type="number"
                                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 md:p-4 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white shadow-inner"
                                                  placeholder="0.00"
                                                  value={newOrder.shippingCost || ''}
                                                  onChange={e => setNewOrder({...newOrder, shippingCost: parseFloat(e.target.value) || 0})}
                                              />
                                          </div>
                                      </div>

                                      {/* Origin + Departure Hub */}
                                      <div className="grid grid-cols-2 gap-3">
                                          <div className="space-y-1.5">
                                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Origin / Warehouse</label>
                                              <input
                                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 md:p-4 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white shadow-inner"
                                                  placeholder="e.g. Masaka Hub"
                                                  value={newOrder.originLocation || ''}
                                                  onChange={e => setNewOrder({...newOrder, originLocation: e.target.value, originWarehouse: e.target.value})}
                                              />
                                          </div>
                                          <div className="space-y-1.5">
                                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
                                                  {newOrder.transportMethod === 'AIR' ? 'Airport of Departure' : newOrder.transportMethod === 'ROAD' ? 'Border / Hub' : 'Port of Exit'}
                                              </label>
                                              <input
                                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 md:p-4 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white shadow-inner"
                                                  placeholder={newOrder.transportMethod === 'AIR' ? 'e.g. Entebbe International' : newOrder.transportMethod === 'ROAD' ? 'e.g. Malaba Border' : 'e.g. Mombasa'}
                                                  value={newOrder.portOfExit || ''}
                                                  onChange={e => setNewOrder({...newOrder, portOfExit: e.target.value})}
                                              />
                                          </div>
                                      </div>

                                      {/* Transit */}
                                      <div className="space-y-1.5">
                                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
                                              {newOrder.transportMethod === 'AIR' ? 'Transit Airports' : newOrder.transportMethod === 'ROAD' ? 'Route / Checkpoints' : 'Transit Ports'}
                                          </label>
                                          <input
                                              className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 md:p-4 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white shadow-inner"
                                              placeholder={newOrder.transportMethod === 'AIR' ? 'e.g. Nairobi, Dubai' : newOrder.transportMethod === 'ROAD' ? 'e.g. Nairobi, Dar es Salaam' : 'e.g. Dubai, Rotterdam'}
                                              value={newOrder.transitPorts || ''}
                                              onChange={e => setNewOrder({...newOrder, transitPorts: e.target.value})}
                                          />
                                      </div>

                                      {/* Destination */}
                                      <div className="grid grid-cols-2 gap-3">
                                          <div className="space-y-1.5">
                                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
                                                  {newOrder.transportMethod === 'AIR' ? 'Destination Airport' : newOrder.transportMethod === 'ROAD' ? 'Delivery Point' : 'Destination Port'}
                                              </label>
                                              <input
                                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 md:p-4 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white shadow-inner"
                                                  placeholder={newOrder.transportMethod === 'AIR' ? 'e.g. Heathrow' : newOrder.transportMethod === 'ROAD' ? 'e.g. Kampala Warehouse' : 'e.g. Antwerp'}
                                                  value={newOrder.destinationPort || ''}
                                                  onChange={e => setNewOrder({...newOrder, destinationPort: e.target.value})}
                                              />
                                          </div>
                                          <div className="space-y-1.5">
                                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Destination Country</label>
                                              <input
                                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 md:p-4 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white shadow-inner"
                                                  placeholder="e.g. Belgium"
                                                  value={newOrder.destinationCountry || ''}
                                                  onChange={e => setNewOrder({...newOrder, destinationCountry: e.target.value, buyerCountry: e.target.value})}
                                              />
                                          </div>
                                      </div>

                                      {/* Departure & Arrival dates */}
                                      <div className="grid grid-cols-2 gap-3">
                                          <div className="space-y-1.5">
                                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
                                                  {newOrder.transportMethod === 'AIR' ? 'Departure Date' : 'Set-Off Date'}
                                              </label>
                                              <input
                                                  type="date"
                                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 md:p-4 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white shadow-inner text-sm"
                                                  value={newOrder.departureDate || ''}
                                                  onChange={e => setNewOrder({...newOrder, departureDate: e.target.value})}
                                              />
                                          </div>
                                          <div className="space-y-1.5">
                                              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
                                                  {newOrder.transportMethod === 'AIR' ? 'Landing Date (ETA)' : 'Arrival / ETA'}
                                              </label>
                                              <input
                                                  type="date"
                                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 md:p-4 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white shadow-inner text-sm"
                                                  value={newOrder.arrivalDate || ''}
                                                  onChange={e => setNewOrder({...newOrder, arrivalDate: e.target.value})}
                                              />
                                          </div>
                                      </div>

                                      {/* Trade Terms (Incoterms) */}
                                      <div className="space-y-1.5">
                                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Trade Terms (Incoterms)</label>
                                          <select
                                              className="w-full bg-slate-50 dark:bg-slate-800 border-none p-3.5 md:p-4 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/20 font-bold dark:text-white shadow-inner text-xs uppercase tracking-widest"
                                              value={newOrder.tradeTerms || 'FOB'}
                                              onChange={e => setNewOrder({...newOrder, tradeTerms: e.target.value as any})}
                                          >
                                              <option value="FOB">FOB — Free On Board (seller delivers to port)</option>
                                              <option value="CIF">CIF — Cost, Insurance & Freight</option>
                                              <option value="CFR">CFR — Cost & Freight</option>
                                              <option value="EXW">EXW — Ex Works (buyer collects)</option>
                                              <option value="DAP">DAP — Delivered At Place</option>
                                              <option value="DDP">DDP — Delivered Duty Paid</option>
                                              <option value="CIP">CIP — Carriage & Insurance Paid</option>
                                              <option value="CPT">CPT — Carriage Paid To</option>
                                              <option value="FCA">FCA — Free Carrier</option>
                                          </select>
                                      </div>
                                  </div>
                              </section>

                              {/* Unit Calculation Preview */}
                              {(newOrder.quantity || 0) > 0 && (newOrder.pricePerUnit || 0) > 0 && (
                                <section className="space-y-2">
                                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center border-b dark:border-slate-800 pb-2">
                                        <DollarSign size={13} className="mr-2 text-emerald-500" /> Calculation Breakdown
                                    </h3>
                                    <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 space-y-2 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                                        <div className="flex justify-between">
                                            <span>{newOrder.quantity} {newOrder.unit || 'tonnes'} × {formatCurrency(newOrder.pricePerUnit || 0)} / {newOrder.unit || 'tonne'}</span>
                                            <span className="font-black text-slate-800 dark:text-white">{formatCurrency((newOrder.quantity || 0) * (newOrder.pricePerUnit || 0))}</span>
                                        </div>
                                        {(newOrder.shippingCost || 0) > 0 && (
                                            <div className="flex justify-between text-blue-600">
                                                <span>+ Logistics / Freight</span>
                                                <span>{formatCurrency(newOrder.shippingCost || 0)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 text-emerald-600">
                                            <span className="font-black uppercase tracking-widest text-[10px]">Total</span>
                                            <span className="font-black text-base">{formatCurrency(calculateTotal(newOrder.quantity || 0, newOrder.pricePerUnit || 0, newOrder.shippingCost || 0))}</span>
                                        </div>
                                    </div>
                                </section>
                              )}
                          </div>
                      </div>

                      <div className="bg-slate-900 p-5 md:p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-6 opacity-10"><DollarSign size={120} /></div>
                          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center justify-between">
                              <div>
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 flex items-center"><Wallet size={13} className="mr-2"/> Financial Summary</p>
                                  <div className="space-y-1">
                                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Value</p>
                                      <p className="text-3xl md:text-4xl font-black tracking-tighter leading-none">{formatCurrency(calculateTotal(newOrder.quantity || 0, newOrder.pricePerUnit || 0, newOrder.shippingCost || 0))}</p>
                                      <p className="text-[9px] text-slate-500">{newOrder.quantity || 0} {newOrder.unit} × {formatCurrency(newOrder.pricePerUnit || 0)} + {formatCurrency(newOrder.shippingCost || 0)} logistics</p>
                                  </div>
                              </div>
                              <div className="bg-white/5 backdrop-blur-xl p-5 md:p-6 rounded-2xl border border-white/10 w-full md:w-auto space-y-3">
                                  <label className="text-[10px] font-black text-primary-500 uppercase tracking-widest block">Initial Payment</label>
                                  <div className="flex items-center bg-white/10 rounded-xl px-4 py-3 shadow-inner">
                                      <span className="text-lg font-black text-white/40 mr-3">{user?.preferredCurrency || '$'}</span>
                                      <input
                                          type="number"
                                          className="w-full md:w-40 bg-transparent border-none font-black text-white text-2xl outline-none"
                                          value={initialPayment || ''}
                                          onChange={e => setInitialPayment(parseFloat(e.target.value) || 0)}
                                      />
                                  </div>
                                  {financeAccounts.length > 0 && (
                                      <div className="space-y-1.5">
                                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Pay from Account</label>
                                          <select
                                              className="w-full bg-white/10 border-none text-white p-3 rounded-xl font-bold text-xs outline-none"
                                              value={initialPaymentAccountId}
                                              onChange={e => { setInitialPaymentAccountId(e.target.value); setInitialPaymentOverdraft(false); }}
                                          >
                                              <option value="">Cash / Unlinked</option>
                                              {financeAccounts.map(a => (
                                                  <option key={a.id} value={a.id}>{a.provider}: {formatCurrency(a.balance)}</option>
                                              ))}
                                          </select>
                                          {initialPaymentAccountId && initialPayment > 0 && (() => {
                                              const acct = financeAccounts.find(a => a.id === initialPaymentAccountId);
                                              if (acct && acct.balance < initialPayment) return (
                                                  <div className="space-y-2">
                                                      <p className="text-[9px] font-bold text-red-400">⚠ Insufficient funds ({formatCurrency(acct.balance)} available)</p>
                                                      <button
                                                          type="button"
                                                          onClick={() => setInitialPaymentOverdraft(!initialPaymentOverdraft)}
                                                          className={`w-full py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${initialPaymentOverdraft ? 'border-amber-400 text-amber-300 bg-amber-500/20' : 'border-white/20 text-white/50'}`}
                                                      >
                                                          {initialPaymentOverdraft ? 'Overdraft ON — will go negative' : 'Allow overdraft'}
                                                      </button>
                                                  </div>
                                              );
                                              return null;
                                          })()}
                                      </div>
                                  )}
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="p-5 md:p-8 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-3 md:space-x-4 shrink-0">
                      <button onClick={() => {setShowModal(false); setMissionType(null);}} className="px-6 md:px-8 py-3 md:py-4 text-slate-500 font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl md:rounded-2xl transition-all text-[10px]">Discard</button>
                      <button 
                        onClick={handleCreate} 
                        className="px-8 md:px-10 py-3 md:py-4 bg-emerald-600 text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-[0.15em] shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 active:scale-95 transition-all"
                      >
                          Deploy Mission
                      </button>
                  </div>
              </div>
          </div>
      )}
      
      {/* RECORD PAYMENT MODAL */}
      {showPayModal && selectedExport && (
          <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center z-[150] p-3 md:p-4 backdrop-blur-xl animate-in zoom-in duration-300">
              <div className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] w-full max-w-lg md:max-w-xl shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
                   <div className="flex justify-between items-center mb-6 md:mb-8">
                    <div>
                        <h3 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">Record Settlement</h3>
                        <p className="text-slate-500 mt-1 font-medium text-xs md:text-sm">Mission {selectedExport.shipmentNumber}</p>
                    </div>
                    <button onClick={() => setShowPayModal(false)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:rotate-90 transition-all shadow-sm shrink-0"><X size={20}/></button>
                  </div>
                  
                  <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border shadow-inner">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Value</p>
                                <p className="text-lg font-black text-slate-900 dark:text-white">{formatCurrency(selectedExport.totalValue)}</p>
                            </div>
                            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/50 shadow-inner">
                                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Received</p>
                                <p className="text-lg font-black text-emerald-600">{formatCurrency(selectedExport.amountPaid)}</p>
                            </div>
                        </div>

                        {paymentError && (
                          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl text-sm font-bold flex items-center space-x-2 border border-red-100">
                            <AlertCircle size={16}/><span>{paymentError}</span>
                          </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] px-2 block">Amount ({user?.preferredCurrency || '$'})</label>
                                <input 
                                    type="number" 
                                    className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-4 md:p-5 rounded-xl md:rounded-2xl font-black text-2xl md:text-3xl outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner" 
                                    value={paymentAmount || ''} 
                                    onChange={e => { setPaymentAmount(parseFloat(e.target.value) || 0); setPaymentError(''); setPaymentOverdraft(false); }} 
                                />
                                <div className="flex justify-between px-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Max: {formatCurrency(selectedExport.totalValue - selectedExport.amountPaid)}</span>
                                    <button 
                                        onClick={() => setPaymentAmount(selectedExport.totalValue - selectedExport.amountPaid)}
                                        className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline"
                                    >
                                        Settle All
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] px-2 block">Payment Method</label>
                                <select 
                                    className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-4 rounded-xl md:rounded-2xl font-bold uppercase outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner text-sm tracking-widest appearance-none" 
                                    onChange={e => setPaymentMethod(e.target.value)}
                                    value={paymentMethod}
                                >
                                    <option value="BANK_TRANSFER">Corporate SWIFT / Bank Transfer</option>
                                    <option value="MOBILE_MONEY">Digital Wallet / Momo</option>
                                    <option value="CASH">Liquid Cash</option>
                                    <option value="CHEQUE">Corporate Cheque</option>
                                </select>
                            </div>

                            {financeAccounts.length > 0 && (
                              <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] px-2 block">Pay from Account</label>
                                <select
                                  className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-4 rounded-xl md:rounded-2xl font-bold outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner text-sm appearance-none"
                                  value={paymentAccountId}
                                  onChange={e => { setPaymentAccountId(e.target.value); setPaymentOverdraft(false); setPaymentError(''); }}
                                >
                                  <option value="">No linked account (cash/external)</option>
                                  {financeAccounts.map(a => (
                                    <option key={a.id} value={a.id}>{a.provider}{a.name !== a.provider ? ` — ${a.name}` : ''} · Balance: {formatCurrency(a.balance)}</option>
                                  ))}
                                </select>
                                {paymentAccountId && paymentAmount > 0 && (() => {
                                  const acct = financeAccounts.find(a => a.id === paymentAccountId);
                                  if (acct && acct.balance < paymentAmount) return (
                                    <div className="space-y-2 px-1">
                                      <p className="text-[10px] font-bold text-red-500">⚠ Insufficient — {formatCurrency(acct.balance)} available</p>
                                      <button
                                        type="button"
                                        onClick={() => setPaymentOverdraft(!paymentOverdraft)}
                                        className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${paymentOverdraft ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 text-slate-500'}`}
                                      >
                                        {paymentOverdraft ? '✓ Overdraft enabled — account will go negative' : 'Allow overdraft to proceed'}
                                      </button>
                                    </div>
                                  );
                                  return null;
                                })()}
                              </div>
                            )}
                        </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                      <button onClick={() => { setShowPayModal(false); setPaymentError(''); setPaymentOverdraft(false); setPaymentAccountId(''); }} className="px-6 md:px-8 py-3 md:py-4 text-slate-500 font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl md:rounded-2xl transition-all text-[10px]">Cancel</button>
                      <button 
                        onClick={() => {
                          setPaymentError('');
                          if (paymentAccountId && paymentAmount > 0) {
                            const acct = financeAccounts.find(a => a.id === paymentAccountId);
                            if (acct && acct.balance < paymentAmount && !paymentOverdraft) {
                              setPaymentError(`Insufficient funds. Balance: ${formatCurrency(acct.balance)}`);
                              return;
                            }
                            if (acct) {
                              updateFinanceAccount({ ...acct, balance: acct.balance - paymentAmount, lastUpdated: new Date().toISOString() });
                            }
                          }
                          updateExportPayment(selectedExport.id, paymentAmount, paymentMethod);
                          setShowPayModal(false);
                          setPaymentAccountId('');
                          setPaymentOverdraft(false);
                        }}
                        className="px-8 md:px-10 py-3 md:py-4 bg-emerald-600 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-[0.15em] shadow-xl hover:bg-emerald-700 active:scale-95 transition-all text-[10px] flex items-center"
                      >
                          Confirm <RefreshCw size={16} className="ml-2" />
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}