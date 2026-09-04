/* ============================================================
   CALCROO — LOCAL SAVED CONFIGS (IndexedDB)
   Lưu toàn bộ input của các công cụ tính lương / thuế / HECS
   ngay trên trình duyệt người dùng — không cần tài khoản.
   Không phụ thuộc thư viện ngoài; API giống localForage.
   ============================================================ */

const DB_NAME = 'calcroo';
const DB_VERSION = 1;
const STORE = 'configs';

/* --- Danh bạ công cụ: dùng cho badge + link "mở lại trong công cụ" --- */
export const TOOLS = {
  pay: {
    route: '/pay-calculator/',
    viRoute: '/vi/tinh-luong-uc/',
    en: 'Pay Calculator',
    vi: 'Tính lương Úc',
  },
  'income-tax': {
    route: '/income-tax-calculator/',
    viRoute: '/vi/tinh-thue-thu-nhap-uc/',
    en: 'Income Tax Calculator',
    vi: 'Tính thuế thu nhập',
  },
  hecs: {
    route: '/hecs-repayment-calculator/',
    viRoute: '/vi/tinh-tra-no-hecs/',
    en: 'HECS Repayment Calculator',
    vi: 'Tính trả nợ HECS',
  },
  'casual-pay': {
    route: '/casual-pay-calculator/',
    viRoute: '/vi/tinh-luong-casual/',
    en: 'Casual Pay Calculator',
    vi: 'Tính lương casual',
  },
  'salary-sacrifice': {
    route: '/salary-sacrifice-calculator/',
    viRoute: '/vi/tinh-salary-sacrifice/',
    en: 'Salary Sacrifice Calculator',
    vi: 'Tính salary sacrifice',
  },
  'tax-refund': {
    route: '/tax-refund-calculator/',
    viRoute: '/vi/tinh-hoan-thue-uc/',
    en: 'Tax Refund Calculator',
    vi: 'Tính hoàn thuế',
  },
};

export function toolLabel(tool, lang = 'en') {
  const t = TOOLS[tool];
  if (!t) return tool;
  return lang === 'vi' ? t.vi : t.en;
}

export function toolRoute(tool, lang = 'en') {
  const t = TOOLS[tool];
  if (!t) return '/';
  return lang === 'vi' ? t.viRoute : t.route;
}

/* ------------------------------------------------------------------ */

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available in this browser.'));
      return;
    }
    let req;
    try {
      req = indexedDB.open(DB_NAME, DB_VERSION);
    } catch (err) {
      reject(err);
      return;
    }
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const os = db.createObjectStore(STORE, { keyPath: 'id' });
        os.createIndex('updatedAt', 'updatedAt');
        os.createIndex('tool', 'tool');
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('Could not open the local database.'));
    req.onblocked = () => reject(new Error('The local database is blocked by another tab.'));
  });
}

function promisify(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function store(db, mode) {
  return db.transaction(STORE, mode).objectStore(STORE);
}

function newId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'c_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ------------------------------------------------------------------ */

/** Tất cả bản lưu, mới nhất trước. */
export async function listConfigs() {
  const db = await openDB();
  try {
    const all = await promisify(store(db, 'readonly').getAll());
    return (all || []).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  } finally {
    db.close();
  }
}

/** Một bản lưu theo id (hoặc null). */
export async function getConfig(id) {
  if (!id) return null;
  const db = await openDB();
  try {
    return (await promisify(store(db, 'readonly').get(id))) || null;
  } finally {
    db.close();
  }
}

/**
 * Tạo bản lưu mới.
 * @param {{tool:string, name?:string, inputs:object, lang?:string, summary?:string}} data
 */
export async function saveConfig({ tool, name, inputs, lang = 'en', summary = '' }) {
  const db = await openDB();
  const now = Date.now();
  const record = {
    id: newId(),
    tool,
    name: (name && name.trim()) || `${toolLabel(tool, lang)} · ${new Date(now).toLocaleDateString('en-GB')}`,
    inputs: inputs || {},
    summary,
    lang,
    createdAt: now,
    updatedAt: now,
  };
  try {
    await promisify(store(db, 'readwrite').put(record));
    return record;
  } finally {
    db.close();
  }
}

/** Cập nhật một phần bản lưu (tên, inputs, summary…). Trả về bản ghi mới. */
export async function updateConfig(id, patch) {
  const db = await openDB();
  try {
    const existing = await promisify(store(db, 'readonly').get(id));
    if (!existing) return null;
    const updated = {
      ...existing,
      ...patch,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: Date.now(),
    };
    await promisify(store(db, 'readwrite').put(updated));
    return updated;
  } finally {
    db.close();
  }
}

/** Xoá một bản lưu. */
export async function deleteConfig(id) {
  const db = await openDB();
  try {
    await promisify(store(db, 'readwrite').delete(id));
  } finally {
    db.close();
  }
}
