export interface PlotMockResponse {
  id: string;
  response: string;
}

export const plotMockResponses: PlotMockResponse[] = [
  {
    id: 'plot-1',
    response: `**The Rival's Gambit**

The NPC the party was supposed to meet has been arrested on fabricated charges by a rival faction. The city watch is holding them in the courthouse jail awaiting trial tomorrow at dawn.

*New Objectives:*
- Investigate who framed the NPC (the rival merchant guild)
- Gather evidence of innocence from three witnesses
- Decide whether to break them out or prove innocence legally

*Complication:* The real criminal is blackmailing one of the party member's contacts, creating a moral dilemma between justice and loyalty.`
  },
  {
    id: 'plot-2',
    response: `**The Double Agent**

The quest giver reveals they've been working for the enemy all along, but claims they're actually a triple agent trying to expose corruption in both factions.

*Immediate Consequences:*
- The "package" the party delivered was actually evidence of the quest giver's deception
- Both factions now consider the party untrustworthy
- A third, neutral party offers sanctuary in exchange for information

*Choice Point:* Trust the triple agent and help expose both factions, or turn them in to regain standing with one side.`
  }
];

export function getPlotResponse(): PlotMockResponse {
  const randomIndex = Math.floor(Math.random() * plotMockResponses.length);
  return plotMockResponses[randomIndex];
}