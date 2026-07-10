/* =====================================================
   JARVIS - MAIN CONTROLLER
===================================================== */

import {
    initScene,
    setDashboardCallback,
    setCameraCallback,
    setChatCallback,
    zoomIn,
    zoomOut,
    getFPS
} from "./scene.js";

import {
    initUI,
    getButtons,
    showDashboard,
    showCamera,
    showChat,
    showProjects,
    closeWindow,
    notify,
    addSystemLog,
    startAutoLogs
} from "./ui.js";

let buttons;

window.addEventListener("DOMContentLoaded", init);

async function init() {
    initUI();

    buttons = getButtons();

    const canvas = document.getElementById("bgCanvas");
    initScene(canvas);

    bindButtons();
    registerSceneCallbacks();

    startAutoLogs();

    notify("Welcome Back");
    addSystemLog("JARVIS initialized");

    console.log("%cJARVIS ONLINE", "color:cyan;font-size:18px");
}

function bindButtons() {
    buttons.projectsBtn?.addEventListener("click", openProjects);
    buttons.dashboardBtn?.addEventListener("click", openDashboard);
    buttons.cameraBtn?.addEventListener("click", openCamera);
    buttons.chatBtn?.addEventListener("click", openChat);
}

function openDashboardCommand() {
    showDashboard();
    zoomIn();
    addSystemLog("Dashboard opened");
}

function openCameraCommand() {
    showCamera();
    zoomIn();
    addSystemLog("Camera opened");
}

function openChatCommand() {
    showChat();
    zoomIn();
    addSystemLog("Chat opened");
}

function openProjectsCommand() {
    showProjects();
    zoomIn();
    addSystemLog("Projects opened");
}

function closeAllWindows() {
    closeWindow("projectsPanel");
    closeWindow("dashboardPanel");
    closeWindow("cameraPanel");
    closeWindow("chatPanel");

    zoomOut();

    notify("Windows Closed");
    addSystemLog("All windows closed");
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeAllWindows();
    }
});