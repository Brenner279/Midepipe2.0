import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const manifestPath = path.resolve('android/app/src/main/AndroidManifest.xml');
let manifest = readFileSync(manifestPath, 'utf8');

if (!manifest.includes('android.permission.CAMERA')) {
  manifest = manifest.replace(
    '<application',
    '    <uses-permission android:name="android.permission.CAMERA" />\n    <uses-feature android:name="android.hardware.camera" android:required="false" />\n\n    <application'
  );
}

// O app não faz chamadas de rede. As bibliotecas e os arquivos necessários estão no APK.
manifest = manifest.replace(/\s*<uses-permission android:name="android.permission.INTERNET"\s*\/>/g, '');

writeFileSync(manifestPath, manifest, 'utf8');
console.log('Manifesto Android ajustado: permissão de câmera incluída e acesso à internet removido.');
