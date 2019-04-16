# IracVoD

## Descripción
Aplicación desarrollo de portal de vídeos para la universidad

## Ficheros
Dentro de la carpeta  se encuentra todos los ficheros necesarios para el correcto despliegue de la aplicación. Posteriormente se comentarán en detalle.


## Variables de entorno 

Son necesarios un archivo para configurar el entorno

`file.env`

```
POSTGRES_DB=irac
DB_USERNAME=postgres
DB_PASSWORD=1234
DB_HOST=localhost
SERVICE=http://localhost:3000
CAS=https://repo.etsit.upm.es/cas-upm
SESSION_SECRET=ejemplo_secret
CONTEXT=/VoD/
PORT=3000
DEV=true
DOCKER=false

```

## Ejecución en producción
```

Una vez configuradas las variables de entorno y el puerto correctamente, para desplegar la aplicación, hay que ir al directorio `iracVoD`, y desde ahí ejecutar el siguiente comando:
npm install
npm start

```


## Nota adicional
 

## Enlaces relevantes

