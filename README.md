# Email Reply Generator and Extension

## Project Overview

The Email Reply Generator is an innovative AI-powered tool designed to streamline email communication by providing intelligent, context-aware reply suggestions directly within your email client. By integrating advanced AI technology with a user-friendly interface, this project helps users craft professional and effective email responses quickly and effortlessly.

## Project Screenshots

<!-- Placeholder for project screenshots -->
![Main Interface](/images/websiteImage1.png)
*Main Application Interface*

![Browser Extension](/images/websiteGeneratedReply.png)
*Generated Reply*

![AI Reply Generation](/images/ExtensionButtonWithDropDown.png)
*Extension Button*

## Key Features

- **AI-Powered Responses**: Leveraging the Gemini API to generate intelligent and contextually appropriate email replies
- **Seamless Integration**: Smooth integration with popular email clients via a browser extension
- **User-Friendly Interface**: Intuitive React-based frontend with Material-UI design
- **Flexible Configuration**: Easily configurable API keys through environment variables
- **Cross-Platform Compatibility**: Works across different operating systems and email platforms
- **Secure Design**: Robust security measures to protect sensitive configuration data
- **High-Performance Backend**: Efficient Java Spring Boot implementation

## Prerequisites

Before installation, ensure you have the following installed:
- Java Development Kit (JDK) 21
- Node.js 16+
- Maven
- Git
- IntelliJ IDEA (recommended) or another Java IDE

## Installation

### Backend Setup

####IntelliJ IDEA Setup
1. Open the project in IntelliJ IDEA
2. Navigate to Run > Edit Configurations
3. Set the following environment variables:
   - `GEMINI_URL`: Your Gemini API endpoint
   - `GEMINI_KEY`: Your Gemini API key
4. Run the application



### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Browser Extension Setup
```bash
cd browser-extension
npm install
npm run build
```

Load the extension in your browser:
- Chrome: Go to `chrome://extensions/`, enable "Developer mode", and load the unpacked extension
- Firefox: Go to `about:debugging`, click "This Firefox", and load the extension

## Usage

1. Open your email client
2. view an existing email thread
3. Click the "AI Reply" button
4. Review the AI-generated suggested reply
5. Edit or send the response as needed


## Project Link: [https://github.com/yourusername/email-reply-generator](https://github.com/yourusername/email-reply-generator)
