import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Cloud, File, X, CheckCircle, AlertCircle, Loader2, ExternalLink, Trash2, RefreshCcw, Brain, Upload } from 'lucide-react';
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
import axios from 'axios';

/**
 * Model upload component with drag & drop support
 * Handles model files and visualizes upload progress
 */
export const UploadModel = ({ folder }) => {
  const [showUploadUI, setShowUploadUI] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [fileErrors, setFileErrors] = useState({});

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    acceptedFiles.forEach(file => {
      setFiles(prev => [...prev, {
        file,
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        createdAt: new Date().toISOString(),
        status: 'pending'
      }]);
    });

    rejectedFiles.forEach(rejected => {
      setFileErrors(prev => ({
        ...prev,
        [rejected.file.name]: 'File type not supported'
      }));
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/x-python-code': ['.py', '.pyc'],
      'application/octet-stream': ['.pth', '.h5', '.onnx', '.pb'],
      'application/json': ['.json']
    }
  });

  const removeFile = (fileId) => {
    setFiles(files => files.filter(f => f.id !== fileId));
  };

  const PUBLISHER_URL = "https://publisher.walrus-testnet.walrus.space";
  const AGGREGATOR_URL = "https://aggregator.walrus-testnet.walrus.space";

  const uploadSingleFile = async (fileObj, onProgress) => {
    try {
      const response = await axios.put(
        `${PUBLISHER_URL}/v1/store?epochs=2`,
        fileObj.file,
        {
          headers: {
            'Content-Type': 'application/octet-stream'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(fileObj.id, percentCompleted);
          }
        }
      );

      const data = response.data;
      const blobId = data.newlyCreated?.blobObject?.blobId ||
        data.alreadyCertified?.blobId;

      if (!blobId) {
        throw new Error('Invalid response from server');
      }

      return {
        id: fileObj.id,
        status: 'success',
        url: `${AGGREGATOR_URL}/v1/${blobId}`,
        blobId: blobId
      };
    } catch (error) {
      console.error(`Error uploading ${fileObj.file.name}:`, error);
      return {
        id: fileObj.id,
        status: 'error',
        error: error.message
      };
    }
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;
    setUploading(true);

    try {
      const filesToUpload = files.filter(f =>
        f.status === 'pending' || f.status === 'error'
      );

      const uploadPromises = filesToUpload.map(async fileObj => {
        setFiles(prevFiles => {
          const newFiles = [...prevFiles];
          const index = newFiles.findIndex(f => f.id === fileObj.id);
          if (index !== -1) {
            newFiles[index] = { ...newFiles[index], status: 'uploading' };
          }
          return newFiles;
        });

        const result = await uploadSingleFile(fileObj, (fileId, progress) => {
          setUploadProgress(prev => ({
            ...prev,
            [fileId]: progress
          }));
        });

        setFiles(prevFiles => {
          const newFiles = [...prevFiles];
          const index = newFiles.findIndex(f => f.id === fileObj.id);
          if (index !== -1) {
            newFiles[index] = {
              ...newFiles[index],
              status: result.status,
              url: result.url,
              blobId: result.blobId
            };
          }
          return newFiles;
        });

        return result;
      });

      await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const renderUploadUI = () => (
    <Card className="bg-sidebar text-sidebar-foreground border-sidebar-border 
      transition-all hover:shadow-lg animate-in fade-in-50 duration-700">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-sidebar-foreground animate-in spin-in-180 duration-500" />
          <CardTitle className="text-sidebar-foreground animate-in slide-in-from-left duration-500">
            Upload Models
          </CardTitle>
        </div>
        <CardDescription className="text-sidebar-foreground/60 
          animate-in fade-in-10 duration-150 delay-200">
          Drag and drop your model files here. Supports .py, .pth, .h5, .onnx, and .pb files.
        </CardDescription>
      </CardHeader>

      <CardContent>
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

          {/* Shine effect */}
          <div className="absolute inset-0 w-[120%] -translate-x-full group-hover/dropzone:translate-x-[5%]
            bg-gradient-to-r from-transparent via-white/5 to-transparent
            transition-all duration-1000 ease-in-out pointer-events-none"
          />
        </div>

        {files.filter(f => f.file).length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.filter(f => f.file).map((fileObj, index) => (
              <div
                key={fileObj.id}
                className="relative group/file bg-sidebar-accent rounded-lg p-4
                  animate-in slide-in-from-bottom duration-300 hover:shadow-xl
                  transition-all duration-300 hover:scale-[1.02]"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {fileObj.status === 'pending' &&
                      <File className="h-5 w-5 transition-all duration-300 group-hover/file:scale-110" />}
                    {fileObj.status === 'uploading' &&
                      <Loader2 className="h-5 w-5 animate-spin" />}
                    {fileObj.status === 'success' &&
                      <CheckCircle className="h-5 w-5 text-green-500 animate-in zoom-in duration-300" />}
                    {fileObj.status === 'error' &&
                      <AlertCircle className="h-5 w-5 text-destructive animate-in shake duration-300" />}

                    <div>
                      <p className="text-sm font-medium truncate">{fileObj.name}</p>
                      <p className="text-xs text-sidebar-foreground/60">{fileObj.size}</p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(fileObj.id)}
                    className="opacity-0 group-hover/file:opacity-100 transition-opacity duration-200
                      hover:bg-sidebar-accent/50"
                  >
                    <X className="h-4 w-4 transition-transform duration-200 hover:rotate-90" />
                  </Button>
                </div>

                {fileObj.status === 'uploading' && (
                  <Progress
                    value={uploadProgress[fileObj.id] || 0}
                    className="mt-2 animate-in fade-in duration-200"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="ghost"
          onClick={() => {
            setFiles(files => files.filter(f => !f.file));
            setShowUploadUI(false);
          }}
          className="hover:bg-sidebar-accent/50 transition-all duration-200 
            border border-sidebar-accent text-sidebar-foreground"
        >
          <X className="h-4 w-4  transition-transform duration-200 hover:rotate-90" />
          Cancel
        </Button>
        <Button
          onClick={uploadFiles}
          disabled={!files.some(f => f.status === 'pending' || f.status === 'error')}
          className="bg-sidebar-primary hover:bg-sidebar-primary/90 transition-all duration-200
            hover:scale-105 hover:shadow-md disabled:hover:scale-100 disabled:opacity-50
            text-sidebar-primary-foreground"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin " />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4  transition-transform duration-200 
                group-hover:translate-y-[-2px]" />
              Upload Selected
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6">
      {showUploadUI ? (
        <>
          <Button
            variant="ghost"
            onClick={() => setShowUploadUI(false)}
            className="mb-4 bg-sidebar hover:bg-sidebar-accent border border-sidebar-accent"
          >
            <X className="h-4 w-4 " />
            Back to Models
          </Button>
          {renderUploadUI()}
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Models</h2>
              <p className="text-sm text-sidebar-foreground/60">
                {files.filter(f => f.status === 'success').length} models
              </p>
            </div>
            {files.filter(f => f.status === 'success').length > 0 && (
              <Button variant="primary" onClick={() => setShowUploadUI(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Model
              </Button>
            )}
          </div>

          <Card>
            <CardContent className="pt-6 bg-sidebar">
              {files.filter(f => f.status === 'success').length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.filter(f => f.status === 'success').map((file) => (
                    <div key={file.id} className="bg-sidebar-accent p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <File className="h-5 w-5" />
                        <span className="text-sm font-medium truncate">{file.name}</span>
                      </div>
                      <div className="mt-4 flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(file.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Brain className="h-12 w-12 text-sidebar-foreground/40 mb-4 animate-in zoom-in duration-500" />
                  <h3 className="text-lg font-medium text-sidebar-foreground mb-2 animate-in fade-in duration-500">
                    No Models Yet
                  </h3>
                  <p className="text-sm text-sidebar-foreground/60 mb-6 max-w-sm animate-in fade-in duration-500 delay-200">
                    Upload your first model to get started. Supports .py, .pth, .h5, .onnx, and .pb files.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setShowUploadUI(true)}
                    className="animate-in fade-in-50 duration-500 delay-300"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Your First Model
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};