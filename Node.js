const https = require("https");
const http = require("http");
async  function  timedata() {
  return new Promise((resolve,reject) => {
    var timesData = "";
    https.get("https://time.com", (res) => {
        res.on("data", (data1) => {
         timesData += data1;
        });
        res.on("end", () => {
          let htmlData = timesData;
          let divposition = htmlData.indexOf(`partial latest-stories`);
          let position =
            htmlData.indexOf(`latest-stories__item-headline`, divposition) - 2;
          let linkposition = htmlData.indexOf(`<a href=`, divposition) - 2;
      
      let allnewsarray = []
      for (let i = 0; i <=5; i++) {
        let newsobject = {}
        position = htmlData.indexOf(
          `latest-stories__item-headline`,
          position + 1
        );

        linkposition = htmlData.indexOf(`<a href=`, linkposition + 1);
        //console.log(position);
        let pointer = position + 31;
        let newlinkpointer = linkposition + 9;
        let newstory = "";
        let newlink = "https://time.com";

        while (true) {
          //console.log(pointer);
          newstory += htmlData[pointer];
          pointer++;
          if (pointer > position + 300) {
            break;
          }
          if (htmlData[pointer] === "<" && htmlData[pointer + 1] === "/") {
            break;
          }
        }
        while (true) {
          newlink += htmlData[newlinkpointer];

          newlinkpointer += 1;
          if (newlinkpointer > linkposition + 200) {
            break;
          }
          if (
            htmlData[newlinkpointer] === `/` &&
            htmlData[newlinkpointer + 1] === '"'
          ) {
            break;
          }
        }
        console.log(newstory);
        newsobject.title = newstory
        newsobject.link = newlink
        console.log(newlink);
        allnewsarray.push(newsobject)
      }
       resolve(allnewsarray)
        });
      })
      .on("error", (e) => {
        console.error(e);
      });
  })
    
}
http.createServer(async function (req, res) {
      if (req.url === "/getTimeStories") {
        (async function(){
      try{
        let News = await timedata()
        console.log(News)
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(News));
        res.end()
        }
      catch(e){
        res.writeHead(500, { "Content-Type": "text/html" });
        res.write(`<h1>Internal error</h1>`);
        res.end()
      }
        
    })()
  }
    else{
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(`<h3>Please type http://localhost:3000/getTimeStories</h3>`)
      res.end()
    } 
  })
  .listen(3000, () => {
    console.log("server started on 3000");
  });