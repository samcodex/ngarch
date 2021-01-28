// ======================================================================
// BoxArea object using BM67 box packing algorithum
// https://stackoverflow.com/questions/45681299/algorithm-locating-enough-space-to-draw-a-rectangle-given-the-x-and-y-axis-of
// Please leave this and the above two lines with any copies of this code.
// ======================================================================
//
// usage
//  var area = new BoxArea({
//      x: ?,  // x,y,width height of area
//      y: ?,
//      width: ?,
//      height : ?.
//      space : ?, // optional default = 1 sets the spacing between boxes
//      minW : ?, // optional default = 0 sets the in width of expected box.
//             Note this is for optimisation you can add smaller but it may fail
//      minH : ?, // optional default = 0 sets the in height of expected box.
//             Note this is for optimisation you can add smaller but it may fail
//  });
//
//  Add a box at a location. Not checked for fit or overlap
//  area.placeBox({x : 100, y : 100, w ; 100, h :100});
//
//  Tries to fit a box. If the box does not fit returns false
//  if(area.fitBox({x : 100, y : 100, w ; 100, h :100})){ // box added
//
//  Resets the BoxArea removing all boxes
//  area.reset()
//
//  To check if the area is full
//  area.isFull();  // returns true if there is no room of any more boxes.
//
//  You can check if a box can fit at a specific location with
//  area.isBoxTouching({x : 100, y : 100, w ; 100, h :100}, area.boxes)){ // box is touching another box
//
//  To get a list of spacer boxes. Note this is a copy of the array, changing it will not effect the functionality of BoxArea
//  const spacerArray = area.getSpacers();
//
//  Use it to get the max min box size that will fit
//
//  const maxWidthThatFits = spacerArray.sort((a,b) => b.w - a.w)[0];
//  const minHeightThatFits = spacerArray.sort((a,b) => a.h - b.h)[0];
//  const minAreaThatFits = spacerArray.sort((a,b) => (a.w * a.h) - (b.w * b.h))[0];
//
//  The following properties are available
//  area.boxes  // an array of boxes that have been added
//  x,y,width,height  // the area that boxes are fitted to

const defaultSettings = {
    minW : 0, // min expected size of a box
    minH : 0,
    space : 1, // spacing between boxes
};
const eachOf = (array, cb) => {
  let i = 0;
  const len = array.length;
  while (i < len && cb(array[i], i++, len) !== true ) {}
};

export function BoxArea(settings) {
    settings = Object.assign({}, defaultSettings, settings);

    this.width = this.originalWidth = settings.width;
    this.height = this.originalHeight = settings.height;
    this.x = settings.x;
    this.y = settings.y;

    const space = settings.space;
    const minW = settings.minW;
    const minH = settings.minH;

    const boxes = [];  // added boxes
    const spaceBoxes = [];
    this.boxes = boxes;


    // cuts box to make space for cutter (cutter is a box)
    function cutBox(box, cutter) {
        const b = [];
        // cut left
        if (cutter.x - box.x - space >= minW) {
            b.push({
                x : box.x,  y : box.y, h : box.h,
                w : cutter.x - box.x - space,
            });
        }
        // cut top
        if (cutter.y - box.y - space >= minH) {
            b.push({
                x : box.x,  y : box.y, w : box.w,
                h : cutter.y - box.y - space,
            });
        }
        // cut right
        if ((box.x + box.w) - (cutter.x + cutter.w + space) >= space + minW) {
            b.push({
                y : box.y, h : box.h,
                x : cutter.x + cutter.w + space,
                w : (box.x + box.w) - (cutter.x + cutter.w + space),
            });
        }
        // cut bottom
        if ((box.y + box.h) - (cutter.y + cutter.h + space) >= space + minH) {
            b.push({
                w : box.w, x : box.x,
                y : cutter.y + cutter.h + space,
                h : (box.y + box.h) - (cutter.y + cutter.h + space),
            });
        }
        return b;
    }
    // get the index of the spacer box that is closest in size and aspect to box
    function findBestFitBox(box, array = spaceBoxes) {
        let smallest = Infinity;
        let boxFound;
        const aspect = box.w / box.h;
        eachOf(array, (sbox, index) => {
            if (sbox.w >= box.w && sbox.h >= box.h) {
                const area = ( sbox.w * sbox.h) * (1 + Math.abs(aspect - (sbox.w / sbox.h)));
                if (area < smallest) {
                    smallest = area;
                    boxFound = index;
                }
            }
        });
        return boxFound;
    }
    // Exposed helper function
    // returns true if box is touching any boxes in array
    // else return false
    this.isBoxTouching = function(box, array = []) {
        for (let i = 0; i < array.length; i++) {
            const sbox = array[i];
            if (!(sbox.x > box.x + box.w + space || sbox.x + sbox.w < box.x - space ||
                sbox.y > box.y + box.h + space || sbox.y + sbox.h < box.y - space )) {
                return true;
            }
        }
        return false;
    };

    // returns an array of boxes that are touching box
    // removes the boxes from the array
    function getTouching(box, array = spaceBoxes) {
        const rstBoxes = [];
        for (let i = 0; i < array.length; i++) {
            const sbox = array[i];
            if (!(sbox.x > box.x + box.w + space || sbox.x + sbox.w < box.x - space ||
                sbox.y > box.y + box.h + space || sbox.y + sbox.h < box.y - space )) {
                rstBoxes.push(array.splice(i--, 1)[0]);
            }
        }
        return rstBoxes;
    }

    // Adds a space box to the spacer array.
    // Check if it is inside, too small, or can be joined to another befor adding.
    // will not add if not needed.
    function addSpacerBox(box, array = spaceBoxes) {
        let dontAdd = false;
        // is box to0 small?
        if (box.w < minW || box.h < minH) { return; }
        // is box same or inside another box
        eachOf(array, sbox => {
            if (box.x >= sbox.x && box.x + box.w <= sbox.x + sbox.w &&
                box.y >= sbox.y && box.y + box.h <= sbox.y + sbox.h ) {
                dontAdd = true;
                return true;   // exits eachOf (like a break statement);
            }
        });

        if (!dontAdd) {
            let join = false;
            // check if it can be joined with another
            eachOf(array, sbox => {
                if (box.x === sbox.x && box.w === sbox.w &&
                    !(box.y > sbox.y + sbox.h || box.y + box.h < sbox.y)) {
                    join = true;
                    const y = Math.min(sbox.y, box.y);
                    const h = Math.max(sbox.y + sbox.h, box.y + box.h);
                    sbox.y = y;
                    sbox.h = h - y;
                    return true;   // exits eachOf (like a break statement);
                }
                if (box.y === sbox.y && box.h === sbox.h &&
                    !(box.x > sbox.x + sbox.w || box.x + box.w < sbox.x)) {
                    join = true;
                    const x = Math.min(sbox.x, box.x);
                    const w = Math.max(sbox.x + sbox.w, box.x + box.w);
                    sbox.x = x;
                    sbox.w = w - x;
                    return true;   // exits eachOf (like a break statement);
                }
            });

            if (!join) { array.push(box); }// add to spacer array
        }
    }

    // Adds a box by finding a space to fit.
    // returns true if the box has been added
    // returns false if there was no room.
    this.fitBox = function(box) {
        if (boxes.length === 0) { // first box can go in top left
            box.x = space;
            box.y = space;
            boxes.push(box);
            const sb = spaceBoxes.pop();
            spaceBoxes.push(...cutBox(sb, box));
        } else {
            const bf = findBestFitBox(box); // get the best fit space
            if (bf !== undefined) {
                const sb = spaceBoxes.splice(bf, 1)[0]; // remove the best fit spacer
                box.x = sb.x; // use it to position the box
                box.y = sb.y;
                spaceBoxes.push(...cutBox(sb, box)); // slice the spacer box and add slices back to spacer array
                boxes.push(box);            // add the box
                const tb = getTouching(box);  // find all touching spacer boxes
                while (tb.length > 0) {       // and slice them if needed
                    eachOf(cutBox(tb.pop(), box), b => addSpacerBox(b));
                }
            } else {
                return false;
            }
        }
        return true;
    };

    // Adds a box at location box.x, box.y
    // does not check if it can fit or for overlap.
    this.placeBox = function(box) {
        boxes.push(box); // add the box
        const tb = getTouching(box);  // find all touching spacer boxes
        while (tb.length > 0) {       // and slice them if needed
            eachOf(cutBox(tb.pop(), box), b => addSpacerBox(b));
        }
    };

    // returns a copy of the spacer array
    this.getSpacers = function() {
        return [...spaceBoxes];
    };

    this.isFull = function() {
        return spaceBoxes.length === 0;
    };

    // resets boxes
    this.reset = function() {
        boxes.length = 0;
        spaceBoxes.length = 0;
        spaceBoxes.push({
            x : this.x + space, y : this.y + space,
            w : this.width - space * 2,
            h : this.height - space * 2,
        });
    };

    this.expand = function(width, height) {
      this.width = width;
      this.height = height;

      const oldBoxes = boxes.slice();

      this.reset();
      oldBoxes.forEach(this.placeBox);
    };

    this.reset();
}
