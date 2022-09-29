//Depending on where you run it from you will need to change
//the value of the srcFolder variable to locate the sitemaps.

const fs = require('fs')
const srcFolder = '../src/';
const srcFiles = fs.readdirSync(srcFolder);

for (let i = 0; i < srcFiles.length; i++) {
    const file = srcFiles[i];
    if (isSitemap(file)) {
        if(file === 'sitemap.xml') {
            console.log('Overwriting ' + file);
            changeFirstLine(file);
            changeSecondLine(file);
            addSlashToMeta(file);
        }
        else{
            console.log('Overwriting ' + file);
             relativeToAbsoluteURL(file);
            relativeToAbsoluteImageURL(file);
        }
    }
}
console.log(getURL() + 'sitemap.xml updated in folder ' + srcFolder);

/************* Methods *************/
function changeFirstLine(file) {
    const xml = readFile(file);
    const firstLine = xml.replace(/<!DOCTYPE html>/g, '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "http://www.w3.org/TR/REC-html40/loose.dtd">');
    overwriteLine(file, firstLine);
}

function changeSecondLine(file) {
    const xml = readFile(file);
    const secondLine = xml.replace(/<html>/g, '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:html="http://www.w3.org/TR/REC-html40" ' +
        'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">');
    overwriteLine(file, secondLine);
}

function addSlashToMeta(file) {
    const xml = readFile(file);
    const metaTag = '<meta http-equiv="refresh" content="0;url=/sitemap_index.xml">';
    const closeMetaTag = '<meta http-equiv="refresh" content="0;url=/sitemap_index.xml"/>';

    const addSlash = xml.replace(metaTag, closeMetaTag);
    overwriteLine(file, addSlash);
}

function relativeToAbsoluteURL(file) {
    const xml = readFile(file);
    const replaceLoc = xml.replace(/<loc>\//g, '<loc>'+getURL());
    overwriteLine(file, replaceLoc);
}

function relativeToAbsoluteImageURL(file) {
    const xml = readFile(file);
    const replaceImageLoc = xml.replace(/<image:loc>\//g, '<image:loc>'+getURL());
    overwriteLine(file, replaceImageLoc);
}

function isSitemap(file) {
    return file.includes('sitemap') && file.endsWith('.xml');
}

function readFile(file) {
    return fs.readFileSync(srcFolder + file, 'utf8')
}

function overwriteLine(file, line) {
    fs.writeFileSync(srcFolder + file, line);
}

function getURL(){
    return 'https://vcards.tictap.me/';
}
