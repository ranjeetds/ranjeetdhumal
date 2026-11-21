/**
 * Static diagrams for guides that do not have a live studio instrument.
 * The component that draws them imports these ids.
 */
export const guideDiagramIds = [
  'matrix',
  'bias-variance',
  'test',
  'calibration',
  'linear',
  'tree',
  'split',
  'retrieve',
  'chunk',
  'retrieval-score',
  'workflow',
  'tool',
  'weight-point',
  'task-vector',
  'improvement',
] as const;

export type GuideDiagramId = (typeof guideDiagramIds)[number];

export const guideDiagrams: Record<GuideDiagramId, { title: string; caption: string }> = {
  matrix: {
    title: 'A map that keeps one direction',
    caption: 'The matrix sends one direction on, scaled, and collapses another to nothing. What it collapses cannot be recovered later.',
  },
  'bias-variance': {
    title: 'Two ways to miss',
    caption: 'A rigid family misses the curve on every draw. A flexible family hits this draw and scatters on the next one.',
  },
  test: {
    title: 'An alarm under a stated story',
    caption: 'The shaded tail is results at least as extreme as yours if the story of no effect is true. The height of the tail is not the probability that the story is false.',
  },
  calibration: {
    title: 'Stated chance against frequency',
    caption: 'The diagonal is a calibrated model. The curve below it states a higher chance than the events deliver.',
  },
  linear: {
    title: 'A flat cut',
    caption: 'A linear model separates with one straight boundary. Intertwined classes have no such cut until you change the coordinates.',
  },
  tree: {
    title: 'Cuts along the axes',
    caption: 'Each split uses one feature and one threshold. The regions are rectangles, which is why a threshold interaction is natural and a smooth slope is a staircase.',
  },
  split: {
    title: 'A leak across the split',
    caption: 'Training may shape the model. The test may not. A feature built from both sides, or a duplicate that crosses the line, carries the answer across.',
  },
  retrieve: {
    title: 'Read a passage, or do not',
    caption: 'Retrieval puts a selected passage into the context. If the answer is unchanged when the passage is removed, the passage was not the source.',
  },
  chunk: {
    title: 'A cut through a rule',
    caption: 'The retrieved piece contains the rule and stops before the exception. The model can only read the piece it was given.',
  },
  'retrieval-score': {
    title: 'Two marks, not one sentence',
    caption: 'First, was the supporting passage kept? Second, did the answer stay inside it? A true sentence from the wrong passage fails the first mark.',
  },
  workflow: {
    title: 'A path, or a loop',
    caption: 'A workflow is a sequence your code chooses. An agent is a loop in which the model chooses the next step, including when to stop.',
  },
  tool: {
    title: 'A proposal meets a schema',
    caption: 'The model emits a call. The schema accepts it or refuses it. The act happens only on the accepted side.',
  },
  'weight-point': {
    title: 'Two solutions and the midpoint',
    caption: 'Each trained model is a point. The midpoint is another point. It is a usable model only when the straight line between them stays in a low-loss region.',
  },
  'task-vector': {
    title: 'Edits as directions',
    caption: 'A task vector is the fine-tune minus the base. Adding two of them asks the directions not to cancel. The merged point still has to be scored.',
  },
  improvement: {
    title: 'What the loop is allowed to change',
    caption: 'The proposer may suggest a change. The test that judges it stays fixed. A rising score means nothing if the proposer can rewrite the test.',
  },
};
