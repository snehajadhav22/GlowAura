// Shade recommendation based on detected skin tone & undertone

const SHADE_DATABASE = {
  Lipstick: {
    Warm: {
      Fair:   ['#D4736E', '#C96B6B', '#E8967A', '#CF8B7B', '#CC7766'],
      Light:  ['#C4524B', '#D4736E', '#B85C5C', '#D28B7A', '#C97B6B'],
      Medium: ['#A0413D', '#B5524B', '#8B3A3A', '#C96655', '#B86655'],
      Tan:    ['#8B2E2E', '#9A3A3A', '#7A2E2E', '#A84040', '#993535'],
      Deep:   ['#6B1E1E', '#7A2525', '#5A1A1A', '#882C2C', '#772222'],
    },
    Cool: {
      Fair:   ['#D4617A', '#CC5577', '#E87A99', '#CF6B88', '#C46080'],
      Light:  ['#B84466', '#CC5577', '#A83D5C', '#C96688', '#B85577'],
      Medium: ['#992D4D', '#A83D5C', '#882244', '#B84466', '#A34055'],
      Tan:    ['#801F3D', '#8B2244', '#701A33', '#992D4D', '#881F3D'],
      Deep:   ['#601530', '#701A33', '#551228', '#801F3D', '#6B1530'],
    },
    Neutral: {
      Fair:   ['#CC6666', '#D47A7A', '#C47070', '#D88888', '#C07575'],
      Light:  ['#B85555', '#C46666', '#AA4D4D', '#CC7070', '#B56060'],
      Medium: ['#994444', '#AA5050', '#883B3B', '#B85555', '#A34848'],
      Tan:    ['#803333', '#8B3B3B', '#702C2C', '#993D3D', '#883535'],
      Deep:   ['#662525', '#702C2C', '#551F1F', '#803333', '#6B2828'],
    },
  },
  Foundation: {
    Warm: {
      Fair:   ['#F5DEB3', '#F0D8A8', '#FAEBD7', '#F5E0C0', '#EEDBB0'],
      Light:  ['#E8C8A0', '#DDB892', '#E5C49A', '#D4A873', '#E0BD90'],
      Medium: ['#C8A070', '#BA8C5C', '#C49A68', '#B08050', '#C09568'],
      Tan:    ['#A88050', '#9A7040', '#A47A4C', '#906838', '#9E7548'],
      Deep:   ['#8B6538', '#7A5528', '#886035', '#6E4820', '#836030'],
    },
    Cool: {
      Fair:   ['#F0D6CC', '#EBD0C4', '#F5DDD5', '#E8CCBE', '#F0D3C8'],
      Light:  ['#DDB8AA', '#D4AA9A', '#DAB5A5', '#CC9E8C', '#D6B0A0'],
      Medium: ['#C09888', '#B48A78', '#BC9482', '#A87C6C', '#B89080'],
      Tan:    ['#A07868', '#947060', '#9C7564', '#886455', '#987060'],
      Deep:   ['#886050', '#7C5548', '#845C4C', '#704838', '#805848'],
    },
    Neutral: {
      Fair:   ['#F2DACA', '#EDD5C0', '#F5DDD0', '#E8CEB8', '#F0D5C5'],
      Light:  ['#DDC0A8', '#D4B498', '#DABcA2', '#CCA88A', '#D6B8A0'],
      Medium: ['#C09C80', '#B49070', '#BC987C', '#A88464', '#B89478'],
      Tan:    ['#A88060', '#9A7250', '#A47C5C', '#906840', '#9E7858'],
      Deep:   ['#886848', '#7C5C38', '#846440', '#6E5030', '#806040'],
    },
  },
  Blush: {
    Warm: {
      Fair: ['#F5A0A0', '#E8B0A0', '#F0C0B0'], Light: ['#E89090', '#D4A090', '#E0B0A0'],
      Medium: ['#CC7070', '#B88070', '#CC9080'], Tan: ['#B06060', '#9C6858', '#B07868'],
      Deep: ['#904848', '#7C5040', '#905858'],
    },
    Cool: {
      Fair: ['#F0A0C0', '#E8B0CC', '#F0C0D8'], Light: ['#D890B0', '#CC9CC0', '#D8B0CC'],
      Medium: ['#C07898', '#B488A8', '#C098B0'], Tan: ['#A86080', '#986890', '#A87898'],
      Deep: ['#884860', '#785070', '#886078'],
    },
    Neutral: {
      Fair: ['#F0A8B0', '#E8B8B8', '#F0C0C0'], Light: ['#D89898', '#CC9C9C', '#D8ACAC'],
      Medium: ['#C08080', '#B08888', '#C09090'], Tan: ['#A06868', '#907070', '#A07878'],
      Deep: ['#885050', '#785858', '#886060'],
    },
  },
};

export class ShadeRecommender {
  constructor() {
    this.cache = new Map();
  }

  recommend(productType, skinTone) {
    if (!skinTone) return [];

    const key = `${productType}_${skinTone.tone}_${skinTone.undertone}`;
    if (this.cache.has(key)) return this.cache.get(key);

    const typeDB = SHADE_DATABASE[productType];
    if (!typeDB) {
      // For product types not in DB, fallback to color matching
      return this._fallbackRecommend(productType, skinTone);
    }

    const undertoneDB = typeDB[skinTone.undertone] || typeDB['Neutral'];
    const shades = undertoneDB[skinTone.tone] || undertoneDB['Medium'];

    const result = shades.slice(0, 3).map((hex, i) => ({
      hex,
      name: this._shadeName(productType, skinTone.undertone, i),
      confidence: 95 - i * 8,
      recommended: i === 0,
    }));

    this.cache.set(key, result);
    return result;
  }

  _fallbackRecommend(productType, skinTone) {
    const { r, g, b, undertone } = skinTone;
    const base = { Eyeshadow: 0.6, Eyeliner: 0.2, Mascara: 0.15, Highlighter: 1.4, Contour: 0.7 };
    const mult = base[productType] || 0.8;

    return [0, 20, -20].map((offset, i) => {
      const nr = Math.max(0, Math.min(255, Math.round(r * mult + offset)));
      const ng = Math.max(0, Math.min(255, Math.round(g * mult + offset)));
      const nb = Math.max(0, Math.min(255, Math.round(b * mult + offset)));
      const hex = `#${nr.toString(16).padStart(2,'0')}${ng.toString(16).padStart(2,'0')}${nb.toString(16).padStart(2,'0')}`;
      return { hex, name: `${productType} ${i + 1}`, confidence: 90 - i * 10, recommended: i === 0 };
    });
  }

  _shadeName(type, undertone, index) {
    const names = {
      Lipstick:   { Warm: ['Terracotta Rose','Sunset Nude','Burnt Sienna'], Cool: ['Berry Kiss','Plum Velvet','Mauve Dream'], Neutral: ['Classic Red','Dusty Rose','Rosewood'] },
      Foundation: { Warm: ['Golden Beige','Sand','Honey'], Cool: ['Porcelain','Rose Beige','Cool Sand'], Neutral: ['Natural','Buff','Caramel'] },
      Blush:      { Warm: ['Peach Glow','Coral Sun','Warm Apricot'], Cool: ['Pink Frost','Berry Bloom','Lilac Mist'], Neutral: ['Soft Rose','Blush Pink','Dusty Mauve'] },
    };
    return names[type]?.[undertone]?.[index] || `${type} Shade ${index + 1}`;
  }
}