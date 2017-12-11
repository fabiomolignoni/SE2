/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




function deleteCookie( name ) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    location.href='index.html'
}
$("#logout").click(function(){
    deleteCookie('token');
    window.location.href = "index.html"; 
});


$(document).ready(function(){
    $("#ricerca2").click(function(){
        var filtros = document.getElementById("filtro2").value;
        var query = document.getElementById("query2").value;
        if(query == null && filtros == "tutte le categorie"){
            var url = "Ricerca.html?offset=0";
        }
        if(query == " " && filtros != null){
            var url = "Ricerca.html?offset=0&category="+filtros;
        }
        
        if(query != " " && filtros == "tutte le categorie"){
            var url = "Ricerca.html?offset=0&q="+query;
        }
        
        if(query != " " && filtros != "tutte le categorie"){
            var url = "Ricerca.html?offset=0&q="+query+"&category="+filtros;
        }
        
        
        document.getElementById("ricerca2").setAttribute("href",url);
    });
});

