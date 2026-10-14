import type { MermaidConfig } from 'mermaid'

const FONT = '"IBM Plex Sans", system-ui, sans-serif'

// strict: Mermaid encodes HTML in labels and disables click handlers.
export const MERMAID_CONFIG = {
  startOnLoad: false,
  theme: 'base',
  securityLevel: 'strict',
  fontFamily: FONT,
  flowchart: { curve: 'basis', padding: 12, nodeSpacing: 36, rankSpacing: 36, htmlLabels: true },
  themeVariables: {
    darkMode: true,
    background: '#070d18',
    fontFamily: FONT,
    fontSize: '14px',
    primaryColor: '#0f1a2e',
    primaryTextColor: '#dce5f5',
    primaryBorderColor: '#38bdf8',
    lineColor: '#7184a5',
    secondaryColor: '#13213a',
    tertiaryColor: '#1b2a45',
    clusterBkg: '#0b1322',
    clusterBorder: '#2b3f63',
    edgeLabelBackground: '#070d18',
    titleColor: '#dce5f5',
  },
} satisfies MermaidConfig
