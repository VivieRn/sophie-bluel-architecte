export const formPictureSubmitHTML = `
      <form class="modaleForm" method="post" enctype="multipart/form-data">
      <h4 id="titleModale" class="titleModale">Ajout photo</h4>
      <div class="selectPicture">
      <i class="fa-solid fa-image"></i>
        <label class="modaleFormMainTitle" for="image">+ Ajouter photo</label>
        <input type="file" id="image" name="image" accept="image/*">
        <img id="image-preview" src="" alt="jpg, png: 4mo max">
        </div>
        <label class="modaleFormTitle" for="title">Titre</label>
        <input type="text" name="title" id="title">
        <label class="modaleFormTitle" for="category">Catégorie</label>
        <select name="category" id="category">
          <option value="Objets">Objets</option>
          <option value="Appartements">Appartements</option>
          <option value="Hôtels & restaurants">Hôtels & restaurants</option>
        </select>
        <div class="emptyMsg">Veuillez sélectionner une image et/ou remplir tous les champs.</div>
        <div class="modaleForm2">
          <button id="btnAjoutPhoto" type="submit">Valider</button>
        </div>
      </form>
    `;
