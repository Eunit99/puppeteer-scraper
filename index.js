import puppeteer from "puppeteer";

(async () => {
  // Launch a headless browser (change to headless: false for debugging)
  const browser = await puppeteer.launch({ headless: false });

  // Open a new page
  const page = await browser.newPage();

  // Navigate to the L'Équipe.fr page
  await page.goto('https://www.lequipe.fr/Chrono');

  // Pause for `.ChronoItem`
  await page.waitForSelector('.ChronoItem');

  // Wait for at least 5 article cards to be loaded
  await page.waitForFunction(() => {
    const articleCards = document.querySelectorAll(".ChronoItem");
    return articleCards.length > 5;
  });

  // Get page data
  const scrapedPosts = await page.evaluate(() => {
    const articleCards = document.querySelectorAll('.ChronoItem');

    return Array.from(articleCards).map((card) => {
      const link = card.querySelector(".Link.ChronoItem__link")?.href || null;
      const time = card.querySelector(".ChronoItem__time").innerText?.trim() || null;
      const summary = card.querySelector(".ChronoItem__summary").innerText?.trim() || null;
      const tags = card.querySelectorAll(".ArticleTags__item").innerText?.trim()?.split(",") || null;

      return { link, time, summary, tags };
    });
  });

  // Display scraped posts
  console.log("Scraped posts from current page:", scrapedPosts);

  // Close the browser
  await browser.close();
})();
