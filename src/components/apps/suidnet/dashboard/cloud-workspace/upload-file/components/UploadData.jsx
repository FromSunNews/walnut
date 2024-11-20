import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Cloud, FileSpreadsheet, Database, X, CheckCircle, AlertCircle, Loader2, RefreshCcw, File, List, Grid, Upload, ExternalLink, Trash2, Search } from 'lucide-react';
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

export function UploadData({ folder }) {
  const [showUploadUI, setShowUploadUI] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [previewData, setPreviewData] = useState({});
  const [expandedPreviews, setExpandedPreviews] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

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

  const { hasErrors, allSuccess, hasPending } = getFileStatus();

  const togglePreview = (fileName) => {
    setExpandedPreviews(prev => ({
      ...prev,
      [fileName]: !prev[fileName]
    }));
  };

  const renderPreview = (fileName, previewText) => {
    const lines = previewText.split('\n');
    const isExpanded = expandedPreviews[fileName];
    const maxLines = 3; // Giới hạn số dòng hiển thị
    const hasMoreLines = lines.length > maxLines;
    const displayedLines = isExpanded ? lines : lines.slice(0, maxLines);

    return (
      <div className="mt-3 space-y-2">
        <div className="p-2 bg-sidebar/50 rounded text-xs font-mono
          overflow-x-auto animate-in fade-in-50 duration-500"
        >
          <pre className="whitespace-pre-wrap">
            {displayedLines.join('\n')}
            {!isExpanded && hasMoreLines && (
              <span className="text-sidebar-foreground/60">...</span>
            )}
          </pre>
        </div>

        {hasMoreLines && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              togglePreview(fileName);
            }}
            className="text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            {isExpanded ? 'Show less' : `Show ${lines.length - maxLines} more lines`}
          </Button>
        )}
      </div>
    );
  };

  const renderGalleryHeader = () => (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-sidebar-foreground">
            {folder ? folder.name : 'Dataset Gallery'}
          </h2>
          <p className="text-sm text-sidebar-foreground/60">
            {files.filter(f => f.status === 'success').length} datasets
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
              <Upload className="h-4 w-4 mr-2" />
              Upload Dataset
            </Button>
          </div>
        )}
      </div>

      {files.filter(f => f.status === 'success').length > 0 && (
        <div className="flex gap-4">
          <div className="relative flex-1 bg-sidebar rounded-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sidebar-foreground/40" />
            <input
              type="text"
              placeholder="Search datasets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {files.filter(f =>
        f.status === 'success' &&
        f.file.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).map((fileObj, index) => (
        <div
          key={fileObj.id}
          className="group/dataset relative rounded-lg overflow-hidden
            animate-in fade-in duration-300 hover:shadow-xl
            transition-all duration-300 hover:scale-[1.02]
            bg-sidebar-accent"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <FileSpreadsheet className="h-6 w-6 text-sidebar-primary" />
              <span className="text-sm font-medium truncate">{fileObj.file.name}</span>
            </div>
            {previewData[fileObj.file.name] && (
              <div className="text-xs font-mono bg-sidebar/50 p-2 rounded max-h-[100px] overflow-y-auto">
                <pre className="whitespace-pre-wrap">{previewData[fileObj.file.name]}</pre>
              </div>
            )}
          </div>

          <div className="absolute inset-0 bg-sidebar-accent/40 opacity-0 
            group-hover/dataset:opacity-100 transition-opacity duration-300 
            flex flex-col justify-end p-3"
          >
            <p className="text-white text-sm truncate mb-2">{fileObj.file.name}</p>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-white/20 hover:bg-white/40"
                onClick={() => window.open(fileObj.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 text-white" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-white/20 hover:bg-white/40"
                onClick={() => removeFile(fileObj.id)}
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
        f.file.name.toLowerCase().includes(searchTerm.toLowerCase())
      ).map((fileObj, index) => (
        <div
          key={fileObj.id}
          className="flex items-start gap-4 p-3 rounded-lg hover:bg-sidebar-accent
            transition-colors duration-200 group/item animate-in fade-in duration-300"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="h-16 w-16 rounded bg-sidebar-accent/50 flex items-center justify-center flex-shrink-0">
            <FileSpreadsheet className="h-8 w-8 text-sidebar-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{fileObj.file.name}</p>
            <p className="text-sm text-sidebar-foreground/60 mb-2">
              {(fileObj.file.size / 1024).toFixed(1)} KB
            </p>
            {previewData[fileObj.file.name] && (
              <div className="text-xs font-mono bg-sidebar/50 p-2 rounded max-h-[100px] overflow-y-auto">
                <pre className="whitespace-pre-wrap">{previewData[fileObj.file.name]}</pre>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100
            transition-opacity duration-200">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(fileObj.url, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeFile(fileObj.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderGalleryContent = () => {
    const successFiles = files.filter(f => f.status === 'success');

    if (successFiles.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Database className="h-12 w-12 text-sidebar-foreground/40 mb-4 animate-in zoom-in duration-500" />
          <h3 className="text-lg font-medium text-sidebar-foreground mb-2 animate-in fade-in duration-500">
            No Datasets Yet
          </h3>
          <p className="text-sm text-sidebar-foreground/60 mb-6 max-w-sm animate-in fade-in duration-500 delay-200">
            Upload your first dataset to get started. Supports CSV, JSON, TXT and Excel formats.
          </p>
          <Button
            onClick={() => setShowUploadUI(true)}
            className="animate-in fade-in-50 duration-500 delay-300 bg-sidebar-primary text-sidebar-primary-foreground"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Your First Dataset
          </Button>
        </div>
      );
    }

    return viewMode === 'grid' ? renderGridView() : renderListView();
  };

  const renderUploadUI = () => (
    <Card className="bg-sidebar text-sidebar-foreground border-sidebar-border 
      transition-all hover:shadow-lg animate-in fade-in-50 duration-700">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Database className="h-6 w-6 text-sidebar-foreground animate-in spin-in-180 duration-500" />
          <CardTitle className="text-sidebar-foreground animate-in slide-in-from-left duration-500">
            Upload Datasets
          </CardTitle>
        </div>
        <CardDescription className="text-sidebar-foreground/60 
          animate-in fade-in-10 duration-150 delay-200">
          Drag and drop your datasets here. Supports CSV, JSON, TXT and Excel formats.
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
              : 'border-sidebar-accent hover:border-sidebar-primary hover:bg-sidebar-accent/50'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <Database className={`
              mx-auto h-12 w-12 transition-all duration-300
              ${isDragActive
                ? 'text-sidebar-primary scale-110'
                : 'text-sidebar-foreground/40'
              }
            `} />
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {isDragActive ? 'Drop your files here' : 'Drag & drop your files here'}
              </p>
              <p className="text-xs text-sidebar-foreground/60">
                or click to select files
              </p>
            </div>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            {files.map((fileObj) => (
              <div
                key={fileObj.id}
                className="bg-sidebar-accent/50 rounded-lg p-4 relative group/file"
              >
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-5 w-5 text-sidebar-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{fileObj.file.name}</p>
                    <p className="text-sm text-sidebar-foreground/60">
                      {(fileObj.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {fileObj.status === 'success' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {fileObj.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                    {fileObj.status === 'uploading' && (
                      <Loader2 className="h-5 w-5 animate-spin text-sidebar-primary" />
                    )}
                  </div>
                </div>

                {(fileObj.status === 'uploading' || fileObj.status === 'pending') && (
                  <Progress
                    value={uploadProgress[fileObj.id] || 0}
                    className="mt-2"
                  />
                )}

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

  return (
    <div className="space-y-6">
      {showUploadUI ? (
        <>
          <Button
            variant="ghost"
            onClick={() => setShowUploadUI(false)}
            className="mb-4 bg-sidebar hover:bg-sidebar-accent border border-sidebar-accent"
          >
            <X className="h-4 w-4 mr-2" />
            Back to Datasets
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
}