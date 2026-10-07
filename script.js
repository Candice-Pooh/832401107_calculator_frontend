"use strict";

/*
 * Calculator Frontend
 *
 * All mathematical calculations are performed by the backend.
 * The frontend only handles input, API requests and display.
 */

// Change this address when deploying the backend.
const API_BASE_URL = "https://candice0chen.pythonanywhere.com";


// =========================
// DOM Elements
// =========================

const calculatorForm = document.getElementById("calculator-form");

const expressionInput = document.getElementById("expression");

const resultDisplay = document.getElementById("result");

const messageDisplay = document.getElementById("message");

const keypad = document.getElementById("keypad");

const calculateButton = document.getElementById("calculate-button");

const historyList = document.getElementById("history-list");

const historyCount = document.getElementById("history-count");

const refreshButton = document.getElementById("refresh-history");

const connectionStatus = document.getElementById("connection-status");

const connectionText = document.getElementById("connection-text");

let calculating = false;


// =========================
// Interface Helpers
// =========================

function showMessage(message, type = "") {
    messageDisplay.textContent = message;
    messageDisplay.className = `message ${type}`;
}


function updateConnection(connected) {
    connectionStatus.classList.toggle("connected", connected);

    connectionStatus.classList.toggle("disconnected", !connected);

    connectionText.textContent = connected
        ? "Backend Connected"
        : "Backend Offline";
}


function clearCalculator() {
    expressionInput.value = "";
    resultDisplay.textContent = "0";

    showMessage("");

    expressionInput.focus();
}


function insertValue(value) {
    const start = expressionInput.selectionStart;
    const end = expressionInput.selectionEnd;

    expressionInput.setRangeText(
        value,
        start,
        end,
        "end"
    );

    resultDisplay.textContent = "0";

    showMessage("");

    expressionInput.focus();
}


function backspace() {
    const start = expressionInput.selectionStart;
    const end = expressionInput.selectionEnd;

    if (start !== end) {
        expressionInput.setRangeText("", start, end, "end");

    } else if (start > 0) {
        expressionInput.setRangeText(
            "",
            start - 1,
            start,
            "end"
        );
    }

    resultDisplay.textContent = "0";

    showMessage("");

    expressionInput.focus();
}


function negateExpression() {
    const expression = expressionInput.value.trim();

    if (!expression) {
        expressionInput.value = "-";

    } else if (
        expression.startsWith("-(") &&
        expression.endsWith(")")
    ) {
        expressionInput.value = expression.slice(2, -1);

    } else {
        expressionInput.value = `-(${expression})`;
    }

    resultDisplay.textContent = "0";

    showMessage("");

    expressionInput.focus();
}


// =========================
// Backend API
// =========================

async function apiRequest(path, options = {}) {
    let response;

    try {
        response = await fetch(
            `${API_BASE_URL}${path}`,
            options
        );

    } catch {
        updateConnection(false);

        throw new Error(
            "Cannot connect to the backend server."
        );
    }

    let data;

    try {
        data = await response.json();

    } catch {
        throw new Error(
            "The server returned an invalid response."
        );
    }

    if (!response.ok || data.success === false) {
        throw new Error(
            data.message || "The request failed."
        );
    }

    updateConnection(true);

    return data;
}


// =========================
// Calculate Expression
// =========================

async function calculateExpression() {
    if (calculating) {
        return;
    }

    const input = expressionInput.value.trim();

    if (!input) {
        showMessage("Please enter an expression.", "error");
        return;
    }

    // Convert visual symbols to backend operators.
    // This is NOT a mathematical calculation.
    const expression = input
        .replaceAll("×", "*")
        .replaceAll("÷", "/")
        .replaceAll("−", "-");

    calculating = true;

    calculateButton.disabled = true;
    expressionInput.disabled = true;

    keypad.querySelectorAll("button").forEach((button) => {
        button.disabled = true;
    });

    calculateButton.textContent = "Calculating...";

    showMessage("Sending expression to backend...");

    try {
        const data = await apiRequest(
            "/api/calculate",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    expression: expression
                })
            }
        );

        // Display the result returned by Flask.
        resultDisplay.textContent = data.result;

        showMessage(
            "Calculation completed successfully.",
            "success"
        );

        await loadHistory();

    } catch (error) {
        resultDisplay.textContent = "Error";

        showMessage(error.message, "error");

    } finally {
        calculating = false;

        expressionInput.disabled = false;

        keypad.querySelectorAll("button").forEach((button) => {
            button.disabled = false;
        });

        calculateButton.textContent = "= Calculate";
    }
}


// =========================
// History Display
// =========================

function formatTime(timestamp) {
    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
        return timestamp;
    }

    return date.toLocaleString();
}


function renderHistory(records) {
    historyList.replaceChildren();

    historyCount.textContent =
        `${records.length} record${records.length === 1 ? "" : "s"}`;

    if (records.length === 0) {
        const emptyItem = document.createElement("li");

        emptyItem.className = "empty-state";

        emptyItem.textContent =
            "No calculations yet. Your history will appear here.";

        historyList.appendChild(emptyItem);

        return;
    }

    records.forEach((record) => {
        const item = document.createElement("li");

        item.className = "history-item";

        const info = document.createElement("div");

        info.className = "history-info";

        const expression = document.createElement("p");

        expression.className = "history-expression";

        expression.textContent = record.expression;

        const result = document.createElement("p");

        result.className = "history-result";

        result.textContent = `= ${record.result}`;

        const time = document.createElement("span");

        time.className = "history-time";

        time.textContent = formatTime(record.created_at);

        info.appendChild(expression);
        info.appendChild(result);
        info.appendChild(time);

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.className = "delete-button";

        deleteButton.textContent = "Delete";

        deleteButton.setAttribute(
            "aria-label",
            `Delete history record ${record.id}`
        );

        deleteButton.addEventListener("click", () => {
            deleteHistory(record.id);
        });

        item.appendChild(info);
        item.appendChild(deleteButton);

        historyList.appendChild(item);
    });
}


// =========================
// Load History
// =========================

async function loadHistory() {
    try {
        const data = await apiRequest("/api/history");

        renderHistory(data.history);

    } catch (error) {
        historyList.replaceChildren();

        const errorItem = document.createElement("li");

        errorItem.className = "empty-state";

        errorItem.textContent = error.message;

        historyList.appendChild(errorItem);

        historyCount.textContent = "Unavailable";
    }
}


// =========================
// Delete History
// =========================

async function deleteHistory(recordId) {
    try {
        await apiRequest(
            `/api/history/${recordId}`,
            {
                method: "DELETE"
            }
        );

        await loadHistory();

    } catch (error) {
        showMessage(error.message, "error");
    }
}


// =========================
// Button Events
// =========================

keypad.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button || button.type === "submit") {
        return;
    }

    const value = button.dataset.value;
    const action = button.dataset.action;

    if (value !== undefined) {
        insertValue(value);

    } else if (action === "clear") {
        clearCalculator();

    } else if (action === "backspace") {
        backspace();

    } else if (action === "negate") {
        negateExpression();
    }
});


// =========================
// Form Events
// =========================

calculatorForm.addEventListener("submit", (event) => {
    event.preventDefault();

    calculateExpression();
});


expressionInput.addEventListener("input", () => {
    resultDisplay.textContent = "0";
    showMessage("");
});


expressionInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        event.preventDefault();

        clearCalculator();
    }
});


refreshButton.addEventListener("click", loadHistory);


// =========================
// Application Initialization
// =========================

async function initializeApp() {
    await loadHistory();

    expressionInput.focus();
}

initializeApp();