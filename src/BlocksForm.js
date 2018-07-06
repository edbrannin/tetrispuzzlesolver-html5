import React, { Component } from "react";

const BlockInput = ({ letter }) => (
  <div>
    <label>
      <img src={`images/${letter}.png`} className="tetraminoIcon" alt={`${letter.toUpperCase()} Blocks`} />
      <input id={`${letter}blocks`} type="number" min="0" value="1" />
    </label>
  </div>
);

class BlocksForm extends Component {
  render() {
    return (
      <form id="params" onSubmit={this.solve}>
        <div>
          <div>
            <div>
              Size:
              <label>
                <input id="rows" type="number" min="1" value="6" />
                {" "}
                Rows,
              </label>
              {" "}
              <label>
                <input id="cols" type="number" min="1" value="8" />
                {" "}
                Columns
              </label>
            </div>
          </div>
          <BlockInput letter="i" />
          <BlockInput letter="o" />
          <BlockInput letter="t" />
          <BlockInput letter="j" />
          <BlockInput letter="l" />
          <BlockInput letter="s" />
          <BlockInput letter="z" />
        </div>
        <input type="submit" id="start" value="Solve" />
      </form>
    );
  }

  solve = () => {
    this.props.onSolve();
  }
}

export default BlocksForm;
