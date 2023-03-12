// Récupération de tous les travaux

function getAllWorks() {
    const urlGetWorks = "http://localhost:5678/api/works";
    let gallery = document.querySelector(".gallery");
    fetch(urlGetWorks)
        .then((response) => response.json())
        .then((works) => {
            for (let i = 0; i < works.length; i++) {
                // Création des balises figure, img et figcaption
                let figureElement = document.createElement("figure");
                let imageElement = document.createElement("img");
                let captionElement = document.createElement("figcaption");

                // Ajout des attributs src , alt et title provenant de l'api aux balises
                imageElement.setAttribute("src", works[i].imageUrl);
                captionElement.setAttribute("alt", works[i].title);
                captionElement.textContent = works[i].title;

                // Ajout de l'image et de la caption à l'élément figure
                figureElement.appendChild(imageElement);
                figureElement.appendChild(captionElement);

                // Ajout de la figure au body au niveau de la div gallery
                gallery.appendChild(figureElement);
            }
        })
        .catch((error) => {

        });
}

getAllWorks();



