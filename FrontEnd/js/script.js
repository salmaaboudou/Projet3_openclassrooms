//Créer les balises figure, img et figcaption en js et stocker ça dans variables
let figureElement  = document.createElement("figure");
let imageElement   = document.createElement("img");
let captionElement = document.createElement("figcaption");
let gallery        = document.querySelector(".gallery");


// Ajouter l'image et le figcaption à l'élément de figure
figureElement.appendChild(imageElement);
figureElement.appendChild(captionElement);


function getAllWorks(){
    const urlGetWorks = "http://localhost:5678/api/works" ;
    fetch(urlGetWorks)
    .then((response) => response.json())
    .then((works) => {
        console.log(works);
        for(let i = 0; i < works.length; i++) {   

            imageElement[i].setAttribute('src', works[i].imageUrl);
            console.log(imageElement);
            captionElement.setAttribute('alt', works[i].title);
            captionElement.textContent = works[i].title;
        };
    
    })
    .catch((error) => {

    });

    gallery.appendChild(figureElement);
}

getAllWorks();

