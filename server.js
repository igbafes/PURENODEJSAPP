const http = require('http');
const port = process.env.PORT || 8080;
 const fs = require('fs');
require('dotenv').config();
const path = require('path');
const DB_PATH = path.join(__dirname, 'database.json');

const server = http.createServer((req, res) => {
 //READ
//    console.log(req.method);
   
    if (req.method === 'GET') {
        fs.readFile('./database.json', 'utf-8', (err, data) => {
            if (err){
                console.log(err);
            }
            console.log(data);

            res.end(data);
            
        });
    }

     //POST/CREATE

    if (req.method === 'POST') {
         let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });

         req.on('end', () => {

            fs.appendFile('./database.json', data, (err, data) =>{
                if(err) {
                    console.log(err);
                }

                res.end('error in writing file');
                return;
         });
        
          res.end(`data posted successfully`);  
        })
           
     
    }

   //PUT-UPDATE

    if (req.method === "PUT") {
     
        let dataTwo = '';
        req.on('data', (chunk) => {
            dataTwo += chunk;
        });

        req.on('end', () => {
            fs.readFile('./database.json', 'utf-8', (err, data) => {
                if (err) {
                    throw err;
                }

                const newValue = data.replace(/Country/g, dataTwo);

                fs.writeFile('./database.json', newValue, 'utf-8', (err, data) => {
                    if (err) throw err;
                })

                res.end('File updated successfully');
            })
        })

    }

  //DELETE

  if (req.method === "DELETE" && req.url.startsWith("/user/")) {

    const userId = req.url.split("/")[2]; // Extract the ID from the URL

    fs.readFile("./database.json", "utf-8", (err, data) => {

      if (err) {

        console.log(err);

        res.end("Error reading database file");

        return;

      }




      const newData = JSON.parse(data);

     

      for (data in newData) {

        if (data === userId) {

            newData.splice(data, 1)

        }

      }

      const newEst = JSON.stringify(newData);

      fs.writeFile("./database.json", newEst, "utf-8", (err) => {

        if (err) {

          console.log(err);

          res.end("Error writing to database file");

          return;

        }


        res.end("Record deleted successfully");

       

      });
      

    });

  }

})


 server.listen(port, () => {
    console.log(`server running on https://localhost: ${port}`);
});