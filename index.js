const http =require('http');
const fs =require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');
function readData() {
    try{
        const jsonData = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(jsonData || '[]');
    }catch(e){
        return [];
    }
}
function writeData() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data,null,2));
}

const server = http.createServer((req,resp)=>{
    resp.setHeader('Content-Type','application/json');

    if(req.method=='GET'){
        resp.end('GET');
    }else if(req.method=='POST'){
        resp.end('POST');
    }else if(req.method=='DELETE'){
        resp.end('DELETE');
    }else if(req.method=='PUT'){
        resp.end('PUTT');
    }
})

server.listen(8080,()=>{
    console.log('Server running on port 8080')
});
