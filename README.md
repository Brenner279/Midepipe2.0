# ProvaFácil — Correção de avaliações

Aplicação web para cadastrar gabaritos, gerar cartões-resposta e registrar resultados.

## Etapa 1 — Configuração da avaliação

- Informe a disciplina e o nome da avaliação.
- Defina de 1 a 100 questões.
- Escolha de 2 a 10 alternativas, de A em diante.
- Configure uma resposta correta por questão.
- Os gabaritos e o histórico são guardados no armazenamento local do navegador (localStorage).

## Etapa 2 — Leitura automática OMR

O cartão foi padronizado em um desenho vetorial com quatro marcadores quadrados nos cantos. O leitor usa o OpenCV.js para:
1. localizar os quatro marcadores;
2. corrigir a perspectiva e alinhar a folha;
3. analisar o interior de cada bolha nas coordenadas do cartão;
4. classificar as questões como lidas, em branco, duplas ou duvidosas;
5. apresentar a folha alinhada e permitir correção manual das respostas duvidosas ou duplas.

### Como utilizar

1. Em **Gerenciar Gabaritos**, escolha a disciplina, a avaliação, a quantidade de questões e as alternativas.
2. Confira as respostas corretas e salve o gabarito.
3. Abra **Gerar Cartão Resposta** e selecione o mesmo gabarito que será utilizado na correção.
4. Imprima em papel A4, em **escala 100%**, sem a opção “ajustar à página”.
5. Oriente o aluno a preencher completamente uma bolha por questão, usando caneta escura. Não dobre nem corte os quatro marcadores dos cantos.
6. Abra **Ler Cartão-Resposta** e selecione, na própria tela de correção, o mesmo gabarito usado para imprimir a folha.
7. Ative a câmera traseira ou envie uma foto nítida da folha inteira.
8. Confira o alinhamento e o resumo da leitura. Questões com marcação dupla ou duvidosa são destacadas; toque na alternativa correta para ajustar.
9. Informe nome e turma e toque em **Corrigir**.

### Qualidade da imagem

- Fotografe a folha inteira, incluindo os quatro quadrados pretos.
- Prefira iluminação uniforme, sem sombras fortes ou reflexos.
- Coloque o cartão sobre uma superfície plana e contraste com o fundo.
- Evite inclinar muito a câmera, borrar a imagem ou cortar as bordas.

### Limitações atuais

- A leitura OMR reconhece as bolhas; o nome e a turma manuscritos não são reconhecidos automaticamente e devem ser informados no aplicativo.
- Marcações claras, rasuras, círculos parcialmente preenchidos e folhas danificadas podem exigir conferência manual.
- O leitor usa OpenCV.js carregado de https://docs.opencv.org/4.x/opencv.js. É necessária conexão com a internet para carregar a biblioteca na primeira abertura; o processamento da foto acontece localmente no navegador depois que a biblioteca carrega.
- A implementação deve ser validada com cartões reais impressos em diferentes impressoras, câmeras e condições de iluminação antes de uso em avaliações oficiais.
- O histórico e os gabaritos permanecem no navegador e dispositivo em que foram criados; não existe sincronização automática entre aparelhos.

## Execução

O projeto é uma página HTML publicada pelo GitHub Pages. A câmera exige um contexto seguro (HTTPS) e permissão do navegador. A correção manual permanece disponível quando a biblioteca OMR ou a câmera não puderem ser utilizadas.


## Etapa 3 — Correção em lote por PDF

A tela **Ler Cartão-Resposta** também permite selecionar vários arquivos PDF em uma única operação.

### Como utilizar

1. Prepare os PDFs com **um cartão-resposta completo por página**.
2. Em **Correção em lote por PDF**, selecione todos os arquivos desejados.
3. Associe um gabarito a cada PDF. Assim, arquivos diferentes podem corresponder a avaliações diferentes.
4. Toque em **Processar PDFs selecionados**. As páginas são analisadas sequencialmente.
5. Confira os resultados. Em cada página, informe ou ajuste o nome do aluno e a turma.
6. Quando uma leitura ficar duvidosa, selecione manualmente a resposta correta ou indique que a questão ficou em branco.
7. Toque em **Salvar resultados do lote** para registrar as correções prontas no histórico.

### Regras e limites do lote

- Todas as páginas de um mesmo PDF usam o gabarito associado àquele arquivo. Para avaliações diferentes, envie PDFs separados e selecione o gabarito de cada um.
- Cada página precisa conter somente um cartão-resposta, com os quatro marcadores visíveis.
- Marcações duplas continuam sendo consideradas erradas automaticamente.
- Páginas sem os quatro marcadores ou com falha de leitura não são salvas automaticamente; corrija o enquadramento/arquivo e processe novamente.
- O nome e a turma manuscritos não são reconhecidos automaticamente. O nome é sugerido a partir do arquivo e do número da página, mas pode ser editado antes de salvar.
- O processamento em lote utiliza PDF.js e OpenCV.js carregados por CDN. É necessária conexão com a internet para carregar as bibliotecas; a análise das páginas ocorre localmente no navegador.
