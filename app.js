const express = require("express");
const { fetchNews } = require("./scrapper");
const app = express();
const fs = require("fs");
const path = require("path");

const configFilePath = path.join(__dirname, "config.json");

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

app.get("/config", (req, res) => {
  fs.readFile(configFilePath, "utf8", (err, data) => {
    let configs = [];
    if (!err && data) {
      try {
        configs = JSON.parse(data);
      } catch (parseErr) {
        console.error("Error parsing config file:", parseErr);
      }
    } else if (err) {
      console.error("Error reading config file:", err);
    }
    res.render("config", { configs });
  });
});

app.post("/config", express.urlencoded({ extended: true }), (req, res) => {
  const { website, scrapingCode, name } = req.body;
  const newConfig = { website, scrapingCode, name };

  fs.readFile(configFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo de configuración:", err);
      return res.status(500).send("Error al guardar configuración");
    }
    const configs = JSON.parse(data || "[]");
    configs.push(newConfig);

    fs.writeFile(configFilePath, JSON.stringify(configs, null, 2), (err) => {
      if (err) {
        console.error("Error al guardar configuración:", err);
        return res.status(500).send("Error al guardar configuración");
      }
      res.redirect("/config");
    });
  });
});

app.post("/config/delete/:index", (req, res) => {
  const index = parseInt(req.params.index, 10);

  fs.readFile(configFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo de configuración:", err);
      return res.status(500).send("Error al eliminar configuración");
    }
    const configs = JSON.parse(data || "[]");
    configs.splice(index, 1);

    fs.writeFile(configFilePath, JSON.stringify(configs, null, 2), (err) => {
      if (err) {
        console.error("Error al guardar configuración:", err);
        return res.status(500).send("Error al eliminar configuración");
      }
      res.redirect("/config");
    });
  });
});

app.listen(3000, () => {
  console.log("✅ Servidor activo en http://localhost:3000");
});
