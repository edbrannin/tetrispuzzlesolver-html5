import React, { Component } from 'react';
import { css } from 'emotion'

const getBlockSize = () => {
  var div = document.createElement('div');
  div.style.width = "4em";
  document.body.appendChild(div);
  const BLOCK_SIZE = div.offsetWidth;
  document.body.removeChild(div);
  return BLOCK_SIZE;
};

const getColors = (count) => {
  var colors = new Array(count + 1);
  colors[0] = "#202020";
  for(var i = 0; i < count; i++){
    const hue = (360 * (i / count));
    const sat = (i % 2 === 0 ? 100 : 50);
    colors[i + 1] = `hsl(${hue},${sat}%,50%)`;
  }
  return colors;
}

class Solution extends Component {
  state = {
    blockSize: getBlockSize(),
  }

  updateCanvas = () => {
    const { board, nPieces, rows, cols } = this.props;
    if (! board) {
      return;
    }
    const blockSize = getBlockSize();

    const colors = getColors(nPieces);

    // TODO ref
    const grid = document.getElementById("grid");
    grid.width = blockSize * cols;
    grid.height = blockSize * rows;
    const c = grid.getContext("2d");
    for(var y = 0; y < rows; y++){
      for(var x = 0; x < cols; x++){
        const color = board[y][x];
        c.fillStyle = colors[color];
        c.fillRect(blockSize * x,blockSize * y,blockSize,blockSize);
      }
    }
  }

  componentDidMount() {
    this.updateCanvas();
  }

  render() {
    return (
      <canvas
        id="grid"
        width={this.props.cols + this.state.blockSize}
        height={this.props.rows + this.state.blockSize}
        className={css`
          margin-bottom:2em;
        `}
      >
      </canvas>
    );
  }
}

export default Solution;
