const divList = document.querySelector('#divList');
const ul = document.querySelector('#ul');
const inputItem = document.querySelector('#inputItem');
const addButton = document.querySelector('#addButton');
const totalCompras = document.querySelector('#totalCompras');
let valorAtual = 0;
let arrayItens;

// Adiciona um novo item através do botão Adicionar

addButton.addEventListener('click', function () {
    if (inputItem.value === '') {
        alert('Favor digitar o nome do item');
    } else {
        inserirItem(inputItem.value, false, 0);
        arrayItens.push({ 'Item': inputItem.value, 'checked': false, 'Valor': 0 })
        inputItem.value = '';
        localStorage.setItem('logItens', JSON.stringify(arrayItens));
    }
});

// Insere um novo item

function inserirItem(itemNome, itemCheckbox, itemValor) {
    const li = document.createElement('li');
    const texto = document.createElement('span')
    const buttonDel = document.createElement('button');
    const checkbox = document.createElement('input');
    const valorItem = document.createElement('span');

    valorItem.innerText = Number(itemValor);
    valorItem.className = 'valorItem';
    valorItem.style.display = 'none';

    texto.className = 'texto';
    texto.innerText = itemNome;

    buttonDel.innerText = '🗑️';
    buttonDel.className = 'buttonDel';
    buttonDel.addEventListener("click", (e) => {
        e.target.parentElement.remove()
        atualizarListaLocalStorage()
        atualizaValor(0, 'itemRemovido');
    });

    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    if (itemCheckbox === true) {
        checkbox.setAttribute('checked', true);
        texto.style.textDecoration = 'line-through';
        texto.style.color = '#bfddff';
    }

    checkbox.addEventListener("change", (e) => {

        if (checkbox.checked) {
            const popup = document.createElement('div');
            popup.className = 'popup';

            const textoPopup = document.createElement('span');
            textoPopup.className = 'textoPopup';
            textoPopup.innerText += `Insira o valor do produto ${texto.innerText}:`;

            const imputValor = document.createElement('input');
            imputValor.type = 'number';
            imputValor.className = 'imputValor';
            imputValor.placeholder = 'Ex. 10,50';

            const valueButton = document.createElement('button');
            valueButton.className = 'valueButton';
            valueButton.type = 'submit';
            valueButton.title = 'Ao clicar no botão "Enviar" o valor digitado será adicionado ao valor total';
            valueButton.innerText = 'Enviar';

            const gifApi = document.createElement('img');
            gifApi.className = 'gif';
            obterDadosApi(gifApi, texto.innerText);


            valueButton.addEventListener('click', function () {
                valorItem.innerText = Number(imputValor.value);
                atualizaValor(Number(imputValor.value.replace(",", ".")), 'soma');
                imputValor.value = '';
                popup.style.visibility = 'hidden';
                atualizarListaLocalStorage()
                document.getElementsByClassName("popup")[0].remove();
            });

            li.append(popup)
            popup.append(textoPopup)
            popup.append(imputValor)
            popup.append(gifApi)
            popup.append(valueButton)

            texto.style.textDecoration = 'line-through';
            texto.style.color = '#bfddff';

            popup.style.visibility = 'visible';

        } else {
            texto.style.textDecoration = 'none';
            texto.style.color = '#ffffff';
            atualizaValor(Number(valorItem.innerText), 'subtração');

            valorItem.innerText = 0;
            atualizarListaLocalStorage()
        }
    });
    ul.append(li);
    li.append(checkbox);
    li.append(texto);
    li.append(valorItem);
    li.append(buttonDel);
}

// função para obter o gif da API conforme item escolhido

async function obterDadosApi(gifApi, textoItem) {
    try {
        const api = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=dpPu1kIHwa3fxoQiH9lzTfmUkMgEjtuS&q=${textoItem}`)
        const dados = await api.json();
        const gifUrl = dados.data[0].images.downsized.url;
        gifApi.src = gifUrl;
    } catch (error) {
        console.log('Erro encontrado: ', error);
    }
}

// função para atualizar os dados no local storage

function atualizarListaLocalStorage() {
    arrayItens = [];
    const arraySpan = document.querySelectorAll('.texto')
    const arrayValorItem = document.querySelectorAll('.valorItem')
    const arraycheck = document.querySelectorAll('.checkbox')
    for (let i = 0; i < arraySpan.length; i++) {
        arrayItens.push({ 'Item': arraySpan[i].innerText, 'checked': arraycheck[i].checked, 'Valor': Number(arrayValorItem[i].innerText) })
    }
    localStorage.setItem('logItens', JSON.stringify(arrayItens));
}

// função para calcular o valor da lista

function atualizaValor(valorInformado, operacao) {
    let valorSalvo = Number(localStorage.getItem('valorSalvo'));

    if (operacao === 'soma') {
        valorAtual = valorSalvo + valorInformado;
    } else if (operacao === 'subtração') {
        valorAtual = valorSalvo - valorInformado;
    } else if (operacao === 'itemRemovido') {
        arrayItens = JSON.parse(localStorage.getItem('logItens'));
        if (arrayItens === null) {
            valorAtual = 0;
        } else {
            let valorEmMemoria = 0;
            arrayItens.forEach(item => {
                valorEmMemoria += item.Valor;
            });
            valorAtual = valorEmMemoria;
        }
    }

    const valorEmReal = valorAtual.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    totalCompras.innerText = valorEmReal;
    localStorage.setItem('valorSalvo', valorAtual);
}

// função criada para resgatar os dados ao abrir a página

function iniciar() {

    //esta parte atualiza o valor total
    let valorSalvo = Number(localStorage.getItem('valorSalvo'));
    valorAtual = valorSalvo;
    const valorEmReal = valorSalvo.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
    totalCompras.innerText = valorEmReal;

    // esta parte atualiza a lista de itens
    arrayItens = JSON.parse(localStorage.getItem('logItens'));

    if (arrayItens === null) {
        arrayItens = [];
    } else {
        arrayItens.forEach(item => {
            inserirItem(item.Item, item.checked, item.Valor)
        });
    }
}

iniciar();