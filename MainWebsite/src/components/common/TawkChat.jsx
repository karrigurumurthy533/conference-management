import { useEffect } from "react";

const TawkChat = () => {
  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://embed.tawk.to/68a41e1c1cacbc192cd30ab4/1j30hba8k";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.body.appendChild(script);

    return () => {
      const tawkScript = document.querySelector(
        'script[src*="embed.tawk.to"]'
      );

      if (tawkScript) {
        tawkScript.remove();
      }
    };
  }, []);

  return null;
};

export default TawkChat;