DateTimePickerComponent =
    class DateTimePickerComponent extends BlazeComponent {

        constructor(){
            super();
            this.dateTimePickerFireOneEventWhenInit = true;
        }

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
                    "dp.change .datetimepicker": this.changeDate
                }
            ];
        }

        changeDate(e) {
            if(this.dateTimePickerFireOneEventWhenInit) { //a change event is fired when init...
                this.dateTimePickerFireOneEventWhenInit = false;
                return;
            }
            this.updateDateCallback(e.date);
        }



        template() {
            return "DateTimePickerComponent";
        }
    }


DateTimePickerComponent.register("DateTimePickerComponent");
