// Importing required modules
const puppeteer = require("puppeteer"); // Puppeteer for web scraping
const fs = require("fs"); // File system module to read/write files
const path = require("path"); // Path module to handle file paths

// Main function to fetch news from configured sources
async function fetchNews() {
  // Define the path to the configuration file
  const configPath = path.join(__dirname, "config.json");
  let sources = []; // Array to store the sources from the configuration file

  try {
    // Read and parse the configuration file
    const configData = fs.readFileSync(configPath, "utf8");
    sources = JSON.parse(configData);
  } catch (err) {
    // Log an error if the configuration file cannot be read
    console.error("Error al leer configuraciones:", err);
    return []; // Return an empty array if there's an error
  }

  // Check if there are no sources configured
  if (sources.length === 0) {
    console.warn("No hay fuentes configuradas en config.json");
    return []; // Return an empty array if no sources are found
  }

  // Launch a new browser instance using Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage(); // Open a new browser tab
  const news = []; // Array to store the scraped news

  // Iterate over each source in the configuration
  for (let source of sources) {
    try {
      // Navigate to the source's website
      await page.goto(source.website, { waitUntil: "networkidle0" });

      // Scrape headlines using the provided selector (scrapingCode)
      const headlines = await page.evaluate((selector) => {
        const elements = document.querySelectorAll(selector); // Select elements based on the selector
        return Array.from(elements)
          .slice(0, 10) // Limit to the first 10 headlines
          .map((el) => ({
            title: el.innerText.trim(), // Extract and trim the text content
            link: el.href || el.getAttribute("href") || "#", // Extract the link
          }));
      }, source.scrapingCode);

      // Process each headline and add it to the news array
      headlines.forEach((headline) => {
        if (headline.title) {
          news.push({
            title: headline.title,
            link: headline.link.startsWith("http") // Ensure the link is absolute
              ? headline.link
              : new URL(headline.link, source.website).href, // Resolve relative links
            source: source.name, // Add the source name
          });
        }
      });
    } catch (err) {
      // Log an error if scraping fails for a source
      console.error(`Error al scrapear ${source.name}:`, err);
      continue; // Continue with the next source
    }
  }

  // Close the browser after scraping is complete
  await browser.close();
  return news; // Return the array of scraped news
}

// Export the fetchNews function for use in other modules
exports.fetchNews = fetchNews;
