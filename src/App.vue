<script setup>
import { ref, computed, onMounted } from "vue";
import FeedingSession from "./components/FeedingSession.vue";
import DiaperMenu from "./components/DiaperMenu.vue";
import StatsSection from "./components/StatsSection.vue";
import ActivityLog from "./components/ActivityLog.vue";
import EditFeedingModal from "./components/EditFeedingModal.vue";
import { loadEntries, saveEntries } from "./utils/storage.js";

// State
const entries = ref([]);
const showDiaperMenu = ref(false);
const diaperSelection = ref({ poop: false, pee: false });
const activeFeedingSession = ref(null);
const activeLeftBreast = ref(null);
const activeRightBreast = ref(null);
const feedingData = ref({ leftBreast: 0, rightBreast: 0 });
const leftBreastDuration = ref(0);
const rightBreastDuration = ref(0);
const showEditModal = ref(false);
const editingIndex = ref(null);
const editingFeedingData = ref({ leftBreast: 0, rightBreast: 0 });
const toastMessage = ref(null);
const showToast = ref(false);
const notificationPermission = ref("default");
const showPermissionPrompt = ref(false);

let timerInterval = null;
let notificationInterval = null;

const NOTIFICATION_MESSAGES = [
    "Are you still there?",
    "How's it going?",
    "Do you want to switch breasts?",
    "Still feeding?",
];

// For testing: use shorter timer (30 seconds) if ?test param is present
// Remove ?test from URL to use production 5-minute timer
const NOTIFICATION_INTERVAL_MS = new URLSearchParams(
    window.location.search
).has("test")
    ? 30 * 1000 // 30 seconds for testing
    : 5 * 60 * 1000; // 5 minutes production

// Lifecycle
onMounted(() => {
    entries.value = loadEntries();
    requestNotificationPermission();
});

// Request notification permission
const requestNotificationPermission = async () => {
    if ("Notification" in window) {
        if (Notification.permission === "default") {
            console.log("[Notification] Requesting permission...");
            try {
                const result = await Notification.requestPermission();
                notificationPermission.value = result;
                console.log("[Notification] Permission result:", result);
                if (result === "denied") {
                    showInAppToast(
                        "Notifications disabled. Enable in settings to receive feeding reminders."
                    );
                }
            } catch (e) {
                console.error("[Notification] Permission request failed:", e);
            }
        } else {
            notificationPermission.value = Notification.permission;
            console.log("[Notification] Current permission:", Notification.permission);
        }
    }

    // Register service worker for background notifications
    if ("serviceWorker" in navigator) {
        try {
            await navigator.serviceWorker.ready;
            console.log("[ServiceWorker] Ready for notifications");
        } catch (e) {
            console.warn("[ServiceWorker] Not ready:", e);
        }
    }
};

// Feeding Session Management
const startFeedingSession = () => {
    activeFeedingSession.value = new Date().getTime();
    feedingData.value = { leftBreast: 0, rightBreast: 0 };
    startTimer();

    // Request wake lock on PWA to prevent timer from being suspended
    if ("wakeLock" in navigator) {
        navigator.wakeLock.request("screen").catch((e) => {
            console.warn("[WakeLock] Failed to acquire wake lock:", e);
        });
    }
};

const endFeedingSession = () => {
    if (!activeFeedingSession.value) return;

    if (activeLeftBreast.value) {
        endBreastFeeding("left");
    }
    if (activeRightBreast.value) {
        endBreastFeeding("right");
    }

    if (timerInterval) clearInterval(timerInterval);
    if (notificationInterval) clearInterval(notificationInterval);

    entries.value.push({
        type: "feeding",
        startTime: activeFeedingSession.value,
        endTime: new Date().getTime(),
        leftBreast: feedingData.value.leftBreast,
        rightBreast: feedingData.value.rightBreast,
    });

    activeFeedingSession.value = null;
    activeLeftBreast.value = null;
    activeRightBreast.value = null;
    saveEntries(entries.value);
};

// Breast Feeding
const startBreastFeeding = (breast) => {
    if (breast === "left") {
        activeLeftBreast.value = new Date().getTime();
    } else {
        activeRightBreast.value = new Date().getTime();
    }
    startNotificationTimer();
};

// Show in-app toast notification (only when tab is active)
const showInAppToast = (message) => {
    if (document.hidden) {
        console.log("[Toast] Tab is hidden, skipping in-app toast");
        return;
    }
    toastMessage.value = message;
    showToast.value = true;
    setTimeout(() => {
        showToast.value = false;
    }, 3000);
};

// Send notification reminder and restart timer
const sendNotification = async () => {
    const randomMessage =
        NOTIFICATION_MESSAGES[
        Math.floor(Math.random() * NOTIFICATION_MESSAGES.length)
        ];

    console.log("[Notification] Sending reminder:", randomMessage);

    let notificationSent = false;

    // Try browser notification first
    if ("Notification" in window) {
        const permission = Notification.permission;
        console.log("[Notification] Current permission:", permission);

        if (permission === "granted") {
            try {
                // Try sending via service worker if available
                if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({
                        type: "SEND_NOTIFICATION",
                        title: "Baby Log",
                        options: {
                            body: randomMessage,
                            tag: "baby-log-reminder",
                            requireInteraction: true,
                            icon: "/pwa-192x192.png",
                            badge: "/pwa-192x192.png",
                        },
                    });
                    console.log("[Notification] Sent via service worker");
                    notificationSent = true;
                } else {
                    // Fallback: send directly
                    const notif = new Notification("Baby Log", {
                        body: randomMessage,
                        tag: "baby-log-reminder",
                        requireInteraction: true,
                        icon: "/pwa-192x192.png",
                        badge: "/pwa-192x192.png",
                    });
                    notif.addEventListener("click", () => {
                        window.focus();
                        notif.close();
                    });
                    console.log("[Notification] Browser notification sent directly");
                    notificationSent = true;
                }
            } catch (e) {
                console.error("[Notification] Failed to send notification:", e);
            }
        } else if (permission === "denied") {
            console.log(
                "[Notification] Permission denied. Notification won't show on background."
            );
        } else if (permission === "default") {
            console.log(
                "[Notification] Permission not yet granted. Request will show on next interaction."
            );
        }
    }

    // Always show toast when active
    showInAppToast(randomMessage);

    // Log notification status
    if (!notificationSent) {
        console.log(
            "[Notification] Browser notification not sent. Using toast fallback."
        );
    }

    // Restart the timer after notification is sent
    restartNotificationTimer();
};

// Restart notification timer (resets the countdown)
const restartNotificationTimer = () => {
    if (notificationInterval) clearInterval(notificationInterval);
    const delayMs = NOTIFICATION_INTERVAL_MS;
    const delayLabel = delayMs === 30000 ? "30 seconds (test mode)" : "5 minutes";

    notificationInterval = setTimeout(() => {
        console.log("[Timer] Notification timer fired");
        if (activeLeftBreast.value || activeRightBreast.value) {
            console.log("[Timer] Breast still active, sending notification");
            sendNotification();
        } else {
            console.log("[Timer] No active breast, skipping notification");
        }
    }, delayMs);

    console.log(`[Timer] Notification timer scheduled for ${delayLabel}`);
};

// Start notification timer (fires first notification after 5 minutes)
const startNotificationTimer = () => {
    console.log("[Timer] Starting notification timer");
    restartNotificationTimer();
};

const endBreastFeeding = (breast) => {
    if (breast === "left" && activeLeftBreast.value) {
        const duration = Math.floor(
            (new Date().getTime() - activeLeftBreast.value) / 1000
        );
        feedingData.value.leftBreast = duration;
        activeLeftBreast.value = null;
        leftBreastDuration.value = 0;
    } else if (breast === "right" && activeRightBreast.value) {
        const duration = Math.floor(
            (new Date().getTime() - activeRightBreast.value) / 1000
        );
        feedingData.value.rightBreast = duration;
        activeRightBreast.value = null;
        rightBreastDuration.value = 0;
    }

    // Stop notification timer if both breasts are inactive
    if (!activeLeftBreast.value && !activeRightBreast.value) {
        if (notificationInterval) clearInterval(notificationInterval);
    }
};

const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (activeLeftBreast.value) {
            leftBreastDuration.value = Math.floor(
                (new Date().getTime() - activeLeftBreast.value) / 1000
            );
        }
        if (activeRightBreast.value) {
            rightBreastDuration.value = Math.floor(
                (new Date().getTime() - activeRightBreast.value) / 1000
            );
        }
    }, 100);
};

// Diaper Management
const addDiaperEntry = () => {
    if (diaperSelection.value.poop || diaperSelection.value.pee) {
        entries.value.push({
            type: "diaper",
            poop: diaperSelection.value.poop,
            pee: diaperSelection.value.pee,
            timestamp: new Date().getTime(),
        });
        saveEntries(entries.value);
        closeDiaperMenu();
    }
};

const closeDiaperMenu = () => {
    showDiaperMenu.value = false;
    diaperSelection.value = { poop: false, pee: false };
};

// Entry Editing
const editFeedingEntry = (index) => {
    editingIndex.value = index;
    const entry = entries.value[index];
    editingFeedingData.value = {
        leftBreast: entry.leftBreast || 0,
        rightBreast: entry.rightBreast || 0,
    };
    showEditModal.value = true;
};

const saveEditedFeeding = () => {
    if (editingIndex.value !== null) {
        entries.value[editingIndex.value].leftBreast =
            editingFeedingData.value.leftBreast || 0;
        entries.value[editingIndex.value].rightBreast =
            editingFeedingData.value.rightBreast || 0;
        saveEntries(entries.value);
        showEditModal.value = false;
        editingIndex.value = null;
    }
};

const removeEntry = (index) => {
    entries.value.splice(index, 1);
    saveEntries(entries.value);
};

const clearAll = () => {
    if (confirm("Are you sure? This will delete all entries.")) {
        entries.value = [];
        saveEntries(entries.value);
    }
};

// Computed Properties
const sortedEntries = computed(() => {
    return [...entries.value].sort((a, b) => {
        const timeA = a.startTime || a.timestamp || 0;
        const timeB = b.startTime || b.timestamp || 0;
        return timeB - timeA;
    });
});

const getLast24Hours = () => {
    return new Date().getTime() - 24 * 60 * 60 * 1000;
};

const feedingCount = computed(() => {
    const last24h = getLast24Hours();
    return entries.value.filter(
        (e) => e.type === "feeding" && (e.startTime || 0) > last24h
    ).length;
});

const poopCount = computed(() => {
    const last24h = getLast24Hours();
    return entries.value.filter(
        (e) => e.poop === true && (e.timestamp || 0) > last24h
    ).length;
});

const peeCount = computed(() => {
    const last24h = getLast24Hours();
    return entries.value.filter(
        (e) => e.pee === true && (e.timestamp || 0) > last24h
    ).length;
});
</script>

<template>
    <div class="min-h-screen pb-8">
        <!-- Toast Notification -->
        <transition name="slide-up">
            <div v-if="showToast"
                class="fixed bottom-4 left-4 right-4 max-w-sm mx-auto bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg">
                {{ toastMessage }}
            </div>
        </transition>

        <!-- Notification Permission Banner -->
        <transition name="slide-down">
            <div v-if="notificationPermission === 'denied'" class="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
                <div class="max-w-2xl mx-auto">
                    <p class="text-sm text-yellow-800">
                        <strong>Notifications disabled:</strong> Enable notifications in your phone's settings to
                        receive feeding reminders.
                    </p>
                </div>
            </div>
        </transition>

        <!-- Header -->
        <div class="bg-linear-to-r from-purple-100 to-blue-100 pt-8 pb-6 text-center soft-shadow">
            <h1 class="text-4xl font-light text-gray-700 mb-1">Baby Log</h1>
            <p class="text-gray-500 text-sm">Track feeding and diaper changes</p>
        </div>

        <!-- Main Content -->
        <div class="max-w-2xl mx-auto px-4 pt-8">
            <!-- Quick Add Section -->
            <div v-if="!activeFeedingSession" class="grid grid-cols-2 gap-4 mb-8">
                <button @click="startFeedingSession"
                    class="btn-primary text-white font-semibold py-6 px-4 rounded-xl soft-shadow transition">
                    <span class="text-2xl block mb-2">🍼</span>
                    Start Feeding
                </button>
                <button @click="showDiaperMenu = true"
                    class="btn-secondary text-white font-semibold py-6 px-4 rounded-xl soft-shadow transition">
                    <span class="text-2xl block mb-2">🩷</span>
                    Diaper
                </button>
            </div>

            <!-- Active Feeding Session -->
            <FeedingSession v-if="activeFeedingSession" :left-breast-active="!!activeLeftBreast"
                :right-breast-active="!!activeRightBreast" :left-breast-duration="leftBreastDuration"
                :right-breast-duration="rightBreastDuration" :left-breast-minutes="feedingData.leftBreast"
                :right-breast-minutes="feedingData.rightBreast" @end-session="endFeedingSession"
                @start-breast="startBreastFeeding" @end-breast="endBreastFeeding" />

            <!-- Diaper Menu -->
            <DiaperMenu v-if="showDiaperMenu" v-model="diaperSelection" @save="addDiaperEntry"
                @cancel="closeDiaperMenu" />

            <!-- Stats Section -->
            <StatsSection v-if="entries.length > 0" :feeding-count="feedingCount" :poop-count="poopCount"
                :pee-count="peeCount" />

            <!-- Activity Log -->
            <ActivityLog v-if="entries.length > 0" :entries="sortedEntries" :original-entries="entries"
                @edit-feeding="editFeedingEntry" @remove-entry="removeEntry" />

            <!-- Empty State -->
            <div v-else class="calm-card p-12 text-center soft-shadow">
                <div class="text-5xl mb-4">👶</div>
                <p class="text-gray-500">No entries yet. Start logging!</p>
            </div>

            <!-- Clear All Button -->
            <div v-if="entries.length > 0" class="mt-8 text-center">
                <button @click="clearAll" class="text-gray-400 hover:text-red-500 text-sm transition">
                    Clear all entries
                </button>
            </div>
        </div>

        <!-- Edit Feeding Modal -->
        <EditFeedingModal v-model="showEditModal" :feeding-data="editingFeedingData" @save="saveEditedFeeding" />
    </div>
</template>

<style>
body {
    background: linear-gradient(135deg, #f5f3ff 0%, #e8f4f8 100%);
    min-height: 100vh;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.soft-shadow {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.calm-card {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    border: 1px solid rgba(200, 220, 230, 0.5);
}

.btn-primary {
    background: linear-gradient(135deg, #a8e6cf 0%, #56ab91 100%);
    transition: all 0.3s ease;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px rgba(86, 171, 145, 0.3);
}

.btn-secondary {
    background: linear-gradient(135deg, #ffd3b6 0%, #ffaa64 100%);
    transition: all 0.3s ease;
}

.btn-secondary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px rgba(255, 170, 100, 0.3);
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
}

.modal-content {
    background: white;
    border-radius: 16px;
    padding: 24px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
}

input[type="number"],
input[type="text"] {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
}

input[type="number"]:focus,
input[type="text"]:focus {
    outline: none;
    border-color: #56ab91;
    box-shadow: 0 0 0 3px rgba(86, 171, 145, 0.1);
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s ease;
}

.slide-up-enter-from {
    transform: translateY(100%);
    opacity: 0;
}

.slide-up-leave-to {
    transform: translateY(100%);
    opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.3s ease;
}

.slide-down-enter-from {
    transform: translateY(-100%);
    opacity: 0;
}

.slide-down-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}
</style>
