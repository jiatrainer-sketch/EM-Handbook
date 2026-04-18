import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import Content from '@/pages/Content';
import Tools from '@/pages/Tools';
import Symptoms from '@/pages/Symptoms';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <main className="container max-w-screen-sm py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/content/:id" element={<Content />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/symptoms" element={<Symptoms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
