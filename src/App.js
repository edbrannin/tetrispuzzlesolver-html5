import React, { Component } from "react";
import "./App.css";
import Solution from "./Solution";
import BlocksForm from "./BlocksForm";
import { css } from 'emotion'
import Solver from './solver';

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
    const solver = new Solver(getState());
    const answer = solver.solve();
    if (answer.impossible) {
      alert('Impossible');
      return;
    }
    // TODO Intermediate answers
    this.setState(answer);
  };

  reset = () => {
    this.setState({
      solved: false,
    });
  }

  render() {
    return (
      <div
        className={css`
            color: White;
            background-color: black;
            text-align: center;
            height: 100%;
        `}
      >
        <header className="App-heade">
          <h1 className="App-title">Tetris Puzzle Solver</h1>
          <p>
            Fills a rectangle with tetraminos.
            <br />
            Requires HTML5 Canvas.
          </p>
        </header>
        <div
          className={css`
          `}
        >
          {this.state.solved && (
            <div>
              <Solution
                rows={this.state.rows}
                cols={this.state.cols}
                board={this.state.board}
                nPieces={this.state.nPieces}
              />
              <p>
                <button
                  className={`
                    position: block,
                  `}
                  onClick={this.reset}
                >
                  Try Again
                </button>
              </p>
            </div>
          )}
          {this.state.solved || <BlocksForm onSolve={this.solve} />}
        </div>
      </div>
    );
  }
}

export default App;
