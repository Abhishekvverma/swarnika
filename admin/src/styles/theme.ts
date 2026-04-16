export const theme = {
  colors: {
    primary: '#D4AF37', // Luxe Gold
    primaryDark: '#B4932D',
    secondary: '#F4F4F5',
    background: '#FFFFFF', // Clean white background
    surface: '#FAFAFA', // Subtle off-white for elevated surfaces
    text: '#09090B', // Very dark black text
    textMuted: '#71717A', 
    white: '#FFFFFF',
    border: '#E4E4E7', // Light gray border
    danger: '#EF4444',
    success: '#22C55E',
    glass: 'rgba(255, 255, 255, 0.75)', // Light glass
    glassBorder: 'rgba(0, 0, 0, 0.08)',
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
    glow: '0 0 20px rgba(212, 175, 55, 0.15)', // Custom gold glow
  },
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.25s ease-in-out',
    slow: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  }
};

export type ThemeType = typeof theme;
