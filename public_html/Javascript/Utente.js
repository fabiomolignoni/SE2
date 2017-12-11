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
    
    if(nome == "undefined" || nome == ''){
      alert("Il campo Nome deve essere compilato!");
   document.modulo.name.focus();
   return false;
    }
    
    if(cognome == "undefined" || cognome == ''){
      alert("Il campo Cognome deve essere compilato!");
   document.modulo.name.focus();
   return false;
    }
    
    if(email == "undefined" || email == ''){
      alert("Il campo Email deve essere compilato!");
   document.modulo.email.focus();
   return false;
    }
    
    if(password == "undefined" || password == ''){
      alert("Il campo Password deve essere compilato!");
   document.modulo.password.focus();
   return false;
    }
    
    if(password != rip_password){
      alert("Le password non coincidono, reinseriscile!");
         document.modulo.password.value = '';
         document.modulo.ripeti_psw.value = '';
   document.modulo.password.focus();
   return false;
    }
    
    return true;
}


  
  