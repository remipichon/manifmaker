
export class DownloadPdfComponent extends BlazeComponent{

    template(){
        return "downloadPdfComponent";
    }

    onRendered(){
        var user = this.data().user;
        var options = [{
            url :  "/user/" + user._id + "/export/html",
            fileName: user.username + ".pdf"
        }];
        //calling Meteor backend to generate PDF right away
        Meteor.call("generatePdf",options,_.bind(function(error, result){
            if(error){
                console.error("generatePdf",error)
            }
            //generate pdf feedback is managed elsewhere
        },this));
    }

    getStatus(){
        return ExportStatus.findOne({fileName:this.currentData().fileName}).status;
    }


}

DownloadPdfComponent.register("DownloadPdfComponent");
