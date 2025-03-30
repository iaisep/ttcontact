
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Upload } from "lucide-react";
import { toast } from 'sonner';
import { User } from './types';
import { useLanguage } from '@/context/LanguageContext';

interface ProfileTabProps {
  currentUser: User | null;
}

const ProfileTab = ({ currentUser }: ProfileTabProps) => {
  const { t } = useLanguage();
  const [editingUser, setEditingUser] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
  });

  const updateUserProfile = async () => {
    try {
      // Logic would be implemented here for actual API calls
      toast.success(t('Profile updated successfully'));
      setEditingUser(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(t('Failed to update profile'));
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
          <CardTitle>{t('profile_information')}</CardTitle>
          <CardDescription>
            {t('manage_personal_info')}
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
                {t('Change Avatar')}
              </Button>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('name')}</Label>
                {editingUser ? (
                  <Input
                    id="name"
                    value={userFormData.name}
                    onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                    placeholder={t('Your full name')}
                  />
                ) : (
                  <div className="flex justify-between items-center">
                    <p className="text-lg">{currentUser?.name}</p>
                    <Button variant="ghost" size="sm" onClick={() => setEditingUser(true)}>
                      {t('edit')}
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                {editingUser ? (
                  <Input
                    id="email"
                    type="email"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    placeholder={t('Your email address')}
                  />
                ) : (
                  <p className="text-lg">{currentUser?.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>{t('role')}</Label>
                <p className="text-lg capitalize">{currentUser?.role}</p>
              </div>
              
              <div className="space-y-2">
                <Label>{t('member_since')}</Label>
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
                    {t('cancel')}
                  </Button>
                  <Button onClick={updateUserProfile}>
                    <Save className="h-4 w-4 mr-2" />
                    {t('save')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('security')}</CardTitle>
          <CardDescription>
            {t('manage_security')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t('password')}</Label>
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">••••••••••••</p>
              <Button variant="outline" size="sm">
                {t('change_password')}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>{t('two_factor')}</Label>
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">{t('not_enabled')}</p>
              <Button variant="outline" size="sm">
                {t('enable_2fa')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
