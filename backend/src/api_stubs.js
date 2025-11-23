// Minimal API stubs for demo/testing
const express = require('express');
const router = express.Router();

router.get('/tournaments', (req, res) => res.json([{id:1,name:'Test Open',date:'2025-12-01'}]));
router.post('/tournaments', (req, res) => res.status(201).json({id:2,...req.body}));
router.get('/athletes', (req, res) => res.json([{id:1,name:'Juan Perez'}]));
router.post('/athletes', (req, res) => res.status(201).json({id:2,...req.body}));
router.post('/inscriptions', (req, res) => res.status(201).json({id:1,...req.body}));
router.post('/results', (req, res) => res.status(201).json({id:1,...req.body}));
module.exports = router;
