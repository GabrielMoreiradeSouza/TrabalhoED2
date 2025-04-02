let results = [];

const totalArquivos = 67;
const arquivos = Array.from({ length: totalArquivos }, (_, i) => {
    const numero = (i + 1).toString().padStart(2, '0');
    return `arquivos-busca/arq${numero}.txt`;
});

// Carrega os arquivos .txt
Promise.all(
    arquivos.map(arquivo =>
        fetch(arquivo)
            .then(res => res.text())
            .then(conteudo => ({ conteudo }))
    )
).then(data => {
    results = data;
});

function showSuggestions(query) {
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = '';

    if (query.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }

    const filteredResults = results.filter(result =>
        result.conteudo.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredResults.length > 0) {
        filteredResults.forEach(result => {
            const div = document.createElement('div');
            div.classList.add('suggestion');

            const index = result.conteudo.toLowerCase().indexOf(query.toLowerCase());
            const trechoCru = result.conteudo.substring(Math.max(0, index - 50), index + 100);
            const trechoComDestaque = trechoCru.replace(
                new RegExp(query, 'gi'),
                match => `<mark>${match}</mark>`
            );

            div.innerHTML = `<small>${trechoComDestaque}...</small>`;
            div.onclick = () => {
                document.getElementById('search').value = query;
                suggestionsContainer.style.display = 'none';
                mostrarConteudoCompleto(result.conteudo);
            };
            suggestionsContainer.appendChild(div);
        });
        suggestionsContainer.style.display = 'block';
    } else {
        suggestionsContainer.style.display = 'none';
    }
}

function mostrarConteudoCompleto(conteudo) {
    const container = document.getElementById('resultado-completo');
    container.innerHTML = `
        <pre style="white-space: pre-wrap; font-family: inherit;">${conteudo}</pre>
    `;
    container.style.display = 'block';
}
