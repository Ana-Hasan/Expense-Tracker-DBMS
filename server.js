const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "10CGPA@2006",
    database: "expense_system_new"
})

db.connect(err => {
    if (err) throw err
    console.log("DB connected")
})

app.listen(3000, () => {
    console.log("Server running on port 3000")
})


// 🔥 ADD EXPENSE (SMART CATEGORY)
app.post("/add-expense", (req, res) => {
    const { user_id, category, amount, date, description } = req.body

    const checkQuery = "SELECT category_id FROM CATEGORY WHERE category_name = ?"

    db.query(checkQuery, [category], (err, result) => {
        if (err) return res.status(500).send(err)

        if (result.length > 0) {
            insertExpense(result[0].category_id)
        } else {
            const insertCat = "INSERT INTO CATEGORY (category_name) VALUES (?)"

            db.query(insertCat, [category], (err, result2) => {
                if (err) return res.status(500).send(err)
                insertExpense(result2.insertId)
            })
        }
    })

    function insertExpense(category_id) {
        const sql = `
            INSERT INTO EXPENSE (user_id, category_id, amount, date, description)
            VALUES (?, ?, ?, ?, ?)
        `

        db.query(sql, [user_id, category_id, amount, date, description], (err) => {
            if (err) return res.status(500).send(err)
            res.send("Expense added")
        })
    }
})


// 🔥 GET EXPENSES (FIXED JOIN)
app.get("/expenses", (req, res) => {
    const sql = `
        SELECT e.amount, e.date, e.description, c.category_name
        FROM EXPENSE e
        JOIN CATEGORY c ON e.category_id = c.category_id
        ORDER BY e.expense_id DESC
    `

    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err)
        res.json(result)
    })
})


// 🔥 SET BUDGET (SMART CATEGORY)
app.post("/set-budget", (req, res) => {
    const { user_id, category, monthly_limit } = req.body

    const checkQuery = "SELECT category_id FROM CATEGORY WHERE category_name = ?"

    db.query(checkQuery, [category], (err, result) => {
        if (err) return res.status(500).send(err)

        if (result.length > 0) {
            insertBudget(result[0].category_id)
        } else {
            const insertCat = "INSERT INTO CATEGORY (category_name) VALUES (?)"

            db.query(insertCat, [category], (err, result2) => {
                if (err) return res.status(500).send(err)
                insertBudget(result2.insertId)
            })
        }
    })

    function insertBudget(category_id) {
        const sql = `
            INSERT INTO BUDGET (user_id, category_id, monthly_limit)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE monthly_limit = ?
        `

        db.query(sql, [user_id, category_id, monthly_limit, monthly_limit], (err) => {
            if (err) return res.status(500).send(err)
            res.send("Budget set")
        })
    }
})


// 🔥 BUDGET STATUS
app.get("/budget", (req, res) => {
    db.query("SELECT * FROM budget_vs_spending", (err, result) => {
        if (err) return res.status(500).send(err)
        res.json(result)
    })
})

app.delete("/delete-expense/:id", (req, res) => {
    const id = req.params.id

    const sql = "DELETE FROM EXPENSE WHERE expense_id = ?"

    db.query(sql, [id], (err) => {
        if (err) return res.status(500).send(err)
        res.send("Deleted successfully")
    })
})