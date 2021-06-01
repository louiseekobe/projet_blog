//recuperation des éléments du dom 
const iconMobile = document.querySelector('.header-menu-icon');
const headerMenu = document.querySelector('.header-menu')
const header = document.querySelector('header');
let headerTop = header.offsetTop; //connaitre la position du header par rappord à la fenetre
let isMenuOpen = false;
let MobileMenuDom ;

const closeMenu = ()=>{
  MobileMenuDom.classList.remove('open');
} 

const createMobileMenu = ()=>{
  MobileMenuDom = document.createElement('div');
  MobileMenuDom.classList.add('mobile-menu');
  MobileMenuDom.addEventListener('click', event =>{
    event.stopPropagation();
  })
  //cloneNode permet de copier une node du dom
  //avec la valeur true il fait un deep clone
  MobileMenuDom.append(headerMenu.querySelector('ul').cloneNode(true));
  iconMobile.append(MobileMenuDom);
}

const openMenu = ()=>{
  if(MobileMenuDom){
  }else{
    createMobileMenu();
  }
  MobileMenuDom.classList.add('open');
}

const toggleMobileMenu = ()=>{
  if(isMenuOpen){
    closeMenu();
  }else{
    openMenu();
  }
  isMenuOpen = !isMenuOpen;
}


//ecouter l'evenement sur le burgeur menu
iconMobile.addEventListener('click', event=> {
  event.stopPropagation();
  toggleMobileMenu();
}
  )

//ecouter d'evenement sur windows
window.addEventListener('click', event=>{
  if(isMenuOpen){
    toggleMobileMenu();
  }
})


window.addEventListener('resize', event=>{
  if(window.innerWidth > 480 && isMenuOpen){
    toggleMobileMenu();
  }
})

//rendre le menu fixe
const stickiHeader = ()=>{
  //La méthode Element.getBoundingClientRect() retourne un objet DOMRect fournissant des informations sur la taille d'un élément et sa position relative par rapport à la zone d'affichage.
  const p = header.getBoundingClientRect().height;
  //on va ainsi retrouver la hauteur de cet element dans le doM
  if(window.pageYOffset > headerTop){
    header.classList.add('fixe');
    header.style.height += p; //et ajouter cette hauteur pour qu'il retrouve exactement sa place
  }else{
    header.classList.remove('fixe');
  }
}

window.addEventListener('scroll', stickiHeader);
