export type PanicType = 'npc' | 'encounter' | 'plot' | 'flavor' | 'foreshadow';

export interface PanicContext {
  location?: string;
  context?: string;
  partyLevel?: number;
  partySize?: number;
  difficulty?: string;
  theme?: string;
}

export function generatePanicPrompt(type: PanicType, context: PanicContext): string {
  const prompts: Record<PanicType, (ctx: PanicContext) => string> = {
    npc: (ctx) => `Generate an NPC for ${ctx.location || 'the current location'}.
Context: ${ctx.context || 'The party encounters someone interesting.'}
Include: Name, appearance, personality quirk, motivation, and potential quest hook.`,

    encounter: (
      ctx
    ) => `Create an encounter for ${ctx.partySize || 4} level ${ctx.partyLevel || 5} players.
Difficulty: ${ctx.difficulty || 'medium'}
Include: Enemy types (SRD only), terrain features, and tactical considerations.`,

    plot: (ctx) => `Suggest a plot redirection based on current events.
Theme: ${ctx.theme || 'adventure'}
Provide a twist or complication that moves the story forward.`,

    flavor: (ctx) => `Describe ${ctx.location || 'the current scene'} with vivid sensory details.
Focus on atmosphere, sounds, smells, and small details that bring the scene to life.`,

    foreshadow: (ctx) => `Create a subtle foreshadowing element.
Theme: ${ctx.theme || 'mystery'}
Provide a hint or omen about future events without being too obvious.`,
  };

  return prompts[type](context);
}
