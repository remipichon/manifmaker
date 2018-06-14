class CommonNavbar extends BlazeComponent {

  constructor() {
    super();
    this.self = this;
    this.timedUpdate();
    this.highlightEffect = null;
    this.updateInfoLastSize = 0;
  }

  lastUpdateDate() {
    var doAnimate = true;
    var updateInfo = UpdateInfo.find({}).fetch();

    if (updateInfo.length == 0) {
      return "nothing has been updated yet";
    }

    //prevent animating if updateInfo didn't changed (don't know why but lastUpdateDate is fired when switching page)
    if (updateInfo.length === this.updateInfoLastSize) {
      doAnimate = false;
    }
    this.updateInfoLastSize = updateInfo.length;

    var lastInfo = updateInfo[updateInfo.length - 1];
    var lastDate = new moment(lastInfo.date);

    if (doAnimate) {
      //highlight effect
      var startOpacity = 0.6;
      var opacity = startOpacity;
      var duration = 2000; //miliseconds
      var delay, step;
      var step = 0.01;
      var numberOfSteps = 0.6 / step;
      var delay = duration / numberOfSteps;
      var iconTurn = 1;
      var rotationStep = iconTurn * 360 / numberOfSteps
      var rot = 0;

      clearInterval(this.highlightEffect); //remove previous animation if several update are fire at the the same time
      this.highlightEffect = setInterval(_.bind(function () {
        var icon = this.$(".lastUpdate .mdi");
        if (!icon) { //we probably are on a page what doesn't have CommonNavBar
          clearInterval(this.highlightEffect);
          return;
        }

        //color highlight
        opacity = opacity - step;
        this.$(".lastUpdate").css("background", `rgba(57, 241, 44, ${opacity})`);

        //icon rotation
        rot += rotationStep;
        icon.css("-webkit-transform", `rotate(${rot}deg)`);
        icon.css("-moz-transform", `rotate(${rot}deg)`);
        icon.css("-ms-transform", `rotate(${rot}deg)`);
        icon.css("-o-transform", `rotate(${rot}deg)`);
        icon.css("transform", `rotate(${rot}deg)`);

        if (opacity <= 0) {
          clearInterval(this.highlightEffect);
        }

      }, this), delay);

    }

    return lastDate.format("H[h]mm ss[sec]");
  }


  updateClock() {
    var now = moment(),
      second = now.seconds() * 6,
      minute = now.minutes() * 6 + second / 60,
      hour = ((now.hours() % 12) / 12) * 360 + 90 + minute / 12;

    self.$('#hour').css("transform", "rotate(" + hour + "deg)");
    self.$('#minute').css("transform", "rotate(" + minute + "deg)");
    self.$('#second').css("transform", "rotate(" + second + "deg)");
  }

  timedUpdate() {
    this.updateClock();
    setTimeout(_.bind(this.timedUpdate, this), 1000);
  }


}

CommonNavbar.register("CommonNavbar");

