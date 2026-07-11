clone the project on your local
Execute npm install on the same path as of your root directory of teh downloaded project
there are three folders
Inside the src/config folder create a new file config.json and then add the following piece of json

  import dotenv from 'dotenv'
  dotenv.config()
  
  const PORT = process.env.PORT || 3000
  
  export{
      PORT
  }

There are three folders
1. Backend
2. Frontend
3. AirService

1.In the Backend Folder
Inside the src/config folder create a new file config.json and then add the following piece of json
  import dotenv from 'dotenv'
  dotenv.config()
  
  const PORT = process.env.PORT || 3000
  
  export{
      PORT
  }

Create a .env file in the root directory and add the following environment variable
PORT=3000

2. In the AirService folder
Go to serpAPI: https://serpapi.com/
register and get your API key
create a .env file in the root directory and add the following environment variable
PORT=3002
SERPAPI_KEY= your_api_key

run all the three services on their respective servers
