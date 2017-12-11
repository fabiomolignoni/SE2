function getCookie(name)
{
    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
};



$(document).ready(function(){
    document.getElementById("price").style.display = 'none';
    var jform = new FormData();
    document.getElementById("alert").style.display = 'none';
    document.getElementById("success").style.display = 'none';
    
    
    
    $("#submit").click(function(){
        document.getElementById("submit").style.display = 'none';
        
        
        
        
        jform.append("title", $("#name").val());
        jform.append("desc", $("#description").val());
        jform.append("category", $("#categ").val());
        jform.append("price", $("#price").val());
        jform.append("image1", $('input[type=file]')[0].files[0]);
        jform.append("image2", $('input[type=file]')[1].files[0]);
        jform.append("image3", $('input[type=file]')[2].files[0]);
        jform.append("token", getCookie('token'));
        
        var http = new XMLHttpRequest();
        var url = "https://messageinabot.herokuapp.com/ads";
        http.open("POST", url, true);
        
        http.onreadystatechange = function() {
            if (this.readyState == 3 && this.status == 403) {
                
                document.getElementById("alert").style.display = 'block';
                document.getElementById("submit").style.display = 'block';
                document.getElementById("alert").innerHTML = "Errore, controlla di aver scritto tutto correttamente!";
            }
            
            if(this.readyState == 4 && this.status == 200){
                
                document.getElementById("alert").style.display = 'none';
                document.getElementById("success").style.display = 'block';
                document.getElementById("success").innerHTML = "Congratulazioni, annuncio creato con successo!";
                var tmp =JSON.parse(http.responseText);
                window.setTimeout(function(){
                    location.href = "Annuncio.html?id=" + tmp.id; 
                }, 3000);
                
            }
        };
        http.send(jform);
    });
    $("#checkbox_price").click(function(){
        
        if(document.getElementById("checkbox_price").value == 'Aggiungi prezzo' ){
            document.getElementById("price").style.display = 'block';
            document.getElementById("checkbox_price").value = 'Togli prezzo';
        }else{
            document.getElementById("price").style.display = 'none';
            document.getElementById("price").value = '0.00';
            document.getElementById("checkbox_price").value =  'Aggiungi prezzo';
        }
    });
});
