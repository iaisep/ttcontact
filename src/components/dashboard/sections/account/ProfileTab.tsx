
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Upload } from "lucide-react";
import { toast } from 'sonner';
import { User } from './types';

interface ProfileTabProps {
  currentUser: User | null;
}

const ProfileTab = ({ currentUser }: ProfileTabProps) => {
  const [editingUser, setEditingUser] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
  });

  const updateUserProfile = async () => {
    try {
      // Logic would be implemented here for actual API calls
      toast.success('Profile updated successfully');
      setEditingUser(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Manage your personal account information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={currentUser?.avatar_url} />
                <AvatarFallback className="text-2xl">
                  {currentUser?.name ? getInitials(currentUser.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Change Avatar
              </Button>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                {editingUser ? (
                  <Input
                    id="name"
                    value={userFormData.name}
                    onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                    placeholder="Your full name"
                  />
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-lg">{currentUser?.name}</p>
                    <Button variant="ghost" size="sm" onClick={() => setEditingUser(true)}>
                      Edit
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {editingUser ? (
                  <Input
                    id="email"
                    type="email"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    placeholder="Your email address"
                  />
                ) : (
                  <p className="text-lg">{currentUser?.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Role</Label>
                <p className="text-lg capitalize">{currentUser?.role}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Member Since</Label>
                <p className="text-lg">
                  {currentUser?.created_at 
                    ? new Date(currentUser.created_at).toLocaleDateString() 
                    : '-'}
                </p>
              </div>
              
              {editingUser && (
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => {
                    setEditingUser(false);
                    setUserFormData({
                      name: currentUser?.name || '',
                      email: currentUser?.email || '',
                    });
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={updateUserProfile}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Password</Label>
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">••••••••••••</p>
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Two-Factor Authentication</Label>
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">Not enabled</p>
              <Button variant="outline" size="sm">
                Enable 2FA
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
