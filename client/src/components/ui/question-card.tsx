import { cn } from "@/lib/utils";
import { Bookmark, Share2 } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "./label";
import { useState } from "react";

export interface QuestionOption {
  id: string;
  text: string;
}

interface QuestionCardProps {
  id: string;
  examYear: string;
  subject: string;
  content: string;
  options: QuestionOption[];
  answer?: string;
  className?: string;
  onAnswerSubmit?: (questionId: string, selectedOptionId: string) => void;
}

export function QuestionCard({
  id,
  examYear,
  subject,
  content,
  options,
  answer,
  className,
  onAnswerSubmit
}: QuestionCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | undefined>();
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleVerifyAnswer = () => {
    if (!selectedOption) return;
    
    setIsAnswered(true);
    if (answer) {
      setIsCorrect(selectedOption === answer);
    }
    
    if (onAnswerSubmit) {
      onAnswerSubmit(id, selectedOption);
    }
  };

  return (
    <Card className={cn("overflow-hidden border border-neutral-200", className)}>
      <div className="border-b border-neutral-200 p-4 bg-neutral-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="bg-primary-100 text-primary px-2 py-1 rounded text-xs font-medium">{examYear}</span>
            <span className="ml-3 text-neutral-500 text-sm">{subject}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <Bookmark className="h-5 w-5 text-neutral-400" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <Share2 className="h-5 w-5 text-neutral-400" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <p className="text-neutral-800 mb-4 whitespace-pre-line">{content}</p>
        </div>
        
        <RadioGroup
          value={selectedOption}
          onValueChange={setSelectedOption}
          className="space-y-3 mb-6"
          disabled={isAnswered}
        >
          {options.map((option) => (
            <div 
              key={option.id}
              className={cn(
                "flex items-center p-3 border rounded-md hover:bg-neutral-50 cursor-pointer",
                isAnswered && option.id === answer && "border-green-500 bg-green-50",
                isAnswered && selectedOption === option.id && option.id !== answer && "border-red-500 bg-red-50",
                !isAnswered && "border-neutral-200"
              )}
            >
              <RadioGroupItem value={option.id} id={option.id} className="mr-3" />
              <Label htmlFor={option.id} className="cursor-pointer flex-1">
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {isAnswered && (
          <div className={cn(
            "p-4 mb-6 rounded-md",
            isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          )}>
            <p className={cn(
              "font-medium",
              isCorrect ? "text-green-800" : "text-red-800"
            )}>
              {isCorrect 
                ? "Parabéns! Você acertou a questão." 
                : `Resposta incorreta. A alternativa correta é a ${answer}.`}
            </p>
          </div>
        )}
        
        <div className="flex items-center justify-end space-x-4">
          <Button variant="outline" disabled={isAnswered}>
            Pular
          </Button>
          <Button 
            disabled={!selectedOption || isAnswered} 
            onClick={handleVerifyAnswer}
          >
            Verificar resposta
          </Button>
        </div>
      </div>
    </Card>
  );
}
