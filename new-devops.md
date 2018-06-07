# dev install
some stuff to add by hand

# build push image
```bash

cd app
MANIFMAKER_VERSION=$(cat package.json | jq -r .version)
docker build -f Dockerfile.manifmaker-image -t assomaker/manifmaker:$MANIFMAKER_VERSION .
docker push assomaker/manifmaker:$MANIFMAKER_VERSION
```

# deploy preprod-prod
new docker compose v3 for VOC