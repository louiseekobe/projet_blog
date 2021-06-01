import "./assets/styles/styles.scss";
import "./index.scss";
import {openModal} from "./assets/javascript/modal";

//récuperer les éléments du DOM
const articleContainerElement = document.querySelector('.article-container');
const cathegoriesContainer = document.querySelector('.cathegories');
const selectElement = document.querySelector('select');
let filtre;
let articles;
let sortBy = 'desc';
//evenement qui me permet de trier les articles du plus recent au plsu ancien
selectElement.addEventListener('change', ()=>{
  sortBy = selectElement.value;
  fetchArticle();
});
//fonction qui nous permet de creer un article dans le dom
const createArticle = () =>{
  console.log(articles)
  const articlesDom = articles.filter((article)=>{
    if(filtre){
      return article.cathegory === filtre;
    }else{
      return true;
    }
  })
  .map(article =>{
    const articleDom = document.createElement('div');
    articleDom.classList.add('article');
    articleDom.innerHTML = `
    <img src="${article.image}" alt="profile">
    <h2>${article.title}</h2>
    <p class="article-author">
      ${article.author} - ${new Date(article.createdAt).toLocaleDateString("fr-FR", {weekday: "long", day : "2-digit", month : "long", year: "numeric"})}
    </p>
    <p class="article-content">
      ${article.content}
    </p>
    <div class="article-action">
      <button class="btn btn-danger" data-id="${article._id}">Supprimer</button>
      <button class="btn btn-primary" data-id="${article._id}">Modifier</button>
    </div>
    `;
    return articleDom;
  });
  //on initialiser la div avec la classe article
  articleContainerElement.innerHTML = '';
  //on ajoute la liste d'articles dans la div
  articleContainerElement.append(...articlesDom);
  //on récupère la liste des bouton delete de notre div
  const deleteButton = articleContainerElement.querySelectorAll('.btn-danger');
  //recuperer le bouton pour l'édition
  const editbuttons = articleContainerElement.querySelectorAll('.btn-primary');
  
  editbuttons.forEach(button=>{
    button.addEventListener('click', async event=>{
      const result = await openModal("Voulez-vous modifier cet article ?");
      if(result){
        const target = event.target;
        const articleId = target.dataset.id;
        location.assign(`/form.html?id=${articleId}`);
      } 
    })
  });
  
  deleteButton.forEach(button =>{
    button.addEventListener('click', async event=>{
      const result = await openModal("Etes-vous sur de supprimer cet article");
      //on attent le resultat de la classe modale
      if(result === true){
        try {
          const target = event.target; //target nous permet de faire la délégation d'evenement
          const articleid = target.dataset.id; //recuperer l'id de l'article avec la propriété dateset
          //on supprimer l'article pour un id precis
          const response = await fetch(`https://restapi.fr/api/listeArticle/${articleid}`,{
            method : "delete"
          });
          //on recharge la page 
          fetchArticle();
        } catch (error) {
          console.log("error : ", error);
        }
      }
    })
  })
}
//creer dynamiquement les articles
const createMenuCategories = ()=>{
  //on va regrouper les cathegorie en fonction de leur nom et nombre
  //on obtient un objet contenant les categorie et le nombre d'apparition
  const categories = articles.reduce((accumulateur, article)=>{
    if(accumulateur[article.cathegory]){
      accumulateur[article.cathegory]++;
    }else{
      accumulateur[article.cathegory] = 1;
    }
    return accumulateur;
  }, {});
  //la fct Object.keys prend en parametre un objet et le transforme en un tableau donc les valeurs sont les key de l'objet
  //la fonction map peremt de transformer un array en un array
  const categoriesArr = Object.keys(categories).map(category=>{
    return [category, categories[category]];
  }).sort((c1,c2)=>c1[0].localeCompare(c2[0])); //on utilie la fct sort et la fonction localeCompare
  //trier les articles par ordre croissant
  displayMenuCategories(categoriesArr);
}

//creer une fonction qui va afficher le menu en fonction d'un tableau

const displayMenuCategories = (categoriesArr)=>{
  const liElement = categoriesArr.map((categoriesItem)=>{
    const li = document.createElement('li');
    li.innerHTML = ` ${categoriesItem[0]} (<strong>${categoriesItem[1]}</strong>)`;
    if(categoriesItem[0] === filtre){
      li.classList.add('active');
    }
    li.addEventListener('click', event=>{
      event.stopPropagation();
      if(filtre === categoriesItem[0] ){
        filtre = null;
        liElement.forEach(liIt =>{
          liIt.classList.remove('active');
        });
        createArticle();
      }else{
        filtre = categoriesItem[0];
        li.classList.add('active');
        createArticle();
      }
    })
    return li;
  });
  cathegoriesContainer.innerHTML = '';
  cathegoriesContainer.append(...liElement);
  return liElement;
}


//Récuperer les article de notre serveur
const fetchArticle  = async()=>{
  try {
    const response = await fetch(`https://restapi.fr/api/listeArticle?sort=createdAt:${sortBy}`);
    articles = await response.json();
    createArticle();
    createMenuCategories();
  } catch (error) {
    console.log("error : ", error);
  }
  
}

fetchArticle();