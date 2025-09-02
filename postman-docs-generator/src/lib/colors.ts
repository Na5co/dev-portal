function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function generateColorTheme(hex: string): Record<string, string> {
  const hsl = hexToHsl(hex);
  if (!hsl) {
    return {
      '--accent': '0 0% 9%',
      '--accent-light': '0 0% 96.1%',
      '--accent-foreground': '0 0% 98%',
    };
  }
  return {
    '--accent': `${hsl.h} ${hsl.s}% ${hsl.l}%`,
    '--accent-light': `${hsl.h} ${hsl.s}% 95%`,
    '--accent-foreground': `${hsl.h} ${hsl.s}% ${hsl.l > 50 ? 10 : 90}%`,
  };
}
