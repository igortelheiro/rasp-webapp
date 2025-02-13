const express = require('express');
const path = require('path');
const multer = require('multer');
const { restartFaceValidator } = require('../utils/python.js');
const { criarPastaSeNaoExiste, listarPessoas, deletarPastaPessoa, facesDir } = require('../utils/diretorios.js');
const fs = require('fs');

const router = express.Router();

criarPastaSeNaoExiste(facesDir);
restartFaceValidator();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const nomePessoa = req.params.nome;
        const pastaPessoa = path.join(facesDir, nomePessoa);
        criarPastaSeNaoExiste(pastaPessoa);
        cb(null, pastaPessoa);
    },
    filename: (req, file, cb) => {
        cb(null, `face_${Date.now()}.png`);
    }
});

const upload = multer({ storage });

// Rotas
router.get('/', (req, res) => res.json(listarPessoas()));

router.post('/:nome', upload.single('imagem'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'Nenhuma imagem enviada.' });
    restartFaceValidator();
    res.json({ message: `Imagem salva para ${req.params.nome}.`, filename: req.file.filename });
});

router.delete('/:nome', (req, res) => {
    if (deletarPastaPessoa(req.params.nome)) {
        restartFaceValidator();
        res.json({ message: `Pessoa ${req.params.nome} deletada.` });
    } else {
        res.status(404).json({ message: `Pessoa ${req.params.nome} não encontrada.` });
    }
});

// Rota PUT para renomear a pasta de uma pessoa
router.put('/:nomeAntigo', (req, res) => {
    const { novoNome } = req.body;

    if (!novoNome) {
        return res.status(400).json({ message: 'O novo nome é obrigatório.' });
    }

    const pastaAntiga = path.join(facesDir, req.params.nomeAntigo);
    const novaPasta = path.join(facesDir, novoNome);

    if (!fs.existsSync(pastaAntiga)) {
        return res.status(404).json({ message: `A pasta ${req.params.nomeAntigo} não foi encontrada.` });
    }

    if (fs.existsSync(novaPasta)) {
        return res.status(400).json({ message: `A pasta ${novoNome} já existe.` });
    }

    try {
        fs.renameSync(pastaAntiga, novaPasta);
        res.json({ message: `Pasta renomeada de ${req.params.nomeAntigo} para ${novoNome}.` });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao renomear a pasta.', error: error.message });
    }
});

module.exports = router;
