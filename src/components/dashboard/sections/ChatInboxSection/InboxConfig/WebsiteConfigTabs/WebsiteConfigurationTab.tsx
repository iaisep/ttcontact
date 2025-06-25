
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { WebsiteConfigData } from '../WebsiteConfigTypes';

interface WebsiteConfigurationTabProps {
  configData: WebsiteConfigData;
  updateConfigData: (field: keyof WebsiteConfigData, value: any) => void;
  saving: boolean;
  onSave: () => void;
}

const WebsiteConfigurationTab: React.FC<WebsiteConfigurationTabProps> = ({
  configData,
  updateConfigData,
  saving,
  onSave
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <div className="space-y-6">
          <div>
            <Label>Messenger Script</Label>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Place this button inside your body tag
            </p>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg font-mono text-sm relative">
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard('script content')}
              >
                Copy
              </Button>
              <pre className="whitespace-pre-wrap pr-16">
                {`<script>
  window.chatwootSettings = { "position":"right","type":"standard","launcherTitle":"Chat with us" };
  var BASE_URL = 'https://chatwoot.totalcontact.com.mx';
  var g=d.createElement("script"),s=d.getElementsByTagName("script")[0];
  g.type="text/javascript";g.async=!0;g.src=BASE_URL+"/packs/js/sdk.js";
  g.onload=function(){
    window.chatwootSDK.run({
      websiteToken: 'HzPShsUbLrckiXnUQzMSWr35',
      baseUrl: BASE_URL
    });
  };
  s.parentNode.insertBefore(g,s);
})(document,"script");
</script>`}
              </pre>
            </div>
          </div>

          <div>
            <Label>User Identity Validation</Label>
            <div className="mt-2 flex items-center space-x-4">
              <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm font-mono">
                {configData.userIdentityValidation}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(configData.userIdentityValidation)}
              >
                Copy
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enforce-user-identity">Enforce User Identity Validation</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                If enabled, requests that cannot be verified will be rejected.
              </p>
            </div>
            <Switch
              id="enforce-user-identity"
              checked={configData.enforceUserIdentityValidation}
              onCheckedChange={(checked) => updateConfigData('enforceUserIdentityValidation', checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteConfigurationTab;
