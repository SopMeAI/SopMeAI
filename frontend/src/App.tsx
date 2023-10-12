import "./App.css";
import { Toaster } from "@/components/ui/toaster";
import ImageUploader from "@/components/ImageUploader";
import QuestionInput from "./components/QuestionInput";
function App() {
  return (
    <div className="flex flex-col items-center justify-between h-screen">
      <div>
        <ImageUploader />
      </div>
      <QuestionInput />
      <Toaster />
    </div>
  );
}

export default App;
