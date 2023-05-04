module.exports = function shuffle(arr) {
    for(let i = arr.length - 1; i --> 1;) {
        const j = Math.floor(Math.random() * i);
        const swap = arr[i];
        arr[i] = arr[j];
        arr[j] = swap;
    }
}