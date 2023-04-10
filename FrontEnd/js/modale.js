/*----------  FONCTIONS SUPPRESSION TRAVAUX  ----------*/

const messageSpan = document.querySelector(".error-msg");

function deleteWork(idWorkModal, figureModalParent) {
    const token = sessionStorage.getItem("token");
    fetch("http://localhost:5678/api/works/" + idWorkModal, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Échec de la suppression de l'élément");
            }
        })
        .then(() => {
            figureModalParent.remove();
            // élément avec idWorkMain = à idWorkModal de la figure en cours de surppression
            const figureMainToDelete = document.querySelector('.figure-element[data-id-work-main="' + idWorkModal + '"]');
            figureMainToDelete.remove();
            messageSpan.style.display="block";
            messageSpan.textContent = "L'élément a été supprimé avec succès";
            messageSpan.style.color="green";

        })
        .catch((error) => {
            console.error(error);
            messageSpan.style.display="block";
        });
}

function deleteAllWork(idWorkModal,figureModal){
    const token = sessionStorage.getItem("token");
    const messageSpan = document.querySelector(".error-msg");

            fetch("http://localhost:5678/api/works/" + idWorkModal, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Échec de la suppression de la galerie");
                }
            })
            .then(() => {
                figureModal.remove();
                const figuresMainToDelete = document.querySelectorAll('.figure-element[data-id-work-main="' + idWorkModal + '"]');
                figuresMainToDelete.forEach((figureMain) => {
                    figureMain.remove();
                });
                messageSpan.style.display="block";
                messageSpan.textContent = "La galerie a été supprimé avec succès";
                messageSpan.style.color="green";
            })
    .catch((error) => {
        console.error(error);
        messageSpan.style.display="block";
        messageSpan.textContent = "Échec de la suppression de la galerie";
    });

}










/*----------  FONCTION APERÇU IMAGE MODALE  ----------*/

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
        imagePreview.style.display = "none";
        document.getElementById("imagePreview").style.display = "none";
        document.getElementById("iconPreviewImage").style.display = "block";
        document.getElementById("input-file-container").style.display = "block";
        document.getElementById("imageRestriction").style.display = "block";
        removeImageButton.style.display = "none";
    });
}





/*----------  PAGE D'ACCEUIL EN MODE EDITION   ----------*/

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





/*----------  OUERTURE/FERMETURE MODALE ----------*/

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








/*---------- API : GET & DELETE WORKS FROM THE MODAL ----------*/

const urlGetWorks = "http://localhost:5678/api/works";

fetch(urlGetWorks)
    .then((response) => {
        if (!response.ok) {
            if (response.status === 500) {
                throw new Error(`Une erreur inconnue est survenue`);
            } else if (response.status === 401) {
                throw new Error(`Non autorisé`);
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

            // Icons 
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
            document.querySelector("#empty-gallery-msg").style.display="none";

            // AppendChilds
            figureModal.appendChild(imageModal);
            figureModal.appendChild(iconDeleteModal);
            figureModal.appendChild(iconMoveModal);
            captionModal.appendChild(linkCaptionModal);
            figureModal.appendChild(captionModal);

            figuresContainer.appendChild(figureModal);
        }

        const addPhotoButton = document.querySelector(".submit-btn");
        const modalGallery = document.querySelector("#modal-gallery");
        modalGallery.insertBefore(figuresContainer, addPhotoButton);

        /*----------  Suppression éléments galerie  ----------*/

        let deleteBtn = document.querySelectorAll(".delete-btn");
        const deleteAllWorkButton = document.querySelector("#delete-gallery-btn");
        deleteBtn.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault(); 
                const figureModalParent = btn.parentNode; // recupère la balise parente du bouton
                const idWorkModal = figureModalParent.dataset.idWorkModal; // on récupère les id personnalisé des figure qu'on a recup de l'api
                console.log(idWorkModal);
                deleteWork(idWorkModal, figureModalParent); // figureModal = l'élément dans le DOM
            });
        });

        deleteAllWorkButton.addEventListener("click", (e) => {
            e.preventDefault();
            const allFigureModal = document.querySelectorAll(".modal-figure");
            console.log(allFigureModal)
            allFigureModal.forEach(figureModal => {
                const idWorkModal = figureModal.getAttribute('data-id-work-modal');
                console.log(idWorkModal);
                deleteAllWork(idWorkModal,figureModal);
            })
           
        });
    })
    .catch((error) => {
        console.log(error.message);
        errorMsg.textContent = error.message;
        errorMsg.style.display = "block";
    });








/*----------  API POST : SEND NEW WORK ----------*/

const formAddImage = document.querySelector("#formAddImage");
const figuresContainer = document.querySelector("#modal-figures");
const messageDiv = document.getElementById("message");
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
    // Stockage données du formulaire dans l'objet formData
    const formData = new FormData();
    const file = inputFile.files[0];
    formData.append("title", inputTitle.value);
    formData.append("image", file);
    formData.append("category", inputSelect.value);

    const token = sessionStorage.getItem("token");
    const options = {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    };

    fetch(urlPostWork, options)
        .then((response) => {
            if (!response.ok) {
                if (response.status === 500) {
                    throw new Error(`Une erreur inconnue est survenue`);
                }else if (response.status === 401) {
                    throw new Error(`Non autorisé`);
                }else if (response.status === 400) {
                    throw new Error(`Mauvaise requête`);
                }

            }
            return response.json();
        })
        .then((newWork) => {

            // AJOUT DANS GALERIE PRINCIPALE
                const figureElement = document.createElement("figure");
                const imageElement = document.createElement("img");
                const captionElement = document.createElement("figcaption");
                imageElement.setAttribute("src", newWork.imageUrl);
                imageElement.setAttribute("alt", newWork.title);
                figureElement.setAttribute("data-id-work-main", newWork.id); // id pour delete les works
                figureElement.setAttribute("class", "figure-element");
                captionElement.textContent = newWork.title;
                messageDiv.style.display="block";
                messageDiv.textContent = "L'image a été envoyée avec succès.";
                figureElement.appendChild(imageElement);
                figureElement.appendChild(captionElement);
                gallery.appendChild(figureElement);
            

            // AJOUT DANS GALERIE MODALE
                document.querySelector("#empty-gallery-msg").style.display="none";
                const figureModal = document.createElement("figure");
                figureModal.setAttribute("class", "modal-figure");
                figureModal.setAttribute("data-id-work-modal", newWork.id); //attribut personnalisé pour suppression travaux

                //Images
                const imageModal = document.createElement("img");
                imageModal.setAttribute("class", "modal-img");
                imageModal.setAttribute("src", newWork.imageUrl);
                imageModal.setAttribute("alt", newWork.title);

                //Icons 
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

                //Figcaptions
                const captionModal = document.createElement("figcaption");
                const linkCaptionModal = document.createElement("a");
                linkCaptionModal.setAttribute("href", "#");
                linkCaptionModal.textContent = "éditer";

                //AppendChilds
                figureModal.appendChild(imageModal);
                figureModal.appendChild(iconDeleteModal);
                figureModal.appendChild(iconMoveModal);
                captionModal.appendChild(linkCaptionModal);
                figureModal.appendChild(captionModal);
                figuresContainer.appendChild(figureModal);

            let deleteBtn = document.querySelectorAll(".delete-btn");
            const deleteAllWorkButton = document.querySelector("#delete-gallery-btn");
            deleteBtn.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault(); 
                const figureModalParent = btn.parentNode; // recupère la balise parente du bouton
                const idWorkModal = figureModalParent.dataset.idWorkModal; // on récupère les id personnalisé des figure qu'on a recup de l'api
                console.log(idWorkModal);
                deleteWork(idWorkModal, figureModalParent); // figureModal = l'élément dans le DOM
                });
            });

            deleteAllWorkButton.addEventListener("click", (e) => {
                e.preventDefault();
                const allFigureModal = document.querySelectorAll(".modal-figure");
                console.log(allFigureModal)
                allFigureModal.forEach(figureModal => {
                    const idWorkModal = figureModal.getAttribute('data-id-work-modal');
                    console.log(idWorkModal);
                    deleteAllWork(idWorkModal,figureModal);
                    })
            });

                // REDIRECTION 
            setTimeout(() => {
                if (confirm("Voulez-vous ajouter un autre projet ?")) {
                    document.getElementById("imagePreview").style.display = "none";
                    document.getElementById("iconPreviewImage").style.display = "block";
                    document.getElementById("input-file-container").style.display = "block";
                    document.getElementById("imageRestriction").style.display = "block";
                    removeImageButton.style.display = "none";
                    messageDiv.style.display="none";
                    inputTitle.value = "";
                    inputSelect.value = "";
                } else {
                    modalGalleryPage.style.display="flex";
                    modalAddPhotoPage.style.display="none"
                    document.getElementById("imagePreview").style.display = "none";
                    document.getElementById("iconPreviewImage").style.display = "block";
                    document.getElementById("input-file-container").style.display = "block";
                    document.getElementById("imageRestriction").style.display = "block";
                    removeImageButton.style.display = "none";
                    messageDiv.style.display="none";
                    inputTitle.value = "";
                    inputSelect.value = "";
                }
            }, 1000);
        })
        .catch((error) => {
            console.log(error.message);
        });
});



/*----------  CHANGEMENT DE PAGE MODALE ----------*/

const modalBackBtn = document.querySelector("#modal-back-btn");
const modalGalleryPage = document.querySelector("#modal-gallery");
const modalAddPhotoPage = document.querySelector("#modal-add-image");
const addPhotoButton = document.querySelector(".submit-btn.submit-btn-1");

modalBackBtn.addEventListener("click", () => {
    messageSpan.style.display="none";
    messageDiv.style.display="none";
    modalGalleryPage.style.display = "flex";
    modalAddPhotoPage.style.display = "none";
    modalBackBtn.style.display = "none";
});

addPhotoButton.addEventListener("click", () => {
    inputSelect.value = "";
    modalGalleryPage.style.display = "none";
    modalAddPhotoPage.style.display = "block";
    modalBackBtn.style.display = "block";
});



// reste à faire
// Enlever les commentaires de mon code
// Préparer présentation projet
