/**
 * The fields that group the practical guides. A guide file's `field` must be one of
 * these ids. The order here is the order of the index.
 */

export const guideFields = [
  {
    id: 'mathematics',
    title: 'Mathematics',
    description: 'The objects the rest of the code is already using: a sample, a vector, a map, a slope.',
  },
  {
    id: 'statistics',
    title: 'Statistics',
    description: 'What a number computed on a sample is allowed to say about the next sample.',
  },
  {
    id: 'machine-learning',
    title: 'Machine learning',
    description: 'Choosing a family of functions, scoring it, and refusing a score that saw the answers.',
  },
  {
    id: 'deep-learning',
    title: 'Deep learning',
    description: 'A composition of maps, trained by passing a local slope back through the composition.',
  },
  {
    id: 'generative',
    title: 'Generative models',
    description: 'A distribution over the next token, and the sample a product shows you.',
  },
  {
    id: 'rag',
    title: 'Retrieval',
    description: 'Putting a document into the context, and checking that the answer came from it.',
  },
  {
    id: 'agents',
    title: 'Agents',
    description: 'A model that proposes a step, and the program that decides whether the step may happen.',
  },
  {
    id: 'weight-space',
    title: 'Weight space',
    description: 'Treating a trained model as a point, and asking what a step between two points does.',
  },
  {
    id: 'improvement',
    title: 'Recursive improvement',
    description: 'The claim that a system can improve the system that improves it, and the checks that claim requires.',
  },
] as const;

export type GuideFieldId = (typeof guideFields)[number]['id'];

export const guideFieldIds = guideFields.map((field) => field.id) as [GuideFieldId, ...GuideFieldId[]];

export function getGuideField(id: GuideFieldId) {
  const field = guideFields.find((candidate) => candidate.id === id);
  if (!field) throw new Error(`Unknown guide field: ${id}`);
  return field;
}
