const hostname = window.location.hostname === '' ? 'localhost' : window.location.hostname;

document.addEventListener("DOMContentLoaded", function () {
    carregarPlacas();
    carregarPessoas();
    mostrarDiv(event, "pessoas");
});

// Função para tirar uma foto
document.getElementById('snap').addEventListener('click', () => {
    const videoElement = document.getElementById('webcam');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    document.getElementById('webcam-container').style.display = 'none';
    document.getElementById('canvas-container').style.display = 'block';

    // // Parar a transmissão de vídeo
    const stream = videoElement.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
});

// Função para tirar outra foto
document.getElementById('retake').addEventListener('click', () => {
    document.getElementById('canvas-container').style.display = 'none';
    document.getElementById('webcam-container').style.display = 'block';
    startWebcam();
});

// Função para enviar a foto
document.getElementById('upload').addEventListener('click', async () => {
    await adicionarPessoa();
});

function mostrarDiv(event, id) {
    event.preventDefault();
    const divs = document.querySelectorAll('.container');
    divs.forEach(div => div.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

async function startWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoElement = document.getElementById('webcam');
        videoElement.srcObject = stream;
    } catch (error) {
        console.error('Erro ao acessar a webcam: ', error);
        window.location.reload();
    }
}

//#region Pessoas
const API_PESSOAS_URL = `http://${hostname}:3000/pessoas`;

async function carregarPessoas() {
    const response = await fetch(API_PESSOAS_URL);
    const pessoas = await response.json();
    const tabela = document.getElementById('tabelaPessoas');
    tabela.innerHTML = '';
    pessoas.forEach(pessoa => adicionarLinhaTabelaPessoas(pessoa.nome));
}

async function adicionarPessoa() {
    const nome = prompt('Digite o nome da pessoa:');
    if (!nome) return;

    const canvas = document.getElementById('canvas');
    canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('imagem', blob, 'imagem.png');

        try {
            const response = await fetch(`${API_PESSOAS_URL}/${nome}`, {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                console.log('Foto enviada com sucesso!');
            } else {
                console.error('Erro ao enviar a foto:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao enviar a foto:', error);
        }
        finally {
            window.location.reload();
        }
    }, 'image/png');
}

async function editarPessoa(nomeAtual) {
    const novoNome = prompt('Digite o novo nome:', nomeAtual);
    if (!novoNome || novoNome === nomeAtual) return;

    try {
        const response = await fetch(`${API_PESSOAS_URL}/${nomeAtual}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ novoNome })
        });

        if (response.ok) {
            carregarPessoas();
        } else {
            const erro = await response.json();
            alert(`Erro: ${erro.message}`);
        }
    } catch (error) {
        console.error('Erro ao editar pessoa:', error);
    }
}


async function removerPessoa(nome) {
    if (!confirm('Deseja realmente excluir esta pessoa?')) return;

    await fetch(`${API_PESSOAS_URL}/${nome}`, {
        method: 'DELETE'
    });
    carregarPessoas();
}

function adicionarLinhaTabelaPessoas(nome) {
    let tabela = document.getElementById('tabelaPessoas');
    let novaLinha = tabela.insertRow();

    let colunaNome = novaLinha.insertCell(0);
    colunaNome.innerText = nome;

    let colunaAcoes = novaLinha.insertCell(1);

    let btnEditar = document.createElement("button");
    btnEditar.innerText = "Editar";
    btnEditar.classList.add("btn", "blue", "lighten-2", "waves-effect", "waves-light");
    btnEditar.onclick = function () { editarPessoa(nome); };

    let btnRemover = document.createElement("button");
    btnRemover.innerText = "Excluir";
    btnRemover.classList.add("btn", "red", "lighten-2", "waves-effect", "waves-light");
    btnRemover.onclick = function () { removerPessoa(nome); };

    colunaAcoes.appendChild(btnEditar);
    colunaAcoes.appendChild(document.createTextNode(" ")); // Espaço entre os botões
    colunaAcoes.appendChild(btnRemover);
}
//#endregion

//#region Placas
const API_PLACAS_URL = `http://${hostname}:3000/placas`;

async function carregarPlacas() {
    const response = await fetch(API_PLACAS_URL);
    const placas = await response.json();
    const tabela = document.getElementById('tabelaPlacas');
    tabela.innerHTML = '';
    placas.forEach(placa => adicionarLinhaTabelaPlacas(placa));
}

async function adicionarPlaca() {
    const placaInput = document.getElementById('placa');
    const placa = placaInput.value.trim();
    if (!placa) {
        alert('Digite uma placa válida!');
        return;
    }

    await fetch(API_PLACAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placa })
    });
    placaInput.value = '';
    carregarPlacas();
}

async function editarPlaca(placaAntiga) {
    const novaPlaca = prompt('Digite a nova placa:', placaAntiga);
    if (!novaPlaca) return;

    await fetch(`${API_PLACAS_URL}/${placaAntiga}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ novaPlaca })
    });
    carregarPlacas();
}

async function removerPlaca(placa) {
    if (!confirm('Deseja realmente excluir esta placa?')) return;

    await fetch(`${API_PLACAS_URL}/${placa}`, {
        method: 'DELETE'
    });
    carregarPlacas();
}

function adicionarLinhaTabelaPlacas(placa) {
    let tabela = document.getElementById('tabelaPlacas');
    let novaLinha = tabela.insertRow();

    let colunaPlaca = novaLinha.insertCell(0);
    colunaPlaca.innerText = placa;

    let colunaAcoes = novaLinha.insertCell(1);
    let btnEditar = document.createElement("button");
    btnEditar.innerText = "Editar";
    btnEditar.classList.add("btn", "blue", "lighten-2", "waves-effect", "waves-light");
    btnEditar.onclick = function () { editarPlaca(placa); };

    let btnRemover = document.createElement("button");
    btnRemover.innerText = "Excluir";
    btnRemover.classList.add("btn", "red", "lighten-2", "waves-effect", "waves-light");
    btnRemover.onclick = function () { removerPlaca(placa); };

    colunaAcoes.appendChild(btnEditar);
    colunaAcoes.appendChild(document.createTextNode(" "));
    colunaAcoes.appendChild(btnRemover);
}
//#endregion
