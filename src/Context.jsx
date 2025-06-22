import { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeColor, setThemeColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000");
  const [titleBarColor, setTitleBarColor] = useState("#aacddc");

  useEffect(() => {
    if (themeColor === "#ffffff") {
      // 일반
      setTextColor("#000");
      setTitleBarColor("#aacddc");
    } else {
      // 다크모드
      setTextColor("whitesmoke");
      setTitleBarColor("#00509d");
    }
  }, [themeColor]);

  return (
    <ThemeContext.Provider
      value={{
        themeColor,
        setThemeColor,
        textColor,
        setTextColor,
        titleBarColor,
        setTitleBarColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
