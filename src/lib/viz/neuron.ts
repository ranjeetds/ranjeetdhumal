/**
 * One neuron: a weighted sum, a bias, and an activation. Two inputs, so the
 * arithmetic fits on the figure.
 */

import { activation, type ActivationId } from './activations';

export interface NeuronInput {
  x1: number;
  x2: number;
  w1: number;
  w2: number;
  bias: number;
  activation: ActivationId;
}

export interface NeuronForward {
  pre: number;
  output: number;
}

export function neuronForward(input: NeuronInput): NeuronForward {
  const pre = input.w1 * input.x1 + input.w2 * input.x2 + input.bias;
  return { pre, output: activation(input.activation, pre) };
}
