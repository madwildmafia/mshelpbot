import http from 'http';

const port = process.env.PORT || 3000;

http.createServer((_, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running!\n');
}).listen(port, () => {
    console.log(`🟢 Fake server is listening on port ${port}`);
});
