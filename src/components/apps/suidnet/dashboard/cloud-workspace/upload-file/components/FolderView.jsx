import { useState } from 'react';
import { Folder, Plus, Search, MoreVertical, ArrowRight, Clock, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

export function FolderView({ folders, type, onFolderSelect, onCreateFolder }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName);
      setNewFolderName('');
      setShowCreateForm(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-sidebar-foreground">
          {type.charAt(0).toUpperCase() + type.slice(1)} Folders
        </h2>
        <Button
          variant="outline"
          className="gap-2 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/80"
          onClick={() => setShowCreateForm(true)}
        >
          <Plus className="w-4 h-4" />
          New Folder
        </Button>
      </div>

      {/* Create Folder Form */}
      {showCreateForm && (
        <div className="bg-sidebar p-6 rounded-lg animate-in slide-in-from-top">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Create New Folder</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCreateForm(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-sidebar-foreground/70 mb-2 block">
                Folder Name
              </label>
              <Input
                type="text"
                placeholder="Enter folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="bg-sidebar-accent border-sidebar-border text-sidebar-foreground"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowCreateForm(false)}
                className="bg-sidebar-accent/60 hover:bg-sidebar-accent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/80"
              >
                Create Folder
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sidebar-foreground/40" />
        <Input
          type="text"
          placeholder="Search folders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-sidebar border-sidebar-border text-sidebar-foreground"
        />
      </div>

      {/* Folders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFolders.map((folder, index) => (
          <div
            key={folder.id}
            onClick={() => onFolderSelect(folder)}
            className="group relative p-6 bg-sidebar border border-sidebar-border rounded-xl
              cursor-pointer hover:bg-sidebar-accent transition-all duration-300
              animate-in slide-in-from-bottom"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sidebar-primary/10 group-hover:bg-sidebar-primary/20
                transition-all duration-300">
                <Folder className="w-6 h-6 text-sidebar-primary 
                  transition-transform duration-300 
                  group-hover:rotate-12" />
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <h3 className="font-medium text-sidebar-foreground truncate">
                  {folder.name}
                </h3>

                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 bg-sidebar-primary/10 text-sidebar-primary 
                    rounded-full font-medium">
                    {folder.files} files
                  </span>
                  <span className="px-2 py-0.5 bg-sidebar-accent/50 text-sidebar-foreground/70 
                    rounded-full">
                    Used {folder.usedSpace}
                  </span>
                </div>

                <div className="text-xs text-sidebar-foreground/60 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Updated {folder.lastUpdated}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle menu actions
                  }}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
                <ArrowRight className="w-5 h-5 text-sidebar-foreground/40
                  transition-transform duration-300
                  group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 