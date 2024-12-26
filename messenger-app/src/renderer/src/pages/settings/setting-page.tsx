import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/use-toast'
import { DeleteAccountModal } from '@renderer/components/delete-account-modal'
import Layout from '@renderer/components/layout'
import { ProfileForm } from '@renderer/components/profile-form'
import { ScrollArea } from '@renderer/components/ui/scroll-area'
import { Switch } from '@renderer/components/ui/switch'
import { useState } from 'react'

export default function SettingsPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.classList.toggle('dark')
  }

  const deleteAccount = () => {
    // Here you would typically call an API to delete the account
    toast({
      title: 'Account Deleted',
      description: 'Your account has been successfully deleted.',
      variant: 'destructive'
    })
  }

  return (
    <div className="flex flex-row h-full w-full">
      <Layout />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <ScrollArea className="h-full">
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="theme">Theme</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Update your profile information here.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="theme">
              <Card>
                <CardHeader>
                  <CardTitle>Theme Settings</CardTitle>
                  <CardDescription>Customize the appearance of the application.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="theme-mode"
                      checked={theme === 'dark'}
                      onCheckedChange={toggleTheme}
                    />
                    <Label htmlFor="theme-mode">Dark Mode</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Manage your privacy preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="online-status" />
                      <Label htmlFor="online-status">Show Online Status</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="email-visibility" />
                      <Label htmlFor="email-visibility">Make Email Visible</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                  <CardDescription>Information about the application.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    This is a sample settings page created with Next.js and shadcn/ui components.
                  </p>
                  <p>Version: 1.0.0</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <DeleteAccountModal onConfirm={deleteAccount} />
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground text-black">
                This action cannot be undone. Please be certain.
              </p>
            </CardFooter>
          </Card>
        </ScrollArea>
      </div>
    </div>
  )
}
