
// Mapping of chapter IDs to uploaded icon images
export const chapterIconMap: Record<number, string> = {
  1: '/lovable-uploads/89bfb1be-6b72-42a6-b6c1-48c8eccd2034.png', // AI Assistant icon for "What Is AI Anyway?"
  2: '/lovable-uploads/c4ca451a-4e36-4b11-8d9b-e4e0bf70bb95.png', // Target/Learning icon for learning chapter
  3: '/lovable-uploads/8dc9b49c-77fc-40ad-b0a0-b36e5c47fea1.png', // Heart/Mission icon for mission-focused chapter
  4: '/lovable-uploads/77c0e73b-e754-4a08-aefb-96be00aac64a.png', // Trophy/Achievement icon for completion
  5: '/lovable-uploads/4c23d7f9-f5bb-4f85-a7ae-5acdd896e95f.png', // Network/Connection icon
  6: '/lovable-uploads/ea0c4f2f-b51e-4dd6-ba55-f5cdbad8fc08.png', // Workflow/Process icon
  7: '/lovable-uploads/79c79cca-e61a-471d-b0b3-1c8b826c47b9.png', // Data/Analytics icon
  8: '/lovable-uploads/0e8db7b1-0a9b-4d7a-a3e0-24ffbbfd063d.png', // Communication icon
  9: '/lovable-uploads/56b28a93-4b8f-49d0-bbac-3fbdd4ec0bd7.png', // Security/Shield icon
  10: '/lovable-uploads/df830b10-eb05-4d23-ba59-7faac3fec4b9.png' // Growth/Plant icon
};

export const getChapterIcon = (chapterId: number): string => {
  return chapterIconMap[chapterId] || chapterIconMap[1]; // fallback to first icon
};
