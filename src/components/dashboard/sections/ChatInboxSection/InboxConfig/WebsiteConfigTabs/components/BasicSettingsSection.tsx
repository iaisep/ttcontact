
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { WebsiteConfigData } from '../../WebsiteConfigTypes';

interface BasicSettingsSectionProps {
  configData: WebsiteConfigData;
  updateConfigData: (field: keyof WebsiteConfigData, value: any) => void;
}

const BasicSettingsSection: React.FC<BasicSettingsSectionProps> = ({
  configData,
  updateConfigData
}) => {
  // Debug logging to track data flow
  useEffect(() => {
    console.log('BasicSettingsSection - configData received:', {
      websiteName: configData.websiteName,
      websiteUrl: configData.websiteUrl,
      websiteDomain: configData.websiteDomain,
      welcomeHeading: configData.welcomeHeading,
      welcomeTagline: configData.welcomeTagline,
      widgetColor: configData.widgetColor
    });
    console.log('BasicSettingsSection - Full configData object:', configData);
  }, [configData]);

  return (
    <>
      <div>
        <Label htmlFor="website-name">Website Name</Label>
        <Input
          id="website-name"
          value={configData.websiteName || ''}
          onChange={(e) => {
            console.log('BasicSettingsSection - Updating websiteName to:', e.target.value);
            updateConfigData('websiteName', e.target.value);
          }}
          className="mt-1"
          placeholder="Enter website name"
        />
        <p className="text-xs text-gray-500 mt-1">Current value: {configData.websiteName}</p>
      </div>

      <div>
        <Label htmlFor="website-url">Website URL</Label>
        <Input
          id="website-url"
          value={configData.websiteUrl || ''}
          onChange={(e) => {
            console.log('BasicSettingsSection - Updating websiteUrl to:', e.target.value);
            updateConfigData('websiteUrl', e.target.value);
          }}
          className="mt-1"
          placeholder="https://example.com"
        />
        <p className="text-xs text-gray-500 mt-1">Current value: {configData.websiteUrl}</p>
      </div>

      <div>
        <Label htmlFor="website-domain">Website Domain</Label>
        <Input
          id="website-domain"
          value={configData.websiteDomain || ''}
          onChange={(e) => updateConfigData('websiteDomain', e.target.value)}
          className="mt-1"
          placeholder="example.com"
        />
      </div>

      <div>
        <Label htmlFor="welcome-heading">Welcome Heading</Label>
        <Input
          id="welcome-heading"
          value={configData.welcomeHeading || ''}
          onChange={(e) => {
            console.log('BasicSettingsSection - Updating welcomeHeading to:', e.target.value);
            updateConfigData('welcomeHeading', e.target.value);
          }}
          className="mt-1"
          placeholder="Welcome to our website"
        />
        <p className="text-xs text-gray-500 mt-1">Current value: {configData.welcomeHeading}</p>
      </div>

      <div>
        <Label htmlFor="welcome-tagline">Welcome Tagline</Label>
        <Textarea
          id="welcome-tagline"
          value={configData.welcomeTagline || ''}
          onChange={(e) => {
            console.log('BasicSettingsSection - Updating welcomeTagline to:', e.target.value);
            updateConfigData('welcomeTagline', e.target.value);
          }}
          className="mt-1"
          rows={3}
          placeholder="How can we help you today?"
        />
        <p className="text-sm text-gray-500 mt-1">{(configData.welcomeTagline || '').length} / 255</p>
        <p className="text-xs text-gray-500">Current value: {configData.welcomeTagline}</p>
      </div>

      <div>
        <Label htmlFor="widget-color">Widget Color</Label>
        <div className="mt-1 flex items-center space-x-2">
          <div 
            className="w-8 h-8 rounded border border-gray-300"
            style={{ backgroundColor: configData.widgetColor || '#1f93ff' }}
          ></div>
          <Input
            id="widget-color"
            type="color"
            value={configData.widgetColor || '#1f93ff'}
            onChange={(e) => {
              console.log('BasicSettingsSection - Updating widgetColor to:', e.target.value);
              updateConfigData('widgetColor', e.target.value);
            }}
            className="w-20 h-8"
          />
          <span className="text-sm text-gray-500">{configData.widgetColor || '#1f93ff'}</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Current value: {configData.widgetColor}</p>
      </div>
    </>
  );
};

export default BasicSettingsSection;
