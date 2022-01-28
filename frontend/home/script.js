const alerta = document.querySelector("#alerta");
const cadastrar = document.querySelector("#cadastrar");

var map;
var seuAlerta;

 function initMap() {
    map = new google.maps.Map(document.querySelector(".map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 18,
      });

      map.addListener("click", (data) => {
          let coord = { lat: data.latLng.lat(), lng: data.latLng.lng() };

          //addMarker(coord, "Teste", "../assets/radar.png")
          seuAlerta = coord

          alerta.hidden = false;
          
          cadastrar.hidden = false;
      });

      navigator.geolocation.getCurrentPosition((location) => {
        let coord = { lat: location.coords.latitude, lng: location.coords.longitude };

        map.setCenter(coord);

        addMarker(coord, "Minha Localizacao", "../assets/radar.png");
      });
 }

 function cadastro() {
  let data = JSON.stringify({
      "id_user": 1,
      "id_alerta": alerta.value,
      "coordenadas": seuAlerta.lat + "," + seuAlerta.lng,
      "ativo": true,
  });

   fetch("http://localhost:3000/localizacao", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: data

   })
   .then(resp => { return resp.json() })
   .then(data => {
      if(data.id != undefined) {
        let tipo = alerta.value;
        addMarker(seuAlerta, tipo, "../assets/destination.png");
        alerta.hidden = true;
        cadastrar.hidden = true;
      } else {
        alert("Não foi possível informar o alerta");
      }
   })
 }

 function inicializar() {
   carregarMarcacoes();
   carregarAlertas();
 }

 function addMarker(coord, title, image) {
    new google.maps.Marker({
        position: coord,
        map: map,
        title: title,
        icon: image
      });
 }

 function carregarMarcacoes() {
   fetch("http://localhost:3000/localizacao")
   .then( resp => { return resp.json()})
   .then(data => {
     data.forEach(localizacao => {
        //localizacao.coordenadas => '-22.702155383462557,-46.99188606123809'
        let coordenadas = localizacao.coordenadas.split(',');
        let coord = { lat: Number(coordenadas[0]), lng: Number(coordenadas[1]) };

        addMarker(coord, localizacao.alertum.tipo, "../assets/destination.png");
     });
   })
 }

 function carregarAlertas() {
   fetch("http://localhost:3000/alerta")
   .then(resp => { return resp.json()})
   .then(data => {
     data.forEach(alert => {
       let op = document.createElement("option");
       op.value = alert.id;
       op.innerHTML = alert.tipo;
       alerta.appendChild(op);
     })
   })
 }