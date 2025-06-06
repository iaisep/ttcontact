
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Upload } from "lucide-react";
import { useLanguage } from '@/context/LanguageContext';
import { PasswordChangeDialog } from './PasswordChangeDialog';
import TwoFactorAuthDialog from './TwoFactorAuthDialog';
import { Profile, useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';

interface ProfileTabProps {
  currentUser: Profile | null;
}

const ProfileTab = ({ currentUser }: ProfileTabProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { updateProfile } = useProfile(user?.id);
  const [editingUser, setEditingUser] = useState(false);
  const [userFormData, setUserFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
  });
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);

  const handleUpdateProfile = async () => {
    const success = await updateProfile(userFormData);
    if (success) {
      setEditingUser(false);
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

  // Update form data when currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setUserFormData({
        name: currentUser.name,
        email: currentUser.email,
      });
    }
  }, [currentUser]);

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
                    disabled // Email changes should be handled differently
                  />
                ) : (
                  <p className="text-lg">{currentUser?.email}</p>
                )}
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
                    if (currentUser) {
                      setUserFormData({
                        name: currentUser.name,
                        email: currentUser.email,
                      });
                    }
                  }}>
                    {t('cancel')}
                  </Button>
                  <Button onClick={handleUpdateProfile}>
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
              <Button variant="outline" size="sm" onClick={() => setPasswordDialogOpen(true)}>
                {t('change_password')}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>{t('two_factor')}</Label>
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">
                {currentUser?.mfa_enabled ? t('enabled') : t('not_enabled')}
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setTwoFactorDialogOpen(true)}
              >
                {currentUser?.mfa_enabled ? t('disable_2fa') : t('enable_2fa')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <PasswordChangeDialog 
        open={passwordDialogOpen} 
        onOpenChange={setPasswordDialogOpen} 
      />
      
      <TwoFactorAuthDialog
        open={twoFactorDialogOpen}
        onOpenChange={setTwoFactorDialogOpen}
        is2FAEnabled={!!currentUser?.mfa_enabled}
      />
    </div>
  );
};

export default ProfileTab;
