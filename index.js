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
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data,null,2));
}

const server = http.createServer((req,resp)=>{
    resp.setHeader('Content-Type','application/json');

    if(req.method=='GET' && req.url=='/data'){
        const data = readData();
        resp.writeHead(200);
        resp.end(JSON.stringify(data));
    }else if(req.method=='POST' && req.url=='/data'){
        let body="";
        req.on("data", chunck=> body +=chunck);
        req.on("end", ()=>{
            const newItem=JSON.parse(body);
            writeData(newItem);
        })
        resp.end('Data Saved');
    }else if (req.method == 'DELETE' && req.url.startsWith('/data/')) {
        const id = parseInt(req.url.split('/')[2]);  // e.g. /data/0
        const data = readData();
        if (id >= 0 && id < data.length) {
            data.splice(id, 1);          // removes item at that index
            writeData(data);
            resp.writeHead(200);
            resp.end(JSON.stringify({ message: 'Data Deleted' }));
        } else {
            resp.writeHead(404);
            resp.end(JSON.stringify({ message: 'Item not found' }));
        }
    } else if (req.method == 'PUT' && req.url.startsWith('/data/')) {
        const id = parseInt(req.url.split('/')[2]);  // e.g. /data/0
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            const data = readData();
            if (id >= 0 && id < data.length) {
                data[id] = JSON.parse(body);  // replaces item at that index
                writeData(data);
                resp.writeHead(200);
                resp.end(JSON.stringify({ message: 'Data Updated' }));
            } else {
                resp.writeHead(404);
                resp.end(JSON.stringify({ message: 'Item not found' }));
            }
        });
    }
})

server.listen(8080,()=>{
    console.log('Server running on port 8080')
});
