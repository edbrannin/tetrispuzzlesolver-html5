import React, { Component } from "react";
import "./App.css";
import Solution from "./Solution";
import BlocksForm from "./BlocksForm";
import { css } from 'emotion'

const getState = () => {
  const rows = Number(document.getElementById("rows").value),
    cols = Number(document.getElementById("cols").value),
    iblocks = Number(document.getElementById("iblocks").value),
    oblocks = Number(document.getElementById("oblocks").value),
    tblocks = Number(document.getElementById("tblocks").value),
    jblocks = Number(document.getElementById("jblocks").value),
    lblocks = Number(document.getElementById("lblocks").value),
    sblocks = Number(document.getElementById("sblocks").value),
    zblocks = Number(document.getElementById("zblocks").value),
    nPieces =
      iblocks + oblocks + tblocks + jblocks + lblocks + sblocks + zblocks;

  return {
    rows,
    cols,
    iblocks,
    oblocks,
    tblocks,
    jblocks,
    lblocks,
    sblocks,
    zblocks,
    nPieces
  };
};

class App extends Component {
  state = {
    solved: false,
  };

  solve = () => {
    const {
      rows,
      cols,
      iblocks,
      oblocks,
      tblocks,
      jblocks,
      lblocks,
      sblocks,
      zblocks,
      nPieces
    } = getState();

    var w = new Worker("solver.js");
    w.onmessage = function(event) {
      var params = event.data.split(" ");
      if (params[0].indexOf("impossible") === 0) {
        w.terminate();
        alert("Impossible");
        return;
      }
      if (params[0].indexOf("solved") === 0) {
        w.terminate();
        return;
      }
      if (params[0].indexOf("grid") === 0) {
        this.setState({
          solved: true,
          params,
          nPieces
        });
      }
    };

    w.postMessage(
      `s ${rows} ${cols} ${iblocks} ${oblocks} ${tblocks} ${jblocks} ${lblocks} ${sblocks} ${zblocks}`
    );
  };

  render() {
    return (
      <div className={css`
            color: White;
            background-color: black;
            text-align: center;
            height: 100%;
        `
        }
      >
        <header className="App-heade">
          <h1 className="App-title">Tetris Puzzle Solver</h1>
        </header>
        <div
          className={css`
            `
          }
          >
          <p>
            Fills a rectangle with tetraminos.<br />Requires HTML5 Canvas and Web
            Workers support.
          </p>
          {this.state.solved && (
            <Solution params={this.state.params} nPieces={this.state.nPieces} />
          )}
          {this.state.solved || <BlocksForm onSolve={this.solve} />}
        </div>
      </div>
    );
  }
}

export default App;
