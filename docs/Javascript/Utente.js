/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




function controllo_form(){
    var nome = document.modulo.name.value;
    var cognome = document.modulo.surname.value;
    var email = document.modulo.email.value;
    var password = document.modulo.password.value;
    var rip_password = document.modulo.ripeti_psw.value;
    var phone = document.modulo.phone.value;
    var tmp = true;
    
    if(nome == "undefined" || nome == ''){
      alert("Il campo Nome deve essere compilato!");
   document.modulo.name.focus();
  tmp = false;
    }
    
    if(cognome == "undefined" || cognome == ''){
      alert("Il campo Cognome deve essere compilato!");
   document.modulo.name.focus();
  tmp = false;
    }
    
    if(email == "undefined" || email == ''){
      alert("Il campo Email deve essere compilato!");
   document.modulo.email.focus();
  tmp = false;
    }
    
    if(password == "undefined" || password == ''){
      alert("Il campo Password deve essere compilato!");
   document.modulo.password.focus();
   tmp = false;
    }
    
    if(password != rip_password){
      alert("Le password non coincidono, reinseriscile!");
         document.modulo.password.value = '';
         document.modulo.ripeti_psw.value = '';
   document.modulo.password.focus();
   tmp = false;
    }
    if(phone.length > 10){
      alert("Controllare il campo Telefono, se non si vuole inserire, lasciare vuoto.");
   document.modulo.phone.focus();
  tmp = false;
    }
    
    
    if(phone != "undefined" && phone != '' && phone.length != 10){
      alert("Controllare il campo Telefono, se non si vuole inserire, lasciare vuoto.");
   document.modulo.phone.focus();
  tmp = false;
    }
    
    if(phone.length == 10){
        if(isNaN(phone)){
      alert("Controllare il campo Telefono, se non si vuole ggfgginserire, lasciare vuoto.");
   document.modulo.phone.focus();
  tmp = false;
        }
    }
    
    return tmp;
}


  
  