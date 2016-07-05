date +"%m-%d-%y %T"
echo 'ManifMaker building doc:html'
docker stop manifMaker:build_doc
#docker run -rm manifMaker:build_doc


#deploy doc
docker rm -f nginx
docker run -p 80:80 -p 9000:9000 --name=nginx -v /home/remip/manifmaker/doc/html:/usr/share/nginx/html/doc:ro -d nginx


docker cp  /home/remip/nginx/conf.d/default.conf nginx:/etc/nginx/conf.d/default.conf 
docker exec nginx nginx -s reload


docker exec -ti nginx bash

