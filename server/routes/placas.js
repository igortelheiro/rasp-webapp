const express = require('express');
const { lerPlacas, escreverPlacas, checarPlacaExistente } = require('../utils/csv');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        res.json(await lerPlacas());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        let { placa } = req.body;
        if (!placa) return res.status(400).json({ error: 'Placa é obrigatória' });

        const placas = await lerPlacas();
        if (checarPlacaExistente(placas, placa)) {
            return res.status(400).json({ error: 'Placa já cadastrada' });
        }

        placas.push(placa.toUpperCase());
        await escreverPlacas(placas);
        res.status(201).json({ message: 'Placa adicionada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/:placa', async (req, res) => {
    try {
        const { placa } = req.params;
        const { novaPlaca } = req.body;
        if (!novaPlaca) return res.status(400).json({ error: 'Nova placa é obrigatória' });

        let placas = await lerPlacas();
        const index = placas.findIndex(p => p.toUpperCase() === placa.toUpperCase());
        if (index === -1) return res.status(404).json({ error: 'Placa não encontrada' });

        placas[index] = novaPlaca.toUpperCase();
        await escreverPlacas(placas);
        res.json({ message: 'Placa atualizada' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:placa', async (req, res) => {
    try {
        let placas = await lerPlacas();
        placas = placas.filter(p => p !== req.params.placa);
        await escreverPlacas(placas);
        res.json({ message: 'Placa removida' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
