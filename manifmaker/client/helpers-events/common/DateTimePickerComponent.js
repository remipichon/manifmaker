DateTimePickerComponent =
    class DateTimePickerComponent extends BlazeComponent {

        fakeConstructorWithDataArguments() {
            this.date = this.data().date;
            this.updateDateCallback = this.data().updateDateCallback;
        }

        onRendered() {
            this.$(".datetimepicker").datetimepicker({
                defaultDate: this.date,
                sideBySide: true
            });
        }

        events() {
            return [
                {
                    "dp.change .datetimepicker": this.changeDate //TODO a change event is fired when init...
                }
            ];
        }

        changeDate(e) {
            this.updateDateCallback(e.date);
        }

        template() {
            return "DateTimePickerComponent";
        }
    }


DateTimePickerComponent.register("DateTimePickerComponent");
