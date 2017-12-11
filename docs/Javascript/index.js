function getCookie(name)
{
    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
};

function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
}

function doLogout(){
    deleteCookie('token');
};

function findGetParameter(parameterName) {
    var result = null,
            tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

//Carica gli header a seconda della situazione
var myResponseHandler = function() {
    if (this.readyState == 3 && this.status == 403) {
        
        document.getElementById("header_not_registered").style.display = 'block';
    }
};

var ResponseHandler = function() {
    if (this.readyState == 3 && this.status == 403) {
        
        
    }
};

var index = 1;

var setAdsPage = function (){
    jQuery.get("https://messageinabot.herokuapp.com/ads?fromLast=true&limit=4&offset="+(index-1)*4,{},function(data){        
        if(data.success){                    
            var url = new Array();
            for(i = 0; i<4;i++){
                if(data.ads[i] != null){
                    document.getElementById("card_"+i).style.display = 'block';
                    document.getElementById("ads_img"+i).src = data.ads[i].images[0];                
                    document.getElementById("ads_title"+i).innerHTML = data.ads[i].title;
                    if(data.ads[i].desc.length < 150){
                        document.getElementById("ads_desc"+i).innerHTML = data.ads[i].desc; 
                    }
                    else{
                        var subdesc = data.ads[i].desc.substring(0,147); 
                        subdesc = subdesc +"..."
                        document.getElementById("ads_desc"+i).innerHTML = subdesc; 
                    }
                    document.getElementById("ads_category"+i).innerHTML = data.ads[i].category;
                    document.getElementById("ads_date"+i).innerHTML = convertDate(data.ads[i].date);
                    
                    
                    var tmp = document.getElementById("ads_id"+i);
                    tmp.value = "Annuncio.html?id="+ data.ads[i].id;
                    url[i] = tmp.value;
                    
                    document.getElementById("ads_id"+i).setAttribute("href",url[i]);
                    
                    
                } else {
                    document.getElementById("card_"+i).style.display = 'none';
                }
            }
            
        }
    });
}

$(document).ready(function(){
    for(i=0;i<4;i++){  
        document.getElementById("card_"+i).style.display = 'none';
    }
    document.getElementById("header_not_registered").style.display = 'none';
    document.getElementById("header_registered").style.display = 'none';
    document.getElementById('prima').style.display = 'none';
    var req = new XMLHttpRequest();
    req.open('GET', "https://messageinabot.herokuapp.com/users?token="+getCookie('token'));
    req.onreadystatechange = myResponseHandler;
    req.send(); 
    
    
    
    $.get("https://messageinabot.herokuapp.com/users?token="+getCookie('token'),{},function(data){
        if(data.success){
            
            document.getElementById("header_registered").style.display = 'block';
            document.getElementById("nome").innerHTML = "Benvenuto" + " " + data.name;
            document.getElementById("img_profilo").src = data.image;
        }
    });
    setAdsPage();
    $("#dopo").click(function(){
        index++;
        setAdsPage();
        document.getElementById('prima').style.display = 'block';
    });
    
    $("#prima").click(function(){
        index--;
        if(index == 1){
            document.getElementById('prima').style.display = 'none';
        }
        if(index>0){
            setAdsPage();
        } else {
            index = 1;
            document.getElementById('prima').style.display = 'none';
        }
        
    });
    
    
    $("#ricerca").click(function(){
        var filtros = document.getElementById("filtro").value;
        var query = document.getElementById("query").value;
        if(query == null && filtros == "tutte le categorie"){
            var url = "Ricerca.html?";
        }
        if(query == " " && filtros != null){
            var url = "Ricerca.html?category="+filtros;
        }
        
        if(query != " " && filtros == "tutte le categorie"){
            var url = "Ricerca.html?q="+query;
        }
        
        if(query != " " && filtros != "tutte le categorie"){
            var url = "Ricerca.html?q="+query+"&category="+filtros;
        }
        
        
        document.getElementById("ricerca").setAttribute("href",url);
    });
    
}); 



        