import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// untuk __dirname di ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// static folder (untuk checkout.html dan return.html)
app.use(express.static(path.join(__dirname, "public")));

const MERCHANT_CODE = process.env.MERCHANT_CODE || "DS25648";
const MERCHANT_KEY = process.env.MERCHANT_KEY || "YOUR_MERCHANT_KEY";
const USE_PRODUCTION = process.env.USE_PRODUCTION === "true";

const CREATE_INVOICE_URL = USE_PRODUCTION
  ? "https://api-prod.duitku.com/webapi/api/merchant/createInvoice"
  : "https://sandbox.duitku.com/webapi/api/merchant/createInvoice";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "checkout.html"));
});

app.post("/api/create-transaction", async (req, res) => {
  try {
    const { orderId, amount, customerName, email } = req.body;
    const amountNumber = String(amount);

    // generate signature
    const signature = crypto
      .createHash("md5")
      .update(MERCHANT_CODE + orderId + amountNumber + MERCHANT_KEY)
      .digest("hex");

    // payload sesuai API Duitku
    const payload = {
      merchantCode: MERCHANT_CODE,
      paymentAmount: Number(amountNumber),
      merchantOrderId: orderId,
      productDetails: "Pembelian di Pratama Store",
      email,
      customerVaName: customerName,
      callbackUrl: `${process.env.BASE_URL}/return`,
      returnUrl: `${process.env.BASE_URL}/return.html`,
      signature,
    };

    const response = await axios.post(CREATE_INVOICE_URL, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 15000
    });

    return res.json(response.data);
  } catch (err) {
    console.error("Create transaction error:", err?.response?.data || err.message || err);
    return res.status(500).json({
      message: "Gagal membuat transaksi",
      error: err?.response?.data || err?.message
    });
  }
});

// callback Duitku (status pembayaran)
app.post("/return", (req, res) => {
  console.log("Callback diterima:", req.body);
  // Verifikasi signature di sini (disarankan di production)
  res.status(200).send("Callback diterima");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server berjalan di port ${PORT}`));
