Template.confMaker.events = ({
  "show.bs.collapse	#conf-maker-wrapper .panel": e => {
    let reference = $(e.target).attr("listUrl");
    Router.go(`/conf-maker/${reference}`); //sry
  },
});

Template.confMaker.helpers({
  isExpanded(current, expanded) {
    console.log("==",current, expanded)
    if (current == expanded)
      return "in";
    else
      return "";
  }
});