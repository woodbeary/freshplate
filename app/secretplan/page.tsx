'use client'

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Eye, ChevronDown, ChevronUp, Edit2, Save, X, Plus, Trash2, Loader } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const missionStages = [
  { phase: "Brand Positioning", status: "complete", dueDate: "Completed Aug 15, 2024", details: "Defined core value proposition, messaging strategy, and brand identity" },
  { phase: "MVP Development", status: "active", dueDate: "Target: Nov 30, 2024", details: "Building core features: user auth, meal planning, API integrations" },
  { phase: "Soft Launch", status: "upcoming", dueDate: "Target: Jan 15, 2025", details: "Limited release in San Francisco Bay Area, focus on user feedback" },
  { phase: "Scaling & Expansion", status: "future", dueDate: "Q2 2025", details: "Expand to new markets, implement advanced features based on user feedback" },
];

const nextSteps = [
  { 
    task: "Finalize OpenTable API Integration", 
    target: "Oct 15, 2024", 
    assignee: "Jacob", 
    details: "Implement restaurant search and dish preference selection. Challenges: Rate limiting, data normalization. Next: Error handling and edge cases.",
    badge: { text: "On Track", color: "text-green-400" }
  },
  { 
    task: "Develop AI Meal Planner", 
    target: "Nov 5, 2024", 
    assignee: "Jacob", 
    details: "Algorithm for personalized meal suggestions. Current focus: Integrating health goals with taste preferences. Next: Optimization for dietary restrictions.",
    badge: { text: "Delayed", color: "text-yellow-400" }
  },
  { 
    task: "Implement Instacart Integration", 
    target: "Nov 20, 2024", 
    assignee: "Jacob", 
    details: "Set up grocery list creation and delivery scheduling. Current challenge: Syncing inventory with meal plans. Next: Implement delivery time selection." 
  },
  { 
    task: "Design User Onboarding Flow", 
    target: "Oct 30, 2024", 
    assignee: "Anna", 
    details: "Creating intuitive process for preference selection and subscription setup. User testing scheduled for next week. Next: Iterate based on feedback." 
  },
  { 
    task: "Develop Marketing Strategy", 
    target: "Dec 10, 2024", 
    assignee: "Anna", 
    details: "Social media campaigns and influencer partnerships planned. Current focus: Finalizing launch campaign. Next: Prepare content calendar for first month post-launch.",
    badge: { text: "Ahead", color: "text-blue-400" }
  },
  { 
    task: "Set Up Analytics and Monitoring", 
    target: "Dec 20, 2024", 
    assignee: "Jacob", 
    details: "Implementing error tracking, user behavior analytics, and API usage monitoring. Current focus: Setting up Mixpanel for user journey tracking. Next: Implement custom event tracking." 
  },
];

const SecretPlanPage = () => {
  const [showConfidentialInfo, setShowConfidentialInfo] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [expandedStage, setExpandedStage] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [steps, setSteps] = useState(nextSteps);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const newTaskRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messageShown, setMessageShown] = useState(false);

  const calculateProgress = (targetDate: string) => {
    const now = new Date('2024-09-22'); // Set today's date to September 22, 2024
    const target = new Date(targetDate);
    const totalDays = 90; // Assuming a 90-day project timeline
    const daysLeft = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 3600 * 24)));
    const progress = Math.min(100, Math.max(0, Math.round(((totalDays - daysLeft) / totalDays) * 100)));
    return progress;
  };

  const handleEdit = (index: number, field: 'assignee' | 'target' | 'task' | 'details', value: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      setShowSaveDialog(true);
    } else {
      setIsEditMode(true);
    }
  };

  const showTemporaryMessage = () => {
    if (!messageShown) {
      setShowMessage(true);
      setMessageShown(true);
      setTimeout(() => setShowMessage(false), 5000); // Show for 5 seconds
    }
  };

  const addTodo = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newTodo = {
        task: "New Task",
        target: new Date().toISOString().split('T')[0],
        assignee: "Unassigned",
        details: "Task details",
      };
      setSteps([...steps, newTodo]);
      setIsLoading(false);
      newTaskRef.current?.scrollIntoView({ behavior: 'smooth' });
      setExpandedStep(steps.length);
      showTemporaryMessage();
    }, 1000);
  };

  const removeTodo = (index: number) => {
    setDeleteIndex(index);
    setShowDeleteDialog(true);
  };

  const handleSaveChanges = () => {
    console.log('Saving changes:', steps);
    setIsEditMode(false);
    setShowSaveDialog(false);
    showTemporaryMessage();
  };

  const handleDeleteTodo = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (deleteIndex !== null) {
        const newSteps = steps.filter((_, i) => i !== deleteIndex);
        setSteps(newSteps);
        setDeleteIndex(null);
      }
      setShowDeleteDialog(false);
      setIsLoading(false);
      showTemporaryMessage();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4 sm:p-6 md:p-8 font-light max-w-4xl mx-auto">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-600 to-blue-400 bg-clip-text text-transparent bg-300% animate-gradient">
            FreshPlate: Mission Control
          </h1>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleEditMode}
                  >
                    {isEditMode ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isEditMode ? 'Save changes' : 'Edit mode'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowConfidentialInfo(!showConfidentialInfo)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle confidential information</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <AnimatePresence>
          {showConfidentialInfo && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-2 text-sm text-gray-300"
            >
              This information is intended for founders and their associates only.
            </motion.p>
          )}
        </AnimatePresence>
      </header>

      <section className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-300">Mission Timeline</h2>
        <div className="space-y-4">
          {missionStages.map((stage, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 bg-opacity-50 p-3 sm:p-4 rounded-lg cursor-pointer"
              onClick={() => setExpandedStage(expandedStage === index ? null : index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-2 sm:mr-4 ${
                    stage.status === 'complete' ? 'bg-green-500' :
                    stage.status === 'active' ? 'bg-blue-500' :
                    stage.status === 'upcoming' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                  <span className="text-sm sm:text-base font-medium">{stage.phase}</span>
                </div>
                <span className="text-xs sm:text-sm text-gray-400">{stage.dueDate}</span>
              </div>
              <AnimatePresence>
                {expandedStage === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-xs sm:text-sm text-gray-300 mt-2 pt-2 border-t border-gray-700"
                  >
                    {stage.details}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-purple-300">Critical Next Steps</h2>
          {isEditMode && (
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addTodo}
                disabled={isLoading}
              >
                {isLoading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Add Task
              </Button>
            </div>
          )}
        </div>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 bg-opacity-50 p-3 sm:p-4 rounded-lg"
              ref={index === steps.length - 1 ? newTaskRef : null}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={step.task}
                      onChange={(e) => handleEdit(index, 'task', e.target.value)}
                      className="bg-gray-700 text-white px-2 py-1 rounded text-sm sm:text-base font-medium w-full"
                    />
                  ) : (
                    <span className="text-sm sm:text-base font-medium">{step.task}</span>
                  )}
                  {step.badge && (
                    <span className={`text-xs ${step.badge.color} ml-2`}>
                      {step.badge.text}
                    </span>
                  )}
                </div>
                <div className="flex items-center ml-2">
                  {isEditMode ? (
                    <input
                      type="date"
                      value={step.target}
                      onChange={(e) => handleEdit(index, 'target', e.target.value)}
                      className="bg-gray-700 text-white px-2 py-1 rounded text-xs"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">Target: {step.target}</span>
                  )}
                  {isEditMode && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTodo(index)}
                            className="ml-2"
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove task (Note: This is mock data and won't be saved)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div 
                  className="bg-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateProgress(step.target)}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-2 flex justify-between items-center">
                {isEditMode ? (
                  <input
                    type="text"
                    value={step.assignee}
                    onChange={(e) => handleEdit(index, 'assignee', e.target.value)}
                    className="bg-gray-700 text-white px-2 py-1 rounded"
                  />
                ) : (
                  <span>Assignee: {step.assignee}</span>
                )}
                <span>Progress: {calculateProgress(step.target)}%</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                >
                  {expandedStep === index ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
              <AnimatePresence>
                {expandedStep === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-xs text-gray-300 mt-2 pt-2 border-t border-gray-700"
                  >
                    {isEditMode ? (
                      <textarea
                        value={step.details}
                        onChange={(e) => handleEdit(index, 'details', e.target.value)}
                        className="bg-gray-700 text-white px-2 py-1 rounded w-full"
                        rows={3}
                      />
                    ) : (
                      step.details
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="mt-8 text-center">
        <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
          Return to Homepage
        </Link>
      </footer>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="bg-gray-900 text-white border border-gray-700 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-blue-400">Save Changes</DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to save your changes? This will exit edit mode.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              variant="outline"
              onClick={() => setShowSaveDialog(false)}
              className="bg-gray-800 text-white hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveChanges}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-gray-900 text-white border border-gray-700 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-red-400">Delete Task</DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to delete this task? This action cannot be undone.
              <br />
              <span className="text-yellow-500">Note: This is mock data and won't be permanently saved.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="bg-gray-800 text-white hover:bg-gray-700"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteTodo}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showMessage && (
        <div className="fixed bottom-4 right-4 bg-yellow-500 text-black px-4 py-2 rounded shadow-lg z-50">
          Note: Changes are not saved to a database and will be lost on refresh. - Jack
        </div>
      )}
    </div>
  );
};

export default SecretPlanPage;