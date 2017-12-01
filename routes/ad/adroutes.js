// =======================
// packages
// =======================
const express = require('express')
const router = express.Router()
const createad = require('./createad')
const deletead = require('./deletead')
const getads = require('./getads')
const updatead = require('./updatead')
const getsinglead = require('./getsinglead')
const adimages = require('./adimages')

// =======================
// routes
// =======================
router.get('/', getads)
router.get('/:id', getsinglead)
router.get('/:id/images', adimages)
router.post('/', createad)
router.put('/:id', updatead)
router.delete('/:id', deletead)

module.exports = router
