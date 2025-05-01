const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function fetchNews() {
  const configPath = path.join(__dirname, "config.json");
  let sources = [];

  try {
    const configData = fs.readFileSync(configPath, "utf8");
    sources = JSON.parse(configData);
  } catch (err) {
    console.error("Error al leer configuraciones:", err);
    return [];
  }

  if (sources.length === 0) {
    console.warn("No hay fuentes configuradas en config.json");
    return [];
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const news = [];

  for (let source of sources) {
    try {
      await page.goto(source.website, { waitUntil: "networkidle0" });

      const headlines = await page.evaluate((selector) => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements)
          .slice(0, 10)
          .map((el) => ({
            title: el.innerText.trim(),
            link: el.href || el.getAttribute("href") || "#",
          }));
      }, source.scrapingCode);

      headlines.forEach((headline) => {
        if (headline.title) {
          news.push({
            title: headline.title,
            link: headline.link.startsWith("http")
              ? headline.link
              : new URL(headline.link, source.website).href,
            source: source.name,
          });
        }
      });
    } catch (err) {
      console.error(`Error al scrapear ${source.name}:`, err);
      continue;
    }
  }

  await browser.close();
  return news;
}

exports.fetchNews = fetchNews;
