function generatePassword(length, useUppercase, useDigits, useSpecial) {
    let lower = "abcdefghijklmnopqrstuvwxyz";
    let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let digits = "0123456789";
    let special = "!@#$%^&*()-_=+[]{};:,.<>/?";
    let chars = lower;
    if (useUppercase) chars += upper;
    if (useDigits) chars += digits;
    if (useSpecial) chars += special;

    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

function saveHistory(entry) {
    const history = JSON.parse(localStorage.getItem("passwordHistory") || "[]");
    history.push(entry);
    localStorage.setItem("passwordHistory", JSON.stringify(history));
}

function loadHistory() {
    return JSON.parse(localStorage.getItem("passwordHistory") || "[]");
}

function renderHistory() {
    const history = loadHistory();
    const tbody = document.querySelector("#historyTable tbody");
    tbody.innerHTML = "";
    history.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.date}</td>
            <td>${item.appName}</td>
            <td>${item.username}</td>
            <td>${item.password}</td>
        `;
        tbody.appendChild(tr);
    });
}

function exportCSV() {
    const history = loadHistory();
    if (history.length === 0) return alert("Žádná historie k exportu.");
    let csv = "Datum,Aplikace/Web,Username,Heslo\n";
    history.forEach(item => {
        csv += `"${item.date}","${item.appName}","${item.username}","${item.password}"\n`;
    });
    const blob = new Blob([csv], {type: "text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hesla.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

document.getElementById("passwordForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const appName = document.getElementById("appName").value.trim();
    const username = document.getElementById("username").value.trim();
    const length = parseInt(document.getElementById("length").value);
    const useUppercase = document.getElementById("uppercase").checked;
    const useDigits = document.getElementById("digits").checked;
    const useSpecial = document.getElementById("special").checked;

    if (!appName || !username || isNaN(length) || length < 6) {
        document.getElementById("result").style.display = "flex";
        document.getElementById("generatedPassword").textContent = "Zadejte všechny údaje správně!";
        document.querySelector(".generated-label").textContent = "Chyba:";
        return;
    }
    if (!useUppercase && !useDigits && !useSpecial) {
        document.getElementById("result").style.display = "flex";
        document.getElementById("generatedPassword").textContent = "Vyber alespoň jeden typ znaků navíc!";
        document.querySelector(".generated-label").textContent = "Chyba:";
        return;
    }

    const password = generatePassword(length, useUppercase, useDigits, useSpecial);

    document.getElementById("result").style.display = "flex";
    document.getElementById("generatedPassword").textContent = password;
    document.querySelector(".generated-label").textContent = "Vygenerované heslo:";

    const entry = {
        date: new Date().toLocaleString("cs-CZ"),
        appName,
        username,
        password
    };
    saveHistory(entry);
    renderHistory();
});

document.getElementById("exportCSV").addEventListener("click", exportCSV);

renderHistory();