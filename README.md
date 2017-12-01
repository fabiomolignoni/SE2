API

Utente

| Metodo | Funzione | path | parametri input | parametri output |
| ------ | -------- | ---- | --------------- | ---------------- |
| POST | iscrizione al sito | https://messageinabot.herokuapp.com/users | name, surname, email, password (image, phone) | success, token |
| POST | login | https://messageinabot.herokuapp.com/users/login | email, password | success, token |
| GET | ricevere dati utente associati ad un token | https://messageinabot.herokuapp.com/users | token | success, name, surname, email, image, phone |
| GET | ricevere dati utente associati ad un id | https://messageinabot.herokuapp.com/users/<user_id> | token | success, name, surname, email, image, phone |
| PUT | modificare i dati di un utente | https://messageinabot.herokuapp.com/users/<user_id> | token, (name, surname, email, password image, phone) | success, log |
| DELETE | eliminare i dati di un utente | https://messageinabot.herokuapp.com/users/<user_id> | token | success, log |

Ad

| Metodo | funzione | path | parametri input | parametri output |
| ------ | -------- | ---- | --------------- | ---------------- |
| POST | creare un annuncio (necessario multipart) | https://messageinabot.herokuapp.com/ads | title, desc, category, price (images), token | success |
| PUT | aggiornare un annuncio (necessario multipart, deleteImages è un array di link) | https://messageinabot.herokuapp.com/ads/<id_ad> | (title, desc, category, price images, deleteImages), token | success |
| DELETE | eliminare un annuncio | https://messageinabot.herokuapp.com/ads/<id_ad> | token | success |
| GET | prendere singolo annuncio | https://messageinabot.herokuapp.com/ads/<id_ad> |  | success, ad |
| GET | recuperare annunci | https://messageinabot.herokuapp.com/ads | (q (query da fare), category (deve essere una tra "libri", "appunti", "stage/lavoro", "ripetizioni","eventi"), lessThan, limit, offset, fromLast (booleano, di default false), title (stringa, se definita si cerca solo annunci con questo titolo), user (inserire id). Se non si definisce alcun parametro ritorna TUTTI gli ads del DB | success, ads (array) |
