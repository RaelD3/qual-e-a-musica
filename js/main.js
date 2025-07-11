document.addEventListener('DOMContentLoaded', () => {
    const startGameBtn = document.getElementById('startGame');
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');

    // Função para carregar enigmas
    async function loadEnigmas() {
        try {
            console.log('Tentando carregar enigmas na página inicial...');
            const response = await fetch('data/enigmas.txt');
            console.log('Resposta do fetch:', response);
            
            if (!response.ok) {
                throw new Error(`Erro ao carregar o arquivo de enigmas: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.text();
            console.log('Dados carregados:', data);
            
            const enigmas = data.split('\n')
                .filter(line => line.trim())
                .map(line => {
                    console.log('Processando linha:', line);
                    const parts = line.split('|').map(part => part.trim());
                    if (parts.length !== 3) {
                        console.error('Formato inválido de enigma:', line);
                        return null;
                    }
                    return {
                        id: parts[0].padStart(2, '0'), // Garante que o ID tenha sempre 2 dígitos
                        enigma: parts[1],
                        resposta: parts[2]
                    };
                })
                .filter(enigma => enigma !== null);

            if (enigmas.length === 0) {
                throw new Error('Nenhum enigma encontrado no arquivo');
            }

            console.log('Enigmas processados:', enigmas);
            sessionStorage.setItem('enigmas', JSON.stringify(enigmas));
            return true;
        } catch (error) {
            console.error('Erro detalhado ao carregar enigmas:', error);
            alert(`Erro ao carregar os enigmas: ${error.message}`);
            return false;
        }
    }

    startGameBtn.addEventListener('click', async () => {
        const player1Name = player1Input.value.trim();
        const player2Name = player2Input.value.trim();

        if (!player1Name || !player2Name) {
            alert('Por favor, insira o nome dos dois jogadores!');
            return;
        }

        // Carregar enigmas antes de iniciar o jogo
        const enigmasLoaded = await loadEnigmas();
        if (!enigmasLoaded) {
            return;
        }

        // Salvar nomes dos jogadores no sessionStorage
        sessionStorage.setItem('player1', player1Name);
        sessionStorage.setItem('player2', player2Name);
        sessionStorage.setItem('player1Score', '0');
        sessionStorage.setItem('player2Score', '0');
        sessionStorage.setItem('currentPlayer', 'player1');

        // Redirecionar para a página do jogo
        window.location.href = 'game.html';
    });
});