const express = require('express');
const router = express.Router();
const liftTableController = require('../controllers/liftTableController');
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post('/add', liftTableController.createLiftTable);
router.get('/getTables', liftTableController.getLiftTables);
router.delete('/:id', liftTableController.deleteLiftTable);
router.put('/update/:id', verifyAccessToken, liftTableController.updateLiftTable);

module.exports = router;
