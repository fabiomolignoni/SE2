/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$(function() {
            var suggerimenti  =  [
               "Arredi",
               "Arredi sanitari",
               "Arredi scolastici",
               "Ferrari",
               "Fermacarte",
               "Frisbee",
               "Fermaporte",
               "Fettuccine panate"
            ];
            $( "#searchbar-header" ).autocomplete({
               source: suggerimenti
            });
         });

