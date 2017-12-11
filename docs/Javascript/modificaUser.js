/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function doRedirect() {
    
    location.href = "index.html";
}
function getCookie(name)
{
    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
};



$(document).ready(function(){
    document.getElementById("page_registered").style.display = 'block';
    document.getElementById("page_not_registered").style.display = 'none';                
    document.getElementById("alert").style.display = 'none';
    document.getElementById("success").style.display = 'none';
    var id = 0;
    $.get("https://messageinabot.herokuapp.com/users?token="+getCookie('token'),{},function(data){
        if(data.success){
            document.getElementById("page_registered").style.display = 'block';
            document.getElementById("page_not_registered").style.display = 'none';
            document.getElementById("name").setAttribute("value", data.name);
            document.getElementById("surname").setAttribute("value", data.surname);
            document.getElementById("email").setAttribute("value", data.email);
            id = data.id;
            if(typeof data.phone !== 'undefined'){
                document.getElementById("phone").setAttribute("value", data.phone);
            }                       
            
        }
    });
    
    var jform = new FormData();                
    $("#submit").click(function(){
        console.log("submit");
        if(controllo_form()){
            jform.append("name", $("#name").val());
            jform.append("surname", $("#surname").val());
            jform.append("email", $("#email").val());
            jform.append("password", $("#password").val());
            jform.append("phone", $("#phone").val());
            jform.append("token", getCookie('token'));
            if($('input[type=file]')[0].files[0] !== null){
                jform.append("image", $('input[type=file]')[0].files[0]);
            }
            
            $.ajax({
                type: "PUT",
                enctype: 'multipart/form-data',
                url: "https://messageinabot.herokuapp.com/users/"+id,
                data: jform,
                
                processData: false,
                contentType: false,
                cache: false,
                timeout: 600000,
                success: function (data){
                    if(data.success){
                        document.getElementById("alert").style.display = 'none';
                        document.getElementById("success").style.display = 'block';
                        document.getElementById("success").innerHTML = "Congratulazioni, modifiche avvenute con successo!";
                        window.setTimeout(doRedirect(), 8000);
                        
                    }else{
                        
                        document.getElementById("alert").style.display = 'block';
                        document.getElementById("alert").innerHTML = "Errore, controlla di aver scritto tutto correttamente!";
                    }
                    
                }
            });
            
        }
    });                            
});




