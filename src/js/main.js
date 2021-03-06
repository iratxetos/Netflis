/* eslint-disable no-console */
/* eslint-disable indent */
'use strict';

//VARIABLE BOTON BUSCAR
const searchButton = document.querySelector('.js-search');
//VARIABLE ESCRITA POR EL USER
const inputSerie = document.querySelector('.js-input');
//VARIABLE UL SERIES
const seriesContainer = document.querySelector('.js-series-container');
//VARIABLE UL FAVORITOS
const seriesFavoriteContainer = document.querySelector('.js-favorites__container');
//VARIABLE BOTON RESET FAVORITOS
const resetButton = document.querySelector('.js-reset');
//VARIABLE BOTON INDIVIDUAL DE ELIMINAR FAVORITOS
// const deleteFav = document.querySelector('.js-icon');
//const logButton = document.querySelector('.favorites-log');


//ARRAISES DE SERIES Y SERIES FAVORITAS
let series = [];
let favorites = [];


//STORAGE - GET:NADA MÁS CARGAR LA PÁGINA GUARDA LOS DATOS QUE TENGAN EN FAVORITOS
function getFavs() {
    if (localStorage.getItem('favorite-serie') !== null) {
        getInLocalStorage();
    }
}
getFavs();
//MUESTRA O ELIMINA EL BOTON RESET
function showReset() {
    if (favorites !== []) {
        resetButton.classList.remove('hidden');
    } else {
        resetButton.classList.add('hidden');
    }
}
showReset();

//CREA - URL
function completeUrl() {
    let userSerie = inputSerie.value.toLowerCase();
    let url = `//api.tvmaze.com/search/shows?q=${userSerie}`;
    return url;
}

//FETCH - RECOGER DATA DE API
function getFromApi(ev) {
    let url = completeUrl();
    //let url = 'https://api.tvmaze.com/search/shows?q=girls';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            series = data;
            showSeriesList();

        });

    ev.preventDefault();
}

//MUESTRA - SERIES
function showSeriesList() {
    seriesContainer.innerHTML = '';
    let favClass = '';

    for (let serie of series) {
        let photo = serie.show.image;
        if (photo === null) {
            photo = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
        } else {
            photo = photo.original;
        }
        if (isFavorite === true) {
            favClass = 'favorite-serie';
        } else {
            favClass = '';
        }

        let time = serie.show.schedule.time;
        if (time === '') {
            time = 'no available';
        } else {
            time = serie.show.schedule.time;
        }

        seriesContainer.innerHTML += `<li class="series-container__series js-serie ${favClass}" id="${serie.show.id}"><img class="series-container__series--img" src="${photo}"/><h4 class="series-container__series--time"> ${time}</h4><h3 class="series-container__series--name">${serie.show.name}</h3></li>`;
    }

    //ESCUCHO EVENTO CLICK SOBRE SERIE
    listenSeries();
    listenFavorites();
    listenDeleteIcons();
}

//SUMA - SERIES FAVORITAS
function handleFavorite(ev) {
    const selectedSerie = parseInt(ev.currentTarget.id);
    //DEVUELVE EL PRIMER ELEMENTO QUE CUMPLA LA CONDICION EN EL ARRAY
    const objetClicked = series.find((serie) => {
        return serie.show.id === selectedSerie;
    });

    //DEVUELVE LA POSICIÓN DEL PRIMER ELEMENTO QUE CUMPLA LA CONDICION EN EL ARRAY
    const favoritesFound = favorites.findIndex((fav) => {
        return fav.show.id === selectedSerie;

    }); if (favoritesFound === -1) {
        favorites.push(objetClicked);

    } else {
        favorites.splice(favoritesFound, 1);
    }

    // AL MODIFICAR ARRAYS DE SERIES Y FAVOS TENGO QUE PINTAR Y ESCUCHAR EVENTOS
    setInLocalStorage();
    showSeriesList();
    showSeriesFavorites();

}

//VERIFICA - SERIES FAVORITAS
function isFavorite(serie) {
    const favoriteFound = favorites.find((fav) => {
        return fav.show.id === serie.show.id;
    });
    if (favoriteFound === undefined) {
        return false;
    }
    else {
        return true;
    }
}

//ELIMINA - SERIES FAVORITAS
function resetFavorites(ev) {
    favorites = [];
    showSeriesFavorites();
    ev.preventDefault();
    showSeriesList();
    //STORAGE - CLEAR: VACÍA LOCAL STORAGE
    localStorage.clear();
    showReset();
}

//MUESTRA - SERIES FAVORITAS
function showSeriesFavorites() {
    listenSeries();
    let serieFavorite = '';
    for (let favorite of favorites) {
        let photo = favorite.show.image;
        if (photo === null) {
            photo = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
        } else {
            photo = photo.original;
        }
        serieFavorite += `<li class="favorites__container--favseries  js-seriefavorite" id="${favorite.show.id}"><img class="favorites-img"  src="${photo}"/><h3 class="favorites-name">${favorite.show.name}</h3><i class="fas fa-trash-alt js-icon id="${favorite.show.id}"></i></li>`;
    }
    seriesFavoriteContainer.innerHTML = serieFavorite;

    //OCULTA LAS SECCIÓN DE SERIES FAVORITAS EN CASO DE NO HABERLAS
    if (favorites.length === (0)) {
        seriesFavoriteContainer.classList.add('hidden');
    } else {
        seriesFavoriteContainer.classList.remove('hidden');
    }
    listenFavorites();
    listenDeleteIcons();
    setInLocalStorage();
}

//STORAGE - SET: GUARDAR DATA DE USUARIO
function setInLocalStorage() {
    //CONVERTIMOS DE OBJETO A CADENA
    const stringSeries = JSON.stringify(favorites);
    localStorage.setItem('favorite-serie', stringSeries);
}

//STORERAGE - GET: RECUPERAR DATA DE USUARIO
function getInLocalStorage() {
    //CONVERTIMOS DE UNA CADENA A UN OBJETO
    favorites = JSON.parse(localStorage.getItem('favorite-serie'));
    showSeriesFavorites();
}

//EVENTO -> BUSCADOR
searchButton.addEventListener('click', getFromApi);


//EVENTO -> CLICK EN CADA SERIE LISTADA
function listenSeries() {
    let listSeries = document.querySelectorAll('.js-serie');
    for (const serieEl of listSeries) {
        serieEl.addEventListener('click', handleFavorite);
    }
}

//*ENTREVISTA TÉCNICA
//  function showLog() {
//   for (let serie of series) {
//         console.log(`${serie.show.name}`);
//     }
// }

// logButton.addEventListener('click', showLog);


//EVENTO -> RESET FAVORITOS
resetButton.addEventListener('click', resetFavorites);

//EVENTO -> ESCUCHA EL CLICK SOBRE SERIE FAVORITA INDIVIDUAL
function listenFavorites() {
    let deleteFavs = document.querySelectorAll('.js-seriefavorite');
    for (const deleteFav of deleteFavs) {
        deleteFav.addEventListener('click', deleteFavorite);
    }
}

//ELIMINA EL FAVORITO DEL ARRAY Y DE LA VISTA
function deleteFavorite(ev) {
    let selectedFavoriteCard = (ev.currentTarget);
    let selectedFavorite = (ev.currentTarget.id);

    const objetClicked = favorites.find((favorite) => {
        return favorite.show.id === selectedFavorite;
    });

    const favoritesFound = favorites.findIndex((fav) => {
        return fav.show.id === selectedFavorite;
    }); if (favoritesFound === -1) {
        favorites.splice(favoritesFound, 1);
    } else {
        favorites.push(objetClicked);
    }
    selectedFavoriteCard.classList.toggle('hidden');
    setInLocalStorage();
}

function listenDeleteIcons() {
    let deleteIcons = document.querySelectorAll('.js-icon');
    for (const deleteIcon of deleteIcons) {
        deleteIcon.addEventListener('click', deleteFavorite);

    }
}


listenDeleteIcons();
listenFavorites();

