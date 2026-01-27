import { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "../../../../lib/utils";


// Unified type: Question with optional answer
export interface QuestionWithAnswer {
  id: string;
  type: "radio" | "checkbox" | "input";
  question: string;
  options?: string[]; // For radio and checkbox
  placeholder?: string; // For input
  answer?: string | string[]; // Optional answer - gets updated as user progresses
}


type AnswerValue = string | string[] | { option: string; custom: string } | { options: string[]; custom: string };

interface QuizProps {
  questions: QuestionWithAnswer[];
  onSubmit: (questionsWithAnswers: QuestionWithAnswer[]) => void;
  isSubmitting?: boolean;
}

const OTHER_OPTION = "Other";

// Helper to format answer for submission
const formatAnswer = (answer: AnswerValue, type: "radio" | "checkbox" | "input"): string | string[] => {
  if (type === "radio") {
    if (typeof answer === "object" && answer !== null && "option" in answer) {
      const radioAnswer = answer as { option: string; custom: string };
      return radioAnswer.option === OTHER_OPTION 
        ? `Other: ${radioAnswer.custom}` 
        : radioAnswer.option;
    }
    return answer as string;
  }
  
  if (type === "checkbox") {
    if (Array.isArray(answer)) {
      return answer;
    }
    if (typeof answer === "object" && answer !== null && "options" in answer) {
      const checkboxAnswer = answer as { options: string[]; custom: string };
      return checkboxAnswer.options.map((opt) => 
        opt === OTHER_OPTION ? `Other: ${checkboxAnswer.custom}` : opt
      );
    }
    return [];
  }
  
  return (answer as string) || "";
};

const Quiz = ({ questions, onSubmit, isSubmitting = false }: QuizProps) => {
  // Initialize with questions, answers are optional
  const [questionsWithAnswers, setQuestionsWithAnswers] = useState<QuestionWithAnswer[]>(() =>
    questions.map((q) => ({
      id: q.id,
      type: q.type,
      question: q.question,
      options: q.options,
      placeholder: q.placeholder,
      // answer is optional, starts undefined
    }))
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [otherInputs, setOtherInputs] = useState<Record<string, string>>({});
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const loadingMessages = [
    "Crafting your personalized cover letter...",
    "Analyzing your responses...",
    "Tailoring content to match the job...",
    "Almost there...",
    "Polishing the final details...",
  ];

  const currentQuestion = questionsWithAnswers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questionsWithAnswers.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;
  
  // Get current answer value (internal format for state management)
  const getCurrentAnswerValue = (): AnswerValue => {
    const answer = currentQuestion.answer;
    if (!answer) {
      return currentQuestion.type === "checkbox" ? [] : "";
    }
    return answer;
  };

  const currentAnswer = getCurrentAnswerValue();

  // Update answer in questionsWithAnswers array
  const updateAnswer = (questionId: string, value: AnswerValue) => {
    setQuestionsWithAnswers((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          // Format the answer for storage
          const formatted = formatAnswer(value, q.type);
          return {
            ...q,
            answer: formatted,
          };
        }
        return q;
      })
    );
  };

  const handleRadioChange = (value: string) => {
    if (value === OTHER_OPTION) {
      updateAnswer(currentQuestion.id, { option: OTHER_OPTION, custom: otherInputs[currentQuestion.id] || "" });
      // Don't auto-advance for "Other" option - user needs to fill input first
    } else {
      const newOtherInputs = { ...otherInputs };
      delete newOtherInputs[currentQuestion.id];
      setOtherInputs(newOtherInputs);
      updateAnswer(currentQuestion.id, value);
      // Auto-advance to next question when a regular option is selected
      if (!isLastQuestion) {
        setTimeout(() => {
          handleNext();
        }, 100); // Small delay to ensure state update completes
      }
    }
  };

  const handleCheckboxChange = (value: string) => {
    const currentValues = currentAnswer;
    let currentOptions: string[] = [];
    
    if (Array.isArray(currentValues)) {
      currentOptions = currentValues;
    } else if (typeof currentValues === "object" && currentValues !== null && "options" in currentValues) {
      currentOptions = currentValues.options;
    }
    
    if (value === OTHER_OPTION) {
      const isOtherSelected = currentOptions.includes(OTHER_OPTION);
      if (isOtherSelected) {
        const newValues = currentOptions.filter((v) => v !== OTHER_OPTION);
        const newOtherInputs = { ...otherInputs };
        delete newOtherInputs[currentQuestion.id];
        setOtherInputs(newOtherInputs);
        updateAnswer(currentQuestion.id, newValues);
      } else {
        const newValues = [...currentOptions, OTHER_OPTION];
        updateAnswer(currentQuestion.id, { options: newValues, custom: otherInputs[currentQuestion.id] || "" });
      }
    } else {
      const newValues = currentOptions.includes(value)
        ? currentOptions.filter((v) => v !== value)
        : [...currentOptions, value];
      const cleanValues = newValues.filter((v) => v !== OTHER_OPTION);
      updateAnswer(currentQuestion.id, cleanValues);
    }
  };

  const handleOtherInputChange = (value: string) => {
    setOtherInputs((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
    
    if (currentQuestion.type === "radio") {
      updateAnswer(currentQuestion.id, { option: OTHER_OPTION, custom: value });
    } else {
      const currentValues = currentAnswer;
      let currentOptions: string[] = [];
      
      if (Array.isArray(currentValues)) {
        currentOptions = currentValues;
      } else if (typeof currentValues === "object" && currentValues !== null && "options" in currentValues) {
        currentOptions = currentValues.options;
      }
      
      updateAnswer(currentQuestion.id, { options: [...currentOptions, OTHER_OPTION], custom: value });
    }
  };

  const handleInputChange = (value: string) => {
    updateAnswer(currentQuestion.id, value);
  };


  const handleNext = () => {
    if (currentQuestionIndex < questionsWithAnswers.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(questionsWithAnswers);
  };

  // Check if all questions are answered
  const allQuestionsAnswered = questionsWithAnswers.every((q) => {
    if (!q.answer) return false;
    
    if (q.type === "checkbox") {
      const values = Array.isArray(q.answer) ? q.answer : [];
      return values.length > 0;
    }
    
    if (q.type === "radio") {
      // For radio, check if "Other" was selected and has custom value
      if (typeof q.answer === "string" && q.answer.startsWith("Other:")) {
        return q.answer.length > 6; // "Other: " is 6 chars
      }
      return !!q.answer;
    }
    
    return !!(q.answer as string)?.trim();
  });

  // Get current answer for display (handle formatted answers)
  const getDisplayAnswer = (): AnswerValue => {
    const answer = currentQuestion.answer;
    if (!answer) {
      return currentQuestion.type === "checkbox" ? [] : "";
    }
    
    // For radio: check if answer is formatted "Other: custom" or just the option
    if (currentQuestion.type === "radio") {
      if (typeof answer === "string" && answer.startsWith("Other:")) {
        return { option: OTHER_OPTION, custom: answer.replace("Other: ", "") };
      }
      return answer;
    }
    
    // For checkbox: handle array of formatted answers
    if (currentQuestion.type === "checkbox" && Array.isArray(answer)) {
      const otherAnswer = answer.find((a) => typeof a === "string" && a.startsWith("Other:"));
      if (otherAnswer) {
        return { 
          options: answer.map((a) => typeof a === "string" && a.startsWith("Other:") ? OTHER_OPTION : a as string),
          custom: (otherAnswer as string).replace("Other: ", "")
        };
      }
      return answer;
    }
    
    return answer;
  };

  const displayAnswer = getDisplayAnswer();
  
  // Check if "Other" is selected based on display answer
  const isOtherSelectedRadio = 
    currentQuestion.type === "radio" && 
    (typeof displayAnswer === "object" && displayAnswer !== null && !Array.isArray(displayAnswer) && "option" in displayAnswer && (displayAnswer as { option: string; custom: string }).option === OTHER_OPTION);
  
  const isOtherSelectedCheckbox = 
    currentQuestion.type === "checkbox" && 
    (Array.isArray(displayAnswer) 
      ? displayAnswer.includes(OTHER_OPTION)
      : (typeof displayAnswer === "object" && displayAnswer !== null && !Array.isArray(displayAnswer) && "options" in displayAnswer && (displayAnswer as { options: string[]; custom: string }).options?.includes(OTHER_OPTION)));

  const otherInputValue = otherInputs[currentQuestion.id] || 
    (typeof displayAnswer === "object" && displayAnswer !== null && !Array.isArray(displayAnswer) && "custom" in displayAnswer ? (displayAnswer as { custom: string }).custom : "");

  // Rotate loading messages when submitting
  useEffect(() => {
    if (!isSubmitting) {
      setLoadingMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isSubmitting, loadingMessages.length]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Question Content */}
      <div className="flex-1 flex flex-col min-h-0 px-6 py-8 overflow-y-auto">
        <div className="flex flex-col justify-center max-w-2xl mx-auto w-full min-h-full">
          <h3 className="text-base font-medium text-slate-900 mb-6">
            {currentQuestion.question}
          </h3>

          {currentQuestion.type === "radio" && (
            <div className="space-y-2.5">
              {currentQuestion.options?.map((option) => {
                const isSelected = option === OTHER_OPTION
                  ? isOtherSelectedRadio
                  : (typeof displayAnswer === "string" && displayAnswer === option);
                return (
                  <div key={option}>
                    <button
                      type="button"
                      onClick={() => handleRadioChange(option)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-lg border transition-all text-sm",
                        isSelected
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                            isSelected
                              ? "border-slate-900"
                              : "border-slate-300"
                          )}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-slate-900" />
                          )}
                        </div>
                        <span className="text-sm text-slate-900">{option}</span>
                      </div>
                    </button>
                    {option === OTHER_OPTION && isOtherSelectedRadio && (
                      <div className="mt-2 ml-7">
                        <input
                          type="text"
                          value={otherInputValue as string}
                          onChange={(e) => handleOtherInputChange(e.target.value)}
                          placeholder="Please specify..."
                          className="w-full p-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 transition-colors"
                          autoFocus
                        />
                      </div>
                    )}
                  </div>
                );
              })}
              {!currentQuestion.options?.includes(OTHER_OPTION) && (
                <div>
                  <button
                    type="button"
                    onClick={() => handleRadioChange(OTHER_OPTION)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg border transition-all text-sm",
                      isOtherSelectedRadio
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                          isOtherSelectedRadio
                            ? "border-slate-900"
                            : "border-slate-300"
                        )}
                      >
                        {isOtherSelectedRadio && (
                          <div className="w-2 h-2 rounded-full bg-slate-900" />
                        )}
                      </div>
                      <span className="text-sm text-slate-900">{OTHER_OPTION}</span>
                    </div>
                  </button>
                  {isOtherSelectedRadio && (
                    <div className="mt-2 ml-7">
                      <input
                        type="text"
                        value={otherInputValue as string}
                        onChange={(e) => handleOtherInputChange(e.target.value)}
                        placeholder="Please specify..."
                        className="w-full p-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 transition-colors"
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {currentQuestion.type === "checkbox" && (
            <div className="space-y-2.5">
              {currentQuestion.options?.map((option) => {
                const currentValues = Array.isArray(displayAnswer) 
                  ? displayAnswer 
                  : (typeof displayAnswer === "object" && displayAnswer !== null && "options" in displayAnswer 
                    ? displayAnswer.options 
                    : []);
                const isChecked = currentValues.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleCheckboxChange(option)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg border transition-all text-sm",
                      isChecked
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0",
                          isChecked ? "border-slate-900 bg-slate-900" : "border-slate-300 bg-white"
                        )}
                      >
                        {isChecked && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-slate-900">{option}</span>
                    </div>
                  </button>
                );
              })}
              {!currentQuestion.options?.includes(OTHER_OPTION) && (
                <div>
                  <button
                    type="button"
                    onClick={() => handleCheckboxChange(OTHER_OPTION)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg border transition-all text-sm",
                      isOtherSelectedCheckbox
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0",
                          isOtherSelectedCheckbox ? "border-slate-900 bg-slate-900" : "border-slate-300 bg-white"
                        )}
                      >
                        {isOtherSelectedCheckbox && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-slate-900">{OTHER_OPTION}</span>
                    </div>
                  </button>
                  {isOtherSelectedCheckbox && (
                    <div className="mt-2 ml-7">
                      <input
                        type="text"
                        value={otherInputValue as string}
                        onChange={(e) => handleOtherInputChange(e.target.value)}
                        placeholder="Please specify..."
                        className="w-full p-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 transition-colors"
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {currentQuestion.type === "input" && (
            <input
              type="text"
              value={(currentQuestion.answer as string) || ""}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="w-full p-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 transition-colors shadow-none"
              autoFocus
            />
          )}
        </div>
      </div>

      {/* Question Navigation - Fixed at Bottom */}
      {isSubmitting ? (
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-8 bg-white flex-shrink-0">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
            <div className="text-center">
              <p className="text-sm font-medium text-slate-900 mb-1">
                {loadingMessages[loadingMessageIndex]}
              </p>
              <p className="text-xs text-slate-500">
                This may take a few moments
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2.5 px-6 py-3.5 bg-white flex-shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            size="sm"
            className="text-xs h-8"
          >
            <ArrowLeft className="w-3 h-3 mr-1" />
            Previous
          </Button>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-medium text-slate-900">
              {currentQuestionIndex + 1} of {questionsWithAnswers.length}
            </span>
            <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-slate-900 transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questionsWithAnswers.length) * 100}%` }}
              />
            </div>
          </div>
          {isLastQuestion ? (
            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-slate-900 text-white hover:bg-slate-800 text-xs h-8"
              disabled={!allQuestionsAnswered}
              size="sm"
            >
              Submit
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              className="bg-slate-900 text-white hover:bg-slate-800 text-xs h-8"
              disabled={
                (currentQuestion.type === "radio" && !currentQuestion.answer && !isOtherSelectedRadio) ||
                (currentQuestion.type === "radio" && isOtherSelectedRadio && !otherInputValue?.trim()) ||
                (currentQuestion.type === "input" && !(currentQuestion.answer as string)?.trim())
              }
              size="sm"
            >
              Next
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
