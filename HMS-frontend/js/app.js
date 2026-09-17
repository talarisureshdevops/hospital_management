// assets/js/app.js
// Replace with your deployed backend URL:
const API_BASE = "https://hms-backend-yqjj.onrender.com/api";

////////////////////////////////////////////////////////////////////////////////
// Small UI helpers
////////////////////////////////////////////////////////////////////////////////
function el(selector) {
  return document.querySelector(selector);
}
function els(selector) {
  return Array.from(document.querySelectorAll(selector));
}
function showAlert(msg, type = "info", timeout = 4000) {
  // Simple non-intrusive alert: create a small top-right box
  const wrapperId = "hms-alert-wrapper";
  let wrapper = document.getElementById(wrapperId);
  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.id = wrapperId;
    Object.assign(wrapper.style, {
      position: "fixed",
      top: "18px",
      right: "18px",
      zIndex: 9999,
      maxWidth: "320px",
    });
    document.body.appendChild(wrapper);
  }
  const box = document.createElement("div");
  box.textContent = msg;
  box.className = `hms-alert hms-alert-${type}`;
  Object.assign(box.style, {
    background: type === "error" ? "#f8d7da" : type === "success" ? "#d4edda" : "#d1ecf1",
    color: type === "error" ? "#721c24" : "#155724",
    padding: "10px 12px",
    margin: "6px 0",
    borderRadius: "6px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    fontSize: "14px",
  });
  wrapper.appendChild(box);
  setTimeout(() => box.remove(), timeout);
}

////////////////////////////////////////////////////////////////////////////////
// Auth helpers (works with JWT if backend provides token, or plain user)
////////////////////////////////////////////////////////////////////////////////
function saveAuth({ token = null, user = null }) {
  if (token) localStorage.setItem("hms_token", token);
  if (user) localStorage.setItem("hms_user", JSON.stringify(user));
}
function clearAuth() {
  localStorage.removeItem("hms_token");
  localStorage.removeItem("hms_user");
}
function getToken() {
  return localStorage.getItem("hms_token");
}
function getUser() {
  const s = localStorage.getItem("hms_user");
  return s ? JSON.parse(s) : null;
}

////////////////////////////////////////////////////////////////////////////////
// API wrapper
////////////////////////////////////////////////////////////////////////////////
async function api(path, { method = "GET", body = null, headers = {} } = {}) {
  const url = `${API_BASE}${path}`;
  const token = getToken();
  const finalHeaders = Object.assign(
    { "Content-Type": "application/json" },
    headers
  );
  if (token) finalHeaders.Authorization = `Bearer ${token}`;

  const opts = { method, headers: finalHeaders };
  if (body !== null) opts.body = JSON.stringify(body);

  let res;
  try {
    res = await fetch(url, opts);
  } catch (err) {
    throw new Error("Network error: " + err.message);
  }

  let data;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch (err) {
    // not JSON
    data = { raw: text };
  }

  if (!res.ok) {
    const errMsg =
      (data && data.error) ||
      (data && data.message) ||
      (data && data.raw) ||
      res.statusText ||
      "Request failed";
    const e = new Error(errMsg);
    e.status = res.status;
    e.body = data;
    throw e;
  }
  return data;
}

////////////////////////////////////////////////////////////////////////////////
// Auth flows
////////////////////////////////////////////////////////////////////////////////
async function registerFormHandler(e) {
  e.preventDefault();
  const name = el("#registerName")?.value?.trim();
  const email = el("#registerEmail")?.value?.trim();
  const password = el("#registerPassword")?.value;
  const role = el("#registerRole")?.value || "patient";

  if (!name || !email || !password) {
    showAlert("Please fill all registration fields", "error");
    return;
  }

  try {
    const data = await api("/auth/register", {
      method: "POST",
      body: { name, email, password, role },
    });

    // If server returns token + user, save both. If it returns only user, save user.
    if (data.token || data.user) {
      saveAuth({ token: data.token, user: data.user || data });
    } else if (data.id || data.message) {
      // fallback: server responded with an id or message — we still saved no token
      showAlert(data.message || "Registered", "success");
    }

    showAlert("Registration successful", "success");
    // redirect to login or dashboard if present
    if (window.location.pathname.endsWith("register.html")) {
      window.location.href = "login.html";
    } else {
      // try to go to dashboard
      setTimeout(() => (window.location.href = "dashboard.html"), 800);
    }
  } catch (err) {
    console.error("Register error", err);
    showAlert(err.message || "Registration failed", "error");
  }
}

async function loginFormHandler(e) {
  e.preventDefault();
  const email = el("#loginEmail")?.value?.trim();
  const password = el("#loginPassword")?.value;

  if (!email || !password) {
    showAlert("Please enter email and password", "error");
    return;
  }

  try {
    const data = await api("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    // Save token or user as returned
    if (data.token || data.user) {
      saveAuth({ token: data.token, user: data.user || data });
    } else if (data.user) {
      saveAuth({ user: data.user });
    } else if (data.id || data.message) {
      // fallback: maybe server returns user fields inline
      saveAuth({ user: data });
    }

    showAlert("Login successful", "success");
    setTimeout(() => (window.location.href = "dashboard.html"), 400);
  } catch (err) {
    console.error("Login error", err);
    showAlert(err.message || "Login failed", "error");
  }
}

function logoutHandler(e) {
  e?.preventDefault();
  clearAuth();
  showAlert("Logged out", "success");
  setTimeout(() => (window.location.href = "index.html"), 400);
}

////////////////////////////////////////////////////////////////////////////////
// Patients example: fetch and add
////////////////////////////////////////////////////////////////////////////////
async function fetchPatients() {
  try {
    const data = await api("/patients", { method: "GET" });
    renderPatients(data || []);
  } catch (err) {
    console.error("Fetch patients error", err);
    showAlert("Could not load patients: " + err.message, "error");
  }
}

function renderPatients(list) {
  const container = el("#patientsList");
  if (!container) return;
  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = "<p>No patients found.</p>";
    return;
  }

  const ul = document.createElement("ul");
  ul.className = "list-group";
  list.forEach((p) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `<div><strong>${escapeHtml(p.name)}</strong><div class="text-muted">${p.phone || ""}</div></div>
      <div class="text-muted small">${p.created_at ? new Date(p.created_at).toLocaleString() : ""}</div>`;
    ul.appendChild(li);
  });
  container.appendChild(ul);
}

async function addPatientHandler(e) {
  e.preventDefault();
  const name = el("#patientName")?.value?.trim();
  const age = parseInt(el("#patientAge")?.value || "0", 10);
  const phone = el("#patientPhone")?.value?.trim();
  const gender = el("#patientGender")?.value || "";
  const address = el("#patientAddress")?.value?.trim();

  if (!name) {
    showAlert("Patient name required", "error");
    return;
  }

  try {
    const res = await api("/patients", {
      method: "POST",
      body: { name, age, phone, gender, address },
    });
    showAlert("Patient added", "success");
    // Clear form
    const form = el("#patientForm");
    if (form) form.reset();
    // Refresh list
    fetchPatients();
  } catch (err) {
    console.error("Add patient error", err);
    showAlert("Could not add patient: " + err.message, "error");
  }
}

////////////////////////////////////////////////////////////////////////////////
// Small utility
////////////////////////////////////////////////////////////////////////////////
function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

////////////////////////////////////////////////////////////////////////////////
// Hook up event listeners on DOM load
////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
  // Auth UI
  const registerForm = el("#registerForm");
  if (registerForm) registerForm.addEventListener("submit", registerFormHandler);

  const loginForm = el("#loginForm");
  if (loginForm) loginForm.addEventListener("submit", loginFormHandler);

  const logoutBtn = el("#logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logoutHandler);

  // Patients UI
  const patientForm = el("#patientForm");
  if (patientForm) patientForm.addEventListener("submit", addPatientHandler);

  // If patients list exists on page, fetch patients
  if (el("#patientsList")) {
    fetchPatients();
  }

  // Optional: show logged-in user's name in UI
  const user = getUser();
  if (user) {
    const nameSpans = els(".hms-current-user");
    nameSpans.forEach((s) => (s.textContent = user.name || user.email || "User"));
  }
});
