
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Lock, Loader2, QrCode, Copy, Check, ShieldCheck } from "lucide-react";
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

interface TwoFactorAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  is2FAEnabled: boolean;
}

export const TwoFactorAuthDialog = ({ 
  open, 
  onOpenChange,
  is2FAEnabled
}: TwoFactorAuthDialogProps) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<'setup' | 'verify' | 'disable'>('setup');
  const [qrCode, setQrCode] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // If 2FA is already enabled, show the disable option
  useEffect(() => {
    if (is2FAEnabled) {
      setStep('disable');
    } else {
      setStep('setup');
    }
  }, [is2FAEnabled, open]);

  // Setup 2FA
  const setupTwoFactor = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      });

      if (error) throw error;

      if (data?.totp) {
        setQrCode(data.totp.qr_code);
        setSecretKey(data.totp.secret);
      }
    } catch (error: any) {
      toast.error(error?.message || t('failed_to_setup_2fa'));
    } finally {
      setIsLoading(false);
    }
  };

  // Start setup on dialog open
  useEffect(() => {
    if (open && step === 'setup' && !is2FAEnabled) {
      setupTwoFactor();
    }
  }, [open, step, is2FAEnabled]);

  // Verify 2FA setup
  const verifySetup = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.challenge({ 
        factorId: 'totp',
      });
      
      if (error) throw error;
      
      const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({ 
        factorId: 'totp',
        challengeId: data.id,
        code: verificationCode 
      });
      
      if (verifyError) throw verifyError;
      
      toast.success(t('2fa_enabled_successfully'));
      onOpenChange(false);
      // Reload page to refresh authentication state
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.message || t('invalid_verification_code'));
    } finally {
      setIsLoading(false);
    }
  };

  // Disable 2FA
  const disableTwoFactor = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.mfa.unenroll({
        factorId: 'totp',
      });
      
      if (error) throw error;
      
      toast.success(t('2fa_disabled_successfully'));
      onOpenChange(false);
      // Reload page to refresh authentication state
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.message || t('failed_to_disable_2fa'));
    } finally {
      setIsLoading(false);
    }
  };

  // Copy secret key to clipboard
  const copySecretKey = async () => {
    try {
      await navigator.clipboard.writeText(secretKey);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error(t('failed_to_copy'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[485px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            {is2FAEnabled ? t('disable_2fa') : t('enable_2fa')}
          </DialogTitle>
        </DialogHeader>
        
        {step === 'setup' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('scan_qr_code_with_authenticator')}
            </p>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <>
                {qrCode && (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div 
                      className="bg-white p-4 rounded-md"
                      dangerouslySetInnerHTML={{ __html: qrCode }}
                    />
                    
                    <div className="w-full space-y-2">
                      <Label>{t('secret_key')}</Label>
                      <div className="flex">
                        <Input 
                          value={secretKey} 
                          readOnly 
                          className="font-mono text-sm"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon" 
                          className="ml-2" 
                          onClick={copySecretKey}
                        >
                          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t('manual_entry_key')}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
            
            <div className="space-y-2">
              <Button 
                className="w-full" 
                onClick={() => setStep('verify')}
                disabled={isLoading || !qrCode}
              >
                <QrCode className="h-4 w-4 mr-2" />
                {t('continue_to_verification')}
              </Button>
            </div>
          </div>
        )}
        
        {step === 'verify' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('enter_verification_code')}
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="verificationCode">{t('verification_code')}</Label>
              <Input
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="000000"
                className="text-center font-mono text-lg tracking-widest"
                maxLength={6}
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep('setup')}
              >
                {t('back')}
              </Button>
              <Button 
                onClick={verifySetup}
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('verify')}
              </Button>
            </DialogFooter>
          </div>
        )}
        
        {step === 'disable' && (
          <div className="space-y-4">
            <Alert>
              <AlertTitle>{t('warning')}</AlertTitle>
              <AlertDescription>
                {t('disable_2fa_warning')}
              </AlertDescription>
            </Alert>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                {t('cancel')}
              </Button>
              <Button 
                variant="destructive"
                onClick={disableTwoFactor}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('disable_2fa')}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TwoFactorAuthDialog;
