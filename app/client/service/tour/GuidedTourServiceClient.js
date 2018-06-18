export class GuidedTourServiceClient {

  /**
   *
   * @param message
   * @param duration    in ms
   * @param position
   *      'center'
   *      horizontal placement: 'left' 'right' 'horizontal-align-CSS_SELECTOR'
   *      vertical placement: 'top' 'bottom' 'vertical-align-CSS_SELECTOR'
   *      can combined one vertical with one horizontal, *-align-* being at the end like 'left-vertical-align-#menu'
   * @param size        small medium big
   * @returns {Promise}
   */
  static alert(message, duration, position, size) {
    return new Promise(resolve => {
      $("#guided-tour-overlapp").addClass("grayed");
      $("#message").addClass("visible");
      $("#guide-progress-bar").addClass("visible");

      let height, width;
      if (size == "big") {
        width = 600;
        height = 400;
      } else if (size == "medium") {
        width = 300;
        height = 200;
      } else if (size == "small") {
        width = 150;
        height = 100;
      }

      let windowWidth = window.innerWidth;
      let windowHeight = window.innerHeight;

      let top, left;
      if (position == "center") {
        top = windowHeight / 2 - height / 2;
        left = windowWidth / 2 - width / 2

      } else if (position.indexOf("top") != -1) {
        top = windowHeight * 0.05;
        left = windowWidth - (windowHeight - top) * windowWidth / windowHeight;
      } else if (position.indexOf("bottom") != -1) {
        top = windowHeight * 0.95 - height;
        left = (windowHeight - top - height) * windowWidth / windowHeight
      }
      if (position.indexOf("right") != -1) {
        left = windowWidth - left - width;
      }
      $("#message").width(width);
      $("#message").height(height);

      $("#message-content").html(message);
      $("#message").css('left', left);
      $("#message").css('top', top);

      var i = 100;
      var counterBack = setInterval(function () {
        i--;
        if (i > 0) {
          $('#guide-progress-bar').css('width', i + '%');
        } else {
          clearInterval(counterBack);
          $("#message").removeClass("visible");
          $("#guide-progress-bar").removeClass("visible");
          $("#guided-tour-overlapp").removeClass("grayed");
          resolve()
        }
      }, duration / 100);

    })
  }

  /**
   * @summary only support one selection so far (but will work on multiple select)
   * @param labelToClickOn    the exact label of the customSelect
   * @param optionToSelect    the exact label of the option to select
   */
  static selectOption(labelToClickOn, optionToSelect, delay) {
    return new Promise(resolve => {
      let target = `[for='${labelToClickOn}']`;
      GuidedTourServiceClient.scrollIfTargetOutOfWindow(target)
        .then(() => GuidedTourServiceClient.clickOn(target, delay))
        .then(() => GuidedTourServiceClient.waitFor(`.popover :contains(${optionToSelect})`))
        .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(GuidedTourServiceClient.getJqueryObject(".popover")))
        .then(() => GuidedTourServiceClient.sleep(delay))
        .then(() => {
          return new Promise(resolve => {
            let allOptionsThatMatches = $(`.popover-content .custom-select-options .list-group .list-group-item:contains(${optionToSelect}) input`).toArray();
            GuidedTourServiceClient._selectionOption(allOptionsThatMatches, resolve, delay);
          })
        })
        .then(() => resolve())
    })
  }

  static _selectionOption(allOptionsThatMatches, resolve, delay) {
    GuidedTourServiceClient.clickOn(allOptionsThatMatches[0], delay).then(() => {
      allOptionsThatMatches.pop(0);
      if (allOptionsThatMatches.length == 0)
        resolve()
      else
        GuidedTourServiceClient._selectionOption(allOptionsThatMatches, resolve, delay)
    });
  }

  /**
   *
   * @param datetimepicker  CSS selector of jQuery object
   * @param day             string, MM/DD/YYYY
   * @param hours           string, format HH
   * @returns {Promise}
   */
  static selectDate(datetimepickerSelector, date, month, hours, delay) {
    return new Promise(resolve => {
      let datetimepicker = GuidedTourServiceClient.getJqueryObject(datetimepickerSelector);
      GuidedTourServiceClient.clickOn(datetimepicker, delay)
        .then(() => GuidedTourServiceClient.sleep(100))
        .then(() => {
          return new Promise(resolve => {
            let datetimepickerData = $(datetimepicker).data("DateTimePicker");
            // if (datetimepicker)
            datetimepickerData.show();
            resolve()
          })
        })
        .then(() => GuidedTourServiceClient.waitFor(".bootstrap-datetimepicker-widget"))
        .then(() => GuidedTourServiceClient.sleep(delay * 2))
        //if month and date
        .then(() => {
          return new Promise(resolve => {
            if (date && month) {
              GuidedTourServiceClient.clickOn(`.datepicker .datepicker-days .picker-switch`, delay)
                .then(() => GuidedTourServiceClient.sleep(delay * 2))
                .then(() => GuidedTourServiceClient.clickOn(`.datepicker .datepicker-months [data-action=selectMonth]:contains(${month})`, delay))
                .then(() => GuidedTourServiceClient.sleep(delay))
                .then(() => GuidedTourServiceClient.clickOn(`.datepicker .datepicker-days [data-day='${date}']`, delay))
                .then(() => GuidedTourServiceClient.sleep(delay))
                .then(() => resolve())
            } else {
              resolve()
            }
          });
        })
        //if hours
        .then(() => {
          return new Promise(resolve => {
            if (hours)
              GuidedTourServiceClient.clickOn(`.timepicker .timepicker-hour[data-action=showHours]`, delay)
                .then(() => GuidedTourServiceClient.waitFor(`.timepicker .timepicker-hours [data-action="selectHour"]:contains(${hours})`))
                .then(() => GuidedTourServiceClient.sleep(delay))
                .then(() => GuidedTourServiceClient.clickOn(`.timepicker .timepicker-hours [data-action="selectHour"]:contains(${hours})`, delay))
                .then(() => GuidedTourServiceClient.sleep(delay))
                .then(() => resolve());
            else
              resolve()
          })
        })
        .then(() => {
          $(datetimepicker).data("DateTimePicker").hide();
          resolve()
        });
    })
  }

  /**
   * @summary look into the whole dom for a content that match given param
   * @param content
   * @returns {*}
   */
  static findComponentByContent(content) {
    let component = $(`:contains(${content})`);
    return component[component.length - 1];
  }

  static _typeText(text, target, resolve, delayBetweenChar) {
    var $target = $(target);
    $target.addClass("filling-input");
    $target.val($target.val() + text.charAt(0));
    text = text.substr(1);
    if (text.length != 0)
      GuidedTourServiceClient.sleep(delayBetweenChar)
        .then(() => GuidedTourServiceClient._typeText(text, target, resolve, delayBetweenChar));
    else {
      $target.trigger('change');
      $target.removeClass("filling-input");
      resolve()
    }
  }

  static typeText(text, target, delayBetweenChar) {
    return new Promise((resolve) => {
      var $target = $(target);
      $target.val("");
      GuidedTourServiceClient.scrollIfTargetOutOfWindow(target)
        .then(() => GuidedTourServiceClient._typeText(text, target, resolve, delayBetweenChar))
    });
  }

  static typeEquipment(qt, label, delay) {
    return new Promise(resolve => {
      let $label = $(`.equipment-wrapper :contains(${label})`);
      let parent = $($label[$label.length - 1]).parent();
      GuidedTourServiceClient.typeText(qt.toString(), $(parent.children()[0]).find("input")[0], delay)
        .then(() => resolve())
    })
  }

  static _waitFor(query, resolve) {
    console.debug("waiting for", query);
    if (query instanceof jQuery) {
      if ($(query.selector).length != 0) {
        resolve()
      } else {
        GuidedTourServiceClient.sleep(100).then(() => {
          GuidedTourServiceClient._waitFor(query.selector, resolve)
        })
      }
    } else if ($(`body:contains(${query})`).length != 0) {
      resolve()
    } else if ($(`${query}`).length != 0) {
      resolve();
    } else {
      GuidedTourServiceClient.sleep(100).then(() => {
        GuidedTourServiceClient._waitFor(query, resolve)
      })
    }
  }

  static isPresent(query) {
    if ($(`body:contains(${query})`).length != 0) {
      return true;
    } else if ($(`${query}`).length != 0) {
      return true;
    } else {
      return false
    }
  }

  static waitFor(query) {
    return new Promise(resolve => {
      GuidedTourServiceClient._waitFor(query, resolve)
    })
  }

  /**
   * @param target  jQuery object
   * @returns {Promise}
   */
  static scrollIfTargetOutOfWindow($target) {
    return new Promise(resolve => {
      $target = GuidedTourServiceClient.getJqueryObject($target);
      let windowHeight = window.innerHeight;
      let targetYPosition = $target[0].getBoundingClientRect().y;
      let targetOffset = $target.offset().top;
      let targetHeight = $target[0].getBoundingClientRect().height;

      let scrollToY;
      if (targetYPosition < 60) {
        scrollToY = targetOffset - (50 + 20); //50px is the top nav bar height, 10px is a bit of margin

      } else if (targetYPosition > windowHeight - targetHeight) {
        scrollToY = targetOffset - windowHeight / 2 + targetHeight / 2
      }
      if (scrollToY) {
        window.scrollTo(0, scrollToY);
        GuidedTourServiceClient.sleep(200).then(() => {
          resolve()
        });
      } else
        resolve()

    })
  }

  /**
   * @param cssSelector can be string CSS selector, a jQuery object, an HTML object
   * @returns {jQuery|HTMLElement}
   */
  static getJqueryObject(cssSelector) {
    return (typeof cssSelector == "string") ? $(`${cssSelector}`) : (typeof cssSelector == 'jQuery') ? cssSelector : $(cssSelector);
  }

  /**
   * @param cssSelector either a CSS selector or a jQuery object
   */
  static clickOn(cssSelector, delay) {
    return new Promise(resolveClickOn => {
      let component = GuidedTourServiceClient.getJqueryObject(cssSelector);
      GuidedTourServiceClient.waitFor(component).then(resolveWaiting => {
        let componentPosition = component[0].getBoundingClientRect() //component.offset(); //absolute top left position
        let componentHeight = component.height();
        let componentWidth = component.width();
        let clickHighlight = $("#click-highlight");
        let top = componentPosition.y + componentHeight / 2 - 75 / 2; //the circle fit in a 75px square
        let left = componentPosition.x + componentWidth / 2 - 75 / 2;
        clickHighlight.css("top", top);
        clickHighlight.css("left", left);

        $("#guided-tour-overlapp").addClass("grayed");
        clickHighlight.addClass("visible");

        GuidedTourServiceClient.scrollIfTargetOutOfWindow(cssSelector)
          .then(() => GuidedTourServiceClient.sleep(delay))
          .then(() => {
            $(cssSelector).click();
            $("#guided-tour-overlapp").removeClass("grayed");
            clickHighlight.removeClass("visible");
            resolveClickOn()
          });

        //we don't really care about finishing waitingFor promise as the clickOn one is the one we listen to
      })
    })

  }

  static openMenu(toClose = false) {
    return new Promise(resolve => {
      let isOpen = $(".top-bar button.sidebar-toggle .sidebar-arrow").hasClass("mdi-arrow-left");
      if (!toClose && !isOpen || toClose && isOpen)
        GuidedTourServiceClient.clickOn(".top-bar button.sidebar-toggle .sidebar-arrow").then(resolve)
      else
        resolve()
    })
  }

  static logout(speed) {
    return new Promise(resolve => {
      GuidedTourServiceClient.openMenu()
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.clickOn("[href='#settings-dropdown']", speed * 300))
        .then(() => GuidedTourServiceClient.sleep(200 * speed))
        .then(() => GuidedTourServiceClient.clickOn("[href='/logout']", speed * 300))
        .then(() => GuidedTourServiceClient.waitFor(".at-pwd-form"))
        .then(() => resolve())
    })
  }

  static instantLogout() {
    return new Promise(resolve => {
      if (GuidedTourServiceClient.isPresent(".at-pwd-form")) {
        console.debug("instantLogout: already logged out");
        resolve();
        return
      }
      Meteor.logout();
      Router.go('home');
      console.debug("instantLogout: logging out and waiting for");
      GuidedTourServiceClient.waitFor(".at-pwd-form")
        .then(() => resolve())
    })
  }

  static login(speed, user) {
    return new Promise(resolve => {
      GuidedTourServiceClient.waitFor(".at-pwd-form")
        .then(() => GuidedTourServiceClient.typeText(user.email, "#at-field-email", speed * 50))
        .then(() => GuidedTourServiceClient.typeText(user.pwd, "#at-field-password", speed * 50))
        .then(() => GuidedTourServiceClient.clickOn("#sidebar #at-pwd-form .submit", speed * 200))
        .then(() => GuidedTourServiceClient.waitFor("Home"))
        .then(() => resolve())
    })
  }


  static closeMenu() {
    return GuidedTourServiceClient.openMenu(true)
  }

  static sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

}