date +"%m-%d-%y %T"
echo 'ManifMaker doing fetch origin/deploy '
docker stop manifmaker:deploy_demo
docker run -rm manifmaker:deploy_demo

