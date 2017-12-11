$(document).ready(function(){
    
    
    document.getElementById("alert").style.display = 'none';
    document.getElementById("success").style.display = 'none';
    
    
    
    $("#submit").click(function(){
        document.getElementById("submit").style.display = 'none';
        
        var email=$("#email").val();
        var pass=$("#password").val();
        
        
        var http = new XMLHttpRequest();
        var url = "https://messageinabot.herokuapp.com/users/login";
        http.open("POST", url, true);
        http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        http.onreadystatechange = function() {
            
            if (this.readyState == 3 && this.status == 403) {
                
                document.getElementById("alert").innerHTML = "Possibile errore, controlla di aver scritto tutto correttamente!";
                document.getElementById("alert").style.display = 'block';
                document.getElementById("submit").style.display = 'block';
                
            }
            
            if (this.readyState == 4 && this.status == 200) {
                var tmp =JSON.parse(http.responseText);
                
                
               if(tmp.success){
      
        document.getElementById("alert").style.display = 'none';
             document.getElementById("success").innerHTML = "Congratulazioni, registrazione avvenuta con successo!";
          document.getElementById("success").style.display = 'block';
          document.cookie="token="+tmp.token;
          console.log(document.cookie);
          location.href='index.html';
      }
      else{
          document.getElementById("alert").innerHTML = "Possibile errore, controlla di aver scritto tutto correttamente!";
     document.getElementById("alert").style.display = 'block';
     document.getElementById("submit").style.display = 'block';
      }
                
                
            }
            
            
        }; 
        var requestUrl = "email="+email+"&password="+pass;
        http.send(requestUrl);
        
    });
});
