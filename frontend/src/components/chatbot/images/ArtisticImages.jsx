import axios from "axios";

export const generate_image = async (prompt) => {
  const response = await axios.post(
    `http://localhost:5000/image_generation`,
    { prompt },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  const genImage = `data:image/jpeg;base64,${response.data[0].result}`;
  return genImage;
};

export const downloadDALLEImage = (imgURL) => {
  if (!imgURL) return;
  const imageLink = document.createElement("a");
  imageLink.href = imgURL;
  imageLink.download = "dalle_image.jpeg";
  document.body.appendChild(imageLink);
  imageLink.click();
  document.body.removeChild(imageLink);
};