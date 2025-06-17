// Wrap the entire script in a try-catch for robust startup error handling
try {
  let blockedSites = [];

  console.log("🚀 Service Worker starting up...");

  // Use a map to store active ports (useful if you want to identify different connections)
  const activePorts = new Map();
  let portIdCounter = 0;

  // Listen for external connections from the Vite App
  chrome.runtime.onConnectExternal.addListener((port) => {
    // Check if the connecting origin matches your Vite app's origin
    const allowedOrigin = "http://localhost:5173"; // Ensure this matches your Vite app's URL
    if (port.sender && port.sender.url && new URL(port.sender.url).origin !== allowedOrigin) {
      console.warn(`⚠️ Connection attempt from unauthorized origin: ${port.sender.url}`);
      return; // Reject unauthorized connections
    }

    const currentPortId = portIdCounter++;
    activePorts.set(currentPortId, port);
    console.log(`🔌 External port connected: ${port.name || 'Unnamed'} (ID: ${currentPortId})`);

    // Listen for messages coming through this specific port
    port.onMessage.addListener((message) => {
      try {
        console.log(`📩 Message received on port ${currentPortId} (${port.name || 'Unnamed'}):`, message);

        if (message.type === "SAVE_AUTH_TOKEN") {
          if (message.token) {
            chrome.storage.local.set({ authToken: message.token }, () => {
              console.log("🔐 Auth token saved to chrome.storage:", message.token);
              // Send response back on the same port
              port.postMessage({ type: "SAVE_AUTH_TOKEN_RESPONSE", success: true });
            });
          } else {
            console.warn("⚠️ No token provided in SAVE_AUTH_TOKEN message");
            port.postMessage({ type: "SAVE_AUTH_TOKEN_RESPONSE", success: false, error: "Missing token" });
          }
        } else if (message.type === "REMOVE_AUTH_TOKEN") {
          chrome.storage.local.remove("authToken", () => {
            console.log("🧹 Token removed from chrome.storage");
            port.postMessage({ type: "REMOVE_AUTH_TOKEN_RESPONSE", success: true });
            // After removing the token, also clear all existing blocking rules
            chrome.declarativeNetRequest.updateDynamicRules({
              removeRuleIds: Array.from({length: 1000}, (_, i) => i + 1), // Remove up to 1000 rules, adjust as needed
              addRules: []
            }, () => {
              console.log("🧹 All DNR blocking rules cleared on logout.");
              if (chrome.runtime.lastError) {
                console.error("🔥 Error clearing DNR rules on logout:", chrome.runtime.lastError.message);
              }
            });
          });
        } else if (message.type === "SYNC_BLOCKED_SITES") {
          chrome.storage.local.get("authToken", (data) => {
            const token = data.authToken;
            console.log("🔍 SYNC_BLOCKED_SITES using token:", token);

            if (!token) {
              console.warn("⚠️ No auth token found for syncing blocked sites");
              port.postMessage({ type: "SYNC_BLOCKED_SITES_RESPONSE", success: false, error: "No auth token" });
              return;
            }

            fetch("http://localhost:8000/api/blockSites/get", {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
              .then(res => {
                if (!res.ok) {
                  throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
              })
              .then(data => {
                if (data.success) {
                  const domains = data.allSites.map(site => site.url);
                  updateBlockedSites(domains);
                  port.postMessage({ type: "SYNC_BLOCKED_SITES_RESPONSE", success: true, sites: domains });
                } else {
                  console.error("❌ Failed to sync sites:", data.message);
                  port.postMessage({ type: "SYNC_BLOCKED_SITES_RESPONSE", success: false, error: data.message });
                }
              })
              .catch(err => {
                console.error("❌ Error fetching blocked sites:", err);
                port.postMessage({ type: "SYNC_BLOCKED_SITES_RESPONSE", success: false, error: err.message });
              });
          });
        } else {
          // Handle unknown message types for debugging
          console.warn("❓ Unknown message type received:", message.type);
          port.postMessage({ type: "UNKNOWN_MESSAGE_RESPONSE", success: false, error: "Unknown message type" });
        }
      } catch (handlerError) {
        console.error("🔥 Error inside onMessage listener:", handlerError);
        port.postMessage({ type: "ERROR_RESPONSE", success: false, error: "Internal handler error" });
      }
    });

    // Handle disconnection
    port.onDisconnect.addListener(() => {
      activePorts.delete(currentPortId);
      console.log(`🔌 External port disconnected (ID: ${currentPortId})`);
      if (chrome.runtime.lastError) {
        console.warn("⚠️ Port disconnection error:", chrome.runtime.lastError.message);
      }
    });
  });

  console.log("✅ chrome.runtime.onConnectExternal listener registered.");

  // Heartbeat to periodically log and confirm Service Worker is alive
  let heartbeatInterval = setInterval(() => {
    console.log("💙 Service Worker Heartbeat...");
  }, 10000); // Log every 10 seconds

  // Called on install
  chrome.runtime.onInstalled.addListener(() => {
    console.log("🚀 Extension installed/updated.");
    chrome.storage.local.get("blockedSites", (data) => {
      blockedSites = data.blockedSites || [];
      console.log("🚀 Loaded from storage (onInstalled):", blockedSites);
      updateBlockingRules();
    });
  });

  // Save and update DNR rules
  function updateBlockedSites(newList) {
    blockedSites = newList || [];
    chrome.storage.local.set({ blockedSites }, () => {
      console.log("✅ Blocked sites updated:", blockedSites);
      updateBlockingRules();
    });
  }

  // Setup Dynamic Network Rules
  function updateBlockingRules() {
    const rules = blockedSites.map((site, index) => {
      try {
        const url = new URL(site);
        const hostname = url.hostname.replace("www.", "");
        return {
          id: index + 1,
          priority: 1,
          action: { type: "block" },
          condition: {
            urlFilter: `*://*.${hostname}/*`,
            resourceTypes: ["main_frame"]
          }
        };
      } catch (e) {
        console.warn("⚠️ Invalid URL skipped:", site, e.message);
        return null;
      }
    }).filter(Boolean);

    chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
      const oldIds = existingRules.map(rule => rule.id);
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: oldIds,
        addRules: rules
      }, () => {
        console.log("🔄 Updated DNR blocking rules");
        if (chrome.runtime.lastError) {
          console.error("🔥 Error updating DNR rules:", chrome.runtime.lastError.message);
        }
      });
    });
  }

} catch (e) {
  console.error("🚨 CRITICAL: Service Worker failed to initialize:", e);
}
