import { useEffect, useRef } from "react";
import { format, subDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import Chart from "chart.js/auto";

export default function Insights() {
  const weeklyChartRef = useRef<HTMLCanvasElement | null>(null);
  const weeklyChartInstance = useRef<Chart | null>(null);
  
  const moodChartRef = useRef<HTMLCanvasElement | null>(null);
  const moodChartInstance = useRef<Chart | null>(null);
  
  const habitChartRef = useRef<HTMLCanvasElement | null>(null);
  const habitChartInstance = useRef<Chart | null>(null);
  
  const { data: weeklyData, isLoading: isWeeklyLoading } = useQuery({
    queryKey: ['/api/stats/weekly'],
  });
  
  const { data: moodData, isLoading: isMoodLoading } = useQuery({
    queryKey: ['/api/stats/moods'],
  });
  
  const { data: habitData, isLoading: isHabitLoading } = useQuery({
    queryKey: ['/api/stats/habits'],
  });
  
  // Weekly overview chart
  useEffect(() => {
    if (!weeklyChartRef.current || !weeklyData) return;

    if (weeklyChartInstance.current) {
      weeklyChartInstance.current.destroy();
    }

    const ctx = weeklyChartRef.current.getContext('2d');
    if (!ctx) return;

    weeklyChartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Habits',
            data: weeklyData.habits || [5, 6, 4, 7, 5, 4, 6],
            borderColor: 'hsl(var(--primary))',
            backgroundColor: 'hsla(var(--primary) / 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Mood',
            data: weeklyData.mood || [7, 6, 5, 6, 8, 7, 8],
            borderColor: 'hsl(var(--secondary))',
            backgroundColor: 'hsla(var(--secondary) / 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Goals',
            data: weeklyData.goals || [3, 4, 5, 4, 6, 5, 6],
            borderColor: 'hsl(var(--accent))',
            backgroundColor: 'hsla(var(--accent) / 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 10,
            ticks: {
              stepSize: 2,
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });

    return () => {
      if (weeklyChartInstance.current) {
        weeklyChartInstance.current.destroy();
      }
    };
  }, [weeklyData]);

  // Mood distribution chart
  useEffect(() => {
    if (!moodChartRef.current || !moodData) return;

    if (moodChartInstance.current) {
      moodChartInstance.current.destroy();
    }

    const ctx = moodChartRef.current.getContext('2d');
    if (!ctx) return;

    const labels = moodData ? Object.keys(moodData) : ['Happy', 'Neutral', 'Sad', 'Angry', 'Tired'];
    const data = moodData ? Object.values(moodData) : [40, 20, 15, 10, 15];

    moodChartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
        datasets: [
          {
            data,
            backgroundColor: [
              'hsl(var(--secondary))',
              'hsl(var(--primary))',
              'hsl(var(--accent))',
              'hsl(var(--destructive))',
              'hsl(var(--muted))',
            ],
            borderWidth: 1,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          }
        }
      }
    });

    return () => {
      if (moodChartInstance.current) {
        moodChartInstance.current.destroy();
      }
    };
  }, [moodData]);

  // Habit completion chart
  useEffect(() => {
    if (!habitChartRef.current || !habitData) return;

    if (habitChartInstance.current) {
      habitChartInstance.current.destroy();
    }

    const ctx = habitChartRef.current.getContext('2d');
    if (!ctx) return;

    const labels = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      return format(date, "d MMM");
    });

    habitChartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Habit Completion Rate (%)',
            data: habitData?.completionRate || Array(30).fill(0).map(() => Math.floor(Math.random() * 100)),
            backgroundColor: 'hsla(var(--primary) / 0.7)',
            borderRadius: 4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => `${value}%`
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          }
        }
      }
    });

    return () => {
      if (habitChartInstance.current) {
        habitChartInstance.current.destroy();
      }
    };
  }, [habitData]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-800">Insights & Analytics</h1>
        <p className="text-neutral-600">Visualize your wellness journey with detailed analytics</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Weekly Overview</CardTitle>
          <CardDescription>
            See how your habits, mood, and goal progress have changed over the past week
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isWeeklyLoading ? (
            <Skeleton className="h-[350px] w-full" />
          ) : (
            <div className="h-[350px] relative">
              <canvas ref={weeklyChartRef} />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
            <CardDescription>Your emotional landscape over time</CardDescription>
          </CardHeader>
          <CardContent>
            {isMoodLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px] relative">
                <canvas ref={moodChartRef} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Habit Consistency</CardTitle>
            <CardDescription>Your habit completion rate over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {isHabitLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="h-[300px] relative">
                <canvas ref={habitChartRef} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="habits">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="habits">Habit Insights</TabsTrigger>
              <TabsTrigger value="moods">Mood Patterns</TabsTrigger>
              <TabsTrigger value="goals">Goal Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="habits">
              <div className="space-y-4">
                <div className="p-4 border border-neutral-200 rounded-lg">
                  <h3 className="font-medium text-neutral-800 mb-2">Most Consistent Habit</h3>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Meditation</p>
                      <p className="text-sm text-neutral-500">15 day streak</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-neutral-200 rounded-lg">
                  <h3 className="font-medium text-neutral-800 mb-2">Needs Improvement</h3>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-destructive bg-opacity-10 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Exercise</p>
                      <p className="text-sm text-neutral-500">Completed 2/7 days last week</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-neutral-200 rounded-lg">
                  <h3 className="font-medium text-neutral-800 mb-2">Weekly Completion Rate</h3>
                  <div className="flex items-center justify-between mb-1">
                    <span>This Week</span>
                    <span className="font-medium">68%</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "68%" }}></div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="moods">
              <div className="space-y-4">
                <div className="p-4 border border-neutral-200 rounded-lg">
                  <h3 className="font-medium text-neutral-800 mb-2">Mood Triggers</h3>
                  <p className="text-neutral-600 mb-2">Your mood seems to improve after:</p>
                  <ul className="list-disc list-inside space-y-1 text-neutral-600">
                    <li>Completing meditation sessions</li>
                    <li>Getting 7+ hours of sleep</li>
                    <li>Outdoor activities</li>
                  </ul>
                </div>
                
                <div className="p-4 border border-neutral-200 rounded-lg">
                  <h3 className="font-medium text-neutral-800 mb-2">Weekly Mood Pattern</h3>
                  <div className="grid grid-cols-7 gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                      <div key={i} className="text-center">
                        <div className="text-sm text-neutral-500">{day}</div>
                        <div className="text-xl mt-1">{["😊", "😊", "😐", "😐", "😊", "😊", "😊"][i]}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 border border-neutral-200 rounded-lg">
                  <h3 className="font-medium text-neutral-800 mb-2">Mood Over Time</h3>
                  <p className="text-neutral-600">Your overall mood has been <span className="text-secondary font-medium">improving</span> over the past month.</p>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-neutral-500">Last Month</span>
                    <div className="flex-1 mx-2">
                      <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-primary to-secondary h-full" style={{ width: "75%" }}></div>
                      </div>
                    </div>
                    <span className="text-sm text-neutral-500">This Month</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="goals">
              <div className="space-y-4">
                <div className="p-4 border border-neutral-200 rounded-lg">
                  <h3 className="font-medium text-neutral-800 mb-2">Goals Overview</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">3</p>
                      <p className="text-sm text-neutral-500">In Progress</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-secondary">2</p>
                      <p className="text-sm text-neutral-500">Completed</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-accent">68%</p>
                      <p className="text-sm text-neutral-500">Avg. Progress</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-neutral-200 rounded-lg">
                  <h3 className="font-medium text-neutral-800 mb-2">Goal Progress Timeline</h3>
                  <div className="relative">
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-neutral-200"></div>
                    
                    <div className="relative pl-8 pb-6">
                      <div className="absolute left-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Read 10 Books</p>
                        <p className="text-sm text-neutral-500">3 of 10 completed</p>
                      </div>
                    </div>
                    
                    <div className="relative pl-8 pb-6">
                      <div className="absolute left-0 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Sleep 8 Hours Daily</p>
                        <p className="text-sm text-neutral-500">Avg. 6h 15m of 8h goal</p>
                      </div>
                    </div>
                    
                    <div className="relative pl-8">
                      <div className="absolute left-0 w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">10,000 Steps Daily</p>
                        <p className="text-sm text-neutral-500">7,532 of 10,000 steps</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
