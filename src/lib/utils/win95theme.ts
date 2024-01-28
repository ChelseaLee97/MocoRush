import { ComponentType } from 'react';
import { css } from 'styled-components';

export const shadow = '4px 4px 10px 0 rgba(0, 0, 0, 0.35)';
export const insetShadow = 'inset 2px 2px 3px rgba(0,0,0,0.2)';

export type Sizes = 'sm' | 'md' | 'lg';

export type Orientation = 'horizontal' | 'vertical';

export type Direction = 'up' | 'down' | 'left' | 'right';

export type DimensionValue = undefined | number | string;

export type CommonStyledProps = {
  /**
   * "as" polymorphic prop allows to render a different HTML element or React component
   * @see {@link https://styled-components.com/docs/api#as-polymorphic-prop}
   */
  as?: string | ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HTMLDataAttributes = Record<`data-${string}`, any>;

export type Color = string;

export type Theme = {
  name: string;
  anchor: Color;
  anchorVisited: Color;
  borderDark: Color;
  borderDarkest: Color;
  borderLight: Color;
  borderLightest: Color;
  canvas: Color;
  canvasText: Color;
  canvasTextDisabled: Color;
  canvasTextDisabledShadow: Color;
  canvasTextInvert: Color;
  checkmark: Color;
  checkmarkDisabled: Color;
  desktopBackground: Color;
  flatDark: Color;
  flatLight: Color;
  focusSecondary: Color;
  headerBackground: Color;
  headerNotActiveBackground: Color;
  headerNotActiveText: Color;
  headerText: Color;
  hoverBackground: Color;
  material: Color;
  materialDark: Color;
  materialText: Color;
  materialTextDisabled: Color;
  materialTextDisabledShadow: Color;
  materialTextInvert: Color;
  progress: Color;
  tooltip: Color;
};

export type WindowsTheme = {
  ActiveBorder: Color;
  ActiveTitle: Color;
  AppWorkspace: Color;
  Background: Color;
  ButtonAlternateFace: Color;
  ButtonDkShadow: Color;
  ButtonFace: Color;
  ButtonHilight: Color;
  ButtonLight: Color;
  ButtonShadow: Color;
  ButtonText: Color;
  GradientActiveTitle: Color;
  GradientInactiveTitle: Color;
  GrayText: Color;
  Hilight: Color;
  HilightText: Color;
  HotTrackingColor: Color;
  InactiveBorder: Color;
  InactiveTitle: Color;
  InactiveTitleText: Color;
  InfoText: Color;
  InfoWindow: Color;
  Menu: Color;
  MenuBar: Color;
  MenuHilight: Color;
  MenuText: Color;
  Scrollbar: Color;
  TitleText: Color;
  Window: Color;
  WindowFrame: Color;
  WindowText: Color;
};
export type CommonThemeProps = {
  'data-testid'?: string;
  $disabled?: boolean;
  shadow?: boolean;
};
type BorderStyle = {
  topLeftOuter: keyof Theme;
  topLeftInner: keyof Theme | null;
  bottomRightInner: keyof Theme | null;
  bottomRightOuter: keyof Theme;
};

export type BorderStyles =
  | 'button'
  | 'buttonPressed'
  | 'buttonThin'
  | 'buttonThinPressed'
  | 'field'
  | 'grouping'
  | 'status'
  | 'window';

const borderStyles: Record<BorderStyles, BorderStyle> = {
  button: {
    topLeftOuter: 'borderLightest',
    topLeftInner: 'borderLight',
    bottomRightInner: 'borderDark',
    bottomRightOuter: 'borderDarkest',
  },
  buttonPressed: {
    topLeftOuter: 'borderDarkest',
    topLeftInner: 'borderDark',
    bottomRightInner: 'borderLight',
    bottomRightOuter: 'borderLightest',
  },
  buttonThin: {
    topLeftOuter: 'borderLightest',
    topLeftInner: null,
    bottomRightInner: null,
    bottomRightOuter: 'borderDark',
  },
  buttonThinPressed: {
    topLeftOuter: 'borderDark',
    topLeftInner: null,
    bottomRightInner: null,
    bottomRightOuter: 'borderLightest',
  },
  field: {
    topLeftOuter: 'borderDark',
    topLeftInner: 'borderDarkest',
    bottomRightInner: 'borderLight',
    bottomRightOuter: 'borderLightest',
  },
  grouping: {
    topLeftOuter: 'borderDark',
    topLeftInner: 'borderLightest',
    bottomRightInner: 'borderDark',
    bottomRightOuter: 'borderLightest',
  },
  status: {
    topLeftOuter: 'borderDark',
    topLeftInner: null,
    bottomRightInner: null,
    bottomRightOuter: 'borderLightest',
  },
  window: {
    topLeftOuter: 'borderLight',
    topLeftInner: 'borderLightest',
    bottomRightInner: 'borderDark',
    bottomRightOuter: 'borderDarkest',
  },
};

export const createInnerBorderWithShadow = ({
  theme,
  topLeftInner,
  bottomRightInner,
  hasShadow = false,
  hasInsetShadow = false,
}: {
  theme: Theme;
  topLeftInner: keyof Theme | null;
  bottomRightInner: keyof Theme | null;
  hasShadow?: boolean;
  hasInsetShadow?: boolean;
}) =>
  [
    hasShadow ? shadow : false,
    hasInsetShadow ? insetShadow : false,
    topLeftInner !== null ? `inset 1px 1px 0px 1px ${theme[topLeftInner]}` : false,
    bottomRightInner !== null ? `inset -1px -1px 0 1px ${theme[bottomRightInner]}` : false,
  ]
    .filter(Boolean)
    .join(', ');

export const createHatchedBackground = ({ mainColor = 'black', secondaryColor = 'transparent', pixelSize = 2 }) => css`
  background-image: ${[
    `linear-gradient(
      45deg,
      ${mainColor} 25%,
      transparent 25%,
      transparent 75%,
      ${mainColor} 75%
    )`,
    `linear-gradient(
      45deg,
      ${mainColor} 25%,
      transparent 25%,
      transparent 75%,
      ${mainColor} 75%
    )`,
  ].join(',')};
  background-color: ${secondaryColor};
  background-size: ${`${pixelSize * 2}px ${pixelSize * 2}px`};
  background-position:
    0 0,
    ${`${pixelSize}px ${pixelSize}px`};
`;

export const createBorderStyles = ({
  invert = false,
  style = 'button',
}: { invert?: boolean; style?: BorderStyles } = {}) => {
  const borders = {
    topLeftOuter: invert ? 'bottomRightOuter' : 'topLeftOuter',
    topLeftInner: invert ? 'bottomRightInner' : 'topLeftInner',
    bottomRightInner: invert ? 'topLeftInner' : 'bottomRightInner',
    bottomRightOuter: invert ? 'topLeftOuter' : 'bottomRightOuter',
  } as const;
  return css<CommonThemeProps>`
    border-style: solid;
    border-width: 2px;
    border-left-color: ${({ theme }) => theme[borderStyles[style][borders.topLeftOuter]]};
    border-top-color: ${({ theme }) => theme[borderStyles[style][borders.topLeftOuter]]};
    border-right-color: ${({ theme }) => theme[borderStyles[style][borders.bottomRightOuter]]};
    border-bottom-color: ${({ theme }) => theme[borderStyles[style][borders.bottomRightOuter]]};
    box-shadow: ${({ theme, shadow: hasShadow }) =>
      createInnerBorderWithShadow({
        // @ts-ignore
        theme,
        topLeftInner: borderStyles[style][borders.topLeftInner],
        bottomRightInner: borderStyles[style][borders.bottomRightInner],
        hasShadow,
      })};
  `;
};
