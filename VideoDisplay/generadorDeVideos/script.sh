#!/bin/bash

if [ -z "$(which ffmpeg)" ]; then
    echo "Error: ffmpeg no esta instalado"
    exit 1
fi

if [ -z "$(which MP4Box)" ]; then
    echo "Error: MP4Box no esta instalado"
    exit 1
fi


if [ -e $1 ]
then
  f=$1
  f="${f%.*}"

  if [ ! -d "dash_${f}" ]; then

    ffmpeg -y -i "${f}.mp4" -c:a aac -ac 2 -ab 128k -vn "${f}_audio.m4a"

    ffmpeg -y -i "${f}.mp4" -an -c:v libx264 -x264opts 'keyint=24:min-keyint=24:no-scenecut' -b:v 1500k -vf "scale=-2:720" -f mp4 -pass 1 -y /dev/null
    ffmpeg -y -i "${f}.mp4" -an -c:v libx264 -x264opts 'keyint=24:min-keyint=24:no-scenecut' -b:v 1500k -vf "scale=-2:720" -f mp4 -pass 2 "${f}_1500.mp4"

    ffmpeg -y -i "${f}.mp4" -an -c:v libx264 -x264opts 'keyint=24:min-keyint=24:no-scenecut' -b:v 800k -vf "scale=-2:540" -f mp4 -pass 1 -y /dev/null
    ffmpeg -y -i "${f}.mp4" -an -c:v libx264 -x264opts 'keyint=24:min-keyint=24:no-scenecut' -b:v 800k -vf "scale=-2:540" -f mp4 -pass 2 "${f}_800.mp4"

    ffmpeg -y -i "${f}.mp4" -an -c:v libx264 -x264opts 'keyint=24:min-keyint=24:no-scenecut' -b:v 400k -vf "scale=-2:360" -f mp4 -pass 1 -y /dev/null
    ffmpeg -y -i "${f}.mp4" -an -c:v libx264 -x264opts 'keyint=24:min-keyint=24:no-scenecut' -b:v 400k -vf "scale=-2:360" -f mp4 -pass 2 "${f}_400.mp4"

    ffmpeg -y -i "${f}.mp4" -an -c:v libx264 -x264opts 'keyint=24:min-keyint=24:no-scenecut' -b:v 200k -vf "scale=-2:180" -f mp4 -pass 1 -y /dev/null
    ffmpeg -y -i "${f}.mp4" -an -c:v libx264 -x264opts 'keyint=24:min-keyint=24:no-scenecut' -b:v 200k -vf "scale=-2:180" -f mp4 -pass 2 "${f}_200.mp4"

    rm -f ffmpeg*log*

    if [ -e "${f}_audio.m4a" ]
    then
      MP4Box -dash 2000 -rap -frag-rap -profile OnDemand "${f}_1500.mp4" "${f}_800.mp4" "${f}_400.mp4" "${f}_200.mp4" "${f}_audio.m4a" -out "${f}.mpd"
    else
      MP4Box -dash 2000 -rap -frag-rap -profile OnDemand "${f}_1500.mp4" "${f}_800.mp4" "${f}_400.mp4" "${f}_200.mp4" -out "${f}.mpd"
    fi

    rm  "${f}_1500.mp4" "${f}_800.mp4" "${f}_400.mp4" "${f}_200.mp4" "${f}_audio.m4a"
  fi
else
  echo "No existe el archivo "$1
fi
