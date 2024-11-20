import { useState } from 'react';
import { ArrowLeft, Upload, Image, Database, ArrowRight, Brain, Folder } from 'lucide-react';
import { UploadModel } from './components/UploadModel';
import { UploadImage } from './components/UploadImage';
import { UploadData } from './components/UploadData';
import { Button } from '../../components/ui/button';
import { FolderView } from './components/FolderView'; import { ButtonWithAnimation } from '../../components/ui/button-with-animation';
;

// Component chính
export default function UploadFile() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folders, setFolders] = useState({
    model: [
      {
        id: 'model-1',
        name: 'Training Models',
        files: 5,
        lastUpdated: '2 days ago',
        usedSpace: '1.2 MB',
      }
    ],
    image: [
      {
        id: 'img-1',
        name: 'Dataset Images',
        files: 120,
        lastUpdated: '1 hour ago',
        usedSpace: '3.8 MB',
      }
    ],
    data: [
      {
        id: 'data-1',
        name: 'Raw Datasets',
        files: 8,
        lastUpdated: '3 days ago',
        usedSpace: '2.5 MB',
      }
    ]
  });

  const cards = [
    {
      id: 'model',
      title: 'Upload Model',
      description: 'Upload your model to Walrus for distributed training and inference',
      component: <UploadModel />,
      icon: <Brain className="w-8 h-8" />,
      bgColor: 'bg-white-5',
      borderColor: 'border-white-7',
      accentColor: 'bg-chart-1'
    },
    {
      id: 'image',
      title: 'Upload Image',
      description: 'Process and analyze images with our advanced computer vision models',
      component: <UploadImage />,
      icon: <Image className="w-8 h-8" />,
      bgColor: 'bg-white-5',
      borderColor: 'border-white-7',
      accentColor: 'bg-chart-2'
    },
    {
      id: 'data',
      title: 'Upload Data',
      description: 'Upload and preprocess your datasets for training',
      component: <UploadData />,
      icon: <Database className="w-8 h-8" />,
      bgColor: 'bg-white-5',
      borderColor: 'border-white-7',
      accentColor: 'bg-chart-3'
    }
  ];

  const handleCreateFolder = (name) => {
    const newFolder = {
      id: `${selectedCard}-${Date.now()}`,
      name: name,
      files: 0,
      lastUpdated: 'Just now',
      usedSpace: '0 MB',
    };

    setFolders(prev => ({
      ...prev,
      [selectedCard]: [...prev[selectedCard], newFolder]
    }));
  };

  const renderContent = () => {
    if (selectedFolder) {
      // Render component hiển thị files trong folder
      return (
        <>
          <ButtonWithAnimation
            icon={ArrowLeft}
            title="Back"
            direction="left"
            onClick={() => setSelectedFolder(null)}
            className="mb-4"
          />
          {selectedCard === 'model' && <UploadModel folder={selectedFolder} />}
          {selectedCard === 'image' && <UploadImage folder={selectedFolder} />}
          {selectedCard === 'data' && <UploadData folder={selectedFolder} />}
        </>
      );
    }

    if (selectedCard) {
      return (
        <>
          <ButtonWithAnimation
            icon={ArrowLeft}
            title="Back"
            direction="left"
            onClick={() => setSelectedCard(null)}
            className={"mb-4"}
          />
          <FolderView
            folders={folders[selectedCard]}
            type={selectedCard}
            onFolderSelect={setSelectedFolder}
            onCreateFolder={handleCreateFolder}
          />
        </>
      );
    }

    // Render danh sách cards ban đầu
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`
              ${card.bgColor}
              border ${card.borderColor}
              rounded-xl p-6
              cursor-pointer
              transition-all duration-500
              transform hover:scale-[1.02]
              hover:bg-white-7
              flex flex-col
              relative
              overflow-hidden
              text-sidebar-foreground
              backdrop-blur-sm
              animate-in slide-in-from-bottom duration-700
              hover:shadow-lg hover:shadow-sidebar-primary/5
              group
            `}
            style={{ animationDelay: `${index * 200}ms` }}
            onClick={() => setSelectedCard(card.id)}
          >
            {/* Icon và Title */}
            <div className="flex items-center gap-4 mb-4">
              <div className={`
                p-2 rounded-lg ${card.accentColor} bg-opacity-10
                transition-all duration-300
                group-hover:scale-110 group-hover:rotate-12
                animate-in zoom-in-50 duration-500
              `}>
                {card.icon}
              </div>
              <h3 className="text-lg font-semibold
                animate-in slide-in-from-right duration-500"
                style={{ animationDelay: `${index * 200 + 100}ms` }}
              >
                {card.title}
              </h3>
            </div>

            {/* Description */}
            <p className="text-sm text-sidebar-foreground/70 mb-4 flex-grow
              animate-in fade-in duration-700"
              style={{ animationDelay: `${index * 200 + 200}ms` }}
            >
              {card.description}
            </p>

            {/* Action button */}
            <div className="flex items-center text-sm font-medium text-sidebar-primary 
              group/button
              animate-in slide-in-from-left duration-500"
              style={{ animationDelay: `${index * 200 + 300}ms` }}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 
                transition-all duration-300 
                group-hover/button:translate-x-1
                group-hover/button:scale-110"
              />
            </div>

            {/* Decorative elements */}
            <div className={`
              absolute -right-8 -bottom-8 w-24 h-24 rounded-full 
              ${card.accentColor} opacity-5
              transition-all duration-500
              group-hover:scale-150 group-hover:opacity-10
              animate-in spin-in-90 duration-700
            `}
              style={{ animationDelay: `${index * 200 + 400}ms` }}
            />

            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 
              pointer-events-none
              transition-opacity duration-500
              group-hover:opacity-50"
            />

            {/* Shine effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100
              transition-opacity duration-1000 pointer-events-none
              bg-gradient-to-r from-transparent via-white/5 to-transparent
              translate-x-[-100%] group-hover:translate-x-[100%]
              transition-transform duration-1000"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="animate-in slide-in-from-left duration-500">
      {renderContent()}
    </div>
  );
}

