import "./App.css";
import { Toaster } from "@/components/ui/toaster";
import ImageUploader from "@/components/ImageUploader";
import QuestionInput from "@/components/QuestionInput";
import IntroductionText from "@/components/IntroductionText";
import { useState } from "react";

function App() {
  const [showQuestionInput, setShowQuestionInput] = useState(false);
  function handleImageLoaded() {
    setShowQuestionInput(true);
  }
  return (
    <div>
      <div className="flex flex-col justify-center items-center mt-4">
        <div className="w-full max-w-4xl">
          <IntroductionText />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-4xl mb-8">
          <ImageUploader onImageLoaded={handleImageLoaded} />
        </div>
        {showQuestionInput && (
          <div className="flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-4xl">
              <QuestionInput />
            </div>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
}

export default App;
