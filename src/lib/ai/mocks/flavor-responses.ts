export interface FlavorMockResponse {
  id: string;
  location: string;
  response: string;
}

export const flavorMockResponses: FlavorMockResponse[] = [
  {
    id: 'flavor-1',
    location: 'tavern',
    response: `The air hangs thick with pipe smoke and spilled ale, creating a hazy amber atmosphere. A bard's lute has a broken string that twangs discordantly with every chorus. In the corner, a one-eyed cat nurses a saucer of cream while eyeing the party with suspicious intelligence. The floorboards creak in a rhythm that almost sounds like morse code, and the bartender's nervous laugh suggests they know something about it. A faded bounty poster on the wall has been defaced - someone drew a mustache on the wanted criminal, but underneath, barely visible, is written "They were innocent" in dried blood.`,
  },
  {
    id: 'flavor-2',
    location: 'dungeon',
    response: `Water drips in a steady rhythm from unseen heights, each drop echoing like a countdown timer. The walls are covered in scratch marks at shoulder height - hundreds of tallies grouped in sets of five, stopping abruptly at 1,827. A faint smell of cinnamon mingles inexplicably with the dungeon's mustiness. Your torchlight catches something glinting in a wall crack: a child's toy soldier, carved from jade, standing eternal watch. The iron bars show signs of repeated heating and cooling, as if something very hot had gripped them repeatedly.`,
  },
];

export function getFlavorResponse(location?: string): FlavorMockResponse {
  if (location) {
    const match = flavorMockResponses.find((r) => r.location === location);
    if (match) return match;
  }

  const randomIndex = Math.floor(Math.random() * flavorMockResponses.length);
  return flavorMockResponses[randomIndex];
}
