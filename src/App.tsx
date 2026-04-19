import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from '@/components/common/Layout';
import Home from '@/pages/Home';
import Search from '@/pages/Search';
import Content from '@/pages/Content';
import Browse from '@/pages/Browse';
import Tools from '@/pages/Tools';
import PreopHelper from '@/pages/PreopHelper';
import ConsultReply from '@/pages/ConsultReply';
import VentilatorQuickStart from '@/pages/VentilatorQuickStart';
import NIHSSCalculator from '@/pages/NIHSSCalculator';
import DoseCalculator from '@/pages/DoseCalculator';
import AbgAnalyzer from '@/pages/AbgAnalyzer';
import Symptoms from '@/pages/Symptoms';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/content/:id" element={<Content />} />
          <Route path="/browse/:category" element={<Browse />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/preop" element={<PreopHelper />} />
          <Route path="/tools/consult" element={<ConsultReply />} />
          <Route path="/tools/ventilator" element={<VentilatorQuickStart />} />
          <Route path="/tools/nihss" element={<NIHSSCalculator />} />
          <Route path="/tools/dose-calc" element={<DoseCalculator />} />
          <Route path="/tools/abg" element={<AbgAnalyzer />} />
          <Route path="/symptoms" element={<Symptoms />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
