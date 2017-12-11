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




var deleteImage = function(image){
    document.getElementById(image).style.display = 'none';
    
    
}


$(document).ready(function(){
    var deleteimage = "undefined";
    for(i=0;i<3;i++){
        document.getElementById("img_r"+i).style.display = "none";
        document.getElementById("elimina_"+i).style.display = 'none';
    }
    document.getElementById("price").style.display = 'none';
    var id = findGetParameter("id");
    
    var jform = new FormData();
    document.getElementById("alert").style.display = 'none';
    document.getElementById("success").style.display = 'none';
    
    
    
    $.get("https://messageinabot.herokuapp.com/ads/"+id,{},function(data){
        
        for(i = 0;i<3;i++){    
            document.getElementById("img_"+i).src = data.ad.images[i];
            var prova =  document.getElementById("img_"+i).getAttribute("src");
            
            if( prova != "undefined"){
                
                
                document.getElementById("elimina_"+i).style.display = 'block';
                
            }else{
                document.getElementById("img_r"+i).style.display = 'block';
            }
            
        }
        
        document.getElementById(data.ad.category).selected = true;
        document.getElementById("name").setAttribute("value",data.ad.title);
        document.getElementById("description").innerHTML = data.ad.desc;
        
        document.getElementById("price").setAttribute("value",data.ad.price);
        
        
        
        
        
        
    });
    
    $("#submit").click(function(){
        document.getElementById("submit").style.display = 'none';
        jform.append("title", $("#name").val());
        jform.append("desc", $("#description").val());
        jform.append("category", $("#categ").val());
        jform.append("price", $("#price").val());
        jform.append("image1", $('input[type=file]')[0].files[0]);
        jform.append("image2", $('input[type=file]')[1].files[0]);
        jform.append("image3", $('input[type=file]')[2].files[0]);
        jform.append("deleteImages",deleteimage);
        jform.append("token", getCookie('token'));
        $.ajax({
            type: "PUT",
            enctype: 'multipart/form-data',
            url: "https://messageinabot.herokuapp.com/ads/"+id,
            data: jform,
            
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            success: function (data){
                if(data.success){
                    document.getElementById("alert").style.display = 'none';
                    document.getElementById("success").style.display = 'block';
                    document.getElementById("success").innerHTML = "Congratulazioni, annuncio modificato con successo!";
                    window.setTimeout(function(){
                        location.href = "Annuncio.html?id="+id;
                    }, 5000);
                }else{
                    
                    document.getElementById("alert").style.display = 'block';
                    document.getElementById("submit").style.display = 'block';
                    document.getElementById("alert").innerHTML = "Errore, controlla di aver scritto tutto correttamente!";
                }
                
            }
        });
        
        
    });
    
    $("#checkbox_price").click(function(){
        
        if(document.getElementById("checkbox_price").value == 'Aggiungi prezzo' ){
            document.getElementById("price").style.display = 'block';
            document.getElementById("checkbox_price").value = 'Togli prezzo';
        }else{
            document.getElementById("price").style.display = 'none';
            document.getElementById("checkbox_price").value =  'Aggiungi prezzo';
        }
    });
    
    var delete_img = function(img){
        if(deleteimage == "undefined"){
            deleteimage = document.getElementById(img).src;
        }
        else{
            deleteimage = deleteimage+","+ document.getElementById(img).src;
        }
        
    };
    
    
    $("#elimina_0").click(function(){
        document.getElementById("img_r0").style.display = "block";
        deleteImage("img_0");
        document.getElementById("elimina_0").style.display = "none";
        delete_img("img_0");
        
        
        
        
    });
    
    $("#elimina_1").click(function(){
        document.getElementById("img_r1").style.display = "block";
        deleteImage("img_1");
        document.getElementById("elimina_1").style.display = "none";
        delete_img("img_1");
        
        
    });
    $("#elimina_2").click(function(){
        document.getElementById("img_r2").style.display = "block";
        deleteImage("img_2");
        document.getElementById("elimina_2").style.display = "none";
        delete_img("img_2");
        
        
    });
    
});



    
    
        