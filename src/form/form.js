import "../assets/styles/styles.scss";
import "./form.scss";
import {openModal} from "../assets/javascript/modal";

//récupération des éléments du dom
const form = document.querySelector('form');
const errorsElement = document.querySelector('#error');
const buttoncancel = document.querySelector('.btn-secondary');

let articleid;

//put remplace tous les document dans la base de données
//patch remplace quelques element de la base de données
//creer une fonction qui pemremt de remplir un formulaire à partir des données présent dans le serveur
const fillform = (article)=>{
  const author = document.querySelector('input[name="author"]');

  const title = document.querySelector('input[name="title"]');

  const image = document.querySelector('input[name="image"]');

  const cathegory = document.querySelector('input[name="cathegory"]');

  const content = document.querySelector('textarea');

  author.value = article.author || '';
  title.value = article.title || '';
  image.value = article.image || '';
  cathegory.value = article.cathegory || '';
  content.value = article.content || '';

}

//initialiser le formulaire
const initform = async ()=>{
  const param = new URL(location.href);
  articleid = param.searchParams.get('id');
  if(articleid){
    const response = await fetch(`https://restapi.fr/api/listeArticle/${articleid}`);
    if(response.status < 300){
      const article = await response.json();
      fillform(article);
    }
  }
}


initform();


//on va créer un tableau d'erreur
let errors = [];


//evenement lors de la soumission du formulaire
form.addEventListener('submit', async event=>{
  event.preventDefault();
  const formData = new FormData(form);
  const entries = formData.entries(); //methode entries transforme formData en iterable
  const article = Object.fromEntries(entries); //peremt de transformer un iterable en object
  //console.log(article);
  const result = await openModal("Voulez-vous sauvegarder cet article");
  if(formIsValid(article)&& result){
    let reponse;
    try{
      if(articleid){
        const json = JSON.stringify(article);
        reponse = await fetch(`https://restapi.fr/api/listeArticle/${articleid}`,{
        method: "PATCH",
        body: json,
        headers:{
          "Content-Type": "application/json"
        }
      });
      }else{
        const json = JSON.stringify(article);
        reponse = await fetch('https://restapi.fr/api/listeArticle',{
        method: "POST",
        body: json,
        headers:{
          "Content-Type": "application/json"
          }
        });
      }
      if(reponse.status < 299){
        location.assign("/index.html");
      }
    }catch(e){
      console.log('error : ', e);
    }
    
  }
  
})


//creer une fonction qui nous permet de vérifier l'état de validité d'un formulaire
const formIsValid = (article)=>{
  errors = [];
  if(!article.author || !article.cathegory || !article.content || !article.image || !article.title){
    errors.push("vous devez renseigner tous les champs");
  }else{
    errors = [];
  }
  if(errors.length){
    let tmpError = ' ';
    errors.forEach(e => {
      tmpError += `<li>${e}</li>`
    });
    errorsElement.innerHTML = tmpError;
    return false;
  }else{
    errorsElement.innerHTML = ' ';
    return true;
  }
} 

//annulation de la soumisson du formulaire 
buttoncancel.addEventListener('click', async event=>{
  const result = await openModal("Etes-vous sûr d'annuler la création de cet article");
  if(result){
    location.assign('/index.html');
  }
});