const express = require('express');
const compression = require('compression');
const app = express();
const fs = require('fs');

const PORT = 3000;

const db = getBdd();

const options = {
    etag: true,
    setHeaders: function (res, path, stat) {
        res.set({
            Expires: new Date(Date.now() + 2592000000).toUTCString(),
            'Cache-Control': path.includes('index.html') ? 'no-cache, max-age: 2592000' : 'public, max-age: 2592000',
        });
    },
};

app.use(compression());
app.use(express.static('public', options));

app.get('/*', function (req, res, next) {
    res.setHeader('Cache-Control', 'public, max-age=604800');
    res.setHeader('Expires', new Date(Date.now() + 604800000).toUTCString());
    next();
});

app.get('/family', function (req, res) {
    let id = req.query.id;
    if (id !== '') {
        console.log(id);
        res.send(JSON.stringify(db[id]));
    }
});

app.get('*', function (req, res) {
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});

function getBdd() {
    return JSON.parse(fs.readFileSync('bdd.json'));
}
