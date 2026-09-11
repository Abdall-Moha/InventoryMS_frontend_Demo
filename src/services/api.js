const KEYS = {
  users: "inventory_demo_users",
  categories: "inventory_demo_categories",
  products: "inventory_demo_products",
  suppliers: "inventory_demo_suppliers",
  customers: "inventory_demo_customers",
  purchases: "inventory_demo_purchases",
  sales: "inventory_demo_sales",
  expenses: "inventory_demo_expenses",
};

const demoUser = {
  _id: "demo-admin-001",
  name: "Amina Yusuf",
  email: "admin@northstar-market.demo",
  password: "demo-only",
  role: "Admin",
  createdAt: "2026-01-08T09:00:00.000Z",
};

const categories = [
  ["cat-beverages", "Beverages", "Coffee, tea, juices, and chilled drinks"],
  [
    "cat-pantry",
    "Pantry Essentials",
    "Everyday staples and cooking ingredients",
  ],
  ["cat-fresh", "Fresh Foods", "Produce, dairy, and bakery items"],
  ["cat-household", "Household", "Cleaning and home care products"],
  ["cat-personal", "Personal Care", "Health and personal care essentials"],
  ["cat-snacks", "Snacks", "Packaged snacks and confectionery"],
].map(([id, name, description], index) => ({
  _id: id,
  name,
  description,
  createdAt: `2026-01-${10 + index}T09:00:00.000Z`,
}));

const suppliers = [
  [
    "sup-nile",
    "Nile Valley Distributors",
    "Samir Khalil",
    "samir@nilevalley.demo",
    "+000 555 0101",
    "14 Market Road",
  ],
  [
    "sup-harbor",
    "Harbor Wholesale Co.",
    "Leila Morgan",
    "leila@harborwholesale.demo",
    "+000 555 0102",
    "8 Seaport Avenue",
  ],
  [
    "sup-green",
    "Green Basket Farms",
    "Owen Clarke",
    "owen@greenbasket.demo",
    "+000 555 0103",
    "22 Orchard Lane",
  ],
  [
    "sup-bright",
    "Bright Home Supplies",
    "Maya Chen",
    "maya@brighthome.demo",
    "+000 555 0104",
    "5 Commerce Park",
  ],
].map(([id, name, contactPerson, email, phone, address]) => ({
  _id: id,
  name,
  contactPerson,
  email,
  phone,
  address,
  createdAt: "2026-01-12T09:00:00.000Z",
}));

const customers = [
  [
    "cus-001",
    "Mariam Hassan",
    "mariam.hassan@demo.test",
    "+000 555 1011",
    "Riverside District",
  ],
  [
    "cus-002",
    "Daniel Brooks",
    "daniel.brooks@demo.test",
    "+000 555 1012",
    "West End",
  ],
  [
    "cus-003",
    "Noor Ibrahim",
    "noor.ibrahim@demo.test",
    "+000 555 1013",
    "Garden Quarter",
  ],
  [
    "cus-004",
    "Elias Turner",
    "elias.turner@demo.test",
    "+000 555 1014",
    "Old Town",
  ],
  [
    "cus-005",
    "Sofia Nasser",
    "sofia.nasser@demo.test",
    "+000 555 1015",
    "Lakeside",
  ],
  [
    "cus-006",
    "Hana Patel",
    "hana.patel@demo.test",
    "+000 555 1016",
    "North Hills",
  ],
].map(([id, name, email, phone, address]) => ({
  _id: id,
  name,
  email,
  phone,
  address,
  createdAt: "2026-02-01T09:00:00.000Z",
}));

const productSeed = [
  [
    "prd-001",
    "Cedar Roast Coffee 250g",
    "cat-beverages",
    "sup-nile",
    6.25,
    9.5,
    18,
    "Medium roast coffee for the morning aisle.",
  ],
  [
    "prd-002",
    "Sparkling Citrus Water 6-pack",
    "cat-beverages",
    "sup-harbor",
    3.2,
    5.75,
    42,
    "Unsweetened citrus sparkling water.",
  ],
  [
    "prd-003",
    "Golden Grain Rice 5kg",
    "cat-pantry",
    "sup-nile",
    8.4,
    12.75,
    27,
    "Long-grain rice in a family-size bag.",
  ],
  [
    "prd-004",
    "Extra Virgin Olive Oil 750ml",
    "cat-pantry",
    "sup-nile",
    7.1,
    11.9,
    11,
    "Cold-pressed olive oil.",
  ],
  [
    "prd-005",
    "Free Range Eggs 12-pack",
    "cat-fresh",
    "sup-green",
    2.8,
    4.5,
    8,
    "Fresh eggs delivered twice weekly.",
  ],
  [
    "prd-006",
    "Whole Milk 1L",
    "cat-fresh",
    "sup-green",
    1.15,
    2.1,
    6,
    "Chilled whole milk.",
  ],
  [
    "prd-007",
    "Sourdough Country Loaf",
    "cat-fresh",
    "sup-green",
    2.1,
    3.8,
    14,
    "Baked sourdough loaf.",
  ],
  [
    "prd-008",
    "Lemon Surface Cleaner",
    "cat-household",
    "sup-bright",
    2.35,
    4.25,
    31,
    "Plant-based household cleaner.",
  ],
  [
    "prd-009",
    "Laundry Powder 2kg",
    "cat-household",
    "sup-bright",
    5.9,
    9.8,
    23,
    "Concentrated laundry powder.",
  ],
  [
    "prd-010",
    "Aloe Hand Wash 500ml",
    "cat-personal",
    "sup-bright",
    1.75,
    3.4,
    19,
    "Gentle aloe hand wash.",
  ],
  [
    "prd-011",
    "Sea Salt Potato Crisps",
    "cat-snacks",
    "sup-harbor",
    1.1,
    2.25,
    47,
    "Crisps with sea salt.",
  ],
  [
    "prd-012",
    "Dark Chocolate Almond Bar",
    "cat-snacks",
    "sup-harbor",
    1.6,
    3.25,
    35,
    "70% dark chocolate with almonds.",
  ],
].map(
  (
    [
      id,
      name,
      category,
      supplier,
      buyingPrice,
      sellingPrice,
      quantity,
      description,
    ],
    index,
  ) => ({
    _id: id,
    name,
    category,
    supplier,
    buyingPrice,
    sellingPrice,
    quantity,
    description,
    image: "",
    createdAt: `2026-02-${String(2 + index).padStart(2, "0")}T09:00:00.000Z`,
  }),
);

const users = [
  demoUser,
  {
    _id: "demo-manager-001",
    name: "Tariq Morgan",
    email: "manager@northstar-market.demo",
    role: "Manager",
    createdAt: "2026-01-09T09:00:00.000Z",
  },
  {
    _id: "demo-employee-001",
    name: "Lina Okafor",
    email: "employee@northstar-market.demo",
    role: "Employee",
    createdAt: "2026-01-10T09:00:00.000Z",
  },
];

const makeSales = () =>
  Array.from({ length: 12 }, (_, index) => {
    const product = productSeed[(index + 2) % productSeed.length];
    const customer = customers[index % customers.length];
    const quantity = (index % 3) + 1;
    return {
      _id: `sale-${String(index + 1).padStart(3, "0")}`,
      invoiceNumber: `INV-2026-${String(index + 41).padStart(4, "0")}`,
      customer: customer._id,
      createdBy: index % 2 ? "demo-manager-001" : demoUser._id,
      items: [
        {
          product: product._id,
          quantity,
          unitPrice: product.sellingPrice,
          total: quantity * product.sellingPrice,
        },
      ],
      totalAmount: quantity * product.sellingPrice,
      paymentMethod: index % 2 ? "Card" : "EVC",
      createdAt: `2026-03-${String(1 + index).padStart(2, "0")}T10:30:00.000Z`,
    };
  });

const makePurchases = () =>
  Array.from({ length: 12 }, (_, index) => {
    const product = productSeed[index % productSeed.length];
    const quantity = 12 + (index % 4) * 5;
    return {
      _id: `purchase-${String(index + 1).padStart(3, "0")}`,
      product: product._id,
      supplier: product.supplier,
      quantity,
      unitPrice: product.buyingPrice,
      totalAmount: quantity * product.buyingPrice,
      notes: "Regular stock replenishment",
      createdBy: demoUser._id,
      createdAt: `2026-02-${String(3 + index).padStart(2, "0")}T08:00:00.000Z`,
    };
  });

const makeExpenses = () =>
  [
    "Store rent",
    "Electricity bill",
    "Delivery van service",
    "Cleaning supplies",
    "Staff refreshments",
    "Internet service",
    "Display shelf repair",
    "Packaging supplies",
    "Security service",
    "Water bill",
    "Accounting service",
    "Local delivery fuel",
  ].map((title, index) => ({
    _id: `expense-${String(index + 1).padStart(3, "0")}`,
    title,
    category: ["Rent", "Utilities", "Maintenance", "Supplies"][index % 4],
    amount: [1250, 184, 95, 68, 42, 75, 210, 120, 160, 54, 300, 90][index],
    description: "Fictional operating cost for the demo store.",
    createdBy: demoUser._id,
    createdAt: `2026-02-${String(4 + index).padStart(2, "0")}T08:00:00.000Z`,
  }));

const initialData = {
  users,
  categories,
  products: productSeed,
  suppliers,
  customers,
  purchases: makePurchases(),
  sales: makeSales(),
  expenses: makeExpenses(),
};

const read = (key) => JSON.parse(localStorage.getItem(KEYS[key]) || "[]");
const write = (key, value) =>
  localStorage.setItem(KEYS[key], JSON.stringify(value));
const id = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const resetDemoData = () => {
  Object.entries(initialData).forEach(([key, value]) => write(key, value));
  localStorage.setItem("token", "demo-token");
  localStorage.setItem("user", JSON.stringify(demoUser));
};

Object.entries(initialData).forEach(([key, value]) => {
  if (!localStorage.getItem(KEYS[key])) write(key, value);
});
if (!localStorage.getItem("token") || !localStorage.getItem("user"))
  resetDemoData();

const parseUrl = (url) => {
  const [path, query = ""] = url.split("?");
  return { path, params: new URLSearchParams(query) };
};

const relation = (key, value) =>
  read(key).find((item) => item._id === value) || null;
const decorate = (key, item) => {
  if (!item) return item;
  const copy = { ...item };
  if (key === "products") {
    copy.category = relation("categories", item.category) || item.category;
    copy.supplier = relation("suppliers", item.supplier) || item.supplier;
  }
  if (["sales", "purchases", "expenses"].includes(key)) {
    copy.customer = relation("customers", item.customer);
    copy.createdBy = relation("users", item.createdBy);
    copy.product = relation("products", item.product) || item.product;
    copy.supplier = relation("suppliers", item.supplier) || item.supplier;
  }
  return copy;
};

const list = (key, params) =>
  read(key)
    .map((item) => decorate(key, item))
    .filter((item) => {
      const search = (params.get("search") || "").toLowerCase();
      const text =
        `${item.name || ""} ${item.email || ""} ${item.phone || ""} ${item.description || ""} ${item.title || ""}`.toLowerCase();
      if (search && !text.includes(search)) return false;
      if (
        params.get("customer") &&
        item.customer?._id !== params.get("customer")
      )
        return false;
      if (
        params.get("supplier") &&
        item.supplier?._id !== params.get("supplier")
      )
        return false;
      if (params.get("product") && item.product?._id !== params.get("product"))
        return false;
        if (params.get("paymentMethod") && item.paymentMethod !== params.get("paymentMethod"))
          return false;
        if (params.get("employee") && item.createdBy?._id !== params.get("employee"))
          return false;
      const date = new Date(item.createdAt);
      if (
        params.get("from") &&
        date < new Date(`${params.get("from")}T00:00:00`)
      )
        return false;
      if (
        params.get("dateFrom") &&
        date < new Date(`${params.get("dateFrom")}T00:00:00`)
      )
        return false;
      if (params.get("to") && date > new Date(`${params.get("to")}T23:59:59`))
        return false;
      if (
        params.get("dateTo") &&
        date > new Date(`${params.get("dateTo")}T23:59:59`)
      )
        return false;
      return true;
    });

const paginated = (items, params, name) => {
  const limit = Number(params.get("limit") || 10);
  const currentPage = Number(params.get("page") || 1);
  const totalPages = Math.max(1, Math.ceil(items.length / limit));
  return {
    [name]: items.slice((currentPage - 1) * limit, currentPage * limit),
    currentPage,
    totalPages: items.length ? totalPages : 0,
    [`total${name[0].toUpperCase()}${name.slice(1)}`]: items.length,
    total: items.length,
    limit,
  };
};

const dashboard = () => {
  const products = read("products");
  const sales = read("sales");
  const purchases = read("purchases");
  const expenses = read("expenses");
  const revenue = sales.reduce(
    (sum, sale) => sum + Number(sale.totalAmount || 0),
    0,
  );
  const profit = sales.reduce(
    (sum, sale) =>
      sum +
      sale.items.reduce((itemSum, item) => {
        const product = relation("products", item.product);
        return (
          itemSum +
          item.quantity * ((item.unitPrice || 0) - (product?.buyingPrice || 0))
        );
      }, 0),
    0,
  );
  const values = {
    today: revenue,
    yesterday: revenue * 0.72,
    lastSevenDays: revenue * 0.86,
    thisMonth: revenue,
  };
  return {
    statistics: {
      totalProducts: products.length,
      totalCategories: read("categories").length,
      totalSuppliers: read("suppliers").length,
      totalCustomers: read("customers").length,
      totalSales: sales.length,
      totalPurchases: purchases.length,
      totalExpenses: expenses.length,
      totalUsers: read("users").length,
      lowStockProducts: products.filter((item) => item.quantity <= 5).length,
    },
    todaySales: revenue,
    salesCountToday: sales.length,
    businessPerformance: {
      revenue: values,
      profit: {
        today: profit,
        yesterday: profit * 0.72,
        lastSevenDays: profit * 0.86,
        thisMonth: profit,
      },
    },
    recentSales: sales
      .slice(-5)
      .reverse()
      .map((item) => decorate("sales", item)),
    recentPurchases: purchases
      .slice(-5)
      .reverse()
      .map((item) => decorate("purchases", item)),
    lowStockProducts: products
      .filter((item) => item.quantity <= 10)
      .map((item) => decorate("products", item)),
  };
};

const normalizeBody = (body) =>
  body instanceof FormData
    ? Object.fromEntries(body.entries())
    : { ...(body || {}) };
const endpointKey = (path) =>
  ({
    "/users": "users",
    "/categories": "categories",
    "/products": "products",
    "/suppliers": "suppliers",
    "/customers": "customers",
    "/purchases": "purchases",
    "/sales": "sales",
    "/expenses": "expenses",
  })[path];

const api = {
  async get(url) {
    const { path, params } = parseUrl(url);
    if (path === "/dashboard") return { data: dashboard() };
    if (path === "/users/employees")
      return { data: read("users").filter((item) => item.role === "Employee") };
    if (path === "/reports") {
      const sales = list("sales", params);
      const filteredSales = sales;
      const totalRevenue = filteredSales.reduce(
        (sum, item) => sum + Number(item.totalAmount || 0),
        0,
      );
      const totalCOGS = filteredSales.reduce(
        (sum, sale) =>
          sum +
          sale.items.reduce(
            (total, item) =>
              total +
              item.quantity *
                Number(relation("products", item.product)?.buyingPrice || 0),
            0,
          ),
        0,
      );
        const totalPurchases = read("purchases").reduce(
          (sum, item) => sum + Number(item.totalAmount || 0),
          0,
        );
        const totalExpenses = read("expenses").reduce(
          (sum, item) => sum + Number(item.amount || 0),
          0,
        );
        const paymentSummary = { Cash: 0, EVC: 0, "E-Dahab": 0, Bank: 0 };
        const productsById = {};
        const customersById = {};
        const employeesById = {};

        filteredSales.forEach((sale) => {
          paymentSummary[sale.paymentMethod] =
            (paymentSummary[sale.paymentMethod] || 0) + Number(sale.totalAmount || 0);
          sale.items.forEach((item) => {
            const product = relation("products", item.product);
            const productKey = product?._id || item.product;
            productsById[productKey] ||= {
              product: product?.name || "Unknown product",
              quantitySold: 0,
              revenue: 0,
            };
            productsById[productKey].quantitySold += Number(item.quantity || 0);
            productsById[productKey].revenue += Number(item.total || item.quantity * item.unitPrice || 0);
          });

          const customerKey = sale.customer?._id || "walk-in";
          customersById[customerKey] ||= {
            customer: sale.customer?.name || "Walk-in Customer",
            invoices: 0,
            amountSpent: 0,
          };
          customersById[customerKey].invoices += 1;
          customersById[customerKey].amountSpent += Number(sale.totalAmount || 0);

          const employeeKey = sale.createdBy?._id || "unknown";
          employeesById[employeeKey] ||= {
            employee: sale.createdBy?.name || "Unknown employee",
            invoicesCreated: 0,
            revenue: 0,
            profit: 0,
          };
          employeesById[employeeKey].invoicesCreated += 1;
          employeesById[employeeKey].revenue += Number(sale.totalAmount || 0);
          employeesById[employeeKey].profit += sale.items.reduce((sum, item) => {
            const product = relation("products", item.product);
            return sum + Number(item.quantity || 0) * (Number(item.unitPrice || 0) - Number(product?.buyingPrice || 0));
          }, 0);
        });

        const topProducts = Object.values(productsById).sort((a, b) => b.quantitySold - a.quantitySold);
        const topCustomers = Object.values(customersById).sort((a, b) => b.amountSpent - a.amountSpent);
        const employeePerformance = Object.values(employeesById).sort((a, b) => b.revenue - a.revenue);
        const page = Number(params.get("page") || 1);
        const limit = Number(params.get("limit") || 10);
        const totalPages = filteredSales.length ? Math.ceil(filteredSales.length / limit) : 0;
      return {
        data: {
          summary: {
            totalRevenue,
            totalCOGS,
            totalGrossProfit: totalRevenue - totalCOGS,
              totalPurchases,
              totalExpenses,
              totalNetProfit: totalRevenue - totalCOGS - totalExpenses,
              totalSales: totalRevenue,
              totalInvoices: filteredSales.length,
          },
          showBusinessCosts: true,
            paymentSummary,
            topProducts,
            topCustomers,
            employeePerformance,
            sales: filteredSales.slice((page - 1) * limit, page * limit),
            currentPage: page,
            totalPages,
            totalSales: filteredSales.length,
            limit,
        },
      };
    }
    const key = endpointKey(path);
    if (!key) throw new Error("Demo endpoint not found");
    const itemId = path.split("/")[2];
    if (itemId) {
      const item = read(key).find((entry) => entry._id === itemId);
      return { data: decorate(key, item) };
    }
    const items = list(key, params);
    if (["sales", "purchases", "expenses"].includes(key))
      return { data: paginated(items, params, key) };
    return { data: items };
  },
  async post(url, body) {
    const { path } = parseUrl(url);
    if (path === "/auth/login")
      return { data: { token: "demo-token", user: demoUser } };
    const key = endpointKey(path);
    if (!key) throw new Error("Demo endpoint not found");
    const input = normalizeBody(body);
    const record = {
      ...input,
      _id: id(key.slice(0, -1)),
      createdAt: new Date().toISOString(),
    };
    if (key === "products") {
      record.buyingPrice = Number(record.buyingPrice);
      record.sellingPrice = Number(record.sellingPrice);
      record.quantity = Number(record.quantity);
      record.image = "";
    }
    if (["purchases", "expenses"].includes(key)) {
      record.quantity = Number(record.quantity || 0);
      record.unitPrice = Number(record.unitPrice || 0);
      record.amount = Number(record.amount || 0);
      record.totalAmount = Number(
        record.totalAmount || record.quantity * record.unitPrice,
      );
    }
    if (key === "sales") {
      record.totalAmount = input.items.reduce(
        (sum, item) =>
          sum +
          Number(item.quantity) *
            Number(relation("products", item.product)?.sellingPrice || 0),
        0,
      );
      record.invoiceNumber = `INV-2026-${Date.now().toString().slice(-5)}`;
      record.createdBy = demoUser._id;
      record.createdAt = new Date().toISOString();
      input.items.forEach((item) => {
        const products = read("products");
        const product = products.find((entry) => entry._id === item.product);
        if (product) product.quantity -= Number(item.quantity);
        write("products", products);
      });
    }
    const records = read(key);
    records.push(record);
    write(key, records);
    return { data: decorate(key, record) };
  },
  async put(url, body) {
    const { path } = parseUrl(url);
    const key = endpointKey(path.split("/").slice(0, 2).join("/"));
    const itemId = path.split("/")[2];
    if (!key) throw new Error("Demo endpoint not found");
    const input = normalizeBody(body);
    const records = read(key);
    const index = records.findIndex((item) => item._id === itemId);
    if (index === -1) throw new Error("Record not found");
    records[index] = {
      ...records[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    if (key === "products") {
      records[index].buyingPrice = Number(records[index].buyingPrice);
      records[index].sellingPrice = Number(records[index].sellingPrice);
      records[index].quantity = Number(records[index].quantity);
    }
    if (key === "expenses")
      records[index].amount = Number(records[index].amount);
    write(key, records);
    return { data: decorate(key, records[index]) };
  },
  async delete(url) {
    const { path } = parseUrl(url);
    const key = endpointKey(path.split("/").slice(0, 2).join("/"));
    const itemId = path.split("/")[2];
    if (!key) throw new Error("Demo endpoint not found");
    write(
      key,
      read(key).filter((item) => item._id !== itemId),
    );
    return { data: { message: "Record deleted." } };
  },
};

export const IMAGE_BASE_URL = "";
export default api;
