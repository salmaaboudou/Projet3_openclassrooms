const urlLogin = "http://localhost:5678/api/users/login";
const errorMsg = document.querySelector(".error-msg");

form.addEventListener("submit", (e) => {
    // Stockage des données du formulaire dans l'objet formData
    const inputEmail = document.querySelector("#email");
    const inputPassword = document.querySelector("#password");
    const formData = new FormData();
    formData.append("email", inputEmail.value);
    formData.append("password", inputPassword.value);

    // Convertir les données du formulaire en JSON
    const jsonData = {};
    for (const [key, value] of formData.entries()) {
        jsonData[key] = value;
    }

    //enlever comportement par défaut du formulaire html
    e.preventDefault();

    // Options de requête pour la méthode post (options = ce que j'envoie)
    const options = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
    }; 

    console.log(jsonData);

    // Envoyer la requête POST à l'API
    fetch(urlLogin, options)
        .then((response) => {
            if (!response.ok) {
                if (response.status === 404) {
                    // email n'existe pas dans la bd
                    throw new Error(`Cet utilisateur n'existe pas`);
                } else if (response.status === 401) {
                    // email existe mais mpd pas bon pour cet email
                    throw new Error(`Mot de passe incorrect`);
                }
            }
            return response.json();
        })
        .then((result) => {
            // Stockage du token dans le local storage
            localStorage.setItem("token", result.token);
            // Rediriger l'utilisateur vers la page d'acceuil
            window.location.href = "index.html"; 
        })
        .catch((error) => {
           errorMsg.textContent = error.message;
           errorMsg.style.display = "block";
        });
});

