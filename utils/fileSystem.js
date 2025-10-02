const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const hljs = require('highlight.js');

const WRITEUP_DIR = path.join(__dirname, '..', 'writeups');

function highlightCode({ text, lang }) {
    if (lang && hljs.getLanguage(lang)) {
        try {
            const highlighted = hljs.highlight(text, { language: lang }).value;
            return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
        } catch (err) {
            console.error('Highlight 오류:', err);
        }
    }
    const highlighted = hljs.highlightAuto(text).value;
    return `<pre><code class="hljs">${highlighted}</code></pre>`;
};

let fileList = [];
const mdFiles = new Map();

function createRenderer(filename) {
    const renderer = new marked.Renderer();
    const directory = filename.replace('.md', '');

    renderer.code = highlightCode;
    renderer.image = ({href, title, text}) => {
        const filename = path.basename(href);
        href = `/main/images/${directory}/${filename}`;

        const titleAttr = title ? ` title="${title}"` : '';
        return `<img src="${href}" alt="${text}"${titleAttr}>`;
    };

    return renderer;
}

function scanFiles() {
    try {
        const files = fs.readdirSync(WRITEUP_DIR).filter(filename => filename.endsWith('.md'));

        const sortedFiles = files
            .map(filename => ({
                name: filename,
                time: fs.statSync(path.join(WRITEUP_DIR, filename)).mtimeMs,
            }))
            .sort((a, b) => b.time - a.time)
            .map(file => file.name);

        fileList = [...sortedFiles];

        console.log(fileList);
    } catch (error) {
        fileList = [];
    }
}

function getFiles() {
    return [...fileList];
}

function mdParser(filename) {
    const file_path = path.join(WRITEUP_DIR, filename);
    const content = fs.readFileSync(file_path, 'utf-8');

    const renderer = createRenderer(filename);
    const html = marked.parse(content, { renderer });
    mdFiles.set(filename, html);
}

function loadMD() {
    mdFiles.clear();

    for (const filename of fileList) {
        mdParser(filename);
    }
}

function updateMD(filename) {
    try {
        if (fs.existsSync(path.join(WRITEUP_DIR, filename))) {
            mdParser(filename);
        }
        else mdFiles.delete(filename);
    } catch (error) {
        console.log(error);
    }
}

function getMD() {
    return mdFiles;
}

function initFileWatcher() {
    scanFiles();
    loadMD();

    fs.watch(WRITEUP_DIR, (eventType, filename) => {
        if (filename && filename.endsWith('.md')) {
            setTimeout(() => {
                scanFiles();
                updateMD(filename);
            }, 50);
        }
    });
}

initFileWatcher();

module.exports = {
    getFiles,
    getMD,
};