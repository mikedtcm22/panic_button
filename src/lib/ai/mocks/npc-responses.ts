export interface NPCMockResponse {
  id: string;
  context: string;
  response: string;
}

export const npcMockResponses: NPCMockResponse[] = [
  {
    id: 'npc-1',
    context: 'tavern',
    response: `**Gareth "Copper-Count" Blackwood**

*Appearance:* A wiry halfling with ink-stained fingers and a worn leather vest covered in accounting ledgers. His left eye twitches when he calculates numbers in his head.

*Personality:* Obsessively counts everything - coins, steps, words in conversations. Speaks in financial metaphors and constantly rubs a worn copper piece for luck.

*Motivation:* Desperately seeking investors for his "revolutionary" idea: a tavern where patrons pay in advance for monthly ale subscriptions.

*Quest Hook:* His ledgers contain coded information about shipments to a mysterious buyer in the warehouse district. He'll trade the cipher for help collecting a debt from a local merchant.`
  },
  {
    id: 'npc-2',
    context: 'market',
    response: `**Mirella the Mushroom Maven**

*Appearance:* An elderly gnome woman with wild grey hair adorned with dried fungi. Carries a basket that smells of earth and mystery.

*Personality:* Speaks in whispers and riddles, claims the mushrooms "tell her things." Giggles at inappropriate times and refers to everyone as "little spore."

*Motivation:* Searching for the legendary Shadowcap Mushroom, said to grow only where blood was spilled under a full moon.

*Quest Hook:* She's noticed strange fungal growth in the sewers beneath the market. Will pay handsomely for escorts to investigate, warning that "the mycelium remembers everything."`
  },
  {
    id: 'npc-3',
    context: 'road',
    response: `**Captain Thorne Windstrider**

*Appearance:* A weathered human veteran with a pronounced limp, wearing a faded military uniform from a disbanded mercenary company. Missing two fingers on his left hand.

*Personality:* Overly cautious, insists on walking exactly five feet from any road edge. Compulsively checks over his shoulder every thirty seconds.

*Motivation:* Transporting a sealed lockbox to the capital, claims it contains his pension papers but won't let anyone touch it.

*Quest Hook:* He's being followed by shadows that only he seems to notice. The lockbox actually contains evidence of his former company's war crimes, and multiple parties want it.`
  }
];

export function getNPCResponse(context?: string): NPCMockResponse {
  if (context) {
    const contextMatch = npcMockResponses.find(r => r.context === context);
    if (contextMatch) {
      return contextMatch;
    }
  }
  
  // Return random response if no context or no match
  const randomIndex = Math.floor(Math.random() * npcMockResponses.length);
  return npcMockResponses[randomIndex];
}