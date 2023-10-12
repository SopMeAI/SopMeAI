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
import { GPT_API_URL } from "@/config/config";

import sendImageToApi from "@/services/apiService";
const ImageUploader = () => {
  const { toast } = useToast();
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleDeployClick = async () => {
    if (image) {
      try {
        await sendImageToApi(image, GPT_API_URL);
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
    <div className="w-full ">
      <Card>
        <CardHeader>
          <CardTitle>Insert Image</CardTitle>
          <CardDescription>Insert Image or Take A Photo</CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="picture">Picture</Label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {image && (
            <img src={URL.createObjectURL(image)} alt="Uploaded Image" />
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleDeployClick}>Deploy</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ImageUploader;
