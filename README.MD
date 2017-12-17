# Despliegue

## Instalar los módulos necesarios
```
npm install
```

## Inicializar la base de datos de MongoDB
```
npm run installDB
```

## Configurar la API
Para ello es necesario renombrar el fichero **.env.example** a **.env** y cubrir los valores de configuración descritos en el fichero.

## Modos de arranque del servidor
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



# Uso de la API
## Peticiones disponibles
### Petición POST a ```/usuarios/registro```
Crea un nuevo usuario en el sistema.

**Parámetros**

* nombre
* clave
* email

Todos los parámetros son obligatorios.

### Petición POST a ```/usuarios/authenticate```
Identifica al usuario en el sistema.

**Parámetros**

* email
* clave

Todos los parámetros son obligatorios.

**Respuesta**

El sistema devuelve el campo token a utilizar en las peticiones de los anuncios.

### Petición GET a: ```/anuncios``` 
Devuelve la lista de anuncios.

**Parámetros**

* limit: para limitar el número de resultados que devuelve el API.
* skip: para que no muestre los x primeros resultados
* sort: para ordenar por ese campo
* fields: para mostrar en el resultado sólo ciertos campos de los anuncios (por defecto muestra todos).
* venta: para mostrar los artículos en venta pasar el valor **true**), en caso de mostrar las ofertas de compra pasar el valor **false**.
* tag: para mostrar sólo los anuncios que tienen dicho tag.
* nombre: para mostrar los anuncios cuyo título comienza por dicho nombre.
* precio: para filtrar los anuncios en función del precio. Ej: si se pone 50- muestra los anuncios cuyo precio sea 50 o superior. Si se pone -50 muestra los anuncios cuyo precio sea inferior a 50. Si se pone 40-50 muestra los anuncios cuyo precio este comprendido en el intervalor de 40 a 50. Si se pone 40 muestra los anuncios con precio 40.
* token: token devuelvo en la petición **/usuarios/authenticate**

Todos los parámetros son opciones a excepción del token.

**Respuesta**

El sistema devuelve todos los anuncios que coincidan con los parámetros pasados.

### Petición GET a  ```/anuncios/tags``` 
Devuelve la lista de tags en uso en la base de datos de artículos.

**Parámetros**

Esta petición no espera que se le pase ningún parámetro.

**Respuesta**

El sistema devuelve los distintos tags en uso en los artículos.
 
### Petición POST a: ```/anuncios```
A modo de desarrollo para ver que los filtros funcionaban, se ha creado esta petición que permite crear un nuevo anuncio en la base datos.

**Parámetros**

* nombre
* venta (true | false)
* precio
* foto
* tags

**Respuesta**

Devuelve el anuncio que se ha creado.

##Internacionalización
Para poder devolver los mensajes de error en varios idiomas se ha hecho uso del paquete **i18n** creando en la carpeta **/language** un fichero .JSON con las cadenas en cada uno de los idiomas.
Haciendo uso del parámetro ```Accept-Language``` en las peticiones se puede cambiar que la API devuelva los mensajes en castellano (pasando el valor **es**) o en inglés (pasando el valor **en**).

## Estructura del repositorio
**/data** contiene los ficheros .JSON para inicializar la base de datos de MongoDB.

**/language** contiene las cadenas de idioma de los mensajes a devolver al usuario.

**/lib** contiene clases de ayuda necesarias para autenticar, acceder a la base de datos, etc.

**/models** contiene los modelos de la base de datos.

**/public** contiene ficheros de ayuda como las imágenes o CSS en el caso de que se hiciera una web posteriormente.

**/postman_tests** contiene un fichero .JSON a importar en POSTMAN. Dicho fichero tiene una serie de peticiones de prueba del API.

**/routes** contiene las rutas de las peticiones disponibles en la API.

**/scripts** contiene el script que se encarga de inicializar la base de datos.

## Calidad del código
Para mejorar la calidad del código se ha validado con **ESLint**. Se puede validar utilizando:

```
npm run eslint
```

## Ejemplos
En la capeta ```postman_tests``` se facilita un fichero .JSON que se puede importar en el cliente **Postman** y que crea varias peticiones de ejemplo.

### Autor
Miguel Dos Santos Carregal 
