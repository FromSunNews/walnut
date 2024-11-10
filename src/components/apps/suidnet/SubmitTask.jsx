import { use, useEffect, useRef, useState } from 'react';
import { CodeJar } from 'codejar';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import { FaPlay, FaCode, FaTerminal } from 'react-icons/fa';
import { useToast } from "../../shared/use-toast";
import { useExecutePython } from '../../../hooks/useExecutePython';
import { useCurrentAccount } from '@mysten/dapp-kit';

export default function SubmitTask() {
  const editorRef = useRef(null);
  const [code, setCode] = useState('# Write your code here\n');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('python');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { executePython, isExecuting } = useExecutePython({
    onSuccess: (data) => {
      setOutput(data.output || 'No output');
    }
  });
  const account = useCurrentAccount();

  useEffect(() => {
    if (editorRef.current) {
      const highlight = editor => {
        const code = editor.textContent;
        editor.innerHTML = Prism.highlight(code, Prism.languages[language], language);
      };

      const jar = CodeJar(editorRef.current, highlight, {
        tab: '  ',
        indentOn: /[\[({]$/,
        catchTab: true,
        preserveIdent: true,
        addClosing: true,
        history: true
      });

      jar.onUpdate(code => setCode(code));

      return () => jar.destroy();
    }
  }, [language]);

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please write some code first",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await executePython(account, code, {
        processor: 0, // CPU
        clusterType: 1,
        rewardAmount: 100
      });

      if (result) {
        toast({
          title: "Success",
          description: "Task submitted successfully",
          variant: "success"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit task",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header với animation */}
        <div className="bg-sidebar/20 backdrop-blur-2xl rounded-xl border border-sidebar-border/50 p-6 shadow-xl animate-slide-down">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-sidebar-primary/20 p-2 rounded-lg animate-pulse-slow">
                <FaCode className="text-xl text-sidebar-primary" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-sidebar-foreground animate-fade-in">
                  Submit Task
                </h1>
                <p className="text-sm text-sidebar-foreground/60 animate-fade-in delay-100">
                  Task #1: Write a function to calculate the factorial of a number
                </p>
              </div>
            </div>
            {/* Submit Button với animation */}
            <div className="flex justify-end animate-slide-left">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="group bg-gradient-to-r from-sidebar-primary to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sidebar-primary/20 hover:shadow-xl hover:shadow-sidebar-primary/30 hover:scale-105"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <FaPlay className="text-xs group-hover:translate-x-1 transition-transform duration-300" />
                      <span>Submit Task</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid với animation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
          {/* Editor Panel */}
          <div className="bg-sidebar/20 backdrop-blur-2xl rounded-xl border border-sidebar-border/50 shadow-xl overflow-hidden group hover:border-sidebar-primary/50 transition-all duration-300 hover:shadow-2xl animate-fade-in">
            <div className="border-b border-sidebar-border/50 px-4 py-3 flex items-center justify-between bg-sidebar/30">
              <div className="flex items-center gap-3">
                <div className="bg-sidebar-primary/20 p-1.5 rounded-lg">
                  <FaCode className="text-sm text-sidebar-primary" />
                </div>
                <span className="text-sidebar-foreground text-sm font-medium">Code Editor</span>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-sidebar/30 border border-sidebar-border/50 rounded-lg px-3 py-1.5 text-sm text-sidebar-foreground focus:outline-none focus:ring-1 focus:ring-sidebar-primary focus:border-transparent transition-all duration-300 hover:bg-sidebar/40"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                </select>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
                </div>
              </div>
            </div>
            <div
              ref={editorRef}
              className="font-mono text-sm p-4 min-h-[500px] max-h-[600px] overflow-auto focus:outline-none transition-all duration-300"
              style={{
                fontFamily: '"Fira Code", monospace',
                whiteSpace: 'pre',
              }}
            />
          </div>

          {/* Output Panel */}
          <div className="bg-sidebar/20 backdrop-blur-2xl rounded-xl border border-sidebar-border/50 shadow-xl overflow-hidden group hover:border-sidebar-primary/50 transition-all duration-300 hover:shadow-2xl animate-fade-in delay-150">
            <div className="border-b border-sidebar-border/50 px-4 py-3 flex items-center justify-between bg-sidebar/30">
              <div className="flex items-center gap-3">
                <div className="bg-sidebar-primary/20 p-1.5 rounded-lg">
                  <FaTerminal className="text-sm text-sidebar-primary" />
                </div>
                <span className="text-sidebar-foreground text-sm font-medium">Console Output</span>
              </div>
              <div className="px-2 py-0.5 rounded-full bg-sidebar/40 text-xs text-sidebar-foreground/60">
                Terminal
              </div>
            </div>
            <pre className="font-mono text-sm p-4 min-h-[500px] max-h-[600px] overflow-auto text-sidebar-foreground">
              {output || 'Output will appear here...'}
            </pre>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .codejar-wrap::-webkit-scrollbar,
        pre::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        /* ... phần style còn lại giữ nguyên ... */

        /* Animation Keyframes */
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-down {
          from { 
            opacity: 0;
            transform: translateY(-20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-left {
          from { 
            opacity: 0;
            transform: translateX(20px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(0.95);
          }
        }

        /* Animation Classes */
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-slide-down {
          animation: slide-down 0.6s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animate-slide-left {
          animation: slide-left 0.6s ease-out forwards;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .delay-150 {
          animation-delay: 0.15s;
        }

        /* Hover Animations */
        .hover\:scale-105:hover {
          transform: scale(1.05);
          transition: transform 0.3s ease;
        }

        /* Transition Improvements */
        .transition-all {
          transition-duration: 300ms;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
}

