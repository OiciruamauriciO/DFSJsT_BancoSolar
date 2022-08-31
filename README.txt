Posibilidades de mejora para otra versión

¿Qué pasa si el usuario se encuentra duplicado, cuando se busca por nombre, el id del mismo, para la inserción de una transacción cualquiera que tenga este contexto? 

Surge debido a la implementación del index.html, que se toma como base. Ésta implementación base, pasa como valor el nombre del campo input, y aquel no es del tipo 
que tiene la llave foránea en la tabla transferencias para la otra entidad con la que se relaciona, usuarios. Es decir, debe buscarse el id del usuario por nombre 
Nombre en la tabla usuarios de acuerdo a tal nombre que toma desde la vista, por ahora se asume que no se puede repetir (aunque no esté controlado de manera alguna, 
pero es bueno que pueda controlarse, sino se pretende cambiar el index.html y lo que originalmente contiene).

¿Qué sucede si el usuario decide transferirse a si mismo?

Tampoco está controlado, aunque parezca implícito (y lo es), que no se deba transferir de un usuario a si mismo, la lógica no es correcta actualmente para ese caso 
de uso, sin embargo, la prueba no hace mención explícita a eso, con lo que no lo hice. También se entiende por el modelo de datos, que no se puede eliminar un usuario
, a menos que no tenga relaciones con la tabla de transferencias.

¿El usuario recibe retroalimentación del hecho anterior?

El usuario no es informado, con algún alert siquiera, de lo anterior, aunque es implícito, no es pedido de manera explícita por el documento de la prueba Banco Solar.

Con estas excepciones de base, me disculpo, si las consideran deberían ir, pero, no fueron solicitadas de manera explícita.

Saludos y que esté super aquel que revise esto.