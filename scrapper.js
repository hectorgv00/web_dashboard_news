const puppeteer = require("puppeteer");

async function fetchNews() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const sources = [
    {
      name: "El País",
      url: "https://elpais.com/",
      selector: ".c_t a", // Selector de El País
    },
    {
      name: "BBC News",
      url: "https://www.bbc.com/news",
      selector: '[data-testid="card-headline"]', // Selector de BBC
    },
    {
      name: "CNN",
      url: "https://edition.cnn.com/world",
      selector: ".container__headline-text", // Selector de CNN
    },
  ];

  const news = [];

  for (let source of sources) {
    await page.goto(source.url, { waitUntil: "networkidle0" }); // Espera hasta que la red esté inactiva

    const headlines = await page.evaluate((selector) => {
      const elements = document.querySelectorAll(selector);
      return Array.from(elements)
        .slice(0, 10)
        .map((el) => ({
          title: el.innerText.trim(),
          link: el.href,
        }));
    }, source.selector);

    headlines.forEach((headline) => {
      news.push({
        title: headline.title,
        link: headline.link,
        source: source.name,
      });
    });
  }

  await browser.close();

  return news;
}

fetchNews().then((news) => {
  console.log(news);
});

exports.fetchNews = fetchNews;
