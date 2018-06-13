# dev install
some stuff to add by hand

# build push image
```bash
cd app
MANIFMAKER_VERSION=$(cat package.json | jq -r .version)
docker build -f Dockerfile.manifmaker-image -t assomaker/manifmaker:$MANIFMAKER_VERSION .
docker push assomaker/manifmaker:$MANIFMAKER_VERSION
```

## new way
| from the meteor project (app/)
```bash
# build Meteor
npm install --production
meteor build ./build --architecture os.linux.x86_64

# build Docker
docker build -t manifmaker-node -f Dockerfile.manifmaker-image-newway $(pwd)
```

## test new way
```bash
docker network create manifmaker
docker rm -f mongo_db; docker run --net manifmaker --name mongo_db -d -p 27017:27017 mongo:3.2.6
docker rm -f manifmaker; docker run --env PORT=80 --env MONGO_URL=mongo_db --net manifmaker --name manifmaker -d -p 3000:80 manifmaker-node
docker logs -f manifmaker
```



# deploy preprod-prod
new docker compose v3 for VOC