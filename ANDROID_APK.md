# ProvaFácil para Android — versão offline

Este repositório prepara um APK Android que executa o ProvaFácil sem depender de internet depois da instalação.

## O que fica dentro do APK

- Interface e estilos: HTML e CSS compilado localmente com Tailwind.
- Ícones e tipografia: Font Awesome e Inter locais.
- Leitura dos cartões: OpenCV.js empacotado no aplicativo.
- Correção em lote por PDF: PDF.js, worker, CMaps e fontes padrão locais.
- Impressão: diálogo nativo de impressão do Android, incluindo a opção Salvar como PDF quando disponível.
- Dados: gabaritos e histórico continuam no armazenamento local do aplicativo.

## Recursos Android

- A câmera traseira usa a permissão de câmera do Android.
- O seletor de arquivos do sistema permite abrir imagens e PDFs armazenados no aparelho.
- Os resultados e gabaritos permanecem no dispositivo. Não há sincronização com servidor.
- O APK não precisa de permissão de internet: bibliotecas, estilos e arquivos de trabalho são locais.

## Gerar o APK pelo GitHub

1. Abra a guia Actions do repositório.
2. Selecione Build ProvaFácil Android APK.
3. Toque em Run workflow quando quiser gerar uma nova versão.
4. Quando a execução terminar com sucesso, abra a execução e baixe o artefato ProvaFacil-Android-APK.
5. Extraia o arquivo ZIP e instale o app-debug.apk no Android.

O workflow também inicia automaticamente quando os arquivos do aplicativo ou do empacotamento Android são atualizados na branch main.

## Gerar localmente

Requisitos: Node.js 22, Java 21 e Android SDK API 36.

Comandos:

    npm install
    npm run android:prepare
    npx cap add android
    npm run android:patch-manifest
    npx cap sync android
    cd android
    ./gradlew assembleDebug

O APK gerado ficará em:

    android/app/build/outputs/apk/debug/app-debug.apk

## Observações importantes

- A primeira compilação precisa de internet para baixar as dependências e a biblioteca OpenCV. Essa conexão é necessária apenas durante a preparação e compilação; os arquivos são incluídos no APK.
- Depois de instalado, o aplicativo pode ser usado sem Wi-Fi ou dados móveis.
- A câmera depende da autorização do usuário e do hardware do aparelho.
- A impressão depende de um serviço de impressão configurado no Android; a opção Salvar como PDF pode ser usada sem impressora física.
- Os dados são locais. Ao desinstalar o aplicativo ou limpar seus dados nas configurações do Android, o histórico e os gabaritos salvos serão apagados.
- O artefato gerado pelo workflow é um APK de depuração instalável, assinado com a chave de depuração do Android. Para distribuição pública contínua, deve ser criada uma chave de assinatura própria.
