const fs = require('fs');
const process = require('process');
const axios = require('axios');

function cat(path, out){
    fs.readFile(path, 'utf8', (err, data) => {
        if(err){
            console.log(`Error in reading ${path}: ${err}`);
            process.kill(1);
        } else if (out){
            fs.writeFile(out, data, 'utf8', function(err) {
                if(err) {
                    console.log(`Error writing ${out}: ${err}`);
                    process.kill(1);
                }
            })
        } else {
            console.log(data);
        }
    })
}

async function webCat(url, out){
   try{
    let res = await axios.get(url);
    if (out){
        fs.writeFile(out, res.data, 'utf8', function(err) {
            if(err) {
                console.log(`Error writing ${out}: ${err}`);
                process.kill(1);
            }
        })
    } else {
        console.log(res.data);
    }
   } catch (err) {
    console.log(`Error fetching ${url}: ${err}`);
    process.exit(1);
   }
}

let path;
let out;

if (process.argv[2] === '--out'){
    path = process.argv[4];
    out = process.argv[3];
} else {
    path = process.argv[2];
}

if (path.slice(0, 4) === 'http'){
    webCat(path,out);
} else {
    cat(path, out);
}