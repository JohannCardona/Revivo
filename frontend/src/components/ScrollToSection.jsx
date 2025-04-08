import { useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToSection = () => {
  // Get current URL link object
  let location = useLocation();

  let hashElement = useMemo(() => {
    // Extract link element when change in location
    let hash = location.hash;
    const removeHashCharacter = (str) => {
      const result = str.slice(1);
      return result;
    };

    // Remove hash symbol from URL and return link element
    if (hash) {
      let element = document.getElementById(removeHashCharacter(hash));
      return element;
    } else {
      return null;
    }
  }, [location]);

  useEffect(() => {
    // Scroll to target section from extracted element
    if (hashElement) {
      hashElement.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [hashElement]);

  return null;
};

export default ScrollToSection;
