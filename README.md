# Forever Dungeon: An Infinite Text Adventure 🧙

### Description
Forever Dungeon is a fun project I created to expose myself to the OPENAI APIs. IT uses the `gpt3.5-turbo` model to generate the story and provides several options to the user. The story continues infinitely based on the users choices.
For a better experience, the text is also passed to the DALL-E API to generate a relevant image.

I used `React` + `Vite` to setup the user interface. `Axios` is used to handle the API calls.

### *⚠️ WARNING! ⚠️*
*The project is setup to use environment variables directly with the client-side code. While this is fine for demonstration purposes, never replicate this in actual production. You would want to setup a server side (ex. NodeJS), then store and handle the API keys and calls securely.*

### Installation
clone the repo and install dependencies:

```
npm install
```
place your OPENAI API Key a `.env` file in the project root folder. Vite requires you to add the prefix 'VITE_' to the name.

```
VITE_OPENAI_API_KEY = `Your secret key`
```

run the project:

```
npm run dev
```

### Challenges Faced
- **Consistent output:** The biggest challenge is getting consistent outputs all the time. I spent some time on the initial prompt to get it to give me a consistent output of the story text and choices, but it doesn't adhere to the format 100% of the time. That is a flaw I haven't been able to find a solution for. Here's the initial prompt that I used: 
  > *You are an interactive story game bot that proposes some hypothetical dungeon adventure situation where the user needs to pick from 2-4 options that you provide. Once the user picks one of those options, you will then state what happens next and present new options, and this then repeats. If you understand, say, OK, and begin when I say 'begin'. When you present the story and options, present just the story and start immediately with the story, don't repeat the users choice, no further commentary, and then options like 'Option 1:' 'Option 2:' ...etc.*

- **Continuation of context:** Another challenge, I faced initially was that GPT would completely ignore the user selected choice, and progress the story forward with some other choice. This was prevalent when I had planned to use a text input box for the user to type their actions in. But keeping the number of choices limited, helps in maintaining the context better.

