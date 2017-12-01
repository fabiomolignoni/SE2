// =======================
// packages
// =======================
const express = require('express')
const router = express.Router()
const signup = require('./signup')
const userdata = require('./userdata')
const updateuser = require('./updateuser')
const deleteuser = require('./deleteuser')
const userimages = require('./userimages')
const userbytoken = require('./userbytoken')
const login = require('./login')

// =======================
// routes
// =======================
router.get('/', userbytoken)
router.get('/:id/image', userimages)
router.get('/:id', userdata)
router.post('/', signup)
router.post('/login', login)
router.put('/:id', updateuser)
router.delete('/:id', deleteuser)

module.exports = router
