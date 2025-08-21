export interface EncounterMockResponse {
  id: string;
  difficulty: string;
  partyLevel: number;
  response: string;
}

export const encounterMockResponses: EncounterMockResponse[] = [
  {
    id: 'encounter-1',
    difficulty: 'medium',
    partyLevel: 5,
    response: `**The Warehouse Ambush**

*Enemies:*
- 1 Bandit Captain (CR 2)
- 3 Bandits (CR 1/8 each)
- 2 Guard Drakes (reskinned as trained dogs, CR 2 each)

*Terrain:* 
- Wooden crates provide half-cover throughout the 40x60 ft warehouse
- A rickety catwalk runs along the walls 15 feet up (DC 12 Acrobatics to move at full speed)
- Oil lanterns hang from chains (can be shot to create 5-ft fire hazards)

*Tactics:*
- Bandits start hidden behind crates (Stealth +3)
- Captain orders the dogs to flank while bandits provide crossbow cover
- If reduced to half health, Captain attempts to flee through hidden tunnel behind false crate

*Treasure:* 150 gp in stolen goods, Captain's signet ring (identifies local thieves' guild)`
  },
  {
    id: 'encounter-2',
    difficulty: 'easy',
    partyLevel: 3,
    response: `**Pixie Mischief at the Crossroads**

*Enemies:*
- 4 Pixies (CR 1/4 each, using SRD Sprite stats with flight)

*Terrain:*
- A 30-ft radius clearing with an ancient oak tree in the center
- Thick brambles border the clearing (difficult terrain, 1d4 damage to move through)
- An old stone shrine covered in moss (provides total cover)

*Tactics:*
- Pixies remain invisible until engaged
- They target the party's shiniest objects with minor illusions to make them appear as snakes
- If befriended (DC 15 Persuasion), they reveal the location of a hidden treasure cache

*Non-Combat Resolution:* Offering sweets or performing for the pixies (DC 12 Performance) ends the encounter peacefully`
  }
];

export function getEncounterResponse(difficulty?: string): EncounterMockResponse {
  if (difficulty) {
    const match = encounterMockResponses.find(r => r.difficulty === difficulty);
    if (match) return match;
  }
  
  const randomIndex = Math.floor(Math.random() * encounterMockResponses.length);
  return encounterMockResponses[randomIndex];
}