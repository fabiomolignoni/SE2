
| Metodo | path | parametri input | parametri output |
| ------ | ---- | --------------- | ---------------- |
| POST | https://messageinabot.herokuapp.com/signup | name, surname, email, password (image, phone) | success, token |
| POST | https://messageinabot.herokuapp.com/login | email, password | success, token |
| GET | https://messageinabot.herokuapp.com/reserved/userdata | token | success, name, surname, email, image, phone |
| POST | https://messageinabot.herokuapp.com/reserved/updateuser | token, (name, surname, email, password image, phone) | success, log |
| POST | https://messageinabot.herokuapp.com/reserved/deleteuser | token | success, log |
