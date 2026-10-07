"use strict";

/*
 * Calculator Extended Features
 *
 * Features:
 * 1. Light / Dark Theme Switching
 * 2. Calculation History Search
 * 3. Theme Preference Persistence
 */

(() => {

    // ==============================
    // 1. Get Existing Elements
    // ==============================

    const appHeader = document.querySelector(".app-header");

    const connectionStatus = document.getElementById(
        "connection-status"
    );

    const historyCard = document.querySelector(".history-card");

    const historyHeading = historyCard?.querySelector(
        ".section-heading"
    );

    const historyList = document.getElementById("history-list");


    if (
        !appHeader ||
        !connectionStatus ||
        !historyHeading ||
        !historyList
    ) {
        console.error("Extended feature elements not found.");
        return;
    }


    // ==============================
    // 2. Theme Switching
    // ==============================

    const THEME_STORAGE_KEY = "calculator-theme";

    const themeButton = document.createElement("button");

    themeButton.id = "theme-toggle";

    themeButton.type = "button";

    themeButton.className = "theme-toggle";

    appHeader.insertBefore(
        themeButton,
        connectionStatus
    );


    function setTheme(theme) {

        const isDark = theme === "dark";

        document.documentElement.setAttribute(
            "data-theme",
            isDark ? "dark" : "light"
        );

        themeButton.textContent = isDark
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";

        themeButton.setAttribute(
            "aria-pressed",
            String(isDark)
        );

        themeButton.setAttribute(
            "aria-label",
            isDark
                ? "Switch to light mode"
                : "Switch to dark mode"
        );
    }


    function getSavedTheme() {

        try {

            return localStorage.getItem(
                THEME_STORAGE_KEY
            );

        } catch {

            return null;
        }
    }


    function saveTheme(theme) {

        try {

            localStorage.setItem(
                THEME_STORAGE_KEY,
                theme
            );

        } catch {

            console.warn("Theme preference could not be saved.");
        }
    }


    const savedTheme = getSavedTheme();

    setTheme(savedTheme === "dark" ? "dark" : "light");


    themeButton.addEventListener("click", () => {

        const currentTheme =
            document.documentElement.getAttribute("data-theme");

        const nextTheme = currentTheme === "dark"
            ? "light"
            : "dark";

        setTheme(nextTheme);

        saveTheme(nextTheme);

    });


    // ==============================
    // 3. Create History Search UI
    // ==============================

    const searchContainer = document.createElement("div");

    searchContainer.className = "history-search";


    const searchLabel = document.createElement("label");

    searchLabel.htmlFor = "history-search-input";

    searchLabel.textContent = "Search Calculation History";


    const searchInput = document.createElement("input");

    searchInput.id = "history-search-input";

    searchInput.type = "search";

    searchInput.placeholder = "Search expression or result...";

    searchInput.autocomplete = "off";

    searchInput.setAttribute(
        "aria-describedby",
        "history-search-status"
    );


    const searchStatus = document.createElement("p");

    searchStatus.id = "history-search-status";

    searchStatus.className = "history-search-status";

    searchStatus.setAttribute(
        "aria-live",
        "polite"
    );


    searchContainer.appendChild(searchLabel);

    searchContainer.appendChild(searchInput);

    searchContainer.appendChild(searchStatus);


    historyHeading.insertAdjacentElement(
        "afterend",
        searchContainer
    );


    // ==============================
    // 4. Filter History Records
    // ==============================

    function filterHistory() {

        const keyword = searchInput.value
            .trim()
            .toLowerCase();

        const records = Array.from(
            historyList.querySelectorAll(".history-item")
        );

        let matchingCount = 0;


        records.forEach((record) => {

            const expressionElement = record.querySelector(
                ".history-expression"
            );

            const resultElement = record.querySelector(
                ".history-result"
            );


            const expression = (
                expressionElement?.textContent || ""
            ).toLowerCase();

            const result = (
                resultElement?.textContent || ""
            ).toLowerCase();


            const matches =
                expression.includes(keyword) ||
                result.includes(keyword);


            record.hidden = !matches;


            if (matches) {
                matchingCount++;
            }

        });


        // Update search feedback.

        if (keyword === "") {

            searchStatus.textContent = "";

            return;
        }


        if (records.length === 0) {

            searchStatus.textContent =
                "No history records available.";

            return;
        }


        if (matchingCount === 0) {

            searchStatus.textContent =
                "No matching calculations found.";

        } else {

            searchStatus.textContent =
                `Showing ${matchingCount} of ${records.length} records`;

        }

    }


    // ==============================
    // 5. Search Events
    // ==============================

    searchInput.addEventListener(
        "input",
        filterHistory
    );


    // ==============================
    // 6. Watch History Updates
    // ==============================

    /*
     * The original script.js dynamically updates
     * the history list after calculations and deletions.
     *
     * MutationObserver automatically reapplies the
     * active search filter whenever records change.
     */

    const historyObserver = new MutationObserver(() => {

        filterHistory();

    });


    historyObserver.observe(historyList, {

        childList: true

    });


    // ==============================
    // 7. Initial Search State
    // ==============================

    filterHistory();

})();