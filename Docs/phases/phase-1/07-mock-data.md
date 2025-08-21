# Phase 1: Mock Data and Demo Mode Implementation Plan

## Overview
This document outlines the implementation of mock responses and demo data to showcase the complete user experience without requiring OpenAI API integration. This allows demonstration of the proof-of-concept with realistic, pre-written content that simulates AI responses.

## Mock Response System Architecture

### Environment Detection
```typescript
// src/lib/ai/mock-mode.ts
export function isInMockMode(): boolean {
  return !process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
}
```

## 1. Panic Button Mock Responses

### 1.1 Generate NPC Mock Responses
```typescript
// src/lib/ai/mocks/npc-responses.ts
export const npcMockResponses = [
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
```

### 1.2 Encounter Mock Responses
```typescript
// src/lib/ai/mocks/encounter-responses.ts
export const encounterMockResponses = [
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
```

### 1.3 Plot Redirect Mock Responses
```typescript
// src/lib/ai/mocks/plot-responses.ts
export const plotMockResponses = [
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
```

### 1.4 Flavor Detail Mock Responses
```typescript
// src/lib/ai/mocks/flavor-responses.ts
export const flavorMockResponses = [
  {
    id: 'flavor-1',
    location: 'tavern',
    response: `The air hangs thick with pipe smoke and spilled ale, creating a hazy amber atmosphere. A bard's lute has a broken string that twangs discordantly with every chorus. In the corner, a one-eyed cat nurses a saucer of cream while eyeing the party with suspicious intelligence. The floorboards creak in a rhythm that almost sounds like morse code, and the bartender's nervous laugh suggests they know something about it. A faded bounty poster on the wall has been defaced - someone drew a mustache on the wanted criminal, but underneath, barely visible, is written "They were innocent" in dried blood.`
  },
  {
    id: 'flavor-2',
    location: 'dungeon',
    response: `Water drips in a steady rhythm from unseen heights, each drop echoing like a countdown timer. The walls are covered in scratch marks at shoulder height - hundreds of tallies grouped in sets of five, stopping abruptly at 1,827. A faint smell of cinnamon mingles inexplicably with the dungeon's mustiness. Your torchlight catches something glinting in a wall crack: a child's toy soldier, carved from jade, standing eternal watch. The iron bars show signs of repeated heating and cooling, as if something very hot had gripped them repeatedly.`
  }
];
```

### 1.5 Foreshadowing Mock Responses
```typescript
// src/lib/ai/mocks/foreshadow-responses.ts
export const foreshadowMockResponses = [
  {
    id: 'foreshadow-1',
    response: `As the party conducts their business, a street urchin bumps into them, apologizing profusely. Later, they realize the child didn't steal anything - instead, they *left* something: a small paper with a symbol of an eye crying blood and tomorrow's date. Throughout the day, they notice at least three other people receive similar papers from different children, all of whom vanish into crowds immediately after.`
  },
  {
    id: 'foreshadow-2',
    response: `The birds have gone silent. Not just quiet - completely absent. No pigeons on rooftops, no sparrows in the market, no ravens at the gallows. A local drunk mutters about "the last time this happened" but passes out before finishing. You notice several cats sitting perfectly still on windowsills, all facing the same direction - toward the abandoned bell tower on the hill.`
  }
];
```

## 2. Campaign Document Examples

### 2.1 Example Lore Document
```markdown
// src/lib/ai/mocks/example-campaign-doc.md
# The Chronicles of Shadowmere
## Campaign Setting Guide

### The Kingdom of Shadowmere
Once a prosperous realm, Shadowmere has fallen under a mysterious curse that causes shadows to move independently of their owners after sunset. The kingdom spans three major regions:

#### The Thornwood Valley
- **Capital:** Ravenshire (Population: 25,000)
- **Notable Features:** The Whispering Woods, where trees literally whisper secrets they've overheard
- **Current Conflict:** Baron Aldric claims the southern woods, but the Druid Circle disputes his authority
- **Key NPC:** Master Sage Elara, keeper of the Royal Library, who hasn't slept in 10 years

#### The Ashfall Mountains
- **Major Settlement:** Ironhold (Population: 8,000)
- **Notable Features:** The Everburning Forge, a dwarven smithy that has burned for 500 years
- **Current Conflict:** Mine workers report finding perfectly preserved bodies in newly opened shafts
- **Key NPC:** Thane Grimnar Stonebeard, who speaks only in questions

#### The Mistmoor Wetlands
- **Major Settlement:** Stillwater (Population: 3,000)
- **Notable Features:** The Mirror Lakes, which show reflections of other planes
- **Current Conflict:** Fish have started swimming backwards and speaking prophesies
- **Key NPC:** The Bog Witch Morvanna, who trades memories for favors

### The Shadow Curse
Every night at the 13th bell, shadows detach from their owners and roam freely. These shadows:
- Cannot directly harm anyone but can manipulate objects
- Seem to be searching for something specific
- Whisper in a language that causes listeners to forget their own names temporarily
- Are repelled by silver mirrors and running water

### Major Factions

#### The Order of the Silver Sun
- **Goal:** Lift the shadow curse through divine intervention
- **Methods:** Prayer, consecration rituals, and burning of "tainted" texts
- **Leader:** High Inquisitor Matthias Bright, who claims his shadow never left him
- **Secret:** They caused the curse while attempting to banish a demon

#### The Umbral Covenant
- **Goal:** Embrace and control the shadow curse for power
- **Methods:** Shadow binding rituals, creating shadow servants
- **Leader:** The Shadowspeaker, identity unknown, speaks only through shadows
- **Secret:** They're trying to open a permanent gateway to the Shadowfell

#### The Merchant's Alliance
- **Goal:** Profit from the chaos while maintaining trade routes
- **Methods:** Hired mercenaries, bribery, information brokering
- **Leader:** Guildmaster Rosanna Fletcher, who owns 30% of all businesses
- **Secret:** They're smuggling shadow-touched artifacts to foreign kingdoms

### Campaign Secrets
1. The curse was actually cast by the dying breath of the last dragon
2. The Royal Family has been replaced by doppelgangers who maintain the curse
3. Breaking the curse requires a willing sacrifice at each of the Three Sacred Stones
4. The shadows are fragments of an imprisoned god trying to reunite
5. Children born after the curse began can control their shadows at will
```

### 2.2 Mock Campaign Digest Response
```typescript
// src/lib/ai/mocks/digest-response.ts
export const mockDigestSummary = {
  id: 'digest-1',
  uploadedFile: 'The-Chronicles-of-Shadowmere.md',
  summary: `**Campaign Digest Created Successfully**

*Document Analysis Complete:*
- **Setting:** The Kingdom of Shadowmere (Dark Fantasy)
- **Core Conflict:** A curse causing shadows to act independently
- **Tone:** Gothic horror with political intrigue
- **Power Level:** Mid-tier (levels 5-10 recommended)

*Key Elements Indexed:*
- 3 Major Regions identified and mapped
- 9 Important NPCs catalogued with motivations
- 3 Major Factions with conflicting goals
- 5 Campaign Secrets flagged for DM reference
- 15 potential plot hooks extracted

*Unique Mechanics Detected:*
- Shadow separation occurs nightly at 13th bell
- Shadows can manipulate objects but not harm directly
- Silver mirrors and running water provide protection
- Children born post-curse have shadow control abilities

*Token Usage:* 4,326 tokens indexed (well within 8k active context limit)

*Ready for Session:* Your campaign digest is ready. You can now:
- Flag specific scenes for tonight's session
- Generate content consistent with Shadowmere's lore
- Access quick references during gameplay

*Suggested First Session:* "The Night of No Shadows" - A mysterious event causes all shadows to vanish for one night, creating panic and revealing hidden truths.`,
  statistics: {
    totalTokens: 4326,
    npcsFound: 9,
    locationsFound: 6,
    factionsFound: 3,
    plotHooksFound: 15
  }
};
```

## 3. Session Flow Mock Data

### 3.1 Active Context Selection
```typescript
// src/lib/ai/mocks/active-context.ts
export const mockActiveContextOptions = [
  {
    id: 'ctx-1',
    scene: 'The Thornwood Valley - Ravenshire Market',
    relevantLore: ['Baron Aldric conflict', 'Master Sage Elara', 'Whispering Woods'],
    tokens: 1250
  },
  {
    id: 'ctx-2',
    scene: 'The Ashfall Mountains - Ironhold Mines',
    relevantLore: ['Preserved bodies mystery', 'Thane Grimnar', 'Everburning Forge'],
    tokens: 980
  },
  {
    id: 'ctx-3',
    scene: 'Investigating the Shadow Curse',
    relevantLore: ['13th bell phenomenon', 'Silver mirror protection', 'Shadow behavior'],
    tokens: 1500
  },
  {
    id: 'ctx-4',
    scene: 'Faction Negotiations',
    relevantLore: ['Order of Silver Sun', 'Umbral Covenant', 'Merchant Alliance goals'],
    tokens: 2100
  }
];
```

### 3.2 Session Notes Mock Output
```typescript
// src/lib/ai/mocks/session-notes.ts
export const mockSessionNotes = {
  sessionId: 'session-001',
  date: '2024-01-15',
  duration: '3h 45m',
  title: 'The Shadow Market Incident',
  generatedContent: [
    {
      timestamp: '00:15:00',
      type: 'npc',
      content: 'Generated: Gareth "Copper-Count" Blackwood',
      used: true,
      playerNotes: 'Party hired him as accountant'
    },
    {
      timestamp: '00:45:00',
      type: 'encounter',
      content: 'Generated: Warehouse Ambush',
      used: true,
      playerNotes: 'Captured bandit captain for interrogation'
    },
    {
      timestamp: '01:30:00',
      type: 'flavor',
      content: 'Generated: Tavern atmosphere description',
      used: true,
      playerNotes: 'Players investigated the morse code floorboards'
    },
    {
      timestamp: '02:00:00',
      type: 'plot',
      content: 'Generated: The Rival\'s Gambit',
      used: false,
      playerNotes: 'Saved for next session'
    },
    {
      timestamp: '02:45:00',
      type: 'foreshadow',
      content: 'Generated: Silent birds omen',
      used: true,
      playerNotes: 'Players very concerned, investigating next session'
    }
  ],
  customNotes: `Party discovered connection between Baron Aldric and the Merchant Alliance.
Rogue pickpocketed important letter from Guildmaster.
Wizard theorizes shadows are time-displaced.
Cleric had vision of silver sun turning black.`,
  nextSessionPrep: `Follow up on bird disappearance.
Prepare for party confronting Baron Aldric.
Flesh out the abandoned bell tower location.`
};
```

## 4. Implementation Strategy

### 4.1 Mock Service Layer
```typescript
// src/lib/ai/mock-service.ts
import { isInMockMode } from './mock-mode';
import { npcMockResponses } from './mocks/npc-responses';
import { encounterMockResponses } from './mocks/encounter-responses';
// ... import other mock responses

export async function generateMockResponse(type: string, context?: any): Promise<string> {
  // Simulate API delay for realism
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
  
  switch(type) {
    case 'npc':
      return selectRandomResponse(npcMockResponses, context);
    case 'encounter':
      return selectRandomResponse(encounterMockResponses, context);
    case 'plot':
      return selectRandomResponse(plotMockResponses, context);
    case 'flavor':
      return selectRandomResponse(flavorMockResponses, context);
    case 'foreshadow':
      return selectRandomResponse(foreshadowMockResponses, context);
    default:
      return 'Mock response for: ' + type;
  }
}

function selectRandomResponse(responses: any[], context?: any): string {
  // Use context to select appropriate response or random if no match
  const contextMatch = responses.find(r => 
    context && Object.keys(context).some(key => r[key] === context[key])
  );
  
  if (contextMatch) return contextMatch.response;
  
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex].response;
}
```

### 4.2 Modified API Route
```typescript
// src/app/api/generate/route.ts
import { isInMockMode } from '@/lib/ai/mock-mode';
import { generateMockResponse } from '@/lib/ai/mock-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if we're in mock mode
    if (isInMockMode()) {
      const content = await generateMockResponse(body.type, body.context);
      return NextResponse.json({
        content,
        usage: {
          prompt_tokens: 100,
          completion_tokens: 150,
          total_tokens: 250
        },
        mock: true // Indicate this is mock data
      });
    }
    
    // ... existing OpenAI implementation
  }
}
```

### 4.3 UI Indicators for Demo Mode
```typescript
// src/components/ui/demo-indicator.tsx
export function DemoIndicator() {
  if (!isInMockMode()) return null;
  
  return (
    <div className="fixed top-4 right-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow-md">
      <span className="font-semibold">Demo Mode</span>
      <span className="text-sm ml-2">Using mock AI responses</span>
    </div>
  );
}
```

## 5. Demo Script Flow

### Step 1: Landing Page
- Show panic button prominent placement
- Highlight "Try Demo" option (no auth required)

### Step 2: Upload Campaign Document
- Provide download link for example campaign document
- User uploads "The Chronicles of Shadowmere"
- Show mock processing animation (3 seconds)
- Display mock digest summary

### Step 3: Session Preparation
- Show active context selection interface
- User selects "Ravenshire Market" scene
- Display token budget (1,250 / 8,000 used)

### Step 4: Live Session Demo
- User clicks panic button
- Radial menu appears with 5 options
- User selects "Generate NPC"
- Mock response appears: Gareth "Copper-Count" Blackwood
- Show "Add to Session Notes" option

### Step 5: Try Each Panic Type
- Demonstrate each panic button option
- Show variety in mock responses
- Highlight speed of responses

### Step 6: Session Summary
- Display session notes with all generated content
- Show export options (Markdown, PDF)
- Highlight continuity features

## 6. Testing Checklist

### Mock Response Tests
- [ ] Each panic type returns appropriate mock response
- [ ] Mock responses rotate to show variety
- [ ] Context influences response selection
- [ ] Response time simulates realistic API delay

### Document Upload Tests
- [ ] Example document downloads correctly
- [ ] Upload shows processing animation
- [ ] Digest summary displays properly
- [ ] Token counting appears accurate

### Session Flow Tests
- [ ] Active context selection works
- [ ] Token budget updates correctly
- [ ] Generated content saves to session notes
- [ ] Export functions work with mock data

### Demo Mode Indicators
- [ ] Demo mode banner appears when active
- [ ] No API calls made in mock mode
- [ ] All features accessible without authentication
- [ ] Clear indication that responses are simulated

## 7. Future Enhancements

### Phase 2 Integration Points
- Replace mock responses with actual OpenAI calls
- Implement real document processing with embeddings
- Add user authentication for persistent data
- Enable real-time session collaboration

### Additional Mock Scenarios
- Combat resolution assistance
- Rule clarifications (5e SRD)
- Treasure generation
- Trap and puzzle creation
- Voice and mannerism suggestions

## Success Metrics for Demo

### User Experience Goals
- Complete demo flow in under 5 minutes
- All panic responses load in under 1 second
- Clear understanding of product value proposition
- Intuitive interface requiring no instruction

### Technical Goals
- Zero API costs during demo
- No authentication required
- Works on mobile and desktop
- Accessible offline after initial load

## Implementation Priority

1. **Immediate (Phase 1.7)**
   - Mock response system
   - Demo mode detection
   - Basic mock responses for all 5 panic types

2. **Next (Phase 1.8)**
   - Example campaign document
   - Upload flow with mock processing
   - Session notes generation

3. **Nice-to-Have (Phase 2)**
   - Multiple mock responses per type
   - Context-aware response selection
   - Animated transitions
   - Sound effects for button clicks