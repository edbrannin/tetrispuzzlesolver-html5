const I = "i",
  O = "o",
  T = "t",
  J = "j",
  L = "l",
  S = "s",
  Z = "z";

class Solver {
  constructor({
    rows,
    cols,
    iblocks,
    oblocks,
    tblocks,
    jblocks,
    lblocks,
    sblocks,
    zblocks,
  }) {
    this.blocksPtr = 0;
    this.rows = this.rows;
    this.cols = this.cols;
    this.nPieces =
      iblocks + oblocks + tblocks + jblocks + lblocks + sblocks + zblocks;
    this.t = Date.now();
    let i;
    this.blocks = new Array(this.nPieces);
    for (i = 0; i < iblocks; i++) {
      this.blocks[this.blocksPtr++] = I;
    }
    for (i = 0; i < oblocks; i++) {
      this.blocks[this.blocksPtr++] = O;
    }
    for (i = 0; i < tblocks; i++) {
      this.blocks[this.blocksPtr++] = T;
    }
    for (i = 0; i < jblocks; i++) {
      this.blocks[this.blocksPtr++] = J;
    }
    for (i = 0; i < lblocks; i++) {
      this.blocks[this.blocksPtr++] = L;
    }
    for (i = 0; i < sblocks; i++) {
      this.blocks[this.blocksPtr++] = S;
    }
    for (i = 0; i < zblocks; i++) {
      this.blocks[this.blocksPtr++] = Z;
    }
    this.blocksPtr = 0;

    this.board = new Array(this.rows);
    for (var y = 0; y < this.board.length; y++) {
      this.board[y] = new Array(this.cols);
      for (var x = 0; x < this.board[0].length; x++) this.board[y][x] = 0;
    }
  }

  solve() {
    // old solve()
    if (this.nPieces * 4 !== this.rows * this.cols) postMessage("impossible");
    else if (this.s(1)) {
      //cannot be filled by tetraminos
      this.sendBoard();
      postMessage("solved");
    } else postMessage("impossible");
  }

  sendBoard() {
    if (this.board) {
      var s = "grid " + this.board.length + " " + this.board[0].length + " ";
      for (var y = 0; y < this.board.length; y++)
        for (var x = 0; x < this.board[0].length; x++) s += this.board[y][x] + " ";
      postMessage(s);
    }
  }

  group(y, x) {
    if (y >= 0 && y < this.rows && x >= 0 && x < this.cols && this.board[y][x] === 0) {
      this.board[y][x] = -1;
      return (
        1 + this.group(y, x + 1) + this.group(y, x - 1) + this.group(y + 1, x) + this.group(y - 1, x)
      );
    }
    return 0;
  }

  clearGroups() {
    for (var y = 0; y < this.rows; y++) {
      for (var x = 0; x < this.cols; x++) {
        if (this.board[y][x] === -1) {
          this.board[y][x] = 0;
        }
      }
    }
  }

  isStupidConfig() {
    for (var y = 0; y < this.rows; y++) {
      for (var x = 0; x < this.cols; x++) {
        if (this.board[y][x] === 0) {
          if (this.group(y, x) % 4 !== 0) {
            this.clearGroups();
            return true; //cannot be filled by tetraminos, stupid config
          }
        }
      }
    }
    this.clearGroups();
    return false;
  }

  s(p) {
    let x, y;
    if (Date.now() - this.t > 20) {
      this.sendBoard();
      this.t = Date.now();
    }
    if (this.blocksPtr >= this.blocks.length) {
      return true; //puzzle is solved
    }
    var block = this.blocks[this.blocksPtr++];
    if (block === I) {
      //I shaped block can have 2 rotations.
      /*
     #
     #
     #
     #
     */
      for (y = 0; y <= this.rows - 4; y++) {
        for (x = 0; x <= this.cols - 1; x++) {
          if (
            this.board[y][x] === 0 &&
            this.board[y + 1][x] === 0 &&
            this.board[y + 2][x] === 0 &&
            this.board[y + 3][x] === 0
          ) {
            //we found a hole that fits this block, we'll place it here and see if the puzzle can be solved
            this.board[y][x] = p;
            this.board[y + 1][x] = p;
            this.board[y + 2][x] = p;
            this.board[y + 3][x] = p;
            if (!this.isStupidConfig())
              if (this.s(p + 1)) {
                return true; //this is the right place for this block
              }
            //otherwise, we need to find another place
            this.board[y][x] = 0;
            this.board[y + 1][x] = 0;
            this.board[y + 2][x] = 0;
            this.board[y + 3][x] = 0;
          }
        }
      }
      // ####
      for (y = 0; y <= this.rows - 1; y++) {
        for (x = 0; x <= this.cols - 4; x++) {
          if (
            this.board[y][x] === 0 &&
            this.board[y][x + 1] === 0 &&
            this.board[y][x + 2] === 0 &&
            this.board[y][x + 3] === 0
          ) {
            //we found a hole that fits this block, we'll place it here and see if the puzzle can be solved
            this.board[y][x] = p;
            this.board[y][x + 1] = p;
            this.board[y][x + 2] = p;
            this.board[y][x + 3] = p;
            if (!this.isStupidConfig())
              if (this.s(p + 1)) {
                return true; //this is the right place for this block
              } //otherwise, we need to find another place
            this.board[y][x] = 0;
            this.board[y][x + 1] = 0;
            this.board[y][x + 2] = 0;
            this.board[y][x + 3] = 0;
          }
        }
      }
      //we couldn't fina a suitable place for this block, that means that the puzzle is either unsolveable or one of the pieces is in the wrong place
      //let's put the piece back in the list and continue searching
      this.blocksPtr--;
      return false; //0=couldn't find a place for this block
    }
    if (block === O) {
      //2x2 square block can have only 1 rotation
      for (y = 0; y <= this.rows - 2; y++) {
        for (x = 0; x <= this.cols - 2; x++) {
          if (
            this.board[y][x] === 0 &&
            this.board[y + 1][x] === 0 &&
            this.board[y][x + 1] === 0 &&
            this.board[y + 1][x + 1] === 0
          ) {
            //we found a hole that fits this block, we'll place it here and see if the puzzle can be solved
            this.board[y][x] = p;
            this.board[y + 1][x] = p;
            this.board[y][x + 1] = p;
            this.board[y + 1][x + 1] = p;
            if (!this.isStupidConfig())
              if (this.s(p + 1)) {
                return true; //this is the right place for this block
              } //otherwise, we need to find another place
            this.board[y][x] = 0;
            this.board[y + 1][x] = 0;
            this.board[y][x + 1] = 0;
            this.board[y + 1][x + 1] = 0;
          }
        }
      }
      //we couldn't fina a suitable place for this block, that means that the puzzle is either unsolveable or one of the pieces is in the wrong place
      //let's put the piece back in the list and continue searching
      this.blocksPtr--;
      return false; //0=couldn't find a place for this block
    }

    if (block === T) {
      //T shaped block can have 4 rotations
      /*
     ###
     _#
     */
      for (y = 0; y <= this.rows - 2; y++) {
        for (x = 0; x <= this.cols - 3; x++) {
          if (
            this.board[y][x] === 0 &&
            this.board[y][x + 1] === 0 &&
            this.board[y + 1][x + 1] === 0 &&
            this.board[y][x + 2] === 0
          ) {
            //we found a hole that fits this block, we'll place it here and see if the puzzle can be solved
            this.board[y][x] = p;
            this.board[y][x + 1] = p;
            this.board[y + 1][x + 1] = p;
            this.board[y][x + 2] = p;
            if (!this.isStupidConfig())
              if (this.s(p + 1)) {
                return true; //this is the right place for this block
              } //otherwise, we need to find another place
            this.board[y][x] = 0;
            this.board[y][x + 1] = 0;
            this.board[y + 1][x + 1] = 0;
            this.board[y][x + 2] = 0;
          }
        }
      }
      /*
     #
     ##
     #
     */
      for (y = 0; y <= this.rows - 3; y++) {
        for (x = 0; x <= this.cols - 2; x++) {
          if (
            this.board[y][x] === 0 &&
            this.board[y + 1][x] === 0 &&
            this.board[y + 1][x + 1] === 0 &&
            this.board[y + 2][x] === 0
          ) {
            //we found a hole that fits this block, we'll place it here and see if the puzzle can be solved
            this.board[y][x] = p;
            this.board[y + 1][x] = p;
            this.board[y + 1][x + 1] = p;
            this.board[y + 2][x] = p;
            if (!this.isStupidConfig())
              if (this.s(p + 1)) {
                return true; //this is the right place for this block
              } //otherwise, we need to find another place
            this.board[y][x] = 0;
            this.board[y + 1][x] = 0;
            this.board[y + 1][x + 1] = 0;
            this.board[y + 2][x] = 0;
          }
        }
      }
      /*
     _#
     ##
     _#
     */
      for (y = 0; y <= this.rows - 3; y++) {
        for (x = 0; x <= this.cols - 2; x++) {
          if (
            this.board[y][x + 1] === 0 &&
            this.board[y + 1][x] === 0 &&
            this.board[y + 1][x + 1] === 0 &&
            this.board[y + 2][x + 1] === 0
          ) {
            //we found a hole that fits this block, we'll place it here and see if the puzzle can be solved
            this.board[y][x + 1] = p;
            this.board[y + 1][x] = p;
            this.board[y + 1][x + 1] = p;
            this.board[y + 2][x + 1] = p;
            if (!this.isStupidConfig())
              if (this.s(p + 1)) {
                return true; //this is the right place for this block
              } //otherwise, we need to find another place
            this.board[y][x + 1] = 0;
            this.board[y + 1][x] = 0;
            this.board[y + 1][x + 1] = 0;
            this.board[y + 2][x + 1] = 0;
          }
        }
      }
      /*
     _#
     ###
     */
      for (y = 0; y <= this.rows - 2; y++) {
        for (x = 0; x <= this.cols - 3; x++) {
          if (
            this.board[y + 1][x] === 0 &&
            this.board[y][x + 1] === 0 &&
            this.board[y + 1][x + 1] === 0 &&
            this.board[y + 1][x + 2] === 0
          ) {
            //we found a hole that fits this block, we'll place it here and see if the puzzle can be solved
            this.board[y + 1][x] = p;
            this.board[y][x + 1] = p;
            this.board[y + 1][x + 1] = p;
            this.board[y + 1][x + 2] = p;
            if (!this.isStupidConfig())
              if (this.s(p + 1)) {
                return true; //this is the right place for this block
              } //otherwise, we need to find another place
            this.board[y + 1][x] = 0;
            this.board[y][x + 1] = 0;
            this.board[y + 1][x + 1] = 0;
            this.board[y + 1][x + 2] = 0;
          }
        }
      }
      //we couldn't fina a suitable place for this block, that means that the puzzle is either unsolveable or one of the pieces is in the wrong place
      //let's put the piece back in the list and continue searching
      this.blocksPtr--;
      return false; //0=couldn't find a place for this block
    }

    if (block === J) {
      //J shaped block can have 4 rotations
      /*
     ###
     __#
     */
      for (y = 0; y <= this.rows - 2; y++) {
        for (x = 0; x <= this.cols - 3; x++) {
          if (
            this.board[y][x] === 0 &&
            this.board[y][x + 1] === 0 &&
            this.board[y + 1][x + 2] === 0 &&
            this.board[y][x + 2] === 0
          ) {
            //we found a hole that fits this block, we'll place it here and see if the puzzle can be solved
            this.board[y][x] = p;
            this.board[y][x + 1] = p;
            this.board[y + 1][x + 2] = p;
            this.board[y][x + 2] = p;
            if (!this.isStupidConfig())
              if (this.s(p + 1)) {
                return true; //this is the right place for this block
              } //otherwise, we need to find another place
            this.board[y][x] = 0;
            this.board[y][x + 1] = 0;
            this.board[y + 1][x + 2] = 0;
            this.board[y][x + 2] = 0;
          }
        }
      }
      /*
     #
     ###
     */
      for (y = 0; y <= this.rows - 2; y++) {
        for (x = 0; x <= this.cols - 3; x++) {
          if (
            this.board[y + 1][x] === 0 &&
            this.board[y][x] === 0 &&
            this.board[y + 1][x + 1] === 0 &&
            this.board[y + 1][x + 2] === 0
          ) {
            //we found a hole that fits this block, we'll place it here and see if the puzzle can be solved
            this.board[y + 1][x] = p;
            this.board[y][x] = p;
            this.board[y + 1][x + 1] = p;
            this.board[y + 1][x + 2] = p;
            if (!this.isStupidConfig())
              if (this.s(p + 1)) {
                return true; //this is the right place for this block
              } //otherwise, we need to find another place
            this.board[y + 1][x] = 0;
            this.board[y][x] = 0;
            this.board[y + 1][x + 1] = 0;
            this.board[y + 1][x + 2] = 0;
          }
        }
      }
      /*
     ##
     #
     #
     */
      for (y = 0; y <= this.rows - 3; y++) {
        for (x = 0; x <= this.cols - 2; x++) {
          if (
            this.board[y][x] === 0 &&
            this.board[y + 1][x] === 0 &&
            this.board[y][x + 1] === 0 &&
            this.board[y + 2][x] === 0
          ) {
            //we found a hole that fits this block, we'll place it here and see if the puzzle can be solved
            this.board[y][x] = p;
            this.board[y + 1][x] = p;
            this.board[y][x + 1] = p;
            this.board[y + 2][x] = p;
            if (!this.isStupidConfig())
              if (this.s(p + 1)) {
                return true; //this is the right place for this block
              } //otherwise, we need to find another place
            this.board[y][x] = 0;
            this.board[y + 1][x] = 0;
            this.board[y][x + 1] = 0;
            this.board[y + 2][x] = 0;
          }
        }
      }
      /*
     _#
     _#
     ##
     */
      for (y = 0; y <= this.rows - 3; y++) {
        for (x = 0; x <= this.cols - 2; x++) {
          if (
            this.board[y][x + 1] === 0 &&
            this.board[y + 2][x] === 0 &&
            this.board[y + 1][x + 1] === 0 &&
            this.board[y + 2][x + 1] === 0
          ) {
            //we found a hole that fits this block, we'll place it here and see if the puzzle can be solved
            this.board[y][x + 1] = p;
            this.board[y + 2][x] = p;
            this.board[y + 1][x + 1] = p;
            this.board[y + 2][x + 1] = p;
            if (!this.isStupidConfig())
              if (this.s(p + 1)) {
                return true; //this is the right place for this block
              } //otherwise, we need to find another place
            this.board[y][x + 1] = 0;
            this.board[y + 2][x] = 0;
            this.board[y + 1][x + 1] = 0;
            this.board[y + 2][x + 1] = 0;
          }
        }
      }
      //we couldn't fina a suitable place for this block, that means that the puzzle is either unsolveable or one of the pieces is in the wrong place
      //let's put the piece back in the list and continue searching
      this.blocksPtr--;
      return false; //0=couldn't find a place for this block
    }

    if (block === L) {
      //L shaped block can have 4 rotations
      /*
     ###
     #
     */
      for (y = 0; y <= this.rows - 2; y++) {
        for (x = 0; x <= this.cols - 3; x++) {
          if (
            this.board[y][x] === 0 &&
            this.board[y][x + 1] === 0 &&
            this.board[y + 1][x] === 0 &&
            this.board[y][x + 2] === 0
          ) {
            //we found a hole that fits this block, we'll place it here and see if the puzzle can be solved
            this.board[y][x] = p;
            this.board[y][x + 1] = p;
            this.board[y + 1][x] = p;
            this.board[y][x + 2] = p;
            if (!this.isStupidConfig())
              if (this.s(p + 1)) {
                return true; //this is the right place for this block
              } //otherwise, we need to find another place
            this.board[y][x] = 0;
            this.board[y][x + 1] = 0;
            this.board[y + 1][x] = 0;
            this.board[y][x + 2] = 0;
          }
        }
      }
      /*
     #
     #
     ##
     */
      for (y = 0; y <= this.rows - 3; y++) {
        for (x = 0; x <= this.cols - 2; x++) {
          if (
            this.board[y][x] === 0 &&
            this.board[y + 1][x] === 0 &&
            this.board[y + 2][x + 1] === 0 &&
            this.board[y + 2][x] === 0
          ) {
            //we found a hole that fits this block, we'll place it here and see if the puzzle can be solved
            this.board[y][x] = p;
            this.board[y + 1][x] = p;
            this.board[y + 2][x + 1] = p;
            this.board[y + 2][x] = p;
            if (!this.isStupidConfig())
              if (this.s(p + 1)) {
                return true; //this is the right place for this block
              } //otherwise, we need to find another place
            this.board[y][x] = 0;
            this.board[y + 1][x] = 0;
            this.board[y + 2][x + 1] = 0;
            this.board[y + 2][x] = 0;
          }
        }
      }
      /*
     ##
     _#
     _#
     */
      for (y = 0; y <= this.rows - 3; y++) {
        for (x = 0; x <= this.cols - 2; x++) {
          if (
            this.board[y][x + 1] === 0 &&
            this.board[y][x] === 0 &&
            this.board[y + 1][x + 1] === 0 &&
            this.board[y + 2][x + 1] === 0
          ) {
            //we found a hole that fits this block, we'll place it here and see if the puzzle can be solved
            this.board[y][x + 1] = p;
            this.board[y][x] = p;
            this.board[y + 1][x + 1] = p;
            this.board[y + 2][x + 1] = p;
            if (!this.isStupidConfig())
              if (this.s(p + 1)) {
                return true; //this is the right place for this block
              } //otherwise, we need to find another place
            this.board[y][x + 1] = 0;
            this.board[y][x] = 0;
            this.board[y + 1][x + 1] = 0;
            this.board[y + 2][x + 1] = 0;
          }
        }
      }
      /*
     __#
     ###
     */
      for (y = 0; y <= this.rows - 2; y++) {
        for (x = 0; x <= this.cols - 3; x++) {
          if (
            this.board[y + 1][x] === 0 &&
            this.board[y][x + 2] === 0 &&
            this.board[y + 1][x + 1] === 0 &&
            this.board[y + 1][x + 2] === 0
          ) {
            //we found a hole that fits this block, we'll place it here and see if the puzzle can be solved
            this.board[y + 1][x] = p;
            this.board[y][x + 2] = p;
            this.board[y + 1][x + 1] = p;
            this.board[y + 1][x + 2] = p;
            if (!this.isStupidConfig())
              if (this.s(p + 1)) {
                return true; //this is the right place for this block
              } //otherwise, we need to find another place
            this.board[y + 1][x] = 0;
            this.board[y][x + 2] = 0;
            this.board[y + 1][x + 1] = 0;
            this.board[y + 1][x + 2] = 0;
          }
        }
      }
      //we couldn't fina a suitable place for this block, that means that the puzzle is either unsolveable or one of the pieces is in the wrong place
      //let's put the piece back in the list and continue searching
      this.blocksPtr--;
      return false; //0=couldn't find a place for this block
    }

    if (block === S) {
      //S shaped block can have 2 rotations
      /*
     #
     ##
     _#
     */
      for (y = 0; y <= this.rows - 3; y++) {
        for (x = 0; x <= this.cols - 2; x++) {
          if (
            this.board[y][x] === 0 &&
            this.board[y + 1][x] === 0 &&
            this.board[y + 1][x + 1] === 0 &&
            this.board[y + 2][x + 1] === 0
          ) {
            //we found a hole that fits this block, we'll place it here and see if the puzzle can be solved
            this.board[y][x] = p;
            this.board[y + 1][x] = p;
            this.board[y + 1][x + 1] = p;
            this.board[y + 2][x + 1] = p;
            if (!this.isStupidConfig())
              if (this.s(p + 1)) {
                return true; //this is the right place for this block
              } //otherwise, we need to find another place
            this.board[y][x] = 0;
            this.board[y + 1][x] = 0;
            this.board[y + 1][x + 1] = 0;
            this.board[y + 2][x + 1] = 0;
          }
        }
      }
      /*
     _##
     ##
     */
      for (y = 0; y <= this.rows - 2; y++) {
        for (x = 0; x <= this.cols - 3; x++) {
          if (
            this.board[y][x + 1] === 0 &&
            this.board[y][x + 2] === 0 &&
            this.board[y + 1][x] === 0 &&
            this.board[y + 1][x + 1] === 0
          ) {
            //we found a hole that fits this block, we'll place it here and see if the puzzle can be solved
            this.board[y][x + 1] = p;
            this.board[y][x + 2] = p;
            this.board[y + 1][x] = p;
            this.board[y + 1][x + 1] = p;
            if (!this.isStupidConfig())
              if (this.s(p + 1)) {
                return true; //this is the right place for this block
              } //otherwise, we need to find another place
            this.board[y][x + 1] = 0;
            this.board[y][x + 2] = 0;
            this.board[y + 1][x] = 0;
            this.board[y + 1][x + 1] = 0;
          }
        }
      }
      //we couldn't fina a suitable place for this block, that means that the puzzle is either unsolveable or one of the pieces is in the wrong place
      //let's put the piece back in the list and continue searching
      this.blocksPtr--;
      return false; //0=couldn't find a place for this block
    }

    if (block === Z) {
      //Z shaped block can have 2 rotations
      /*
       **
     _**
     */
      for (y = 0; y <= this.rows - 2; y++) {
        for (x = 0; x <= this.cols - 3; x++) {
          if (
            this.board[y][x] === 0 &&
            this.board[y][x + 1] === 0 &&
            this.board[y + 1][x + 1] === 0 &&
            this.board[y + 1][x + 2] === 0
          ) {
            //we found a hole that fits this block, we'll place it here and see if the puzzle can be solved
            this.board[y][x] = p;
            this.board[y][x + 1] = p;
            this.board[y + 1][x + 1] = p;
            this.board[y + 1][x + 2] = p;
            if (!this.isStupidConfig())
              if (this.s(p + 1)) {
                return true; //this is the right place for this block
              } //otherwise, we need to find another place
            this.board[y][x] = 0;
            this.board[y][x + 1] = 0;
            this.board[y + 1][x + 1] = 0;
            this.board[y + 1][x + 2] = 0;
          }
        }
      }
      /*
     _#
     ##
     #
     */
      for (y = 0; y <= this.rows - 3; y++) {
        for (x = 0; x <= this.cols - 2; x++) {
          if (
            this.board[y][x + 1] === 0 &&
            this.board[y + 1][x] === 0 &&
            this.board[y + 1][x + 1] === 0 &&
            this.board[y + 2][x] === 0
          ) {
            //we found a hole that fits this block, we'll place it here and see if the puzzle can be solved
            this.board[y][x + 1] = p;
            this.board[y + 1][x] = p;
            this.board[y + 1][x + 1] = p;
            this.board[y + 2][x] = p;
            if (!this.isStupidConfig())
              if (this.s(p + 1)) {
                return true; //this is the right place for this block
              } //otherwise, we need to find another place
            this.board[y][x + 1] = 0;
            this.board[y + 1][x] = 0;
            this.board[y + 1][x + 1] = 0;
            this.board[y + 2][x] = 0;
          }
        }
      }
      //we couldn't fina a suitable place for this block, that means that the puzzle is either unsolveable or one of the pieces is in the wrong place
      //let's put the piece back in the list and continue searching
      this.blocksPtr--;
      return false; //0=couldn't find a place for this block
    }
  }

}


export default Solver;
