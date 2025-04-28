import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Goal } from "@shared/schema";

interface GoalProgressProps {
  goals?: Goal[];
}

export default function GoalProgress({ goals }: GoalProgressProps) {
  const queryClient = useQueryClient();

  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return "bg-secondary";
    if (percentage >= 50) return "bg-accent";
    return "bg-primary";
  };

  const getTextColor = (percentage: number) => {
    if (percentage >= 75) return "text-secondary";
    if (percentage >= 50) return "text-warning";
    return "text-primary";
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Goals Progress</CardTitle>
        <a href="/goals" className="text-primary text-sm font-medium hover:underline">View All</a>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {!goals && (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-4 border border-neutral-200 rounded-lg">
                <div className="mb-2 flex justify-between">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-5 w-[40px]" />
                </div>
                <Skeleton className="h-2 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))
          )}

          {goals && goals.length > 0 && goals.slice(0, 3).map((goal) => {
            const percentage = goal.targetValue 
              ? Math.round((goal.currentValue / goal.targetValue) * 100) 
              : 0;
              
            return (
              <div key={goal.id} className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-neutral-800">{goal.name}</h3>
                  <span className={`text-sm ${getTextColor(percentage)}`}>{percentage}%</span>
                </div>
                <Progress 
                  className="h-2 mb-2" 
                  value={percentage} 
                  indicatorClassName={getProgressColor(percentage)}
                />
                <p className="text-sm text-neutral-500">
                  {goal.currentValue} of {goal.targetValue} {goal.units}
                </p>
              </div>
            );
          })}
          
          {goals && goals.length === 0 && (
            <div className="text-center py-4 text-neutral-500">
              No goals set yet. Add goals to track your progress!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
