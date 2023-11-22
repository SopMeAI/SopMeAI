import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { SendPromptToGpt } from "@/services/apiService";
import { GPT_API_URL } from "@/config/config";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const formSchema = z.object({
  question: z.string().min(2, {
    message: "Question cannot be empty",
  }),
});

const QuestionInput = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  });
  const [messages, setMessages] = useState<string[]>([]);
  const [disabled, setDisabled] = useState(false);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setDisabled(true);
    try {
      const response = await SendPromptToGpt(values.question, GPT_API_URL);
      if (!response.ok) {
        throw new Error("Error in sending prompt to GPT");
      }
      if (response.ok) {
        setDisabled(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setDisabled(false);
      form.reset();
    }
  }

  useEffect(() => {
    const eventSource = new EventSource(
      GPT_API_URL.replace("/questions", "/sse")
    );

    eventSource.onmessage = function (event) {
      const data = JSON.parse(event.data);

      console.log("New update from GPT-3:", data);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };
    eventSource.onopen = function () {};
    eventSource.onerror = function (error) {
      console.error("EventSource error:", error);
    };

    return () => {
      eventSource.close();
    };
  }, []);
  console.log("messages", messages);
  return (
    <div className="max-w-4xl mx-auto p-4 w-[1200px]">
      <Card className="">
        <CardHeader>
          <CardTitle>
            <CardContent>
              <div className="test-area bg-white shadow rounded p-4 max-h-80 h-64 overflow-y-auto w-">
                <p className="text-sm font-normal">{messages}</p>

                {disabled && (
                  <div className="loading">Waiting for response...</div>
                )}
              </div>
            </CardContent>
          </CardTitle>
        </CardHeader>
      </Card>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-auto"
        >
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question related to your Contract</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter question related to your contract"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={disabled} type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default QuestionInput;
