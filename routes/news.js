const express = require("express");
const router = express.Router();

// Aquí meteremos luego las noticias dinámicas
router.get("/", (req, res) => {
  const fakeNews = [
    { title: "Título de prueba 1", source: "BBC", link: "#" },
    { title: "Título de prueba 2", source: "El País", link: "#" },
  ];

  res.render("index", { news: fakeNews });
});

module.exports = router;
