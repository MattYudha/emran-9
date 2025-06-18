import { MaterialRecommendation } from '../types/chatbot';

export interface PrintingMaterial {
  id: string;
  name: string;
  description: string;
  categories: string[];
  finishingOptions: string[];
  durability: number;
  costFactor: number;
  applications: string[];
}

export interface FinishingOption {
  id: string;
  name: string;
  description: string;
  applicableMaterials: string[];
  costMultiplier: number;
  durabilityBonus: number;
}

export const PRINTING_MATERIALS: PrintingMaterial[] = [
  {
    id: 'art-paper-120',
    name: 'Art Paper 120gsm',
    description: 'High-quality coated paper with smooth finish',
    categories: ['business-cards', 'brochures', 'flyers'],
    finishingOptions: ['lamination', 'spot-uv', 'embossing'],
    durability: 7,
    costFactor: 1.0,
    applications: ['Business cards', 'Brochures', 'Flyers', 'Catalogs']
  },
  {
    id: 'art-paper-150',
    name: 'Art Paper 150gsm',
    description: 'Premium coated paper for professional materials',
    categories: ['business-cards', 'brochures', 'postcards'],
    finishingOptions: ['lamination', 'spot-uv', 'embossing', 'foiling'],
    durability: 8,
    costFactor: 1.2,
    applications: ['Premium business cards', 'Corporate brochures', 'Postcards']
  },
  {
    id: 'vinyl-banner',
    name: 'Vinyl Banner Material',
    description: 'Weather-resistant vinyl for outdoor applications',
    categories: ['banners', 'outdoor-signage'],
    finishingOptions: ['grommets', 'hemming', 'welding'],
    durability: 9,
    costFactor: 1.5,
    applications: ['Outdoor banners', 'Event signage', 'Building wraps']
  },
  {
    id: 'corrugated-plastic',
    name: 'Corrugated Plastic',
    description: 'Lightweight, durable plastic sheeting',
    categories: ['yard-signs', 'temporary-signage'],
    finishingOptions: ['stakes', 'mounting-holes'],
    durability: 8,
    costFactor: 1.3,
    applications: ['Yard signs', 'Real estate signs', 'Event signage']
  },
  {
    id: 'fabric-textile',
    name: 'Fabric Textile',
    description: 'Premium fabric for elegant displays',
    categories: ['banners', 'backdrops', 'trade-show'],
    finishingOptions: ['hemming', 'pole-pockets', 'grommets'],
    durability: 7,
    costFactor: 2.0,
    applications: ['Trade show displays', 'Backdrops', 'Indoor banners']
  },
  {
    id: 'adhesive-vinyl',
    name: 'Adhesive Vinyl',
    description: 'Self-adhesive vinyl for stickers and labels',
    categories: ['stickers', 'labels', 'decals'],
    finishingOptions: ['die-cutting', 'kiss-cutting', 'lamination'],
    durability: 6,
    costFactor: 1.1,
    applications: ['Product labels', 'Stickers', 'Window decals']
  }
];

export const FINISHING_OPTIONS: FinishingOption[] = [
  {
    id: 'lamination-gloss',
    name: 'Gloss Lamination',
    description: 'Protective glossy coating that enhances colors',
    applicableMaterials: ['art-paper-120', 'art-paper-150'],
    costMultiplier: 1.3,
    durabilityBonus: 2
  },
  {
    id: 'lamination-matte',
    name: 'Matte Lamination',
    description: 'Protective matte coating for elegant finish',
    applicableMaterials: ['art-paper-120', 'art-paper-150'],
    costMultiplier: 1.3,
    durabilityBonus: 2
  },
  {
    id: 'spot-uv',
    name: 'Spot UV Coating',
    description: 'Selective UV coating for highlighting specific areas',
    applicableMaterials: ['art-paper-120', 'art-paper-150'],
    costMultiplier: 1.8,
    durabilityBonus: 1
  },
  {
    id: 'embossing',
    name: 'Embossing',
    description: 'Raised texture effect for premium feel',
    applicableMaterials: ['art-paper-120', 'art-paper-150'],
    costMultiplier: 2.2,
    durabilityBonus: 0
  },
  {
    id: 'foiling',
    name: 'Foil Stamping',
    description: 'Metallic foil application for luxury appearance',
    applicableMaterials: ['art-paper-120', 'art-paper-150'],
    costMultiplier: 2.5,
    durabilityBonus: 1
  },
  {
    id: 'die-cutting',
    name: 'Die Cutting',
    description: 'Custom shape cutting for unique designs',
    applicableMaterials: ['art-paper-120', 'art-paper-150', 'adhesive-vinyl'],
    costMultiplier: 1.6,
    durabilityBonus: 0
  }
];

export function getRecommendationsForCategory(category: string): MaterialRecommendation[] {
  const relevantMaterials = PRINTING_MATERIALS.filter(material => 
    material.categories.includes(category)
  );

  return relevantMaterials.map(material => ({
    material: material.name,
    description: material.description,
    suitability: material.durability / 10,
    finishingOptions: material.finishingOptions
  }));
}

export function estimateCost(
  material: string, 
  quantity: number, 
  finishingOptions: string[] = []
): { minPrice: number; maxPrice: number; currency: string; factors: string[] } {
  const baseMaterial = PRINTING_MATERIALS.find(m => m.name === material);
  if (!baseMaterial) {
    return {
      minPrice: 0,
      maxPrice: 0,
      currency: 'IDR',
      factors: ['Material not found']
    };
  }

  let baseCost = 1000; // Base cost in IDR per unit
  let costMultiplier = baseMaterial.costFactor;
  const factors = [`Base material: ${material}`];

  // Apply finishing cost multipliers
  finishingOptions.forEach(option => {
    const finishing = FINISHING_OPTIONS.find(f => f.name === option);
    if (finishing) {
      costMultiplier *= finishing.costMultiplier;
      factors.push(`Finishing: ${option}`);
    }
  });

  // Quantity discounts
  if (quantity >= 1000) {
    costMultiplier *= 0.8;
    factors.push('Volume discount (1000+)');
  } else if (quantity >= 500) {
    costMultiplier *= 0.9;
    factors.push('Volume discount (500+)');
  }

  const unitCost = baseCost * costMultiplier;
  const totalMin = unitCost * quantity;
  const totalMax = totalMin * 1.3; // 30% variance for complexity

  return {
    minPrice: Math.round(totalMin),
    maxPrice: Math.round(totalMax),
    currency: 'IDR',
    factors
  };
}
