/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




function getCookie(name)
{
    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
};
function deleteCookie( name ) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    location.href='index.html';
}
//Carica gli header a seconda della situazione
var myResponseHandler = function() {
    if (this.readyState == 3 && this.status == 403) {
        document.getElementById("header_not_registered").style.display = 'block';
        document.getElementById("page_not_registered").style.display = 'block';
    }
};

var id = 0;
var deleteAd = function(button){
    $.ajax({
        type: "DELETE",
        url: "https://messageinabot.herokuapp.com/ads/"+button.value+"?token="+getCookie('token'),
        data: {},
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (data){
            console.log(data);
            if(data.success){
                
                window.location.href = "user.html";  
            }
        }
    });
}
var ads;
var setAdsPage = function (page){
    page --;
    var k = 0;
    for(let i = page*4; i<(page*4)+4; i++){
        if(ads[i] != null && typeof ads[i] != 'undefined'){            
            document.getElementById("ad-"+k).style.display = 'block';
                    document.getElementById("ad-img-"+k).src = ads[i].images[0];
                    document.getElementById("ad-title-"+k).innerHTML = ads[i].title;
                    document.getElementById("visualizza-"+k).setAttribute("href",'Annuncio.html?id='+ads[i].id);
                    document.getElementById("modifica-"+k).setAttribute("href",'Modifica_Annuncio.html?id='+ads[i].id);
                    document.getElementById("elimina-"+k).value = ads[i].id;
            k ++;
        } else {
            document.getElementById("ad-"+k).style.display = 'none';
            k++;
        }
    }
    
}
$(document).ready(function(){
    document.getElementById("header_not_registered").style.display = 'none';
    document.getElementById("header_registered").style.display = 'none';
    document.getElementById("page_registered").style.display = 'none';
    document.getElementById("page_not_registered").style.display = 'none';
    var req = new XMLHttpRequest();
    req.open('GET', "https://messageinabot.herokuapp.com/users?token="+getCookie('token'));
    req.onreadystatechange = myResponseHandler;
    req.send();
    $.get("https://messageinabot.herokuapp.com/users?token="+getCookie('token'),{},function(data){
        if(data.success){
            document.getElementById("header_registered").style.display = 'block';
            document.getElementById("page_registered").style.display = 'block';
            document.getElementById("nome").innerHTML = "Benvenuto" + " " + data.name;
            document.getElementById("generalita").innerHTML = data.name+" "+ data.surname;
            document.getElementById("img_profilo").src = data.image;
            document.getElementById("avatarPage").style.backgroundImage = "url('"+data.image+"')";
            document.getElementById("modificaAccount").setAttribute("href",'modifica_user.html?id='+data.id);
            id = data.id;
            jQuery.get("https://messageinabot.herokuapp.com/ads?fromLast=true&user="+data.id,{},function(data){
                if(data.success){
                    ads = data.ads;
                    var url = new Array();
                    var offset_url = new Array();
                    var length = data.ads.length;
                    var pag = Math.ceil(length /4.0);
                    var lista = document.getElementById("choose-page");
                    for (let i = 1; i<= pag; i++){
                        var actualNum = document.createElement("LI");
                        actualNum.innerHTML = '<a class="page-link" id="'+i+'page'+'" href="javascript:setAdsPage('+i+')">'+i+'</a>';
                        actualNum.className = 'page-item';
                        lista.appendChild(actualNum);
                    }
                    setAdsPage(1);
                }
            });
        }
    });
    
    
    $("#removeUser").click(function(){
        $.ajax({
            type: "DELETE",
            url: "https://messageinabot.herokuapp.com/users/"+id+"?token="+getCookie('token'),
            data: {},
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (data){
                console.log(data);
                if(data.success){
                    
                    deleteCookie('token');
                    window.location.href = "index.html"; }
            }
        });
    });
});
