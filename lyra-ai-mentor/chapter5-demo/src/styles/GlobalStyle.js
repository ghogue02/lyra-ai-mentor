import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fonts.primary};
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.primary};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.typography.fonts.creative};
    font-weight: ${({ theme }) => theme.typography.weights.bold};
    line-height: 1.2;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.sizes['4xl']};
    color: ${({ theme }) => theme.colors.primary};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.sizes['3xl']};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.sizes['2xl']};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.sizes.lg};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: ${({ theme }) => theme.animations.transition};
    
    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
      text-decoration: underline;
    }
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
    transition: ${({ theme }) => theme.animations.transition};
    
    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.primary};
      outline-offset: 2px;
    }
  }

  input, textarea {
    border: 1px solid ${({ theme }) => theme.colors.text.secondary};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing.sm};
    font-family: inherit;
    font-size: ${({ theme }) => theme.typography.sizes.md};
    transition: ${({ theme }) => theme.animations.transition};
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px rgba(230, 57, 70, 0.1);
    }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.lg};
  }

  .section {
    padding: ${({ theme }) => theme.spacing['3xl']} 0;
  }

  .creative-gradient {
    background: ${({ theme }) => theme.colors.gradient.creative};
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .pace-preview {
    background-color: ${({ theme }) => theme.colors.pace.preview};
    border-left: 4px solid ${({ theme }) => theme.colors.creative.blue};
  }

  .pace-analyze {
    background-color: ${({ theme }) => theme.colors.pace.analyze};
    border-left: 4px solid ${({ theme }) => theme.colors.secondary};
  }

  .pace-create {
    background-color: ${({ theme }) => theme.colors.pace.create};
    border-left: 4px solid ${({ theme }) => theme.colors.creative.purple};
  }

  .pace-evaluate {
    background-color: ${({ theme }) => theme.colors.pace.evaluate};
    border-left: 4px solid ${({ theme }) => theme.colors.creative.green};
  }

  @media (max-width: 768px) {
    html {
      font-size: 14px;
    }
    
    .container {
      padding: 0 ${({ theme }) => theme.spacing.md};
    }
    
    .section {
      padding: ${({ theme }) => theme.spacing['2xl']} 0;
    }
  }
`;