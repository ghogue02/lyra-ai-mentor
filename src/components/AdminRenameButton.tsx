
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

export const AdminRenameButton: React.FC = () => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleBulkRename = async () => {
    setIsRenaming(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('bulk-rename-icons', {
        body: {}
      });

      if (error) {
        console.error('Error calling bulk rename function:', error);
        toast({
          title: "Error",
          description: "Failed to rename icons. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setResults(data);
      toast({
        title: "Bulk Rename Complete!",
        description: `Successfully renamed ${data.summary.successful} of ${data.summary.total} icons.`,
        variant: data.summary.failed > 0 ? "destructive" : "default"
      });

    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <div className="p-4 border border-dashed border-gray-300 rounded-lg bg-yellow-50">
      <h3 className="text-lg font-semibold mb-2 text-yellow-800">Admin: Bulk Rename Icons</h3>
      <p className="text-sm text-yellow-700 mb-4">
        This will rename all icons in the app-icons bucket from generic names (lyra1.png, lyra2.png, etc.) 
        to descriptive names (lyra-avatar.png, hero-main.png, etc.).
      </p>
      
      <Button 
        onClick={handleBulkRename}
        disabled={isRenaming}
        className="mb-4"
        variant={results?.summary?.failed > 0 ? "destructive" : "default"}
      >
        {isRenaming ? (
          <>
            <Upload className="w-4 h-4 mr-2 animate-spin" />
            Renaming Icons...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Rename All Icons
          </>
        )}
      </Button>

      {results && (
        <div className="mt-4 p-3 bg-white rounded border">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            {results.summary.failed === 0 ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            Rename Results
          </h4>
          <p className="text-sm text-gray-600 mb-2">
            Total: {results.summary.total} | 
            Successful: {results.summary.successful} | 
            Failed: {results.summary.failed}
          </p>
          
          <div className="max-h-32 overflow-y-auto text-xs space-y-1">
            {results.results.map((result: any, index: number) => (
              <div key={index} className={`p-1 rounded ${
                result.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {result.status === 'success' 
                  ? `✓ ${result.file} → ${result.newName}`
                  : `✗ ${result.file}: ${result.error}`
                }
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
