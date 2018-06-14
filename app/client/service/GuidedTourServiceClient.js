export class GuidedTourServiceClient {

  /**
   *
   * @param labelToClickOn    the exact label of the customSelect
   * @param optionToSelect    the exact label of the option to select
   */
  static selectOption(labelToClickOn, optionToSelect) {
    return new Promise(resolve => {
      console.debug("DEBUG selectOption");
      GuidedTourServiceClient.clickOn(`[for=${labelToClickOn}]`).then(() => {
        GuidedTourServiceClient.sleep(1000).then(() => {
          //TODO support mutliple
          let component = $(`:contains(${optionToSelect})`);
          let parent = component[component.length - 1 - 1];
          GuidedTourServiceClient.clickOn($(parent).children("input")).then(() => {
            resolve()
          });
        });
      })
    })
  }

  static findComponentByContent(content) {
    let component = $(`:contains(${content})`);
    return component[component.length - 1];
  }

  static _typeText(text, target, resolve) {
    var $target = $(target);
    $target.addClass("filling-input");
    $target.val($target.val() + text.charAt(0));
    text = text.substr(1);
    if (text.length != 0)
      GuidedTourServiceClient.sleep(300).then(() => {
        GuidedTourServiceClient._typeText(text, target, resolve)
      });
    else {
      $target.trigger('change');
      $target.removeClass("filling-input");
      resolve()
    }
  }

  static typeText(text, target) {
    return new Promise((resolve) => {
      GuidedTourServiceClient._typeText(text, target, resolve)
    })
  }

  static _waitFor(query, resolve) {
    console.debug("DEBUG openMenu");
    if ($(`body:contains(${query})`).length != 0) {
      console.debug("document is there via content");
      resolve()
    } else if ($(`${query}`).length != 0) {
      console.debug("document is there via css query");
      resolve();
    } else {
      GuidedTourServiceClient.sleep(100).then(() => {
        GuidedTourServiceClient._waitFor(query, resolve)
      })
    }
  }

  static waitFor(query) {
    return new Promise(resolve => {
      GuidedTourServiceClient._waitFor(query, resolve)
    })
  }

  /**
   * @param cssSelector either a CSS selector or a jQuery object
   */
  static clickOn(cssSelector) {
    return new Promise(resolve => {
      console.debug("DEBUG clickOn", cssSelector);
      let component = (typeof cssSelector == "string") ? $(`${cssSelector}`) : (typeof cssSelector == 'jQuery') ? cssSelector : $(cssSelector);
      let componentPosition = component.offset(); //absolute top left position
      let componentHeight = component.height();
      let componentWidth = component.width();
      let clickHighlight = $("#click-highlight");
      let top = componentPosition.top + componentHeight / 2 - 75 / 2; //the circle fit in a 75px square
      let left = componentPosition.left + componentWidth / 2 - 75 / 2;
      clickHighlight.css("top", top);
      clickHighlight.css("left", left);

      $("#guided-tour-overlapp").addClass("grayed");
      clickHighlight.addClass("visible");

      GuidedTourServiceClient.sleep(500).then(() => {
        $(cssSelector).click();
        $("#guided-tour-overlapp").removeClass("grayed");
        clickHighlight.removeClass("visible");
        resolve()
      });
    })
  }

  static openMenu(toClose = false) {
    return new Promise(resolve => {
      console.debug("DEBUG openMenu");
      let isOpen = $(".top-bar button.sidebar-toggle .sidebar-arrow").hasClass("mdi-arrow-left");
      if (!toClose && !isOpen || toClose && isOpen)
        GuidedTourServiceClient.clickOn(".top-bar button.sidebar-toggle .sidebar-arrow").then(resolve)
      else
        resolve()
    })
  }

  static closeMenu() {
    return GuidedTourServiceClient.openMenu(true)
  }

  static sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }


}