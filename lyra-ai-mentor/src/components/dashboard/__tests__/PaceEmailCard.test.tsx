import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PaceEmailCard } from '../PaceEmailCard';
import { TooltipProvider } from '@/components/ui/tooltip';
import { vi } from 'vitest';

// Mock the sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

describe('PaceEmailCard', () => {
  const mockItem = {
    id: '1',
    name: 'Test PACE Email',
    description: 'Test description',
    metadata: JSON.stringify({
      pace_data: {
        purpose: 'inform_educate',
        audience: {
          label: 'Team Members',
          description: 'Your direct team',
          contextualDescription: 'Team members who need project updates'
        },
        prompt: 'This is a test prompt that should be displayed in full when viewing the email details.',
        email_content: `Subject: Test Email Subject

This is a long email content that should be displayed in full when the user clicks the "View" button.

It contains multiple paragraphs to ensure that the full content is shown in the modal dialog.

The email preview should only show a truncated version (3 lines), but the full content should be available in the modal.

Best regards,
Test Sender`,
        why_this_works: 'Clear subject line, structured updates, and action items make this email effective for team communication.',
        framework: { name: 'SCRAP' },
        created_at: new Date().toISOString()
      }
    }),
    created_at: new Date().toISOString(),
    download_count: 10,
    average_rating: 4.5,
    user_unlock: {
      unlocked_at: new Date().toISOString(),
      download_count: 2
    }
  };

  it('renders the email card with truncated preview', () => {
    render(
      <TooltipProvider>
        <PaceEmailCard item={mockItem} isGridView={true} />
      </TooltipProvider>
    );

    // Check that the card is rendered
    expect(screen.getByText('Share important news')).toBeInTheDocument();
    expect(screen.getByText('Team Members')).toBeInTheDocument();

    // Check that email preview is truncated (has line-clamp-3 class)
    const preview = screen.getByText(/Subject: Test Email Subject/);
    expect(preview).toHaveClass('line-clamp-3');
  });

  it('opens full email view when View button is clicked', async () => {
    render(
      <TooltipProvider>
        <PaceEmailCard item={mockItem} isGridView={true} />
      </TooltipProvider>
    );

    // Click the View button
    const viewButton = screen.getByRole('button', { name: /view/i });
    fireEvent.click(viewButton);

    // Wait for modal to open
    await waitFor(() => {
      // Check that the modal shows the full email content
      const fullContent = screen.getByText(/This is a long email content that should be displayed in full/);
      expect(fullContent).toBeInTheDocument();
      
      // Check that multiple paragraphs are shown
      expect(screen.getByText(/It contains multiple paragraphs/)).toBeInTheDocument();
      expect(screen.getByText(/Best regards,/)).toBeInTheDocument();
      expect(screen.getByText(/Test Sender/)).toBeInTheDocument();
    });

    // Check that other sections are displayed
    expect(screen.getByText('Why This Email Works')).toBeInTheDocument();
    expect(screen.getByText(/Clear subject line, structured updates/)).toBeInTheDocument();
    expect(screen.getByText('AI Prompt')).toBeInTheDocument();
    expect(screen.getByText(/This is a test prompt/)).toBeInTheDocument();
  });

  it('opens full email view when clicking on preview in grid view', async () => {
    render(
      <TooltipProvider>
        <PaceEmailCard item={mockItem} isGridView={true} />
      </TooltipProvider>
    );

    // Click on the email preview area
    const preview = screen.getByText(/Subject: Test Email Subject/).closest('div');
    fireEvent.click(preview!);

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByText(/This is a long email content that should be displayed in full/)).toBeInTheDocument();
    });
  });

  it('copies full prompt when copy prompt button is clicked', async () => {
    render(
      <TooltipProvider>
        <PaceEmailCard item={mockItem} isGridView={true} />
      </TooltipProvider>
    );

    // Click the copy prompt button
    const copyPromptButton = screen.getAllByRole('button').find(btn => 
      btn.textContent?.includes('Prompt')
    );
    fireEvent.click(copyPromptButton!);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'This is a test prompt that should be displayed in full when viewing the email details.'
      );
    });
  });

  it('copies full email content when copy email button is clicked', async () => {
    render(
      <TooltipProvider>
        <PaceEmailCard item={mockItem} isGridView={true} />
      </TooltipProvider>
    );

    // Click the copy email button
    const copyEmailButton = screen.getAllByRole('button').find(btn => 
      btn.textContent?.includes('Copy')
    );
    fireEvent.click(copyEmailButton!);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining('Subject: Test Email Subject')
      );
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining('Best regards,')
      );
    });
  });

  it('does not show email preview in list view', () => {
    render(
      <TooltipProvider>
        <PaceEmailCard item={mockItem} isGridView={false} />
      </TooltipProvider>
    );

    // In list view, the preview should not be shown
    expect(screen.queryByText(/Click to view full email/)).not.toBeInTheDocument();
  });
});