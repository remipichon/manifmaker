date +"%m-%d-%y %T"
echo 'ManifMaker doing fetch origin/deploy '

cd ~/manifmaker
git checkout deploy
git pull


