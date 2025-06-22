import Board from "./Board";
import { ThemeProvider } from "./Context.jsx";

function App() {
  return (
    <ThemeProvider>
      <Board />
    </ThemeProvider>
  );
}

export default App;
