/**
 * Created by Kupletsky Sergey on 17.10.14.
 *
 * Material Sidebar (Profile menu)
 * Tested on Win8.1 with browsers: Chrome 37, Firefox 32, Opera 25, IE 11, Safari 5.1.7
 * You can use this sidebar in Bootstrap (v3) projects. HTML-markup like Navbar bootstrap component will make your work easier.
 * Dropdown menu and sidebar toggle button works with JQuery and Bootstrap.min.js
 *
 * https://codepen.io/zavoloklom/pen/dIgco
 */


class SideBar extends BlazeComponent {

  constructor() {
    super();
    /**
     * Created by Kupletsky Sergey on 08.09.14.
     *
     * Add JQuery animation to bootstrap dropdown elements.
     */
    // Add slidedown animation to dropdown
    $(document).on('show.bs.dropdown', '#sidebar .dropdown', function (e) {
      $(this).find('.dropdown-menu').first().stop(true, true).slideDown();

      //  Add slideup animation to dropdown
      $(this).one('hide.bs.dropdown', function (e) {
        $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
      });
    });

    this.version = new ReactiveVar("-");
    Meteor.call('getVersion', _.bind(function (error, result) {
      // 'result' is the method return value
      this.version.set(result);
    }, this));
  }

  template() {
    return "sideBar"
  }

  events() {
    return [
      {
        "click .sidebar-toggle": this.toggleSideBar,
        "click .sidebar-overlay": this.onClickOverlay,
        "click a[href^='/']": this.hrefOnClick, //all internal routes
        "click a[href^='/logout']": this.logoutOnClick //when logout
      }
    ]
  }

  /**
   * Close the sidebar when the user goes on a new page
   */
  hrefOnClick() {
    if (!$('#sidebar').hasClass("reduced"))
      this.toggleSideBar();
  }

  /**
   * re-open the sidebar with the logging form
   */
  logoutOnClick() {
    this.toggleSideBar();
  }

  /**
   * Open Sidebar if it's closed,
   * Close it if it's open,
   * let it open when we have the logging form
   */
  toggleSideBar() {
    var overlay = $('.sidebar-overlay');
    var sidebar = $('#sidebar');
    var arrow = $('.sidebar-arrow');

    if (sidebar.hasClass('logging')) { //if we aren't on the logging screen in which we must not collapse the sidebar
      sidebar.addClass('open');
      sidebar.removeClass('reduced');
      overlay.addClass('active');
    } else {
      sidebar.toggleClass('open');
      sidebar.toggleClass('reduced');
      arrow.toggleClass('mdi-arrow-left');
      arrow.toggleClass('mdi-arrow-right');

      if ((sidebar.hasClass('sidebar-fixed-left') || sidebar.hasClass('sidebar-fixed-right')) && sidebar.hasClass('open')) {
        overlay.addClass('active');
      } else {
        overlay.removeClass('active');
      }
    }
  }

  /**
   * Close the sidebar if we click somewhere else
   * @param e event
   */
  onClickOverlay(e) {
    this.$(e.target).removeClass('active');
    if (!$('#sidebar').hasClass('logging')) { //if we aren't on the logging screen in which we must not collapse the sidebar
      this.$('#sidebar').removeClass('open');
      this.$('#sidebar').addClass('reduced');
      this.$('.sidebar-arrow').removeClass('mdi-arrow-left');
      this.$('.sidebar-arrow').addClass('mdi-arrow-right');
    }
  }


  /**
   * Display the sidebar the first time
   */
  onRendered() {
    var value = "sidebar-fixed-left"; //"", "sidebar-fixed-left", "sidebar-fixed-right", "sidebar-stacked"
    var sidebar = this.$('#sidebar');
    sidebar.addClass(value).addClass('open');
    if (value == 'sidebar-fixed-left' || value == 'sidebar-fixed-right') {
      this.$('.sidebar-overlay').addClass('active');
    }

    $('.navbar .sidebar-toggle').on("click", this.toggleSideBar);
  }

  getVersion() {
    return this.version.get();
  }
}

SideBar.register("SideBar");

