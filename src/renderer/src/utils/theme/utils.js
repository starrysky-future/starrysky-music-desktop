const { RGB_Linear_Shade, RGB_Alpha_Shade } = require('./colorUtils');

exports.createThemeColors = (rgbaColor, fontRgbaColor, isDark) => {
  const colors = {
    '--color-primary': rgbaColor
  };

  let preColor = rgbaColor;
  for (let i = 1; i < 11; i += 1) {
    preColor = RGB_Linear_Shade(isDark ? 0.2 : -0.1, preColor);
    colors[`--color-primary-dark-${i * 100}`] = preColor;
    for (let j = 1; j < 10; j += 1) {
      colors[`--color-primary-dark-${i * 100}-alpha-${j * 100}`] = RGB_Alpha_Shade(
        0.1 * j,
        preColor
      );
      colors[`--color-primary-alpha-${j * 100}`] = RGB_Alpha_Shade(0.1 * j, rgbaColor);
    }
  }
  preColor = rgbaColor;
  for (let i = 1; i < 10; i += 1) {
    preColor = RGB_Linear_Shade(isDark ? -0.1 : 0.2, preColor);
    colors[`--color-primary-light-${i * 100}`] = preColor;
    for (let j = 1; j < 10; j += 1) {
      colors[`--color-primary-light-${i * 100}-alpha-${j * 100}`] = RGB_Alpha_Shade(
        0.1 * j,
        preColor
      );
    }
  }
  preColor = RGB_Linear_Shade(isDark ? -0.35 : 1, preColor);
  colors[`--color-primary-light-${1000}`] = preColor;
  for (let j = 1; j < 10; j += 1) {
    colors[`--color-primary-light-${1000}-alpha-${j * 100}`] = RGB_Alpha_Shade(0.1 * j, preColor);
  }

  colors['--color-theme'] = isDark ? colors['--color-primary-light-900'] : rgbaColor;

  return { ...colors, ...createFontColors(fontRgbaColor, isDark) };
};

const createFontColors = (rgbaColor, isDark) => {
  rgbaColor ??= isDark ? 'rgb(229, 229, 229)' : 'rgb(33, 33, 33)';
  if (isDark) return createFontDarkColors(rgbaColor);

  const colors = {
    '--color-1000': rgbaColor
  };
  const step = isDark ? -0.05 : 0.05;
  for (let i = 1; i < 21; i += 1) {
    colors[`--color-${String(1000 - 50 * i).padStart(3, '0')}`] = RGB_Linear_Shade(
      step * i,
      rgbaColor
    );
  }

  return colors;
};

const createFontDarkColors = (rgbaColor) => {
  const colors = {
    '--color-1000': rgbaColor
  };
  const step = -0.05;
  let preColor = rgbaColor;
  for (let i = 1; i < 21; i += 1) {
    preColor = RGB_Linear_Shade(step, preColor);
    colors[`--color-${String(1000 - 50 * i).padStart(3, '0')}`] = preColor;
  }

  return colors;
};
