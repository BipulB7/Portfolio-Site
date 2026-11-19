import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { IntroProvider } from "./context/IntroContext";
import { SmoothScroll } from "./components/SmoothScroll";
import { Toaster } from "./components/ui/Toaster";

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <IntroProvider>
        <SmoothScroll>
          <BrowserRouter>
            <Routes>
              <Route index element={<Home />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </SmoothScroll>
      </IntroProvider>
    </MotionConfig>
  );
}

export default App;
