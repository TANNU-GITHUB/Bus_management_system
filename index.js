import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import pg from "pg";

const app = express();
const port = 3000;

// Configure database connection
const dbConfig = {
  user: "postgres",
  host: "localhost",
  database: "Bus_management",
  password: "",
  port: 5432,
};
const db = new pg.Client(dbConfig);

// Connect to the database and handle connection errors
db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err.stack);
  } else {
    console.log("Connected to the database.");
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");  

// Routes
app.get("/", (req, res) => {
  res.render("home");  // Assuming "home.ejs" is in the views folder
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, email, password, contact } = req.body;

  try {
    const result = await db.query(
      "INSERT INTO users (username, email, password, contact_info) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, password, contact]
    );
    console.log("User registered:", result.rows[0]);
    res.render("secrets",{user :  result.rows[0].username});  // Render secrets page after successful registration
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).send("An error occurred while registering the user.");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );
    if (result.rows.length > 0) {
      console.log("User logged in:", result.rows[0]);
      res.render("secrets",{user :  result.rows[0].username});  // Render secrets page on successful login
    } else {
      console.log("Login failed: Invalid credentials");
      res.render("login", { error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("An error occurred during login.");
  }
});

// Bus Schedule Route
app.get("/bus-schedule", (req, res) => {
  res.render("bus-schedule");
});

// Notification
app.get("/notification", (req, res) => {
  res.render("notification");
});

// Attendance 
app.get("/attendance", (req, res) => {
  res.render("attendance");
});

// Reservation 
app.get("/reservation", (req, res) => {
  res.render("reservation");
});


// Issue Reporting
app.get("/issue-reporting", (req, res) => {
  res.render("issue-reporting");
});

// Notification
app.get("/notification", (req, res) => {
  res.render("notification");
});

// Contact
app.get("/contact-driver", (req, res) => {
  res.render("contact-driver");
});

// Logout
app.get("/logout", (req, res) => {
  res.render("logout");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
