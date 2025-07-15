import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType } from 'docx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { supabase } from '@/integrations/supabase/client';

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'txt' | 'json' | 'csv';
  includeMetadata?: boolean;
  templateId?: string;
  batchExport?: boolean;
  filters?: Record<string, any>;
}

export interface ExportData {
  title: string;
  content: any;
  metadata?: {
    createdAt: string;
    author?: string;
    tags?: string[];
    version?: string;
    [key: string]: any;
  };
  sections?: ExportSection[];
}

export interface ExportSection {
  title: string;
  content: string | any[];
  type: 'text' | 'table' | 'list' | 'code' | 'image';
  style?: Record<string, any>;
}

export interface ExportTemplate {
  id: string;
  name: string;
  format: ExportOptions['format'];
  layout: {
    header?: string;
    footer?: string;
    styles?: Record<string, any>;
    sections?: string[];
  };
}

export class ExportService {
  private static instance: ExportService;
  private templates: Map<string, ExportTemplate> = new Map();

  static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService();
    }
    return ExportService.instance;
  }

  constructor() {
    this.loadTemplates();
  }

  private async loadTemplates(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('export_templates')
        .select('*')
        .eq('active', true);

      if (error) throw error;

      data?.forEach(template => {
        this.templates.set(template.id, template);
      });
    } catch (error) {
      console.error('Error loading export templates:', error);
    }
  }

  async export(data: ExportData | ExportData[], options: ExportOptions): Promise<void> {
    // Track export analytics
    await this.trackExport(options);

    if (options.batchExport && Array.isArray(data)) {
      return this.batchExport(data, options);
    }

    const singleData = Array.isArray(data) ? data[0] : data;
    
    switch (options.format) {
      case 'pdf':
        return this.exportToPDF(singleData, options);
      case 'docx':
        return this.exportToDOCX(singleData, options);
      case 'txt':
        return this.exportToTXT(singleData, options);
      case 'json':
        return this.exportToJSON(singleData, options);
      case 'csv':
        return this.exportToCSV(singleData, options);
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  private async exportToPDF(data: ExportData, options: ExportOptions): Promise<void> {
    const doc = new jsPDF();
    const template = options.templateId ? this.templates.get(options.templateId) : null;
    
    // Apply template styles if available
    if (template?.layout.styles) {
      // Apply custom styles
    }

    // Add title
    doc.setFontSize(20);
    doc.text(data.title, 20, 20);

    // Add metadata if requested
    let yPosition = 40;
    if (options.includeMetadata && data.metadata) {
      doc.setFontSize(10);
      doc.setTextColor(100);
      
      if (data.metadata.createdAt) {
        doc.text(`Created: ${new Date(data.metadata.createdAt).toLocaleDateString()}`, 20, yPosition);
        yPosition += 10;
      }
      if (data.metadata.author) {
        doc.text(`Author: ${data.metadata.author}`, 20, yPosition);
        yPosition += 10;
      }
      if (data.metadata.tags && data.metadata.tags.length > 0) {
        doc.text(`Tags: ${data.metadata.tags.join(', ')}`, 20, yPosition);
        yPosition += 10;
      }
      
      doc.setTextColor(0);
      yPosition += 10;
    }

    // Process sections
    doc.setFontSize(12);
    if (data.sections) {
      for (const section of data.sections) {
        yPosition = this.addSectionToPDF(doc, section, yPosition);
      }
    } else if (typeof data.content === 'string') {
      const lines = doc.splitTextToSize(data.content, 170);
      doc.text(lines, 20, yPosition);
    }

    // Save the PDF
    doc.save(`${data.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
  }

  private addSectionToPDF(doc: jsPDF, section: ExportSection, startY: number): number {
    let yPosition = startY;

    // Add section title
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(section.title, 20, yPosition);
    yPosition += 10;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(12);

    switch (section.type) {
      case 'text':
        const lines = doc.splitTextToSize(section.content as string, 170);
        doc.text(lines, 20, yPosition);
        yPosition += lines.length * 5 + 10;
        break;

      case 'table':
        if (Array.isArray(section.content)) {
          (doc as any).autoTable({
            startY: yPosition,
            head: [Object.keys(section.content[0])],
            body: section.content.map(row => Object.values(row)),
            margin: { left: 20 },
            styles: section.style || {}
          });
          yPosition = (doc as any).lastAutoTable.finalY + 10;
        }
        break;

      case 'list':
        if (Array.isArray(section.content)) {
          section.content.forEach((item, index) => {
            doc.text(`• ${item}`, 25, yPosition);
            yPosition += 6;
          });
        }
        yPosition += 5;
        break;

      case 'code':
        doc.setFont('courier');
        doc.setFontSize(10);
        const codeLines = doc.splitTextToSize(section.content as string, 170);
        codeLines.forEach(line => {
          doc.text(line, 20, yPosition);
          yPosition += 5;
        });
        doc.setFont('helvetica');
        doc.setFontSize(12);
        yPosition += 5;
        break;
    }

    // Check if we need a new page
    if (yPosition > 270) {
      doc.addPage();
      return 20;
    }

    return yPosition;
  }

  private async exportToDOCX(data: ExportData, options: ExportOptions): Promise<void> {
    const sections = [];

    // Add title
    sections.push(
      new Paragraph({
        text: data.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 400 }
      })
    );

    // Add metadata if requested
    if (options.includeMetadata && data.metadata) {
      const metadataItems = [];
      
      if (data.metadata.createdAt) {
        metadataItems.push(
          new TextRun({
            text: `Created: ${new Date(data.metadata.createdAt).toLocaleDateString()}`,
            size: 20,
            color: '666666'
          })
        );
      }
      
      if (data.metadata.author) {
        metadataItems.push(
          new TextRun({
            text: `\nAuthor: ${data.metadata.author}`,
            size: 20,
            color: '666666'
          })
        );
      }
      
      if (data.metadata.tags && data.metadata.tags.length > 0) {
        metadataItems.push(
          new TextRun({
            text: `\nTags: ${data.metadata.tags.join(', ')}`,
            size: 20,
            color: '666666'
          })
        );
      }

      sections.push(
        new Paragraph({
          children: metadataItems,
          spacing: { after: 400 }
        })
      );
    }

    // Process sections
    if (data.sections) {
      for (const section of data.sections) {
        sections.push(...this.createDOCXSection(section));
      }
    } else if (typeof data.content === 'string') {
      sections.push(
        new Paragraph({
          text: data.content,
          spacing: { after: 200 }
        })
      );
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: sections
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${data.title.replace(/[^a-z0-9]/gi, '_')}.docx`);
  }

  private createDOCXSection(section: ExportSection): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    // Add section title
    paragraphs.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 }
      })
    );

    switch (section.type) {
      case 'text':
        paragraphs.push(
          new Paragraph({
            text: section.content as string,
            spacing: { after: 200 }
          })
        );
        break;

      case 'table':
        if (Array.isArray(section.content) && section.content.length > 0) {
          const headers = Object.keys(section.content[0]);
          const rows = [
            new TableRow({
              children: headers.map(header => 
                new TableCell({
                  children: [new Paragraph({ text: header, bold: true })],
                  shading: { fill: 'E0E0E0' }
                })
              )
            }),
            ...section.content.map(row =>
              new TableRow({
                children: Object.values(row).map(value =>
                  new TableCell({
                    children: [new Paragraph({ text: String(value) })]
                  })
                )
              })
            )
          ];

          // Note: Tables in docx require a different approach
          // For now, we'll convert to formatted text
          paragraphs.push(
            new Paragraph({
              text: 'Table data:',
              bold: true,
              spacing: { before: 100 }
            })
          );
          
          section.content.forEach(row => {
            const rowText = Object.entries(row)
              .map(([key, value]) => `${key}: ${value}`)
              .join(' | ');
            paragraphs.push(
              new Paragraph({
                text: rowText,
                spacing: { after: 100 }
              })
            );
          });
        }
        break;

      case 'list':
        if (Array.isArray(section.content)) {
          section.content.forEach(item => {
            paragraphs.push(
              new Paragraph({
                text: item,
                bullet: { level: 0 },
                spacing: { after: 100 }
              })
            );
          });
        }
        break;

      case 'code':
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: section.content as string,
                font: 'Courier New',
                size: 20
              })
            ],
            spacing: { after: 200 }
          })
        );
        break;
    }

    return paragraphs;
  }

  private async exportToTXT(data: ExportData, options: ExportOptions): Promise<void> {
    let content = `${data.title}\n${'='.repeat(data.title.length)}\n\n`;

    // Add metadata if requested
    if (options.includeMetadata && data.metadata) {
      content += 'Metadata:\n';
      if (data.metadata.createdAt) {
        content += `- Created: ${new Date(data.metadata.createdAt).toLocaleDateString()}\n`;
      }
      if (data.metadata.author) {
        content += `- Author: ${data.metadata.author}\n`;
      }
      if (data.metadata.tags && data.metadata.tags.length > 0) {
        content += `- Tags: ${data.metadata.tags.join(', ')}\n`;
      }
      content += '\n';
    }

    // Process sections
    if (data.sections) {
      for (const section of data.sections) {
        content += `\n${section.title}\n${'-'.repeat(section.title.length)}\n`;
        
        switch (section.type) {
          case 'text':
          case 'code':
            content += `${section.content}\n`;
            break;
          
          case 'list':
            if (Array.isArray(section.content)) {
              section.content.forEach(item => {
                content += `• ${item}\n`;
              });
            }
            break;
          
          case 'table':
            if (Array.isArray(section.content) && section.content.length > 0) {
              const headers = Object.keys(section.content[0]);
              content += headers.join('\t') + '\n';
              section.content.forEach(row => {
                content += Object.values(row).join('\t') + '\n';
              });
            }
            break;
        }
      }
    } else if (typeof data.content === 'string') {
      content += data.content;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `${data.title.replace(/[^a-z0-9]/gi, '_')}.txt`);
  }

  private async exportToJSON(data: ExportData, options: ExportOptions): Promise<void> {
    const exportData = options.includeMetadata ? data : { title: data.title, content: data.content, sections: data.sections };
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, `${data.title.replace(/[^a-z0-9]/gi, '_')}.json`);
  }

  private async exportToCSV(data: ExportData, options: ExportOptions): Promise<void> {
    let csv = '';

    // If content is an array of objects, convert to CSV
    if (Array.isArray(data.content) && data.content.length > 0 && typeof data.content[0] === 'object') {
      const headers = Object.keys(data.content[0]);
      csv = headers.join(',') + '\n';
      
      data.content.forEach(row => {
        csv += Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        ).join(',') + '\n';
      });
    } else if (data.sections) {
      // Extract table data from sections
      const tableData = data.sections
        .filter(section => section.type === 'table' && Array.isArray(section.content))
        .flatMap(section => section.content as any[]);
      
      if (tableData.length > 0) {
        const headers = Object.keys(tableData[0]);
        csv = headers.join(',') + '\n';
        
        tableData.forEach(row => {
          csv += Object.values(row).map(value => 
            typeof value === 'string' && value.includes(',') ? `"${value}"` : value
          ).join(',') + '\n';
        });
      }
    }

    if (!csv) {
      // Fallback: create a simple CSV with title and content
      csv = 'Title,Content\n';
      csv += `"${data.title}","${typeof data.content === 'string' ? data.content.replace(/"/g, '""') : JSON.stringify(data.content)}"`;
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${data.title.replace(/[^a-z0-9]/gi, '_')}.csv`);
  }

  private async batchExport(dataArray: ExportData[], options: ExportOptions): Promise<void> {
    // Create a zip file for batch exports
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    for (let i = 0; i < dataArray.length; i++) {
      const data = dataArray[i];
      const fileName = `${data.title.replace(/[^a-z0-9]/gi, '_')}_${i + 1}`;
      
      switch (options.format) {
        case 'json':
          const json = JSON.stringify(options.includeMetadata ? data : { title: data.title, content: data.content }, null, 2);
          zip.file(`${fileName}.json`, json);
          break;
          
        case 'txt':
          let txtContent = await this.generateTXTContent(data, options);
          zip.file(`${fileName}.txt`, txtContent);
          break;
          
        case 'csv':
          let csvContent = await this.generateCSVContent(data, options);
          zip.file(`${fileName}.csv`, csvContent);
          break;
          
        // PDF and DOCX require special handling for batch
        default:
          console.warn(`Batch export for ${options.format} not fully implemented`);
      }
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `batch_export_${new Date().getTime()}.zip`);
  }

  private async generateTXTContent(data: ExportData, options: ExportOptions): Promise<string> {
    let content = `${data.title}\n${'='.repeat(data.title.length)}\n\n`;

    if (options.includeMetadata && data.metadata) {
      content += 'Metadata:\n';
      Object.entries(data.metadata).forEach(([key, value]) => {
        content += `- ${key}: ${value}\n`;
      });
      content += '\n';
    }

    if (typeof data.content === 'string') {
      content += data.content;
    } else {
      content += JSON.stringify(data.content, null, 2);
    }

    return content;
  }

  private async generateCSVContent(data: ExportData, options: ExportOptions): Promise<string> {
    if (Array.isArray(data.content) && data.content.length > 0 && typeof data.content[0] === 'object') {
      const headers = Object.keys(data.content[0]);
      let csv = headers.join(',') + '\n';
      
      data.content.forEach(row => {
        csv += Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        ).join(',') + '\n';
      });
      
      return csv;
    }
    
    return `Title,Content\n"${data.title}","${JSON.stringify(data.content)}"`;
  }

  private async trackExport(options: ExportOptions): Promise<void> {
    try {
      const { error } = await supabase
        .from('export_analytics')
        .insert({
          format: options.format,
          template_id: options.templateId,
          is_batch: options.batchExport || false,
          includes_metadata: options.includeMetadata || false,
          exported_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking export:', error);
    }
  }

  // Template management methods
  async createTemplate(template: Omit<ExportTemplate, 'id'>): Promise<ExportTemplate> {
    const newTemplate: ExportTemplate = {
      ...template,
      id: `template_${Date.now()}`
    };

    try {
      const { error } = await supabase
        .from('export_templates')
        .insert(newTemplate);

      if (error) throw error;

      this.templates.set(newTemplate.id, newTemplate);
      return newTemplate;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  }

  async getTemplates(format?: ExportOptions['format']): Promise<ExportTemplate[]> {
    const templates = Array.from(this.templates.values());
    return format ? templates.filter(t => t.format === format) : templates;
  }

  async updateTemplate(id: string, updates: Partial<ExportTemplate>): Promise<void> {
    try {
      const { error } = await supabase
        .from('export_templates')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      const existing = this.templates.get(id);
      if (existing) {
        this.templates.set(id, { ...existing, ...updates });
      }
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  }

  async deleteTemplate(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('export_templates')
        .update({ active: false })
        .eq('id', id);

      if (error) throw error;

      this.templates.delete(id);
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const exportService = ExportService.getInstance();