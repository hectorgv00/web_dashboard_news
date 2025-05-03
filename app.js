// Importing required modules
const express = require("express"); // Express framework for building the web server
const { fetchNews } = require("./scrapper"); // Importing the fetchNews function from scrapper.js
const app = express(); // Initializing the Express app
const fs = require("fs"); // File system module to read/write files
const path = require("path"); // Path module to handle file paths

// Path to the configuration file
const configFilePath = path.join(__dirname, "config.json");

// Setting up the view engine to use EJS templates
app.set("view engine", "ejs");

// Serving static files from the "public" directory
app.use(express.static("public"));

// Route to fetch and display news on the homepage
app.get("/", async (req, res) => {
  try {
    const news = await fetchNews(); // Fetch news using the fetchNews function
    res.render("index", { news }); // Render the "index" view with the fetched news
  } catch (err) {
    console.error(err); // Log any errors
    res.status(500).send("Error al obtener noticias"); // Send a 500 error response
  }
});

// Route to display the configuration page
app.get("/config", (req, res) => {
  fs.readFile(configFilePath, "utf8", (err, data) => {
    let configs = [];
    if (!err && data) {
      try {
        configs = JSON.parse(data); // Parse the configuration file
      } catch (parseErr) {
        console.error("Error parsing config file:", parseErr); // Log parsing errors
      }
    } else if (err) {
      console.error("Error reading config file:", err); // Log file reading errors
    }
    res.render("config", { configs }); // Render the "config" view with the configurations
  });
});

// Route to add a new configuration
app.post("/config", express.urlencoded({ extended: true }), (req, res) => {
  const { website, scrapingCode, name } = req.body; // Extract data from the request body
  const newConfig = { website, scrapingCode, name }; // Create a new configuration object

  fs.readFile(configFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo de configuración:", err); // Log file reading errors
      return res.status(500).send("Error al guardar configuración"); // Send a 500 error response
    }
    const configs = JSON.parse(data || "[]"); // Parse existing configurations or initialize an empty array
    configs.push(newConfig); // Add the new configuration

    fs.writeFile(configFilePath, JSON.stringify(configs, null, 2), (err) => {
      if (err) {
        console.error("Error al guardar configuración:", err); // Log file writing errors
        return res.status(500).send("Error al guardar configuración"); // Send a 500 error response
      }
      res.redirect("/config"); // Redirect to the configuration page
    });
  });
});

// Route to delete a configuration by its index
app.post("/config/delete/:index", (req, res) => {
  const index = parseInt(req.params.index, 10); // Get the index from the route parameter

  fs.readFile(configFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo de configuración:", err); // Log file reading errors
      return res.status(500).send("Error al eliminar configuración"); // Send a 500 error response
    }
    const configs = JSON.parse(data || "[]"); // Parse existing configurations or initialize an empty array
    configs.splice(index, 1); // Remove the configuration at the specified index

    fs.writeFile(configFilePath, JSON.stringify(configs, null, 2), (err) => {
      if (err) {
        console.error("Error al guardar configuración:", err); // Log file writing errors
        return res.status(500).send("Error al eliminar configuración"); // Send a 500 error response
      }
      res.redirect("/config"); // Redirect to the configuration page
    });
  });
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("✅ Servidor activo en http://localhost:3000"); // Log that the server is running
});
