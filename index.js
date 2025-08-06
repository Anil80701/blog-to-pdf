const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/convert", async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).send("No URL provided");

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=blog.pdf",
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Conversion error:", err.message);
    res.status(500).send("Error converting blog to PDF.");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
