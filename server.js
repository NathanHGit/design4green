const express = require('express');
const compression = require('compression');
const pdf = require('pdf-creator-node');
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
app.use(express.json());
app.use(express.static('public', options));

app.get('/*', function (req, res, next) {
    res.setHeader('Cache-Control', 'public, max-age=604800');
    res.setHeader('Expires', new Date(Date.now() + 604800000).toUTCString());
    next();
});

app.get('/family', function (req, res) {
    let id = req.query.id;
    if (id !== '') {
        res.send(JSON.stringify(db[id]));
    }
});

app.post('/pdf', function (req, res) {
    let html = fs.readFileSync('./template.html', 'utf8');

    let options = {
        format: 'A4',
        orientation: 'portrait',
        border: '10mm',
    };

    let document = {
        html: html,
        data: {
            d: req.body,
        },
        path: './bonnes_pratiques.pdf',
    };

    pdf.create(document, options)
        .then((r) => {
            res.sendFile('C:/Users/natha/Documents/GitHub/design4green/bonnes_pratiques.pdf', function (err) {
                if (err) {
                    console.log(err);
                } else {
                    fs.unlinkSync('./bonnes_pratiques.pdf');
                }
            });
        })
        .catch((error) => {
            console.error(error);
            res.end('Erreur pdf');
        });
});

app.get('*', function (req, res) {
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});

function getBdd() {
    return JSON.parse(fs.readFileSync('data.json'));
}
