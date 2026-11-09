# Midnight Café

Um jogo narrativo de cafeteria encantada. Prepare bebidas, administre o café e descubra as histórias que só aparecem depois da meia-noite.


## Publicação

O projeto utiliza JavaScript nativo e não exige bibliotecas externas. O comando `npm run build` prepara o site estático na pasta `dist`.

No Netlify, conecte o repositório GitHub. O projeto inclui `netlify.toml` com os comandos de build (`npm run build`) e publicação (`dist`).

## Mecânicas

- 30 noites de história em cinco capítulos, com replay das noites anteriores.
- Preparo por ingredientes, controle de extração e finalização.
- 20 receitas, clientes recorrentes e vínculos de afinidade.
- Melhorias, decoração e pequenas interações com Nox e Dudu.
- Diário, pistas, conquistas e troféu de platina.
- Salvamento automático local; exportação e importação em JSON.

O progresso fica armazenado no navegador do dispositivo utilizado. Para transferi-lo, exporte o arquivo de salvamento e importe no outro dispositivo.

## Créditos

Desenvolvido por Luana Figueiredo.

Contato: luanafigueiredo.dev@gmail.com · github.com/luanafigdev
