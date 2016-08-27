DateTimePickerComponent =
    class DateTimePickerComponent extends BlazeComponent {

        initializeData() {
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

        onCreated(){
            if(!this.data().readOnly) this.dateTimePickerFireOneEventWhenInit = true; //a change event is fired when init and is notReadOnly...
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

            if(this.dateTimePickerFireOneEventWhenInit) { //a change event is fired when init and is notReadOnly...
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
