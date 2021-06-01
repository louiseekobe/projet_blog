const body = document.querySelector('body');

let calque;
let modal;
let cancel;
let confirm;

const createCalque = ()=>{
  calque = document.createElement('div');
  calque.classList.add('claque');
}

const createModal = (question)=>{
  modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `<p>${question}</p>`;
  cancel = document.createElement('button');
  cancel.innerHTML = 'Annuler';
  cancel.classList.add('btn', 'btn-secondary');
  confirm =  document.createElement('button');
  confirm.innerHTML = 'Confirmer';
  confirm.classList.add('btn', 'btn-primary');
  modal.append(cancel, confirm);
  
}


//va nous retourner une promesse suivant le click de l'utilisateur
export function openModal(question){
  createCalque();
  createModal(question);
  calque.append(modal);
  body.append(calque);
  return new Promise((resolve, reject)=>{
    //supprimer le calque lorsque l'utilisateur clique dessus
    calque.addEventListener('click', event=>{
      resolve(false);
      event.stopPropagation();
      calque.remove();
    });
    //annuler la suppression de l'article
    cancel.addEventListener('click', event=>{
      event.stopPropagation();
      resolve(false);
      calque.remove();
    });
    //confirmer la suppression d'un article
    confirm.addEventListener('click', event=>{
      event.stopPropagation();
      resolve(true);
      calque.remove();
    });
  });
}


