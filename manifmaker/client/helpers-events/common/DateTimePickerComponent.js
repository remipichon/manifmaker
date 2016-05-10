DateTimePickerComponent =
    class DateTimePickerComponent extends BlazeComponent {

        constructor(){
            super();
            this.dateTimePickerFireOneEventWhenInit = true;
        }

        fakeConstructorWithDataArguments() {
            this.date = this.data().date;
            this.updateDateCallback = this.data().updateDateCallback;
            if(this.isRendered()){
                    this.$(".datetimepicker").data("DateTimePicker").date(this.date);
            }
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
            if(this.data().readOnly) return;

            if(this.dateTimePickerFireOneEventWhenInit) { //a change event is fired when init...
                this.dateTimePickerFireOneEventWhenInit = false;
                return;
            }
            if(this.updateDateCallback) this.updateDateCallback(e.date);
        }



        template() {
            return "DateTimePickerComponent";
        }
    }


DateTimePickerComponent.register("DateTimePickerComponent");
