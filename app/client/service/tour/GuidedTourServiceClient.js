export class GuidedTourServiceClient {

  /**
   *
   * @param message
   * @param duration    in ms
   * @param position
   *      'center'
   *      horizontal placement: 'left' 'right' 'vertical-align-CSS_SELECTOR'
   *      vertical placement: 'top' 'bottom' 'vertical-align-CSS_SELECTOR'
   *      can combined one vertical with one horizontal, *-align-* being at the end like 'left-vertical-align-#menu'
   * @param size        small medium big
   * @returns {Promise}
   */
  static alert(message, duration, position, size) {
    $("#guided-tour-overlapp").addClass("visible");
    return new Promise(resolve => {

      let endOfAlert = function () {
        clearInterval(counterBack);
        $("#message").removeClass("visible");
        $("#guide-progress-bar").removeClass("visible");
        $("#guided-tour-overlapp").removeClass("grayed");
        resolve();
        $("#skip-guided-alert").off('click');
      };

      $("#skip-guided-alert").one('click', endOfAlert)
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
        height = 150;
      }

      let windowWidth = window.innerWidth;
      let windowHeight = window.innerHeight;

      let top, left;
      if (position.indexOf("center") !== -1) {
        top = windowHeight / 2 - height / 2;
        left = windowWidth / 2 - width / 2
      }

      //well, you will have to trust me it's working 'cause it's hell of a mess below
      //the idea was to first position top and then deduce left in a way you would leave as much
      //space on top/bottom than on the side, for harmony you know.
      //then *-align- arrived and it became complex. Best way is to test it live.
      if (position.indexOf("top") != -1) {
        top = windowHeight * 0.05;
        left = windowWidth - (windowHeight - top) * windowWidth / windowHeight;
      } else if (position.indexOf("bottom") != -1) {
        top = windowHeight * 0.95 - height;
        left = (windowHeight - top - height) * windowWidth / windowHeight
      }

      if (position.indexOf("vertical-align-") != -1) {
        let cssSelector = position.substring(position.indexOf("vertical-align-") + "vertical-align-".length, position.length);
        top = $(cssSelector)[0].getBoundingClientRect().y - height / 2;
        if (!left) left = windowWidth * 0.05
      }

      if (position.indexOf("horizontal-align-") != -1) {
        let cssSelector = position.substring(position.indexOf("horizontal-align-") + "horizontal-align-".length, position.length);
        if (!left) left = $(cssSelector)[0].getBoundingClientRect().x - width / 2 + $(cssSelector)[0].getBoundingClientRect().width / 2;
      }

      if (position.indexOf("right") != -1) {
        left = windowWidth * 0.95 - width;
      } else if (position.indexOf("left") != -1) {
        //nothing to do there
      }

      $("#message").width(width);
      $("#message").height(height);

      $("#message-content").html(message);
      $("#message").css('left', left);
      $("#message").css('top', top);

      if(duration == 0){
        endOfAlert();
      } else {
        var i = 100;
        var counterBack = setInterval(function () {
          //for pause
          //at pause, we need to clear the interval and set another infite one
          //at play, we reset the infinite interval and set a new interval with what's remaining of time
          i--;
          if (i > 0) {
            $('#guide-progress-bar').css('width', i + '%');
          } else {
            endOfAlert()
          }
        }, duration / 100);
      }
    })

  }

  /**
   * @summary only support one selection so far (but will work on multiple select)
   * @param labelToClickOn    the exact label of the customSelect
   * @param optionToSelect    the exact label of the option to select
   */
  static selectOption(labelToClickOn, options, delay) {
    if (typeof options != "object") {
      options = [options];
    }
    return new Promise(resolve => {
      let target = `[for='${labelToClickOn}']`;
      GuidedTourServiceClient.scrollIfTargetOutOfWindow(target)
        .then(() => GuidedTourServiceClient.clickOn(target, delay))
        .then(() => GuidedTourServiceClient.waitFor(`.popover :contains('${options[0]}')`))
        .then(() => GuidedTourServiceClient.scrollIfTargetOutOfWindow(GuidedTourServiceClient.getJqueryObject(".popover")))
        .then(() => GuidedTourServiceClient.sleep(delay))
        .then(() => {
          return new Promise(resolve => {
            let optionToSelect = [];
            options.forEach(option => {
              optionToSelect.push($(`.popover-content .custom-select-options .list-group .list-group-item:contains(${option}) input`))
            });
            GuidedTourServiceClient._selectionOption(optionToSelect, resolve, delay);
          })
        })
        .then(() => resolve())
    })
  }

  static _selectionOption(allOptionsThatMatches, resolve, delay) {
    GuidedTourServiceClient.clickOn(allOptionsThatMatches[0], delay)
      .then(() => GuidedTourServiceClient.standardSleep(delay))
      .then(() => {
        allOptionsThatMatches.shift();
        if (allOptionsThatMatches.length == 0)
          resolve();
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
  static selectDate(datetimepickerSelector, momentDate, hours, speed) {
    let date = momentDate.format("MM/DD/YYYY");
    let month = momentDate.format("MMM");
    return new Promise(resolve => {
      let datetimepicker = GuidedTourServiceClient.getJqueryObject(datetimepickerSelector);
      GuidedTourServiceClient.clickOn(datetimepicker, speed)
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
        .then(() => GuidedTourServiceClient.standardSleep())
        //if month and date
        .then(() => {
          return new Promise(resolve => {
            if (date && month) {
              GuidedTourServiceClient.clickOn(`.datepicker .datepicker-days .picker-switch`, speed)
                .then(() => GuidedTourServiceClient.standardSleep())
                .then(() => GuidedTourServiceClient.clickOn(`.datepicker .datepicker-months [data-action=selectMonth]:contains(${month})`, speed))
                .then(() => GuidedTourServiceClient.standardSleep())
                .then(() => GuidedTourServiceClient.clickOn(`.datepicker .datepicker-days [data-day='${date}']`, speed))
                .then(() => GuidedTourServiceClient.standardSleep())
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
              GuidedTourServiceClient.clickOn(`.timepicker .timepicker-hour[data-action=showHours]`, speed)
                .then(() => GuidedTourServiceClient.waitFor(`.timepicker .timepicker-hours [data-action='selectHour']:contains(${hours})`))
                .then(() => GuidedTourServiceClient.sleep(speed))
                .then(() => GuidedTourServiceClient.clickOn(`.timepicker .timepicker-hours [data-action='selectHour']:contains(${hours})`, speed))
                .then(() => GuidedTourServiceClient.sleep(speed))
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
    } else if ($(`body:contains("${query}")`).length != 0) {
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
  static scrollIfTargetOutOfWindow($target, position) {
    return new Promise(resolve => {
      $target = GuidedTourServiceClient.getJqueryObject($target);
      let windowHeight = window.innerHeight;
      let targetYPosition = $target[0].getBoundingClientRect().y;
      let targetOffset = $target.offset().top;
      let targetHeight = $target[0].getBoundingClientRect().height;

      let scrollToY;
      if (targetYPosition < 60 || position == "top") {
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
  static clickOn(cssSelector, speed) {
    return new Promise(resolveClickOn => {
      let component = GuidedTourServiceClient.getJqueryObject(cssSelector);
      GuidedTourServiceClient.waitFor(component).then(resolveWaiting => {
        component = GuidedTourServiceClient.getJqueryObject(cssSelector);
        console.debug("clickOn ",cssSelector, component);
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
          .then(() => GuidedTourServiceClient.standardSleep(speed))
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

  static openMenu(speed, toClose = false) {
    return new Promise(resolve => {
      let isOpen = $(".top-bar button.sidebar-toggle .sidebar-arrow").hasClass("mdi-arrow-left");
      if (!toClose && !isOpen || toClose && isOpen)
        GuidedTourServiceClient.clickOn(".top-bar button.sidebar-toggle .sidebar-arrow", speed)
          .then(() => GuidedTourServiceClient.sleep(300 * speed))
          .then(resolve());
      else
        resolve()
    })
  }

  static logout(speed) {
    return new Promise(resolve => {
      GuidedTourServiceClient.openMenu(speed)
        .then(() => GuidedTourServiceClient.standardSleep(speed))
        .then(() => GuidedTourServiceClient.clickOn("[href='#settings-dropdown']", speed))
        .then(() => GuidedTourServiceClient.standardSleep(speed))
        .then(() => GuidedTourServiceClient.clickOn("[href='/logout']", speed))
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
        .then(() => GuidedTourServiceClient.clickOn("#sidebar #at-pwd-form .submit", speed))
        .then(() => GuidedTourServiceClient.waitFor("Home"))
        .then(() => resolve())
    })
  }


  static closeMenu(speed) {
    return GuidedTourServiceClient.openMenu(speed, true)
  }

  static sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  static getStandardSleepDuration() {
    return 400
  }

  static standardSleep(speed, multiplicator = 1) {
    return new Promise((resolve) => setTimeout(resolve, multiplicator * speed * GuidedTourServiceClient.getStandardSleepDuration()));
  }
}