import Solver from './solver';

it('solves 2x2', () => {
  const solver = new Solver({
    rows: 2,
    cols: 2,
    oblocks: 1,
  });
  const answer = solver.solve();
  expect(answer.rows).toBe(2);
  expect(answer.cols).toBe(2);
  expect(answer.nPieces).toBe(1);
  expect(answer.solved).toBe(true);
  expect(answer.board).toEqual([
    [ 1, 1 ],
    [ 1, 1 ],
  ]);
});

it('solves the default 8x6', () => {
  const solver = new Solver({
    rows: 6,
    cols: 8,
    iblocks: 1,
    oblocks: 5,
    tblocks: 2,
    jblocks: 0,
    lblocks: 1,
    sblocks: 2,
    zblocks: 1,
  });
  const answer = solver.solve();
  expect(answer.rows).toBe(6);
  expect(answer.cols).toBe(8);
  expect(answer.nPieces).toBe(12);
  expect(answer.solved).toBe(true);
  expect(answer.board).toEqual([
    [ 1, 2, 2, 3,  3,  10, 9,  9 ],
    [ 1, 2, 2, 3,  3,  10, 10, 9 ],
    [ 1, 4, 4, 11, 12, 12, 10, 9 ],
    [ 1, 4, 4, 11, 11, 12, 12, 7 ],
    [ 5, 5, 6, 6,  11, 8,  7,  7 ],
    [ 5, 5, 6, 6,  8,  8,  8,  7 ],
  ]);
});

