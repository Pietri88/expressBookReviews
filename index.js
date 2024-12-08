const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Sprawdzenie, czy nagłówek autoryzacji istnieje
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: "Brak tokenu uwierzytelnienia" });
    }

    // Usunięcie prefiksu "Bearer " z tokenu
    const accessToken = token.split(" ")[1];

    try {
        // Weryfikacja tokenu
        const decoded = jwt.verify(accessToken, "fingerprint_customer");

        // Przechowanie danych użytkownika w żądaniu
        req.user = decoded;
        next(); // Kontynuacja do następnej funkcji
    } catch (err) {
        // Obsługa błędu, jeśli token jest nieprawidłowy lub wygasł
        return res.status(401).json({ message: "Nieprawidłowy token" });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
