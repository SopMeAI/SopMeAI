import "./App.css";
import { Toaster } from "@/components/ui/toaster";
import ImageUploader from "@/components/ImageUploader";
import QuestionInput from "./components/QuestionInput";
function App() {
  return (
    <div className="flex flex-col justify-center items-center h-screen p-4">
      <div className="w-full max-w-4xl mb-8">
        <ImageUploader />
      </div>
      <div className="w-full max-w-xl">
        <QuestionInput />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
