import { cpSync, copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'index.html');
const outputDir = path.join(root, 'www');
const assetsDir = path.join(outputDir, 'assets');

function ensureFile(filePath, label) {
  if (!existsSync(filePath)) throw new Error('Dependência ausente: ' + label + ' (' + filePath + ')');
}

function replaceExactly(source, search, replacement, label) {
  const first = source.indexOf(search);
  if (first < 0) throw new Error('Não encontrei a referência esperada: ' + label);
  if (source.indexOf(search, first + search.length) >= 0) {
    throw new Error('A referência aparece mais de uma vez e precisa ser revisada: ' + label);
  }
  return source.slice(0, first) + replacement + source.slice(first + search.length);
}

async function download(url, destination) {
  const response = await fetch(url, { headers: { 'User-Agent': 'ProvaFacil-Android-Offline-Build' } });
  if (!response.ok) throw new Error('Falha ao baixar ' + url + ': HTTP ' + response.status);
  const data = Buffer.from(await response.arrayBuffer());
  if (data.length < 10000) throw new Error('O arquivo baixado parece incompleto: ' + url);
  writeFileSync(destination, data);
  console.log('Recurso local incluído: ' + path.relative(root, destination) + ' (' + data.length + ' bytes)');
}

if (!existsSync(sourcePath)) throw new Error('index.html não encontrado na raiz do repositório.');
if (!existsSync(path.join(root, 'node_modules'))) throw new Error('Execute npm install antes de preparar o APK.');

mkdirSync(assetsDir, { recursive: true });
mkdirSync(path.join(assetsDir, 'fontawesome', 'css'), { recursive: true });
mkdirSync(path.join(assetsDir, 'fontawesome', 'webfonts'), { recursive: true });
mkdirSync(path.join(assetsDir, 'fonts', 'inter'), { recursive: true });
mkdirSync(path.join(assetsDir, 'pdfjs'), { recursive: true });
mkdirSync(path.join(assetsDir, 'opencv'), { recursive: true });

let html = readFileSync(sourcePath, 'utf8');

html = replaceExactly(
  html,
  '<script src="https://cdn.tailwindcss.com"></script>',
  '<link href="assets/tailwind.min.css" rel="stylesheet">',
  'Tailwind CDN'
);

html = replaceExactly(
  html,
  '<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">',
  '<link href="assets/fontawesome/css/all.min.css" rel="stylesheet">',
  'Font Awesome CDN'
);

const interLinks = [400, 500, 600, 700, 800, 900]
  .map(weight => '<link href="assets/fonts/inter/' + weight + '.css" rel="stylesheet">')
  .join('\n    ');

html = replaceExactly(
  html,
  '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">',
  interLinks,
  'Google Fonts CDN'
);

html = replaceExactly(
  html,
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>',
  '<script src="assets/pdfjs/pdf.min.js"></script>',
  'PDF.js CDN'
);

html = replaceExactly(
  html,
  "<script async src=\"https://docs.opencv.org/4.x/opencv.js\" onerror=\"window.opencvLoadFailed = true; window.dispatchEvent(new Event('opencv-ready'))\"></script>",
  "<script async src=\"assets/opencv/opencv.js\" onerror=\"window.opencvLoadFailed = true; window.dispatchEvent(new Event('opencv-ready'))\"></script>",
  'OpenCV.js CDN'
);

html = replaceExactly(
  html,
  'window.Module = window.Module || {};',
  "window.Module = window.Module || {};\n        window.Module.locateFile = function (file) { return 'assets/opencv/' + file; };",
  'OpenCV wasm locator'
);

html = replaceExactly(
  html,
  "window.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';",
  "window.pdfjsLib.GlobalWorkerOptions.workerSrc='assets/pdfjs/pdf.worker.min.js';",
  'PDF.js worker'
);

html = replaceExactly(
  html,
  'pdf=await window.pdfjsLib.getDocument({data:bytes}).promise;',
  "pdf=await window.pdfjsLib.getDocument({data:bytes,cMapUrl:'assets/pdfjs/cmaps/',cMapPacked:true,standardFontDataUrl:'assets/pdfjs/standard_fonts/'}).promise;",
  'PDF.js CMaps e fontes'
);

html = replaceExactly(
  html,
  'window.print();',
  "if(window.ProvaFacilPrinter && typeof window.ProvaFacilPrinter.printWebView==='function'){\n                    window.ProvaFacilPrinter.printWebView({name:'Cartão de Respostas'})\n                        .then(cleanup)\n                        .catch(()=>{cleanup();showToast('Não foi possível abrir a impressão neste dispositivo.');});\n                    return;\n                }\n                window.print();",
  'impressão Android'
);

html = html.replace(
  'Não foi possível carregar o OpenCV.js. Verifique a internet e atualize a página; a marcação manual continua disponível.',
  'Não foi possível iniciar o OpenCV.js integrado. Feche e abra novamente o aplicativo; a marcação manual continua disponível.'
);
html = html.replace(
  'Carregando o motor OMR. Mantenha a internet ativa na primeira abertura.',
  'Carregando o motor OMR integrado ao aplicativo. Aguarde alguns segundos.'
);
html = html.replace(
  'Este navegador não liberou a câmera. Abra o site em HTTPS ou envie uma foto.',
  'O Android não liberou a câmera. Verifique a permissão do aplicativo ou envie uma foto.'
);
html = html.replace(
  'O leitor de PDF não carregou. Verifique a conexão com a internet e atualize a página.',
  'O leitor de PDF integrado não carregou. Feche e abra novamente o aplicativo.'
);

html = replaceExactly(
  html,
  '</body>',
  '    <script src="assets/printer-bridge.js"></script>\n</body>',
  'módulo de impressão'
);

const faRoot = path.join(root, 'node_modules', '@fortawesome', 'fontawesome-free');
copyFileSync(path.join(faRoot, 'css', 'all.min.css'), path.join(assetsDir, 'fontawesome', 'css', 'all.min.css'));
cpSync(path.join(faRoot, 'webfonts'), path.join(assetsDir, 'fontawesome', 'webfonts'), { recursive: true });

const interRoot = path.join(root, 'node_modules', '@fontsource', 'inter');
for (const weight of [400, 500, 600, 700, 800, 900]) {
  copyFileSync(path.join(interRoot, weight + '.css'), path.join(assetsDir, 'fonts', 'inter', weight + '.css'));
}
cpSync(path.join(interRoot, 'files'), path.join(assetsDir, 'fonts', 'inter', 'files'), { recursive: true });

const pdfRoot = path.join(root, 'node_modules', 'pdfjs-dist');
copyFileSync(path.join(pdfRoot, 'build', 'pdf.min.js'), path.join(assetsDir, 'pdfjs', 'pdf.min.js'));
copyFileSync(path.join(pdfRoot, 'build', 'pdf.worker.min.js'), path.join(assetsDir, 'pdfjs', 'pdf.worker.min.js'));
cpSync(path.join(pdfRoot, 'cmaps'), path.join(assetsDir, 'pdfjs', 'cmaps'), { recursive: true });
cpSync(path.join(pdfRoot, 'standard_fonts'), path.join(assetsDir, 'pdfjs', 'standard_fonts'), { recursive: true });

await download('https://docs.opencv.org/4.13.0/opencv.js', path.join(assetsDir, 'opencv', 'opencv.js'));

execFileSync(
  process.execPath,
  [
    path.join(root, 'node_modules', 'tailwindcss', 'lib', 'cli.js'),
    '-c', path.join(root, 'tailwind.config.cjs'),
    '-i', path.join(root, 'scripts', 'tailwind.input.css'),
    '-o', path.join(assetsDir, 'tailwind.min.css'),
    '--minify'
  ],
  { cwd: root, stdio: 'inherit' }
);

await build({
  entryPoints: [path.join(root, 'scripts', 'printer-bridge.js')],
  bundle: true,
  platform: 'browser',
  format: 'iife',
  target: ['es2020'],
  outfile: path.join(assetsDir, 'printer-bridge.js'),
  minify: true
});

for (const match of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)) {
  const src = match[1];
  if (/^https?:\/\//i.test(src)) throw new Error('Script externo ainda presente: ' + src);
  ensureFile(path.join(outputDir, src), src);
}
for (const match of html.matchAll(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi)) {
  const href = match[1];
  if (/^https?:\/\//i.test(href)) throw new Error('CSS externo ainda presente: ' + href);
  if (!href.startsWith('data:')) ensureFile(path.join(outputDir, href), href);
}
if (html.includes('cdnjs.cloudflare.com') || html.includes('cdn.tailwindcss.com') || html.includes('docs.opencv.org')) {
  throw new Error('O HTML final ainda contém referência de CDN.');
}

writeFileSync(path.join(outputDir, 'index.html'), html, 'utf8');
console.log('Versão web offline preparada em www/. Estilos, OMR, PDF e impressão são recursos locais.');
