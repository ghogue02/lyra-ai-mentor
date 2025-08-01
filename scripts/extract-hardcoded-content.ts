import * as fs from 'fs';
import * as path from 'path';

interface ExtractedContent {
  source: string;
  type: string;
  content: string[];
}

// Function to extract text content from React components
function extractTextFromTSX(content: string, filePath: string): ExtractedContent {
  const textContent: string[] = [];
  
  // Extract strings within JSX text content (between > and <)
  const jsxTextRegex = />([^<>]*[a-zA-Z][^<>]*)</g;
  let match;
  while ((match = jsxTextRegex.exec(content)) !== null) {
    const text = match[1].trim();
    if (text && text.length > 3 && !text.includes('{') && !text.includes('className')) {
      textContent.push(text);
    }
  }
  
  // Extract string literals in quotes
  const stringLiteralRegex = /["'`]([^"'`]{10,}?)["'`]/g;
  while ((match = stringLiteralRegex.exec(content)) !== null) {
    const text = match[1].trim();
    if (text && !text.includes('className') && !text.includes('src/') && !text.includes('import')) {
      textContent.push(text);
    }
  }
  
  // Extract title and description props
  const titleRegex = /title\s*[:=]\s*["'`]([^"'`]+)["'`]/g;
  while ((match = titleRegex.exec(content)) !== null) {
    textContent.push(`TITLE: ${match[1]}`);
  }
  
  const descRegex = /description\s*[:=]\s*["'`]([^"'`]+)["'`]/g;
  while ((match = descRegex.exec(content)) !== null) {
    textContent.push(`DESCRIPTION: ${match[1]}`);
  }
  
  return {
    source: filePath,
    type: 'tsx-component',
    content: textContent.filter((item, index, arr) => arr.indexOf(item) === index) // remove duplicates
  };
}

// Function to recursively find all TSX files
function findTSXFiles(dir: string): string[] {
  const files: string[] = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.includes('node_modules') && !item.includes('.git')) {
      files.push(...findTSXFiles(fullPath));
    } else if (item.endsWith('.tsx') && !item.includes('.test.')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Main extraction function
function extractAllContent(): ExtractedContent[] {
  const extractedContent: ExtractedContent[] = [];
  
  // Character stories from context
  const characterContextPath = 'src/contexts/CharacterStoryContext.tsx';
  if (fs.existsSync(characterContextPath)) {
    const content = fs.readFileSync(characterContextPath, 'utf-8');
    extractedContent.push(extractTextFromTSX(content, characterContextPath));
  }
  
  // Find all TSX files in key directories
  const searchDirs = [
    'src/components/lesson',
    'src/components/interactive', 
    'src/components/navigation',
    'src/pages'
  ];
  
  for (const dir of searchDirs) {
    const tsxFiles = findTSXFiles(dir);
    for (const file of tsxFiles) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        const extracted = extractTextFromTSX(content, file);
        if (extracted.content.length > 0) {
          extractedContent.push(extracted);
        }
      } catch (error) {
        console.error(`Error reading file ${file}:`, error);
      }
    }
  }
  
  return extractedContent;
}

// Generate markdown export
function generateMarkdownExport(extractedContent: ExtractedContent[]): string {
  let markdown = `# Complete Content Export - Chapters 1-6\n\n`;
  markdown += `Generated: ${new Date().toISOString()}\n\n`;
  
  // Group by source file
  const groupedContent = extractedContent.reduce((acc, item) => {
    if (!acc[item.source]) {
      acc[item.source] = [];
    }
    acc[item.source].push(...item.content);
    return acc;
  }, {} as Record<string, string[]>);
  
  // Character Stories Section
  markdown += `## Character Stories\n\n`;
  if (groupedContent['src/contexts/CharacterStoryContext.tsx']) {
    groupedContent['src/contexts/CharacterStoryContext.tsx'].forEach(content => {
      markdown += `- ${content}\n`;
    });
    markdown += `\n`;
  }
  
  // Lesson Components
  markdown += `## Lesson Components\n\n`;
  Object.entries(groupedContent)
    .filter(([source]) => source.includes('lesson'))
    .forEach(([source, content]) => {
      markdown += `### ${source}\n\n`;
      content.forEach(text => {
        markdown += `- ${text}\n`;
      });
      markdown += `\n`;
    });
  
  // Interactive Components
  markdown += `## Interactive Components\n\n`;
  Object.entries(groupedContent)
    .filter(([source]) => source.includes('interactive'))
    .forEach(([source, content]) => {
      markdown += `### ${source}\n\n`;
      content.forEach(text => {
        markdown += `- ${text}\n`;
      });
      markdown += `\n`;
    });
  
  // Other Components
  markdown += `## Other Components\n\n`;
  Object.entries(groupedContent)
    .filter(([source]) => !source.includes('lesson') && !source.includes('interactive') && !source.includes('CharacterStoryContext'))
    .forEach(([source, content]) => {
      markdown += `### ${source}\n\n`;
      content.forEach(text => {
        markdown += `- ${text}\n`;
      });
      markdown += `\n`;
    });
  
  return markdown;
}

// Main execution
try {
  console.log('Extracting hardcoded content from TSX files...');
  const extractedContent = extractAllContent();
  
  const markdownExport = generateMarkdownExport(extractedContent);
  
  // Write to file
  fs.writeFileSync('hardcoded-content-export.md', markdownExport);
  
  // Also create JSON export
  fs.writeFileSync('hardcoded-content-export.json', JSON.stringify(extractedContent, null, 2));
  
  console.log('Content extraction complete!');
  console.log(`- Markdown export: hardcoded-content-export.md`);
  console.log(`- JSON export: hardcoded-content-export.json`);
  console.log(`- Extracted content from ${extractedContent.length} files`);
  
} catch (error) {
  console.error('Error during content extraction:', error);
}
