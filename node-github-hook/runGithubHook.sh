ps -aux | grep "node githubhook.js" | grep -v grep | awk '{print "kill -9 " $2}' | sh
rm -f githubhook.out 
touch githubhook.out 
node githubhook.js > githubhook.out &
echo "Now tailling githubhook.out, ^C to quit logs tailling only..."
tail -f githubhook.out 
 
