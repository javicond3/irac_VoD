El script se encarga de convertir un video mp4 normal en un conjunto de archivos, videos y audio que juntos permiten la transmision de un video en streaming. Ademas el script genera el archivo .mpd necesario para este tipo de videos
Para su ejecucion es necesario tener en la misma carpeta el video en mp4 y el script. Ademas de tener instalados los paquetes ffmpeg y MP4Box
Se ejecuta el siguiente comando:
  ./script.sh [nombre del video]
    si este comando no funciona se puede probar con este otro:
  sh script.sh [nombre del video]
Al finalizar la ejecucion se tendra varios archivos nuevos con los siguientes nombres:
  [nombre del video]_200_dashinit.mp4
  [nombre del video]_400_dashinit.mp4
  [nombre del video]_800_dashinit.mp4
  [nombre del video]_1500_dashinit.mp4
  [nombre del video]_audio_dashinit.mp4
  [nombre del video].mpd


Un Ejemplo:
  ./script.sh p2.mp4
Archivos nuevos:
  p2_200_dashinit.mp4
  p2_400_dashinit.mp4
  p2_800_dashinit.mp4
  p2_1500_dashinit.mp4
  p2_audio_dashinit.mp4
  p2.mpd
