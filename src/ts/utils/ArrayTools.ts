export class ArrayTools {
    public static toArray(iterable: NodeList) {
        return Array.prototype.slice.call(iterable);
    }
}