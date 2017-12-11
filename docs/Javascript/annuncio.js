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


function findUserName(param){
    $.ajax({
        type: "GET",
        enctype: 'multipart/form-data',
        url: param,
        
        
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (data){
            
            document.getElementById("user_name").innerHTML = data.name;
            document.getElementById("user_surname").innerHTML = data.surname;
            document.getElementById("utente_img").src= data.image;
            if(data.phone != null){
                document.getElementById("phone").setAttribute("href",'tel:'+data.phone);
                document.getElementById("phone").innerHTML = data.phone;
            }
            document.getElementById("email_user").setAttribute("href",'mailto:'+data.email);
            document.getElementById("email_user").innerHTML = data.email;
            
        }
    });
    
}
$(document).ready(function(){
    var id = findGetParameter("id");
    
    document.getElementById("header_not_registered").style.display = 'none';
    document.getElementById("header_registered").style.display = 'none';
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
    
    $.get("https://messageinabot.herokuapp.com/ads/"+id,{},function(data){
        
        for(i = 0;i<3;i++){
            if(data.ad.images[i] == null){
                
                
                var tmp= document.getElementById("carousel_"+i);
                tmp.parentNode.removeChild(tmp);
                
            }
            else{
                
                document.getElementById("img_"+i).src = data.ad.images[i];
                
            }
            
        }
        
        
        document.getElementById("titolo").innerHTML = data.ad.title;
        document.getElementById("descrizione").innerHTML = data.ad.desc;        
        document.getElementById("data").innerHTML = convertDate(data.ad.date);
        document.getElementById("categoria").innerHTML = data.ad.category;
        
        if(data.ad.price == 0.00){
            document.getElementById("prezzo").innerHTML = "Gratis";
        }
        else
        {
            document.getElementById("prezzo").innerHTML = data.ad.price + "€";
        }
        var user = data.user;
        findUserName(user);
    });
    
    
    
    
    // Get the modal
    var modal = document.getElementById('myModal');
    
    // Get the button that opens the modal
    var btn = document.getElementById("contatta");
    
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    
    // When the user clicks on the button, open the modal 
    btn.onclick = function() {
        modal.style.display = "block";
    }
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    
    
    
});