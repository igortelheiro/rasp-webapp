const fs = require('fs');
const path = require('path');

const facesDir = path.join(__dirname, '../coletas_faciais');

function criarPastaSeNaoExiste(diretorio) {
    if (!fs.existsSync(diretorio)) {
        fs.mkdirSync(diretorio, { recursive: true });
    }
}

function listarPessoas() {
    return fs.readdirSync(facesDir)
        .filter(pasta => fs.statSync(path.join(facesDir, pasta)).isDirectory())
        .map(pasta => {
            const imagens = fs.readdirSync(path.join(facesDir, pasta));
            return imagens.length > 0 ? { nome: pasta, imagem: `/imagens/${pasta}/${imagens[0]}` } : null;
        })
        .filter(Boolean);
}

function deletarPastaPessoa(nome) {
    const pastaPessoa = path.join(facesDir, nome);
    if (fs.existsSync(pastaPessoa)) {
        fs.rmSync(pastaPessoa, { recursive: true });
        return true;
    }
    return false;
}

module.exports = { criarPastaSeNaoExiste, listarPessoas, deletarPastaPessoa, facesDir };
