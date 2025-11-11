import { useState, useEffect } from "react";

interface Message {
  title: string;
  subtitle: string;
}

export interface UserAction {
  type: 'first_visit' | 'qr_created' | 'multiple_qrs' | 'idle' | 'completed' | 'interaction';
  count?: number;
}

export const useDynamicMessages = () => {
  const [currentMessage, setCurrentMessage] = useState<Message>({ 
    title: "Welcome! Which type of QR code would you like to generate?", 
    subtitle: "Start by choosing your QR type below 👇" 
  });
  const [lastShownMessageType, setLastShownMessageType] = useState<string>('');
  const [userActions, setUserActions] = useState<UserAction[]>([]);
  const [qrCount, setQrCount] = useState(0);
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now());

  // Time-based messages
  const getTimeBasedMessage = (): Message => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 8) {
      // Early Morning (5am - 8am)
      const earlyMorningMessages = [
        { title: "🌅 Rise and shine! Ready to start your day with a QR code?", subtitle: "Early bird gets the best QR codes! ✨" },
        { title: "Good morning, ready to start your day with a new QR code?", subtitle: "Let's make something awesome today! ☀️" }
      ];
      return earlyMorningMessages[Math.floor(Math.random() * earlyMorningMessages.length)];
    } else if (hour >= 8 && hour < 12) {
      // Late Morning (8am - 12pm)
      const lateMorningMessages = [
        { title: "☀️ Good morning! Got something to scan today?", subtitle: "Perfect time to create something amazing! 🚀" },
        { title: "Rise and shine ☀️ Let's make something awesome today!", subtitle: "Start by choosing your QR type below 👇" }
      ];
      return lateMorningMessages[Math.floor(Math.random() * lateMorningMessages.length)];
    } else if (hour >= 12 && hour < 16) {
      // Afternoon (12pm - 4pm)
      const afternoonMessages = [
        { title: "🌤️ Good afternoon! Let's create something useful together.", subtitle: "Productive time calls for productive QRs! 💪" },
        { title: "Good afternoon! Need a QR code for your business or link?", subtitle: "It's productive time - let's create quickly!" },
        { title: "It's a productive time of the day, let's create your QR quickly!", subtitle: "Choose your QR type to get started 👇" }
      ];
      return afternoonMessages[Math.floor(Math.random() * afternoonMessages.length)];
    } else if (hour >= 16 && hour < 20) {
      // Evening (4pm - 8pm)
      const eveningMessages = [
        { title: "🌇 Good evening! A fresh QR code for a fresh start?", subtitle: "End your day with something creative! ✨" },
        { title: "Good evening! Want to generate one more QR before you wrap up?", subtitle: "Hope you had a great day! 🌇" },
        { title: "Hope you had a great day! Let's make your QR code in seconds.", subtitle: "Quick and easy QR creation awaits 👇" }
      ];
      return eveningMessages[Math.floor(Math.random() * eveningMessages.length)];
    } else if (hour >= 20 && hour < 24) {
      // Night (8pm - 12am)
      const nightMessages = [
        { title: "🌙 Good night! Before you sleep, wanna generate one last QR?", subtitle: "Sweet dreams start with sweet QRs! 😴" },
        { title: "Good night 🌙 Need a last-minute QR before bed?", subtitle: "We're here for your late night projects!" }
      ];
      return nightMessages[Math.floor(Math.random() * nightMessages.length)];
    } else {
      // Late Night (12am - 5am)
      const lateNightMessages = [
        { title: "🌌 Burning the midnight oil? Here's your QR booster!", subtitle: "Night owls deserve the best QR tools! 🦉" },
        { title: "Late night hustle? We're here to make your QR easy.", subtitle: "Quick generation, even at this hour 🌙" }
      ];
      return lateNightMessages[Math.floor(Math.random() * lateNightMessages.length)];
    }
  };

  // Educational & Tips messages
  const getEducationalMessage = (): Message => {
    const educationalMessages = [
      { title: "Did you know? You can create 10+ types of QR codes here!", subtitle: "Explore all the amazing possibilities 🎨" },
      { title: "Tip 💡: Add a frame & color to make your QR more attractive.", subtitle: "Customization makes all the difference ✨" },
      { title: "Fun fact: Over 2 billion QR codes are scanned every day worldwide 🌍", subtitle: "You're part of a global phenomenon!" },
      { title: "Your QR, your style ✨ Customize it with frames & colors.", subtitle: "Make it uniquely yours 🎭" },
      { title: "Want to surprise your friends? Try making a WiFi QR code!", subtitle: "Share your WiFi instantly 📶" },
      { title: "Not sure what QR to make? 🤔 Try 'Website' first.", subtitle: "It's the most popular choice for beginners! 🌐" },
      { title: "Hint 💡: Contact Card QR saves all your info instantly!", subtitle: "Digital business cards are the future! 📇" },
      { title: "Want to share WiFi password easily? 📶 Use WiFi QR.", subtitle: "No more spelling out complex passwords! 🔐" },
      { title: "Quick tip: 🎨 You can customize QR colors too.", subtitle: "Make it match your brand or style! 🌈" },
      { title: "💡 Tip: The more creative, the better your QR looks.", subtitle: "Unleash your artistic side with colors & frames! 🎨" },
      { title: "🤖 Fun fact: QR stands for Quick Response.", subtitle: "The more you know, the cooler you get! 🧠" }
    ];
    return educationalMessages[Math.floor(Math.random() * educationalMessages.length)];
  };

  // Motivational & Challenge messages
  const getMotivationalMessage = (): Message => {
    const motivationalMessages = [
      { title: "Quick challenge ⚡: Can you generate 3 different QRs in under a minute?", subtitle: "Test your speed and creativity! 🏃‍♂️" },
      { title: "Pro users always generate at least 2 QRs a day 😉.", subtitle: "Are you ready to join the pro league? 🏆" },
      { title: "Level up 🏆 Create your 2nd QR today.", subtitle: "Each QR makes you stronger! 💪" },
      { title: "Daily streak 🔥 Keep generating!", subtitle: "Consistency is the key to QR mastery! 📈" },
      { title: "Champion mode 🥇 Only pros make 5 QRs a day.", subtitle: "Are you ready for the ultimate challenge? 🏅" },
      { title: "Speed test ⏳ Can you generate in under 5 sec?", subtitle: "Fast fingers make great QR codes! ⚡" },
      { title: "🎯 Challenge: Create 3 different QR codes today!", subtitle: "Can you complete the triple QR mission? 🏃‍♂️" },
      { title: "🏆 Achievement unlocked: First QR of the day.", subtitle: "You're officially a QR champion today! 🥇" },
      { title: "Secret unlocked 🔑 Try SMS QR now.", subtitle: "Hidden features for the curious minds! 🗝️" }
    ];
    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  };

  // Fun & Casual messages (cleaned up)
  const getFunMessage = (): Message => {
    const funMessages = [
      { title: "Hello friend! 👋 Ready to create magic with QR?", subtitle: "Let's make something amazing together! ✨" },
      { title: "Welcome back 🚪 The QR world missed you.", subtitle: "Your creativity makes this place special! 💫" },
      { title: "Hi there, superstar ⭐ let's build your QR!", subtitle: "Every superstar needs a super QR! 🌟" },
      { title: "Knock knock 🚪 It's QR time again!", subtitle: "Who's there? Your next awesome QR code! 😄" },
      { title: "We were waiting for you 😍 Let's start!", subtitle: "The QR party can finally begin! 🎉" },
      { title: "Boom 💥 Your QR is loading…", subtitle: "Get ready for something spectacular! ⚡" },
      { title: "Shhh 🤫 This QR is a secret… only for you.", subtitle: "Special delivery just for special you! 🎁" },
      { title: "Tick tock ⏰ The QR clock is running!", subtitle: "Time flies when you're having QR fun! ⏳" },
      { title: "Oops 😅 Did you forget to try a different QR type?", subtitle: "No worries, there's always something new to explore! 🔍" },
      { title: "Hurry! ⚡ Another QR adventure awaits.", subtitle: "The QR universe is full of possibilities! 🚀" },
      { title: "👋 Hey user, nice to see you again!", subtitle: "Ready for another round of QR magic? ✨" },
      { title: "✨ Your QR journey starts here.", subtitle: "Every great QR story begins with a single click!" },
      { title: "⚡ Quick and easy—pick your QR style now.", subtitle: "Speed and quality, that's our promise! 🚀" },
      { title: "🧐 Can't decide? Try out a random QR type!", subtitle: "Sometimes the best choices are unexpected!" },
      { title: "🔄 Wanna make another one? It only takes a sec.", subtitle: "You're on a roll - keep the momentum going!" },
      { title: "📱 Scan it, save it, share it—your choice!", subtitle: "The power is in your hands! 💪" },
      { title: "🚀 You're on fire! Keep generating QRs.", subtitle: "Hot streak activated - don't stop now! 🔥" },
      { title: "🎨 Want your QR to stand out? Add colors next time.", subtitle: "Make it pop with your favorite colors! 🌈" }
    ];
    return funMessages[Math.floor(Math.random() * funMessages.length)];
  };

  // Success & Completion messages (for after QR creation)
  const getSuccessMessage = (): Message => {
    const successMessages = [
      { title: "🎉 Congrats! Your QR is ready—share it now!", subtitle: "Show off your creation to the world! 🌟" },
      { title: "😎 You're a pro QR maker already!", subtitle: "Look at you mastering the QR game! 🏆" },
      { title: "Wow 🤩 That's a cool QR you just made.", subtitle: "You've got excellent taste in QR design! 👌" },
      { title: "✅ Perfect! Your QR code looks amazing.", subtitle: "Professional quality in seconds! ⚡" },
      { title: "🎯 Bullseye! Another successful QR creation.", subtitle: "You're getting better at this! 🏹" }
    ];
    return successMessages[Math.floor(Math.random() * successMessages.length)];
  };

  // Goodbye messages (only for session end/completion)
  const getGoodbyeMessage = (): Message => {
    const goodbyeMessages = [
      { title: "🥳 Thanks for visiting! Come back anytime.", subtitle: "Our QR generator misses you already! 💝" },
      { title: "All done? ✅ Don't forget to share it!", subtitle: "Your amazing QR deserves to be seen! 🌟" },
      { title: "That's it for now 🚀 Come back soon.", subtitle: "We'll be here whenever you need us! 💫" },
      { title: "Mission complete 🎯 Your QR is ready.", subtitle: "Agent, your mission was a success! 🕵️‍♂️" },
      { title: "Bye-bye 👋 See you next time.", subtitle: "Until we meet again, QR creator! 👋" },
      { title: "Good luck 🌟 Till we meet again!", subtitle: "May your QRs bring you joy and success! 🍀" },
      { title: "Remember: Sharing is caring 💌", subtitle: "Spread the QR love with the world! 🌍" },
      { title: "Looks like you're done 🎉 Please come again soon!", subtitle: "Thanks for using our QR Generator 😊" },
      { title: "Have a nice day & thanks for using our QR Generator 😊", subtitle: "Your QRs are ready to share! 🚀" }
    ];
    return goodbyeMessages[Math.floor(Math.random() * goodbyeMessages.length)];
  };

  // User interaction-based messages
  const getInteractionMessage = (action: UserAction): Message => {
    switch (action.type) {
      case 'first_visit':
        return { 
          title: "👋 Welcome! Which type of QR code would you like to generate?", 
          subtitle: "Start by choosing your QR type below 👇" 
        };
      
      case 'qr_created':
        return getSuccessMessage();
      
      case 'multiple_qrs':
        const multiMessages = [
          { title: "Wow, you're on fire 🔥 Keep generating more!", subtitle: "You're becoming a QR master! 🎯" },
          { title: "Multiple QRs? You're a power user 😎", subtitle: "Professional level unlocked! 🏆" }
        ];
        return multiMessages[Math.floor(Math.random() * multiMessages.length)];
      
      case 'idle':
        const idleMessages = [
          { title: "Still there? 👀 Let's create a QR in just one click.", subtitle: "Don't be shy - try it now! 😉" },
          { title: "Don't be shy 😉 Try generating a QR now!", subtitle: "It's easier than you think! ⚡" }
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
    
    if (action.type === 'qr_created') {
      const newCount = qrCount + 1;
      setQrCount(newCount);
      
      if (newCount === 1) {
        setCurrentMessage(getInteractionMessage({ type: 'qr_created' }));
      } else if (newCount >= 3) {
        setCurrentMessage(getInteractionMessage({ type: 'multiple_qrs' }));
      }
    } else {
      setCurrentMessage(getInteractionMessage(action));
    }
  };

  // Auto-rotate messages
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

  // Listen for QR generation events
  useEffect(() => {
    const handleQRGenerated = (event: Event) => {
      updateMessage({ type: 'qr_created' });
    };

    const handleQRCompleted = (event: Event) => {
      updateMessage({ type: 'completed' });
    };

    const handleInteraction = () => {
      setLastInteractionTime(Date.now());
      setLastShownMessageType(''); // Reset idle state on interaction
    };

    // Listen for QR generation and completion
    window.addEventListener('qrCodeGenerated', handleQRGenerated);
    window.addEventListener('qrCodeCompleted', handleQRCompleted);
    
    // Listen for user interactions
    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('scroll', handleInteraction);

    return () => {
      window.removeEventListener('qrCodeGenerated', handleQRGenerated);
      window.removeEventListener('qrCodeCompleted', handleQRCompleted);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
    };
  }, []);

  // Initialize with first-visit detection and time-based message
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedQRGenerator');
    
    if (!hasVisited) {
      // First visit - show first visit message, then mark as visited
      updateMessage({ type: 'first_visit' });
      localStorage.setItem('hasVisitedQRGenerator', 'true');
      
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

  return { currentMessage, updateMessage, qrCount };
};

const DynamicMessages = () => {
  const { currentMessage } = useDynamicMessages();
  
  return (
    <div className="text-center">
      <h2 className="text-white text-lg md:text-xl font-semibold mb-2" id="dynamic-message">
        {currentMessage.title}
      </h2>
      <p className="text-emerald-300 text-sm md:text-base opacity-90" id="dynamic-subtitle">
        {currentMessage.subtitle}
      </p>
    </div>
  );
};

export default DynamicMessages;