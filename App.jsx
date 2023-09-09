import React, { Component } from 'react';

class SpeechToTextTranslator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      translatedText: '',
      recognition: null,
      isListening: false,
    };
  }

  componentDidMount() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      
      recognition.onstart = () => {
        this.setState({ isListening: true });
      };
      
      recognition.onend = () => {
        this.setState({ isListening: false });
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.setState({ text: transcript });
        this.translateText(transcript);
      };

      this.setState({ recognition });
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  }

  toggleListening = () => {
    const { recognition, isListening } = this.state;
    
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  translateText = async (textToTranslate) => {
    // You need to replace 'YOUR_TRANSLATE_API_KEY' with your Google Translate API key.
    const apiKey = 'YOUR_TRANSLATE_API_KEY';
    const apiUrl = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: textToTranslate,
          source: 'en', // Source language (English)
          target: 'fr', // Target language (e.g., French)
        }),
      });

      const data = await response.json();
      const translatedText = data.data.translations[0].translatedText;
      this.setState({ translatedText });
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  render() {
    const { text, translatedText, isListening } = this.state;

    return (
      <div>
        <h1>Speech-to-Text Translator</h1>
        <button onClick={this.toggleListening}>
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </button>
        <p>Spoken Text: {text}</p>
        <p>Translated Text: {translatedText}</p>
      </div>
    );
  }
}

export default SpeechToTextTranslator;
