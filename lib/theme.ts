import type { ThemeConfig } from 'antd';

const theme: ThemeConfig = {
  token: {
    fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif',
    fontSize: 14,
    // Add other global tokens here if needed
  },
  components: {
    Button: {
      fontWeight: 500, // Matching MUI default or specific preference
      // borderWidth: 1, // AntD default is 1
    },
    Input: {
      // Ant D specific input overrides if needed to match MUI
    },
    Typography: {
      fontSize: 14,
    },
    // Add other component overrides here
  },
};

export default theme;
