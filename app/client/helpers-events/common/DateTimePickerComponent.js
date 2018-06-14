DateTimePickerComponent =
  class DateTimePickerComponent extends BlazeComponent {

    initializeData() {
      this.date = this.data().date;
      this.viewDate = this.data().viewDate;
      this.updateDateCallback = this.data().updateDateCallback;
      this.format = this.data().format || null;
      if (this.isRendered() && this.date) {
        this.$(".datetimepicker").data("DateTimePicker").date(this.date);
      }
    }

    onRendered() {
      var options = {
        defaultDate: this.date,
        sideBySide: true,
        stepping: 15,
      };
      if (this.viewDate) options.viewDate = new moment(this.viewDate);
      if (this.format) options.format = this.format;
      else options.format = "DD/MM/YYYY HH:mm";
      this.$(".datetimepicker").datetimepicker(options);
    }

    onCreated() {
      if (!this.data().readOnly) this.dateTimePickerFireOneEventWhenInit = true; //a change event is fired when init and is notReadOnly...
    }

    events() {
      return [
        {
          "dp.change .datetimepicker": this.changeDate
        }
      ];
    }

    changeDate(e) {
      if (this.data().readOnly) return;

      if (this.dateTimePickerFireOneEventWhenInit) { //a change event is fired when init and is notReadOnly...
        this.dateTimePickerFireOneEventWhenInit = false;
        return;
      }
      if (this.updateDateCallback) this.updateDateCallback(e.date);
    }


    template() {
      return "DateTimePickerComponent";
    }
  }


DateTimePickerComponent.register("DateTimePickerComponent");
