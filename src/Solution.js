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
  var colors=new Array(count+1);
  colors[0]="#202020";
  for(var i=0;i<count;i++){
    const hue = (360*(i/count));
    const sat = (i%2===0?100:50);
    colors[i+1]=`hsl(${hue},${sat}%,50%)`;
  }
  return colors;
}

class Solution extends Component {
  updateCanvas = () => {
    const { solution, nPieces } = this.props;
    const blockSize = getBlockSize;

    const colors = getColors(nPieces);

    // TODO ref
    var grid=document.getElementById("grid");
    var cols=Number(solution[2]), rows=Number(solution[1]);
    grid.width=blockSize*cols;
    grid.height=blockSize*rows;
    var c=grid.getContext("2d");
    for(var y=0;y<rows;y++){
      for(var x=0;x<cols;x++){
        var v=Number(solution[3+(y*cols)+x]);
        c.fillStyle=colors[v];
        c.fillRect(blockSize*x,blockSize*y,blockSize,blockSize);
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
        width={0}
        height={0}
        className={css`
          display:none;
          margin-bottom:2em;
        `}
      >
      </canvas>
    );
  }
}

export default Solution;
