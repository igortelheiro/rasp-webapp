const express = require('express');
const cors = require('cors');
const path = require('path');

const pessoasRoutes = require('./routes/pessoas');
const placasRoutes = require('./routes/placas');

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use('/imagens', express.static(path.join(__dirname, '../face-recon/coletas_faciais')));

// Rotas
app.use('/pessoas', pessoasRoutes);
app.use('/placas', placasRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
