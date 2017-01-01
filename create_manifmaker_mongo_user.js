try{ 
	db.createUser( { user: "manifmaker",
	    pwd: "manifmaker",
	    roles: [ "readWrite", "dbAdmin" ]
	});
} catch (e){
	print(e);
	if(e.message.indexOf("already exists") !== -1)
		print("Existing user is not an error");
	else {
		print("Throw error from Mongo script")
		throw e;
	}
}