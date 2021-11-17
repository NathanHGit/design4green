const express = require('express');
const compression = require('compression');
const app = express();
const PORT = 3000;

const db = getBdd();

const options = {
    etag: true,
    setHeaders: function (res, path, stat) {
        res.set({
            'Expires': new Date(Date.now() + 2592000000).toUTCString(),
            'Cache-Control': path.includes('index.html') ? 'no-cache, max-age: 2592000' : 'public, max-age: 2592000'
        });
    }
}

app.use(compression());
app.use(express.static('public', options));

app.get('/*', function (req, res, next) {
    res.setHeader('Cache-Control', 'public, max-age=604800');
    res.setHeader('Expires', new Date(Date.now() + 604800000).toUTCString());
    next();
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});