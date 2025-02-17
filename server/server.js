const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const https = require('https');

const pessoasRoutes = require('./routes/pessoas');
const placasRoutes = require('./routes/placas');

const app = express();
const PORT = 3001;
const HTTPS_PORT = 3000;

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

// Certificados SSL
const options = {
    cert: fs.readFileSync('./certs/nginx-selfsigned.crt'),
    key: fs.readFileSync('./certs/nginx-selfsigned.key')
};
  
https.createServer(options, app).listen(HTTPS_PORT, () => {
    console.log(`Servidor rodando em https://localhost:${HTTPS_PORT}`);
});
