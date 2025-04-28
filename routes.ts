import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertHabitSchema, insertMoodSchema, insertGoalSchema, insertReminderSchema, moodOptions } from "@shared/schema";
import { format, parseISO, subDays, isToday } from "date-fns";

export async function registerRoutes(app: Express): Promise<Server> {
  // USER ROUTES
  app.get("/api/users/current", async (req, res) => {
    // In a real app, this would use the session to fetch the user
    // For demo purposes, return a mock user
    res.json({
      id: 1,
      username: "jorge",
      displayName: "Jorge",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
    });
  });

  // HABITS ROUTES
  app.get("/api/habits", async (req, res) => {
    try {
      const habits = await storage.getAllHabits(1); // userId=1 for this demo
      res.json(habits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch habits" });
    }
  });

  app.post("/api/habits", async (req, res) => {
    try {
      const habitData = insertHabitSchema.parse({
        ...req.body,
        userId: 1 // Hardcoded for demo
      });
      
      const habit = await storage.createHabit(habitData);
      res.status(201).json(habit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create habit" });
      }
    }
  });

  app.patch("/api/habits/:id", async (req, res) => {
    try {
      const habitId = parseInt(req.params.id);
      const habit = await storage.getHabit(habitId);
      
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      const updatedHabit = await storage.updateHabit(habitId, req.body);
      res.json(updatedHabit);
    } catch (error) {
      res.status(500).json({ message: "Failed to update habit" });
    }
  });

  app.post("/api/habits/:id/increment", async (req, res) => {
    try {
      const habitId = parseInt(req.params.id);
      const { value } = req.body;
      
      const habit = await storage.getHabit(habitId);
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      const incrementValue = typeof value === 'number' ? value : 1;
      const newValue = Math.min(habit.currentValue + incrementValue, habit.targetValue);
      
      const updatedHabit = await storage.updateHabit(habitId, { 
        currentValue: newValue,
        completed: newValue === habit.targetValue
      });
      
      res.json(updatedHabit);
    } catch (error) {
      res.status(500).json({ message: "Failed to increment habit" });
    }
  });

  app.delete("/api/habits/:id", async (req, res) => {
    try {
      const habitId = parseInt(req.params.id);
      await storage.deleteHabit(habitId);
      res.json({ message: "Habit deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete habit" });
    }
  });

  // MOOD ROUTES
  app.get("/api/moods/today", async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const moods = await storage.getMoodsByDate(1, today);
      const latestMood = moods.length > 0 ? moods[0] : null;
      
      res.json(latestMood);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch today's mood" });
    }
  });

  app.get("/api/moods/history", async (req, res) => {
    try {
      const moods = await storage.getAllMoods(1); // userId=1 for this demo
      res.json(moods);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mood history" });
    }
  });

  app.post("/api/moods", async (req, res) => {
    try {
      const moodData = insertMoodSchema.parse({
        ...req.body,
        userId: 1, // Hardcoded for demo
        date: new Date()
      });
      
      const mood = await storage.createMood(moodData);
      res.status(201).json(mood);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create mood entry" });
      }
    }
  });

  app.delete("/api/moods/:id", async (req, res) => {
    try {
      const moodId = parseInt(req.params.id);
      await storage.deleteMood(moodId);
      res.json({ message: "Mood deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete mood" });
    }
  });

  // GOALS ROUTES
  app.get("/api/goals", async (req, res) => {
    try {
      const goals = await storage.getAllGoals(1); // userId=1 for this demo
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const goalData = insertGoalSchema.parse({
        ...req.body,
        userId: 1 // Hardcoded for demo
      });
      
      const goal = await storage.createGoal(goalData);
      res.status(201).json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create goal" });
      }
    }
  });

  app.patch("/api/goals/:id/progress", async (req, res) => {
    try {
      const goalId = parseInt(req.params.id);
      const { currentValue } = req.body;
      
      const goal = await storage.getGoal(goalId);
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      
      const newValue = Math.min(Math.max(0, currentValue), goal.targetValue);
      const completed = newValue === goal.targetValue;
      
      const updatedGoal = await storage.updateGoal(goalId, { 
        currentValue: newValue,
        completed
      });
      
      res.json(updatedGoal);
    } catch (error) {
      res.status(500).json({ message: "Failed to update goal progress" });
    }
  });

  app.delete("/api/goals/:id", async (req, res) => {
    try {
      const goalId = parseInt(req.params.id);
      await storage.deleteGoal(goalId);
      res.json({ message: "Goal deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete goal" });
    }
  });

  // REMINDERS ROUTES
  app.get("/api/reminders", async (req, res) => {
    try {
      const reminders = await storage.getAllReminders(1); // userId=1 for this demo
      res.json(reminders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reminders" });
    }
  });

  app.post("/api/reminders", async (req, res) => {
    try {
      const reminderData = insertReminderSchema.parse({
        ...req.body,
        userId: 1, // Hardcoded for demo
        isActive: true
      });
      
      const reminder = await storage.createReminder(reminderData);
      res.status(201).json(reminder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create reminder" });
      }
    }
  });

  app.delete("/api/reminders/:id", async (req, res) => {
    try {
      const reminderId = parseInt(req.params.id);
      await storage.deleteReminder(reminderId);
      res.json({ message: "Reminder deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete reminder" });
    }
  });

  // STATS ROUTES
  app.get("/api/stats", async (req, res) => {
    try {
      const userId = 1; // Hardcoded for demo

      // Get habits stats
      const habits = await storage.getAllHabits(userId);
      const totalHabits = habits.length;
      const completedHabits = habits.filter(h => h.completed).length;
      
      // Get current streak
      let maxStreak = 0;
      habits.forEach(habit => {
        maxStreak = Math.max(maxStreak, habit.streak);
      });
      
      // Get today's mood
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayMoods = await storage.getMoodsByDate(userId, today);
      const latestMood = todayMoods.length > 0 ? todayMoods[0] : null;
      
      // Get goals progress
      const goals = await storage.getAllGoals(userId);
      const goalProgress = goals.length > 0 
        ? Math.round(goals.reduce((acc, goal) => {
            const percentage = goal.targetValue > 0 
              ? (goal.currentValue / goal.targetValue) * 100 
              : 0;
            return acc + percentage;
          }, 0) / goals.length)
        : 0;
      
      res.json({
        streak: maxStreak > 0 ? `${maxStreak} days` : "0 days",
        habitsComplete: `${completedHabits}/${totalHabits}`,
        mood: latestMood ? `${moodOptions.find(m => m.value === latestMood.mood)?.label} ${latestMood.emoji}` : "None",
        goals: `${goalProgress}%`
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/stats/weekly", async (req, res) => {
    try {
      const userId = 1; // Hardcoded for demo
      
      // Generate weekly data for demo purposes
      // In a real app, this would be calculated from actual data
      res.json({
        habits: [5, 6, 4, 7, 5, 4, 6],
        mood: [7, 6, 5, 6, 8, 7, 8],
        goals: [3, 4, 5, 4, 6, 5, 6]
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weekly stats" });
    }
  });

  app.get("/api/stats/moods", async (req, res) => {
    try {
      const userId = 1; // Hardcoded for demo
      const moods = await storage.getAllMoods(userId);
      
      // Count occurrences of each mood
      const moodCounts: Record<string, number> = {};
      
      moodOptions.forEach(mood => {
        moodCounts[mood.value] = 0;
      });
      
      moods.forEach(mood => {
        if (moodCounts[mood.mood] !== undefined) {
          moodCounts[mood.mood]++;
        }
      });
      
      res.json(moodCounts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mood stats" });
    }
  });

  app.get("/api/stats/habits", async (req, res) => {
    try {
      const userId = 1; // Hardcoded for demo
      
      // Generate habit completion rate for the last 30 days (demo data)
      // In a real app, this would be calculated from actual habit logs
      const completionRate = Array(30).fill(0).map(() => Math.floor(Math.random() * 100));
      
      res.json({
        completionRate
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch habit stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
