export class Utils {
  static camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
      return letter.toUpperCase();
    });
  }

  static onUpdateSuccess(message) {
    UpdateInfo.insert({date: new Date()});
  }

  static onUpdateError(message) {
    if (message)
      sAlert.error(`${message}`);
  }

  static onUpdateCollectionResult(error, result) {
    if (error)
      Utils.onUpdateError(error.reason)
    else
      Utils.onUpdateSuccess();

  }
}