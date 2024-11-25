import React, { useState } from "react";
// import axios from "axios";
import { Button, TextField } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import Swal from "sweetalert2";
import OpenAI from "openai";
import "../../styles/moodscan/ArtStyling.css";

function ArtStyling() {
  const [prompt, setPrompt] = useState("");
  const [imgURL, setImgURL] = useState("");
  const client = new OpenAI({
    apiKey:
      "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",
    dangerouslyAllowBrowser: true,
  });

  console.log(prompt);

  const generate_image = async () => {
    if (prompt === "") {
      Swal.fire({
        title: "You must provide a prompt",
        confirmButtonText: "OK",
        confirmButtonColor: "#ff0055",
        icon: "error",
      }).then(() => {});
    } else {
      const response = await client.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        size: "1024x1024",
        quality: "standard",
        n: 1,
      });
      setImgURL(response.data[0].url);
      // await axios
      //   .post("http://localhost:5000/image_generation", { prompt })
      //   .then((response) => {
      //     console.log(response.data.result);
      //   });
    }
  };

  return (
    <div className="art-container">
      <h2>Art Styling</h2>
      <div className="items">
        <TextField
          id="outlined-basic"
          label="Message DALL-E"
          variant="outlined"
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>
      <Button
        style={{ backgroundColor: "rgb(80, 160, 129)" }}
        variant="contained"
        endIcon={<SendRoundedIcon />}
        onClick={generate_image}
      >
        Generate
      </Button>
      <div className="items">
        {prompt ? <img src={imgURL} alt="AI generated figure" /> : ""}
      </div>
    </div>
  );
}

export default ArtStyling;
