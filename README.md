# ProvaFácil — Correção de avaliações

Aplicação web para organizar gabaritos, gerar cartões-resposta e registrar resultados de avaliações.

## Etapa 1 — Configuração e armazenamento local

A versão atual permite:

- Cadastrar diferentes gabaritos e editar os já existentes.
- Informar a **disciplina** e o **nome da avaliação**.
- Definir a quantidade de questões de **1 a 100**.
- Escolher de **2 a 10 alternativas por questão**, identificadas em sequência: A–B, A–C, A–D, ... até A–J.
- Definir a resposta correta de cada questão conforme as alternativas configuradas.
- Gerar o cartão-resposta com a disciplina, a quantidade de questões e as alternativas correspondentes ao gabarito selecionado.
- Registrar os resultados das correções no histórico.

## Como configurar uma avaliação

1. Abra **Gerenciar Gabaritos**.
2. Selecione um gabarito existente ou toque em **Novo**.
3. Preencha a disciplina e o nome da avaliação.
4. Informe a quantidade de questões.
5. Selecione a quantidade de alternativas.
6. Marque a resposta correta de cada questão.
7. Toque em **Salvar Gabarito**.
8. Acesse **Gerar Cartão Resposta** para visualizar e imprimir o cartão correspondente.

## Armazenamento

Os gabaritos e o histórico são armazenados no localStorage do navegador. Os dados permanecem disponíveis no mesmo navegador e dispositivo após fechar ou atualizar a página, mas não são sincronizados automaticamente entre aparelhos. Limpar os dados do site no navegador pode apagar essas informações; recomenda-se manter cópias dos dados importantes.

## Situação da leitura pela câmera

Nesta etapa, a tela de correção ainda utiliza marcação manual/simulação para registrar as respostas. A câmera pode ser aberta, mas o reconhecimento automático das bolhas do cartão (OMR) ainda será desenvolvido na próxima etapa.

## Execução

O projeto é uma página HTML com JavaScript e pode ser publicado pelo GitHub Pages. A interface atual utiliza bibliotecas externas para parte do estilo e dos ícones; portanto, a disponibilidade totalmente offline será tratada em uma etapa posterior.
