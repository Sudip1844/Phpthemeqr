import { useState, useEffect } from "react";

interface Message {
  title: string;
  subtitle: string;
}

export interface UserAction {
  type: 'first_visit' | 'qr_scanned' | 'multiple_scans' | 'idle' | 'completed' | 'interaction';
  count?: number;
}

export const useScannerMessages = () => {
  const [currentMessage, setCurrentMessage] = useState<Message>({ 
    title: "Ready to scan! Point your camera or upload an image", 
    subtitle: "Let's decode your QR codes instantly 👇" 
  });
  const [lastShownMessageType, setLastShownMessageType] = useState<string>('');
  const [userActions, setUserActions] = useState<UserAction[]>([]);
  const [scanCount, setScanCount] = useState(0);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());

  // Time-based messages (adapted for scanning)
  const getTimeBasedMessage = (): Message => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 8) {
      // Early Morning (5am - 8am)
      const earlyMorningMessages = [
        { title: "🌅 Rise and shine! Ready to scan something exciting?", subtitle: "Early bird catches the best QR codes! ✨" },
        { title: "Good morning, ready to decode your first QR today?", subtitle: "Let's discover something awesome! ☀️" }
      ];
      return earlyMorningMessages[Math.floor(Math.random() * earlyMorningMessages.length)];
    } else if (hour >= 8 && hour < 12) {
      // Late Morning (8am - 12pm)
      const lateMorningMessages = [
        { title: "☀️ Good morning! Got something interesting to scan?", subtitle: "Perfect time to decode something amazing! 🚀" },
        { title: "Rise and shine ☀️ Let's decode something awesome today!", subtitle: "Point your camera or upload below 👇" }
      ];
      return lateMorningMessages[Math.floor(Math.random() * lateMorningMessages.length)];
    } else if (hour >= 12 && hour < 16) {
      // Afternoon (12pm - 4pm)
      const afternoonMessages = [
        { title: "🌤️ Good afternoon! Let's scan something useful together.", subtitle: "Productive time calls for productive scanning! 💪" },
        { title: "Good afternoon! Need to decode a QR from your business?", subtitle: "It's productive time - let's scan quickly!" },
        { title: "It's a productive time of the day, let's scan your QR quickly!", subtitle: "Use camera or upload to get started 👇" }
      ];
      return afternoonMessages[Math.floor(Math.random() * afternoonMessages.length)];
    } else if (hour >= 16 && hour < 20) {
      // Evening (4pm - 8pm)
      const eveningMessages = [
        { title: "🌇 Good evening! A fresh QR code to decode?", subtitle: "End your day with something interesting! ✨" },
        { title: "Good evening! Want to scan one more before you wrap up?", subtitle: "Hope you had a great day! 🌇" },
        { title: "Hope you had a great day! Let's decode your QR in seconds.", subtitle: "Quick and easy scanning awaits 👇" }
      ];
      return eveningMessages[Math.floor(Math.random() * eveningMessages.length)];
    } else if (hour >= 20 && hour < 24) {
      // Night (8pm - 12am)
      const nightMessages = [
        { title: "🌙 Good night! Before you sleep, wanna scan one last QR?", subtitle: "Sweet dreams start with decoded mysteries! 😴" },
        { title: "Good night 🌙 Need a last-minute scan before bed?", subtitle: "We're here for your late night discoveries!" }
      ];
      return nightMessages[Math.floor(Math.random() * nightMessages.length)];
    } else {
      // Late Night (12am - 5am)
      const lateNightMessages = [
        { title: "🌌 Burning the midnight oil? Here's your QR decoder!", subtitle: "Night owls deserve the best scanning tools! 🦉" },
        { title: "Late night hustle? We're here to decode your QR easily.", subtitle: "Quick scanning, even at this hour 🌙" }
      ];
      return lateNightMessages[Math.floor(Math.random() * lateNightMessages.length)];
    }
  };

  // Educational & Tips messages (adapted for scanning)
  const getEducationalMessage = (): Message => {
    const educationalMessages = [
      { title: "Did you know? We can scan 10+ types of QR codes instantly!", subtitle: "WiFi, URLs, contacts, and much more! 🎨" },
      { title: "Tip 💡: You can upload up to 5 images for batch scanning.", subtitle: "Efficiency meets convenience ✨" },
      { title: "Fun fact: Over 2 billion QR codes are scanned every day worldwide 🌍", subtitle: "You're part of a global phenomenon!" },
      { title: "Your camera is ready ✨ Just point and scan!", subtitle: "Lightning-fast detection awaits 🎭" },
      { title: "Want to scan multiple QR codes? Upload multiple images!", subtitle: "Batch processing saves time 📶" },
      { title: "Not sure if it's a QR code? 🤔 Just try scanning it!", subtitle: "Our scanner detects QR codes instantly! 🌐" },
      { title: "Hint 💡: Blurry images work too - we'll do our best!", subtitle: "Advanced algorithms at your service! 📇" },
      { title: "Want to scan from gallery? 📶 Use the upload button.", subtitle: "No need to take new photos! 🔐" },
      { title: "Quick tip: 🎨 Good lighting helps with camera scanning.", subtitle: "Better lighting = faster detection! 🌈" },
      { title: "💡 Tip: Hold your phone steady for best results.", subtitle: "Stable hands make scanning magical! 🎨" },
      { title: "🤖 Fun fact: QR stands for Quick Response.", subtitle: "And we respond lightning fast! 🧠" }
    ];
    return educationalMessages[Math.floor(Math.random() * educationalMessages.length)];
  };

  // Motivational & Challenge messages (adapted for scanning)
  const getMotivationalMessage = (): Message => {
    const motivationalMessages = [
      { title: "Quick challenge ⚡: Can you scan 3 different QRs in under a minute?", subtitle: "Test your scanning speed! 🏃‍♂️" },
      { title: "Pro users always scan at least 2 QRs a day 😉.", subtitle: "Are you ready to join the pro league? 🏆" },
      { title: "Level up 🏆 Scan your 2nd QR today.", subtitle: "Each scan makes you stronger! 💪" },
      { title: "Daily streak 🔥 Keep scanning!", subtitle: "Consistency is the key to QR mastery! 📈" },
      { title: "Champion mode 🥇 Only pros scan 5 QRs a day.", subtitle: "Are you ready for the ultimate challenge? 🏅" },
      { title: "Speed test ⏳ Can you scan in under 3 seconds?", subtitle: "Lightning-fast scanning skills! ⚡" },
      { title: "🎯 Challenge: Scan 3 different QR codes today!", subtitle: "Can you complete the triple scan mission? 🏃‍♂️" },
      { title: "🏆 Achievement unlocked: First scan of the day.", subtitle: "You're officially a scanning champion today! 🥇" },
      { title: "Secret unlocked 🔑 Try uploading multiple images now.", subtitle: "Hidden features for the curious minds! 🗝️" }
    ];
    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  };

  // Fun & Casual messages (adapted for scanning)
  const getFunMessage = (): Message => {
    const funMessages = [
      { title: "Hello friend! 👋 Ready to decode QR magic?", subtitle: "Let's discover something amazing together! ✨" },
      { title: "Welcome back 🚪 The scanning world missed you.", subtitle: "Your curiosity makes this place special! 💫" },
      { title: "Hi there, detective ⭐ let's decode mysteries!", subtitle: "Every detective needs a super scanner! 🌟" },
      { title: "Knock knock 🚪 It's scanning time again!", subtitle: "Who's there? Your next amazing discovery! 😄" },
      { title: "We were waiting for you 😍 Let's start scanning!", subtitle: "The decoding party can finally begin! 🎉" },
      { title: "Boom 💥 Your scanner is loading…", subtitle: "Get ready for some spectacular discoveries! ⚡" },
      { title: "Shhh 🤫 This QR holds secrets… let's decode it.", subtitle: "Special mysteries waiting to be unlocked! 🎁" },
      { title: "Tick tock ⏰ The scanning clock is running!", subtitle: "Time flies when you're decoding fun! ⏳" },
      { title: "Oops 😅 Got another QR to scan?", subtitle: "No worries, there's always something new to discover! 🔍" },
      { title: "Hurry! ⚡ Another scanning adventure awaits.", subtitle: "The QR universe is full of mysteries! 🚀" },
      { title: "👋 Hey user, nice to see you again!", subtitle: "Ready for another round of QR magic? ✨" },
      { title: "✨ Your scanning journey starts here.", subtitle: "Every great discovery begins with a single scan!" },
      { title: "⚡ Quick and easy—point your camera now.", subtitle: "Speed and accuracy, that's our promise! 🚀" },
      { title: "🧐 Can't decide? Try uploading an image!", subtitle: "Sometimes the best discoveries are unexpected!" },
      { title: "🔄 Wanna scan another one? It only takes a sec.", subtitle: "You're on a roll - keep the momentum going!" },
      { title: "📱 Scan it, decode it, share it—your choice!", subtitle: "The power is in your hands! 💪" },
      { title: "🚀 You're on fire! Keep scanning QRs.", subtitle: "Hot streak activated - don't stop now! 🔥" },
      { title: "🎨 Got multiple QRs? Upload them all at once.", subtitle: "Batch scanning makes everything easier! 🌈" }
    ];
    return funMessages[Math.floor(Math.random() * funMessages.length)];
  };

  // Success & Completion messages (for after scanning)
  const getSuccessMessage = (): Message => {
    const successMessages = [
      { title: "🎉 Success! Your QR has been decoded!", subtitle: "Look at that perfect scan result! 🌟" },
      { title: "😎 You're a scanning pro already!", subtitle: "Look at you mastering the scanning game! 🏆" },
      { title: "Wow 🤩 That was a clean scan.", subtitle: "You've got excellent scanning skills! 👌" },
      { title: "✅ Perfect! QR decoded successfully.", subtitle: "Lightning-fast results in seconds! ⚡" },
      { title: "🎯 Bullseye! Another successful scan.", subtitle: "You're getting better at this! 🏹" }
    ];
    return successMessages[Math.floor(Math.random() * successMessages.length)];
  };

  // Goodbye messages (same as generator but adapted context)
  const getGoodbyeMessage = (): Message => {
    const goodbyeMessages = [
      { title: "🥳 Thanks for visiting! Come back anytime.", subtitle: "Our QR scanner misses you already! 💝" },
      { title: "All done? ✅ Don't forget to save your results!", subtitle: "Your decoded data deserves to be saved! 🌟" },
      { title: "That's it for now 🚀 Come back soon.", subtitle: "We'll be here whenever you need us! 💫" },
      { title: "Mission complete 🎯 Your QR is decoded.", subtitle: "Detective, your mission was a success! 🕵️‍♂️" },
      { title: "Bye-bye 👋 See you next time.", subtitle: "Until we meet again, QR decoder! 👋" },
      { title: "Good luck 🌟 Till we meet again!", subtitle: "May your scans bring you joy and discoveries! 🍀" },
      { title: "Remember: Knowledge is power 💌", subtitle: "Share your decoded insights with the world! 🌍" },
      { title: "Looks like you're done 🎉 Please come again soon!", subtitle: "Thanks for using our QR Scanner 😊" },
      { title: "Have a nice day & thanks for using our QR Scanner 😊", subtitle: "Your discoveries are ready to explore! 🚀" }
    ];
    return goodbyeMessages[Math.floor(Math.random() * goodbyeMessages.length)];
  };

  // User interaction-based messages
  const getInteractionMessage = (action: UserAction): Message => {
    switch (action.type) {
      case 'first_visit':
        return { 
          title: "👋 Welcome! Ready to scan your first QR code?", 
          subtitle: "Use camera or upload an image below 👇" 
        };
      
      case 'qr_scanned':
        return getSuccessMessage();
      
      case 'multiple_scans':
        const multiMessages = [
          { title: "Wow, you're on fire 🔥 Keep scanning more!", subtitle: "You're becoming a scanning master! 🎯" },
          { title: "Multiple scans? You're a power user 😎", subtitle: "Professional level unlocked! 🏆" }
        ];
        return multiMessages[Math.floor(Math.random() * multiMessages.length)];
      
      case 'idle':
        const idleMessages = [
          { title: "Still there? 👀 Let's scan a QR in just one click.", subtitle: "Don't be shy - try it now! 😉" },
          { title: "Don't be shy 😉 Try scanning a QR now!", subtitle: "It's easier than you think! ⚡" }
        ];
        return idleMessages[Math.floor(Math.random() * idleMessages.length)];
      
      case 'completed':
        return getGoodbyeMessage();
      
      default:
        return getTimeBasedMessage();
    }
  };

  // Update message based on user action
  const updateMessage = (action: UserAction) => {
    setUserActions(prev => [...prev, action]);
    setLastInteractionTime(Date.now());
    
    if (action.type === 'qr_scanned') {
      const newCount = scanCount + 1;
      setScanCount(newCount);
      
      if (newCount === 1) {
        setCurrentMessage(getInteractionMessage({ type: 'qr_scanned' }));
      } else if (newCount >= 3) {
        setCurrentMessage(getInteractionMessage({ type: 'multiple_scans' }));
      }
    } else {
      setCurrentMessage(getInteractionMessage(action));
    }
  };

  // Auto-rotate messages (same timing as generator)
  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceLastInteraction = Date.now() - lastInteractionTime;
      
      // If user has been idle for 10 seconds and we haven't shown idle message
      if (timeSinceLastInteraction >= 10000 && lastShownMessageType !== 'idle') {
        setCurrentMessage(getInteractionMessage({ type: 'idle' }));
        setLastShownMessageType('idle');
      }
      // Show different types of messages based on time since last interaction
      else if (timeSinceLastInteraction >= 15000 && timeSinceLastInteraction < 25000) {
        const messageType = Math.random();
        if (messageType < 0.4) {
          setCurrentMessage(getFunMessage());
          setLastShownMessageType('fun');
        } else if (messageType < 0.7) {
          setCurrentMessage(getEducationalMessage());
          setLastShownMessageType('educational');
        } else {
          setCurrentMessage(getTimeBasedMessage());
          setLastShownMessageType('time');
        }
      }
      // More engaging messages after 25 seconds
      else if (timeSinceLastInteraction >= 25000) {
        const messageType = Math.random();
        if (messageType < 0.5) {
          setCurrentMessage(getMotivationalMessage());
          setLastShownMessageType('motivational');
        } else {
          setCurrentMessage(getFunMessage());
          setLastShownMessageType('fun');
        }
        setLastInteractionTime(Date.now()); // Reset timer
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [lastInteractionTime, lastShownMessageType]);

  // Listen for scanning events
  useEffect(() => {
    const handleQRScanned = (event: Event) => {
      updateMessage({ type: 'qr_scanned' });
    };

    const handleScanCompleted = (event: Event) => {
      updateMessage({ type: 'completed' });
    };

    const handleInteraction = () => {
      setLastInteractionTime(Date.now());
      setLastShownMessageType(''); // Reset idle state on interaction
    };

    // Listen for QR scanning and completion
    window.addEventListener('qrCodeScanned', handleQRScanned);
    window.addEventListener('qrScanCompleted', handleScanCompleted);
    
    // Listen for user interactions
    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('scroll', handleInteraction);

    return () => {
      window.removeEventListener('qrCodeScanned', handleQRScanned);
      window.removeEventListener('qrScanCompleted', handleScanCompleted);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
    };
  }, []);

  // Initialize with first-visit detection and time-based message
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedQRScanner');
    
    if (!hasVisited) {
      // First visit - show first visit message, then mark as visited
      updateMessage({ type: 'first_visit' });
      localStorage.setItem('hasVisitedQRScanner', 'true');
      
      // After 5 seconds, switch to time-based message
      const timer = setTimeout(() => {
        setCurrentMessage(getTimeBasedMessage());
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      // Returning user - show time-based message after 3 seconds
      const timer = setTimeout(() => {
        setCurrentMessage(getTimeBasedMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  return { currentMessage, updateMessage, scanCount };
};

const ScannerMessages = () => {
  const { currentMessage } = useScannerMessages();
  
  return (
    <div className="text-center">
      <h2 className="text-white text-lg md:text-xl font-semibold mb-2" id="dynamic-message">
        {currentMessage.title}
      </h2>
      <p className="text-purple-300 text-sm md:text-base opacity-90" id="dynamic-subtitle">
        {currentMessage.subtitle}
      </p>
    </div>
  );
};

export default ScannerMessages;