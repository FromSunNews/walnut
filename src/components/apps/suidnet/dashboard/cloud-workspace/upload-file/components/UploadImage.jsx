import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Cloud, Image as ImageIcon, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
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

  const uploadFiles = async () => {
    if (files.length === 0) return;
    setUploading(true);

    try {
      const pendingFiles = files.filter(f => f.status === 'pending');

      const updateProgress = (fileId, progress) => {
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: progress
        }));
      };

      const uploadPromises = pendingFiles.map(fileObj =>
        uploadSingleFile(fileObj, updateProgress)
      );

      const results = await Promise.all(uploadPromises);

      setFiles(prevFiles => {
        const newFiles = [...prevFiles];
        results.forEach(result => {
          const index = newFiles.findIndex(f => f.id === result.id);
          if (index !== -1) {
            newFiles[index] = {
              ...newFiles[index],
              ...result
            };
          }
        });
        return newFiles;
      });

    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const testUploadSingleFile = async () => {
    if (files.length === 0) return;
    setUploading(true);

    try {
      const firstFile = files[0];
      const updateProgress = (fileId, progress) => {
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: progress
        }));
      };

      const result = await uploadSingleFile(firstFile, updateProgress);

      setFiles(prevFiles => {
        const newFiles = [...prevFiles];
        const index = newFiles.findIndex(f => f.id === result.id);
        if (index !== -1) {
          newFiles[index] = {
            ...newFiles[index],
            ...result
          };
        }
        return newFiles;
      });

      console.log('Upload result:', result);
    } catch (error) {
      console.error('Test upload error:', error);
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-sidebar text-sidebar-foreground border-sidebar-border 
        transition-all hover:shadow-lg animate-in fade-in-50 duration-700">
        <CardHeader>
          <CardTitle className="text-sidebar-primary animate-in slide-in-from-left duration-500">
            Upload Images
          </CardTitle>
          <CardDescription className="text-sidebar-foreground/60 animate-in slide-in-from-left duration-700 delay-200">
            Drag and drop your images here. Supports JPEG, PNG, GIF and WebP formats.
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
            `}
          >
            <input {...getInputProps()} />
            <Cloud className={`
              mx-auto h-12 w-12 text-sidebar-foreground/60
              transition-transform duration-300
              ${isDragActive ? 'scale-110' : ''}
              group-hover:scale-105
            `} />
            <p className="mt-2 text-sm text-sidebar-foreground/60">
              {isDragActive ? 'Drop the images here' : 'Drag & drop images here, or click to select'}
            </p>
          </div>

          {files.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {files.map((fileObj, index) => (
                <div
                  key={fileObj.id}
                  className="relative group bg-sidebar-accent rounded-lg overflow-hidden
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
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(fileObj.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100
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
              hover:scale-105 hover:shadow-md"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload Images'
            )}
          </Button>
          <Button
            onClick={testUploadSingleFile}
            disabled={files.length === 0 || uploading}
            className="ml-2 bg-sidebar-primary text-sidebar-primary-foreground 
              hover:bg-sidebar-primary/90 transition-all duration-200
              hover:scale-105 hover:shadow-md"
          >
            Test Upload
          </Button>
        </CardFooter>
      </Card>

      {/* Preview Gallery */}
      {files.filter(f => f.status === 'success').map((fileObj, index) => (
        <div
          key={fileObj.id}
          className="relative aspect-square rounded-lg overflow-hidden
            animate-in fade-in duration-300"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <img
            src={fileObj.url || previews[fileObj.file.name]}
            alt={fileObj.file.name}
            className="w-full h-full object-cover transition-transform duration-300
              hover:scale-110"
          />
        </div>
      ))}
    </div>
  );
};