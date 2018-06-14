export class GuidedTourServiceClient {

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
     *
     * @param labelToClickOn    the exact label of the customSelect
     * @param optionToSelect    the exact label of the option to select
     */
    static selectOption(labelToClickOn, optionToSelect, delay) {
        return new Promise(resolve => {
            console.debug("DEBUG selectOption", optionToSelect);
            GuidedTourServiceClient.clickOn(`[for=${labelToClickOn}]`, delay)
                .then(() => GuidedTourServiceClient.waitFor(optionToSelect))
                .then(() => GuidedTourServiceClient.sleep(delay))
                .then(() => {
                    //TODO support mutliple
                    let component = $(`:contains(${optionToSelect})`);
                    let parent = component[component.length - 1 - 1];
                    GuidedTourServiceClient.clickOn($(parent).children("input"), delay).then(() => {
                        resolve()
                    });
                })
        })
    }

    static findComponentByContent(content) {
        let component = $(`:contains(${content})`);
        return component[component.length - 1];
    }

    static _typeText(text, target, resolve, delayBetweenChar) {
        console.log("delayBetweenChar",delayBetweenChar)
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
        return new Promise((resolve) => GuidedTourServiceClient._typeText(text, target, resolve, delayBetweenChar))
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
    static clickOn(cssSelector, delay) {
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

            GuidedTourServiceClient.sleep(delay).then(() => {
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