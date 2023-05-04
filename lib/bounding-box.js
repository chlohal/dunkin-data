module.exports = class BoundingBox {
    xLeft = 0;
    yBottom = 0;
    xRight = 0;
    yTop = 0;

    isEmpty = false

    constructor(x,y,width,height) {
        if(!(isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height))) {
            this.xLeft = x;
            this.yTop = y;
            this.yBottom = y + height;
            this.xRight = x + width;
        } else {
            this.isEmpty = true;
        }
    }

    merge(other) {
        if(this.isEmpty) {
            this.xLeft = other.xLeft;
            this.xRight = other.xRight;
            this.yBottom = other.yBottom;
            this.yTop = other.yTop;
            this.isEmpty = false;
        } else {
            this.xLeft = Math.min(this.xLeft, other.xLeft);
            this.xRight = Math.max(this.xRight, other.xRight);
            this.yBottom = Math.max(this.yBottom, other.yBottom);
            this.yTop = Math.min(this.yTop, other.yTop);
        }
    }

    expandToPoint(x,y) {
        if(this.isEmpty) {
            this.xLeft = this.xRight = x;
            this.yTop = this.yBottom = y;
            this.isEmpty = false;
        } else {
            this.xLeft = Math.min(this.xLeft, x);
            this.xRight = Math.max(this.xRight, x);
            this.yBottom = Math.max(this.yBottom, y);
            this.yTop = Math.min(this.yTop, y);
        }
    }

    width() {
        return this.xRight - this.xLeft;
    }

    height() {
        return this.yBottom - this.yTop;
    }

    margin(margin) {
        this.xLeft -= margin;
        this.xRight += margin;

        this.yTop -= margin;
        this.yBottom += margin;
    }

    toViewBox() {
        return `${this.xLeft} ${this.yTop} ${this.width()} ${this.height()}`
    }
}