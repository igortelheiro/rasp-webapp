const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { parse } = require('json2csv');
const { criarPastaSeNaoExiste } = require('./diretorios');

const CSV_FILE = './db/placas.csv';

criarPastaSeNaoExiste(path.dirname(CSV_FILE));

async function lerPlacas() {
    return new Promise((resolve, reject) => {
        const placas = [];
        if (!fs.existsSync(CSV_FILE)) fs.writeFileSync(CSV_FILE, '');

        fs.createReadStream(CSV_FILE)
            .pipe(csv())
            .on('data', row => placas.push(row.placa))
            .on('end', () => resolve(placas))
            .on('error', reject);
    });
}

async function escreverPlacas(placas) {
    return new Promise((resolve, reject) => {
        const csvData = parse(placas.map(placa => ({ placa })), { fields: ['placa'] });
        fs.writeFile(CSV_FILE, csvData, err => err ? reject(err) : resolve());
    });
}

function checarPlacaExistente(placas, placa) {
    return placas.some(p => p.toUpperCase() === placa.toUpperCase());
}

module.exports = { lerPlacas, escreverPlacas, checarPlacaExistente };
