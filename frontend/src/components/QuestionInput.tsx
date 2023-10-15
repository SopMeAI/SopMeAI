import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QuestionInput = () => {
  return (
    <div className="flex w-full max-w-6xl items-center space-x-2">
      <Input type="email" placeholder="Email" />
      <Button type="submit">Subscribe</Button>
    </div>
  );
};

export default QuestionInput;
