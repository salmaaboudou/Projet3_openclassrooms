/*----------  Fonction pour supprimer les travaux  ----------*/

function deleteWork(idWorkModal, figureModal) {
    const token = sessionStorage.getItem("token");
    fetch("http://localhost:5678/api/works/" + idWorkModal, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to delete item");
            }
            console.log("Item deleted successfully");
        })
        .then(() => {
            figureModal.remove();
            // récupérer l'élément qui a un idWorkMain = à idWorkModal de la figure en cours de surppression
            const figureMainToDelete = document.querySelector('.figure-element[data-id-work-main="' + idWorkModal + '"]');
            figureMainToDelete.remove();
        })
        .catch((error) => {
            console.error(error);
        });
}

const editBar = document.querySelector(".edit-bar");
const editButton = document.querySelectorAll(".edit__button");
const modal = document.querySelector("#modal");
const closeModalBtn = document.querySelector("#modal-close-btn");
const modalTitle = document.querySelector(".modal-title");

/*----------  Affichage de la page d'acceuil en mode édition   ----------*/

if (sessionStorage.getItem("token")) {
    // afficher la barre d'édition si le token est stocké dans le session storage
    editBar.style.display = "flex";

    //afficher les boutons modifier si le token est stocké dans le session storage
    editButton.forEach((button) => {
        button.style.display = "block";
    });
}

/*----------  Ouverture/fermeture modale  ----------*/

// Ouverture au clic du btn modifier
editButton.forEach((button) => {
    button.addEventListener("click", () => {
        modal.style.display = "flex";
    });
});

//Fermeture au clic en dehors de la fenêtre modale
window.addEventListener("click", (event) => {
    // Vérifiez si le clic a été effectué en dehors de la fenêtre modale
    if (event.target === modal) {
        // Fermez la fenêtre modale
        modal.style.display = "none";
    }
});

// Fermeture au clic sur la croix
closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

/*----------  Ajout des images de la galerie dans la modale  ----------*/

const urlGetGallery = "http://localhost:5678/api/works";

fetch(urlGetGallery)
    .then((response) => {
        if (!response.ok) {
            if (response.status === 500) {
                throw new Error(`Une erreur inconnue est survenue`);
            }
        }
        return response.json();
    })
    .then((works) => {
        const figuresContainer = document.querySelector("#modal-figures");
        for (let i in works) {
            
            // Figures
            const figureModal = document.createElement("figure");
            figureModal.setAttribute("class", "modal-figure");
            figureModal.setAttribute("data-id-work-modal", works[i].id); //attribut personnalisé pour suppression travaux

            // Images
            const imageModal = document.createElement("img");
            imageModal.setAttribute("class", "modal-img");
            imageModal.setAttribute("src", works[i].imageUrl);
            imageModal.setAttribute("alt", works[i].title);

            // Icons delete & move
            const iconDeleteModal = document.createElement("i");
            const iconMoveModal = document.createElement("i");
            iconDeleteModal.setAttribute("class", "delete-btn fa-solid fa-trash-can");
            iconMoveModal.setAttribute("class", "move-btn fa-solid fa-arrows-up-down-left-right");

            // Figcaption
            const captionModal = document.createElement("figcaption");
            const linkCaptionModal = document.createElement("a");
            linkCaptionModal.setAttribute("href", "#");
            linkCaptionModal.textContent = "éditer";


            // Ajout des img , icon et figcaption dans figures
            figureModal.appendChild(imageModal);
            figureModal.appendChild(iconDeleteModal);
            figureModal.appendChild(iconMoveModal);
            captionModal.appendChild(linkCaptionModal);
            figureModal.appendChild(captionModal);

            // Ajout des figures dans la div figuresContainer
            figuresContainer.appendChild(figureModal);
            
        }

        const addPhotoBtn = document.querySelector('.submit-btn');
        const modalGallery = document.querySelector("#modal-gallery");
        modalGallery.insertBefore(figuresContainer, addPhotoBtn);
    

        /*----------  Supprimer les éléments galerie en cliquant sur l'icon delete ----------*/

        let deleteBtn = document.querySelectorAll(".delete-btn");
        
        deleteBtn.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault(); // empêche le rechargement de la page
                const figureModal = btn.parentNode; // recupère la balise parente du bouton
                const idWorkModal = figureModal.dataset.idWorkModal; // on récupère les id personnalisé des figure qu'on a recup de l'api
                console.log(idWorkModal);
                deleteWork(idWorkModal, figureModal); // figureModal = l'élément dans le DOM
            });
        });                                            

    })
    .catch((error) => {
        console.log(error.message);
        errorMsg.textContent = error.message;
        errorMsg.style.display = "block";
    });


/*----------  Ajout du changement de page dans la modale (retour et bouton ajout photo ) ----------*/


const modalBackBtn = document.querySelector("#modal-back-btn");
const modalGalleryPage = document.querySelector("#modal-gallery");
const modalAddPhotoPage = document.querySelector("#modal-add-image");
const addPhotoButton = document.querySelector(".submit-btn.submit-btn-1");


modalBackBtn.addEventListener("click", () => {
    modalGalleryPage.style.display="flex";
    modalAddPhotoPage.style.display="none";
   
})

addPhotoButton.addEventListener("click", () => {
    modalGalleryPage.style.display="none";
    modalAddPhotoPage.style.display="block";
})

// reste à faire 
    // mettre aperçu image dans modal qd j'ajoute une photo
    // activer le bouton valider quand tous les champs sont remplis 
    // Faire en sorte d'envoyer le travaux à l'api à l'appuie du bouton valider
    // Dmd à l’utilisateur s’il veut ajouter d’autres projet. Si oui → redirection vers modal page 1 si non on ferme la modal
    // Mettre msg erreur dans la modale si éléments ne sont pas chargés à l’interieur