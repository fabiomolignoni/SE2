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

var query = "";
var filtros = "";
var fromLast = "";
var lessThan = "";
var lista = "";
var ads;
var setAdsPage = function (page){
    page --;
    var k = 0;
    for(let i = page*4; i<(page*4)+4; i++){
        if(ads[i] != null && typeof ads[i] != 'undefined'){            
            document.getElementById("card_"+k).style.display = 'block';
            document.getElementById("ads_img"+k).src = ads[i].images[0];
            document.getElementById("ads_title"+k).innerHTML = ads[i].title;
            document.getElementById("ads_desc"+k).innerHTML = ads[i].desc;
            document.getElementById("ads_date"+k).innerHTML = convertDate(ads[i].date);
            document.getElementById("ads_id"+k).setAttribute("href",'Annuncio.html?id='+ads[i].id);
            k ++;
        } else {
            document.getElementById("card_"+k).style.display = 'none';
            k++;
        }
    }
    
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

var cercaMeno = function() {
    window.location.href = "Ricerca.html?q="+ query+"&category="+filtros+"&fromLast="+!fromLast+"&lessThan="+lessThan;
}
var settaFiltri = function(){
    var x = document.getElementById("filtri");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

$(document).ready(function(){
    document.getElementById("page_no_result").style.display = 'none';
    document.getElementById("header_not_registered").style.display = 'none';
    document.getElementById("header_registered").style.display = 'none';    
    document.getElementById('filtri').style.display = 'none';
    for(i=0;i<4;i++){  
        document.getElementById("card_"+i).style.display = 'none';
    }
    
    document.getElementById("pagina_princ").style.display = 'none';
    
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
    
    query = findGetParameter("q");
    filtros = findGetParameter("category");
    fromLast = findGetParameter("fromLast");
    lessThan = findGetParameter("lessThan");
    if(fromLast == "true"){
         document.getElementById("fromLast").style.setProperty ("background-color", "green", "important");
    } else {
        document.getElementById("fromLast").style.setProperty ("background-color", "red", "important");
        fromLast = false;
    }
    if (lessThan != null){
        document.getElementById("lessThan").value = lessThan;
    }
    jQuery.get("https://messageinabot.herokuapp.com/ads?q="+ query+"&category="+filtros+"&fromLast="+fromLast+"&lessThan="+lessThan,{},function(data){        
        if(data.success){
            ads = data.ads;  
            var length = data.ads.length;
            var pag = Math.ceil(length /4.0);            
            lista = document.getElementById("choose-page");
            for (let i = 1; i<= pag; i++){
                var actualNum = document.createElement("LI");
                actualNum.innerHTML = '<a class="page-link" id="'+i+'page'+'" href="javascript:setAdsPage('+i+')">'+i+'</a>';
                actualNum.className = 'page-item';
                lista.appendChild(actualNum);
            }
            document.getElementById("pagina_princ").setAttribute("href","index.html");
            document.getElementById("pagina_princ").style.display = 'block';
            if(pag >=1 ){
                setAdsPage(1);
            }                      
            else{                              
                document.getElementById("page_no_result").style.display = 'block';
                
            }
        }       
        
    });
    $('#lessThan').keypress(function(e){
      if(e.keyCode==13){
          window.location.href = "Ricerca.html?q="+ query+"&category="+filtros+"&fromLast="+fromLast+"&lessThan="+document.getElementById("lessThan").value;
      }
      
    });
    
}); 
