document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('agenda-form');
    const listaCompromissos = document.getElementById('lista-compromissos');

    // Carrega os compromissos do localStorage ao iniciar
    carregarCompromissos();

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Impede o recarregamento da página

        const novoCompromisso = {
            id: Date.now(),
            data: document.getElementById('data').value,
            hora: document.getElementById('hora').value,
            tipo: document.getElementById('tipo').value,
            cliente: document.getElementById('nome-cliente').value,
            empresa: document.getElementById('nome-empresa').value,
            detalhes: document.getElementById('detalhes').value,
            concluido: false
        };

        adicionarCompromissoDOM(novoCompromisso);
        salvarNoLocalStorage(novoCompromisso);
        form.reset();
    });

    function adicionarCompromissoDOM(compromisso) {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('compromisso-item', compromisso.tipo);
        if (compromisso.concluido) {
            itemDiv.classList.add('concluido');
        }
        itemDiv.setAttribute('data-id', compromisso.id);

        const dataFormatada = new Date(compromisso.data + 'T00:00:00').toLocaleDateString('pt-BR');

        itemDiv.innerHTML = `
            <div class="compromisso-header">
                <div class="compromisso-info">
                    <h3>${compromisso.tipo} - ${compromisso.empresa}</h3>
                    <span>${dataFormatada} às ${compromisso.hora}</span>
                </div>
                <div class="compromisso-acoes">
                    <button class="btn-concluir" title="Marcar como Concluído">✔️</button>
                    <button class="btn-excluir" title="Excluir Compromisso">🗑️</button>
                </div>
            </div>
            <div class="compromisso-body">
                <p><strong>Cliente:</strong> ${compromisso.cliente}</p>
                ${compromisso.detalhes ? `<div class="compromisso-detalhes">${compromisso.detalhes}</div>` : ''}
            </div>
        `;

        listaCompromissos.appendChild(itemDiv);

        // Adiciona os event listeners para os botões do novo item
        itemDiv.querySelector('.btn-concluir').addEventListener('click', () => toggleConcluido(compromisso.id));
        itemDiv.querySelector('.btn-excluir').addEventListener('click', () => excluirCompromisso(compromisso.id));
    }

    function getCompromissos() {
        return JSON.parse(localStorage.getItem('compromissos')) || [];
    }

    function salvarNoLocalStorage(compromisso) {
        const compromissos = getCompromissos();
        compromissos.push(compromisso);
        localStorage.setItem('compromissos', JSON.stringify(compromissos));
    }

    function carregarCompromissos() {
        const compromissos = getCompromissos();
        // Ordena por data antes de exibir
        compromissos.sort((a, b) => new Date(a.data) - new Date(b.data));
        compromissos.forEach(compromisso => adicionarCompromissoDOM(compromisso));
    }

    function toggleConcluido(id) {
        const compromissos = getCompromissos();
        const compromisso = compromissos.find(c => c.id === id);
        if (compromisso) {
            compromisso.concluido = !compromisso.concluido;
            localStorage.setItem('compromissos', JSON.stringify(compromissos));
            
            // Atualiza a interface
            const itemDOM = document.querySelector(`[data-id='${id}']`);
            itemDOM.classList.toggle('concluido');
        }
    }

    function excluirCompromisso(id) {
        if (confirm('Tem certeza que deseja excluir este compromisso?')) {
            let compromissos = getCompromissos();
            compromissos = compromissos.filter(c => c.id !== id);
            localStorage.setItem('compromissos', JSON.stringify(compromissos));

            // Remove da interface
            const itemDOM = document.querySelector(`[data-id='${id}']`);
            itemDOM.remove();
        }
    }
});