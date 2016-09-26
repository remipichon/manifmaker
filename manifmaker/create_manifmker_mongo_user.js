db.createUser( { user: "manifmaker",
    pwd: "manifmaker",
    roles: [ "readWrite", "dbAdmin" ]
});


#docker cp run.js manifmaker-mongo:/root/create_manifmker_mongo_user.js
#docker exec -ti manifmaker-mongo mongo localhost:27017/manifmaker_MANIFMAKER_VERSION /root/create_manifmker_mongo_user.js




