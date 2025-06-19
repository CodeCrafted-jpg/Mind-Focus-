import api from "./api.js";

const EXTENSION_ID = import.meta.env.VITE_EXTENSION_ID;


// Establish and manage the port connection
let extensionPort = null;

const connectToExtension = () => {
    return new Promise((resolve, reject) => {
        if (extensionPort && extensionPort.connected) {
            resolve(extensionPort);
            return;
        }

        if (!window.chrome || !window.chrome.runtime || typeof window.chrome.runtime.connect !== 'function') {
            console.warn("⚠️ [Vite App] Chrome runtime connect API not available.");
            reject(new Error("Chrome runtime connect API not available."));
            return;
        }

        try {
            extensionPort = chrome.runtime.connect(EXTENSION_ID, { name: "midfocus_webapp_port" });

            extensionPort.onDisconnect.addListener(() => {
                console.warn("🔌 [Vite App] Extension port disconnected.");
                extensionPort = null;
                if (chrome.runtime.lastError) {
                    console.error("❌ [Vite App] Port disconnection error:", chrome.runtime.lastError.message);
                }
            });

            extensionPort.onMessage.addListener((response) => {
                console.log("⬅️ [Vite App] Received response from extension:", response);
            });

            console.log("🚀 [Vite App] Attempting to connect to extension.");
            resolve(extensionPort);

        } catch (e) {
            console.error("❌ [Vite App] Error connecting to extension:", e);
            reject(e);
        }
    });
};

// Call connect immediately when the service is loaded
connectToExtension().catch(err => console.error("Initial extension connection failed:", err));


export const authService = {
  async register(username, email, password) {
    const res = await api.post('/user/register', { username, email, password });

    if (res.data && res.data.token) {
      console.log("✅ [Register] Received token:", res.data.token);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      try {
        const port = await connectToExtension();
        port.postMessage({ type: "SAVE_AUTH_TOKEN", token: res.data.token });
        console.log("📤 [Register] SAVE_AUTH_TOKEN message sent via port.");
        port.postMessage({ type: "SYNC_BLOCKED_SITES" });
        console.log("📤 [Register] SYNC_BLOCKED_SITES message sent via port.");
      } catch (error) {
        console.error("❌ [Register] Error sending message to extension via port:", error);
      }
    } else {
      console.error("❌ [Register] No token found in response", res.data);
    }
    return res.data;
  },

  async login(email, password) {
    const res = await api.post('/user/login', { email, password });

    if (res.data && res.data.token) {
      console.log("✅ [Login] Received token:", res.data.token);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      try {
        const port = await connectToExtension();
        port.postMessage({ type: "SAVE_AUTH_TOKEN", token: res.data.token });
        console.log("📤 [Login] SAVE_AUTH_TOKEN message sent via port.");
        port.postMessage({ type: "SYNC_BLOCKED_SITES" });
        console.log("📤 [Login] SYNC_BLOCKED_SITES message sent via port.");
      } catch (error) {
        console.error("❌ [Login] Error sending message to extension via port:", error);
      }
    } else {
      console.error("❌ [Login] No token found in response", res.data);
    }
    return res.data;
  },

  logout() {
    console.log("🚪 [Logout] Removing token and notifying extension");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    (async () => {
      try {
        const port = await connectToExtension();
        port.postMessage({ type: "REMOVE_AUTH_TOKEN" });
        console.log("📤 [Logout] REMOVE_AUTH_TOKEN message sent via port (async).");
      } catch (e) {
        console.warn("⚠️ [Logout] Failed to send REMOVE_AUTH_TOKEN message via port:", e.message);
        if (window.chrome && window.chrome.runtime && typeof window.chrome.runtime.sendMessage === 'function') {
          try {
            chrome.runtime.sendMessage(EXTENSION_ID, { type: "REMOVE_AUTH_TOKEN" }, (response) => {
              if (chrome.runtime.lastError) {
                console.warn("⚠️ [Logout] Fallback sendMessage error:", chrome.runtime.lastError.message);
              } else {
                console.log("📤 [Logout] Fallback sendMessage sent. Response:", response);
              }
            });
          } catch (e2) {
            console.error("❌ [Logout] Fallback sendMessage unexpected error:", e2);
          }
        }
      }
    })();
  },

  // NOW syncBlockedSites IS PART OF THE EXPORTED authService OBJECT
  async syncBlockedSites() {
      console.log("🔃 [Vite App] Manually requesting SYNC_BLOCKED_SITES.");
      try {
          const port = await connectToExtension();
          port.postMessage({ type: "SYNC_BLOCKED_SITES" });
          console.log("📤 [Vite App] Manual SYNC_BLOCKED_SITES message sent via port.");
      } catch (error) {
          console.error("❌ [Vite App] Error sending manual SYNC_BLOCKED_SITES message:", error);
      }
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};
