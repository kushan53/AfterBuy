import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'localUsers.json');

const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
};

export const getLocalUsers = () => {
  try {
    ensureDataDir();
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data) || [];
  } catch (err) {
    console.warn('[LocalUserStore] Read error:', err.message);
    return [];
  }
};

export const findLocalUserByEmail = (email) => {
  if (!email) return null;
  const cleanEmail = email.toLowerCase().trim();
  const users = getLocalUsers();
  return users.find((u) => u.email.toLowerCase().trim() === cleanEmail) || null;
};

export const findLocalUserById = (id) => {
  if (!id) return null;
  const users = getLocalUsers();
  return users.find((u) => u.id === id || u._id === id) || null;
};

export const saveLocalUser = async ({ id, name, email, password, phone = '', city = '', returnPickupAddress = '' }) => {
  try {
    ensureDataDir();
    const cleanEmail = email.toLowerCase().trim();
    const users = getLocalUsers();
    const existingIndex = users.findIndex((u) => u.email.toLowerCase().trim() === cleanEmail);

    let hashedPassword = password;
    if (password && !password.startsWith('$2a$') && !password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const userData = {
      id: id || users[existingIndex]?.id || cleanEmail.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 24),
      _id: id || users[existingIndex]?.id || cleanEmail.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 24),
      name: name || users[existingIndex]?.name || cleanEmail.split('@')[0],
      email: cleanEmail,
      password: hashedPassword || users[existingIndex]?.password || '',
      phone: phone || users[existingIndex]?.phone || '',
      city: city || users[existingIndex]?.city || '',
      returnPickupAddress: returnPickupAddress || users[existingIndex]?.returnPickupAddress || '',
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...userData };
    } else {
      users.push(userData);
    }

    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
    return userData;
  } catch (err) {
    console.warn('[LocalUserStore] Save error:', err.message);
    return null;
  }
};

export const updateLocalUserPassword = async (email, newPlainTextPassword) => {
  try {
    ensureDataDir();
    const cleanEmail = email.toLowerCase().trim();
    const users = getLocalUsers();
    const existingIndex = users.findIndex((u) => u.email.toLowerCase().trim() === cleanEmail);
    if (existingIndex === -1) return false;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPlainTextPassword, salt);
    users[existingIndex].password = hashedPassword;
    users[existingIndex].updatedAt = new Date().toISOString();

    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.warn('[LocalUserStore] Update password error:', err.message);
    return false;
  }
};

export const verifyPassword = async (enteredPassword, storedPasswordHash) => {
  if (!enteredPassword || !storedPasswordHash) return false;
  try {
    return await bcrypt.compare(enteredPassword, storedPasswordHash);
  } catch {
    return false;
  }
};

const localOtps = new Map();

export const setLocalOtp = (email, otp) => {
  if (!email || !otp) return;
  const cleanEmail = email.toLowerCase().trim();
  localOtps.set(cleanEmail, {
    otp: otp.toString().trim(),
    expiresAt: Date.now() + 10 * 60 * 1000,
  });
};

export const verifyLocalOtp = (email, candidateOtp) => {
  if (!email || !candidateOtp) return false;
  const cleanEmail = email.toLowerCase().trim();
  const entry = localOtps.get(cleanEmail);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    localOtps.delete(cleanEmail);
    return false;
  }
  return entry.otp === candidateOtp.toString().trim();
};

export const clearLocalOtp = (email) => {
  if (!email) return;
  localOtps.delete(email.toLowerCase().trim());
};

