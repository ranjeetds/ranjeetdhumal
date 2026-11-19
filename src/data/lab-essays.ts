/**
 * The teaching text for each figure. The registry says what exists and how it is
 * built; this file says what a person should see, do, and come away believing.
 * Keyed by visualization id so a new figure cannot ship without an essay.
 */

import type { VisualizationId } from '@/components/visualizations/registry';

export interface LabEssay {
  /** What is on the screen before any interaction. */
  scene: string;
  /** What the person can change, and what the picture does in response. */
  interaction: string;
  /** The belief the interaction is designed to produce. */
  insight: string;
  concepts: readonly string[];
}

export const labEssays: Record<VisualizationId, LabEssay> = {
  'sample-mean': {
    scene:
      'Two histograms on one axis. The grey bars are a fixed population of 240 numbers, piled on the left with a long tail to the right. The coloured bars are one sample drawn from that population without replacement. A dashed line marks the mean of everyone. A solid line marks the mean of this draw. The readout gives both means and the spread of the sample.',
    interaction:
      'Choose n = 8, 30, or 120. A larger size on the same draw keeps the points already drawn and adds to them, so the mean moves because of the new points, not because the old ones were replaced. Draw again to start a fresh shuffle. At n = 8 the solid line jumps from draw to draw. At n = 120 it sits close to the dashed line, and the coloured shape starts to resemble the grey one.',
    insight:
      'The mean is a fact about the rows you have. A small or lopsided draw can put that fact well away from the population, and the shape — here, a tail that pulls the mean to the right of the pile — is invisible if all you keep is the average. Every loss later in the notebook is an average over a sample. It inherits this limit.',
    concepts: ['A sample is not the population', 'The mean', 'A tail the mean does not show'],
  },
  'gradient-descent': {
    scene:
      'A contour map of a loss with two basins. One is deeper. A trajectory starts at a chosen point and walks, with momentum, leaving a trace. The current step and the current loss are readable beside the figure. Up to four traces remain, older ones fading, so a comparison is still on the screen when a new run begins.',
    interaction:
      'Click the surface, or use the button, to start a descent from that point. The trace is written directly onto the figure as it moves. Starting in the upper left and again in the lower right is the whole lesson. Changing nothing else — same step size, same momentum — the two runs settle in different basins. The reduced-motion state draws the finished trace without the walk.',
    insight:
      'The update rule does not choose the solution. The place you start does. A lower loss exists on this surface and a run can fail to find it while doing everything "correctly." Momentum changes the path, including the overshoot, but it does not grant a view of the other valley.',
    concepts: ['A loss as a surface', 'Step size and momentum', 'Local minima'],
  },
  'decision-boundaries': {
    scene:
      'A plane of labeled points, two classes, and a boundary drawn through them by the model currently selected. The boundary is the set of locations the model calls a tie. Misclassified points are marked, so the picture and the error count are the same fact.',
    interaction:
      'Add a point, drag one, or flip its label. Switch the model among a linear classifier, a shallow tree, and a small network, without touching the points. Scrub the training of the network from its first step to its last and watch the boundary move. The linear cut stays flat no matter where you drag. The tree cuts axis by axis. The network bends, and early in training it has not bent yet.',
    insight:
      'The boundary is not a property of the data. It is a property of the family of functions you allowed. Points that are easy for a tree can be impossible for a line, and a network that could separate them may not have done so at the step you stopped. Capacity you have not trained is capacity you do not have.',
    concepts: ['Decision boundary', 'Model capacity', 'Training as movement of the boundary'],
  },
  'dot-product': {
    scene:
      'Two arrows from one origin, one drawn in the ink colour and one in the accent. Four sliders are the components, from −2 to 2. The caption prints the dot product, both lengths, and the angle in degrees.',
    interaction:
      'Move a component and the arrow, the product, and the angle move together. Line the arrows up, set them at a right angle, and point them in opposite directions. Zero either vector. The product becomes 0 and the caption says there is no angle.',
    insight:
      'The product of the components is also the product of the lengths and the cosine of the angle. Agreement is a positive number, a right angle is zero, and opposition is negative. A zero-length vector has no direction, so the figure does not invent an angle for it. A later attention score is this kind of number.',
    concepts: ['Component-wise product', 'Cosine of the angle', 'A zero vector has no direction'],
  },
  'loss-functions': {
    scene:
      'A curve of loss against a prediction from 0 to 1. A vertical line and a marker sit on the prediction you chose. Squared error is the default, with prediction 0.20 and target 1, so the loss reads 0.64. Cross-entropy replaces the target slider with a label of 0 or 1.',
    interaction:
      'Move the prediction. For squared error, move the target and watch the bottom of the parabola follow it. Switch to cross-entropy and switch the label without moving the prediction. The same output becomes a different loss. Push a label-1 prediction toward 0 and the curve climbs.',
    insight:
      'A loss is a chosen way of scoring a disagreement, not a property of the prediction alone. Squared error is zero only at the target and treats an equal gap either side as the same miss. Cross-entropy scores the probability on the true label, and it is not symmetric in that way. The logarithm is clamped just inside 0 and 1 so the number stays defined.',
    concepts: ['Squared error', 'Binary cross-entropy', 'The target is part of the loss'],
  },
  neuron: {
    scene:
      'One line of arithmetic and two results. The defaults are weights 0.40 and −0.20, inputs 1.00 and 0.50, and bias 0.10, so the weighted sum is 0.40. ReLU is selected, and the output equals the sum. Five sliders and three activation buttons sit under the line.',
    interaction:
      'Move an input, a weight, or the bias and both numbers update. Drive the sum below zero under ReLU and the output becomes 0 while the sum stays negative. Switch to sigmoid or tanh on that same sum. Set both weights to 0 and the sum equals the bias.',
    insight:
      'The unit is a weighted sum plus a bend. The weights scale their own inputs. The bias shifts the sum whatever the inputs are. ReLU discards a negative sum. Sigmoid and tanh still answer on that sum, inside a fixed range. Nothing on the page was fitted. The sliders are the parameters.',
    concepts: ['Weighted sum', 'Bias', 'Activation'],
  },
  activations: {
    scene:
      'One curve from input −4 to 4, a marker, and a short tangent through the marker. ReLU is showing at input 1, so the output is 1 and the slope is 1. Axes cross at zero. Three buttons choose sigmoid, tanh, or ReLU.',
    interaction:
      'Move the input and read the output and the slope in the caption. Take ReLU below zero: both become 0. Sit it on exactly zero and the caption says the slope is undefined and that the figure draws 0. Switch to sigmoid or tanh and slide across zero. The tangent is steepest near zero and flattens at the ends.',
    insight:
      'The slope of the bend is what a backward pass multiplies by. Where the curve is flat, that factor is near zero. ReLU is flat on the whole negative side, and at the kink it has no single slope. The drawn 0 at that one point is a convention, stated in the caption.',
    concepts: ['Sigmoid', 'Tanh', 'ReLU and its kink'],
  },
  backpropagation: {
    scene:
      'A one-line description of the network, then a table: pre-activation, hidden value, output, loss, and the gradients of the loss with respect to the output, both second-layer parameters, the hidden unit, the ReLU gate, and both first-layer parameters. The defaults give pre-activation 0.700, output 0.460, loss 0.292, and gate 1.',
    interaction:
      'Move x, the four parameters, or the target and the table recomputes. Lower the first bias until the pre-activation is negative. The gate becomes 0 and the first-layer gradients become 0. Press One step to subtract 0.2 times each parameter gradient. Reset restores the defaults. The input and the target never step.',
    insight:
      'Each gradient is a product along the chain, and the ReLU contributes a factor of 0 or 1. A closed gate stops the first weight and the first bias from moving. The second bias still sees the output gap. One step is the same kind of update as a descent, on a loss that came from a composition rather than from a drawn surface.',
    concepts: ['Chain rule', 'ReLU gate', 'One gradient step'],
  },
  'attention-patterns': {
    scene:
      'One short sentence, tokenized, and a single attention head drawn as a grid. Rows are queries, columns are keys, and the color of a cell is the weight after the softmax. A marker on one query token shows which column it is reading. The other heads exist but are not drawn until you ask for one.',
    interaction:
      'The built figure uses one sentence and two designed heads, so the mechanism is visible before a real model is attached. Select a head, select a query token, and turn the causal mask on. Cells that would look into the future go to zero, and the rest of the row is renormalized so it still sums to one. A later version can accept a typed sentence. The lesson does not wait for that.',
    insight:
      'A head is a pattern of looking, not a concept with a name. One head may copy a subject to the verb that has to agree with it. Another may do nothing you can describe, and that is information too. Masking does not delete information from the grid so much as forbid a direction of travel. Averaging every head into one picture destroys the only structure the mechanism has.',
    concepts: ['Query, key, and value', 'Softmax weights', 'Causal masking'],
  },
  'transformer-block': {
    scene:
      'A single block, drawn as a stream of vectors entering from the left. Attention sits on a branch that reads the whole stream and writes an update. The feed-forward layer sits on the next branch and touches one position at a time. Both updates are added back onto the stream rather than replacing it. One token is selected and its vector is shown as a short column of values at each stage.',
    interaction:
      'Step through the block and stop after attention, after the first residual add, after the feed-forward layer, and after the second add. Swap the selected token for its neighbour and watch which stages change a lot. Toggle the residual path off, so the block replaces the stream instead of correcting it, and see the values lose what they carried in.',
    insight:
      'The block is a correction written onto a stream, not a machine that rebuilds the representation from nothing. Attention is the only stage that can move information between positions. The feed-forward stage cannot. If something about token A has to affect token B, it has to happen in attention or have happened in an earlier block. Turning the residual off is the fastest way to see what the stream was carrying that the block itself does not recompute.',
    concepts: ['Residual stream', 'Attention versus the feed-forward layer', 'A block as an update'],
  },
  'embedding-space': {
    scene:
      'A few hundred tokens, projected into three dimensions and drawn as points. Color marks a coarse grouping you chose, such as numerals, or punctuation, or a cluster the projection suggested. A selected token has its nearest neighbours listed beside the view, with distances. The projection method is named, because the picture is not the space.',
    interaction:
      'Drag to rotate. Search for a token and the view marks it and its neighbours. Switch the projection, from one linear method to another, without moving the underlying vectors. Clusters that were tight in the first view and scattered in the second were a property of the projection. Clusters that survive were in the vectors.',
    insight:
      'Nearness in the drawing is a claim about the projection you are looking through. Two tokens can be neighbours here and far apart in the real dimension, and the reverse. The interaction that earns the figure its place is the switch of projection. What remains after the switch is the only structure you should trust enough to describe in words.',
    concepts: ['Embeddings as vectors', 'Distance and angle', 'A projection is a choice'],
  },
  tokenization: {
    scene:
      'A text field and the pieces underneath it, each with an id. The default string is “The cat sat.” Words mode is showing: a run of letters stays together, and the space is its own piece. The vocabulary that assigns the ids is small and written by hand.',
    interaction:
      'Type, including a trailing space and the word “unbelievable”. Switch to Pieces. The same string is cut by longest match against that vocabulary, so the rare word falls into fragments while “cat” and “sat” survive. Select a piece. The readout gives its character span and its id. The id is an index in this vocabulary, not a model’s.',
    insight:
      'The model\'s alphabet is the vocabulary, and the vocabulary was fit to a corpus for length, not for linguistic sense. A behaviour that depends on a word as a unit is a behaviour the model may not have access to. The figure is for the moment a prompt does something strange. Look at the pieces before inventing a theory about the model\'s reasoning.',
    concepts: ['Vocabulary', 'A token is a string piece', 'Different tokenizers, different problems'],
  },
  'next-token': {
    scene:
      'Six words, and a bar for each. Above them, the context already written: “the”, “the cat”, “the cat sat”, or “the cat sat on the”. A temperature control sits beside the context. The tallest bar is marked by its length, and the readout says which word holds the most probability.',
    interaction:
      'Switch the context. The same six words stay, and the probability moves. Drag the temperature down and one bar takes almost everything. Drag it up and the short bars recover. Select a word. That selection is a sample from the distribution, including a sample of a word the bars barely supported.',
    insight:
      'The output of this kind of model is not a word. It is a distribution, and the word you see in a product is one draw from it. Context changes which word is likely. Temperature changes how willing the draw is to be unlikely. A confident sentence can be a low-temperature sample, not evidence that the other words had probability zero.',
    concepts: ['A distribution over tokens', 'Temperature', 'Sampling is not lookup'],
  },
  'agent-loop': {
    scene:
      'One task, a small explicit state, and four stages drawn in a circle: observe, decide, act, read the result. The observation the model would actually receive is shown as text at the observe stage, not implied. The decide stage shows the tool request and nothing else. The act stage shows the tool either running or refusing. The result stage shows what will be appended to the next observation.',
    interaction:
      'Step one stage at a time. At observe, you can see which facts were included and which were left out. At decide, you can edit nothing, but you can see the request the model emitted. Choose a tool result that is an error and step forward. The next observation contains the error, and the following decision either repeats the call, changes it, or stops. A control that hides the state and shows only the model\'s commentary is there so you can feel how little that commentary tells you.',
    insight:
      'The agent is the state and the rules for changing it. The model is the function that proposes the next request given the observation you built. A fluent description of the right action, with the action not taken, is a failed cycle. An error that never appears in the next observation will be followed by a confident invention. The figure makes those two failures visible by refusing to show the commentary as if it were the state.',
    concepts: ['The loop', 'Observation versus transcript', 'A tool error as data'],
  },
};
