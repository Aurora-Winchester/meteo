let lat; // on définit la variable latitude 
let long; // on définit la variable longitude
let ville = "Lannion"; // par défault on regarde la météo de Lannion
let intervalId;


window.addEventListener("DOMContentLoaded",init); 
//on attend que le DOM soit chargé pour lancer la fonction init



function init(){
    //Recherche de ville
    button_elt = document.getElementById('seachbutton'); //on récupère l'élément bouton
    button_elt.addEventListener('click', search_ville); //à chaque fois qu'on clique sur le bouton, on appelle la fonction search_ville

    //Récupère la latitude et la longitude et renvoie les données météo associé à la ville
	init_coord(ville); 
    
}


function search_ville(){//permet de changer la ville
    clearInterval(intervalId); //on arrête les requêtes api en boucle du setInterval de la ville précédente
    ville = document.getElementById('searchbar').value; //on récupère le nom de la ville tapé par l'utilisateur
	init_coord(ville); //on initialise la latitude et la longitude selon la ville
}

function init_coord(ville){
	let apiGOUV = "https://api-adresse.data.gouv.fr/search/?q="+ville+"&limit=1&autocomplete=0"; //adresse api
	fetch(apiGOUV) //requête api
				.then((response)=> {return response.json()}) //convertit l'objet récupéré sous forme de tableau jason
				.then((data)=> {
					lat = data.features[0].geometry.coordinates[1]; //on récupère la latitude
					long = data.features[0].geometry.coordinates[0]; //on récupère la longitude
                    req_api_meteo();
                    intervalId = setInterval(req_api_meteo,5000); //toutes les 5s les données météo sont mises à jour
				})
}


function req_api_meteo(){//on utilise l'API meteo
    let apiURL = "https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+long+"&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m";//adresse de l'api meteo
    fetch(apiURL) //requête api
    .then((response)=> {return response.json()}) //convertit l'objet récupéré sous forme de tableau json
    .then((data)=> {mise_en_forme(data) //fonction qui va lier le tablrau jason et le html
    })
}



function mise_en_forme(data){
    //On récupère les données du tableau de jason
	let time = data.current_weather.time; //date de la météo
	let tmp = data.current_weather.temperature; //température
	let code = data.current_weather.weathercode; //code de la météo
    let vit_vent = data.current_weather.windspeed; //vitesse du vent
	let dir_vent = data.current_weather.winddirection; //direction du vent

    //On modifie les div de html selon les Id
    nom_ville_elt = document.getElementById("nom_ville");
    nom_ville_elt.textContent = ville[0].toUpperCase() + ville.slice(1); //met la première lettre de la ville en majuscule
    tmp_elt = document.getElementById("temperature");
    tmp_elt.textContent = tmp+"°";
    date_elt = document.getElementById("date");
    date_elt.textContent = time[8]+time[9]+"/"+time[5]+time[6]+"/"+time[0]+time[1]+time[2]+time[3];
    vit_vent_elt = document.getElementById("vit_vent");
    vit_vent_elt.textContent = "Vitesse du vent : " +vit_vent+" km/h";
    dir_vent_elt = document.getElementById("dir_vent");
    dir_vent_elt.textContent = "Direction du vent : "+dir_vent+"°";
    code_elt = document.getElementById("code");
    code_elt.textContent = "Code météo : " +code;
    code_trad_elt = document.getElementById("code_trad");
    code_trad_elt.textContent = intrepretation_code_meteo(code); //on traduit le numéro du code de météo en texte
}



function intrepretation_code_meteo(code){
    switch (code){
        case 0 : return "Ciel clair";
                 break;
        case 1 : return "Plutôt dégagé, partiellement nuageux et couvert";
                 break;
        case 2 : return "Plutôt dégagé, partiellement nuageux et couvert";
                 break;
        case 3 : return "Plutôt dégagé, partiellement nuageux et couvert";
                 break;
        case 45 : return "Brouillard et dépôt de brouillard givré";
                  break;
        case 48 : return "Brouillard et dépôt de brouillard givré";
                  break;
        case 51 : return "Bruine : Intensité légère";
                  break;
        case 53 : return "Bruine : Intensité modérée";
                  break;
        case 55 : return "Bruine : Intensité dense";
                  break;
        case 56 : return "Bruine verglaçante : Intensité légère";
                  break;
        case 57 : return "Bruine verglaçante : Intensité dense";
                  break;
        case 61 : return "Pluie : Intensité faible";
                  break;
        case 63 : return "Pluie : Intensité modérée";
                  break;
        case 65 : return "Pluie : Intensité forte";
                  break;
        case 66 : return "Pluie verglaçante : Intensité légère";
                  break;
        case 67 : return "Pluie verglaçante : Intensité forte";
                  break;
        case 71 : return "Chute de neige : Intensité légère";
                  break;
        case 73 : return "Chute de neige : Intensité modérée";
                  break;
        case 75 : return "Chute de neige : Intensité forte";
                  break;
        case 77 : return "Grains de neige";
                  break;
        case 80 : return "Averses de pluie : légères";
                  break;
        case 81 : return "Averses de pluie : modérées";
                  break;
        case 82 : return "Averses de pluie : violentes";
                  break;
        case 85 : return "Averses de neige légères";
                  break;
        case 86 : return "Averses de neige fortes";
                  break;
        case 95 : return "Orage : Léger ou modéré";
                  break;
        case 96 : return "Orage avec grêle légère";
                  break;
        case 99 : return "Orage avec grêle forte";
                  break;   
        default : return ""
                  break;
    }
}

