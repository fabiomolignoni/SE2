#API

##Utente

| Metodo | path | parametri input | parametri output |
| ------ | ---- | --------------- | ---------------- |
| POST | https://messageinabot.herokuapp.com/signup | name, surname, email, password (image, phone) | success, token |
| POST | https://messageinabot.herokuapp.com/login | email, password | success, token |
| GET | https://messageinabot.herokuapp.com/reserved/userdata | token | success, name, surname, email, image, phone |
| POST | https://messageinabot.herokuapp.com/reserved/updateuser | token, (name, surname, email, password image, phone) | success, log |
| POST | https://messageinabot.herokuapp.com/reserved/deleteuser | token | success, log |

##Ad

| Metodo | path | parametri input | parametri output |
| ------ | ---- | --------------- | ---------------- |
| POST | https://messageinabot.herokuapp.com/reserved/createad | title, desc, category, price (images), token | success |
| POST | https://messageinabot.herokuapp.com/reserved/deletead | id, token | success |
| GET | https://messageinabot.herokuapp.com/getads | (searchString, category, gratis, from, to) | success, ads |
| GET | https://messageinabot.herokuapp.com/getlastads | (from, to) | success, ads |
| POST | https://messageinabot.herokuapp.com/reserved/userads | token | success, ads |
