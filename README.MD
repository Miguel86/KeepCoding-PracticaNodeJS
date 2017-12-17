#Pasos para el despliegue

##Instalar los módulos necesarios
```
npm install
```

##Inicializar la base de datos de MongoDB
```
npm run installDB
```

##Modos de arranque del servidor
* Desarrollo
```
npm run dev
```
* Desarrollo con clusters
```
npm run clusterdev
```
* Producción
```
npm run start
```
* Producción con clusters
```
npm run cluster
```

##Peticiones disponibles en el API
* Petición GET a: ```/anuncios``` devuelve la lista de anuncios.
* Petición GET a  ```/anuncios/tags``` devuelve la lista de tags en uso en la base de datos de artículos.
* Petición POST a: ```/anuncios``` crea un nuevo anuncio.
* Petición POST a ```/usuarios/authenticate``` identifica al usuario en el sistema.
* Petición POST a ```/usuarios/registro``` crea un nuevo usuario en el sistema.


##Estructura del repositorio
**/data** contiene los ficheros .JSON para inicializar la base de datos de MongoDB.

**/language** contiene las cadenas de idioma de los mensajes a devolver al usuario.

**/lib** contiene clases de ayuda necesarias para autenticar, acceder a la base de datos, etc.

**/models** contiene los modelos de la base de datos.

**/public** contiene ficheros de ayuda como las imágenes o CSS en el caso de que se hiciera una web posteriormente.

**/postman_tests** contiene un fichero .JSON a importar en POSTMAN. Dicho fichero tiene una serie de peticiones de prueba del API.

**/routes** contiene las rutas de las peticiones disponibles en la API.

**/scripts** contiene el script que se encarga de inicializar la base de datos.