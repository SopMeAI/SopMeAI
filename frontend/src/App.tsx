import './App.css'
import { Toaster } from '@/components/ui/toaster'
import ImageUploader from '@/components/ImageUploader'
import QuestionInput from '@/components/QuestionInput'
import NavigationBar from '@/components/NavigationBar'
import IntroductionText from '@/components/IntroductionText'
import { useState } from 'react'

function App() {
  const [uploaded, setUploaded] = useState(false)
  return (
    <div>
      <div className="w-full max-w-full">
        <NavigationBar />
      </div>
      <div className="flex flex-col justify-center items-center mt-4">
        <div className="w-full max-w-4xl">
          <IntroductionText />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-4xl mb-8">
          <ImageUploader setUploaded={setUploaded} />
        </div>
        {uploaded && (
          <div className="w-full max-w-xl">
            <QuestionInput />
          </div>
        )}
        <Toaster />
      </div>
    </div>
  )
}

export default App
