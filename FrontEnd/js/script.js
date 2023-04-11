const urlGet = "http://localhost:5678/api/works";
const gallery = document.querySelector(".gallery");
const categories = document.querySelector(".categories");
const errorMsg = document.querySelector(".error-msg");
const setCategoriesName = new Set();


function getAllWorksAndCategories() {
    fetch(urlGet)
        .then((response) => {
            if (!response.ok) {
                if (response.status === 500) {
                    throw new Error(`Une erreur inconnue est survenue`);
                }
            }
            return response.json();
        })
        .then((works) => {
            /*----------  Travaux  ----------*/
            
            for (let i in works) {
                // figures, img et figcaptions
                const figureElement = document.createElement("figure");
                const imageElement = document.createElement("img");
                const captionElement = document.createElement("figcaption");

                // Ajout des attributs 
                imageElement.setAttribute("src", works[i].imageUrl);
                imageElement.setAttribute("alt", works[i].title);
                figureElement.setAttribute("data-id-work-main", works[i].id);  // id pour delete les works
                figureElement.setAttribute("class", "figure-element");
                captionElement.textContent = works[i].title;

                // AppendChilds
                figureElement.appendChild(imageElement);
                figureElement.appendChild(captionElement);
                gallery.appendChild(figureElement);

                // Set contenant les noms des catégories
                setCategoriesName.add(works[i].category.name);
            }

            /*----------  Catégories  ----------*/

            setCategoriesName.forEach((name) => {
    
                const filterBtn = document.createElement("button");

                // Attributs catégories
                filterBtn.textContent = name;
                filterBtn.setAttribute("id", name.replace(/\s+/g, "-")); // remplace les espaces par des tirets
                filterBtn.setAttribute("class", "filter__btn");

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
                    });
                    // Ajoutez la classe "active" au boutons filtre sélectionné
                    btn.classList.add("active");

                    // filtrer les figures pour chaque catégories
                    figureElements.forEach((figure, index) => {
                        //console.log(index)
                        if (works[index].category.name == btn.textContent) {
                            figure.style.display = "block";
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
            console.log(error.message);
            errorMsg.textContent = error.message;
            errorMsg.style.display = "block";
        });
}

getAllWorksAndCategories();
