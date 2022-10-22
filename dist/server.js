//1.导入http模块
const http = require('http')
const fs = require('fs')
//2.创建web服务器实例
const server = http.createServer()
//3.为服务器实例绑定request事件，监听客户端的请求
server.on('request', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    fs.readFile('./index.html', 'utf-8', function (err, data) {
        if (err) {
            throw err;
        }
        res.end(data);
    });
})
//4.启动服务器
server.listen(8000, () => {
    console.log('server running')
})
