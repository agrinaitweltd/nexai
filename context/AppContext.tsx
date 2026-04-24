import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User, Farm, InventoryItem, Transaction, Requisition, ExportOrder, Notification, Harvest, Crop, Animal,
  StaffMember, StaffPayment, Client, StaffTask, DashboardWidget, Theme, DashboardTheme, Permission,
  SubscriptionPlanId, CropStatus, AppDocument, Message, Announcement, PurchaseOrder, PendingSignup,
  ActivationStatus, Department, FinanceAccount
} from '../types';
import { supabase } from '../supabaseClient';

const MAX_REJECTIONS = 3;
const SUPER_ADMIN_EMAIL = 'admin@nexaagri.com';

// ── Supabase row ↔ App object mappers ────────────────────────

function profileToUser(p: any): User {
  return {
    id: p.id,
    name: p.full_name,
    email: p.email,
    role: p.role === 'SUPER_ADMIN' ? 'ADMIN' : p.role,
    phone: p.phone ?? undefined,
    location: p.country ?? undefined,
    sector: p.sector ?? 'GENERAL',
    businessCategory: p.business_category ?? undefined,
    businessType: p.business_type ?? undefined,
    companyName: p.company_name ?? undefined,
    companyAddress: p.company_address ?? undefined,
    employeeCount: p.employee_count ?? undefined,
    contactEmail: p.contact_email ?? undefined,
    setupComplete: p.setup_complete ?? false,
    tutorialCompleted: p.tutorial_completed ?? false,
    theme: p.theme ?? 'dark',
    dashboardTheme: p.dashboard_theme ?? 'emerald',
    dashboardWidgets: p.dashboard_widgets ?? [],
    subscriptionPlan: p.subscription_plan ?? undefined,
    preferredCurrency: p.preferred_currency ?? 'USD',
    initialBalance: p.initial_balance ?? 0,
    activationStatus: p.activation_status ?? 'PENDING',
    rejectionCount: p.rejection_count ?? 0,
    regNumber: p.reg_number ?? undefined,
    tin: p.tin ?? undefined,
    directors: p.directors ?? undefined,
    businessSize: p.business_size ?? undefined,
    ucdaNumber: p.ucda_number ?? undefined,
    assignedFarmIds: p.assigned_farm_ids ?? [],
    departmentId: p.department_id ?? undefined,
    permissions: p.permissions ?? [],
  };
}

function userToProfileUpdate(u: Partial<User>): Record<string, any> {
  const map: Record<string, any> = {};
  if (u.name !== undefined)             map.full_name = u.name;
  if (u.email !== undefined)            map.email = u.email;
  if (u.role !== undefined)             map.role = u.role;
  if (u.phone !== undefined)            map.phone = u.phone;
  if (u.location !== undefined)         map.country = u.location;
  if (u.sector !== undefined)           map.sector = u.sector;
  if (u.businessCategory !== undefined) map.business_category = u.businessCategory;
  if (u.businessType !== undefined)     map.business_type = u.businessType;
  if (u.companyName !== undefined)      map.company_name = u.companyName;
  if (u.companyAddress !== undefined)   map.company_address = u.companyAddress;
  if (u.employeeCount !== undefined)    map.employee_count = u.employeeCount;
  if (u.contactEmail !== undefined)     map.contact_email = u.contactEmail;
  if (u.setupComplete !== undefined)    map.setup_complete = u.setupComplete;
  if (u.tutorialCompleted !== undefined) map.tutorial_completed = u.tutorialCompleted;
  if (u.theme !== undefined)            map.theme = u.theme;
  if (u.dashboardTheme !== undefined)   map.dashboard_theme = u.dashboardTheme;
  if (u.dashboardWidgets !== undefined) map.dashboard_widgets = u.dashboardWidgets;
  if (u.subscriptionPlan !== undefined) map.subscription_plan = u.subscriptionPlan;
  if (u.preferredCurrency !== undefined) map.preferred_currency = u.preferredCurrency;
  if (u.initialBalance !== undefined)   map.initial_balance = u.initialBalance;
  if (u.activationStatus !== undefined) map.activation_status = u.activationStatus;
  if (u.rejectionCount !== undefined)   map.rejection_count = u.rejectionCount;
  if (u.regNumber !== undefined)        map.reg_number = u.regNumber;
  if (u.tin !== undefined)              map.tin = u.tin;
  if (u.directors !== undefined)        map.directors = u.directors;
  if (u.businessSize !== undefined)     map.business_size = u.businessSize;
  if (u.ucdaNumber !== undefined)       map.ucda_number = u.ucdaNumber;
  if (u.assignedFarmIds !== undefined)  map.assigned_farm_ids = u.assignedFarmIds;
  if (u.departmentId !== undefined)     map.department_id = u.departmentId;
  if (u.permissions !== undefined)      map.permissions = u.permissions;
  return map;
}

function rowToFarm(r: any): Farm {
  return { id: r.id, name: r.name, location: r.location, size: r.size, farmingType: r.farming_type, staffIds: r.staff_ids ?? [], initialAssets: r.initial_assets ?? [], notes: r.notes };
}
function rowToCrop(r: any): Crop {
  return { id: r.id, farmId: r.farm_id, name: r.name, variety: r.variety, status: r.status, plantedDate: r.planted_date };
}
function rowToHarvest(r: any): Harvest {
  return { id: r.id, farmId: r.farm_id, cropId: r.crop_id, cropName: r.crop_name, grade: r.grade, quantity: r.quantity, unit: r.unit, date: r.date, status: r.status, notes: r.notes, history: r.history ?? [] };
}
function rowToInventory(r: any): InventoryItem {
  return { id: r.id, productName: r.product_name, grade: r.grade, quantity: r.quantity, unit: r.unit, location: r.location, lastUpdated: r.last_updated, costPerUnit: r.cost_per_unit, lowStockThreshold: r.low_stock_threshold };
}
function rowToAnimal(r: any): Animal {
  return { id: r.id, type: r.type, breed: r.breed, quantity: r.quantity, status: r.status, location: r.location, age: r.age, notes: r.notes };
}
function rowToTransaction(r: any): Transaction {
  return { id: r.id, type: r.type, category: r.category, amount: r.amount, description: r.description, date: r.date, paymentMethod: r.payment_method, reference: r.reference };
}
function rowToExport(r: any): ExportOrder {
  return { id: r.id, missionType: r.mission_type, clientId: r.client_id, buyerName: r.buyer_name, buyerCountry: r.buyer_country, buyerEmail: r.buyer_email, buyerPhone: r.buyer_phone, productName: r.product_name, grade: r.grade, quantity: r.quantity, unit: r.unit, pricePerUnit: r.price_per_unit, status: r.status, shipmentNumber: r.shipment_number, shippingCost: r.shipping_cost, totalValue: r.total_value, amountPaid: r.amount_paid, date: r.date, originWarehouse: r.origin_warehouse, originLocation: r.origin_location, destinationPort: r.destination_port, destinationCountry: r.destination_country, transitPorts: r.transit_ports, transportProvider: r.transport_provider, transportMethod: r.transport_method, portOfExit: r.port_of_exit };
}
function rowToClient(r: any): Client {
  return { id: r.id, name: r.name, type: r.type, country: r.country, email: r.email, phone: r.phone, totalOrders: r.total_orders, totalValue: r.total_value, joinedDate: r.joined_date };
}
function rowToStaff(r: any): StaffMember {
  return { id: r.id, name: r.name, role: r.role, salary: r.salary, currency: r.currency, frequency: r.frequency, phone: r.phone, email: r.email, assignedFarmIds: r.assigned_farm_ids ?? [], departmentId: r.department_id, status: r.status, joinedDate: r.joined_date, permissions: r.permissions ?? [], tasks: r.tasks ?? [] };
}
function rowToStaffPayment(r: any): StaffPayment {
  return { id: r.id, staffId: r.staff_id, staffName: r.staff_name, amount: r.amount, date: r.date, period: r.period, method: r.method, reference: r.reference };
}
function rowToRequisition(r: any): Requisition {
  return { id: r.id, staffId: r.staff_id, staffName: r.staff_name, farmId: r.farm_id, amount: r.amount, reason: r.reason, category: r.category, status: r.status, priority: r.priority, date: r.date };
}
function rowToPurchaseOrder(r: any): PurchaseOrder {
  return { id: r.id, supplierId: r.supplier_id, supplierName: r.supplier_name, date: r.date, expectedDate: r.expected_date, status: r.status, items: r.items ?? [], totalAmount: r.total_amount, amountPaid: r.amount_paid, paymentStatus: r.payment_status, orderNumber: r.order_number, notes: r.notes };
}
function rowToNotification(r: any): Notification {
  return { id: r.id, message: r.message, read: r.read, date: r.date, type: r.type, link: r.link };
}
function rowToDocument(r: any): AppDocument {
  return { id: r.id, name: r.name, type: r.doc_type, category: r.category, size: r.size, date: r.date, url: r.url, uploadedBy: r.uploaded_by };
}
function rowToMessage(r: any): Message {
  return { id: r.id, senderId: r.sender_id, senderName: r.sender_name, subject: r.subject, content: r.content, date: r.date, read: r.read, type: r.msg_type, priority: r.priority };
}
function rowToAnnouncement(r: any): Announcement {
  return { id: r.id, title: r.title, content: r.content, date: r.date, author: r.author, priority: r.priority };
}
function rowToDepartment(r: any): Department {
  return { id: r.id, name: r.name, description: r.description, managerId: r.manager_id };
}
function rowToPendingSignup(r: any): PendingSignup {
  return { id: r.id, userId: r.user_id, userName: r.user_name, userEmail: r.user_email, transactionId: r.transaction_id, paymentPhone: r.payment_phone, paymentMethod: r.payment_method, bankName: r.bank_name, accountName: r.account_name, date: r.date };
}
function rowToFinanceAccount(r: any): FinanceAccount {
  return { id: r.id, name: r.name, provider: r.provider, type: r.type, currency: r.currency, balance: Number(r.balance), country: r.country, lastUpdated: r.last_updated };
}

// ── Context type ──────────────────────────────────────────────

interface AppContextType {
  user: User | null;
  isSuperAdmin: boolean;
  loading: boolean;
  theme: Theme;
  toggleTheme: () => void;
  logout: () => void;

  farms: Farm[];
  inventory: InventoryItem[];
  transactions: Transaction[];
  notifications: Notification[];
  requisitions: Requisition[];
  crops: Crop[];
  staff: StaffMember[];
  harvests: Harvest[];
  exports: ExportOrder[];
  animals: Animal[];
  clients: Client[];
  documents: AppDocument[];
  messages: Message[];
  announcements: Announcement[];
  purchaseOrders: PurchaseOrder[];
  staffPayments: StaffPayment[];
  pendingSignups: PendingSignup[];
  departments: Department[];

  addFarm: (farm: Farm) => Promise<void>;
  addToInventory: (item: InventoryItem, financeOptions?: any) => Promise<void>;
  addTransaction: (tx: Transaction) => Promise<void>;
  addNotification: (message: string, type: 'INFO' | 'ALERT' | 'SUCCESS', link?: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addCrop: (crop: Crop) => Promise<void>;
  updateCropStatus: (id: string, status: CropStatus) => Promise<void>;
  addHarvest: (harvest: Harvest, financeOptions?: any) => Promise<void>;
  updateHarvest: (harvest: Harvest) => Promise<void>;
  createExport: (order: ExportOrder, initialPayment: number, method: string) => Promise<boolean>;
  updateExportPayment: (id: string, amount: number, method: string) => Promise<void>;
  updateExportStatus: (id: string, status: string) => Promise<boolean>;
  updateRequisitionStatus: (id: string, status: string) => Promise<void>;
  addRequisition: (req: Requisition) => Promise<void>;
  login: (email: string, pass: string) => Promise<boolean | 'PENDING' | 'REJECTED' | 'LIMIT_REACHED' | 'INVALID'>;
  register: (data: any) => Promise<{ success: boolean; message: string; user?: User }>;
  submitVerification: (verification: Omit<PendingSignup, 'id' | 'date'>) => Promise<void>;
  approveSignup: (signupId: string) => Promise<void>;
  rejectSignup: (signupId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  changeUserStatus: (userId: string, status: ActivationStatus) => Promise<void>;
  resetUserStatus: (email: string) => void;
  completeOnboarding: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  isPasswordRecovery: boolean;
  clearPasswordRecovery: () => void;
  addAnimal: (animal: Animal) => Promise<void>;
  addStaff: (staff: StaffMember, pass: string) => Promise<void>;
  payStaff: (payment: StaffPayment) => Promise<void>;
  assignTask: (staffId: string, task: StaffTask) => void;
  updateTaskStatus: (staffId: string, taskId: string, status: string) => void;
  updateStaffPermissions: (staffId: string, perms: Permission[]) => Promise<void>;
  addClient: (client: Client) => Promise<void>;
  replayTutorial: () => void;
  updateDashboardWidgets: (widgets: DashboardWidget[]) => Promise<void>;
  updateDashboardTheme: (theme: DashboardTheme) => Promise<void>;
  selectSubscription: (planId: SubscriptionPlanId) => Promise<void>;

  addDocument: (doc: AppDocument) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  sendMessage: (msg: Message) => Promise<void>;
  markMessageRead: (id: string) => Promise<void>;
  addAnnouncement: (ann: Announcement) => Promise<void>;

  bulkUpdateInventory: (ids: string[], updates: Partial<InventoryItem>) => Promise<void>;
  deleteInventoryItems: (ids: string[]) => Promise<void>;
  deductInventory: (productName: string, grade: string, quantity: number) => Promise<void>;
  approvePurchaseOrder: (id: string) => Promise<void>;
  addPurchaseOrder: (order: PurchaseOrder, initialPayment: number, method: string) => Promise<boolean>;
  updatePurchaseOrderStatus: (id: string, status: string) => Promise<void>;
  payPurchaseOrder: (id: string, amount: number, method: string) => Promise<void>;

  addDepartment: (dept: Department) => Promise<void>;
  updateDepartment: (dept: Department) => Promise<void>;
  deleteDepartment: (id: string) => Promise<void>;

  financeAccounts: FinanceAccount[];
  addFinanceAccount: (acct: FinanceAccount) => Promise<void>;
  updateFinanceAccount: (acct: FinanceAccount) => Promise<void>;
  deleteFinanceAccount: (id: string) => Promise<void>;

  balance: number;
  formatCurrency: (amount: number) => string;
  getAllUsers: () => Promise<User[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  const [loading, setLoading] = useState(true);

  const [farms, setFarms] = useState<Farm[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [exports, setExports] = useState<ExportOrder[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [staffPayments, setStaffPayments] = useState<StaffPayment[]>([]);
  const [documents, setDocuments] = useState<AppDocument[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [pendingSignups, setPendingSignups] = useState<PendingSignup[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [financeAccounts, setFinanceAccounts] = useState<FinanceAccount[]>([]);

  // ── Load all data for a user ─────────────────────────────────

  const loadUserData = useCallback(async (uid: string) => {
    const q = (table: string) => supabase.from(table).select('*').eq('user_id', uid);

    const [
      farmsRes, cropsRes, harvestsRes, invRes, animalsRes, txRes, exportsRes,
      clientsRes, staffRes, spRes, reqRes, poRes, notifRes, docRes, msgRes, annRes, deptRes, faRes
    ] = await Promise.all([
      q('farms'), q('crops'), q('harvests'), q('inventory'), q('animals'),
      q('transactions'), q('export_orders'), q('clients'), q('staff_members'),
      q('staff_payments'), q('requisitions'), q('purchase_orders'), q('notifications'),
      q('documents'), q('messages'), q('announcements'), q('departments'), q('finance_accounts')
    ]);

    setFarms((farmsRes.data ?? []).map(rowToFarm));
    setCrops((cropsRes.data ?? []).map(rowToCrop));
    setHarvests((harvestsRes.data ?? []).map(rowToHarvest));
    setInventory((invRes.data ?? []).map(rowToInventory));
    setAnimals((animalsRes.data ?? []).map(rowToAnimal));
    setTransactions((txRes.data ?? []).map(rowToTransaction));
    setExports((exportsRes.data ?? []).map(rowToExport));
    setClients((clientsRes.data ?? []).map(rowToClient));
    setStaff((staffRes.data ?? []).map(rowToStaff));
    setStaffPayments((spRes.data ?? []).map(rowToStaffPayment));
    setRequisitions((reqRes.data ?? []).map(rowToRequisition));
    setPurchaseOrders((poRes.data ?? []).map(rowToPurchaseOrder));
    setNotifications((notifRes.data ?? []).map(rowToNotification));
    setDocuments((docRes.data ?? []).map(rowToDocument));
    setMessages((msgRes.data ?? []).map(rowToMessage));
    setAnnouncements((annRes.data ?? []).map(rowToAnnouncement));
    setDepartments((deptRes.data ?? []).map(rowToDepartment));
    setFinanceAccounts((faRes.data ?? []).map(rowToFinanceAccount));
  }, []);

  // ── Load pending signups (super admin only) ──────────────────

  const loadPendingSignups = useCallback(async () => {
    // Explicitly select columns (exclude tmp_password to avoid PostgREST schema cache issues)
    const { data } = await supabase
      .from('pending_registrations')
      .select('id, email, full_name, phone, country, sector, business_category, business_type, company_name, preferred_currency, transaction_id, payment_phone, payment_method, bank_name, account_name, status, created_at')
      .eq('status', 'PENDING');
    setPendingSignups((data ?? []).map((r: any): PendingSignup => ({
      id: r.id,
      userId: r.id, // no auth user yet; use pending_registration id
      userName: r.full_name,
      userEmail: r.email,
      transactionId: r.transaction_id || '',
      paymentPhone: r.payment_phone || '',
      paymentMethod: r.payment_method || 'MTN',
      bankName: r.bank_name,
      accountName: r.account_name,
      country: r.country || '',
      date: r.created_at,
    })));
  }, []);

  // ── Initialize auth session ──────────────────────────────────

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile && mounted) {
          const u = profileToUser(profile);
          const isSuper = profile.role === 'SUPER_ADMIN';
          setUser(u);
          setIsSuperAdmin(isSuper);
          setTheme((u.theme as Theme) || 'dark');
          await loadUserData(session.user.id);
          if (isSuper) await loadPendingSignups();
        }
      }
      if (mounted) setLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY' && mounted) {
        // Supabase has set the session from the recovery link — signal the UI
        setIsPasswordRecovery(true);
        return;
      }
      if (event === 'SIGNED_IN' && session?.user && mounted) {
        // If signing in normally (not recovery), make sure recovery flag is cleared
        // We only keep it if it was already set by PASSWORD_RECOVERY
      }
      if (event === 'SIGNED_OUT' && mounted) {
        setUser(null);
        setIsSuperAdmin(false);
        setFarms([]); setInventory([]); setTransactions([]); setNotifications([]);
        setRequisitions([]); setCrops([]); setStaff([]); setHarvests([]);
        setExports([]); setAnimals([]); setClients([]); setPurchaseOrders([]);
        setStaffPayments([]); setDocuments([]); setMessages([]); setAnnouncements([]);
        setDepartments([]); setPendingSignups([]);
      }
    });

    return () => { mounted = false; subscription.unsubscribe(); };
  }, [loadUserData, loadPendingSignups]);

  // ── Computed values ──────────────────────────────────────────

  const balance = transactions.reduce((acc, curr) => {
    if (curr.type === 'INCOME' || curr.type === 'INITIAL_CAPITAL') return acc + curr.amount;
    if (curr.type === 'TRANSFER') return acc; // inter-account moves don't affect net balance
    return acc - curr.amount;
  }, 0);

  const formatCurrency = (amount: number) => {
    const cur = user?.preferredCurrency || 'UGX';
    const locale = user?.location === 'United States' ? 'en-US' :
                   user?.location === 'United Kingdom' ? 'en-GB' :
                   user?.location === 'Uganda' ? 'en-UG' : undefined;
    try {
      return new Intl.NumberFormat(locale, { style: 'currency', currency: cur, minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount);
    } catch { return `${cur} ${amount.toLocaleString(undefined, { minimumFractionDigits: 0 })}`; }
  };

  // ── Theme ────────────────────────────────────────────────────

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (user) updateUser({ theme: next } as any);
  };

  // ── Auth ─────────────────────────────────────────────────────

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsSuperAdmin(false);
  };

  const login = async (email: string, pass: string): Promise<boolean | 'PENDING' | 'REJECTED' | 'LIMIT_REACHED' | 'INVALID'> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) return 'INVALID';

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
    if (!profile) return 'INVALID';

    if ((profile.rejection_count ?? 0) >= MAX_REJECTIONS) { await supabase.auth.signOut(); return 'LIMIT_REACHED'; }
    if (profile.activation_status === 'PENDING') { await supabase.auth.signOut(); return 'PENDING'; }
    if (profile.activation_status === 'REJECTED') { await supabase.auth.signOut(); return 'REJECTED'; }

    const u = profileToUser(profile);
    const isSuper = profile.role === 'SUPER_ADMIN';
    setUser(u);
    setIsSuperAdmin(isSuper);
    setTheme((u.theme as Theme) || 'dark');
    await loadUserData(data.user.id);
    if (isSuper) await loadPendingSignups();
    return true;
  };

  const CURRENCY_MAP: Record<string, string> = {
    'Uganda': 'UGX', 'Kenya': 'KES', 'Tanzania': 'TZS', 'Nigeria': 'NGN', 'Ghana': 'GHS',
    'South Africa': 'ZAR', 'Rwanda': 'RWF', 'Ethiopia': 'ETB', 'Egypt': 'EGP', 'Morocco': 'MAD',
    'Mauritius': 'MUR', 'Zambia': 'ZMW', 'Botswana': 'BWP', 'Namibia': 'NAD',
    'United States': 'USD', 'United Kingdom': 'GBP'
  };

  const register = async (data: any): Promise<{ success: boolean; message: string; user?: User }> => {
    const isSuperEmail = data.email.toLowerCase() === SUPER_ADMIN_EMAIL;

    // Super admin account is created directly in Supabase auth
    if (isSuperEmail || data.activationStatus === 'ACTIVE') {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
            role: isSuperEmail ? 'SUPER_ADMIN' : data.role || 'ADMIN',
            phone: data.phone || null,
            country: data.location || null,
            sector: data.sector || 'GENERAL',
            business_category: data.businessCategory || null,
            business_type: data.businessType || null,
            company_name: data.companyName || null,
            preferred_currency: CURRENCY_MAP[data.location] || 'USD',
            activation_status: 'ACTIVE',
          }
        }
      });

      if (authError) {
        if (authError.message.toLowerCase().includes('already registered')) {
          return { success: false, message: 'An account with this email already exists.' };
        }
        return { success: false, message: authError.message };
      }

      if (!authData.user) return { success: false, message: 'Signup failed — no user returned.' };

      const profileRow = {
        id: authData.user.id,
        full_name: data.name,
        email: data.email,
        role: isSuperEmail ? 'SUPER_ADMIN' : data.role || 'ADMIN',
        phone: data.phone || null,
        country: data.location || null,
        sector: data.sector || 'GENERAL',
        business_category: data.businessCategory || null,
        business_type: data.businessType || null,
        company_name: data.companyName || null,
        preferred_currency: CURRENCY_MAP[data.location] || 'USD',
        dashboard_theme: 'emerald',
        setup_complete: false,
        activation_status: 'ACTIVE',
        rejection_count: 0,
      };

      const newUser = profileToUser(profileRow);
      return { success: true, message: 'Account created successfully.', user: newUser };
    }

    // Regular signup: create auth user as PENDING, then queue admin review.
    const preferredCurrency = CURRENCY_MAP[data.location] || 'USD';
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.name,
          role: data.role || 'ADMIN',
          phone: data.phone || null,
          country: data.location || null,
          sector: data.sector || 'GENERAL',
          business_category: data.businessCategory || null,
          business_type: data.businessType || null,
          company_name: data.companyName || null,
          preferred_currency: preferredCurrency,
          activation_status: 'PENDING',
        }
      }
    });

    if (authError) {
      if (authError.message.toLowerCase().includes('already registered')) {
        return { success: false, message: 'An account with this email already exists.' };
      }
      return { success: false, message: authError.message };
    }

    if (!authData.user) return { success: false, message: 'Signup failed — no user returned.' };

    const pendingRow = {
      id: authData.user.id,
      email: data.email,
      full_name: data.name,
      phone: data.phone || null,
      country: data.location || null,
      sector: data.sector || 'GENERAL',
      business_category: data.businessCategory || null,
      business_type: data.businessType || null,
      company_name: data.companyName || null,
      preferred_currency: preferredCurrency,
      transaction_id: null,
      payment_phone: null,
      payment_method: null,
      status: 'PENDING',
    };

    const { error: insertErr } = await supabase
      .from('pending_registrations')
      .upsert(pendingRow, { onConflict: 'email' });

    if (insertErr) {
      if (insertErr.message?.toLowerCase().includes('unique') || insertErr.code === '23505') {
        return { success: false, message: 'An account with this email is already pending review.' };
      }
      return { success: false, message: insertErr.message };
    }

    // Build a minimal local user so Login.tsx can proceed to the PAYMENT step
    const localUser: User = profileToUser({
      id: authData.user.id,
      full_name: data.name,
      email: data.email,
      role: 'ADMIN',
      sector: data.sector || 'GENERAL',
      business_category: data.businessCategory || null,
      business_type: data.businessType || null,
      company_name: data.companyName || null,
      preferred_currency: preferredCurrency,
      dashboard_theme: 'emerald',
      setup_complete: false,
      activation_status: 'PENDING',
      rejection_count: 0,
    });

    return { success: true, message: 'Registration submitted. Awaiting admin approval.', user: localUser };
  };

  const submitVerification = async (v: Omit<PendingSignup, 'id' | 'date'>) => {
    // v.userId is the pending_registration id (pr-XXXXX) for new-flow users
    const { error } = await supabase.from('pending_registrations').update({
      transaction_id: v.transactionId,
      payment_phone: v.paymentPhone,
      payment_method: v.paymentMethod,
      bank_name: v.bankName || null,
      account_name: v.accountName || null,
    }).eq('id', v.userId);

    if (!error) {
      // Refresh pending list so admin sees the updated payment info
      await loadPendingSignups();
    }
  };

  const approveSignup = async (signupId: string) => {
    const signup = pendingSignups.find(s => s.id === signupId);
    if (!signup) return;

    try {
      // Mark pending registration approved and activate matching profile.
      const { error: pendingErr } = await supabase
        .from('pending_registrations')
        .update({ status: 'APPROVED' })
        .eq('id', signupId);
      if (pendingErr) throw pendingErr;

      const { error: profileErr } = await supabase
        .from('profiles')
        .update({ activation_status: 'ACTIVE', rejection_count: 0 })
        .eq('email', signup.userEmail);
      if (profileErr) throw profileErr;
    } catch (err: any) {
      addNotification(`Approval failed: ${err.message}`, 'ALERT');
      return;
    }

    setPendingSignups(prev => prev.filter(s => s.id !== signupId));
    addNotification(`Account for ${signup.userName} approved and activated.`, 'SUCCESS');
  };

  const rejectSignup = async (signupId: string) => {
    const signup = pendingSignups.find(s => s.id === signupId);
    if (!signup) return;
    // DELETE the row entirely so the email is freed and the user can re-register
    await supabase.from('pending_registrations').delete().eq('id', signupId);
    setPendingSignups(prev => prev.filter(s => s.id !== signupId));
    addNotification(`Registration for ${signup.userName} purged. They may re-apply.`, 'ALERT');
  };

  const deleteUser = async (userId: string) => {
    // Call Edge Function to delete from auth.users (cascades to profiles)
    const { data: { session } } = await supabase.auth.getSession();
    const supabaseUrl = (supabase as any).supabaseUrl || import.meta.env.VITE_SUPABASE_URL || 'https://vlxfwcdnsdqgcqkdnpav.supabase.co';

    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/admin-delete-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ userId }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error || 'Delete failed');
    } catch {
      // Fallback: delete profile only (auth user will remain but cannot log in without profile)
      await supabase.from('profiles').delete().eq('id', userId);
    }

    addNotification('User permanently deleted.', 'ALERT');
  };

  const changeUserStatus = async (userId: string, status: ActivationStatus) => {
    await supabase.from('profiles').update({ activation_status: status }).eq('id', userId);
  };

  const resetUserStatus = async (email: string) => {
    // Delete any pending_registration row to free the unique email constraint for re-registration
    await supabase.from('pending_registrations').delete().eq('email', email);
    // Also reset profile status in case they have an existing profile
    await supabase.from('profiles').update({ activation_status: 'PENDING' }).eq('email', email);
  };

  const completeOnboarding = async () => {
    if (!user) return;
    await supabase.from('profiles').update({ setup_complete: true }).eq('id', user.id);
    setUser(prev => prev ? { ...prev, setupComplete: true } : null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const dbUpdates = userToProfileUpdate(updates);
    if (Object.keys(dbUpdates).length > 0) {
      await supabase.from('profiles').update(dbUpdates).eq('id', user.id);
    }
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    // Use the origin root so Supabase can append #access_token=...&type=recovery cleanly
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/',
    });
    if (error) return { success: false, message: error.message };
    return { success: true, message: 'Password reset email sent. Check your inbox.' };
  };

  const resetPassword = async (_token: string, newPass: string): Promise<{ success: boolean; message: string }> => {
    // Session is already set by Supabase from the recovery link token
    const { error } = await supabase.auth.updateUser({ password: newPass });
    if (error) return { success: false, message: error.message };
    await supabase.auth.signOut();
    return { success: true, message: 'Password updated successfully. Please sign in.' };
  };

  const getAllUsers = async (): Promise<User[]> => {
    const { data } = await supabase.from('profiles').select('*');
    return (data ?? []).map(profileToUser);
  };

  // ── Notifications ────────────────────────────────────────────

  const addNotification = (message: string, type: 'INFO' | 'ALERT' | 'SUCCESS', link?: string) => {
    if (!user) return;
    const id = 'n-' + crypto.randomUUID().slice(0, 9);
    const row = { id, user_id: user.id, message, type, date: new Date().toISOString(), read: false, link: link || null };
    supabase.from('notifications').insert(row).then();
    setNotifications(prev => [...prev, { id, message, type, date: row.date, read: false, link }]);
  };

  const markNotificationRead = (id: string) => {
    supabase.from('notifications').update({ read: true }).eq('id', id).then();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    if (!user) return;
    supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false).then();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // ── Farms & Crops ────────────────────────────────────────────

  const addFarm = async (farm: Farm) => {
    if (!user) return;
    const row = { id: farm.id, user_id: user.id, name: farm.name, location: farm.location, size: farm.size, farming_type: farm.farmingType, staff_ids: farm.staffIds, initial_assets: farm.initialAssets, notes: farm.notes || null };
    await supabase.from('farms').insert(row);
    setFarms(prev => [...prev, farm]);
  };

  const addCrop = async (crop: Crop) => {
    if (!user) return;
    const row = { id: crop.id, user_id: user.id, farm_id: crop.farmId, name: crop.name, variety: crop.variety, status: crop.status, planted_date: crop.plantedDate };
    await supabase.from('crops').insert(row);
    setCrops(prev => [...prev, crop]);
  };

  const updateCropStatus = async (id: string, status: CropStatus) => {
    await supabase.from('crops').update({ status }).eq('id', id);
    setCrops(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  // ── Harvests ─────────────────────────────────────────────────

  const addHarvest = async (harvest: Harvest, financeOptions?: any) => {
    if (!user) return;
    const row = { id: harvest.id, user_id: user.id, farm_id: harvest.farmId, crop_id: harvest.cropId, crop_name: harvest.cropName, grade: harvest.grade, quantity: harvest.quantity, unit: harvest.unit, date: harvest.date, status: harvest.status, notes: harvest.notes || null, history: harvest.history || [] };
    await supabase.from('harvests').insert(row);
    setHarvests(prev => [...prev, harvest]);

    // Auto-add harvested yield to inventory
    const farm = farms.find(f => f.id === harvest.farmId);
    const invItem: InventoryItem = {
      id: 'inv-' + crypto.randomUUID().slice(0, 9),
      productName: harvest.cropName,
      grade: harvest.grade || 'Standard',
      quantity: harvest.quantity,
      unit: harvest.unit,
      location: farm?.location || 'Farm Store',
      lastUpdated: new Date().toISOString(),
    };
    await addToInventory(invItem);

    if (financeOptions && financeOptions.cost > 0) {
      await addTransaction({
        id: 'tx-' + crypto.randomUUID().slice(0, 9),
        type: 'EXPENSE', category: 'Production', amount: financeOptions.cost,
        description: `Production/Processing Cost: ${harvest.cropName}`,
        date: new Date().toISOString(), paymentMethod: financeOptions.method || 'CASH'
      });
    }
  };

  const updateHarvest = async (harvest: Harvest) => {
    const row = { crop_name: harvest.cropName, grade: harvest.grade, quantity: harvest.quantity, unit: harvest.unit, date: harvest.date, status: harvest.status, notes: harvest.notes || null, history: harvest.history || [] };
    await supabase.from('harvests').update(row).eq('id', harvest.id);
    setHarvests(prev => prev.map(h => h.id === harvest.id ? harvest : h));
  };

  // ── Inventory ────────────────────────────────────────────────

  const addToInventory = async (item: InventoryItem, financeOptions?: any) => {
    if (!user) return;
    const row = { id: item.id, user_id: user.id, product_name: item.productName, grade: item.grade, quantity: item.quantity, unit: item.unit, location: item.location, last_updated: item.lastUpdated, cost_per_unit: item.costPerUnit || null, low_stock_threshold: item.lowStockThreshold || null };
    await supabase.from('inventory').insert(row);
    setInventory(prev => [...prev, item]);

    if (financeOptions) {
      await addTransaction({
        id: 'tx-' + crypto.randomUUID().slice(0, 9),
        type: 'EXPENSE', category: 'Inventory', amount: financeOptions.cost,
        description: `Stock Acquisition: ${item.productName} (${financeOptions.supplierName || 'General Supplier'})`,
        date: new Date().toISOString(), paymentMethod: financeOptions.method || 'BANK_TRANSFER',
        reference: financeOptions.reference
      });
    }

    // Low stock alert check
    if (item.lowStockThreshold && item.quantity <= item.lowStockThreshold) {
      addNotification(`Low stock alert: ${item.productName} is at ${item.quantity} ${item.unit}`, 'ALERT', '/app/inventory');
    }
  };

  const bulkUpdateInventory = async (ids: string[], updates: Partial<InventoryItem>) => {
    const dbUpdates: Record<string, any> = {};
    if (updates.location !== undefined) dbUpdates.location = updates.location;
    if (updates.lowStockThreshold !== undefined) dbUpdates.low_stock_threshold = updates.lowStockThreshold;
    dbUpdates.last_updated = new Date().toISOString();

    for (const id of ids) {
      await supabase.from('inventory').update(dbUpdates).eq('id', id);
    }
    setInventory(prev => prev.map(item => ids.includes(item.id) ? { ...item, ...updates, lastUpdated: dbUpdates.last_updated } : item));
  };

  const deleteInventoryItems = async (ids: string[]) => {
    for (const id of ids) {
      await supabase.from('inventory').delete().eq('id', id);
    }
    setInventory(prev => prev.filter(item => !ids.includes(item.id)));
  };

  const deductInventory = async (productName: string, grade: string, quantity: number) => {
    const item = inventory.find(i => i.productName === productName && i.grade === grade);
    if (!item) return;
    const newQty = Math.max(0, item.quantity - quantity);
    await supabase.from('inventory').update({ quantity: newQty, last_updated: new Date().toISOString() }).eq('id', item.id);
    setInventory(prev => prev.map(i => {
      if (i.productName === productName && i.grade === grade) {
        const updated = { ...i, quantity: Math.max(0, i.quantity - quantity) };
        if (i.lowStockThreshold && updated.quantity <= i.lowStockThreshold) {
          addNotification(`Low stock alert: ${i.productName} is now at ${updated.quantity} ${i.unit}`, 'ALERT', '/app/inventory');
        }
        return updated;
      }
      return i;
    }));
  };

  // ── Transactions ─────────────────────────────────────────────

  const addTransaction = async (tx: Transaction) => {
    if (!user) return;
    const row = { id: tx.id, user_id: user.id, type: tx.type, category: tx.category, amount: tx.amount, description: tx.description, date: tx.date, payment_method: tx.paymentMethod, reference: tx.reference || null };
    await supabase.from('transactions').insert(row);
    setTransactions(prev => [tx, ...prev]);
  };

  // ── Exports ──────────────────────────────────────────────────

  const createExport = async (order: ExportOrder, initialPayment: number, method: string): Promise<boolean> => {
    if (!user) return false;
    const stock = inventory.find(i => i.productName === order.productName && i.grade === order.grade);
    if (!stock || stock.quantity < order.quantity) {
      addNotification(`CRITICAL: Insufficient stock for ${order.productName} export.`, 'ALERT');
      return false;
    }

    await deductInventory(order.productName, order.grade, order.quantity);

    const row = { id: order.id, user_id: user.id, mission_type: order.missionType, client_id: order.clientId || null, buyer_name: order.buyerName, buyer_country: order.buyerCountry, buyer_email: order.buyerEmail, buyer_phone: order.buyerPhone || null, product_name: order.productName, grade: order.grade, quantity: order.quantity, unit: order.unit, price_per_unit: order.pricePerUnit || null, status: order.status, shipment_number: order.shipmentNumber, shipping_cost: order.shippingCost, total_value: order.totalValue, amount_paid: order.amountPaid, date: order.date, origin_warehouse: order.originWarehouse || null, origin_location: order.originLocation || null, destination_port: order.destinationPort || null, destination_country: order.destinationCountry || null, transit_ports: order.transitPorts || null, transport_provider: order.transportProvider || null, transport_method: order.transportMethod || null, port_of_exit: order.portOfExit || null };
    await supabase.from('export_orders').insert(row);
    setExports(prev => [...prev, order]);

    addNotification(`Export Mission Launched: ${order.shipmentNumber}`, 'SUCCESS', '/app/exports');

    if (initialPayment > 0) {
      await addTransaction({ id: 'tx-' + crypto.randomUUID().slice(0, 9), type: 'INCOME', category: 'Mission Settlement', amount: initialPayment, description: `Advance Settlement for Mission: ${order.shipmentNumber}`, date: new Date().toISOString(), paymentMethod: method as any });
    }
    return true;
  };

  const updateExportPayment = async (id: string, amount: number, method: string) => {
    const exp = exports.find(e => e.id === id);
    if (!exp) return;

    const newPaid = exp.amountPaid + amount;
    const newStatus = newPaid >= exp.totalValue ? 'PAID' : exp.status;
    await supabase.from('export_orders').update({ amount_paid: newPaid, status: newStatus }).eq('id', id);
    setExports(prev => prev.map(e => e.id === id ? { ...e, amountPaid: newPaid, status: newStatus as any } : e));

    await addTransaction({ id: 'tx-' + crypto.randomUUID().slice(0, 9), type: 'INCOME', category: 'Mission Settlement', amount, description: `Remittance received for Mission: ${exp.shipmentNumber}`, date: new Date().toISOString(), paymentMethod: method as any });
  };

  const updateExportStatus = async (id: string, status: string): Promise<boolean> => {
    await supabase.from('export_orders').update({ status }).eq('id', id);
    setExports(prev => prev.map(e => e.id === id ? { ...e, status: status as any } : e));
    return true;
  };

  // ── Requisitions ─────────────────────────────────────────────

  const addRequisition = async (req: Requisition) => {
    if (!user) return;
    const row = { id: req.id, user_id: user.id, staff_id: req.staffId, staff_name: req.staffName, farm_id: req.farmId || null, amount: req.amount, reason: req.reason, category: req.category, status: req.status, priority: req.priority, date: req.date };
    await supabase.from('requisitions').insert(row);
    setRequisitions(prev => [...prev, req]);
  };

  const updateRequisitionStatus = async (id: string, status: string) => {
    await supabase.from('requisitions').update({ status }).eq('id', id);
    setRequisitions(prev => prev.map(r => {
      if (r.id === id) {
        const updated = { ...r, status: status as any };
        if (status === 'APPROVED') {
          addTransaction({ id: 'tx-' + crypto.randomUUID().slice(0, 9), type: 'EXPENSE', category: r.category, amount: r.amount, description: `Authorized spend: ${r.reason}`, date: new Date().toISOString(), paymentMethod: 'CASH' });
        }
        return updated;
      }
      return r;
    }));
  };

  // ── Purchase Orders ──────────────────────────────────────────

  const addPurchaseOrder = async (order: PurchaseOrder, initialPayment: number, method: string): Promise<boolean> => {
    if (!user) return false;

    for (const item of order.items) {
      const invName = item.productName.split(' (')[0];
      const invGrade = item.productName.split('(')[1]?.replace(')', '') || 'Standard';
      const stock = inventory.find(i => i.productName === invName && i.grade === invGrade);
      if (!stock || stock.quantity < item.quantity) {
        addNotification(`CRITICAL: Insufficient stock for ${item.productName} sale.`, 'ALERT');
        return false;
      }
    }

    order.items.forEach(item => {
      const invName = item.productName.split(' (')[0];
      const invGrade = item.productName.split('(')[1]?.replace(')', '') || 'Standard';
      deductInventory(invName, invGrade, item.quantity);
    });

    const row = { id: order.id, user_id: user.id, supplier_id: order.supplierId, supplier_name: order.supplierName, date: order.date, expected_date: order.expectedDate || null, status: order.status, items: order.items, total_amount: order.totalAmount, amount_paid: order.amountPaid, payment_status: order.paymentStatus, order_number: order.orderNumber, notes: order.notes || null };
    await supabase.from('purchase_orders').insert(row);
    setPurchaseOrders(prev => [...prev, order]);

    addNotification(`Sales Manifest Generated: ${order.orderNumber}`, 'SUCCESS', '/app/inventory');

    if (initialPayment > 0) {
      await addTransaction({ id: 'tx-' + crypto.randomUUID().slice(0, 9), type: 'INCOME', category: 'Sales', amount: initialPayment, description: `Initial Settlement for Sale: ${order.orderNumber}`, date: new Date().toISOString(), paymentMethod: method as any });
    }
    return true;
  };

  const approvePurchaseOrder = async (id: string) => {
    await supabase.from('purchase_orders').update({ status: 'ORDERED' }).eq('id', id);
    setPurchaseOrders(prev => prev.map(po => po.id === id ? { ...po, status: 'ORDERED' } : po));
  };

  const updatePurchaseOrderStatus = async (id: string, status: string) => {
    await supabase.from('purchase_orders').update({ status }).eq('id', id);
    setPurchaseOrders(prev => prev.map(po => po.id === id ? { ...po, status: status as any } : po));
  };

  const payPurchaseOrder = async (id: string, amount: number, method: string) => {
    const po = purchaseOrders.find(p => p.id === id);
    if (!po) return;
    const newPaid = po.amountPaid + amount;
    const newPayStatus = newPaid >= po.totalAmount ? 'PAID' : (newPaid > 0 ? 'PARTIAL' : 'UNPAID');
    await supabase.from('purchase_orders').update({ amount_paid: newPaid, payment_status: newPayStatus }).eq('id', id);
    setPurchaseOrders(prev => prev.map(p => p.id === id ? { ...p, amountPaid: newPaid, paymentStatus: newPayStatus as any } : p));

    await addTransaction({ id: 'tx-' + crypto.randomUUID().slice(0, 9), type: 'INCOME', category: 'Sales', amount, description: `Remittance for Sale: ${po.orderNumber}`, date: new Date().toISOString(), paymentMethod: method as any });
  };

  // ── Animals ──────────────────────────────────────────────────

  const addAnimal = async (animal: Animal) => {
    if (!user) return;
    const row = { id: animal.id, user_id: user.id, type: animal.type, breed: animal.breed, quantity: animal.quantity, status: animal.status, location: animal.location, age: animal.age, notes: animal.notes || null };
    await supabase.from('animals').insert(row);
    setAnimals(prev => [...prev, animal]);
  };

  // ── Staff ────────────────────────────────────────────────────

  const addStaff = async (member: StaffMember, _pass: string) => {
    if (!user) return;
    const row = { id: member.id, user_id: user.id, name: member.name, role: member.role, salary: member.salary, currency: member.currency, frequency: member.frequency, phone: member.phone, email: member.email || null, assigned_farm_ids: member.assignedFarmIds || [], department_id: member.departmentId || null, status: member.status, joined_date: member.joinedDate, permissions: member.permissions || [], tasks: member.tasks || [] };
    await supabase.from('staff_members').insert(row);
    setStaff(prev => [...prev, member]);
  };

  const payStaff = async (payment: StaffPayment) => {
    if (!user) return;
    const row = { id: payment.id, user_id: user.id, staff_id: payment.staffId, staff_name: payment.staffName, amount: payment.amount, date: payment.date, period: payment.period, method: payment.method, reference: payment.reference || null };
    await supabase.from('staff_payments').insert(row);
    setStaffPayments(prev => [...prev, payment]);

    await addTransaction({ id: 'tx-' + crypto.randomUUID().slice(0, 9), type: 'EXPENSE', category: 'Payroll', amount: payment.amount, description: `Disbursement: ${payment.staffName} (${payment.period})`, date: new Date().toISOString(), paymentMethod: payment.method });
  };

  const assignTask = async (staffId: string, task: StaffTask) => {
    const member = staff.find(s => s.id === staffId);
    if (!member) return;
    const newTasks = [...(member.tasks || []), task];
    await supabase.from('staff_members').update({ tasks: newTasks }).eq('id', staffId);
    setStaff(prev => prev.map(s => s.id === staffId ? { ...s, tasks: newTasks } : s));
  };

  const updateTaskStatus = async (staffId: string, taskId: string, status: string) => {
    const member = staff.find(s => s.id === staffId);
    if (!member) return;
    const newTasks = member.tasks.map(t => t.id === taskId ? { ...t, status: status as any } : t);
    await supabase.from('staff_members').update({ tasks: newTasks }).eq('id', staffId);
    setStaff(prev => prev.map(s => s.id === staffId ? { ...s, tasks: newTasks } : s));
  };

  const updateStaffPermissions = async (staffId: string, permissions: Permission[]) => {
    await supabase.from('staff_members').update({ permissions }).eq('id', staffId);
    setStaff(prev => prev.map(s => s.id === staffId ? { ...s, permissions } : s));
  };

  // ── Clients ──────────────────────────────────────────────────

  const addClient = async (client: Client) => {
    if (!user) return;
    const row = { id: client.id, user_id: user.id, name: client.name, type: client.type, country: client.country, email: client.email, phone: client.phone, total_orders: client.totalOrders, total_value: client.totalValue, joined_date: client.joinedDate };
    await supabase.from('clients').insert(row);
    setClients(prev => [...prev, client]);
  };

  // ── Documents ────────────────────────────────────────────────

  const addDocument = async (doc: AppDocument) => {
    if (!user) return;
    const row = { id: doc.id, user_id: user.id, name: doc.name, doc_type: doc.type, category: doc.category, size: doc.size, date: doc.date, url: doc.url, uploaded_by: doc.uploadedBy };
    await supabase.from('documents').insert(row);
    setDocuments(prev => [doc, ...prev]);
  };

  const deleteDocument = async (id: string) => {
    await supabase.from('documents').delete().eq('id', id);
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  // ── Messages & Announcements ─────────────────────────────────

  const sendMessage = async (msg: Message) => {
    if (!user) return;
    const row = { id: msg.id, user_id: user.id, sender_id: msg.senderId, sender_name: msg.senderName, subject: msg.subject, content: msg.content, date: msg.date, read: msg.read, msg_type: msg.type, priority: msg.priority || null };
    await supabase.from('messages').insert(row);
    setMessages(prev => [msg, ...prev]);
  };

  const markMessageRead = async (id: string) => {
    await supabase.from('messages').update({ read: true }).eq('id', id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const addAnnouncement = async (ann: Announcement) => {
    if (!user) return;
    const row = { id: ann.id, user_id: user.id, title: ann.title, content: ann.content, date: ann.date, author: ann.author, priority: ann.priority };
    await supabase.from('announcements').insert(row);
    setAnnouncements(prev => [ann, ...prev]);
  };

  // ── Departments ──────────────────────────────────────────────

  const addDepartment = async (dept: Department) => {
    if (!user) return;
    const row = { id: dept.id, user_id: user.id, name: dept.name, description: dept.description || null, manager_id: dept.managerId || null };
    await supabase.from('departments').insert(row);
    setDepartments(prev => [...prev, dept]);
  };

  const updateDepartment = async (dept: Department) => {
    await supabase.from('departments').update({ name: dept.name, description: dept.description || null, manager_id: dept.managerId || null }).eq('id', dept.id);
    setDepartments(prev => prev.map(d => d.id === dept.id ? dept : d));
  };

  const deleteDepartment = async (id: string) => {
    await supabase.from('departments').delete().eq('id', id);
    setDepartments(prev => prev.filter(d => d.id !== id));
  };

  // ── Finance Accounts ─────────────────────────────────────────

  const addFinanceAccount = async (acct: FinanceAccount) => {
    if (!user) return;
    const row = { id: acct.id, user_id: user.id, name: acct.name, provider: acct.provider, type: acct.type, currency: acct.currency, balance: acct.balance, country: acct.country, last_updated: acct.lastUpdated };
    await supabase.from('finance_accounts').insert(row);
    setFinanceAccounts(prev => [...prev, acct]);
  };

  const updateFinanceAccount = async (acct: FinanceAccount) => {
    await supabase.from('finance_accounts').update({ name: acct.name, provider: acct.provider, type: acct.type, currency: acct.currency, balance: acct.balance, country: acct.country, last_updated: acct.lastUpdated }).eq('id', acct.id);
    setFinanceAccounts(prev => prev.map(a => a.id === acct.id ? acct : a));
  };

  const deleteFinanceAccount = async (id: string) => {
    await supabase.from('finance_accounts').delete().eq('id', id);
    setFinanceAccounts(prev => prev.filter(a => a.id !== id));
  };

  // ── Dashboard & Misc ─────────────────────────────────────────

  const replayTutorial = () => setUser(prev => prev ? { ...prev, tutorialCompleted: false } : null);
  const updateDashboardWidgets = async (widgets: DashboardWidget[]) => updateUser({ dashboardWidgets: widgets });
  const updateDashboardTheme = async (dt: DashboardTheme) => updateUser({ dashboardTheme: dt });
  const selectSubscription = async (planId: SubscriptionPlanId) => updateUser({ subscriptionPlan: planId });

  // ── Low stock check on inventory changes ─────────────────────

  useEffect(() => {
    inventory.forEach(item => {
      if (item.lowStockThreshold && item.quantity > 0 && item.quantity <= item.lowStockThreshold) {
        const alreadyNotified = notifications.some(n => n.message.includes(item.productName) && n.type === 'ALERT' && !n.read);
        if (!alreadyNotified) {
          addNotification(`Low stock: ${item.productName} is at ${item.quantity} ${item.unit} (threshold: ${item.lowStockThreshold})`, 'ALERT', '/app/inventory');
        }
      }
    });
  }, [inventory]);

  // ── Provider value ───────────────────────────────────────────

  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const clearPasswordRecovery = () => setIsPasswordRecovery(false);

  return (
    <AppContext.Provider value={{
      user, isSuperAdmin, loading, theme, toggleTheme, logout,
      farms, inventory, transactions, notifications, requisitions, crops, staff, harvests, exports, animals, clients, documents, messages, announcements, purchaseOrders, staffPayments, pendingSignups, departments,
      addFarm, addToInventory, addTransaction, addNotification, markNotificationRead, markAllNotificationsRead, addCrop, updateCropStatus, addHarvest, updateHarvest,
      createExport, updateExportPayment, updateExportStatus, updateRequisitionStatus, addRequisition, login, register, submitVerification, approveSignup, rejectSignup, deleteUser, changeUserStatus, resetUserStatus, completeOnboarding, updateUser,
      requestPasswordReset, resetPassword, isPasswordRecovery, clearPasswordRecovery,
      addAnimal, addStaff, payStaff, assignTask, updateTaskStatus, updateStaffPermissions, addClient, replayTutorial, updateDashboardWidgets, updateDashboardTheme,
      selectSubscription,
      addDocument, deleteDocument, sendMessage, markMessageRead, addAnnouncement, bulkUpdateInventory, deleteInventoryItems, deductInventory, approvePurchaseOrder, addPurchaseOrder, updatePurchaseOrderStatus, payPurchaseOrder,
      addDepartment, updateDepartment, deleteDepartment,
      financeAccounts, addFinanceAccount, updateFinanceAccount, deleteFinanceAccount,
      balance, formatCurrency, getAllUsers
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
