
| Metodo | path | parametri input | parametri output |
| ------ | ---- | --------------- | ---------------- |
| POST | /signup | name, surname, email, password (image, phone) | success, token |
| POST | /login | email, password | success, token |
| GET | reserved/userdata | token | success, name, surname, email, image, phone |
| POST | /reserved/updateuser | token, (name, surname, email, password image, phone) | success, log |
| POST | /reserved/deleteuser | token | success, log |
