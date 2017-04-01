
HTTP.methods({
    'export_status/:fileName/:status': {
        get: function() {
            console.log("Http request export_status/"+this.params.fileName+"/"+this.params.status);
            var fileName = this.params.fileName;
            var status = this.params.status;
            // var sessionId = this.params.sessionId; //TODO make use of it
            // var status = this.params.status; //TODO make use of it ?
            var fileStatus = ExportStatus.findOne({fileName: fileName});
            if (fileStatus) {
                ExportStatus.update({fileName: fileName}, {$set: {status: status}});
            } else {
                ExportStatus.insert({fileName: fileName, status: status});
            }


            return 'Thanks';
        }
    }
});