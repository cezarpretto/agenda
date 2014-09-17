#!/bin/bash
caminho="/home/operador/Documentos/projetos/agenda/platforms/android/ant-build"
cordova build --release android &&
rm -fr $caminho/Agenda.apk &&
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $caminho/agenda.keystore $caminho/agenda-release-unsigned.apk agenda &&
zipalign -v 4 $caminho/agenda-release-unsigned.apk $caminho/Agenda.apk
echo "APK pronto para Produção =)"
