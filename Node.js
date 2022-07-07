const https = require("https");
const http = require("http");
function timedata() {
  return new Promise((resolve,reject) => {
    var timesData = "";
    https.get("https://time.com", (res) => {
        res.on("data", (data1) => {
         timesData += data1;
        });
        res.on("end", () => {
          const htmlData = timesData.split(
            `<h2 class="latest-stories__heading">Latest Stories</h2>`
          ); 
          const content = htmlData[1].toString().split("</ul>");
          const contentData = content[0] 
          const removedData = contentData.toString().split(`<h3 class="latest-stories__item-headline">`);
          const dataH3 = removedData.toString().split(`</h3>`);
          const removedAnchor = contentData.toString().split(`/">`);
          const Array = [];
          for (var i = 0; i < dataH3.length -1; i++) {
            const object = {};
            const oneNews = dataH3[i].toString().split(`/">`);
            const link = removedAnchor[i].toString().split(`<a href="/`);
            const timesLink = "https://time.com/" 
            const oneLink = timesLink + link[1];
            const timeNews = oneNews[1].toString().trim();
            object.Title = timeNews.slice(1);
            object.Link = oneLink;
            Array.push(object);
          }
        resolve(Array)
        });
      })
      .on("error", (e) => {
        console.error(e);
      });
  })
    
}
http.createServer(async function (req, res) {
      if (req.url === "/getTimeStories") {
      timedata().then((News)=>{
        console.log(News)
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(News));
        res.end()
      }).catch((e)=>{
        console.log(e)
      }).finally(()=>{
        console.log("data send successfully")
      })
    }
    else{
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(`<h1>Please type http://localhost:3000/getTimeStories</h1>`)
      res.end()
    } 
  })
  .listen(3000, () => {
    console.log("server started on 3000");
  });