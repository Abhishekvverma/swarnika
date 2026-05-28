export const theme = {
  colors: {
    primary: '#D4AF37', // Luxe Gold
    primaryDark: '#AA8417',
    secondary: '#0C0A09', // Deep dark obsidian for active menu text/contrast
    background: '#0C0A09', // Clean dark obsidian background
    surface: '#161413', // Deep matte stone gray for card surfaces
    text: '#F5F5F4', // Warm silk off-white text
    textMuted: '#A8A29E', // Muted warm stone gray text
    white: '#FFFFFF',
    border: '#2E2A24', // Subtle antique bronze/gold border
    danger: '#EF4444',
    success: '#10B981',
    glass: 'rgba(22, 20, 19, 0.75)', // Elegant dark glass
    glassBorder: 'rgba(212, 175, 55, 0.1)',
  },
  fonts: {
    main: 'var(--font-poppins)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  shadows: {
    sm: '0 2px 8px rgba(0,0,0,0.4)',
    md: '0 8px 16px rgba(0,0,0,0.5)',
    lg: '0 12px 32px rgba(0,0,0,0.6)',
    glow: '0 0 20px rgba(212, 175, 55, 0.15)', // Custom gold glow
  },
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.25s ease-in-out',
    slow: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  }
};

export type ThemeType = typeof theme;
