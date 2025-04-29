const express = require('express');
const router = express.Router();
const multer = require('multer');
const authenticate = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');
const sharp = require("sharp");
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const processImage = async (req, res, next) => {
    if (!req.file) return next();

    try {
        const timestamp = Date.now();
        const outputFileName = path.join(__dirname, '../../data/img', `${timestamp}.jpg`);

        await sharp(req.file.buffer)
            .resize(500, 500)
            .jpeg({ quality: 80 })
            .toFile(outputFileName);

        req.file.path = `${timestamp}.jpg`;
        next();
    } catch (error) {
        console.error('Error al procesar la imagen:', error);
        res.status(500).json({ status: 500, message: 'Error al procesar la imagen' });
    }
};

router.post('/add-product', authenticate, upload.single('image'), processImage, adminController.addProduct);
router.put('/edit-product/:id', authenticate, upload.single('image'), processImage, adminController.editProduct);
router.post('/get-product', authenticate, adminController.getProduct);

module.exports = router;
