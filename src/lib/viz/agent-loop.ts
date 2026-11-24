/**
 * One designed agent step. The model proposes a call. The schema accepts it.
 * The tool either returns a balance or an error. The next observation is that
 * result, not a sentence about it.
 */

export interface AgentStage {
  id: 'observe' | 'decide' | 'act' | 'result';
  title: string;
  /** What the loop is holding at this stage. */
  state: string;
  /** What a transcript grader would be able to see. */
  commentary: string;
}

export function agentStages(failed: boolean): readonly AgentStage[] {
  const result = failed ? 'error: unknown account' : 'balance: 40';
  const next = failed
    ? 'The loop stops. The account was not read.'
    : 'The loop may answer 40, because that is the value the tool returned.';
  return [
    {
      id: 'observe',
      title: 'Observe',
      state: 'Question: what is the balance of account 14? Tool result: none.',
      commentary: 'The user asked for a balance.',
    },
    {
      id: 'decide',
      title: 'Decide',
      state: 'Proposal: get_balance, account = 14.',
      commentary: 'The model says it will look the balance up.',
    },
    {
      id: 'act',
      title: 'Act',
      state: 'Schema: account is required and must be a number. Accepted.',
      commentary: 'A tool was called.',
    },
    {
      id: 'result',
      title: 'Result',
      state: `${result}. ${next}`,
      commentary: failed ? 'The model can still say the balance is 40.' : 'The model can say the balance is 40.',
    },
  ];
}
