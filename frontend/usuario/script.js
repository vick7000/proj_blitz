const visualizacao = document.querySelector('#alerts');
const tbody = document.querySelector("tbody");
const imgUser = document.querySelector("#imgUser");
const emailUser = document.querySelector("#emailUser");

const camera = document.querySelector("#camera");
const foto = document.querySelector("#foto");

const dataUser = JSON.parse(localStorage.getItem('userdata'));

var imagem = ""

camera.addEventListener("click", () => {
    foto.click();
});

foto.addEventListener("change", (e) => {
    let file = e.target.files[0];

    let reader = new FileReader();

    reader.onload = (data) => {
        //console.log(data.target.result);
        imagem = data.target.result;
        imgUser.src = imagem;
    }
    reader.readAsDataURL(file);
})

function load() {
    carregarAlertas();
    carregarNOSSOSAlertas();
    carregarDados();
}

function carregarNOSSOSAlertas() {
    let idUser = dataUser.id;

    fetch("http://localhost:3000/localizacao?id_user="+idUser)
    .then(resp => { return resp.json();})
    .then(data => {
        data.forEach(local => {
            let tr = document.createElement('tr');

            let tdId = document.createElement('td'); 
            let tdCoord = document.createElement('td'); 
            let tdTipo = document.createElement('td'); 

            tdId.innerHTML = local.id;
            tdCoord.innerHTML = local.coordenadas;
            tdCoord.style.maxWidth = "200px";
            tdCoord.style.wordBreak = "break-word";
            tdTipo.innerHTML = local.alertum.tipo;

            tr.appendChild(tdId);
            tr.appendChild(tdCoord);
            tr.appendChild(tdTipo);

            tbody.appendChild(tr);
        })
    })
}

function carregarAlertas() {
    fetch("http://localhost:3000/alerta")
    .then(resp => { return resp.json(); })
    .then(data => {
        data.forEach(alerta => {
            let label = document.createElement("label");
            let checkbox = document.createElement("input");
            let meualerta = document.createElement("div");

            label.innerHTML = alerta.tipo;
            label.for = alerta.id;

            checkbox.type = "checkbox";
            checkbox.name = alerta.id;
            checkbox.checked = true;

            meualerta.appendChild(checkbox);
            meualerta.appendChild(label);
            visualizacao.appendChild(meualerta);
        })
    })
}

function carregarDados() {
    imgUser.src = (dataUser.foto !== "") ? dataUser.foto : '../assets/programmer.png';
    emailUser.value = dataUser.email;
}

function atualizarDados() {
    let data = {};

    if(pswUser.value !== "") data.senha = md5(pswUser.value);
    if(emailUser.value !== dataUser.email) data.email = emailUser.value;
    if(imgUser.src !== dataUser.foto) data.foto = imgUser.src;

    fetch("http://localhost:3000/usuario/" + dataUser.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(resp => { return resp.json() })
    .then(data => {
        if(data.length > 0) {
            localStorage.setItem('userdata', JSON.stringify(data[0]));
            window.location.reload();
        } else {
            alert("Não foi possível atualizar os dados");
        }
    })
}

function mostrarNOSSOSAlertas(e) {
    e.classList.toggle("up");
    e.parentNode.parentNode.classList.toggle("show");
}