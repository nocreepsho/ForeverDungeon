
// WARNING: The API handler is setup this way only for demo purposes. 
// In a real world application, use a more secure process for handling the secret keys.

import axios from 'axios';

const BASE_URL = 'https://api.openai.com/v1/chat/completions'; // Base URL for GPT API
const IMG_URL = 'https://api.openai.com/v1/images/generations'; // Base URL for DALL-E API


const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
};

// Function to make POST requests to OpenAI API
export const callGPT = async (data) => {
  try {
    const messages = [];

    await data.forEach((item) => {
      messages.push({role:item.role, content:item.content});
    });

    const requestData = {
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 300
    }

    const response = await axios.post(`${BASE_URL}`, requestData, { headers });
    const responseText = response.data.choices[0].message.content;
    console.log(responseText);
    return responseText;
  } catch (error) {
    throw error;
  }
};

export const callDalle = async (prompt) => {
  try{
    const requestData = {
      prompt: prompt + "dark, lowlight, dungeon, digital art",
      num_images: 1,
      size: "512x512"
    }
    const response = await axios.post(`${IMG_URL}`, requestData, { headers });
    const imgUrl = response.data.data[0].url
    return imgUrl;

  } catch (error) {
    throw error;
  }
};