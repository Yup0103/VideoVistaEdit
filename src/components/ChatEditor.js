import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaPaperPlane, FaImage, FaVolumeUp, FaCog, FaArrowLeft } from 'react-icons/fa';
import './ChatEditor.css';
import ScenesPanel from './tool-panels/ScenesPanel';
import AudioPanel from './tool-panels/AudioPanel';
import SettingsPanel from './tool-panels/SettingsPanel';

/**
 * ChatEditor Component
 * 
 * AI-powered video editing interface that uses a chat-based approach to modify videos.
 * Allows users to communicate with AI via text and integrates with specialized editing tools
 * for more precise control.
 * 
 * @param {Object} props Component props
 * @param {Function} props.onClose Function to close the editor
 */
const ChatEditor = ({ onClose }) => {
  // Chat messages state
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'ai', 
      content: 'What would you like to change about your video?',
      timestamp: new Date() 
    }
  ]);
  
  // User input state for chat
  const [input, setInput] = useState('');
  
  // Currently active scene
  const [activeScene, setActiveScene] = useState(0);
  
  // Currently active tool panel (null if no panel is open)
  const [activeToolPanel, setActiveToolPanel] = useState(null);
  
  // Reference to scroll chat to bottom
  const chatEndRef = useRef(null);
  
  // Mock video scenes data (would come from API in real app)
  const scenes = [
    { id: 1, thumbnail: 'https://via.placeholder.com/120x68/333/fff?text=Scene+1', time: '0:00-0:04' },
    { id: 2, thumbnail: 'https://via.placeholder.com/120x68/333/fff?text=Scene+2', time: '0:05-0:09' },
    { id: 3, thumbnail: 'https://via.placeholder.com/120x68/333/fff?text=Scene+3', time: '0:10-0:14' }
  ];

  /**
   * Automatically scroll chat to bottom when new messages arrive
   */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Process and send the user's message, then generate an AI response
   */
  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Create and add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    
    // Generate AI response (simulated)
    generateAIResponse(input);
  };

  /**
   * Generate an AI response based on user input
   * In a real app, this would call an API
   * 
   * @param {string} userInput - The user's message content
   */
  const generateAIResponse = (userInput) => {
    setTimeout(() => {
      let aiResponse;
      const lowerInput = userInput.toLowerCase();
      
      // Generate response based on keywords in user input
      if (lowerInput.includes('replace') || lowerInput.includes('change scene')) {
        aiResponse = {
          id: messages.length + 2,
          type: 'ai',
          content: "I can help replace that scene. Here are 3 alternatives I've generated based on your video style:",
          options: [
            { type: 'scene', thumbnail: 'https://via.placeholder.com/160x90/444/fff?text=Option+1' },
            { type: 'scene', thumbnail: 'https://via.placeholder.com/160x90/444/fff?text=Option+2' },
            { type: 'scene', thumbnail: 'https://via.placeholder.com/160x90/444/fff?text=Option+3' }
          ],
          timestamp: new Date()
        };
      } else if (lowerInput.includes('script') || lowerInput.includes('text')) {
        aiResponse = {
          id: messages.length + 2,
          type: 'ai',
          content: "Here's the current script for this scene. You can edit it directly:",
          script: "Our product helps customers achieve their goals faster and with less effort than traditional methods.",
          timestamp: new Date()
        };
      } else {
        aiResponse = {
          id: messages.length + 2,
          type: 'ai',
          content: "I can help you with that. Would you like to: 1) Change scenes, 2) Edit script, or 3) Adjust the storyboard?",
          timestamp: new Date()
        };
      }
      
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  /**
   * Handle scene selection
   * 
   * @param {number} sceneId - ID of the selected scene
   */
  const handleSceneClick = (sceneId) => {
    setActiveScene(sceneId);
  };

  /**
   * Handle Enter key press in chat input
   * 
   * @param {Object} e - Keyboard event
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * Open a tool panel
   * 
   * @param {string} tool - The tool panel to open ('scenes', 'audio', 'settings')
   */
  const handleToolClick = (tool) => {
    setActiveToolPanel(tool);
  };

  /**
   * Close the currently open tool panel
   */
  const handleCloseToolPanel = () => {
    setActiveToolPanel(null);
  };

  /**
   * Get the appropriate tool panel component based on activeToolPanel state
   * 
   * @returns {JSX.Element|null} The tool panel component or null
   */
  const getToolPanel = () => {
    switch (activeToolPanel) {
      case 'scenes':
        return <ScenesPanel onClose={handleCloseToolPanel} scenes={scenes} activeScene={activeScene} />;
      case 'audio':
        return <AudioPanel onClose={handleCloseToolPanel} />;
      case 'settings':
        return <SettingsPanel onClose={handleCloseToolPanel} />;
      default:
        return null;
    }
  };

  /**
   * Handle click on apply button in script editor
   * 
   * @param {string} updatedScript - The updated script content
   */
  const handleApplyScript = (updatedScript) => {
    console.log('Applying script:', updatedScript);
    // In a real app, would save the script and update the video
  };

  return (
    <div className="chat-editor-overlay">
      <div className="chat-editor-container">
        {/* Editor header with title and close button */}
        <div className="chat-editor-header">
          <h3>Edit Video with AI</h3>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close editor"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="chat-editor-content">
          {activeToolPanel ? (
            // Render active tool panel when selected
            getToolPanel()
          ) : (
            <>
              {/* Video preview and scene navigation */}
              <div className="video-preview-pane">
                {/* Main video scene preview */}
                <div className="video-scene">
                  <img 
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" 
                    alt="Video scene preview"
                    className="scene-preview"
                  />
                </div>
                
                {/* Scene thumbnails navigation */}
                <div className="scene-thumbnails">
                  {scenes.map(scene => (
                    <div 
                      key={scene.id}
                      className={`scene-thumbnail ${activeScene === scene.id ? 'active' : ''}`}
                      onClick={() => handleSceneClick(scene.id)}
                      role="button"
                      aria-label={`Select scene ${scene.id}`}
                      aria-pressed={activeScene === scene.id}
                    >
                      <img src={scene.thumbnail} alt={`Scene ${scene.id}`} />
                      <div className="scene-time">{scene.time}</div>
                    </div>
                  ))}
                </div>
                
                {/* Editing tool buttons */}
                <div className="editing-tools">
                  <button 
                    className="tool-button" 
                    onClick={() => handleToolClick('scenes')}
                    aria-label="Scene management tool"
                  >
                    <FaImage /> Scenes
                  </button>
                  <button 
                    className="tool-button" 
                    onClick={() => handleToolClick('audio')}
                    aria-label="Audio settings tool"
                  >
                    <FaVolumeUp /> Audio
                  </button>
                  <button 
                    className="tool-button" 
                    onClick={() => handleToolClick('settings')}
                    aria-label="Video settings tool"
                  >
                    <FaCog /> Settings
                  </button>
                </div>
              </div>
              
              {/* Chat interaction pane */}
              <div className="chat-pane">
                {/* Message history area */}
                <div className="chat-messages" aria-live="polite">
                  {messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`message ${message.type}`}
                      aria-label={`${message.type === 'user' ? 'You' : 'AI'} said`}
                    >
                      <div className="message-content">
                        {message.content}
                        
                        {/* AI-generated scene options */}
                        {message.options && (
                          <div className="option-grid">
                            {message.options.map((option, index) => (
                              <div 
                                key={index} 
                                className="option-item"
                                role="button"
                                aria-label={`Scene option ${index + 1}`}
                              >
                                <img src={option.thumbnail} alt={`Option ${index + 1}`} />
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Script editor within chat */}
                        {message.script && (
                          <div className="script-editor">
                            <textarea 
                              defaultValue={message.script}
                              rows={4}
                              placeholder="Edit script text here..."
                              aria-label="Edit script text"
                            />
                            <button 
                              className="apply-script"
                              onClick={() => handleApplyScript(document.querySelector('.script-editor textarea').value)}
                            >
                              Apply Changes
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="message-time">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                  {/* Used for auto-scrolling to the bottom */}
                  <div ref={chatEndRef} />
                </div>
                
                {/* Chat input area */}
                <div className="chat-input-area">
                  <textarea 
                    className="chat-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe what you want to change..."
                    rows={2}
                    aria-label="Message input"
                  />
                  <button 
                    className="send-button"
                    onClick={handleSendMessage}
                    disabled={input.trim() === ''}
                    aria-label="Send message"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatEditor; 