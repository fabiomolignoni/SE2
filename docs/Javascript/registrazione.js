function doRedirect() {
    
    location.href = "index.html";
}
$(document).ready(function(){
    
    var jform = new FormData();
    
    
    document.getElementById("alert").style.display = 'none';
    document.getElementById("success").style.display = 'none';
    
    $("#submit").click(function(){
        document.getElementById("submit").style.display = 'none';
        if(controllo_form()){
            jform.append("name", $("#name").val());
            jform.append("surname", $("#surname").val());
            jform.append("email", $("#email").val());
            jform.append("password", $("#password").val());
            jform.append("phone", $("#phone").val());
            jform.append("image", $('input[type=file]')[0].files[0]);
            
            
            
            var http = new XMLHttpRequest();
            var url = "https://messageinabot.herokuapp.com/users";
            http.open("POST", url, true);
            
            http.onreadystatechange = function() {
                
                if (this.readyState == 3 && this.status == 403) {
                    document.getElementById("alert").innerHTML = "Errore, controlla di aver scritto tutto correttamente!";
                    document.getElementById("alert").style.display = 'block';
                    document.getElementById("submit").style.display = 'block';
                    
                }
                
                if (this.readyState == 3 && this.status == 500) {
                    document.getElementById("alert").innerHTML = "Errore, email già utilizzata per un altro account!";
                    document.getElementById("alert").style.display = 'block';
                    document.getElementById("submit").style.display = 'block';
                    
                }
                
                if (this.readyState == 4 && this.status == 200) {
                    document.getElementById("alert").style.display = 'none';
                    document.getElementById("success").style.display = 'block';
                    document.getElementById("success").innerHTML = "Congratulazioni, registrazione avvenuta con successo!";
                    window.setTimeout(doRedirect(), 8000);
                    
                }
            };
            http.send(jform);
            
            
            
        }else{
            document.getElementById("submit").style.display = 'block';
        }
        
    });
});