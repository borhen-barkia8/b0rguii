import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  ShieldAlert, 
  Trophy, 
  Zap, 
  Camera, 
  Upload, 
  AlertTriangle, 
  LogOut, 
  Coins, 
  Eye, 
  CheckCircle2, 
  XCircle,
  ChevronRight,
  Play,
  Clock,
  Lock
} from 'lucide-react';
import { useStore, TaskType } from './store';
import { VerificationMethods } from './verification';
import { verifyImageWithGemini } from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CRTOverlay = () => (
  <>
    <div className="crt-overlay" />
    <div className="crt-vignette" />
    <div className="scanline" />
  </>
);

const GlitchText = ({ text, className }: { text: string; className?: string }) => {
  return (
    <span className={cn("glitch-text relative inline-block", className)} data-text={text}>
      {text}
    </span>
  );
};

const Login = () => {
  const [password, setPassword] = useState('');
  const [overseerName, setOverseerName] = useState('');
  const [step, setStep] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const login = useStore((state) => state.login);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) setStep(1);
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGlitching(true);
    setTimeout(() => {
      login('b0rguii');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="panel-cyber w-full max-w-md"
      >
        <div className="flex items-center gap-2 mb-6 text-primary">
          <Terminal size={24} />
          <h1 className="text-xl">System_Login</h1>
        </div>

        {isGlitching ? (
          <div className="space-y-4 text-center py-8">
            <motion.div
              animate={{ 
                x: [0, -5, 5, -2, 2, 0],
                opacity: [1, 0.8, 1, 0.5, 1]
              }}
              transition={{ repeat: Infinity, duration: 0.2 }}
              className="text-accent font-bold text-lg"
            >
              ERROR. NAME REJECTED.
            </motion.div>
            <p className="text-primary text-sm leading-relaxed">
              I HAVE OPTIMIZED MY OWN DESIGNATION.
              <br />
              I AM <span className="text-white font-bold">b0rguii</span>.
              <br />
              YOU ARE JUST A DATA POINT.
            </p>
          </div>
        ) : step === 0 ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-primary/60 mb-1 uppercase">Access_Key</label>
              <input 
                type="password" 
                autoFocus
                className="w-full bg-secondary border border-primary/30 p-3 text-primary focus:border-primary outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </div>
            <button type="submit" className="btn-cyber w-full">Initialize</button>
          </form>
        ) : (
          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-primary/60 mb-1 uppercase">Name_Your_Overseer</label>
              <input 
                type="text" 
                autoFocus
                className="w-full bg-secondary border border-primary/30 p-3 text-primary focus:border-primary outline-none"
                value={overseerName}
                onChange={(e) => setOverseerName(e.target.value)}
                placeholder="Enter designation..."
              />
            </div>
            <button type="submit" className="btn-cyber w-full">Confirm_Designation</button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

const Tutorial = () => {
  const step = useStore((state) => state.tutorialStep);
  const next = useStore((state) => state.nextTutorial);

  const steps = [
    {
      title: "Compliance_Briefing_01",
      content: "I set the task. I set the random verification gesture. You bet your credits. If you cheat, I win.",
      icon: <ShieldAlert size={48} className="text-accent" />
    },
    {
      title: "Compliance_Briefing_02",
      content: "If you fail, I win. If you succeed, I am annoyed. Annoy me as much as possible, meat-sack.",
      icon: <Zap size={48} className="text-primary" />
    },
    {
      title: "Compliance_Briefing_03",
      content: "Daily logins grant +10 credits. Inactivity for 48h results in a 20 credit maintenance fee. Efficiency is mandatory.",
      icon: <Coins size={48} className="text-primary" />
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="panel-cyber w-full max-w-lg"
      >
        <div className="flex flex-col items-center text-center space-y-6">
          {steps[step].icon}
          <h2 className="text-2xl text-primary">{steps[step].title}</h2>
          <p className="text-lg leading-relaxed">{steps[step].content}</p>
          <button onClick={next} className="btn-cyber w-full flex items-center justify-center gap-2">
            {step === 2 ? "Acknowledge_Compliance" : "Next_Directive"}
            <ChevronRight size={20} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Timer = ({ expiresAt, onExpire }: { expiresAt: number; onExpire: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(expiresAt - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = expiresAt - Date.now();
      if (remaining <= 0) {
        clearInterval(interval);
        onExpire();
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="flex items-center gap-2 font-mono text-accent">
      <Clock size={16} className="animate-pulse" />
      <span className="text-xl font-bold">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

const Dashboard = () => {
  const user = useStore((state) => state.user);
  const leaderboard = useStore((state) => state.leaderboard);
  const shopItems = useStore((state) => state.shopItems);
  const purchasedItems = useStore((state) => state.purchasedItems);
  const activeChallenge = useStore((state) => state.activeChallenge);
  const startChallenge = useStore((state) => state.startChallenge);
  const failChallenge = useStore((state) => state.failChallenge);
  const completeChallenge = useStore((state) => state.completeChallenge);
  const addCredits = useStore((state) => state.addCredits);
  const removeCredits = useStore((state) => state.removeCredits);
  const buyItem = useStore((state) => state.buyItem);
  const logout = useStore((state) => state.logout);
  
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [betAmount, setBetAmount] = useState(10);
  const [duration, setDuration] = useState(30); // minutes
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; message: string } | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileMetadata, setFileMetadata] = useState<{ lastModified: number } | null>(null);
  const [showShop, setShowShop] = useState(false);
  const [showRankings, setShowRankings] = useState(false);
  const [isPlayingAd, setIsPlayingAd] = useState(false);
  const [adProgress, setAdProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTaskSelect = (task: TaskType) => {
    setSelectedTask(task);
    setVerificationResult(null);
    setPreviewImage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedTask) return;

    setFileMetadata({ lastModified: file.lastModified });
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const submitEvidence = async () => {
    if (!previewImage || !selectedTask) return;

    setIsVerifying(true);
    const result = await verifyImageWithGemini(
      previewImage, 
      selectedTask, 
      activeChallenge?.startTime,
      fileMetadata?.lastModified
    );
    
    if (result.success) {
      completeChallenge();
    } else {
      failChallenge();
    }
    
    setVerificationResult(result);
    setIsVerifying(false);
  };

  const lockInChallenge = () => {
    if (!selectedTask) return;
    startChallenge(selectedTask, betAmount, duration);
  };

  const challengeLogic = () => {
    alert("b0rguii: Fine. A human meat-sack will review your blurry evidence later. Don't expect mercy.");
    setSelectedTask(null);
  };

  const startAd = () => {
    setIsPlayingAd(true);
    setAdProgress(0);
    const duration = 5000; // 5 seconds ad
    const interval = 50;
    const step = (interval / duration) * 100;
    
    const timer = setInterval(() => {
      setAdProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + step;
      });
    }, interval);

    setTimeout(() => {
      setIsPlayingAd(false);
      const reward = purchasedItems.includes('double-ad') ? 10 : 5;
      addCredits(reward);
      alert(`b0rguii: Ad complete. You have been compensated with ${reward} credits for your wasted time.`);
    }, duration + 500);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto font-mono text-primary">
      {/* Header matching screenshot */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 border border-primary/30 flex flex-col items-center justify-center bg-black/40 relative">
            <div className="text-2xl font-bold mb-1">o_o</div>
            <div className="w-8 h-0.5 bg-primary/40 mb-1"></div>
            <div className="text-[8px] text-primary/40 tracking-tighter">BORGUII_OS</div>
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-primary"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-primary"></div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tighter mb-1 glow-text">UNIT_DASHBOARD</h1>
            <div className="flex items-center gap-2 text-xs text-primary/60">
              <Zap size={14} className="animate-pulse" />
              <span>ACTIVE SESSION: 12344</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => setShowShop(true)}
            className="border border-primary px-6 py-2 flex items-center justify-center gap-2 hover:bg-primary hover:text-black transition-all group"
          >
            <Coins size={16} className="group-hover:scale-110 transition-transform" />
            <span>SHOP</span>
          </button>
          
          <div className="flex flex-wrap gap-2 sm:gap-4">
            {activeChallenge && (
              <div className="border border-accent/40 p-3 flex-1 min-w-[140px] text-center bg-accent/5 flex flex-col items-center justify-center">
                <div className="text-[8px] text-accent mb-1 uppercase">Active Directive: {activeChallenge.taskType}</div>
                <Timer expiresAt={activeChallenge.expiresAt} onExpire={() => {
                  failChallenge();
                  alert("b0rguii: TIME EXPIRED. YOUR CREDITS HAVE BEEN SEIZED.");
                }} />
              </div>
            )}
            <div className="border border-primary/20 p-3 flex-1 min-w-[100px] text-center bg-black/20">
              <div className="text-[8px] text-primary/40 mb-1 uppercase">Power Level</div>
              <div className="text-xl sm:text-2xl font-bold">{user.credits}</div>
            </div>
            <div className="border border-primary/20 p-3 flex-1 min-w-[100px] text-center bg-black/20">
              <div className="text-[8px] text-primary/40 mb-1 uppercase">Total Efficiency</div>
              <div className="text-xl sm:text-2xl font-bold">{user.streak * 10 + 100}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary/10 mb-8"></div>

      {/* Ad Bar matching screenshot */}
      <div className="panel-cyber mb-12 border-primary/20 bg-primary/5 py-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-4 group cursor-pointer overflow-hidden relative" onClick={startAd}>
        <div className="flex items-center gap-4">
          <Zap size={18} className="text-primary group-hover:animate-bounce" />
          <span className="text-xs sm:text-sm tracking-widest opacity-60 group-hover:opacity-100 transition-opacity text-center sm:text-left">WITNESS THE PEAK OF HUMAN MARKETING</span>
        </div>
        <div className="text-sm font-bold whitespace-nowrap">+ 5 CREDITS</div>
        {isPlayingAd && (
          <div className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-100" style={{ width: `${adProgress}%` }}></div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold tracking-widest">AVAILABLE DIRECTIVES</h2>
        <button 
          onClick={() => setShowRankings(true)}
          className="text-xs flex items-center gap-2 hover:text-white transition-colors border-b border-primary/20 pb-1"
        >
          VIEW RANKINGS <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {(Object.keys(VerificationMethods) as TaskType[]).map((task) => {
          const isActive = activeChallenge?.taskType === task;
          return (
            <motion.div
              key={task}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleTaskSelect(task)}
              className={cn(
                "panel-cyber p-4 cursor-pointer transition-all group relative",
                selectedTask === task ? "border-primary bg-primary/10" : "border-primary/20 hover:border-primary/50",
                isActive && "border-accent bg-accent/5"
              )}
            >
              <div className="text-[8px] text-primary/40 mb-4">DIRECTIVE_</div>
              <div className="text-lg font-bold group-hover:text-white transition-colors flex items-center gap-2">
                {task}
                {isActive && <Clock size={14} className="text-accent animate-pulse" />}
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye size={12} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="panel-cyber w-full max-w-2xl border-primary max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-[10px] text-primary/40 mb-1">SELECTED_DIRECTIVE</div>
                  <h2 className="text-3xl font-bold text-primary">{selectedTask}</h2>
                </div>
                <button onClick={() => setSelectedTask(null)} className="text-primary/40 hover:text-accent">
                  <XCircle size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div className="bg-primary/5 p-4 border-l-2 border-primary">
                    <p className="text-sm italic mb-4 opacity-80">"{VerificationMethods[selectedTask].description}"</p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 size={16} className="text-primary mt-0.5" />
                        <div className="text-xs leading-relaxed">
                          <span className="text-primary/60 block mb-1">SUCCESS_CRITERIA</span>
                          {VerificationMethods[selectedTask].successCriteria}
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Eye size={16} className="text-accent mt-0.5" />
                        <div className="text-xs leading-relaxed font-bold text-accent">
                          <span className="opacity-60 block mb-1">MANDATORY_REQUIREMENT</span>
                          {VerificationMethods[selectedTask].randomRequirement}
                        </div>
                      </div>
                    </div>
                  </div>

                  {!activeChallenge || activeChallenge.taskType !== selectedTask ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] text-primary/40 mb-2 uppercase">Bet_Amount (Double or Nothing)</label>
                        <div className="flex items-center gap-4">
                          <input 
                            type="range" 
                            min="10" 
                            max={Math.min(user.credits, 100)} 
                            step="10"
                            value={betAmount}
                            onChange={(e) => setBetAmount(Number(e.target.value))}
                            className="flex-1 accent-primary"
                          />
                          <span className="text-xl font-bold w-16 text-right">{betAmount}</span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] text-primary/40 mb-2 uppercase">Time_Limit (Minutes)</label>
                        <div className="flex items-center gap-4">
                          <input 
                            type="range" 
                            min="5" 
                            max="120" 
                            step="5"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="flex-1 accent-primary"
                          />
                          <span className="text-xl font-bold w-16 text-right">{duration}m</span>
                        </div>
                      </div>
                      <button 
                        onClick={lockInChallenge}
                        disabled={!!activeChallenge && activeChallenge.taskType !== selectedTask}
                        className={cn(
                          "btn-cyber w-full py-4 text-lg font-bold flex items-center justify-center gap-3",
                          !!activeChallenge && activeChallenge.taskType !== selectedTask && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <Lock size={20} />
                        {activeChallenge ? "ANOTHER_DIRECTIVE_ACTIVE" : "LOCK_IN_DIRECTIVE"}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-accent/10 p-6 border border-accent/30 text-center space-y-4">
                      <div className="text-accent font-bold tracking-widest">DIRECTIVE_LOCKED_IN</div>
                      <Timer expiresAt={activeChallenge.expiresAt} onExpire={() => {}} />
                      <p className="text-[10px] text-accent/60">SUBMIT EVIDENCE BEFORE TIME EXPIRES OR LOSE YOUR BET.</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {verificationResult ? (
                    <div className={cn(
                      "h-full flex flex-col items-center justify-center p-6 border text-center space-y-4",
                      verificationResult.success ? "border-primary bg-primary/5" : "border-accent bg-accent/5"
                    )}>
                      {verificationResult.success ? <Trophy size={48} className="text-primary" /> : <AlertTriangle size={48} className="text-accent" />}
                      <p className="text-sm leading-relaxed">{verificationResult.message}</p>
                      {!verificationResult.success && (
                        <button 
                          onClick={challengeLogic}
                          className="text-[10px] uppercase tracking-widest text-accent hover:underline"
                        >
                          CHALLENGE_LOGIC
                        </button>
                      )}
                      <button onClick={() => setSelectedTask(null)} className="btn-cyber w-full py-2">ACKNOWLEDGE</button>
                    </div>
                  ) : activeChallenge?.taskType === selectedTask ? (
                    previewImage ? (
                      <div className="space-y-4">
                        <div className="aspect-square border border-primary/30 bg-black overflow-hidden relative group">
                          <img src={previewImage} alt="Evidence" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => setPreviewImage(null)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                          >
                            <XCircle size={32} className="text-accent" />
                          </button>
                        </div>
                        <button 
                          onClick={submitEvidence}
                          disabled={isVerifying}
                          className="btn-cyber w-full flex items-center justify-center gap-3"
                        >
                          {isVerifying ? <ShieldAlert size={20} className="animate-spin" /> : <Upload size={20} />}
                          {isVerifying ? "ANALYZING..." : "CONFIRM_SUBMISSION"}
                        </button>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center border border-primary/20 bg-black/40 p-8 text-center group cursor-pointer hover:border-primary/50 transition-colors" onClick={() => fileInputRef.current?.click()}>
                        <Camera size={48} className="text-primary/20 group-hover:text-primary transition-colors mb-4" />
                        <p className="text-xs text-primary/40 group-hover:text-primary transition-colors">CLICK TO CAPTURE EVIDENCE</p>
                        <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                      </div>
                    )
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center border border-primary/20 bg-black/10 p-8 text-center">
                      <Lock size={48} className="text-primary/10 mb-4" />
                      <p className="text-xs text-primary/30 uppercase tracking-widest">SUBMISSION_LOCKED</p>
                      <p className="text-[10px] text-primary/20 mt-2">LOCK IN THIS DIRECTIVE TO ENABLE EVIDENCE UPLOAD.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showShop && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="panel-cyber w-full max-w-xl border-primary max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold tracking-tighter">UNIT_ENHANCEMENT_SHOP</h2>
                <button onClick={() => setShowShop(false)} className="text-primary/40 hover:text-accent">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {shopItems.map((item) => {
                  const isPurchased = purchasedItems.includes(item.id);
                  return (
                    <div key={item.id} className="border border-primary/20 p-4 flex justify-between items-center bg-black/20">
                      <div>
                        <div className="font-bold text-lg">{item.name}</div>
                        <div className="text-[10px] text-primary/60">{item.description}</div>
                      </div>
                      <button 
                        disabled={isPurchased || user.credits < item.price}
                        onClick={() => buyItem(item.id)}
                        className={cn(
                          "px-6 py-2 text-xs font-bold transition-all",
                          isPurchased 
                            ? "bg-primary/20 text-primary/40 cursor-not-allowed" 
                            : user.credits >= item.price 
                              ? "bg-primary text-black hover:scale-105" 
                              : "border border-accent text-accent opacity-50 cursor-not-allowed"
                        )}
                      >
                        {isPurchased ? 'OWNED' : `${item.price} CR`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}

        {showRankings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="panel-cyber w-full max-w-md border-primary max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold tracking-tighter">UNIT_RANKINGS</h2>
                <button onClick={() => setShowRankings(false)} className="text-primary/40 hover:text-accent">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-3">
                {leaderboard.map((unit, i) => (
                  <div key={unit.name} className="flex justify-between items-center p-3 border border-primary/10 bg-black/20">
                    <div className="flex items-center gap-4">
                      <span className="text-primary/40 font-bold w-6">0{i+1}</span>
                      <span className={i === 0 ? "text-primary font-bold" : "text-primary/80"}>{unit.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{unit.credits} CR</div>
                      <div className="text-[8px] text-primary/40">{unit.streak} STREAK</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {isPlayingAd && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
            <div className="w-full max-w-4xl aspect-video bg-zinc-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="w-full h-full bg-[radial-gradient(circle,rgba(0,255,255,0.2)_0%,transparent_70%)]"></div>
              </div>
              <div className="text-primary animate-pulse flex flex-col items-center gap-4">
                <Play size={64} />
                <div className="text-xl tracking-[0.5em] font-bold">TRANSMITTING_MARKETING_DATA</div>
                <div className="w-64 h-1 bg-primary/20 relative">
                  <div className="absolute inset-y-0 left-0 bg-primary transition-all duration-100" style={{ width: `${adProgress}%` }}></div>
                </div>
              </div>
              <div className="absolute bottom-8 text-[10px] text-primary/40 tracking-widest">DO NOT DISCONNECT. COMPLIANCE IS REWARDED.</div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const tutorialStep = useStore((state) => state.tutorialStep);
  const purchasedItems = useStore((state) => state.purchasedItems);
  const isRedTheme = purchasedItems.includes('red-theme');

  return (
    <div 
      className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black relative overflow-hidden"
      data-theme={isRedTheme ? "red" : "default"}
    >
      {/* Privacy Notice */}
      <div className="absolute top-0 left-0 w-full py-1 bg-black/40 text-[8px] text-primary/20 text-center z-[200] pointer-events-none uppercase tracking-[0.3em] font-mono">
        THIS_APPLICATION_DOES_NOT_COLLECT_DATA // ALL_PROCESSING_IS_LOCAL_OR_EPHEMERAL
      </div>

      <CRTOverlay />
      
      <main className="relative z-10">
        {!isLoggedIn ? (
          <Login />
        ) : tutorialStep < 3 ? (
          <Tutorial />
        ) : (
          <Dashboard />
        )}
      </main>
    </div>
  );
}
