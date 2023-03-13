
/*=============================================
= Récupération des travaux & des catégories   =
=============================================*/

function getAllWorksAndCategories() {
    const urlGet = "http://localhost:5678/api/works";
    const gallery = document.querySelector(".gallery");
    const categories = document.querySelector(".categories");
    const setCategoriesName = new Set();
    fetch(urlGet)
        .then((response) => response.json())
        .then((works) => {
            //console.log(works);

            /*----------  Travaux  ----------*/

            for (let i = 0; i < works.length; i++) {
                // Création des balises figures, img et figcaptions
                const figureElement = document.createElement("figure");
                const imageElement = document.createElement("img");
                const captionElement = document.createElement("figcaption");

                // Ajout des attributs src , alt, titres, class aux balises
                imageElement.setAttribute("src", works[i].imageUrl);
                imageElement.setAttribute("alt", works[i].title);
                figureElement.setAttribute("class","figure-element");
                captionElement.textContent = works[i].title;

                // Ajout de l'image et de la caption à l'élément figure
                figureElement.appendChild(imageElement);
                figureElement.appendChild(captionElement);

                // Ajout de la figure au body au niveau de la div gallery
                gallery.appendChild(figureElement);

                // Création d'un set (objet) contenant les noms des catégories
                setCategoriesName.add(works[i].category.name);

            }


            /*----------  Catégories  ----------*/

            setCategoriesName.forEach((name) => {

                // Création des boutons filtres pour chaque categorie
                const filterBtn = document.createElement("button");

                // Ajout du nom des catégories, d'un id, et d'une class aux les boutons
                filterBtn.textContent = name;
                filterBtn.setAttribute("id", name.replace(/\s+/g, "-")); // remplace les espaces par des tirets
                filterBtn.setAttribute("class", "filter__btn");

                // Ajout des boutons filtres au niveau de la balise "categories"
                categories.appendChild(filterBtn);

            });

            /*----------  Fonction filtre  ----------*/
            
            const allFilterBtns = document.querySelectorAll(".filter__btn");
            const figureElements = document.querySelectorAll(".figure-element");

            allFilterBtns.forEach((btn) => {

                btn.addEventListener("click", () => {
                    
                    allFilterBtns.forEach((btn) => {

                        // Supprimez la classe "active" de tous les boutons filtre
                        btn.classList.remove("active");

                    })
                    // Ajoutez la classe "active" au boutons filtre sélectionné
                    btn.classList.add("active");

                    // filtrer les figures pour chaque catégories 
                    figureElements.forEach((figure, index) => {
                        //console.log(index)
                        if (works[index].category.name == btn.textContent) {
                            figure.style.display ="block";
                        } else {
                            figure.style.display = "none";
                        }

                        if (btn.textContent == "Tous") {
                            figure.style.display = "block";
                        }
                            
                    });

                });

            });

        })
        .catch((error) => {

        });
}

getAllWorksAndCategories();
