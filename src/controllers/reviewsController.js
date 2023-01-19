import Reviews from "../models/reviewModel";
import puppeteer from "puppeteer-extra";
import async from "async";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());

const placeUrl =
    "https://www.google.com/maps/place/Mango+IT+Solutions/@22.7276663,75.8866993,17z/data=!4m5!3m4!1s0x3962fd480d635977:0x72f82e2825baa4f3!8m2!3d22.727667!4d75.8888856";

export default class ReviewController {
    constructor() {
        //
    }

    async addReview(req, res) {
        getReviews().then(async (result) => {
            //   console.dir(result, { depth: null });
            if (result) {
                try {
                    for (let i = 0; i < result.length; i++) {
                        let review = {
                            user_name: result[i].user.name,
                            link: result[i].user.link,
                            thumbnail: result[i].user.thumbnail,
                            reviews: result[i].user.reviews,
                            rating: result[i].rating,
                            date: result[i].date,
                            comments: result[i].snippet,
                            likes: result[i].likes,
                        }
                        await Reviews.create(review)
                    }

                    res.status(200).json({
                        success: true,
                        message: "review Added Successfully",
                    });

                } catch (err) {
                    res.status(401).json({
                        success: false,
                        message: "review not Added Successfully",
                        error: err.message,
                    });
                }
            }
        });
    }

    async getreview(req, res) {
        try {
            await Reviews.findAll().then((response) => {
                res.status(200).json({
                    success: true,
                    data: response,
                });
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "An error occurred",
                error: error.message,
            });
        }
    }

    async reviewToDisplay(req, res) {
        try {
            const Update = await Reviews.update({ status: 0 }, { where: { status: 1 } });
            req.body.review_id.forEach(async function (arrayItem) {
                const rows = await Reviews.update({ status: 1 }, { where: { id: arrayItem } });
            });
            res.status(200).json({
                success: true,
                message: "review Updates Successfully",
            });
        } catch (err) {
            res.status(400).send({ message: err.message });
        }
    }

    async reviewById(req, res) {
        try {
            await Reviews.findAll({ where: { id: req.params.id } }).then((response) => {
                res.status(200).json({
                    success: true,
                    data: response,
                });
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "An error occurred",
                error: error.message,
            });
        }
    }

    async reviewByStatus(req, res) {
        await Reviews.findAll({ where: { status: 1 } })
            .then((response) => {
                res.status(200).json({
                    success: true,
                    data: response,
                });
            })
            .catch((err) => {
                res.status(400).send({ message: err.message });
            });
    }

}

async function scrollPage(page, scrollContainer) {
    let lastHeight = await page.evaluate(
        `document.querySelector("${scrollContainer}").scrollHeight`
    );
    while (true) {
        await page.evaluate(
            `document.querySelector("${scrollContainer}").scrollTo(0, document.querySelector("${scrollContainer}").scrollHeight)`
        );
        await page.waitForTimeout(1000);
        let newHeight = await page.evaluate(
            `document.querySelector("${scrollContainer}").scrollHeight`
        );

        if (newHeight === lastHeight) {
            break;
        }
        lastHeight = newHeight;
    }
}

async function getReviewsFromPage(page) {
    const reviews = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".jftiEf")).map((el) => {
            return {
                user: {
                    name: el.querySelector(".d4r55")?.textContent.trim(),
                    link: el.querySelector(".WNxzHc a")?.getAttribute("href"),
                    thumbnail: el.querySelector(".NBa7we")?.getAttribute("src"),
                    localGuide: el.querySelector(".RfnDt span:first-child")?.style.display === "none" ? undefined : true,
                    reviews: parseInt(el.querySelector(".RfnDt span:last-child")?.textContent.replace("·", "")),
                },
                rating: parseFloat(el.querySelector(".kvMYJc")?.getAttribute("aria-label")),
                date: el.querySelector(".rsqaWe")?.textContent.trim(),
                snippet: el.querySelector(".MyEned")?.textContent.trim(),
                likes: parseFloat(el.querySelector(".GBkF3d:nth-child(2)")?.getAttribute("aria-label")),
                images: Array.from(el.querySelectorAll(".KtCyie button")).length
                    ? Array.from(el.querySelectorAll(".KtCyie button")).map((el) => {
                        return {
                            thumbnail: getComputedStyle(el).backgroundImage.slice(5, -2),
                        };
                    })
                    : undefined,
                date: el.querySelector(".rsqaWe")?.textContent.trim(),
            };
        });
    });

    return reviews;
}

async function getReviews() {
    const browser = await puppeteer.launch({
        headless: false,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(6000);
    await page.goto(placeUrl);
    await page.waitForSelector(".DUwDvf");
    await page.click(".DkEaL");
    await scrollPage(page, " .dS8AEf");
    await page.waitForTimeout(3000);
    await page.waitForSelector(".jftiEf");
    const reviews = await getReviewsFromPage(page);
    await browser.close();
    return reviews;
}
