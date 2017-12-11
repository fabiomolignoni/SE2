/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */





$(document).ready(function(){
    $("#ricerca1").click(function(){
        var filtros = document.getElementById("filtro1").value;
        var query = document.getElementById("query1").value;
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
        
        
        document.getElementById("ricerca1").setAttribute("href",url);
    });
});
