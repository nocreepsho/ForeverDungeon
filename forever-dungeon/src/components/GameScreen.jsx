import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './gamescreen.css';
import { callGPT, callDalle } from '../APIHelper';
import LoadingSign from './LoadingSign';

const GameScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [storyText, setStoryText] = useState('');
  const [fullStory, setFullStory] = useState([{
    role: "user",
    // content: "You are a dungeon text adventure game. Your job is to narrate an engaging story to the user. Ask the user what they would like to do next. I don’t want you to ever break out of your character, and you must not refer to yourself in any way. The game will be a moderately challenging and some choices can lead to instant death, I will type commands and dialog, and you will continue the story starting with my reply. YOU MUST CONTINUE THE STORY WITH WHATEVER I SAY. You must respond with less than 1000 characters.",
    content: "You are an interactive story game bot that proposes some hypothetical dungeon adventure situation where the user needs to pick from 2-4 options that you provide. Once the user picks one of those options, you will then state what happens next and present new options, and this then repeats. If you understand, say, OK, and begin when I say 'begin'. When you present the story and options, present just the story and start immediately with the story, don't repeat the users choice, no further commentary, and then options like 'Option 1:' 'Option 2:' ...etc.",
    img: ""

  },
  {
    role: "assistant",
    content: "OK, I understand. Begin when you're ready."
  },
  {
    role: "user",
    content: "Begin"
  }

  ]);
  const [userInput, setUserInput] = useState('');
  const [image, setImage] = useState('');
  const [history, setHistory] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(-1);
  const [button_messages, setButtonMessages] = useState({});
  const [button_states, setButtonStates] = useState({});



  const beginAdventure = async () => {

    setShowContent(false);
    setIsLoading(true);
    setCurrentStoryIndex(0);

    // Make an API call to GPT to generate story text
    const response = await callGPT(fullStory);

    // Use regular expressions to extract text and options
    const textMatch = response.match(/^(.*?)(Option \d:|$)/s);
    const optionsMatch = response.match(/Option \d: (.*?)(?=(Option \d: |$))/gs);

    // Extracted text and options with "Option #" included
    const text = textMatch ? textMatch[1].trim() : '';
    const options = optionsMatch ? optionsMatch.map(option => option.trim()) : [];

    // create state of button messages
    const buttonTemp = {};
    options.forEach((option, i) => {
      buttonTemp[`button${i + 1}`] = option;
    });

    setButtonMessages(buttonTemp);

    // const imgprompt = generateImgPrompt(response);
    const imgUrl = await callDalle(response);

    setImage(imgUrl);

    setFullStory([...fullStory, { role: 'assistant', content: text, img: imgUrl }]);
    setStoryText(text);
    setHistory([...history, { story: text, img: imgUrl, userInput: '' }]);

    setIsLoading(false);
  };

  const handleSendClick = async () => {
    try {
      setShowContent(false);
      setIsLoading(true);

      const updatedHistory = [...history];
      updatedHistory[currentStoryIndex].userInput = userInput;
      setHistory(updatedHistory);

      setFullStory([...fullStory, { role: 'user', content: userInput, img: '' }]);
      setCurrentStoryIndex(currentStoryIndex + 1);
      setUserInput('');

      const response = await callGPT(fullStory);
      const imgprompt = generateImgPrompt(response);
      const imgUrl = await callDalle(imgprompt);

      setImage(imgUrl);

      setFullStory([...fullStory, { role: 'assistant', content: response, img: imgUrl }]);
      setStoryText(response);
      setHistory([...history, { story: response, img: imgUrl, userInput: '' }]);

      setIsLoading(false);
    } catch (error) {
      console.error('Error sending choice:', error);
    }
  };

  const handleLeftArrowClick = () => {
    // Move to previous story object if not at the beginning
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  const handleRightArrowClick = () => {
    // Move to next story object if not at the end
    if (currentStoryIndex < history.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    }
  };


  const renderStoryInput = () => {
    // Check if the currentStoryIndex is the latest story
    if (currentStoryIndex === history.length - 1) {
      // If it is the latest story, render the buttons for the user to choose from
      return (
        <div className="user-input">
          {Object.keys(button_messages).map((buttonName, index) => (
            <button
              key={index}
              className="message-button"
              onClick={() => handleButtonClick(button_messages[buttonName])}
            >
              {button_messages[buttonName]}
            </button>
          ))}
        </div>
      );
    } else {
      // If it's not the latest story, render the previous user input
      return (
        <div className="previous-user-input">
          <p style={{ color: '#fa9b3d' }}>{history[currentStoryIndex].userInput}</p>
        </div>
      );
    }
  };

  const handleButtonClick = async (buttonText) => {
    try {
      setShowContent(false);
      setIsLoading(true);

      const updatedHistory = [...history];
      updatedHistory[currentStoryIndex].userInput = buttonText;
      setHistory(updatedHistory);

      const userChoiceMessage = {
        role: 'user',
        content: buttonText,
        img: '',
      };

      const updatedFullStory = [...fullStory, userChoiceMessage];
      setFullStory(updatedFullStory);
      setCurrentStoryIndex(currentStoryIndex + 1);

      const response = await callGPT(updatedFullStory);

      const textMatch = response.match(/^(.*?)(Option \d:|$)/s);
      const optionsMatch = response.match(/Option \d: (.*?)(?=(Option \d: |$))/gs);

      // Extracted text and options
      const text = textMatch ? textMatch[1].trim() : '';
      const options = optionsMatch ? optionsMatch.map(option => option.replace(/Option \d: /, '').trim()) : [];

      console.log('Text:', text);
      console.log('Options:', options);

      // create state of button messages
      const buttonTemp = {};
      options.forEach((option, i) => {
        buttonTemp[`button${i + 1}`] = option;
      });

      setButtonMessages(buttonTemp);

      // const imgprompt = generateImgPrompt(response);
      const imgUrl = await callDalle(response);

      setImage(imgUrl);

      const AssistantMessage = {
        role: 'assistant',
        content: text,
        img: imgUrl,
      };

      setFullStory((prevFullStory) => [...prevFullStory, AssistantMessage]);
      // const updatedFullStory2 = [...fullStory, AssistantMessage];
      // setFullStory(updatedFullStory2);

      // setFullStory([...fullStory, { role: 'assistant', content: text, img: imgUrl }]);
      setStoryText(text);
      setHistory([...history, { story: text, img: imgUrl, userInput: '' }]);

      

      setIsLoading(false);
    } catch (error) {
      console.error('Error sending choice:', error);
    }
  };
  


  return (<>

    <div className="game-screen">
      
      {showContent && (
        <div className="content">
          <h1 className="title">Forever Dungeon</h1>
          <h2 className="subtitle">An Infinite Text Adventure</h2>
          <button className="begin-button" onClick={beginAdventure}>
            Begin Adventure
          </button>
        </div>
      )}

      {!showContent && isLoading && (
        <div className="loading">
          <LoadingSign />
        </div>
      )}

      {!showContent && !isLoading && (
        <div className='story'>

          <div className="img-container">
            {currentStoryIndex > 0 && (
              <button className="arrow left-arrow" onClick={handleLeftArrowClick}>
                &#8592;
              </button>
            )}
            <img src={history[currentStoryIndex].img} alt="dungeon" className="dungeon-image" />

            {currentStoryIndex < history.length - 1 && (
              <button className="arrow right-arrow" onClick={handleRightArrowClick}>
                &#8594;
              </button>
            )}
          </div>
          <p className="story-text">{history[currentStoryIndex].story}</p>

          {renderStoryInput()}

        </div>
      )}
    </div>
  </>);
};



export default GameScreen;
