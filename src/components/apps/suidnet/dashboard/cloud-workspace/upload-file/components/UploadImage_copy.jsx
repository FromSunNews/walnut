import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Cloud, Image as ImageIcon, X, CheckCircle, AlertCircle, Loader2, CloudDownload, CloudUploadIcon, RefreshCcw, ExternalLink, Trash2 } from 'lucide-react';
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

const PUBLISHER_URL = "https://publisher.walrus-testnet.walrus.space";
const AGGREGATOR_URL = "https://aggregator.walrus-testnet.walrus.space";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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

export const UploadImage = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [previews, setPreviews] = useState({});

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => ({
          ...prev,
          [file.name]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
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
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    }
  });

  const removeFile = (fileId) => {
    setFiles(files => files.filter(f => f.id !== fileId));
  };

  const getFileStatus = () => {
    const hasErrors = files.some(f => f.status === 'error');
    const allSuccess = files.every(f => f.status === 'success');
    const hasPending = files.some(f => f.status === 'pending');

    return { hasErrors, allSuccess, hasPending };
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;
    setUploading(true);

    try {
      const filesToUpload = files.filter(f =>
        f.status === 'pending' || f.status === 'error'
      );

      const uploadPromises = filesToUpload.map(fileObj => {
        setFiles(prevFiles => {
          const newFiles = [...prevFiles];
          const index = newFiles.findIndex(f => f.id === fileObj.id);
          if (index !== -1) {
            newFiles[index] = { ...newFiles[index], status: 'uploading' };
          }
          return newFiles;
        });

        return uploadSingleFile(fileObj, (fileId, progress) => {
          setUploadProgress(prev => ({
            ...prev,
            [fileId]: progress
          }));
        }).then(result => {
          setFiles(prevFiles => {
            const newFiles = [...prevFiles];
            const index = newFiles.findIndex(f => f.id === result.id);
            if (index !== -1) {
              newFiles[index] = { ...newFiles[index], ...result };
            }
            return newFiles;
          });

          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[result.id];
            return newProgress;
          });

          return result;
        });
      });

      await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const { hasErrors, allSuccess, hasPending } = getFileStatus();

  return (
    <div className="space-y-6">
      <Card className="bg-sidebar text-sidebar-foreground border-sidebar-border 
        transition-all hover:shadow-lg animate-in fade-in-50 duration-700">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <ImageIcon className="h-6 w-6 text-sidebar-foreground animate-in spin-in-180 duration-500" />
            <CardTitle className="text-sidebar-foreground animate-in slide-in-from-left duration-500">
              Upload Images
            </CardTitle>
          </div>
          <CardDescription className="text-sidebar-foreground/60 
            animate-in fade-in-10 duration-150 delay-200"
          >
            Drag and drop your images here. Supports JPEG, PNG, GIF and WebP formats.
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
              {isDragActive ? 'Drop the images here' : 'Drag & drop images here, or click to select'}
            </p>

            {/* Thêm shine effect */}
            <div
              className="absolute inset-0 w-[120%] -translate-x-full group-hover/dropzone:translate-x-[5%]
                bg-gradient-to-r from-transparent via-white/5 to-transparent
                transition-all duration-1000 ease-in-out pointer-events-none"
            />
          </div>

          {files.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {files.map((fileObj, index) => (
                <div
                  key={fileObj.id}
                  className="relative group/file bg-sidebar-accent rounded-lg overflow-hidden
                    animate-in slide-in-from-bottom duration-300"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Preview Image */}
                  <div className="aspect-video relative overflow-hidden">
                    {previews[fileObj.file.name] && (
                      <img
                        src={previews[fileObj.file.name]}
                        alt={fileObj.file.name}
                        className="w-full h-full object-cover transition-transform duration-300
                          group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20 transition-opacity duration-300
                      opacity-0 group-hover:opacity-100" />
                  </div>

                  {/* File Info */}
                  <div className="p-4 bg-sidebar-accent/80 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-sidebar-foreground">
                          {fileObj.file.name}
                        </p>
                        <p className="text-sm text-sidebar-foreground/60">
                          {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                      {fileObj.status === 'pending' && (
                        <CloudUploadIcon className="h-5 w-5 text-sidebar-foreground" />
                      )}

                      {fileObj.status === 'success' && (
                        <CheckCircle className="h-5 w-5 text-green-500 animate-in zoom-in duration-300" />
                      )}
                      {fileObj.status === 'error' && (
                        <AlertCircle className="h-5 w-5 text-destructive animate-in zoom-in duration-300" />
                      )}
                    </div>
                    {fileObj.status === 'uploading' && (
                      <Progress
                        value={uploadProgress[fileObj.id] || 0}
                        className="w-full my-3"
                      />
                    )}
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(fileObj.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover/file:opacity-100
                      transition-opacity duration-200 hover:bg-sidebar-accent/80"
                  >
                    <X className="h-4 w-4" />
                  </Button>
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
              hover:bg-sidebar-accent-foreground/30 bg-sidebar-accent transition-all duration-200
              hover:scale-105 group/clear"
          >
            <X className="h-4 w-4 transition-transform duration-200 group-hover/clear:rotate-90" />
            Clear All
          </Button>
          <Button
            onClick={uploadFiles}
            disabled={files.length === 0 || uploading || allSuccess}
            className={`ml-2 transition-all duration-200 hover:scale-105 hover:shadow-md group/upload
              ${hasErrors
                ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                : 'bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground'
              }`}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : hasErrors ? (
              <>
                <RefreshCcw className="mr-2 h-4 w-4 transition-transform duration-200 
                  group-hover/upload:rotate-180" />
                Retry Failed
              </>
            ) : (
              <>
                <ImageIcon className="h-4 w-4 transition-transform duration-200 
                  group-hover/upload:translate-y-[-2px] group-hover/upload:scale-110" />
                Upload Images
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Preview Gallery */}
      {files.filter(f => f.status === 'success').length > 0 && (
        <Card className="bg-sidebar text-sidebar-foreground border-sidebar-border
          animate-in slide-in-from-bottom duration-500 hover:shadow-lg
          relative overflow-hidden mt-6"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-sidebar-accent/10 via-sidebar/5 to-transparent -z-1" />

          <CardHeader>
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5 text-green-500" />
              <CardTitle className="text-sidebar-primary">Uploaded Images</CardTitle>
            </div>
            <CardDescription className="text-sidebar-foreground/60">
              View and manage your uploaded images
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.filter(f => f.status === 'success').map((fileObj, index) => (
                <div
                  key={fileObj.id}
                  className="bg-sidebar-accent group/image relative aspect-square rounded-lg overflow-hidden
                    animate-in fade-in duration-300 hover:shadow-xl
                    transition-all duration-300 hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <img
                    src={fileObj.url || previews[fileObj.file.name]}
                    alt={fileObj.file.name}
                    className="w-full h-full object-cover transition-transform duration-500
                      group-hover/image:scale-110"
                  />

                  {/* Overlay with file name and actions */}
                  <div className="absolute inset-0 bg-sidebar-accent-foreground/10 opacity-0 group-hover/image:opacity-100
                    transition-opacity duration-300 flex flex-col justify-end p-3">
                    <p className="text-white text-sm truncate mb-2">
                      {fileObj.file.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-white/20 hover:bg-white/40 
                          transition-all duration-200 hover:scale-105"
                        onClick={() => window.open(fileObj.url || previews[fileObj.file.name], '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 text-white" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-white/20 hover:bg-white/40 
                          transition-all duration-200 hover:scale-105"
                        onClick={() => removeFile(fileObj.id)}
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                  </div>

                  {/* Success indicator */}
                  <div className="absolute top-2 right-2 bg-green-500/80 rounded-full p-1
                    shadow-lg animate-in zoom-in duration-300"
                    style={{ animationDelay: `${index * 100 + 300}ms` }}
                  >
                    <CheckCircle className="h-4 w-4 text-white" />
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