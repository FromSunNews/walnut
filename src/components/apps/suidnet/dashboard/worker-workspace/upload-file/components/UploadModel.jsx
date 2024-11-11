import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Cloud, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
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

/**
 * Model upload component with drag & drop support
 * Handles model files and visualizes upload progress
 */
export const UploadModel = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [fileErrors, setFileErrors] = useState({});

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setFiles(prev => [...prev, ...acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
      status: 'pending',
      progress: 0
    }))]);

    rejectedFiles.forEach(rejected => {
      setFileErrors(prev => ({
        ...prev,
        [rejected.file.name]: 'File type not supported. Please upload .py, .pth, .h5, .onnx, or .pb files.'
      }));
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/x-python-code': ['.py', '.pyc'],
      'application/octet-stream': ['.pth', '.h5', '.onnx', '.pb'],
      'application/json': ['.json']
    },
    validator: (file) => {
      const validExtensions = ['.py', '.pyc', '.pth', '.h5', '.onnx', '.pb', '.json'];
      const extension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
      if (!validExtensions.includes(extension)) {
        return {
          code: 'file-invalid-type',
          message: `File type ${extension} is not supported`
        };
      }
      return null;
    }
  });

  const removeFile = (fileId) => {
    setFiles(files => files.filter(f => f.id !== fileId));
  };

  const uploadFiles = async () => {
    setUploading(true);

    // Simulate upload for each file
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

  // Simulate file upload with progress
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
        transition-all duration-500 hover:shadow-lg
        animate-in fade-in-50
        group relative overflow-hidden"
      >
        {/* Chỉ giữ lại gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sidebar-accent/10 via-sidebar/5 to-transparent -z-1" />

        <CardHeader>
          <div className="flex items-center space-x-2">
            <File className="h-6 w-6 text-sidebar-foreground animate-in spin-in-180 duration-500" />
            <CardTitle className="text-sidebar-foreground animate-in slide-in-from-left duration-500">
              Upload Model
            </CardTitle>
          </div>
          <CardDescription className="text-sidebar-foreground/60 
            animate-in slide-in-from-left duration-700 delay-200"
          >
            Drag and drop your model files here. Supports .py, .pth, .h5, .onnx, and .pb files.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              transition-all duration-300 ease-in-out transform
              ${isDragActive
                ? 'border-sidebar-primary bg-sidebar-primary/10 scale-[1.02]'
                : 'border-sidebar-border'
              }
              hover:border-sidebar-primary hover:bg-sidebar-accent/5
              hover:scale-[1.01]
              group/dropzone
              animate-in fade-in-50 duration-500
              overflow-hidden
            `}
          >
            <input {...getInputProps()} />
            <Cloud className={`
              mx-auto h-12 w-12 text-sidebar-foreground/60
              transition-all duration-300
              ${isDragActive ? 'scale-110 rotate-180' : ''}
              group-hover/dropzone:scale-105 group-hover/dropzone:rotate-12
            `} />
            <p className="mt-2 text-sm text-sidebar-foreground/60">
              {isDragActive ? 'Drop your files here' : 'Drag & drop files here, or click to select'}
            </p>

            {/* Shine effect sửa lại */}
            <div className="absolute inset-0 w-[120%] -translate-x-full group-hover/dropzone:translate-x-[5%]
              bg-gradient-to-r from-transparent via-white/5 to-transparent
              transition-all duration-1000 ease-in-out pointer-events-none"
            />
          </div>

          {/* File List với Error Messages */}
          {files.length > 0 && (
            <div className="mt-6 space-y-4">
              {files.map((fileObj, index) => (
                <div
                  key={fileObj.id}
                  className={`
                    relative group/file rounded-lg overflow-hidden
                    animate-in slide-in-from-right duration-300
                    ${fileErrors[fileObj.file.name]
                      ? 'bg-destructive/10 hover:bg-destructive/20'
                      : 'bg-sidebar-accent/50 hover:bg-sidebar-accent/70'}
                  `}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="p-4 flex items-center space-x-4">
                    <File className={`
                      h-8 w-8 transition-transform duration-300 group-hover/file:rotate-12
                      ${fileErrors[fileObj.file.name] ? 'text-destructive' : 'text-sidebar-foreground'}
                    `} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-sidebar-foreground">
                        {fileObj.file.name}
                      </p>
                      {fileErrors[fileObj.file.name] ? (
                        <p className="text-sm text-destructive">
                          {fileErrors[fileObj.file.name]}
                        </p>
                      ) : (
                        <p className="text-sm text-sidebar-foreground/60">
                          {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      )}
                    </div>

                    {!fileErrors[fileObj.file.name] && (
                      <>
                        {fileObj.status === 'pending' && (
                          <Progress
                            value={uploadProgress[fileObj.id] || 0}
                            className="w-1/3 bg-sidebar/20"
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
                      </>
                    )}

                    {/* Error Icon cho invalid files */}
                    {fileErrors[fileObj.file.name] && (
                      <AlertCircle className="h-5 w-5 text-destructive animate-in zoom-in duration-300" />
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        removeFile(fileObj.id);
                        if (fileErrors[fileObj.file.name]) {
                          setFileErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors[fileObj.file.name];
                            return newErrors;
                          });
                        }
                      }}
                      className="opacity-0 group-hover/file:opacity-100 transition-opacity duration-200"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {!fileErrors[fileObj.file.name] && fileObj.status === 'pending' && (
                    <div
                      className="absolute bottom-0 left-0 h-0.5 bg-sidebar-primary/20"
                      style={{ width: `${uploadProgress[fileObj.id] || 0}%` }}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setFiles([]);
              setFileErrors({});
            }}
            disabled={files.length === 0 || uploading}
            className="border-sidebar-border text-sidebar-foreground 
              hover:bg-sidebar-accent/80 transition-all duration-200
              hover:scale-105"
          >
            Clear All
          </Button>
          <Button
            onClick={uploadFiles}
            disabled={files.length === 0 || uploading || Object.keys(fileErrors).length > 0}
            className="ml-2 bg-sidebar-primary text-sidebar-primary-foreground 
              hover:bg-sidebar-primary/90 transition-all duration-200
              hover:scale-105 hover:shadow-md"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Cloud className="mr-2 h-4 w-4" />
                Upload Files
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Model Preview Card */}
      {files.some(f => f.status === 'success') && (
        <Card className="bg-sidebar text-sidebar-foreground border-sidebar-border
          animate-in slide-in-from-bottom duration-500 hover:shadow-lg
          relative overflow-hidden"
        >
          {/* Chỉ giữ lại gradient background cho preview card */}
          <div className="absolute inset-0 bg-gradient-to-br from-sidebar-accent/10 via-sidebar/5 to-transparent -z-1" />

          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <CardTitle className="text-sidebar-primary">Uploaded Models</CardTitle>
            </div>
            <CardDescription className="text-sidebar-foreground/60">
              Preview and manage your uploaded models
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {files.filter(f => f.status === 'success').map((fileObj, index) => (
                <div
                  key={fileObj.id}
                  className="p-4 bg-sidebar-accent/50 rounded-lg
                    animate-in fade-in duration-300 hover:bg-sidebar-accent/70
                    group/model cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-2">
                    <File className="h-5 w-5 text-sidebar-primary 
                      transition-transform duration-300 group-hover/model:rotate-12"
                    />
                    <span className="text-sm font-medium">{fileObj.file.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};