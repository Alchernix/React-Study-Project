import { useEffect, useState } from "react";

export default function LifeQuotesApp() {
  const [LifeQuote, setLifeQuote] = useState("");
  const [author, setAuthor] = useState("");

  async function getLifeQuote() {
    const response = await fetch(
      "https://korean-advice-open-api.vercel.app/api/advice"
    );
    const responseData = await response.json();
    const { author, authorProfile, message } = responseData;

    setLifeQuote(message);
    setAuthor(author);
  }

  useEffect(() => {
    getLifeQuote();
  }, []);

  return (
    <div className="container">
      <i
        className="fa-solid fa-quote-left quotes"
        style={{ fontSize: "30px" }}
      ></i>
      <div
        className="lifeq-quote"
        style={{
          fontWeight: "bold",
          boxSizing: "border-box",
          padding: "0px 20px",
          textAlign: "center",
          wordBreak: "keep-all",
        }}
      >
        {LifeQuote}
      </div>
      <div className="author">-{author}-</div>
    </div>
  );
}

LifeQuotesApp.appName = "명언";
LifeQuotesApp.Icon = () => <span style={{ fontSize: "24px" }}>💬</span>;
// LifeQuotes.defaultWidth = 300;
// LifeQuotes.defaultHeight = 450;
