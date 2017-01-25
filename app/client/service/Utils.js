export class Utils{
    static camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
            return letter.toUpperCase();
        });
    }
}