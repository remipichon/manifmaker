export class DownloadPdfComponent extends BlazeComponent {

  template() {
    return "downloadPdfComponent";
  }

  onRendered() {
    var user = this.data().user;
    var options = [{
      url: "/user/" + user._id + "/export/html/clean",
      fileName: user.username + ".pdf"
    }];
    //calling Meteor backend to generate PDF right away
    Meteor.call("generatePdf", options, _.bind(function (error, result) {
      if (error) {
        console.error("generatePdf", error)
      }
      //generate pdf feedback is managed elsewhere
    }, this));
  }

  getStatus() {
    var status = ExportStatus.findOne({fileName: this.currentData().fileName}).status;
    return (ExportPdfStatus[status]) ? ExportPdfStatus[status] : status;
  }

  getDownloadUrl() {
    if (this.getStatus() == "die")
      return ExportStatus.findOne({fileName: this.currentData().fileName}).downloadUrl;
  }


}

DownloadPdfComponent.register("DownloadPdfComponent");
