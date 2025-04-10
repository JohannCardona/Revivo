import axios from "axios";

export const generate_image = (prompt) => {
  return axios.post(
    `http://localhost:5000/image_generation`,
    { prompt },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const downloadDALLEImage = (imgURL) => {
  if (!imgURL) return;
  // Create a link element on the screen and target generated image URL
  const imageLink = document.createElement("a");
  imageLink.href = imgURL;
  // Default image filename
  imageLink.download = "dalle_image.jpeg";
  // Display file explorer to save image
  document.body.appendChild(imageLink);
  imageLink.click();
  document.body.removeChild(imageLink);
};

export const image_from_emotion = async (
  setConversations,
  botMessageIndex,
  setDynamicChoice
) => {
  // Get emotion value from local storage
  const storedEmotion = localStorage.getItem("mood");
  // Pass prompt to DALL-E to generate image based on extracted emotion
  const dallePrompt = `An abstract artistic interpretation of the ${storedEmotion} mood in a creative, modern style.`;
  const imageUrl = await generate_image(dallePrompt);
  // Save the image URL to the conversations array
  setConversations((prev) => {
    const currentMessage = [...prev];
    currentMessage[botMessageIndex].response = imageUrl;
    return currentMessage;
  });
  setDynamicChoice(false);
};
