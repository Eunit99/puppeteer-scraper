import puppeteer from "puppeteer";

const getPosts = async () => {
    // Start a Puppeteer session with:
    // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
    // - no default viewport (`defaultViewport: null` - website page will be in full width and height)
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null
    });

    // Open a new page
    const page = await browser.newPage();

    async function scrapeCurrentPage() {
        try {
            // On this new page:
            // - Open the "https://www.lequipe.fr/Chrono" website
            // - Wait until the DOM content is loaded (HTML is ready)
            await page.goto("https://www.lequipe.fr/Chrono", {
                waitUntil: "domcontentloaded"
            });

            // Set screen size
            // await page.setViewport({width: 1080, height: 1024});

            // Wait for some time (optional, for demonstration)
            await page.waitForSelector('.Cmp__action.Cmp__action--yes');

            // Click the "oui, j'accept" button using a CSS selector to accept cookies
            await page.click(".Cmp__action.Cmp__action--yes.button");

            // Click the "ignorer" button using a CSS selector to ignore registration
            await page.click(".OfferBanner__ignoreBtn.OfferBanner__ignoreBtn--desktop");

            // Wait for article cards to load (adjust selector if needed)
            await page.waitForSelector('.ChronoItem');


            const scrapedPosts = []

            const articleCards = await page.$$('ChronoItem');


            for (let i = 0; i < articleCards.length; i++) {
                const link = await articleCards[i].$eval('a.Link.ChronoItem__link"', el => el.href);
                const summary = await articleCards[i].$eval('.ChronoItem__summary', el => el.innerText);
                const tags = await articleCards[i].$eval('.ArticleTags__item', el => el.innerText);

                const time = await articleCards[i].$eval('.ChronoItem__time', el => el.innerText);

                scrapedPosts.push({
                    link,
                    time,
                    summary,
                    tags
                });
            }


            // Add scraped posts from this page
            console.log("Scraped posts from current page:", scrapedPosts);


        } catch (error) {
            console.error("Error scraping data:", error);
        }
    }

    // Start scraping process
    await scrapeCurrentPage();

    // Close the browser
    await browser.close();
};

// Start the scraping
getPosts();