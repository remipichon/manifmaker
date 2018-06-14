
HTTP.methods({
    'export_status/:fileName/:status': {
        get: function() {
            console.log("Http request export_status/"+this.params.fileName+"/"+this.params.status);
            var fileName = this.params.fileName;
            var status = this.params.status;
            // var sessionId = this.params.sessionId; //TODO make use of it
            // var status = this.params.status; //TODO make use of it ?
            var downloadUrl = Meteor.nginxEndpoint + fileName;
            var fileStatus = ExportStatus.findOne({fileName: fileName});
            if (fileStatus) {
                ExportStatus.update({fileName: fileName}, {$set: {status: status, downloadUrl:downloadUrl}});
            } else {
                ExportStatus.insert({fileName: fileName, status: status, downloadUrl:downloadUrl});
            }

            return 'Thanks';
        }
    },
    'api/:resource/:action':{
        get:function () {
            console.log("Http request api/"+this.params.resource+"/"+this.params.action);
            var resource = this.params.resource;
            var action = this.params.action;
            if(!ApiResourceAction[resource] || !ApiResourceAction[resource][action]){
                this.setStatusCode(405);
                return JSON.stringify({statusCode : 405, error: `$action is not possible for $resource`}, null, '\t');
            }
            return ApiResourceAction[resource][action].call()
        }
    }
});