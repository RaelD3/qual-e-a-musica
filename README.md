# Qual é a Música? - Jogo Musical

## Sobre o Jogo
Um jogo interativo onde os jogadores tentam adivinhar músicas através de enigmas e trechos musicais.

## Como Jogar
1. Na tela inicial, insira o nome dos dois jogadores
2. Cada jogador, na sua vez:
   - Escolhe uma opção (A, B, C ou D)
   - Lê o enigma apresentado
   - Escolhe quantas notas quer ouvir (1 a 7)
   - Tem 3 chances de ouvir as notas escolhidas
   - Deve adivinhar a música dentro do tempo limite

## Pontuação
- Acertar a música: +10 pontos
- Errar ou não responder no tempo: 10 pontos para o adversário

## Estrutura do Projeto
```
/qual-e-a-musica/
├── index.html           # Página inicial
├── game.html           # Página do jogo
├── css/
│   ├── style.css      # Estilos gerais
│   └── game.css       # Estilos específicos do jogo
├── js/
│   ├── main.js        # JavaScript da página inicial
│   └── game.js        # Lógica principal do jogo
├── data/
│   ├── enigmas.txt    # Lista de enigmas
│   └── config.txt     # Configurações do jogo
└── audio/            # Pasta para arquivos de áudio
```

## Configuração
1. Adicione os arquivos de áudio na pasta `audio/` seguindo a estrutura:
   ```
   audio/
   ├── 01/
   │   ├── 1.mp3
   │   ├── 2.mp3
   │   └── ...
   ├── 02/
   │   └── ...
   └── ...
   ```
2. Personalize os enigmas editando o arquivo `data/enigmas.txt`
3. Ajuste as configurações no arquivo `data/config.txt`

## Requisitos Técnicos
- Navegador web moderno com suporte a HTML5
- JavaScript habilitado
- Suporte a reprodução de áudio MP3

## Como Executar
1. Clone ou baixe este repositório
2. Adicione seus arquivos de áudio na pasta `audio/`
3. Abra o arquivo `index.html` em um navegador web

## Personalização
- Adicione novos enigmas no arquivo `enigmas.txt`
- Modifique as mensagens do jogo no arquivo `config.txt`
- Personalize o visual editando os arquivos CSS