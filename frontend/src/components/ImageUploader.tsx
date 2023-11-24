import { useState } from "react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useToast } from "@/components/ui/use-toast";
import { sendImageToApi } from "@/services/apiService";

import { AWS_TEXTRACT_API_URL } from "@/config/config";

type ImageUploaderProps = {
  onImageLoaded: () => void;
};

const ImageUploader = ({ onImageLoaded }: ImageUploaderProps) => {
  const { toast } = useToast();
  const [images, setImages] = useState<File[]>([]);
  const [disabled, setDisabled] = useState(false);

  const [showFullResponse, setFullResponse] = useState("");
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...selectedFiles]);
    }
  };

  const resetImageList = () => {
    setImages([]);
  };
  const handleDeployClick = async () => {
    if (images) {
      try {
        setDisabled(true);
        const response = await sendImageToApi(images, AWS_TEXTRACT_API_URL);
        const text = await response.text();
        if (response.status !== 200) {
          console.log(
            `${response.status} Failed to analyze the contract: ${text}`
          );
          throw new Error(text);
        }
        console.log("text", text);
        console.log("response", response);
        setFullResponse(text);
        if (response.ok) {
          onImageLoaded();
          setDisabled(false);
        }
        // Display the result
        console.log(`Contract analyzed successfully: ${text}`);
        toast({
          title: "Message sent successfully",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong",
        });
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {showFullResponse !== "" ? (
        <div>
          {" "}
          <Card className="my-1">
            <CardHeader>
              <CardTitle>Overview of Contract</CardTitle>

              <CardContent>{showFullResponse}</CardContent>
            </CardHeader>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Insert document</CardTitle>
            <CardDescription>Insert Document or Take A Photo</CardDescription>
          </CardHeader>
          <CardContent>
            {disabled && (
              <div className="text-center">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            )}

            <input
              id="picture"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500
                 file:mr-4 file:py-2 file:px-4
                 file:border-0 file:text-sm file:font-semibold
                 file:bg-violet-50 file:text-violet-700
                 hover:file:bg-violet-100"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {images.map((image, index) => (
                <div key={index} className="w-60 h-60 relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Uploaded Image ${index + 1}`}
                    className="object-cover w-full h-full rounded-lg shadow-sm"
                  />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between mt-4">
            <Button
              variant="outline"
              className="bg-transparent hover:bg-gray-100 text-gray-700 border-gray-300"
              onClick={resetImageList}
            >
              Cancel
            </Button>
            <Button
              disabled={disabled}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleDeployClick}
            >
              Send
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ImageUploader;
