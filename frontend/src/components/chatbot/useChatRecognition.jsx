import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const useChatRecognition = (setPrompt) => {
  const chatBotSpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const chatbotRecognition = chatBotSpeechRecognition
    ? new chatBotSpeechRecognition()
    : null;
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (chatbotRecognition) {
      console.log(chatbotRecognition);
      chatBotSpeechRecognition.interimResults = true;
      chatbotRecognition.lang = "en-US";
      chatbotRecognition.continues = false;

      chatbotRecognition.onStart = () => {
        console.log("Revivo bot is listening...");
        setIsListening(true);
      };

      chatbotRecognition.onEnd = () => {
        console.log("Revivo bot stopped listening...");
        setIsListening(false);
      };

      chatbotRecognition.onResult = (e) => {
        let completeText = "";
        let textParts = "";
        console.log(e);
        Object.entries(e.results).map((key, i) => {
          const textFromSpeech = key[0].transcript;
          if (key.isFinal) {
            return (completeText = completeText + textFromSpeech);
          } else {
            return (textParts += textParts + textFromSpeech);
          }
        });
        setPrompt(completeText || textParts);
      };
    }
  }, [chatbotRecognition, setPrompt]);

  const handleAudioScript = () => {
    if (chatbotRecognition) {
      setPrompt("");
      chatbotRecognition.start();
    } else {
      Swal.fire({
        title: "The web browser does not supprot Web Speech API",
        confirmButtonText: "OK",
        confirmButtonColor: "#ff0055",
        icon: "error",
      });
    }
  };

  console.log(isListening);
  

  return { isListening, handleAudioScript };
};

export default useChatRecognition;
