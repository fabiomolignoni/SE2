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
router.post('/', createad)
router.get('/:id', getsinglead)
router.put('/:id', updatead)
router.delete('/:id', deletead)
router.get('/:id/images', adimages)

module.exports = router
