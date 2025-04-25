document.addEventListener("DOMContentLoaded", () => {
    const chipInput = document.getElementById("chipInput");
    const chipContainer = document.getElementById("chipContainer");
    const names = [];
    
    // Use both `input` and `keydown` events to handle chip creation on both mobile and desktop
    chipInput.addEventListener("input", function () {
        if (this.value.includes(",")) {
            addChip(this.value.replace(",", "").trim());
            this.value = "";
        }
    });

    chipInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            addChip(this.value.trim());
            this.value = "";
        } else if ((event.key === "Backspace" || event.key === "Delete") && this.value === "") {
            removeLastChip();
        }
    });

    function addChip(name) {
        if (name && !names.includes(name)) {
            names.push(name);

            // Create a chip element
            const chip = document.createElement("div");
            chip.classList.add("chip");
            chip.innerText = name;

            // Create a close button for each chip
            const closeButton = document.createElement("button");
            closeButton.classList.add("close-btn");
            closeButton.innerHTML = "&times;";
            closeButton.onclick = () => removeChip(name, chip);

            chip.appendChild(closeButton);
            chipContainer.insertBefore(chip, chipInput);

            updatePayerOptions(); // Refresh the "payer" dropdown when a chip is added
            updatePayerAndPayeeOptions(); // Refresh the "payer" and "payee" dropdowns when a chip is added
        }
        else {
            showToastMessage("Duplicate or invalid name.", "warning");
        }
    }

    function showToastMessage(message, type = "error") {
        const toast = document.createElement("div");
        toast.className = `toast-message ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add("visible"), 100);
        setTimeout(() => {
            toast.classList.remove("visible");
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    function removeChip(name, chipElement) {
        const index = names.indexOf(name);
        if (index > -1) {
            names.splice(index, 1);
            chipElement.style.animation = "fadeOut 0.6s ease";
            chipElement.addEventListener("animationend", () => {
                chipElement.remove();
                updatePayerOptions(); // Refresh the "payer" dropdown when a chip is removed
                updatePayerAndPayeeOptions(); // Refresh the "payer" and "payee" dropdowns when a chip is added
            });
        }
    }

    function removeLastChip() {
        const lastChip = chipContainer.querySelector(".chip:last-child");
        if (lastChip) {
            const name = lastChip.innerText.trim();
            removeChip(name, lastChip);
        }
    }
});

/* Update the "Payer" dropdown with the list of names in the chips */
function updatePayerOptions() {
    const chipContainer = document.getElementById("chipContainer");
    const payerSelect = document.getElementById("payer");

    // Clear existing options in the "payer" dropdown
    payerSelect.innerHTML = '<option value="">Select Payer</option>';

    // Populate dropdown with names from chips
    const chips = chipContainer.querySelectorAll(".chip");
    chips.forEach(chip => {
        const name = chip.textContent.replace("×", "").trim();

        // Add each name as an option in the dropdown
        const option = document.createElement("option");
        option.value = name;
        option.text = name;
        payerSelect.add(option);
    });
}

function updatePayerAndPayeeOptions() {
    const chipContainer = document.getElementById("chipContainer");
    const payerSelect = document.getElementById("paymentPayer");
    const payeeSelect = document.getElementById("paymentPayee");

    // Clear existing options in the "payer" and "payee" dropdowns
    payerSelect.innerHTML = '<option value="">Select Payer</option>';
    payeeSelect.innerHTML = '<option value="">Select Payee</option>';

    // Populate dropdown with names from chips
    const chips = chipContainer.querySelectorAll(".chip");
    chips.forEach(chip => {
        const name = chip.textContent.replace("×", "").trim();

        // Add each name as an option in the dropdown
        const payerOption = document.createElement("option");
        payerOption.value = name;
        payerOption.text = name;
        payerSelect.add(payerOption);

        const payeeOption = document.createElement("option");
        payeeOption.value = name;
        payeeOption.text = name;
        payeeSelect.add(payeeOption);
    });
}

/* Show split details input fields based on the selected split type */
function showSplitDetails() {
    const splitType = document.getElementById("splitType").value;
    const splitDetailsDiv = document.getElementById("splitDetails");
    splitDetailsDiv.innerHTML = ""; // Clear previous details

    if (splitType !== "equal") {
        const chipContainer = document.getElementById("chipContainer");
        const chips = chipContainer.querySelectorAll(".chip");
        let html = "";

        if (splitType === "unequal") {
            html += '<div class="form-group"><label>Enter amounts for each person:</label>';
            chips.forEach(chip => {
                const name = chip.textContent.replace("×", "").trim();
                html += `
                    <div class="input-group mb-2">
                            <div class="input-group-prepend">
                            <div class="input-group-text name-label">${name}</div>
                        </div>
                        <input type="number" class="form-control split-value" data-name="${name}" placeholder="Amount for ${name}" oninput="updateRemainingAmount()">
                    </div>
                `;
            });
            html += `
                <div class="remaining-container">
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="splitRemaining">
                        <label class="form-check-label" for="splitRemaining">Split remaining balance equally among the rest</label>
                    </div>
                    <div id="remainingAmount" class="remaining">Remaining: ₹0.00</div>
                </div>
            `;
        } else if (splitType === "percentages") {
            html += '<div class="form-group"><label>Enter percentages for each person:</label>';
            chips.forEach(chip => {
                const name = chip.textContent.replace("×", "").trim();
                html += `
                    <div class="input-group mb-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text name-label">${name}</div>
                        </div>
                        <input type="number" class="form-control split-value" data-name="${name}" placeholder="Percentage for ${name}" oninput="updateRemainingPercentage()">
                    </div>
                `;
            });
            html += `<div id="remainingPercentage" class="remaining">Remaining: 100%</div>`;
        } else if (splitType === "shares") {
            html += '<div class="form-group"><label>Enter shares for each person:</label>';
            chips.forEach(chip => {
                const name = chip.textContent.replace("×", "").trim();
                html += `
                    <div class="input-group mb-2">
                        <div class="input-group-prepend">
                            <div class="input-group-text name-label">${name}</div>
                        </div>
                        <input type="number" class="form-control split-value" data-name="${name}" placeholder="Shares for ${name}">
                    </div>
                `;
            });
        }
        splitDetailsDiv.innerHTML = html;
        splitDetailsDiv.style.display = "block";
    } else {
        splitDetailsDiv.style.display = "none";
    }
}

/* Clear balances and settlement information */
function clearBalancesAndSettlement() {
    const balancesTableBody = document.getElementById("balancesTable").getElementsByTagName("tbody")[0];
    balancesTableBody.innerHTML = "";
    document.getElementById("settlementDetails").innerHTML = "";
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent the mini-infobar from appearing
    event.preventDefault();
    deferredPrompt = event;

    // Show the install button
    const installButton = document.getElementById('installButton');
    if (installButton) {
        installButton.style.display = 'block';

        installButton.addEventListener('click', () => {
            // Show the install prompt
            deferredPrompt.prompt();

            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                deferredPrompt = null;
            });
        });
    }
});

// Hide the install button if the app is already installed
window.addEventListener('appinstalled', () => {
    console.log('App installed');
    const installButton = document.getElementById('installButton');
    if (installButton) {
        installButton.style.display = 'none';
    }
});

function addExpense() {
    const description = document.getElementById('description').value.trim();
    const payer = document.getElementById('payer').value.trim();
    const amount = parseFloat(document.getElementById('amount').value.trim());
    const splitType = document.getElementById('splitType').value;

    if (!description || !payer || isNaN(amount) || amount <= 0) {
        alert("Please fill out all fields correctly.");
        return;
    }

    const expense = {
        description,
        payer,
        amount,
        splitType,
        splitDetails: calculateSplitDetails(splitType, amount)
    };

    expenses.push(expense);
    displayExpenses();
    updateBalances(expense);
}

function calculateSplitDetails(splitType, amount) {
    const participants = document.getElementById('chipInput').value.split(',').map(name => name.trim());
    const splitDetails = {};

    if (splitType === 'equal') {
        const share = amount / participants.length;
        participants.forEach(participant => {
            splitDetails[participant] = share;
        });
    }
    // Add logic for other split types (unequal, shares, percentages) here

    return splitDetails;
}

function displayExpenses() {
    const tableBody = document.getElementById('expensesTable').querySelector('tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    expenses.forEach((expense, index) => {
        const row = tableBody.insertRow();
        row.insertCell(0).innerHTML = `<button onclick="removeExpense(${index})">Remove</button>`;
        row.insertCell(1).textContent = expense.description;
        row.insertCell(2).textContent = expense.payer;
        row.insertCell(3).textContent = `₹${expense.amount.toFixed(2)}`;
        row.insertCell(4).textContent = JSON.stringify(expense.splitDetails);
    });
}

function updateBalances(expense) {
    const { payer, amount, splitDetails } = expense;

    // Deduct the amount from the payer's balance
    balances[payer] = (balances[payer] || 0) - amount;

    // Add the split amounts to each participant's balance
    for (const [participant, share] of Object.entries(splitDetails)) {
        balances[participant] = (balances[participant] || 0) + share;
    }

    displayBalances();
}

function displayBalances() {
    const tableBody = document.getElementById('balancesTable').querySelector('tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    for (const [name, balance] of Object.entries(balances)) {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = name;
        row.insertCell(1).textContent = `₹${balance.toFixed(2)}`;
    }
}
