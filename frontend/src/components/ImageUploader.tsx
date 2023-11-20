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
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { sendImageToApi } from "@/services/apiService";

import { AWS_TEXTRACT_API_URL } from "@/config/config";

const ImageUploader = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<File[]>([]);

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
        const response = await sendImageToApi(images, AWS_TEXTRACT_API_URL);
        const text = await response.text();
        if (response.status !== 200) {
          console.log(
            `${response.status} Failed to analyze the contract: ${text}`
          );
          throw new Error(text);
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
      <Card>
        <CardHeader>
          <CardTitle>Insert document</CardTitle>
          <CardDescription>Insert Document or Take A Photo</CardDescription>
        </CardHeader>
        <CardContent>
          <Label
            htmlFor="picture"
            className="block text-sm font-medium text-gray-700"
          >
            Document
          </Label>
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
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleDeployClick}
          >
            Send
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ImageUploader;
