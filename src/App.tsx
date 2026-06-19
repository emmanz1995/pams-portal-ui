import { Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { GlobalStyle } from './styles/GlobalStyles.ts';
import { theme } from './styles/theme.ts';
import {Register} from "./pages/Register";

function App() {
  return (
    <>
      <GlobalStyle theme={theme} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
