import { createSystemPrompt } from './base-prompt';

describe('Base Prompt Template', () => {
  it('should create system prompt for D&D assistant', () => {
    const prompt = createSystemPrompt();
    
    expect(prompt).toContain('D&D');
    expect(prompt).toContain('Dungeon Master');
    expect(prompt).toContain('5e');
    expect(prompt).toContain('SRD');
  });
  
  it('should include role and constraints', () => {
    const prompt = createSystemPrompt();
    
    expect(prompt).toContain('assistant');
    expect(prompt).toContain('Lore-consistent');
    expect(prompt).toContain('Avoid copyrighted');
  });
});