import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import { theme } from './styles/theme';
import Navigation from './components/ui/Navigation';
import ChapterIntro from './pages/ChapterIntro';
import Lesson1 from './pages/lesson1/Lesson1';
import Lesson2 from './pages/lesson2/Lesson2';
import Lesson3 from './pages/lesson3/Lesson3';
import Lesson4 from './pages/lesson4/Lesson4';
import Lesson5 from './pages/lesson5/Lesson5';
import Workshop1 from './pages/lesson5/workshop1/Workshop1';
import Workshop2 from './pages/lesson5/workshop2/Workshop2';
import Workshop3 from './pages/lesson5/workshop3/Workshop3';
import Workshop4 from './pages/lesson5/workshop4/Workshop4';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<ChapterIntro />} />
          <Route path="/lesson1" element={<Lesson1 />} />
          <Route path="/lesson2" element={<Lesson2 />} />
          <Route path="/lesson3" element={<Lesson3 />} />
          <Route path="/lesson4" element={<Lesson4 />} />
          <Route path="/lesson5" element={<Lesson5 />} />
          <Route path="/lesson5/workshop1" element={<Workshop1 />} />
          <Route path="/lesson5/workshop2" element={<Workshop2 />} />
          <Route path="/lesson5/workshop3" element={<Workshop3 />} />
          <Route path="/lesson5/workshop4" element={<Workshop4 />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;