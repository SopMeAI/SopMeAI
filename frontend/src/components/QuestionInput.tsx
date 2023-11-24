import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { SendPromptToGpt } from '@/services/apiService'
import { GPT_API_URL } from '@/config/config'
import { useEffect, useState } from 'react'

const formSchema = z.object({
  question: z.string().min(2, {
    message: 'Question cannot be empty',
  }),
})

const QuestionInput = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
    },
  })
  const [messages, setMessages] = useState<string[]>([])
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await SendPromptToGpt(values.question, GPT_API_URL)
      if (!response.ok) {
        throw new Error('Error in sending prompt to GPT')
      }
      console.log('Question was sent', values.question)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const eventSource = new EventSource(GPT_API_URL.replace('/questions', '/sse'))
    eventSource.onmessage = function (event) {
      const data = JSON.parse(event.data)
      console.log('New update from GPT-3:', data)
      setMessages((prevMessages) => [...prevMessages, data.message])
    }
    eventSource.onopen = function () {
      console.log('Connection question established')
    }
    // eventSource.onerror = function (error) {
    //   console.error('EventSource error:', error)
    // }
    return () => {
      eventSource.close()
    }
  }, [])
  console.log('Messages', messages)
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div>Test Area: {messages}</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question related to your Contract</FormLabel>
                <FormControl>
                  <Input placeholder="Enter question related to your contract" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default QuestionInput
