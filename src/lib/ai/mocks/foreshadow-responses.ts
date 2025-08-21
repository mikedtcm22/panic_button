export interface ForeshadowMockResponse {
  id: string;
  response: string;
}

export const foreshadowMockResponses: ForeshadowMockResponse[] = [
  {
    id: 'foreshadow-1',
    response: `As the party conducts their business, a street urchin bumps into them, apologizing profusely. Later, they realize the child didn't steal anything - instead, they *left* something: a small paper with a symbol of an eye crying blood and tomorrow's date. Throughout the day, they notice at least three other people receive similar papers from different children, all of whom vanish into crowds immediately after.`,
  },
  {
    id: 'foreshadow-2',
    response: `The birds have gone silent. Not just quiet - completely absent. No pigeons on rooftops, no sparrows in the market, no ravens at the gallows. A local drunk mutters about "the last time this happened" but passes out before finishing. You notice several cats sitting perfectly still on windowsills, all facing the same direction - toward the abandoned bell tower on the hill.`,
  },
];

export function getForeshadowResponse(): ForeshadowMockResponse {
  const randomIndex = Math.floor(Math.random() * foreshadowMockResponses.length);
  return foreshadowMockResponses[randomIndex];
}
