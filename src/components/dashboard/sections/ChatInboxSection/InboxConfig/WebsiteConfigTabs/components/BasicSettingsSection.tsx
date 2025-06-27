
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
  // Debug logging
  useEffect(() => {
    console.log('BasicSettingsSection - configData received:', {
      websiteName: configData.websiteName,
      websiteUrl: configData.websiteUrl,
      websiteDomain: configData.websiteDomain,
      welcomeHeading: configData.welcomeHeading,
      welcomeTagline: configData.welcomeTagline,
      widgetColor: configData.widgetColor
    });
  }, [configData]);

  return (
    <>
      <div>
        <Label htmlFor="website-name">Website Name</Label>
        <Input
          id="website-name"
          value={configData.websiteName || ''}
          onChange={(e) => updateConfigData('websiteName', e.target.value)}
          className="mt-1"
          placeholder="Enter website name"
        />
      </div>

      <div>
        <Label htmlFor="website-url">Website URL</Label>
        <Input
          id="website-url"
          value={configData.websiteUrl || ''}
          onChange={(e) => updateConfigData('websiteUrl', e.target.value)}
          className="mt-1"
          placeholder="https://example.com"
        />
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
          onChange={(e) => updateConfigData('welcomeHeading', e.target.value)}
          className="mt-1"
          placeholder="Welcome to our website"
        />
      </div>

      <div>
        <Label htmlFor="welcome-tagline">Welcome Tagline</Label>
        <Textarea
          id="welcome-tagline"
          value={configData.welcomeTagline || ''}
          onChange={(e) => updateConfigData('welcomeTagline', e.target.value)}
          className="mt-1"
          rows={3}
          placeholder="How can we help you today?"
        />
        <p className="text-sm text-gray-500 mt-1">{(configData.welcomeTagline || '').length} / 255</p>
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
            onChange={(e) => updateConfigData('widgetColor', e.target.value)}
            className="w-20 h-8"
          />
          <span className="text-sm text-gray-500">{configData.widgetColor || '#1f93ff'}</span>
        </div>
      </div>
    </>
  );
};

export default BasicSettingsSection;
