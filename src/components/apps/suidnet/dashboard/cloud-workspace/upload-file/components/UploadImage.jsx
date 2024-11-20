import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Cloud, Image as ImageIcon, X, CheckCircle, AlertCircle,
  Loader2, CloudUploadIcon, RefreshCcw, ExternalLink,
  Trash2, Upload, Search, Grid, List
} from 'lucide-react';
import { Progress } from "../../../components/ui/progress";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
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

export const UploadImage = ({ folder }) => {
  const [showUploadUI, setShowUploadUI] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [previews, setPreviews] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');

  // Load initial data
  useEffect(() => {
    // Mock data - replace with API call in production
    // const mockData = [
    //   {
    //     id: 1,
    //     name: 'image1.jpg',
    //     url: 'https://picsum.photos/400/300',
    //     size: '2.5MB',
    //     createdAt: '2024-03-20',
    //     status: 'success'
    //   },
    //   {
    //     id: 2,
    //     name: 'image2.png',
    //     url: 'https://picsum.photos/400/301',
    //     size: '1.8MB',
    //     createdAt: '2024-03-21',
    //     status: 'success'
    //   },
    // ];
    // setFiles(mockData);
  }, []);

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
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      createdAt: new Date().toISOString(),
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
    setPreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fileId];
      return newPreviews;
    });
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

        // Cập nhật trạng thái file sau khi upload xong
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
                className="relative group/file bg-sidebar-accent rounded-lg overflow-hidden
                  animate-in slide-in-from-bottom duration-300"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="aspect-video relative overflow-hidden">
                  {previews[fileObj.name] && (
                    <img
                      src={previews[fileObj.name]}
                      alt={fileObj.name}
                      className="w-full h-full object-cover transition-transform duration-300
                        group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20 transition-opacity duration-300
                    opacity-0 group-hover:opacity-100" />
                </div>

                <div className="p-4 bg-sidebar-accent/80 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-sidebar-foreground">
                        {fileObj.name}
                      </p>
                      <p className="text-sm text-sidebar-foreground/60">
                        {fileObj.size}
                      </p>
                    </div>

                    {fileObj.status === 'pending' && (
                      <CloudUploadIcon className="h-5 w-5 text-sidebar-foreground" />
                    )}
                    {fileObj.status === 'uploading' && (
                      <Loader2 className="h-5 w-5 text-sidebar-foreground animate-spin" />
                    )}
                    {fileObj.status === 'success' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {fileObj.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  {fileObj.status === 'uploading' && (
                    <Progress
                      value={uploadProgress[fileObj.id] || 0}
                      className="w-full mt-2"
                    />
                  )}
                </div>

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

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setFiles(files => files.filter(f => !f.file));
            setShowUploadUI(false);
          }}
          className="bg-sidebar hover:bg-sidebar-accent border border-sidebar-accent text-sidebar-foreground"
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button
          onClick={uploadFiles}
          disabled={!files.some(f => f.status === 'pending' || f.status === 'error')}
          className="bg-sidebar-primary text-sidebar-primary-foreground"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload Selected
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );

  const renderGalleryHeader = () => (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-sidebar-foreground">
            {folder ? folder.name : 'Image Gallery'}
          </h2>
          <p className="text-sm text-sidebar-foreground/60">
            {files.filter(f => f.status === 'success').length} images • {folder?.usedSpace || '0 MB'} used
          </p>
        </div>
        {files.filter(f => f.status === 'success').length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
            <Button variant="primary" onClick={() => setShowUploadUI(true)}>
              <Upload className="h-4 w-4" />
              Upload Images
            </Button>
          </div>
        )}
      </div>

      {files.filter(f => f.status === 'success').length > 0 && (
        <div className="flex gap-4">
          <div className="relative flex-1 bg-sidebar rounded-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sidebar-foreground/40" />
            <Input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderGalleryContent = () => {
    const successFiles = files.filter(f => f.status === 'success');

    if (successFiles.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <ImageIcon className="h-12 w-12 text-sidebar-foreground/40 mb-4 animate-in zoom-in duration-500" />
          <h3 className="text-lg font-medium text-sidebar-foreground mb-2 animate-in fade-in duration-500">
            No Images Yet
          </h3>
          <p className="text-sm text-sidebar-foreground/60 mb-6 max-w-sm animate-in fade-in duration-500 delay-200">
            Upload your first image to get started. Supports JPEG, PNG, GIF and WebP formats.
          </p>
          <Button
            variant="primary"
            onClick={() => setShowUploadUI(true)}
          >
            <Upload className="h-4 w-4" />
            Upload Your First Image
          </Button>
        </div>
      );
    }

    return viewMode === 'grid' ? renderGridView() : renderListView();
  };

  const renderGridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.filter(f =>
        f.status === 'success' &&
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).map((file, index) => (
        <div
          key={file.id}
          className="group/image relative aspect-square rounded-lg overflow-hidden
            animate-in fade-in duration-300 hover:shadow-xl
            transition-all duration-300 hover:scale-[1.02]
            bg-sidebar-accent"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <img
            src={file.url || previews[file.name]}
            alt={file.name}
            className="w-full h-full object-cover transition-transform duration-500
              group-hover/image:scale-110"
          />

          <div className="absolute inset-0 bg-sidebar-accent/40 opacity-0 
            group-hover/image:opacity-100 transition-opacity duration-300 
            flex flex-col justify-end p-3"
          >
            <p className="text-white text-sm truncate mb-2">{file.name}</p>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-white/20 hover:bg-white/40"
                onClick={() => window.open(file.url || previews[file.name], '_blank')}
              >
                <ExternalLink className="h-4 w-4 text-white" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-white/20 hover:bg-white/40"
                onClick={() => removeFile(file.id)}
              >
                <Trash2 className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-2">
      {files.filter(f =>
        f.status === 'success' &&
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).map((file, index) => (
        <div
          key={file.id}
          className="flex items-center gap-4 p-3 rounded-lg hover:bg-sidebar-accent
            transition-colors duration-200 group/item animate-in fade-in duration-300"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="h-16 w-16 rounded overflow-hidden flex-shrink-0">
            <img
              src={file.url || previews[file.name]}
              alt={file.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{file.name}</p>
            <p className="text-sm text-sidebar-foreground/60">
              {file.size} • {file.createdAt}
            </p>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100
            transition-opacity duration-200">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(file.url || previews[file.name], '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
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
            <X className="h-4 w-4" />
            Back to Gallery
          </Button>
          {renderUploadUI()}
        </>
      ) : (
        <>
          {renderGalleryHeader()}
          <Card className="bg-sidebar border-sidebar-border">
            <CardContent className="pt-6">
              {renderGalleryContent()}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
