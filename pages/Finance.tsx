import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Requisition, Transaction, FinanceAccount } from '../types';
import { DollarSign, Check, X, Download, TrendingUp, TrendingDown, Wallet, Building, Calendar, Plus, AlertCircle, FileCheck, Sprout, User, ArrowRight, Hash, Filter, FileText, Smartphone, Landmark, CreditCard, Trash2, Pencil } from 'lucide-react';
import { jsPDF } from 'jspdf';

// Bank logo helpers — maps provider display name → public asset path
const BANK_LOGOS: Record<string, string> = {
  'Stanbic Bank': '/bank-stanbic.png',
  'Centenary Bank': '/bank-centenary.png',
  'DFCU Bank': '/bank-dfcu.png',
  'Equity Bank Uganda': '/bank-equity.png',
  'Equity Bank': '/bank-equity.png',
  'Bank of Africa': '/bank-boa.png',
  'Pearl Bank': '/bank-postbank.png',
  'Absa Bank Uganda': '/bank-absa.png',
  'Absa Bank': '/bank-absa.png',
  'Standard Chartered Uganda': '/bank-stanchart.png',
  'Standard Chartered Kenya': '/bank-stanchart.png',
  'Standard Chartered Bank': '/bank-stanchart.png',
  'Standard Chartered': '/bank-stanchart.png',
  'KCB Bank': '/bank-kcb.png',
  'KCB Bank Uganda': '/bank-kcb.png',
  'I&M Bank Uganda': '/bank-im.png',
  'I&M Bank': '/bank-im.png',
  'Orient Bank': '/bank-orient.png',
  'Housing Finance Bank': '/bank-hfb.png',
  'Finance Trust Bank': '/bank-ftb.png',
  'NC Bank Uganda': '/bank-ncbank.png',
  'Co-operative Bank': '/bank-cooperative.png',
  'NCBA Bank': '/bank-ncba.png',
  'Family Bank': '/bank-familybank.png',
  'DTB Bank': '/bank-dtb.png',
  'CRDB Bank': '/bank-crdb.png',
  'NMB Bank': '/bank-nmb.png',
  'GTBank': '/bank-gtbank.png',
  'Access Bank': '/bank-access.png',
  'First Bank': '/bank-firstbank.png',
  'UBA': '/bank-uba.png',
  'Zenith Bank': '/bank-zenith.png',
  'Fidelity Bank': '/bank-fidelity.png',
  'Stanbic IBTC': '/bank-stanbic.png',
  'Polaris Bank': '/bank-polaris.png',
  'GCB Bank': '/bank-gcb.png',
  'Ecobank': '/bank-ecobank.png',
  'Bank of Kigali': '/bank-bk.png',
  'BPR Bank Rwanda': '/bank-bpr.png',
  'I&M Bank Rwanda': '/bank-im.png',
  'Equity Bank Rwanda': '/bank-equity.png',
  'FNB': '/bank-fnb.png',
  'Nedbank': '/bank-nedbank.png',
  'Standard Bank SA': '/bank-stanbic.png',
  'Capitec': '/bank-capitec.png',
  'ABSA South Africa': '/bank-absa.png',
  'Lloyds Bank': '/bank-lloyds.png',
  'Barclays': '/bank-barclays.png',
  'HSBC': '/bank-hsbc.png',
  'NatWest': '/bank-natwest.png',
  'Santander': '/bank-santander.png',
  'Halifax': '/bank-halifax.png',
  'Nationwide': '/bank-nationwide.png',
  'TSB': '/bank-tsb.png',
  'Metro Bank': '/bank-metro.png',
  'Monzo': '/bank-monzo.png',
  'Revolut': '/bank-revolut.png',
  'Starling Bank': '/bank-starling.png',
  'Wise': '/bank-wise.png',
  'Chase': '/bank-chase.png',
  'Bank of America': '/bank-bofa.png',
  'Wells Fargo': '/bank-wellsfargo.png',
  'Cash App': '/bank-cashapp.png',
  'MTN Mobile Money': '/bank-mtn-momo.png',
  'Airtel Money': '/bank-airtel-money.png',
  'M-Pesa': '/bank-mpesa.png',
  'Vodacom M-Pesa': '/bank-mpesa.png',
  'Tigo Pesa': '/bank-tigo.png',
  'OPay': '/bank-opay.png',
};

export function getBankLogoUrl(provider: string): string | null {
  return BANK_LOGOS[provider] || null;
}

const COUNTRY_PROVIDERS: Record<string, { name: string; type: string; icon: string }[]> = {
  Uganda: [
    { name: 'MTN Mobile Money', type: 'mobile_money', icon: getBankLogoUrl('MTN Mobile Money') || '📱' },
    { name: 'Airtel Money', type: 'mobile_money', icon: getBankLogoUrl('Airtel Money') || '📱' },
    { name: 'Stanbic Bank', type: 'bank', icon: getBankLogoUrl('Stanbic Bank') || '🏦' },
    { name: 'Centenary Bank', type: 'bank', icon: getBankLogoUrl('Centenary Bank') || '🏦' },
    { name: 'DFCU Bank', type: 'bank', icon: getBankLogoUrl('DFCU Bank') || '🏦' },
    { name: 'Equity Bank Uganda', type: 'bank', icon: getBankLogoUrl('Equity Bank Uganda') || '🏦' },
    { name: 'Bank of Africa', type: 'bank', icon: getBankLogoUrl('Bank of Africa') || '🏦' },
    { name: 'Absa Bank Uganda', type: 'bank', icon: getBankLogoUrl('Absa Bank Uganda') || '🏦' },
    { name: 'Standard Chartered Uganda', type: 'bank', icon: getBankLogoUrl('Standard Chartered Uganda') || '🏦' },
    { name: 'KCB Bank Uganda', type: 'bank', icon: getBankLogoUrl('KCB Bank Uganda') || '🏦' },
    { name: 'I&M Bank Uganda', type: 'bank', icon: getBankLogoUrl('I&M Bank Uganda') || '🏦' },
    { name: 'Pearl Bank', type: 'bank', icon: getBankLogoUrl('Pearl Bank') || '🏦' },
    { name: 'Orient Bank', type: 'bank', icon: getBankLogoUrl('Orient Bank') || '🏦' },
    { name: 'Housing Finance Bank', type: 'bank', icon: getBankLogoUrl('Housing Finance Bank') || '🏦' },
    { name: 'Finance Trust Bank', type: 'bank', icon: getBankLogoUrl('Finance Trust Bank') || '🏦' },
    { name: 'NC Bank Uganda', type: 'bank', icon: getBankLogoUrl('NC Bank Uganda') || '🏦' },
  ],
  Kenya: [
    { name: 'M-Pesa', type: 'mobile_money', icon: getBankLogoUrl('M-Pesa') || '📱' },
    { name: 'Airtel Money', type: 'mobile_money', icon: getBankLogoUrl('Airtel Money') || '📱' },
    { name: 'Equity Bank', type: 'bank', icon: getBankLogoUrl('Equity Bank') || '🏦' },
    { name: 'KCB Bank', type: 'bank', icon: getBankLogoUrl('KCB Bank') || '🏦' },
    { name: 'Co-operative Bank', type: 'bank', icon: getBankLogoUrl('Co-operative Bank') || '🏦' },
    { name: 'Absa Bank', type: 'bank', icon: getBankLogoUrl('Absa Bank') || '🏦' },
    { name: 'Standard Chartered Kenya', type: 'bank', icon: getBankLogoUrl('Standard Chartered Kenya') || '🏦' },
    { name: 'Stanbic Bank', type: 'bank', icon: getBankLogoUrl('Stanbic Bank') || '🏦' },
    { name: 'DTB Bank', type: 'bank', icon: getBankLogoUrl('DTB Bank') || '🏦' },
    { name: 'I&M Bank', type: 'bank', icon: getBankLogoUrl('I&M Bank') || '🏦' },
    { name: 'NCBA Bank', type: 'bank', icon: getBankLogoUrl('NCBA Bank') || '🏦' },
    { name: 'Family Bank', type: 'bank', icon: getBankLogoUrl('Family Bank') || '🏦' },
    { name: 'Ecobank', type: 'bank', icon: getBankLogoUrl('Ecobank') || '🏦' },
  ],
  Tanzania: [
    { name: 'Vodacom M-Pesa', type: 'mobile_money', icon: getBankLogoUrl('Vodacom M-Pesa') || '📱' },
    { name: 'Tigo Pesa', type: 'mobile_money', icon: getBankLogoUrl('Tigo Pesa') || '📱' },
    { name: 'Airtel Money', type: 'mobile_money', icon: getBankLogoUrl('Airtel Money') || '📱' },
    { name: 'CRDB Bank', type: 'bank', icon: getBankLogoUrl('CRDB Bank') || '🏦' },
    { name: 'NMB Bank', type: 'bank', icon: getBankLogoUrl('NMB Bank') || '🏦' },
    { name: 'Stanbic Bank', type: 'bank', icon: getBankLogoUrl('Stanbic Bank') || '🏦' },
    { name: 'Standard Chartered Bank', type: 'bank', icon: getBankLogoUrl('Standard Chartered Bank') || '🏦' },
    { name: 'Absa Bank', type: 'bank', icon: getBankLogoUrl('Absa Bank') || '🏦' },
    { name: 'Ecobank', type: 'bank', icon: getBankLogoUrl('Ecobank') || '🏦' },
    { name: 'DTB Bank', type: 'bank', icon: getBankLogoUrl('DTB Bank') || '🏦' },
  ],
  Rwanda: [
    { name: 'MTN Mobile Money', type: 'mobile_money', icon: getBankLogoUrl('MTN Mobile Money') || '📱' },
    { name: 'Airtel Money', type: 'mobile_money', icon: getBankLogoUrl('Airtel Money') || '📱' },
    { name: 'Bank of Kigali', type: 'bank', icon: getBankLogoUrl('Bank of Kigali') || '🏦' },
    { name: 'BPR Bank Rwanda', type: 'bank', icon: getBankLogoUrl('BPR Bank Rwanda') || '🏦' },
    { name: 'I&M Bank Rwanda', type: 'bank', icon: getBankLogoUrl('I&M Bank Rwanda') || '🏦' },
    { name: 'Equity Bank Rwanda', type: 'bank', icon: getBankLogoUrl('Equity Bank Rwanda') || '🏦' },
    { name: 'Ecobank', type: 'bank', icon: getBankLogoUrl('Ecobank') || '🏦' },
    { name: 'Stanbic Bank', type: 'bank', icon: getBankLogoUrl('Stanbic Bank') || '🏦' },
  ],
  Nigeria: [
    { name: 'OPay', type: 'mobile_money', icon: getBankLogoUrl('OPay') || '📱' },
    { name: 'PalmPay', type: 'mobile_money', icon: getBankLogoUrl('PalmPay') || '📱' },
    { name: 'GTBank', type: 'bank', icon: getBankLogoUrl('GTBank') || '🏦' },
    { name: 'Access Bank', type: 'bank', icon: getBankLogoUrl('Access Bank') || '🏦' },
    { name: 'First Bank', type: 'bank', icon: getBankLogoUrl('First Bank') || '🏦' },
    { name: 'UBA', type: 'bank', icon: getBankLogoUrl('UBA') || '🏦' },
    { name: 'Zenith Bank', type: 'bank', icon: getBankLogoUrl('Zenith Bank') || '🏦' },
    { name: 'Fidelity Bank', type: 'bank', icon: getBankLogoUrl('Fidelity Bank') || '🏦' },
    { name: 'Stanbic IBTC', type: 'bank', icon: getBankLogoUrl('Stanbic IBTC') || '🏦' },
    { name: 'Polaris Bank', type: 'bank', icon: getBankLogoUrl('Polaris Bank') || '🏦' },
    { name: 'Ecobank', type: 'bank', icon: getBankLogoUrl('Ecobank') || '🏦' },
    { name: 'Standard Chartered Bank', type: 'bank', icon: getBankLogoUrl('Standard Chartered Bank') || '🏦' },
  ],
  Ghana: [
    { name: 'MTN Mobile Money', type: 'mobile_money', icon: getBankLogoUrl('MTN Mobile Money') || '📱' },
    { name: 'Vodafone Cash', type: 'mobile_money', icon: getBankLogoUrl('Vodafone Cash') || '📱' },
    { name: 'Airtel Money', type: 'mobile_money', icon: getBankLogoUrl('Airtel Money') || '📱' },
    { name: 'GCB Bank', type: 'bank', icon: getBankLogoUrl('GCB Bank') || '🏦' },
    { name: 'Ecobank', type: 'bank', icon: getBankLogoUrl('Ecobank') || '🏦' },
    { name: 'Absa Bank', type: 'bank', icon: getBankLogoUrl('Absa Bank') || '🏦' },
    { name: 'Fidelity Bank', type: 'bank', icon: getBankLogoUrl('Fidelity Bank') || '🏦' },
    { name: 'Standard Chartered Bank', type: 'bank', icon: getBankLogoUrl('Standard Chartered Bank') || '🏦' },
    { name: 'Stanbic Bank', type: 'bank', icon: getBankLogoUrl('Stanbic Bank') || '🏦' },
  ],
  'South Africa': [
    { name: 'FNB', type: 'bank', icon: getBankLogoUrl('FNB') || '🏦' },
    { name: 'Nedbank', type: 'bank', icon: getBankLogoUrl('Nedbank') || '🏦' },
    { name: 'Standard Bank SA', type: 'bank', icon: getBankLogoUrl('Standard Bank SA') || '🏦' },
    { name: 'Capitec', type: 'bank', icon: getBankLogoUrl('Capitec') || '🏦' },
    { name: 'ABSA South Africa', type: 'bank', icon: getBankLogoUrl('ABSA South Africa') || '🏦' },
    { name: 'Investec', type: 'bank', icon: getBankLogoUrl('Investec') || '🏦' },
    { name: 'Bidvest Bank', type: 'bank', icon: getBankLogoUrl('Bidvest Bank') || '🏦' },
  ],
  'United Kingdom': [
    { name: 'Lloyds Bank', type: 'bank', icon: getBankLogoUrl('Lloyds Bank') || '🏦' },
    { name: 'Barclays', type: 'bank', icon: getBankLogoUrl('Barclays') || '🏦' },
    { name: 'HSBC', type: 'bank', icon: getBankLogoUrl('HSBC') || '🏦' },
    { name: 'NatWest', type: 'bank', icon: getBankLogoUrl('NatWest') || '🏦' },
    { name: 'Santander', type: 'bank', icon: getBankLogoUrl('Santander') || '🏦' },
    { name: 'Halifax', type: 'bank', icon: getBankLogoUrl('Halifax') || '🏦' },
    { name: 'Nationwide', type: 'bank', icon: getBankLogoUrl('Nationwide') || '🏦' },
    { name: 'TSB', type: 'bank', icon: getBankLogoUrl('TSB') || '🏦' },
    { name: 'Metro Bank', type: 'bank', icon: getBankLogoUrl('Metro Bank') || '🏦' },
    { name: 'Starling Bank', type: 'digital_wallet', icon: getBankLogoUrl('Starling Bank') || '💳' },
    { name: 'Monzo', type: 'digital_wallet', icon: getBankLogoUrl('Monzo') || '💳' },
    { name: 'Revolut', type: 'digital_wallet', icon: getBankLogoUrl('Revolut') || '💳' },
    { name: 'Wise', type: 'digital_wallet', icon: getBankLogoUrl('Wise') || '💳' },
    { name: 'Standard Chartered Bank', type: 'bank', icon: getBankLogoUrl('Standard Chartered Bank') || '🏦' },
  ],
  'United States': [
    { name: 'Chase', type: 'bank', icon: getBankLogoUrl('Chase') || '🏦' },
    { name: 'Bank of America', type: 'bank', icon: getBankLogoUrl('Bank of America') || '🏦' },
    { name: 'Wells Fargo', type: 'bank', icon: getBankLogoUrl('Wells Fargo') || '🏦' },
    { name: 'Citibank', type: 'bank', icon: getBankLogoUrl('Citibank') || '🏦' },
    { name: 'Capital One', type: 'bank', icon: getBankLogoUrl('Capital One') || '🏦' },
    { name: 'Venmo', type: 'digital_wallet', icon: getBankLogoUrl('Venmo') || '💳' },
    { name: 'Cash App', type: 'digital_wallet', icon: getBankLogoUrl('Cash App') || '💳' },
    { name: 'PayPal', type: 'digital_wallet', icon: getBankLogoUrl('PayPal') || '💳' },
    { name: 'Revolut', type: 'digital_wallet', icon: getBankLogoUrl('Revolut') || '💳' },
    { name: 'Wise', type: 'digital_wallet', icon: getBankLogoUrl('Wise') || '💳' },
  ],
  'European Union': [
    { name: 'Revolut', type: 'digital_wallet', icon: getBankLogoUrl('Revolut') || '💳' },
    { name: 'Wise', type: 'digital_wallet', icon: getBankLogoUrl('Wise') || '💳' },
    { name: 'N26', type: 'digital_wallet', icon: getBankLogoUrl('N26') || '💳' },
    { name: 'Deutsche Bank', type: 'bank', icon: getBankLogoUrl('Deutsche Bank') || '🏦' },
    { name: 'BNP Paribas', type: 'bank', icon: getBankLogoUrl('BNP Paribas') || '🏦' },
    { name: 'ING', type: 'bank', icon: getBankLogoUrl('ING') || '🏦' },
    { name: 'Rabobank', type: 'bank', icon: getBankLogoUrl('Rabobank') || '🏦' },
    { name: 'Santander', type: 'bank', icon: getBankLogoUrl('Santander') || '🏦' },
    { name: 'HSBC', type: 'bank', icon: getBankLogoUrl('HSBC') || '🏦' },
  ],
  UAE: [
    { name: 'Emirates NBD', type: 'bank', icon: getBankLogoUrl('Emirates NBD') || '🏦' },
    { name: 'FAB (First Abu Dhabi Bank)', type: 'bank', icon: getBankLogoUrl('FAB (First Abu Dhabi Bank)') || '🏦' },
    { name: 'ENBD', type: 'bank', icon: getBankLogoUrl('ENBD') || '🏦' },
    { name: 'Mashreq Bank', type: 'bank', icon: getBankLogoUrl('Mashreq Bank') || '🏦' },
    { name: 'Standard Chartered Bank', type: 'bank', icon: getBankLogoUrl('Standard Chartered Bank') || '🏦' },
    { name: 'HSBC UAE', type: 'bank', icon: getBankLogoUrl('HSBC UAE') || '🏦' },
    { name: 'Revolut', type: 'digital_wallet', icon: getBankLogoUrl('Revolut') || '💳' },
    { name: 'Wise', type: 'digital_wallet', icon: getBankLogoUrl('Wise') || '💳' },
  ],
  Canada: [
    { name: 'RBC Royal Bank', type: 'bank', icon: getBankLogoUrl('RBC Royal Bank') || '🏦' },
    { name: 'TD Bank', type: 'bank', icon: getBankLogoUrl('TD Bank') || '🏦' },
    { name: 'Scotiabank', type: 'bank', icon: getBankLogoUrl('Scotiabank') || '🏦' },
    { name: 'BMO Bank', type: 'bank', icon: getBankLogoUrl('BMO Bank') || '🏦' },
    { name: 'CIBC', type: 'bank', icon: getBankLogoUrl('CIBC') || '🏦' },
    { name: 'Wise', type: 'digital_wallet', icon: getBankLogoUrl('Wise') || '💳' },
    { name: 'Revolut', type: 'digital_wallet', icon: getBankLogoUrl('Revolut') || '💳' },
  ],
  Australia: [
    { name: 'Commonwealth Bank', type: 'bank', icon: getBankLogoUrl('Commonwealth Bank') || '🏦' },
    { name: 'ANZ Bank', type: 'bank', icon: getBankLogoUrl('ANZ Bank') || '🏦' },
    { name: 'Westpac', type: 'bank', icon: getBankLogoUrl('Westpac') || '🏦' },
    { name: 'NAB', type: 'bank', icon: getBankLogoUrl('NAB') || '🏦' },
    { name: 'Revolut', type: 'digital_wallet', icon: getBankLogoUrl('Revolut') || '💳' },
    { name: 'Wise', type: 'digital_wallet', icon: getBankLogoUrl('Wise') || '💳' },
  ],
  India: [
    { name: 'PhonePe', type: 'mobile_money', icon: getBankLogoUrl('PhonePe') || '📱' },
    { name: 'Paytm', type: 'mobile_money', icon: getBankLogoUrl('Paytm') || '📱' },
    { name: 'GPay', type: 'mobile_money', icon: getBankLogoUrl('GPay') || '📱' },
    { name: 'State Bank of India', type: 'bank', icon: getBankLogoUrl('State Bank of India') || '🏦' },
    { name: 'HDFC Bank', type: 'bank', icon: getBankLogoUrl('HDFC Bank') || '🏦' },
    { name: 'ICICI Bank', type: 'bank', icon: getBankLogoUrl('ICICI Bank') || '🏦' },
    { name: 'Axis Bank', type: 'bank', icon: getBankLogoUrl('Axis Bank') || '🏦' },
    { name: 'Standard Chartered Bank', type: 'bank', icon: getBankLogoUrl('Standard Chartered Bank') || '🏦' },
    { name: 'HSBC India', type: 'bank', icon: getBankLogoUrl('HSBC India') || '🏦' },
  ],
};

export default function Finance() {
  const { transactions, balance, requisitions, updateRequisitionStatus, user, addRequisition, addTransaction, purchaseOrders, approvePurchaseOrder, exports, farms, formatCurrency, financeAccounts, addFinanceAccount, updateFinanceAccount, deleteFinanceAccount } = useApp();
  const [showReqModal, setShowReqModal] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<FinanceAccount | null>(null);
  const [newReq, setNewReq] = useState<Partial<Requisition>>({ category: 'OTHER', priority: 'STANDARD' });
  const [newTx, setNewTx] = useState<Partial<Transaction>>({ type: 'INCOME', paymentMethod: 'CASH' });
  const [reportFilter, setReportFilter] = useState<'ALL' | 'TODAY' | 'MONTH' | 'YEAR'>('ALL');

  const [transferFromId, setTransferFromId] = useState('');
  const [transferToId, setTransferToId] = useState('');
  const [transferAmount, setTransferAmount] = useState(0);
  const [transferNote, setTransferNote] = useState('');
  const [transferOverdraft, setTransferOverdraft] = useState(false);
  const [transferError, setTransferError] = useState('');

  const userCountry = user?.location || '';
  const countryProviders = COUNTRY_PROVIDERS[userCountry] || [];
  const allProviderNames = countryProviders.map(p => p.name);
  // Allow custom entry for countries not in preset list
  const showCustomProvider = countryProviders.length === 0;

  const handleAccountSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const provider = fd.get('provider') as string;
    const name = fd.get('name') as string || provider;
    const bal = parseFloat(fd.get('balance') as string) || 0;
    const providerMeta = countryProviders.find(p => p.name === provider);
    const rawType = providerMeta?.type || (fd.get('type') as string) || 'bank';
    const typeMap: Record<string, FinanceAccount['type']> = { bank: 'BANK', mobile_money: 'MOBILE_MONEY', digital_wallet: 'WALLET', cash: 'CASH', BANK: 'BANK', MOBILE_MONEY: 'MOBILE_MONEY', WALLET: 'WALLET', CASH: 'CASH' };
    const acct: FinanceAccount = {
      id: editingAccount?.id || crypto.randomUUID(),
      name,
      provider,
      type: typeMap[rawType] || 'BANK',
      currency: user?.preferredCurrency || 'USD',
      balance: bal,
      country: userCountry,
      lastUpdated: new Date().toISOString(),
    };
    if (editingAccount) {
      updateFinanceAccount(acct);
    } else {
      addFinanceAccount(acct);
    }
    setShowAccountModal(false);
    setEditingAccount(null);
  };

  const handleTransfer = () => {
    setTransferError('');
    if (!transferFromId || !transferToId || !transferAmount || transferAmount <= 0) {
      setTransferError('Please fill in all transfer fields with a valid amount.');
      return;
    }
    if (transferFromId === transferToId) {
      setTransferError('Source and destination accounts must be different.');
      return;
    }
    const fromAcct = financeAccounts.find(a => a.id === transferFromId);
    const toAcct = financeAccounts.find(a => a.id === transferToId);
    if (!fromAcct || !toAcct) return;

    if (fromAcct.balance < transferAmount && !transferOverdraft) {
      setTransferError(`Insufficient funds. Balance: ${formatCurrency(fromAcct.balance)}. Enable overdraft to proceed.`);
      return;
    }

    // Deduct from source
    updateFinanceAccount({ ...fromAcct, balance: fromAcct.balance - transferAmount, lastUpdated: new Date().toISOString() });
    // Add to destination
    updateFinanceAccount({ ...toAcct, balance: toAcct.balance + transferAmount, lastUpdated: new Date().toISOString() });
    // Record transaction
    addTransaction({
      id: crypto.randomUUID(),
      type: 'EXPENSE',
      category: 'Transfer',
      amount: transferAmount,
      description: transferNote || `Transfer from ${fromAcct.provider} to ${toAcct.provider}`,
      date: new Date().toISOString(),
      paymentMethod: 'BANK_TRANSFER',
      reference: `TRF-${Date.now()}`,
    } as Transaction);

    setShowTransferModal(false);
    setTransferFromId('');
    setTransferToId('');
    setTransferAmount(0);
    setTransferNote('');
    setTransferOverdraft(false);
    setTransferError('');
  };

  const filteredTransactions = transactions.filter(tx => {
    const d = new Date(tx.date);
    const now = new Date();
    if (reportFilter === 'TODAY') return d.toDateString() === now.toDateString();
    if (reportFilter === 'MONTH') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    if (reportFilter === 'YEAR') return d.getFullYear() === now.getFullYear();
    return true;
  }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleReqSubmit = () => {
    if(newReq.amount && newReq.reason) {
        addRequisition({
            ...newReq,
            id: crypto.randomUUID(),
            staffId: user?.id || 'unknown',
            staffName: user?.name || 'Unknown',
            status: 'PENDING',
            date: new Date().toISOString()
        } as Requisition);
        setShowReqModal(false);
        setNewReq({ category: 'OTHER', priority: 'STANDARD' });
    }
  };

  const handleTxSubmit = () => {
    if (newTx.amount && newTx.category) {
        addTransaction({
            ...newTx,
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            description: newTx.description || 'Manual Ledger Entry',
        } as Transaction);
        // Update linked account balance if selected
        if (newTx.accountId) {
            const acct = financeAccounts.find(a => a.id === newTx.accountId);
            if (acct) {
                const delta = newTx.type === 'INCOME' ? newTx.amount : -newTx.amount;
                updateFinanceAccount({ ...acct, balance: acct.balance + delta, lastUpdated: new Date().toISOString() });
            }
        }
        setShowTxModal(false);
        setNewTx({ type: 'INCOME', paymentMethod: 'CASH' });
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(10, 10, 26);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(0, 194, 255);
    doc.setFontSize(24);
    doc.text("NEXA AGRI", 15, 25);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(`Financial Audit Report - ${reportFilter}`, 15, 33);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 15, 25, { align: 'right' });

    // Summary Box
    doc.setFillColor(245, 245, 245);
    doc.rect(15, 50, pageWidth - 30, 30, 'F');
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Summary:`, 20, 60);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    const totalIn = filteredTransactions.filter(t => t.type === 'INCOME').reduce((a, b) => a + b.amount, 0);
    const totalOut = filteredTransactions.filter(t => t.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0);
    
    doc.text(`Total Income: ${formatCurrency(totalIn)}`, 20, 70);
    doc.text(`Total Expenses: ${formatCurrency(totalOut)}`, pageWidth / 2, 70);
    doc.text(`Net Cashflow: ${formatCurrency(totalIn - totalOut)}`, 20, 76);

    // Table Header
    let y = 95;
    doc.setFillColor(50, 50, 50);
    doc.rect(15, y, pageWidth - 30, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text("Date", 20, y + 7);
    doc.text("Description", 50, y + 7);
    doc.text("Category", 120, y + 7);
    doc.text("Amount", pageWidth - 20, y + 7, { align: 'right' });

    // Rows
    y += 10;
    doc.setTextColor(50, 50, 50);
    filteredTransactions.forEach((tx, i) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        if (i % 2 === 0) {
            doc.setFillColor(252, 252, 252);
            doc.rect(15, y, pageWidth - 30, 10, 'F');
        }
        doc.text(new Date(tx.date).toLocaleDateString(), 20, y + 7);
        doc.text(tx.description.substring(0, 35), 50, y + 7);
        doc.text(tx.category, 120, y + 7);
        const prefix = tx.type === 'INCOME' ? '+' : '-';
        doc.setTextColor(tx.type === 'INCOME' ? 0 : 200, tx.type === 'INCOME' ? 150 : 0, 0);
        doc.text(`${prefix}${formatCurrency(tx.amount)}`, pageWidth - 20, y + 7, { align: 'right' });
        doc.setTextColor(50, 50, 50);
        y += 10;
    });

    doc.save(`NexaAgri_Report_${reportFilter}_${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-6 md:space-y-8 pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
         <div className="bg-slate-900 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 text-white shadow-2xl relative overflow-hidden group">
             <p className="text-slate-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest md:tracking-[0.3em] mb-2 md:mb-4">Consolidated Liquidity</p>
             <h1 className="text-3xl md:text-5xl font-black tracking-tighter truncate">{formatCurrency(balance)}</h1>
             <div className="absolute right-4 top-4 opacity-5 group-hover:opacity-10 transition-opacity"><DollarSign size={100} /></div>
         </div>
         <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 text-slate-800 dark:text-white shadow-xl relative overflow-hidden group border border-slate-100 dark:border-slate-800">
             <p className="text-slate-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest md:tracking-[0.3em] mb-2 md:mb-4">Operational Outflow</p>
             <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-red-600 truncate">{formatCurrency(transactions.filter(t => t.type === 'EXPENSE').reduce((a,b)=>a+b.amount, 0))}</h1>
             <div className="absolute right-4 bottom-4 opacity-5 group-hover:rotate-12 transition-transform"><TrendingDown size={80} /></div>
         </div>
         <div className="bg-emerald-600 rounded-2xl md:rounded-[2.5rem] p-5 md:p-8 text-white shadow-2xl relative overflow-hidden group sm:col-span-2 xl:col-span-1">
             <p className="text-emerald-100 text-[9px] md:text-[10px] font-bold uppercase tracking-widest md:tracking-[0.3em] mb-2 md:mb-4">Contract Asset Value</p>
             <h1 className="text-3xl md:text-5xl font-black tracking-tighter truncate">{formatCurrency(exports.reduce((a,b)=>a+b.totalValue, 0))}</h1>
             <div className="absolute right-4 bottom-4 opacity-10 group-hover:-rotate-12 transition-transform"><TrendingUp size={80} /></div>
         </div>
      </div>

      {/* Finance Accounts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center">
            <Landmark size={14} className="mr-2 text-blue-500" /> Financial Accounts {userCountry && <span className="ml-2 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-[8px]">{userCountry}</span>}
          </h3>
          <div className="flex items-center space-x-4">
            {financeAccounts.length >= 2 && (
              <button onClick={() => { setTransferFromId(''); setTransferToId(''); setTransferAmount(0); setTransferNote(''); setTransferError(''); setTransferOverdraft(false); setShowTransferModal(true); }} className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">
                <ArrowRight size={14} /> <span>Transfer</span>
              </button>
            )}
            <button onClick={() => { setEditingAccount(null); setShowAccountModal(true); }} className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors">
              <Plus size={14} /> <span>Add Account</span>
            </button>
          </div>
        </div>
        {financeAccounts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-12 text-center border border-dashed border-slate-200 dark:border-slate-800">
            <Wallet size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 mb-1">No accounts linked yet</p>
            <p className="text-[10px] text-slate-300 dark:text-slate-600">Add your bank, mobile money, or digital wallet accounts to track balances</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {financeAccounts.map(acct => (
              <div key={acct.id} className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm group relative overflow-hidden hover:shadow-md transition-shadow">
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                  <button onClick={() => { setEditingAccount(acct); setShowAccountModal(true); }} className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-500 transition-colors"><Pencil size={12} /></button>
                  <button onClick={() => deleteFinanceAccount(acct.id)} className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
                </div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden ${acct.type === 'mobile_money' ? 'bg-yellow-50 dark:bg-yellow-900/20' : acct.type === 'digital_wallet' ? 'bg-purple-50 dark:bg-purple-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                    {getBankLogoUrl(acct.provider) ? (
                      <img src={getBankLogoUrl(acct.provider)!} alt={acct.provider} className="w-8 h-8 object-contain" onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                    ) : acct.type === 'mobile_money' ? <Smartphone size={18} className="text-yellow-600" /> : acct.type === 'digital_wallet' ? <CreditCard size={18} className="text-purple-600" /> : <Landmark size={18} className="text-blue-600" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{acct.provider}</p>
                    {acct.name !== acct.provider && <p className="text-[9px] text-slate-400 truncate">{acct.name}</p>}
                  </div>
                </div>
                <p className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{formatCurrency(acct.balance)}</p>
                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-2">Updated {new Date(acct.lastUpdated).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {user?.role === 'ADMIN' && requisitions.filter(r => r.status === 'PENDING').length > 0 && (
          <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-4 flex items-center">
                  <AlertCircle size={14} className="mr-2 text-amber-500" /> Pending Authorizations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {requisitions.filter(r => r.status === 'PENDING').map(req => (
                      <div key={req.id} className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border-2 border-amber-500/20 shadow-sm relative overflow-hidden">
                          {req.priority === 'HIGH' && <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black uppercase px-4 py-1.5 rounded-bl-2xl tracking-widest">Urgent</div>}
                          <div className="flex justify-between items-start mb-4">
                              <div className="min-w-0 pr-2">
                                  <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{req.reason}</p>
                                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{req.staffName} • {farms.find(f => f.id === req.farmId)?.name || 'General'}</p>
                              </div>
                              <span className="font-black text-amber-600 text-lg whitespace-nowrap">{formatCurrency(req.amount)}</span>
                          </div>
                          <div className="flex space-x-2">
                              <button onClick={() => updateRequisitionStatus(req.id, 'APPROVED')} className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"><Check size={14} className="mr-1.5"/> Approve</button>
                              <button onClick={() => updateRequisitionStatus(req.id, 'REJECTED')} className="px-4 bg-slate-50 dark:bg-slate-700 border text-red-500 rounded-xl hover:bg-red-50 transition-colors"><X size={18}/></button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r dark:border-slate-800 flex items-center h-8">
                <Filter size={12} className="mr-2" /> Report Scope
              </div>
              {['ALL', 'TODAY', 'MONTH', 'YEAR'].map(k => (
                  <button key={k} onClick={() => setReportFilter(k as any)} className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all uppercase ${reportFilter === k ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-lg' : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}>
                    {k}
                  </button>
              ))}
          </div>
          <div className="flex space-x-3 w-full md:w-auto">
              <button 
                onClick={exportToPDF}
                className="flex items-center space-x-2 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
              >
                  <Download size={14} className="text-blue-500" />
                  <span>Generate Report</span>
              </button>
              <button onClick={() => setShowReqModal(true)} className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"><Plus size={14} className="text-emerald-600" /> <span>Request Fund</span></button>
              {user?.role === 'ADMIN' && <button onClick={() => setShowTxModal(true)} className="flex-1 md:flex-none flex items-center justify-center space-x-2 bg-slate-900 dark:bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:opacity-90 active:scale-95 transition-all"><Plus size={14} /> <span>Manual Entry</span></button>}
          </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 md:p-8 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-black text-slate-900 dark:text-white text-xl tracking-tight uppercase tracking-widest flex items-center">
                  <FileText size={22} className="mr-3 text-blue-500" /> Global Fiscal Ledger
              </h2>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1 pl-9">Full audit trail of all monetary activity</p>
            </div>
            <div className="flex items-center space-x-3 pl-9 sm:pl-0">
                <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                  <Hash size={10} className="mr-1.5" />{filteredTransactions.length} entries
                </span>
                {filteredTransactions.length > 0 && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600">
                    +{formatCurrency(filteredTransactions.filter(t => t.type === 'INCOME').reduce((a, b) => a + b.amount, 0))}
                  </span>
                )}
            </div>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-800/80 max-h-[700px] overflow-y-auto">
            {filteredTransactions.length === 0 ? (
              <div className="p-20 text-center">
                <FileText size={36} className="mx-auto text-slate-200 dark:text-slate-700 mb-4" />
                <p className="text-slate-300 dark:text-slate-600 font-black text-sm uppercase tracking-widest">No ledger data for this period.</p>
              </div>
            ) :
                filteredTransactions.map(tx => {
                    const linkedAcct = tx.accountId ? financeAccounts.find(a => a.id === tx.accountId) : null;
                    const logoUrl = linkedAcct ? getBankLogoUrl(linkedAcct.provider) : null;
                    return (
                    <div key={tx.id} className="px-5 md:px-8 py-4 md:py-5 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors group">
                        <div className="flex items-center space-x-4 min-w-0 flex-1">
                            {/* Type indicator */}
                            <div className={`w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0 transition-transform group-hover:scale-105 ${tx.type === 'INCOME' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : tx.type === 'INITIAL_CAPITAL' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'bg-red-50 dark:bg-red-900/20 text-red-600'}`}>
                                {tx.type === 'INCOME' ? <TrendingUp size={18} /> : tx.type === 'INITIAL_CAPITAL' ? <Wallet size={18} /> : <TrendingDown size={18} />}
                            </div>

                            {/* Account logo badge (if linked) */}
                            {linkedAcct && (
                              <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm" title={linkedAcct.provider}>
                                {logoUrl ? (
                                  <img src={logoUrl} alt={linkedAcct.provider} className="w-6 h-6 object-contain" onError={e => { (e.target as HTMLImageElement).style.display='none'; (e.target as HTMLImageElement).parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-slate-400"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>'; }} />
                                ) : linkedAcct.type === 'MOBILE_MONEY' ? (
                                  <Smartphone size={14} className="text-yellow-600" />
                                ) : linkedAcct.type === 'WALLET' ? (
                                  <CreditCard size={14} className="text-purple-600" />
                                ) : (
                                  <Landmark size={14} className="text-blue-500" />
                                )}
                              </div>
                            )}

                            {/* Main text */}
                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight truncate">{tx.description}</p>
                                <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-1">
                                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center">
                                    <Calendar size={9} className="mr-1"/>{new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                  </span>
                                  <span className="text-slate-200 dark:text-slate-700">·</span>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded-md">{tx.category}</span>
                                  {linkedAcct && (
                                    <>
                                      <span className="text-slate-200 dark:text-slate-700">·</span>
                                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center">
                                        {linkedAcct.type === 'MOBILE_MONEY' ? <Smartphone size={8} className="mr-1 text-yellow-500" /> : linkedAcct.type === 'WALLET' ? <CreditCard size={8} className="mr-1 text-purple-500" /> : <Landmark size={8} className="mr-1 text-blue-500" />}
                                        {linkedAcct.provider}
                                      </span>
                                    </>
                                  )}
                                  {!linkedAcct && tx.paymentMethod !== 'CASH' && (
                                    <>
                                      <span className="text-slate-200 dark:text-slate-700">·</span>
                                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{tx.paymentMethod.replace(/_/g, ' ')}</span>
                                    </>
                                  )}
                                </div>
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                            <span className={`font-black text-xl md:text-2xl tracking-tighter ${tx.type === 'INCOME' ? 'text-emerald-600' : tx.type === 'INITIAL_CAPITAL' ? 'text-blue-600' : 'text-red-600'}`}>
                              {tx.type === 'EXPENSE' ? '−' : '+'}{formatCurrency(tx.amount)}
                            </span>
                            {tx.reference && <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-1">REF: {tx.reference}</p>}
                        </div>
                    </div>
                    );
                })
            }
        </div>
      </div>

      {/* Manual Entry Modal */}
      {showTxModal && (
          <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-[150] p-4 backdrop-blur-xl animate-in zoom-in duration-300">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] w-full max-w-xl shadow-2xl border border-white/10">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Ledger Record</h3>
                    <button onClick={() => setShowTxModal(false)} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:rotate-90 transition-all shadow-sm"><X size={20}/></button>
                  </div>
                  <div className="space-y-6">
                      <div className="flex space-x-2 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl shadow-inner border dark:border-slate-800">
                          <button onClick={() => setNewTx({...newTx, type: 'INCOME'})} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${newTx.type === 'INCOME' ? 'bg-white dark:bg-slate-800 shadow-md text-emerald-600' : 'text-slate-400'}`}>Credit (+)</button>
                          <button onClick={() => setNewTx({...newTx, type: 'EXPENSE'})} className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${newTx.type === 'EXPENSE' ? 'bg-white dark:bg-slate-800 shadow-md text-red-600' : 'text-slate-400'}`}>Debit (-)</button>
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Gross Value ({user?.preferredCurrency})</label>
                          <input type="number" className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-5 rounded-[1.5rem] font-black text-3xl outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner" placeholder="0.00" onChange={e => setNewTx({...newTx, amount: parseFloat(e.target.value)})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Category</label>
                            <input className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-4 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner text-sm" placeholder="e.g. Rent, Bonus" onChange={e => setNewTx({...newTx, category: e.target.value})} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Channel</label>
                            <select className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-4 rounded-2xl font-black outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner text-sm" onChange={e => setNewTx({...newTx, paymentMethod: e.target.value as any})}>
                                <option value="CASH">Liquid Cash</option>
                                <option value="BANK_TRANSFER">Bank/SWIFT</option>
                                <option value="MOBILE_MONEY">Digital Wallet</option>
                            </select>
                        </div>
                      </div>
                      {financeAccounts.length > 0 && (
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Account</label>
                            <select className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-4 rounded-2xl font-black outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner text-sm" onChange={e => setNewTx({...newTx, accountId: e.target.value || undefined})}>
                                <option value="">No specific account</option>
                                {financeAccounts.map(acct => (
                                    <option key={acct.id} value={acct.id}>{acct.provider} — {acct.name !== acct.provider ? acct.name + ' — ' : ''}{formatCurrency(acct.balance)}</option>
                                ))}
                            </select>
                        </div>
                      )}
                      <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Official Memo</label>
                          <input className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-5 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner font-medium text-lg" placeholder="Purpose of transaction..." onChange={e => setNewTx({...newTx, description: e.target.value})} />
                      </div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-10">
                      <button onClick={() => setShowTxModal(false)} className="px-8 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                      <button onClick={handleTxSubmit} className="px-10 py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl text-xs active:scale-95 transition-all">Post Entry</button>
                  </div>
              </div>
          </div>
      )}

      {/* Fund Requisition Modal */}
      {showReqModal && (
          <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-[150] p-4 backdrop-blur-xl animate-in fade-in duration-300">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] w-full max-w-2xl shadow-2xl border border-white/10">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Fund Requisition</h3>
                    <button onClick={() => setShowReqModal(false)} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:rotate-90 transition-all shadow-sm"><X size={20}/></button>
                  </div>
                  <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Project Sector</label>
                              <select className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-4 rounded-2xl font-black outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner text-sm" onChange={e => setNewReq({...newReq, farmId: e.target.value})}>
                                  <option value="">General Org</option>
                                  {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                              </select>
                          </div>
                          <div className="space-y-1.5">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Priority Level</label>
                              <select className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-4 rounded-2xl font-black outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner text-sm" onChange={e => setNewReq({...newReq, priority: e.target.value as any})}>
                                  <option value="STANDARD">Standard</option>
                                  <option value="HIGH">Critical / Urgent</option>
                              </select>
                          </div>
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Requested Value ({user?.preferredCurrency})</label>
                          <input type="number" className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-5 rounded-[1.5rem] font-black text-3xl text-emerald-600 outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner" placeholder="0.00" onChange={e => setNewReq({...newReq, amount: parseFloat(e.target.value)})} />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Business Narrative</label>
                          <textarea className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-5 rounded-2xl h-32 outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner font-medium text-lg leading-relaxed" placeholder="Detailed purpose for fund use..." onChange={e => setNewReq({...newReq, reason: e.target.value})} />
                      </div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-10">
                      <button onClick={() => setShowReqModal(false)} className="px-8 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-2xl transition-all">Cancel</button>
                      <button onClick={handleReqSubmit} className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 text-xs active:scale-95 transition-all">Submit Request</button>
                  </div>
              </div>
          </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-[150] p-4 backdrop-blur-xl animate-in zoom-in duration-300">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] w-full max-w-lg shadow-2xl border border-white/10">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Account Transfer</h3>
                <p className="text-slate-400 text-xs font-medium mt-1">Move funds between your linked accounts</p>
              </div>
              <button onClick={() => setShowTransferModal(false)} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:rotate-90 transition-all shadow-sm"><X size={20}/></button>
            </div>

            {transferError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl text-sm font-bold flex items-center space-x-3 border border-red-100 dark:border-red-800/40">
                <AlertCircle size={18} />
                <span>{transferError}</span>
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">From Account</label>
                <select
                  className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-4 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner text-sm"
                  value={transferFromId}
                  onChange={e => { setTransferFromId(e.target.value); setTransferError(''); }}
                >
                  <option value="">Select source account...</option>
                  {financeAccounts.map(a => (
                    <option key={a.id} value={a.id}>{a.provider} {a.name !== a.provider ? `— ${a.name}` : ''} · {formatCurrency(a.balance)}</option>
                  ))}
                </select>
                {transferFromId && (
                  <p className="text-[10px] font-black text-slate-400 px-2">
                    Available: <span className={`${financeAccounts.find(a => a.id === transferFromId)?.balance! >= transferAmount ? 'text-emerald-600' : 'text-red-500'}`}>
                      {formatCurrency(financeAccounts.find(a => a.id === transferFromId)?.balance || 0)}
                    </span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">To Account</label>
                <select
                  className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-4 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner text-sm"
                  value={transferToId}
                  onChange={e => { setTransferToId(e.target.value); setTransferError(''); }}
                >
                  <option value="">Select destination account...</option>
                  {financeAccounts.filter(a => a.id !== transferFromId).map(a => (
                    <option key={a.id} value={a.id}>{a.provider} {a.name !== a.provider ? `— ${a.name}` : ''} · {formatCurrency(a.balance)}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Amount ({user?.preferredCurrency || 'USD'})</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-5 rounded-[1.5rem] font-black text-3xl outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner"
                  placeholder="0.00"
                  value={transferAmount || ''}
                  onChange={e => { setTransferAmount(parseFloat(e.target.value) || 0); setTransferError(''); }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Reference / Note (optional)</label>
                <input
                  className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-4 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner text-sm"
                  placeholder="e.g. Monthly ops transfer"
                  value={transferNote}
                  onChange={e => setTransferNote(e.target.value)}
                />
              </div>

              {transferFromId && transferAmount > 0 && financeAccounts.find(a => a.id === transferFromId)?.balance! < transferAmount && (
                <button
                  onClick={() => setTransferOverdraft(!transferOverdraft)}
                  className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all flex items-center justify-center space-x-2 ${transferOverdraft ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 text-slate-500'}`}
                >
                  <AlertCircle size={14} />
                  <span>{transferOverdraft ? 'Overdraft enabled — funds will go negative' : 'Allow overdraft to proceed'}</span>
                </button>
              )}
            </div>

            <div className="flex justify-end space-x-4 mt-10">
              <button onClick={() => setShowTransferModal(false)} className="px-8 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
              <button onClick={handleTransfer} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl text-xs active:scale-95 transition-all flex items-center space-x-2">
                <ArrowRight size={16} />
                <span>Transfer Funds</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Finance Account Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center z-[150] p-4 backdrop-blur-xl animate-in zoom-in duration-300">
          <form onSubmit={handleAccountSubmit} className="bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] w-full max-w-lg shadow-2xl border border-white/10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{editingAccount ? 'Edit Account' : 'Add Account'}</h3>
              <button type="button" onClick={() => { setShowAccountModal(false); setEditingAccount(null); }} className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:rotate-90 transition-all shadow-sm"><X size={20}/></button>
            </div>
            <div className="space-y-6">
              {showCustomProvider ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Provider / Institution</label>
                    <input name="provider" defaultValue={editingAccount?.provider || ''} required className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-4 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner text-sm" placeholder="e.g. Chase, M-Pesa" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Account Type</label>
                    <select name="type" defaultValue={editingAccount?.type || 'bank'} className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-4 rounded-2xl font-black outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner text-sm">
                      <option value="bank">Bank</option>
                      <option value="mobile_money">Mobile Money</option>
                      <option value="digital_wallet">Digital Wallet</option>
                    </select>
                  </div>
                </>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Financial Provider</label>
                  <select name="provider" defaultValue={editingAccount?.provider || ''} required className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-4 rounded-2xl font-black outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner text-sm">
                    <option value="">Select a provider...</option>
                    {countryProviders.map(p => (
                      <option key={p.name} value={p.name}>{p.icon} {p.name}</option>
                    ))}
                  </select>
                  {/* Logo preview of selected provider */}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Account Label (optional)</label>
                <input name="name" defaultValue={editingAccount?.name || ''} className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-4 rounded-2xl font-bold outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner text-sm" placeholder="e.g. Savings, Operations" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Current Balance ({user?.preferredCurrency || 'USD'})</label>
                <input name="balance" type="number" step="0.01" defaultValue={editingAccount?.balance || ''} required className="w-full border-none bg-slate-50 dark:bg-slate-950 dark:text-white p-5 rounded-[1.5rem] font-black text-3xl outline-none focus:ring-4 focus:ring-emerald-500/20 shadow-inner" placeholder="0.00" />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-10">
              <button type="button" onClick={() => { setShowAccountModal(false); setEditingAccount(null); }} className="px-8 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
              <button type="submit" className="px-10 py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl text-xs active:scale-95 transition-all">{editingAccount ? 'Update' : 'Add Account'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}