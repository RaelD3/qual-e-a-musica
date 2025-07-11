document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const player1Info = document.getElementById('player1Info');
    const player2Info = document.getElementById('player2Info');
    const optionsArea = document.getElementById('optionsArea');
    const enigmaArea = document.getElementById('enigmaArea');
    const enigmaText = document.getElementById('enigmaText');
    const playbackControls = document.getElementById('playbackControls');
    const remainingPlays = document.getElementById('remainingPlays');
    const playAgainBtn = document.getElementById('playAgainBtn');
    const answerBtn = document.getElementById('answerBtn');
    const answerArea = document.getElementById('answerArea');
    const answerInput = document.getElementById('answerInput');
    const submitAnswer = document.getElementById('submitAnswer');
    const timer = document.getElementById('timer');
    const timerValue = document.getElementById('timerValue');
    const audioPlayer = document.getElementById('audioPlayer');
    const backBtn = document.getElementById('backBtn');

    // Variáveis do jogo
    let currentEnigma = null;
    let selectedNotes = 0;
    let playsRemaining = 3;
    let timerInterval = null;
    let currentAudioPath = '';

    // Função para mostrar mensagem flutuante
    function showFloatingMessage(message, isSuccess = true) {
        const messageElement = document.createElement('div');
        messageElement.className = 'floating-message';
        messageElement.style.background = isSuccess ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)';
        messageElement.textContent = message;
        document.body.appendChild(messageElement);

        // Remover a mensagem após 15 segundos
        setTimeout(() => {
            if (messageElement && messageElement.parentNode) {
                messageElement.style.animation = 'floatOut 0.5s ease-in forwards';
                setTimeout(() => {
                    document.body.removeChild(messageElement);
                }, 500);
            }
        }, 14500);
    }

    // Atualizar pontuações
    function updateScores() {
        const player1Name = sessionStorage.getItem('player1');
        const player2Name = sessionStorage.getItem('player2');
        const player1Score = sessionStorage.getItem('player1Score');
        const player2Score = sessionStorage.getItem('player2Score');

        document.querySelector('#player1Info .player-name').textContent = player1Name;
        document.querySelector('#player2Info .player-name').textContent = player2Name;
        document.querySelector('#player1Info .score').textContent = player1Score;
        document.querySelector('#player2Info .score').textContent = player2Score;

        updateCurrentPlayer();
    }

    // Inicializar o jogo
    function initGame() {
        updateScores();
        optionsArea.classList.remove('hidden');
        enigmaArea.classList.add('hidden');

        // Carregar enigmas e criar botões dinamicamente
        const enigmasStr = sessionStorage.getItem('enigmas');
        if (enigmasStr) {
            const enigmas = JSON.parse(enigmasStr);
            const optionsGrid = document.querySelector('.options-grid');
            optionsGrid.innerHTML = ''; // Limpar opções existentes

            enigmas.forEach(enigma => {
                const button = document.createElement('button');
                button.className = 'option-btn';
                button.dataset.option = enigma.id;
                button.textContent = enigma.id;

                // Verificar se a opção já foi usada
                const usedOptions = JSON.parse(sessionStorage.getItem('usedOptions') || '[]');
                if (usedOptions.includes(enigma.id)) {
                    button.disabled = true;
                    button.classList.add('used');
                }

                button.addEventListener('click', () => {
                    showEnigma(enigma.id);
                    button.disabled = true;
                    button.classList.add('used');

                    // Marcar opção como usada
                    const usedOptions = JSON.parse(sessionStorage.getItem('usedOptions') || '[]');
                    if (!usedOptions.includes(enigma.id)) {
                        usedOptions.push(enigma.id);
                        sessionStorage.setItem('usedOptions', JSON.stringify(usedOptions));
                    }
                });

                optionsGrid.appendChild(button);
            });
        } else {
            showFloatingMessage('Erro: Enigmas não encontrados!', false);
            window.location.href = 'index.html';
        }

        // Adicionar eventos de clique nos cards dos jogadores
        player1Info.addEventListener('click', () => {
            if (enigmaArea.classList.contains('hidden')) return; // Só permite trocar durante o enigma
            const currentPlayer = sessionStorage.getItem('currentPlayer');
            if (currentPlayer === 'player2') {
                sessionStorage.setItem('tempPlayer', currentPlayer);
                sessionStorage.setItem('currentPlayer', 'player1');
                updateCurrentPlayer();
                showFloatingMessage('Vez passada para ' + sessionStorage.getItem('player1'));
            }
        });

        player2Info.addEventListener('click', () => {
            if (enigmaArea.classList.contains('hidden')) return; // Só permite trocar durante o enigma
            const currentPlayer = sessionStorage.getItem('currentPlayer');
            if (currentPlayer === 'player1') {
                sessionStorage.setItem('tempPlayer', currentPlayer);
                sessionStorage.setItem('currentPlayer', 'player2');
                updateCurrentPlayer();
                showFloatingMessage('Vez passada para ' + sessionStorage.getItem('player2'));
            }
        });
    }

    // Atualizar jogador atual
    function updateCurrentPlayer() {
        const currentPlayer = sessionStorage.getItem('currentPlayer');
        player1Info.classList.toggle('active', currentPlayer === 'player1');
        player2Info.classList.toggle('active', currentPlayer === 'player2');
    }

    // Mostrar enigma
    function showEnigma(option) {
        const enigmasStr = sessionStorage.getItem('enigmas');
        if (!enigmasStr) {
            showFloatingMessage('Erro: Enigmas não encontrados!', false);
            window.location.href = 'index.html';
            return;
        }

        const enigmas = JSON.parse(enigmasStr);
        currentEnigma = enigmas.find(e => e.id === option);

        if (!currentEnigma) {
            console.error('Enigma não encontrado para a opção:', option);
            return;
        }

        optionsArea.classList.add('hidden');
        enigmaArea.classList.remove('hidden');
        enigmaText.textContent = currentEnigma.enigma;
        
        // Resetar estado do jogo para novo enigma
        playsRemaining = 3;
        playbackControls.classList.add('hidden');
        answerArea.classList.add('hidden');
        timer.classList.add('hidden');
        playAgainBtn.disabled = false;
        enableNoteButtons(true);
    }

    // Habilitar/desabilitar botões de notas
    function enableNoteButtons(enable) {
        document.querySelectorAll('.note-btn').forEach(btn => {
            btn.disabled = !enable;
        });
    }

    // Eventos para botões de notas
    document.querySelectorAll('.note-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedNotes = parseInt(btn.dataset.notes);
            enableNoteButtons(false); // Desabilitar botões após seleção
            playNotes();
        });
    });

    // Reproduzir notas
    function playNotes() {
        if (!currentEnigma) {
            console.error('Nenhum enigma selecionado');
            return;
        }

        currentAudioPath = `audio/${currentEnigma.id}/${selectedNotes}.mp3`;
        audioPlayer.src = currentAudioPath;
        
        audioPlayer.onerror = () => {
            console.error('Erro ao carregar o arquivo de áudio:', currentAudioPath);
            showFloatingMessage('Erro ao reproduzir o áudio!', false);
        };

        audioPlayer.play().catch(error => {
            console.error('Erro ao reproduzir áudio:', error);
        });

        playbackControls.classList.remove('hidden');
        remainingPlays.textContent = `Você ainda pode ouvir mais ${playsRemaining - 1} vezes`;
    }

    // Reproduzir música completa
    function playFullSong() {
        audioPlayer.src = `audio/${currentEnigma.id}/musica.mp3`;
        audioPlayer.currentTime = 0; // Garantir que a música comece do início
        audioPlayer.play().catch(error => {
            console.error('Erro ao reproduzir música completa:', error);
        });
        // Definir tempo de reprodução para 15 segundos
        clearTimeout(window.songTimeout); // Limpar timeout anterior se existir
        window.songTimeout = setTimeout(() => {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
        }, 15000);
    }

    // Evento para reproduzir novamente
    playAgainBtn.addEventListener('click', () => {
        if (playsRemaining > 1) {
            playsRemaining--;
            audioPlayer.play();
            remainingPlays.textContent = `Você ainda pode ouvir mais ${playsRemaining - 1} vezes`;

            if (playsRemaining === 1) {
                playAgainBtn.disabled = true;
                startTimer();
            }
        }
    });

    // Evento para voltar
    backBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        optionsArea.classList.remove('hidden');
        enigmaArea.classList.add('hidden');
        enableNoteButtons(true);
    });

    // Iniciar timer
    function startTimer() {
        let timeLeft = 30;
        timer.classList.remove('hidden');

        timerInterval = setInterval(() => {
            timeLeft--;
            timerValue.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                handleTimeout();
            }
        }, 1000);
    }

    // Lidar com timeout
    function handleTimeout() {
        const currentPlayer = sessionStorage.getItem('currentPlayer');
        const otherPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
        const otherPlayerScore = parseInt(sessionStorage.getItem(`${otherPlayer}Score`)) + 10;

        sessionStorage.setItem(`${otherPlayer}Score`, otherPlayerScore.toString());
        
        // Restaurar jogador original se necessário
        const tempPlayer = sessionStorage.getItem('tempPlayer');
        if (tempPlayer) {
            sessionStorage.setItem('currentPlayer', tempPlayer);
            sessionStorage.removeItem('tempPlayer');
        } else {
            sessionStorage.setItem('currentPlayer', otherPlayer);
        }

        showFloatingMessage('Tempo esgotado! Pontos para o adversário!', false);
        setTimeout(() => location.reload(), 3000);
    }

    // Evento para botão de resposta
    answerBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        timer.classList.add('hidden');
        answerArea.classList.remove('hidden');
    });

    // Evento para enviar resposta
    submitAnswer.addEventListener('click', () => {
        const answer = answerInput.value.trim().toLowerCase();
        const correctAnswer = currentEnigma.resposta.toLowerCase();

        const currentPlayer = sessionStorage.getItem('currentPlayer');
        const currentScore = parseInt(sessionStorage.getItem(`${currentPlayer}Score`));

        if (answer === correctAnswer) {
            const newScore = currentScore + (selectedNotes * 10);
            sessionStorage.setItem(`${currentPlayer}Score`, newScore.toString());
            showFloatingMessage('Resposta correta! Pontos adicionados!');
            playFullSong(); // Tocar a música completa
        } else {
            const otherPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
            const otherPlayerScore = parseInt(sessionStorage.getItem(`${otherPlayer}Score`)) + 10;
            sessionStorage.setItem(`${otherPlayer}Score`, otherPlayerScore.toString());
            showFloatingMessage('Resposta incorreta! Pontos para o adversário!', false);
            playFullSong(); // Tocar a música completa quando errar
        }

        // Restaurar jogador original se necessário
        const tempPlayer = sessionStorage.getItem('tempPlayer');
        if (tempPlayer) {
            sessionStorage.setItem('currentPlayer', tempPlayer);
            sessionStorage.removeItem('tempPlayer');
        } else {
            // Trocar para o próximo jogador apenas se não houver jogador temporário
            const nextPlayer = currentPlayer === 'player1' ? 'player2' : 'player1';
            sessionStorage.setItem('currentPlayer', nextPlayer);
        }

        // Aguardar a mensagem e a música antes de recarregar (15 segundos para ouvir a música completa)
        setTimeout(() => location.reload(), 15000);
    });

    // Inicializar o jogo
    initGame();
});