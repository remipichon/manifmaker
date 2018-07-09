Template.confMaker.events = ({
  "show.bs.collapse	#conf-maker-wrapper .panel": e => {
    let reference = $(e.target).attr("listUrl");
    Router.go(`/conf-maker/${reference}`); //sry
  },
});

Template.teamInsert.events = ({
  "click [type=button]": e => {
    window.confMakerReturnTo = true;
    $(e.target).submit();
  }
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