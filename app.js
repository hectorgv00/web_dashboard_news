const express = require("express");
const { fetchNews } = require("./scrapper");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const news = await fetchNews();
    res.render("index", { news });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error al obtener noticias");
  }
});

app.listen(3000, () => {
  console.log("✅ Servidor activo en http://localhost:3000");
});
