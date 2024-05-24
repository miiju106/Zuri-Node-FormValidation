const {createServer} = require("node:http")
const fs = require('fs');
const querystring = require('querystring');


// returns the array in the database.json file
const db= JSON.parse(fs.readFileSync("./db/database.json", "utf8"))


//Validation for name
function isValidName(name) {
    const nameRegex = /^[a-zA-Z\s]*$/;
    return nameRegex.test(name);
  }
  
  //Validation for phoneNumber(the phone number should not be more than 11)
  function isValidPhone(phoneNum) {
    const phoneNumRegex = /^\d{11}$/;
    return phoneNumRegex.test(phoneNum);
  }


  // Validation for email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


// handles the validation and submission of the group of inputs
  const handler = ((req, res)=>{

    // if(req.url === "/"){
    //     res.sendFile(path.join(__dirname, 'index.html'));
    // }




    if (req.url === '/') {
    // Read the HTML file
    fs.readFile('index.html', 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error reading HTML file');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else if(req.method === "POST" && req.url === "/submit"){
        let body = ""

        req.on('data', (chunk) => {
            body += chunk.toString();
          });

          req.on("end", ()=>{
            
            // this converts the body to an object
            const formData = querystring.parse(body)
            console.log(formData)
            console.log("body", typeof formData)
            console.log(db)

            const errors = [];

            let id = 1;
           
            // handles error for each input error 
            if(!formData.firstName || !isValidName(formData.firstName)){
             
                errors.push('Input your First name and it must not have a digit or number');
                
            }else
            if(!formData.lastName || !isValidName(formData.lastName )){
              
                errors.push('Input your Last name and it must not have a digit or number');
                
            }else

            if(!formData.email || !isValidEmail(formData.email)){
             
                errors.push('Enter a Vaild Email with @ and .com');
                
            }else

            if(!formData.number || !isValidPhone(formData.number) ){
             
                errors.push('Enter a phone number not more than 11');
                
            }else
            if(!formData.gender){
             
                errors.push('Pick a gender');
            }

            if(errors.length > 0){
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ errors, message:"Form failed" })); 
            }else{
                // includes a unique id for each group of inputs
                if(db.length > 0){
                    id = db[db.length-1].id + 1;
                  
                }
                const updateformdata = {...formData,  id: id}

                // puts each object i.e group of input in an array called db
                db.push(updateformdata)
                console.log("db",db)

        fs.writeFile("./db/database.json", JSON.stringify(db), "utf8", (err)=>{
            if(err) throw err;
        })
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({message:"Form Submitted Successfully", formInput:db}))

            }

            

          })
    }
})

// handles the server
const server = createServer(handler)

// listen to the server
server.listen(5000, ()=>{
    console.log("listening on localhost")
})