import { getNPCResponse } from './mocks/npc-responses';
import { getEncounterResponse } from './mocks/encounter-responses';
import { getPlotResponse } from './mocks/plot-responses';
import { getFlavorResponse } from './mocks/flavor-responses';
import { getForeshadowResponse } from './mocks/foreshadow-responses';

export async function generateMockResponse(type: string, context?: any): Promise<string> {
  // Simulate API delay for realism (800ms + random up to 400ms)
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
  
  switch(type) {
    case 'npc':
      const npcResponse = getNPCResponse(context?.context);
      return npcResponse.response;
    
    case 'encounter':
      const encounterResponse = getEncounterResponse(context?.difficulty);
      return encounterResponse.response;
    
    case 'plot':
      const plotResponse = getPlotResponse();
      return plotResponse.response;
    
    case 'flavor':
      const flavorResponse = getFlavorResponse(context?.location);
      return flavorResponse.response;
    
    case 'foreshadow':
      const foreshadowResponse = getForeshadowResponse();
      return foreshadowResponse.response;
    
    default:
      return `Mock response for: ${type}`;
  }
}