import DBConnection from "/core/db"
import puppeteer from "puppeteer-extra";
import async from "async";
import StealthPlugin from "puppeteer-extra-plugin-stealth"


let db = new DBConnection().conn.promise();

puppeteer.use(StealthPlugin());

const placeUrl =
  "https://www.google.com/maps/place/Mango+IT+Solutions/@22.7276663,75.8866993,17z/data=!4m5!3m4!1s0x3962fd480d635977:0x72f82e2825baa4f3!8m2!3d22.727667!4d75.8888856";

async function scrollPage(page, scrollContainer) {
  let lastHeight = await page.evaluate(
    `document.querySelector("${scrollContainer}").scrollHeight`
  );
  console.log(lastHeight);
  while (true) {
    await page.evaluate(
      `document.querySelector("${scrollContainer}").scrollTo(0, document.querySelector("${scrollContainer}").scrollHeight)`
    );
    await page.waitForTimeout(1000);
    let newHeight = await page.evaluate(
      `document.querySelector("${scrollContainer}").scrollHeight`
    );

    console.log("newHeight", newHeight);
    console.log("lastHeight", lastHeight);

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
          localGuide:
            el.querySelector(".RfnDt span:first-child")?.style.display ===
            "none"
              ? undefined
              : true,
          reviews: parseInt(
            el
              .querySelector(".RfnDt span:last-child")
              ?.textContent.replace("·", "")
          ),
        },
        rating: parseFloat(
          el.querySelector(".kvMYJc")?.getAttribute("aria-label")
        ),
        date: el.querySelector(".rsqaWe")?.textContent.trim(),
        snippet: el.querySelector(".MyEned")?.textContent.trim(),
        likes: parseFloat(
          el.querySelector(".GBkF3d:nth-child(2)")?.getAttribute("aria-label")
        ),
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
  page.setDefaultNavigationTimeout(6000);
  await page.goto(placeUrl);
  await page.waitForSelector(".DUwDvf");
  await page.click(".DkEaL");
  await scrollPage(page, " .dS8AEf");
  await page.waitForTimeout(3000);
  await page.waitForSelector(".jftiEf");
  const reviews = await getReviewsFromPage(page);
  await browser.close();

  if (reviews) {
    await insertReviews(reviews);
      
  }
  console.log(reviews);
    return { reviews };
}

async function insertReviews(reviews, callback) {
  //   console.log('in',reviews);

  async.each(reviews,function (review,callback) {
      let sqlQuery = "INSERT INTO `reviews`(`user_name`,`link`,`thumbnail`,`reviews`,`rating`,`date`,`comments`,`likes`)VALUES(?,?,?,?,?,?,?,?)";
      let value = [
        review.user.name,
        review.user.link,
        review.user.thumbnail,
        review.user.reviews,
        review.rating,
        review.date,
        review.snippet,
        review.likes,
      ];
      db.query(sqlQuery, value, function (error, result, field) {
        if (error) {
          callback(null, error);
          }
          // if(result){
          //   callback();
          // }
      });
    },
    function (err) {
      if (err) {
        // One of the iterations above produced an error.
        // All processing will stop and we have to rollback.
        return callback(err);
      }

      // Return without errors
      return callback();
    }
  );
}

getReviews().then((result) => 
console.dir(result, { depth: null }));
// module.exports = {getReviews}