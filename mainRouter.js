const express = require('express');
const path = require('path');
const router = express.Router();

const fileSys = require('./utils/fileSystem');

const ITEMS_PER_PAGE = 5;

router.use(express.static(path.join(__dirname, 'main')));
router.get('/', (req, res) => {
    const page = parseInt(req.query.page) || 1;

    const files = fileSys.getFiles();
    const file_len = files.length;

    const totalPages = Math.ceil(file_len / ITEMS_PER_PAGE);
    const currentPage = Math.max(1, Math.min(page, totalPages));

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const paginatedFiles = files.slice(startIndex, endIndex);

    res.render('index', {
        title: 'Write-Up',
        fileList: paginatedFiles,
        currentPage: currentPage,
        totalPages: totalPages,
        totalItems: file_len,
    });
});

router.get('/detail', (req, res) => {
    const mdFiles = fileSys.getMD();
    const filename = req.query.file;
    const convertedData = mdFiles.get(filename);

    if (convertedData === undefined) return res.status(404).json({msg: 'File not Found!!!'});

    res.render('detail', {
        filename: filename,
        content: convertedData,
    });
});

module.exports = router;