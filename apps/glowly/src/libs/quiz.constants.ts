export const QUESTIONS = [
  {
    id: 'q1',
    step: 1,
    category: 'Morning Feel',
    emoji: '🌅',
    question: 'How does your skin feel when you wake up in the morning?',
    options: [
      { letter: 'a', text: 'Tight and sometimes flaky', skinValue: 'dry' },
      {
        letter: 'b',
        text: 'Perfectly comfortable, no issues',
        skinValue: 'normal',
      },
      {
        letter: 'c',
        text: 'Shiny all over — forehead, nose, cheeks',
        skinValue: 'oily',
      },
      {
        letter: 'd',
        text: 'Shiny in the T-zone but dry on cheeks',
        skinValue: 'combination',
      },
      {
        letter: 'e',
        text: 'Irritated, red or uncomfortable',
        skinValue: 'sensitive',
      },
    ],
  },
  {
    id: 'q2',
    step: 2,
    category: 'Pore Appearance',
    emoji: '🔍',
    question: 'How visible are your pores?',
    options: [
      {
        letter: 'a',
        text: 'Barely noticeable — skin looks smooth',
        skinValue: 'dry',
      },
      {
        letter: 'b',
        text: 'Small but visible in some areas',
        skinValue: 'normal',
      },
      {
        letter: 'c',
        text: 'Large and noticeable across most of my face',
        skinValue: 'oily',
      },
      {
        letter: 'd',
        text: 'Enlarged mainly on the nose and forehead',
        skinValue: 'combination',
      },
      {
        letter: 'e',
        text: 'Hard to tell, but my skin often looks irritated',
        skinValue: 'sensitive',
      },
    ],
  },
  {
    id: 'q3',
    step: 3,
    category: 'Midday Check',
    emoji: '☀️',
    question: 'By midday, without washing your face — what happens?',
    options: [
      {
        letter: 'a',
        text: 'Skin feels even tighter and looks dull',
        skinValue: 'dry',
      },
      {
        letter: 'b',
        text: 'Looks fresh, minimal changes',
        skinValue: 'normal',
      },
      {
        letter: 'c',
        text: 'I need to blot — very oily everywhere',
        skinValue: 'oily',
      },
      {
        letter: 'd',
        text: 'Oily T-zone, cheeks still feel fine or dry',
        skinValue: 'combination',
      },
      {
        letter: 'e',
        text: 'Redness or stinging appears, especially in dry areas',
        skinValue: 'sensitive',
      },
    ],
  },
  {
    id: 'q4',
    step: 4,
    category: 'Product Reaction',
    emoji: '🧴',
    question: 'How does your skin react to most skincare products?',
    options: [
      {
        letter: 'a',
        text: 'Absorbs quickly — always craves more moisture',
        skinValue: 'dry',
      },
      {
        letter: 'b',
        text: 'Tolerates most products without issues',
        skinValue: 'normal',
      },
      {
        letter: 'c',
        text: 'Heavy creams break me out easily',
        skinValue: 'oily',
      },
      {
        letter: 'd',
        text: 'Rich creams on the T-zone make it worse',
        skinValue: 'combination',
      },
      {
        letter: 'e',
        text: 'Frequently reacts with redness, stinging or breakouts',
        skinValue: 'sensitive',
      },
    ],
  },
  {
    id: 'q5',
    step: 5,
    category: 'Breakouts',
    emoji: '✨',
    question: 'How often do you experience breakouts or blemishes?',
    options: [
      {
        letter: 'a',
        text: 'Rarely — but I do get rough patches',
        skinValue: 'dry',
      },
      {
        letter: 'b',
        text: 'Occasionally, usually hormonal or stress-related',
        skinValue: 'normal',
      },
      {
        letter: 'c',
        text: 'Frequently — especially blackheads and whiteheads',
        skinValue: 'oily',
      },
      {
        letter: 'd',
        text: 'Mostly on the chin, nose, forehead',
        skinValue: 'combination',
      },
      {
        letter: 'e',
        text: 'When I break out, my skin also gets red and inflamed',
        skinValue: 'sensitive',
      },
    ],
  },
  {
    id: 'q6',
    step: 6,
    category: 'After Cleansing',
    emoji: '💧',
    question: 'Right after washing your face, how does your skin feel?',
    options: [
      {
        letter: 'a',
        text: 'Very tight and uncomfortable without moisturizer',
        skinValue: 'dry',
      },
      {
        letter: 'b',
        text: 'Clean but comfortable, bounces back quickly',
        skinValue: 'normal',
      },
      {
        letter: 'c',
        text: 'Clean, but oiliness returns within an hour',
        skinValue: 'oily',
      },
      {
        letter: 'd',
        text: 'T-zone feels clean but cheeks feel tight',
        skinValue: 'combination',
      },
      {
        letter: 'e',
        text: 'Feels raw, red or tight no matter how gentle the cleanser',
        skinValue: 'sensitive',
      },
    ],
  },
  {
    id: 'q7',
    step: 7,
    category: 'Environment',
    emoji: '🌦️',
    question: 'How does your skin react to weather changes?',
    options: [
      {
        letter: 'a',
        text: 'Gets very dry and flaky in cold or low humidity',
        skinValue: 'dry',
      },
      {
        letter: 'b',
        text: 'Adapts fairly well to most weather',
        skinValue: 'normal',
      },
      {
        letter: 'c',
        text: 'Gets even oilier in heat and humidity',
        skinValue: 'oily',
      },
      {
        letter: 'd',
        text: 'Cheeks dry out in cold, T-zone worsens in heat',
        skinValue: 'combination',
      },
      {
        letter: 'e',
        text: 'Easily triggered by wind, heat, cold, or pollution',
        skinValue: 'sensitive',
      },
    ],
  },
  {
    id: 'q8',
    step: 8,
    category: 'Skin Goals',
    emoji: '🎯',
    question: 'What is your biggest skincare concern right now?',
    options: [
      {
        letter: 'a',
        text: 'Dryness, dullness and rough texture',
        skinValue: 'dry',
      },
      {
        letter: 'b',
        text: 'Maintaining balance and preventing aging',
        skinValue: 'normal',
      },
      {
        letter: 'c',
        text: 'Controlling shine and minimizing pores',
        skinValue: 'oily',
      },
      {
        letter: 'd',
        text: 'Managing oil in some zones while hydrating others',
        skinValue: 'combination',
      },
      {
        letter: 'e',
        text: 'Reducing redness and calming irritation',
        skinValue: 'sensitive',
      },
    ],
  },
] as const;

export type SkinType = 'dry' | 'normal' | 'oily' | 'combination' | 'sensitive';

export interface SkinResult {
  emoji: string;
  tagline: string;
  description: string;
  traits: string[];
  routine: string[];
  recommendations: {
    cleanser: string;
    moisturizer: string;
    spf: string;
    treatment: string;
  };
  ingredients: { embrace: string[]; avoid: string[] };
}

export const SKIN_RESULTS: Record<SkinType, SkinResult> = {
  dry: {
    emoji: '🌵',
    tagline: 'Thirsty & Delicate',
    description:
      'Your skin craves hydration and tends to feel tight, dull, or flaky. The key is layering moisture and protecting your skin barrier.',
    traits: [
      'Feels tight or uncomfortable without moisturizer',
      'Fine lines appear more prominent due to dehydration',
      'Skin can look dull or lackluster',
      'Rough or flaky patches, especially around the nose and cheeks',
    ],
    routine: [
      'AM: Gentle cream cleanser → hydrating toner → hyaluronic acid serum → rich moisturizer → SPF',
      'PM: Oil cleanser → cream cleanser → essence → facial oil → rich night cream',
    ],
    recommendations: {
      cleanser: 'Creamy, hydrating cleanser (no foaming formulas)',
      moisturizer: 'Rich cream or balm with ceramides and hyaluronic acid',
      spf: 'Moisturizing SPF 30–50 with hydrating base',
      treatment:
        'Facial oil (rosehip, squalane) layered under moisturizer at night',
    },
    ingredients: {
      embrace: [
        'Hyaluronic acid',
        'Ceramides',
        'Glycerin',
        'Squalane',
        'Shea butter',
        'Niacinamide',
      ],
      avoid: [
        'Alcohol-based toners',
        'Harsh sulfates (SLS)',
        'Strong retinoids without buffer moisturizer',
      ],
    },
  },
  normal: {
    emoji: '⚖️',
    tagline: 'Balanced & Resilient',
    description:
      'Your skin is naturally balanced — neither too oily nor too dry. Focus on maintaining that balance and protecting it long-term.',
    traits: [
      'Comfortable throughout the day without much maintenance',
      'Fine pores that are barely noticeable',
      'Smooth, even-toned complexion with good elasticity',
      'Rarely reacts to new products or weather changes',
    ],
    routine: [
      'AM: Gentle cleanser → vitamin C serum → lightweight moisturizer → SPF',
      'PM: Cleanser → toner → retinol (2–3x/week) → moisturizer',
    ],
    recommendations: {
      cleanser: 'Gentle gel or foaming cleanser',
      moisturizer: 'Lightweight lotion with antioxidants',
      spf: 'Broad-spectrum SPF 30–50 daily',
      treatment:
        'Antioxidant vitamin C serum in the morning, gentle retinol at night',
    },
    ingredients: {
      embrace: [
        'Vitamin C',
        'Retinol',
        'Peptides',
        'Niacinamide',
        'AHA/BHA (occasional)',
      ],
      avoid: ['Over-washing', 'Skipping SPF', 'Harsh physical scrubs'],
    },
  },
  oily: {
    emoji: '✨',
    tagline: 'Radiant & Productive',
    description:
      'Your skin produces more sebum than average — which keeps it naturally youthful! Balance oil production rather than stripping it.',
    traits: [
      'Shiny appearance, especially in the afternoon',
      'Enlarged pores, often visible across the face',
      'Prone to blackheads, whiteheads, and breakouts',
      'Makeup tends to slide off or oxidize by midday',
    ],
    routine: [
      'AM: Salicylic acid cleanser → niacinamide serum → oil-free moisturizer → mattifying SPF',
      'PM: Double cleanse → BHA toner (2–3x/week) → lightweight moisturizer',
    ],
    recommendations: {
      cleanser: 'Gel or foaming cleanser with salicylic acid',
      moisturizer: 'Oil-free, non-comedogenic gel moisturizer',
      spf: 'Mattifying SPF 30–50, fluid or gel formula',
      treatment: 'Niacinamide serum to control sebum and minimize pores',
    },
    ingredients: {
      embrace: [
        'Salicylic acid (BHA)',
        'Niacinamide',
        'Zinc',
        'Clay (occasional masks)',
        'Retinol',
      ],
      avoid: [
        'Heavy creams and oils',
        'Comedogenic ingredients (coconut oil)',
        'Skipping moisturizer',
      ],
    },
  },
  combination: {
    emoji: '🌗',
    tagline: 'Two Zones, One Glow',
    description:
      'You have two skin personalities: an oily T-zone and normal-to-dry cheeks. Treat each zone appropriately rather than one-size-fits-all.',
    traits: [
      'Oily forehead, nose and chin with dry or normal cheeks',
      'Breakouts concentrated in the T-zone',
      'Uneven texture — smooth in some areas, larger pores in others',
      'Some products feel too rich; others feel too drying',
    ],
    routine: [
      'AM: Gentle cleanser → niacinamide + HA serum → zone-specific moisturizer → SPF',
      'PM: Double cleanse → exfoliate T-zone only (2x/week) → serum → zone-specific moisturizer',
    ],
    recommendations: {
      cleanser: 'Gentle balancing cleanser — not too stripping, not too creamy',
      moisturizer: 'Lightweight gel on T-zone, richer cream on cheeks',
      spf: 'Lightweight SPF 30–50 fluid',
      treatment:
        'Niacinamide (balances oil) + hyaluronic acid (hydrates dry zones)',
    },
    ingredients: {
      embrace: [
        'Niacinamide',
        'Hyaluronic acid',
        'BHA on T-zone only',
        'Ceramides on dry areas',
      ],
      avoid: [
        'Heavy oils all over face',
        'Harsh stripping cleansers',
        'Alcohol toners on dry areas',
      ],
    },
  },
  sensitive: {
    emoji: '🌸',
    tagline: 'Reactive & Needs Gentle Love',
    description:
      'Your skin barrier is more reactive than average. Less is more — a minimal, fragrance-free routine with soothing ingredients is your best friend.',
    traits: [
      'Easily triggered by new products, weather, or stress',
      'Redness, stinging or burning sensations are common',
      'Skin may feel tight and reactive with visible flushing',
      'Prone to rosacea, eczema, or contact dermatitis',
    ],
    routine: [
      'AM: Micellar water or gentle rinse → soothing toner → centella serum → barrier moisturizer → mineral SPF',
      'PM: Cream cleanser → essence → barrier repair moisturizer (keep it simple)',
    ],
    recommendations: {
      cleanser: 'Ultra-gentle, fragrance-free micellar water or cream cleanser',
      moisturizer: 'Barrier-repair cream with ceramides and centella asiatica',
      spf: 'Mineral (zinc oxide) SPF 30–50 — less irritating than chemical filters',
      treatment:
        'Centella asiatica serum or azelaic acid for redness reduction',
    },
    ingredients: {
      embrace: [
        'Centella asiatica (cica)',
        'Ceramides',
        'Azelaic acid',
        'Allantoin',
        'Panthenol',
        'Colloidal oatmeal',
      ],
      avoid: [
        'Fragrances',
        'Essential oils',
        'Alcohol',
        'Strong AHAs/BHAs',
        'Physical scrubs',
      ],
    },
  },
};
