export type PanicType = 'npc' | 'encounter' | 'plot' | 'flavor' | 'foreshadow';

const mockResponses: Record<PanicType, string[]> = {
  npc: [
    "**Gruff Ironbeard** - A stocky dwarf blacksmith with soot-covered hands and a perpetual scowl. He speaks in short, clipped sentences and has a secret fondness for elvish poetry.",
    "**Melody Swiftwater** - A cheerful halfling bard who juggles poorly but sings beautifully. She knows all the local gossip and trades information for coin.",
    "**Captain Thorne** - A grizzled human veteran with a pronounced limp and countless war stories. His tavern tab is legendary, but so is his knowledge of the region.",
    "**Willow Moonshadow** - An enigmatic elf herbalist who speaks in riddles. She sells potions under the table and knows more than she lets on."
  ],
  encounter: [
    "**Tavern Brawl** - Three drunk mercenaries start a fight over a card game. DC 12 Persuasion to calm them or DC 10 Athletics to subdue.",
    "**Mysterious Stranger** - A cloaked figure approaches offering information about the quest, but demands a favor in return.",
    "**Pickpocket Attempt** - A street urchin tries to lift the party's coin purses. DC 14 Perception to notice, DC 10 Dexterity to catch.",
    "**Noble's Entourage** - A pompous noble and their guards demand the party's table. This could be resolved diplomatically or escalate quickly."
  ],
  plot: [
    "The innkeeper reveals they're actually a retired adventurer who faced the same evil 20 years ago and barely survived.",
    "A messenger arrives with urgent news: the king has fallen ill and the succession is in dispute.",
    "The party's main quest target has been spotted heading in the opposite direction - someone gave them bad information.",
    "A rival adventuring party claims they've already completed the party's quest and are here to collect the reward."
  ],
  flavor: [
    "The tavern smells of pipe smoke and spilled ale. A bard in the corner plays a melancholy tune about lost love.",
    "Thunder rumbles overhead as rain begins to patter against the windows. The fire crackles invitingly.",
    "The walls are decorated with trophy heads of various beasts. One seems to be watching the party.",
    "A cat weaves between the tables, stopping occasionally to stare at empty spaces as if seeing something invisible."
  ],
  foreshadow: [
    "You notice a patron nervously glancing at the door every few minutes, as if expecting trouble.",
    "The bartender mentions that strange lights have been seen in the old tower ruins at night.",
    "A drunk mumbles about 'the darkness coming' before passing out at their table.",
    "Children outside sing a nursery rhyme that eerily matches elements of your current quest."
  ],
};

interface MockResponseOptions {
  context?: string;
}

interface MockResponse {
  content: string;
  tokens: number;
  cost: number;
}

export async function generateMockResponse(
  type: PanicType,
  options?: MockResponseOptions
): Promise<MockResponse> {
  // Simulate API delay (between 300-400ms)
  const delay = 300 + Math.random() * 100;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  const responses = mockResponses[type];
  const content = responses[Math.floor(Math.random() * responses.length)];
  
  return {
    content,
    tokens: content.length,
    cost: 0
  };
}