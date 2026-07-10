/* =====================================================
   JARVIS X - UI SYSTEM
===================================================== */

let startup;
let loaderFill;
let bootText;
let viewerBtn;

let dashboardPanel;
let cameraPanel;
let chatPanel;
let projectsPanel;

let projectsBtn;
let dashboardBtn;
let cameraBtn;  
let voiceBtn;
let chatBtn;

let clockDisplay;
let dateDisplay;

let voiceStatus;
let cameraStatus;

let systemLog;
let notificationContainer;

/* =====================================================
   BOOT SEQUENCE
===================================================== */

const bootLines = [
    "Initializing JARVIS Core...",
    "Loading Neural Matrix...",
    "Connecting Quantum Interface...",
    "Scanning Hardware...",
    "Activating Voice Engine...",
    "Synchronizing Systems...",
    "Starting Holographic Network...",
    "JARVIS ONLINE"
];

/* =====================================================
   INIT
===================================================== */

export function initUI() {

    startup =
        document.getElementById(
            "startup"
        );

    loaderFill =
        document.getElementById(
            "loaderFill"
        );

    bootText =
        document.getElementById(
            "bootText"
        );

    dashboardPanel =
        document.getElementById(
            "dashboardPanel"
        );

    cameraPanel =
        document.getElementById(
            "cameraPanel"
        );

    chatPanel =
        document.getElementById(
            "chatPanel"
        );
    projectsPanel =
        document.getElementById(
            "projectsPanel"
        );

    dashboardBtn =
        document.getElementById(
            "dashboardBtn"
        );

    cameraBtn =
        document.getElementById(
            "cameraBtn"
        );

    voiceBtn =
        document.getElementById(
            "voiceBtn"
        );
    viewerBtn =
        document.getElementById(
            "viewerBtn"
    );
    projectsBtn =
        document.getElementById(
            "projectsBtn"
    );
    chatBtn =
        document.getElementById(
            "chatBtn"
        );

    clockDisplay =
        document.getElementById(
            "clockDisplay"
        );

    dateDisplay =
        document.getElementById(
            "dateDisplay"
        );

    voiceStatus =
        document.getElementById(
            "voiceStatus"
        );

    cameraStatus =
        document.getElementById(
            "cameraStatus"
        );

    systemLog =
        document.getElementById(
            "systemLog"
        );

    notificationContainer =
        document.getElementById(
            "notificationContainer"
        );

    setupClock();

    setupWindowButtons();

    startBootSequence();
}

/* =====================================================
   BOOT ANIMATION
===================================================== */

function startBootSequence() {

    let progress = 0;
    let index = 0;

    const interval =
        setInterval(() => {

            progress += 12.5;

            loaderFill.style.width =
                progress + "%";

            if (
                index <
                bootLines.length
            ) {

                bootText.textContent =
                    bootLines[index];

                addSystemLog(
                    bootLines[index]
                );

                index++;
            }

            if (progress >= 100) {

                clearInterval(
                    interval
                );

                setTimeout(() => {

                    startup.classList.add(
                        "hidden"
                    );

                    notify(
                        "JARVIS ONLINE"
                    );

                }, 1200);
            }

        }, 700);
}

/* =====================================================
   CLOCK
===================================================== */

function setupClock() {

    updateClock();

    setInterval(
        updateClock,
        1000
    );
}

function updateClock() {

    const now =
        new Date();

    clockDisplay.textContent =
        now.toLocaleTimeString();

    dateDisplay.textContent =
        now.toLocaleDateString(
            undefined,
            {
                weekday:
                    "long",
                year:
                    "numeric",
                month:
                    "long",
                day:
                    "numeric"
            }
        );
}

/* =====================================================
   WINDOW SYSTEM
===================================================== */

function setupWindowButtons() {

    document
        .querySelectorAll(
            ".closeWindow"
        )
        .forEach(btn => {

            btn.addEventListener(
                "click",
                () => {

                    const target =
                        btn.dataset
                            .close;

                    closeWindow(
                        target
                    );
                }
            );
        });
}

export function openWindow(id) {

    const el =
        document.getElementById(
            id
        );

    if (!el) return;

    el.classList.add(
        "active"
    );
}

export function closeWindow(id) {

    const el =
        document.getElementById(
            id
        );

    if (!el) return;

    el.classList.remove(
        "active"
    );
}

/* =====================================================
   BUTTON ACCESS
===================================================== */

export function getButtons() {

    return {
        projectsBtn,
        dashboardBtn,
        cameraBtn,
        voiceBtn,
        chatBtn,
        viewerBtn
    };
}

/* =====================================================
   STATUS
===================================================== */

export function setVoiceStatus(
    text
) {

    if (
        !voiceStatus
    ) return;

    voiceStatus.textContent =
        text;
}

export function setCameraStatus(
    text
) {

    if (
        !cameraStatus
    ) return;

    cameraStatus.textContent =
        text;
}

/* =====================================================
   SYSTEM LOG
===================================================== */

export function addSystemLog(
    message
) {

    if (!systemLog)
        return;

    const line =
        document.createElement(
            "div"
        );

    const stamp =
        new Date()
            .toLocaleTimeString();

    line.textContent =
        `[${stamp}] ${message}`;

    systemLog.prepend(
        line
    );
}

export function startAutoLogs() {

    const logs = [

        "Neural matrix stable",

        "Voice engine ready",

        "Optical sensors online",

        "Memory integrity verified",

        "Telemetry synchronized",

        "Network status secure",

        "Scanning environment",

        "Subsystem check passed",

        "Power distribution normal",

        "AI core responsive"

    ];

    setInterval(() => {

        const random =
            logs[
                Math.floor(
                    Math.random() *
                    logs.length
                )
            ];

        addSystemLog(
            random
        );

    }, 6000);
}

/* =====================================================
   NOTIFICATIONS
===================================================== */

export function notify(
    text,
    duration = 3000
) {

    const item =
        document.createElement(
            "div"
        );

    item.className =
        "notification";

    item.textContent =
        text;

    notificationContainer
        .appendChild(item);

    setTimeout(() => {

        item.style.opacity =
            "0";

        item.style.transform =
            "translateX(40px)";

        setTimeout(() => {

            item.remove();

        }, 400);

    }, duration);
}

/* =====================================================
   AUDIO
===================================================== */

export function playAudio(
    id
) {

    const audio =
        document.getElementById(
            id
        );

    if (!audio)
        return;

    audio.currentTime = 0;

    audio.play()
        .catch(() => {});
}

/* =====================================================
   SHORTCUTS
===================================================== */

export function showDashboard() {

    openWindow(
        "dashboardPanel"
    );

    notify(
        "Dashboard Opened"
    );

    addSystemLog(
        "Dashboard opened"
    );
}

export function showCamera() {

    openWindow(
        "cameraPanel"
    );

    notify(
        "Camera Activated"
    );

    addSystemLog(
        "Camera interface opened"
    );
}

export function showChat() {

    openWindow(
        "chatPanel"
    );

    notify(
        "AI Chat Ready"
    );

    addSystemLog(
        "Chat console opened"
    );
}
export function showProjects() {

    openWindow(
        "projectsPanel"
    );

    notify(
        "Project Manager Opened"
    );

    addSystemLog(
        "Project Manager opened"
    );
}