import { render, screen } from '@testing-library/react';
import AlexChapter3InteractiveBuilder from './AlexChapter3InteractiveBuilder';

describe('AlexChapter3InteractiveBuilder', () => {
  test('renders character name and skill', () => {
    render(<AlexChapter3InteractiveBuilder />);
    
    expect(screen.getByText('Alex Chen', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Strategic Planning', { exact: false })).toBeInTheDocument();
  });
  
  test('displays practical scenario', () => {
    render(<AlexChapter3InteractiveBuilder />);
    
    expect(screen.getByText('Creating a 3-year organizational strategy for community impact', { exact: false })).toBeInTheDocument();
  });
  
  test('shows time metrics', () => {
    render(<AlexChapter3InteractiveBuilder />);
    
    expect(screen.getByText('3 hours planning sessions', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('45 minutes focused planning', { exact: false })).toBeInTheDocument();
  });
  
  test('renders builder stages', () => {
    render(<AlexChapter3InteractiveBuilder />);
    
    expect(screen.getByText('Getting Started', { exact: false })).toBeInTheDocument();
  });
});
