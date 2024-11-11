import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Cloud, FileSpreadsheet, Database, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Progress } from "../../../components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from '../../../components/ui/button';

export function UploadData() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [previewData, setPreviewData] = useState({});

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Đọc vài dòng đầu của file để preview
        const preview = e.target.result.split('\n').slice(0, 5).join('\n');
        setPreviewData(prev => ({
          ...prev,
          [file.name]: preview
        }));
      };
      reader.readAsText(file);
    });

    setFiles(prev => [...prev, ...acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
      status: 'pending',
      progress: 0
    }))]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'text/plain': ['.txt'],
      'application/vnd.ms-excel': ['.xls', '.xlsx']
    }
  });

  const removeFile = (fileId) => {
    setFiles(files => files.filter(f => f.id !== fileId));
  };

  const uploadFiles = async () => {
    setUploading(true);
    for (const fileObj of files) {
      if (fileObj.status !== 'pending') continue;
      try {
        await simulateFileUpload(fileObj, (progress) => {
          setUploadProgress(prev => ({
            ...prev,
            [fileObj.id]: progress
          }));
        });
        setFiles(prev => prev.map(f =>
          f.id === fileObj.id ? { ...f, status: 'success' } : f
        ));
      } catch (error) {
        setFiles(prev => prev.map(f =>
          f.id === fileObj.id ? { ...f, status: 'error' } : f
        ));
      }
    }
    setUploading(false);
  };

  const simulateFileUpload = (fileObj, onProgress) => {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          clearInterval(interval);
          onProgress(100);
          resolve();
        } else {
          onProgress(progress);
        }
      }, 500);
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-sidebar text-sidebar-foreground border-sidebar-border 
        transition-all duration-300 hover:shadow-lg animate-in fade-in-50 duration-700">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-sidebar-primary animate-in spin-in-180 duration-500" />
            <CardTitle className="text-sidebar-primary animate-in slide-in-from-left duration-500">
              Upload Dataset
            </CardTitle>
          </div>
          <CardDescription className="text-sidebar-foreground/60 animate-in slide-in-from-left duration-700 delay-200">
            Upload your datasets for preprocessing and training. Supports CSV, JSON, TXT and Excel formats.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-all duration-300 ease-in-out transform
              ${isDragActive
                ? 'border-sidebar-primary bg-sidebar-primary/10 scale-[1.02]'
                : 'border-sidebar-border'
              }
              hover:border-sidebar-primary hover:bg-sidebar-accent/5
              hover:scale-[1.01]
              animate-in fade-in-50 duration-500
              group
            `}
          >
            <input {...getInputProps()} />
            <Cloud className={`
              mx-auto h-12 w-12 text-sidebar-foreground/60
              transition-all duration-300
              ${isDragActive ? 'scale-110 rotate-180' : ''}
              group-hover:scale-105 group-hover:rotate-12
            `} />
            <p className="mt-2 text-sm text-sidebar-foreground/60">
              {isDragActive ? 'Drop your datasets here' : 'Drag & drop datasets here, or click to select'}
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-6 space-y-4">
              {files.map((fileObj, index) => (
                <div
                  key={fileObj.id}
                  className="relative group bg-sidebar-accent rounded-lg overflow-hidden
                    animate-in slide-in-from-right duration-300"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="p-4">
                    <div className="flex items-center space-x-4">
                      <FileSpreadsheet className="h-8 w-8 text-sidebar-primary 
                        transition-transform duration-300 group-hover:rotate-12" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-sidebar-foreground">
                          {fileObj.file.name}
                        </p>
                        <p className="text-sm text-sidebar-foreground/60">
                          {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                      {fileObj.status === 'pending' && (
                        <Progress
                          value={uploadProgress[fileObj.id] || 0}
                          className="w-1/3 bg-sidebar-accent"
                        />
                      )}
                      {fileObj.status === 'uploading' && (
                        <Loader2 className="h-5 w-5 animate-spin text-sidebar-primary" />
                      )}
                      {fileObj.status === 'success' && (
                        <CheckCircle className="h-5 w-5 text-green-500 animate-in zoom-in duration-300" />
                      )}
                      {fileObj.status === 'error' && (
                        <AlertCircle className="h-5 w-5 text-destructive animate-in zoom-in duration-300" />
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(fileObj.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Data Preview */}
                    {previewData[fileObj.file.name] && (
                      <div className="mt-2 p-2 bg-sidebar/50 rounded text-xs font-mono
                        overflow-x-auto animate-in fade-in-50 duration-500">
                        <pre className="whitespace-pre-wrap">
                          {previewData[fileObj.file.name]}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between animate-in fade-in-50 duration-700 delay-300">
          <Button
            variant="outline"
            onClick={() => setFiles([])}
            disabled={files.length === 0 || uploading}
            className="border-sidebar-border text-sidebar-foreground 
              hover:bg-sidebar-accent/80 transition-all duration-200
              hover:scale-105"
          >
            Clear All
          </Button>
          <Button
            onClick={uploadFiles}
            disabled={files.length === 0 || uploading}
            className="ml-2 bg-sidebar-primary text-sidebar-primary-foreground 
              hover:bg-sidebar-primary/90 transition-all duration-200
              hover:scale-105 hover:shadow-md
              group"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4 transition-transform duration-300 
                  group-hover:rotate-12" />
                Upload Datasets
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Dataset Preview */}
      {files.some(f => f.status === 'success') && (
        <Card className="bg-sidebar text-sidebar-foreground border-sidebar-border
          animate-in slide-in-from-bottom duration-500">
          <CardHeader>
            <CardTitle className="text-sidebar-primary">Processed Datasets</CardTitle>
            <CardDescription className="text-sidebar-foreground/60">
              View and manage your uploaded datasets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.filter(f => f.status === 'success').map((fileObj, index) => (
                <div
                  key={fileObj.id}
                  className="p-4 bg-sidebar-accent/50 rounded-lg
                    animate-in fade-in duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-2">
                    <FileSpreadsheet className="h-5 w-5 text-sidebar-primary" />
                    <span className="text-sm font-medium">{fileObj.file.name}</span>
                  </div>
                  {previewData[fileObj.file.name] && (
                    <div className="mt-2 p-2 bg-sidebar/50 rounded text-xs font-mono overflow-x-auto">
                      <pre className="whitespace-pre-wrap">
                        {previewData[fileObj.file.name]}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}