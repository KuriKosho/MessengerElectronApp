import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { updateProfile } from '@renderer/services/authService'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface ProfileFormData {
  username: string
  email: string
  password?: string
  isOnline: boolean
  isVerified: boolean
}

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProfileFormData>({
    defaultValues: {
      username: '',
      email: '',
      isOnline: false,
      isVerified: false
    }
  })

  async function onSubmit(data: ProfileFormData) {
    setIsLoading(true)
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString())
    })
    const result = await updateProfile(formData)
    setIsLoading(false)
    if (result.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'Success',
        description: result.success
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          rules={{
            required: 'Username is required',
            minLength: { value: 3, message: 'Username must be at least 3 characters' },
            maxLength: { value: 50, message: 'Username must not exceed 50 characters' }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email address'
            }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          rules={{
            minLength: { value: 8, message: 'Password must be at least 8 characters long' }
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormDescription>Leave blank to keep current password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="bg-green-400">
          {isLoading ? 'Updating...' : 'Update Profile'}
        </Button>
      </form>
    </Form>
  )
}
