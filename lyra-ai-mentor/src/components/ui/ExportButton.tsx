import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Download,
  FileText,
  Copy,
  Mail,
  Image,
  FileJson,
  FileSpreadsheet,
  Share2,
  Check,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { exportService, ExportData, ExportOptions } from '@/services/exportService';

export interface ExportButtonProps {
  data: ExportData | (() => ExportData);
  formats?: ExportOptions['format'][];
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onExportComplete?: (format: ExportOptions['format']) => void;
  suggestUseIn?: string[]; // Suggested components to use this content in
  characterName?: 'Maya' | 'Sofia' | 'David' | 'Rachel' | 'Alex';
}

const formatIcons: Record<ExportOptions['format'], React.ReactNode> = {
  pdf: <FileText className="w-4 h-4" />,
  docx: <FileText className="w-4 h-4" />,
  txt: <FileText className="w-4 h-4" />,
  json: <FileJson className="w-4 h-4" />,
  csv: <FileSpreadsheet className="w-4 h-4" />
};

const formatLabels: Record<ExportOptions['format'], string> = {
  pdf: 'Export as PDF',
  docx: 'Export as Word Document',
  txt: 'Export as Text File',
  json: 'Export as JSON',
  csv: 'Export as CSV'
};

export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  formats = ['pdf', 'docx', 'txt'],
  variant = 'outline',
  size = 'default',
  className,
  onExportComplete,
  suggestUseIn = [],
  characterName
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const handleExport = async (format: ExportOptions['format']) => {
    setIsExporting(true);
    try {
      const exportData = typeof data === 'function' ? data() : data;
      
      await exportService.export(exportData, {
        format,
        includeMetadata: true
      });
      
      toast.success(`Successfully exported as ${format.toUpperCase()}`);
      onExportComplete?.(format);
      
      // Track character-specific exports
      if (characterName) {
        localStorage.setItem(
          `${characterName.toLowerCase()}-last-export`,
          JSON.stringify({ format, timestamp: new Date().toISOString() })
        );
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      const exportData = typeof data === 'function' ? data() : data;
      const content = typeof exportData.content === 'string' 
        ? exportData.content 
        : JSON.stringify(exportData.content, null, 2);
      
      await navigator.clipboard.writeText(content);
      setCopiedToClipboard(true);
      toast.success('Copied to clipboard!');
      
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleEmailDraft = () => {
    try {
      const exportData = typeof data === 'function' ? data() : data;
      const subject = encodeURIComponent(exportData.title);
      const body = encodeURIComponent(
        typeof exportData.content === 'string' 
          ? exportData.content 
          : JSON.stringify(exportData.content, null, 2)
      );
      
      window.open(`mailto:?subject=${subject}&body=${body}`);
      toast.success('Email draft opened');
    } catch (error) {
      console.error('Email draft failed:', error);
      toast.error('Failed to create email draft');
    }
  };

  const handleShareTo = (component: string) => {
    // Store the data in localStorage for the target component to pick up
    const exportData = typeof data === 'function' ? data() : data;
    const shareKey = `shared-content-${component.toLowerCase().replace(/\s+/g, '-')}`;
    
    localStorage.setItem(shareKey, JSON.stringify({
      data: exportData,
      fromCharacter: characterName,
      timestamp: new Date().toISOString()
    }));
    
    toast.success(`Content shared with ${component}`, {
      description: 'Navigate to the component to use this content'
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={className}
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* File Formats */}
        {formats.map((format) => (
          <DropdownMenuItem
            key={format}
            onClick={() => handleExport(format)}
            className="cursor-pointer"
          >
            {formatIcons[format]}
            <span className="ml-2">{formatLabels[format]}</span>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        {/* Quick Actions */}
        <DropdownMenuItem
          onClick={handleCopyToClipboard}
          className="cursor-pointer"
        >
          {copiedToClipboard ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          <span className="ml-2">
            {copiedToClipboard ? 'Copied!' : 'Copy to Clipboard'}
          </span>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={handleEmailDraft}
          className="cursor-pointer"
        >
          <Mail className="w-4 h-4" />
          <span className="ml-2">Create Email Draft</span>
        </DropdownMenuItem>
        
        {/* Use In Suggestions */}
        {suggestUseIn.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs">Use in...</DropdownMenuLabel>
            {suggestUseIn.map((component) => (
              <DropdownMenuItem
                key={component}
                onClick={() => handleShareTo(component)}
                className="cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span className="ml-2 text-sm">{component}</span>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};