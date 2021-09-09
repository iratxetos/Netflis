/* eslint-disable indent */
'use strict';

const searchButton = document.querySelector('.js-search');
const inputSerie = document.querySelector('.js-input');
const seriesContainer = document.querySelector('.js-series-container');

let seriesList = [];

function completeUrl() {
    let userSerie = inputSerie.value.toLowerCase();
    let url = `//api.tvmaze.com/search/shows?q=${userSerie}`;
    return url;
}

// function isValidSerie(serie) {
//     // transformo el texto que ha introducido el usuario a minuscula
//     const filterValue = filterInput.value.toLowerCase();
//     // includes me devuelve un booleano
//     // así que devuelvo lo que devuelve includes,
//     // true si  contiene lo que ha escrito el usuario en el input false sino está incluido
//     return serie.name.toLowerCase().includes(filterValue);
//     console.log(isValidSerie(serie));
// }

function getASerie(ev) {
    let url = completeUrl();
    //let url = 'https://api.tvmaze.com/search/shows?q=girls';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let series = data;

            for (let serie of series) {

                let foto = serie.show.image;
                let seriesContent = '';
                if (foto === null) {

                    seriesContent = `<li><img src="https://via.placeholder.com/210x295/ffffff/666666/?text=TV"/> ${serie.show.name}</li>`;
                    seriesList += seriesContent;

                } else {
                    seriesContent = `<li><img src="${serie.show.image.original}"/> ${serie.show.name}</li>`;
                    seriesList += seriesContent;

                }

            }
        });

    ev.preventDefault();
    seriesContainer.innerHTML = seriesList;

}

searchButton.addEventListener('click', getASerie);