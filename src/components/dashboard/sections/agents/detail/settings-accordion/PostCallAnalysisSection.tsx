
import React, { useState } from 'react';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { BarChart3, Cog, Edit, Plus, Radio, TextIcon, Hash, ToggleLeft, Trash, ChevronDown, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { AccordionSectionProps } from './types';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PostCallAnalysisItem } from '@/components/dashboard/sections/agents/types/retell-types';

// Define modal interface for better type safety
interface FieldModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (item: PostCallAnalysisItem) => void;
  type: string;
  existingItem?: PostCallAnalysisItem;
}

// Base field modal for Text and Number types
const TextFieldModal: React.FC<FieldModalProps> = ({ open, onClose, onSave, type, existingItem }) => {
  const [name, setName] = useState(existingItem?.name || '');
  const [description, setDescription] = useState(existingItem?.description || '');
  const [formatExamples, setFormatExamples] = useState<string[]>(existingItem?.examples || []);
  const [newExample, setNewExample] = useState('');

  const handleAddExample = () => {
    if (!newExample.trim()) return;
    setFormatExamples([...formatExamples, newExample.trim()]);
    setNewExample('');
  };

  const handleRemoveExample = (index: number) => {
    setFormatExamples(formatExamples.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    
    const item: PostCallAnalysisItem = {
      type: type,
      name: name.trim(),
      description: description.trim(),
      examples: formatExamples,
    };
    
    onSave(item);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex items-center">
          <DialogTitle className="flex items-center gap-2">
            {type === 'text' && <TextIcon className="h-4 w-4" />}
            {type === 'number' && <Hash className="h-4 w-4" />}
            {type === 'text' ? 'Text' : 'Number'}
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 rounded-sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g., detailed_call_summary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Describe what information should be extracted"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Format Examples (Optional)</Label>
            <div className="space-y-2">
              {formatExamples.map((example, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={example} readOnly className="flex-1" />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveExample(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="flex items-center gap-2">
                <Input 
                  value={newExample} 
                  onChange={(e) => setNewExample(e.target.value)} 
                  placeholder="Add a format example"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddExample();
                    }
                  }}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddExample}
                >
                  + Add
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Selector field modal (dropdown selector)
const SelectorFieldModal: React.FC<FieldModalProps> = ({ open, onClose, onSave, existingItem }) => {
  const [name, setName] = useState(existingItem?.name || '');
  const [description, setDescription] = useState(existingItem?.description || '');
  const [choices, setChoices] = useState<string[]>(existingItem?.examples || []);
  const [newChoice, setNewChoice] = useState('');

  const handleAddChoice = () => {
    if (!newChoice.trim()) return;
    setChoices([...choices, newChoice.trim()]);
    setNewChoice('');
  };

  const handleRemoveChoice = (index: number) => {
    setChoices(choices.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim() || choices.length === 0) return;
    
    const item: PostCallAnalysisItem = {
      type: 'selector',
      name: name.trim(),
      description: description.trim(),
      examples: choices,
    };
    
    onSave(item);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex items-center">
          <DialogTitle className="flex items-center gap-2">
            <Radio className="h-4 w-4" />
            Selector
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 rounded-sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g., customer_type"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Describe what information should be selected"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Choices</Label>
            <div className="space-y-2">
              {choices.map((choice, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={choice} readOnly className="flex-1" />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveChoice(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="flex items-center gap-2">
                <Input 
                  value={newChoice} 
                  onChange={(e) => setNewChoice(e.target.value)} 
                  placeholder="Add a new choice"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddChoice();
                    }
                  }}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddChoice}
                >
                  + Add
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            onClick={handleSave}
            disabled={!name.trim() || choices.length === 0}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Boolean field modal (Yes/No)
const BooleanFieldModal: React.FC<FieldModalProps> = ({ open, onClose, onSave, existingItem }) => {
  const [name, setName] = useState(existingItem?.name || '');
  const [description, setDescription] = useState(existingItem?.description || '');

  const handleSave = () => {
    if (!name.trim()) return;
    
    const item: PostCallAnalysisItem = {
      type: 'boolean',
      name: name.trim(),
      description: description.trim(),
      examples: [],
    };
    
    onSave(item);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex items-center">
          <DialogTitle className="flex items-center gap-2">
            <ToggleLeft className="h-4 w-4" />
            Yes/No
          </DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 rounded-sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g., appointment_booked"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Ask a yes/no question to be answered from the call"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            onClick={handleSave}
            disabled={!name.trim()}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const PostCallAnalysisSection: React.FC<AccordionSectionProps> = ({ agent, updateAgentField }) => {
  const { t } = useLanguage();
  const [modalType, setModalType] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<PostCallAnalysisItem | undefined>(undefined);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Initialize post-call data from agent if it exists or empty array if not
  const postCallData = agent.post_call_analysis_data || [];
  const analysisModel = agent.post_call_analysis_model || 'gpt-4o-mini';
  
  const handleOpenModal = (type: string) => {
    setModalType(type);
    setEditingItem(undefined);
    setEditingIndex(null);
    setIsMenuOpen(false);
  };
  
  const handleCloseModal = () => {
    setModalType(null);
    setEditingItem(undefined);
    setEditingIndex(null);
  };
  
  const handleEditItem = (item: PostCallAnalysisItem, index: number) => {
    setModalType(item.type);
    setEditingItem(item);
    setEditingIndex(index);
  };

  const handleSaveItem = (item: PostCallAnalysisItem) => {
    let updatedData: PostCallAnalysisItem[];
    
    if (editingIndex !== null) {
      // Update existing item
      updatedData = [...postCallData];
      updatedData[editingIndex] = item;
    } else {
      // Add new item
      updatedData = [...postCallData, item];
    }
    
    updateAgentField('post_call_analysis_data', updatedData);
    handleCloseModal();
  };
  
  const handleDeleteItem = (index: number) => {
    const updatedData = postCallData.filter((_, i) => i !== index);
    updateAgentField('post_call_analysis_data', updatedData);
  };
  
  const handleModelChange = (model: string) => {
    updateAgentField('post_call_analysis_model', model);
  };

  return (
    <AccordionItem value="post-call-analysis" className="mt-4 border rounded-md overflow-hidden">
      <AccordionTrigger className="px-4 py-2 text-sm font-medium bg-gray-50 hover:bg-gray-100 flex items-center">
        <BarChart3 className="h-4 w-4 mr-2" />
        {t('post_call_analysis')}
      </AccordionTrigger>
      <AccordionContent className="p-4">
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-medium text-amber-600">Post Call Data Retrieval</Label>
            <p className="text-xs text-gray-500">Define the information that you need to extract from the call. (Learn more)</p>
          </div>

          <div className="space-y-2">
            {/* Data Retrieval Items */}
            {postCallData.map((item, index) => (
              <div 
                key={`${item.name}-${index}`} 
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
              >
                <div className="flex items-center">
                  {item.type === 'text' && <TextIcon className="h-4 w-4 mr-2 text-gray-500" />}
                  {item.type === 'selector' && <Radio className="h-4 w-4 mr-2 text-gray-500" />}
                  {item.type === 'boolean' && <ToggleLeft className="h-4 w-4 mr-2 text-gray-500" />}
                  {item.type === 'number' && <Hash className="h-4 w-4 mr-2 text-gray-500" />}
                  <span className="text-sm">{item.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => handleEditItem(item, index)}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => handleDeleteItem(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="relative">
              <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs">
                    <Plus className="h-3 w-3 mr-1" /> Add
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-36">
                  <DropdownMenuItem onClick={() => handleOpenModal('text')}>
                    <TextIcon className="h-4 w-4 mr-2" />
                    <span>Text</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleOpenModal('selector')}>
                    <Radio className="h-4 w-4 mr-2" />
                    <span>Selector</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleOpenModal('boolean')}>
                    <ToggleLeft className="h-4 w-4 mr-2" />
                    <span>Boolean</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleOpenModal('number')}>
                    <Hash className="h-4 w-4 mr-2" />
                    <span>Number</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex items-center">
              <Select 
                value={analysisModel} 
                onValueChange={handleModelChange}
              >
                <SelectTrigger className="h-8 border-none hover:bg-gray-50 text-xs flex items-center gap-1 w-auto">
                  <Cog className="h-4 w-4 text-gray-400" />
                  <span>{analysisModel === 'gpt-4o' ? 'GPT-4o' : 'GPT-4o Mini'}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o-mini">
                    <div className="flex items-center">
                      <span>GPT-4o Mini</span>
                      <span className="ml-2 text-xs text-gray-500">(Free)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="gpt-4o">
                    <div className="flex items-center">
                      <span>GPT-4o</span>
                      <span className="ml-2 text-xs text-gray-500">($0.017/session)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Modals for adding/editing fields */}
          {modalType === 'text' && (
            <TextFieldModal
              open={modalType === 'text'}
              onClose={handleCloseModal}
              onSave={handleSaveItem}
              type="text"
              existingItem={editingItem}
            />
          )}
          
          {modalType === 'number' && (
            <TextFieldModal
              open={modalType === 'number'}
              onClose={handleCloseModal}
              onSave={handleSaveItem}
              type="number"
              existingItem={editingItem}
            />
          )}
          
          {modalType === 'selector' && (
            <SelectorFieldModal
              open={modalType === 'selector'}
              onClose={handleCloseModal}
              onSave={handleSaveItem}
              type="selector"
              existingItem={editingItem}
            />
          )}
          
          {modalType === 'boolean' && (
            <BooleanFieldModal
              open={modalType === 'boolean'}
              onClose={handleCloseModal}
              onSave={handleSaveItem}
              type="boolean"
              existingItem={editingItem}
            />
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PostCallAnalysisSection;
