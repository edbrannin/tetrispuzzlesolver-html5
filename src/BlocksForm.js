import React, { Component } from "react";
import { css } from 'emotion'

const NumberInput = ({ id, defaultValue }) => (
  <input
    id={id}
    type="number"
    min="0"
    defaultValue={defaultValue}
    className={css`
      width: 3em;
      font-size: 2em;
    `
    }
  />
)


const BlockInput = ({ letter, defaultValue }) => (
  <div
    className={css`
      display: inline-block;
      margin: 2em;
    `
    }
  >
    <label>
      <img
        src={`images/${letter}.png`}
        className="tetraminoIcon"
        alt={`${letter.toUpperCase()} Blocks`}
      />
      <NumberInput
        id={`${letter}blocks`}
        defaultValue={defaultValue}
      />
    </label>
  </div>
);

class BlocksForm extends Component {
  state = {
    canSolve: true,
  }

  render() {
    return (
      <form
        id="params"
        onSubmit={this.solve}
      >
        <div>
          <div>
            <div>
              Size:
              <label>
                <NumberInput id="rows" defaultValue={6} />
                {" "}
                Rows,
              </label>
              {" "}
              <label>
                <NumberInput id="cols" defaultValue={8} />
                {" "}
                Columns
              </label>
            </div>
          </div>
          <BlockInput letter="i" defaultValue={1} />
          <BlockInput letter="o" defaultValue={5} />
          <BlockInput letter="t" defaultValue={2} />
          <br />
          <BlockInput letter="j" defaultValue={0} />
          <BlockInput letter="l" defaultValue={1} />
          <br />
          <BlockInput letter="s" defaultValue={2} />
          <BlockInput letter="z" defaultValue={1} />
        </div>
        { this.state.canSolve ? (
          <input
            type="submit"
            id="start"
            value="Solve"
          />
        ) : (
          <p>Impossible to solve</p>
        )}
      </form>
    );
  }

  solve = (e) => {
    this.props.onSolve();
    e.preventDefault();
  }
}

export default BlocksForm;
