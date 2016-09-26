MANIFMAKER_VERSION=$(cat manifmaker/package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g')
MANIFMAKER_VERSION=${MANIFMAKER_VERSION:1}
MANIFMAKER_VERSION=$(echo $MANIFMAKER_VERSION | tr . -)
export MANIFMAKER_VERSION