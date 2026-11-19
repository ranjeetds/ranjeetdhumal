/**
 * One input, a ReLU, one linear output, and a squared error.
 * The gradients are the chain rule on that graph and nothing else.
 */

export interface TinyNet {
  x: number;
  w1: number;
  b1: number;
  w2: number;
  b2: number;
  target: number;
}

export interface TinyGradients {
  output: number;
  hidden: number;
  w2: number;
  b2: number;
  w1: number;
  b1: number;
  /** 1 when the ReLU is open, otherwise 0. At exactly zero this is 0. */
  reluGate: number;
}

export interface TinyPass {
  pre: number;
  hidden: number;
  output: number;
  loss: number;
  gradients: TinyGradients;
}

export function tinyPass(net: TinyNet): TinyPass {
  const pre = net.w1 * net.x + net.b1;
  const reluGate = pre > 0 ? 1 : 0;
  const hidden = reluGate * pre;
  const output = net.w2 * hidden + net.b2;
  const gap = output - net.target;
  const loss = gap * gap;
  const dOutput = 2 * gap;
  const dHidden = dOutput * net.w2;
  return {
    pre,
    hidden,
    output,
    loss,
    gradients: {
      output: dOutput,
      hidden: dHidden,
      w2: dOutput * hidden,
      b2: dOutput,
      w1: dHidden * reluGate * net.x,
      b1: dHidden * reluGate,
      reluGate,
    },
  };
}

/** One gradient step on the four parameters. The input and the target stay put. */
export function tinyStep(net: TinyNet, learningRate: number): TinyNet {
  const { gradients } = tinyPass(net);
  return {
    ...net,
    w1: net.w1 - learningRate * gradients.w1,
    b1: net.b1 - learningRate * gradients.b1,
    w2: net.w2 - learningRate * gradients.w2,
    b2: net.b2 - learningRate * gradients.b2,
  };
}
