import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, User } from "lucide-react";

export interface Person {
  name: string;
  description: string;
}

interface PeopleManagerProps {
  maxPeople: number;
  people: Person[];
  onChange: (people: Person[]) => void;
}

export function PeopleManager({ maxPeople, people, onChange }: PeopleManagerProps) {
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const addPerson = () => {
    if (people.length >= maxPeople || !newName.trim()) return;
    
    onChange([...people, { 
      name: newName.trim(), 
      description: newDescription.trim() 
    }]);
    
    setNewName('');
    setNewDescription('');
  };

  const removePerson = (index: number) => {
    const newPeople = [...people];
    newPeople.splice(index, 1);
    onChange(newPeople);
  };

  return (
    <div className="space-y-4">
      {people.map((person, index) => (
        <div 
          key={index}
          className="flex items-start gap-3 p-3 bg-white rounded-lg border group hover:border-green-200 transition-colors"
        >
          <User className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
          <div className="flex-grow min-w-0">
            <h4 className="font-medium text-gray-900">{person.name}</h4>
            {person.description && (
              <p className="text-sm text-gray-600 mt-1 break-words">{person.description}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => removePerson(index)}
          >
            <X className="h-4 w-4 text-gray-400 hover:text-red-400" />
          </Button>
        </div>
      ))}

      {people.length < maxPeople && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-grow"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={addPerson}
              disabled={!newName.trim()}
              className="flex-shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            placeholder="Optional details (e.g., dietary preferences, age, relationship)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="text-sm"
            rows={2}
          />
          <p className="text-xs text-gray-500">
            {people.length} of {maxPeople} people added
          </p>
        </div>
      )}
    </div>
  );
} 