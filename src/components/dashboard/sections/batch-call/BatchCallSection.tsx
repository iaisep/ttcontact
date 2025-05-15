
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Agent } from './types';
import FileUploadStep from './FileUploadStep';
import AgentSelectionStep from './AgentSelectionStep';
import BatchCallHistory from './BatchCallHistory';
import BatchCallGuide from './BatchCallGuide';
import { useBatchCallData } from '../analytics/hooks/useBatchCallData';

const BatchCallSection = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'agent' | 'history'>('upload');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  // Get batch call data using the hook
  const { batches, batchAgents } = useBatchCallData();
  
  // Reset the form
  const resetForm = () => {
    setUploadedFile(null);
    setFilePreview(null);
    setCurrentStep('upload');
    setSelectedAgent('');
  };

  // Move to the agent selection step
  const handleContinueToAgent = () => {
    setCurrentStep('agent');
  };

  // Move back to the upload step
  const handleBackToUpload = () => {
    setCurrentStep('upload');
  };

  // Complete the batch call process
  const handleBatchCallComplete = () => {
    setCurrentStep('history');
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Batch Call</h2>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>
            Upload Contacts
          </CardTitle>
          <p className="text-muted-foreground">
            Upload a CSV or JSON file with phone numbers to make batch calls.
          </p>
        </CardHeader>
        <CardContent>
          {currentStep === 'upload' && (
            <FileUploadStep 
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
              filePreview={filePreview}
              setFilePreview={setFilePreview}
              onContinue={handleContinueToAgent}
            />
          )}
          
          {currentStep === 'agent' && (
            <AgentSelectionStep 
              agents={agents}
              selectedAgent={selectedAgent}
              setSelectedAgent={setSelectedAgent}
              onBack={handleBackToUpload}
              onStartBatch={handleBatchCallComplete}
              loading={loading}
            />
          )}
          
          {currentStep === 'history' && (
            <div className="space-y-4">
              <BatchCallHistory 
                batches={batches}
                agents={batchAgents}
              />
              <div className="flex justify-end">
                <Button onClick={() => setCurrentStep('upload')}>
                  Start New Batch Call
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <BatchCallGuide />
    </div>
  );
};

export default BatchCallSection;
