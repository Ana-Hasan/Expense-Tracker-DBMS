const API = "http://localhost:3000"

function addExpense() {
    fetch(`${API}/add-expense`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: 1,
            category: document.getElementById("category").value,
            amount: parseFloat(document.getElementById("amount").value),
            date: new Date().toISOString().split('T')[0],
            description: document.getElementById("desc").value
        })
    })
    .then(res => res.text())
    .then(() => loadAll())
}

function setBudget() {
    fetch(`${API}/set-budget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: 1,
            category: document.getElementById("budgetCategory").value,
            monthly_limit: document.getElementById("budgetAmount").value
        })
    })
    .then(res => res.text())
    .then(() => loadBudget())
}

function loadExpenses() {
    fetch(`${API}/expenses`)
    .then(res => res.json())
    .then(data => {
        const table = document.querySelector("#expenseTable tbody")
        table.innerHTML = ""

        data.forEach(e => {
            table.innerHTML += `
                <tr>
                    <td>${e.category_name}</td>
                    <td>${e.amount}</td>
                    <td>${e.date}</td>
                    <td>${e.description}</td>
                </tr>
            `
        })
    })
}

function loadBudget() {
    fetch(`${API}/budget`)
    .then(res => res.json())
    .then(data => {
        const table = document.querySelector("#budgetTable tbody")
        table.innerHTML = ""

        data.forEach(b => {
            const percent = (b.spent / b.monthly_limit) * 100

            table.innerHTML += `
                <tr>
                    <td>${b.category_name}</td>
                    <td>${b.monthly_limit}</td>
                    <td>${b.spent}</td>
                    <td>
                        ${b.remaining}
                        <div class="progress-bar">
                            <div class="progress-fill" style="width:${percent}%"></div>
                        </div>
                    </td>
                </tr>
            `
        })
    })
}

function loadAll() {
    loadExpenses()
    loadBudget()
}

window.onload = loadAll