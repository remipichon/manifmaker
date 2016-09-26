if docker ps | grep $CONTAINER_NAME
  then docker rm -fv $CONTAINER_NAME
  else echo $CONTAINER_NAME was not running
fi