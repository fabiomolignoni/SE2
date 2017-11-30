API

Utente

| Metodo | path | parametri input | parametri output |
| ------ | ---- | --------------- | ---------------- |
| POST | https://messageinabot.herokuapp.com/signup | name, surname, email, password (image, phone) | success, token |
| POST | https://messageinabot.herokuapp.com/login | email, password | success, token |
| GET | https://messageinabot.herokuapp.com/reserved/userdata | token | success, name, surname, email, image, phone |
| POST | https://messageinabot.herokuapp.com/reserved/updateuser | token, (name, surname, email, password image, phone) | success, log |
| POST | https://messageinabot.herokuapp.com/reserved/deleteuser | token | success, log |

Ad

| Metodo | funzione | path | parametri input | parametri output |
| ------ | -------- | ---- | --------------- | ---------------- |
| POST | creare un annuncio (necessario multipart) | https://messageinabot.herokuapp.com/ads | title, desc, category, price (images), token | success |
| PUT | aggiornare un annuncio (necessario multipart, deleteImages è un array di link) | https://messageinabot.herokuapp.com/ads/<id_ad> | (title, desc, category, price images, deleteImages), token | success |
| DELETE | eliminare un annuncio | https://messageinabot.herokuapp.com/ads/<id_ad> | token | success |
| GET | prendere singolo annuncio | https://messageinabot.herokuapp.com/ads/<id_ad> |  | success, ad |
| GET | https://messageinabot.herokuapp.com/ads | (q, category, gratis, limit, offset, fromLast) | success, ads |
