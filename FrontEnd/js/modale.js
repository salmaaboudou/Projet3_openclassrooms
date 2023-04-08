/*----------  Fonction suppression travaux  ----------*/

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

/*----------  Aperçu image modal  ----------*/

const imagePreview = document.getElementById("imagePreview");
imagePreview.style.display = "none";
const removeImageButton = document.getElementById("removeImageButton");
removeImageButton.style.display = "none";

function previewImage(event) {
    const file = event.target.files[0]; // Vérifie si un fichier a été sélectionné
    if (file) {
        if (file.type.match("image.*")) {
            if (file.size <= 4194304) {
                var reader = new FileReader();
                reader.onload = function (event) {
                    // affiche l'aperçu de l'image
                    imagePreview.src = event.target.result;
                    document.getElementById("imagePreview").style.display = "block";
                    document.getElementById("iconPreviewImage").style.display = "none";
                    document.getElementById("input-file-container").style.display = "none";
                    document.getElementById("imageRestriction").style.display = "none";
                    imagePreview.style.display = "block";
                    removeImageButton.style.display = "block";
                };
                reader.readAsDataURL(file);
            } else {
                alert("Le fichier dépasse la taille maximale autorisée de 4 Mo.");
                imagePreview.style.display = "none";
            }
        } else {
            alert("Le fichier sélectionné n'est pas une image.");
            imagePreview.innerHTML = "";
            imagePreview.style.display = "none";
        }
    } else {
        imagePreview.style.display = "none";
    }

    removeImageButton.addEventListener("click", (e) => {
        e.preventDefault();
        // Supprimer l'aperçu de l'image
        imagePreview.style.display = "none";
        // Réafficher les balises
        document.getElementById("imagePreview").style.display = "none";
        document.getElementById("iconPreviewImage").style.display = "block";
        document.getElementById("input-file-container").style.display = "block";
        document.getElementById("imageRestriction").style.display = "block";
        removeImageButton.style.display = "none";
    });
}

/*----------  Page d'acceuil en mode édition   ----------*/

const editBar = document.querySelector(".edit-bar");
const editButton = document.querySelectorAll(".edit__button");
const modal = document.querySelector("#modal");
const closeModalBtn = document.querySelector("#modal-close-btn");
const modalTitle = document.querySelector(".modal-title");

if (sessionStorage.getItem("token")) {
    editBar.style.display = "flex";

    editButton.forEach((button) => {
        button.style.display = "block";
    });
}

/*----------  Ouverture/fermeture modale  ----------*/

editButton.forEach((button) => {
    button.addEventListener("click", () => {
        modal.style.display = "flex";
    });
});

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

/*----------  Ajout photos dans modale  ----------*/

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
            iconMoveModal.style.display = "none";
            figureModal.addEventListener("mouseover", () => {
                figureModal.style.cursor = "pointer";
                iconMoveModal.style.display = "block";
            });
            figureModal.addEventListener("mouseout", () => {
                iconMoveModal.style.display = "none";
            });

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

        const addPhotoBtn = document.querySelector(".submit-btn");
        const modalGallery = document.querySelector("#modal-gallery");
        modalGallery.insertBefore(figuresContainer, addPhotoBtn);

        /*----------  Suppression éléments galerie  ----------*/

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

/*----------  Changement page modale ----------*/

const modalBackBtn = document.querySelector("#modal-back-btn");
const modalGalleryPage = document.querySelector("#modal-gallery");
const modalAddPhotoPage = document.querySelector("#modal-add-image");
const addPhotoButton = document.querySelector(".submit-btn.submit-btn-1");

modalBackBtn.addEventListener("click", () => {
    modalGalleryPage.style.display = "flex";
    modalAddPhotoPage.style.display = "none";
    modalBackBtn.style.display = "none";
});

addPhotoButton.addEventListener("click", () => {
    modalGalleryPage.style.display = "none";
    modalAddPhotoPage.style.display = "block";
    modalBackBtn.style.display = "block";
});

/*----------  Envoie travaux API  ----------*/

const formAddImage = document.querySelector("#formAddImage");
const submitButton = document.querySelector("#validate-btn");
const inputTitle = document.querySelector("#input-title");
const inputSelect = document.querySelector("select");
const inputFile = document.querySelector("#file");
const urlPostWork = "http://localhost:5678/api/works";

inputTitle.addEventListener("input", enableSubmitButton);
inputFile.addEventListener("input", enableSubmitButton);
inputSelect.addEventListener("input", enableSubmitButton);
function enableSubmitButton() {
    if (inputTitle.value.trim() !== "" && inputFile.value.trim() !== "" && inputSelect.value.trim() !== "") {
        submitButton.removeAttribute("disabled");
    } else {
        submitButton.setAttribute("disabled", "");
    }
}

formAddImage.addEventListener("submit", (e) => {
    e.preventDefault();
    // Stockage des données du formulaire dans l'objet formData
    const formData = new FormData();
    const file = inputFile.files[0];
    formData.append("title", inputTitle.value);
    formData.append("image", file);
    formData.append("category", inputSelect.value);


    //Convertir les données du formulaire en JSON
    const jsonData = {};
    for (const [key, value] of formData.entries()) {
        jsonData[key] = value;
    }

    // Options de requête pour la méthode post (options = ce que j'envoie)
    const token = sessionStorage.getItem("token");
    const options = {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    };

    console.log(jsonData);

    fetch(urlPostWork, options)
        .then((response) => {
            if (!response.ok) {
                if (response.status === 500) {
                    throw new Error(`Une erreur inconnue est survenue`);
                }
            }
            return response.json();
        })
        .then((newWork) => {
            const gallery = document.querySelector(".gallery");

            // Création des balises
            const figureElement = document.createElement("figure");
            const imageElement = document.createElement("img");
            const captionElement = document.createElement("figcaption");

            // Ajout des attributs
            imageElement.setAttribute("src", newWork.imageUrl);
            imageElement.setAttribute("alt", newWork.title);
            figureElement.setAttribute("data-id-work-main", newWork.id); // id pour delete les works
            figureElement.setAttribute("class", "figure-element");
            captionElement.textContent = newWork.title;

            // Ajout de l'image et de la caption à l'élément figure
            figureElement.appendChild(imageElement);
            figureElement.appendChild(captionElement);

            // Ajout de la figure au body au niveau de la div gallery
            gallery.appendChild(figureElement);

            if (confirm('Voulez-vous ajouter un autre projet ?')) {
                modalGalleryPage.style.display = "none";
                modalAddPhotoPage.style.display = "block";
                modalBackBtn.style.display = "block";
            } else {
                window.location.href = "../index.html";
            }
        })
        .catch((error) => {
            console.log(error.message);
        });
});

// reste à faire
// Dmd à l’utilisateur s’il veut ajouter d’autres projet. Si oui → redirection vers modal page 1 si non on ferme la modal
// Mettre msg erreur dans la modale si éléments ne sont pas chargés à l’interieur
// Enlever les commentaires de mon code
// Préparer présentation projet
