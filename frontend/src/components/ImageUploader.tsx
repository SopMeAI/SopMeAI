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

const ImageUploader = () => {
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div>
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
          <Button>Deploy</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ImageUploader;
