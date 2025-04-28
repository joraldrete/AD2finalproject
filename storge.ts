import { 
  habits, type Habit, type InsertHabit,
  moods, type Mood, type InsertMood,
  goals, type Goal, type InsertGoal,
  reminders, type Reminder, type InsertReminder,
  users, type User, type InsertUser
} from "@shared/schema";
import { isToday, isEqual, startOfDay, endOfDay } from "date-fns";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Habit methods
  getHabit(id: number): Promise<Habit | undefined>;
  getAllHabits(userId: number): Promise<Habit[]>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  updateHabit(id: number, updates: Partial<Habit>): Promise<Habit>;
  deleteHabit(id: number): Promise<void>;
  
  // Mood methods
  getMood(id: number): Promise<Mood | undefined>;
  getAllMoods(userId: number): Promise<Mood[]>;
  getMoodsByDate(userId: number, date: Date): Promise<Mood[]>;
  createMood(mood: InsertMood): Promise<Mood>;
  deleteMood(id: number): Promise<void>;
  
  // Goal methods
  getGoal(id: number): Promise<Goal | undefined>;
  getAllGoals(userId: number): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: number, updates: Partial<Goal>): Promise<Goal>;
  deleteGoal(id: number): Promise<void>;
  
  // Reminder methods
  getReminder(id: number): Promise<Reminder | undefined>;
  getAllReminders(userId: number): Promise<Reminder[]>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  deleteReminder(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private habits: Map<number, Habit>;
  private moods: Map<number, Mood>;
  private goals: Map<number, Goal>;
  private reminders: Map<number, Reminder>;
  
  private userIdCounter: number;
  private habitIdCounter: number;
  private moodIdCounter: number;
  private goalIdCounter: number;
  private reminderIdCounter: number;

  constructor() {
    this.users = new Map();
    this.habits = new Map();
    this.moods = new Map();
    this.goals = new Map();
    this.reminders = new Map();
    
    this.userIdCounter = 1;
    this.habitIdCounter = 1;
    this.moodIdCounter = 1;
    this.goalIdCounter = 1;
    this.reminderIdCounter = 1;
    
    // Initialize with demo data
    this.initDemoData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Habit methods
  async getHabit(id: number): Promise<Habit | undefined> {
    return this.habits.get(id);
  }
  
  async getAllHabits(userId: number): Promise<Habit[]> {
    return Array.from(this.habits.values())
      .filter(habit => habit.userId === userId)
      .sort((a, b) => (b.streak || 0) - (a.streak || 0));
  }
  
  async createHabit(habitData: InsertHabit): Promise<Habit> {
    const id = this.habitIdCounter++;
    const habit: Habit = { ...habitData, id };
    this.habits.set(id, habit);
    return habit;
  }
  
  async updateHabit(id: number, updates: Partial<Habit>): Promise<Habit> {
    const habit = this.habits.get(id);
    if (!habit) {
      throw new Error(`Habit with id ${id} not found`);
    }
    
    const updatedHabit = { ...habit, ...updates };
    this.habits.set(id, updatedHabit);
    return updatedHabit;
  }
  
  async deleteHabit(id: number): Promise<void> {
    this.habits.delete(id);
  }
  
  // Mood methods
  async getMood(id: number): Promise<Mood | undefined> {
    return this.moods.get(id);
  }
  
  async getAllMoods(userId: number): Promise<Mood[]> {
    return Array.from(this.moods.values())
      .filter(mood => mood.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async getMoodsByDate(userId: number, date: Date): Promise<Mood[]> {
    const start = startOfDay(date);
    const end = endOfDay(date);
    
    return Array.from(this.moods.values())
      .filter(mood => {
        const moodDate = new Date(mood.date);
        return mood.userId === userId && 
               moodDate >= start && 
               moodDate <= end;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async createMood(moodData: InsertMood): Promise<Mood> {
    const id = this.moodIdCounter++;
    const mood: Mood = { ...moodData, id };
    this.moods.set(id, mood);
    return mood;
  }
  
  async deleteMood(id: number): Promise<void> {
    this.moods.delete(id);
  }
  
  // Goal methods
  async getGoal(id: number): Promise<Goal | undefined> {
    return this.goals.get(id);
  }
  
  async getAllGoals(userId: number): Promise<Goal[]> {
    return Array.from(this.goals.values())
      .filter(goal => goal.userId === userId)
      .sort((a, b) => {
        // Sort completed goals last
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        
        // Sort by progress percentage for active goals
        if (!a.completed && !b.completed) {
          const aPercentage = a.targetValue > 0 ? (a.currentValue / a.targetValue) : 0;
          const bPercentage = b.targetValue > 0 ? (b.currentValue / b.targetValue) : 0;
          return bPercentage - aPercentage;
        }
        
        return 0;
      });
  }
  
  async createGoal(goalData: InsertGoal): Promise<Goal> {
    const id = this.goalIdCounter++;
    const goal: Goal = { ...goalData, id };
    this.goals.set(id, goal);
    return goal;
  }
  
  async updateGoal(id: number, updates: Partial<Goal>): Promise<Goal> {
    const goal = this.goals.get(id);
    if (!goal) {
      throw new Error(`Goal with id ${id} not found`);
    }
    
    const updatedGoal = { ...goal, ...updates };
    this.goals.set(id, updatedGoal);
    return updatedGoal;
  }
  
  async deleteGoal(id: number): Promise<void> {
    this.goals.delete(id);
  }
  
  // Reminder methods
  async getReminder(id: number): Promise<Reminder | undefined> {
    return this.reminders.get(id);
  }
  
  async getAllReminders(userId: number): Promise<Reminder[]> {
    return Array.from(this.reminders.values())
      .filter(reminder => reminder.userId === userId)
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  }
  
  async createReminder(reminderData: InsertReminder): Promise<Reminder> {
    const id = this.reminderIdCounter++;
    const reminder: Reminder = { ...reminderData, id };
    this.reminders.set(id, reminder);
    return reminder;
  }
  
  async deleteReminder(id: number): Promise<void> {
    this.reminders.delete(id);
  }
  
  // Initialize demo data
  private initDemoData() {
    // Create demo user
    const user: User = {
      id: 1,
      username: "jorge",
      password: "password123", // In a real app, this would be hashed
      displayName: "Jorge",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
    };
    this.users.set(user.id, user);
    
    // Create demo habits
    const habits: Partial<Habit>[] = [
      {
        userId: 1,
        name: "Drink 8 glasses of water",
        description: "Stay hydrated throughout the day",
        targetValue: 8,
        currentValue: 6,
        units: "glasses",
        iconName: "water",
        color: "blue",
        completed: false,
        streak: 5
      },
      {
        userId: 1,
        name: "Meditation",
        description: "15 minutes daily meditation",
        targetValue: 0,
        currentValue: 0,
        units: "",
        iconName: "meditation",
        color: "purple",
        completed: true,
        streak: 12
      },
      {
        userId: 1,
        name: "Exercise",
        description: "30 minutes workout",
        targetValue: 0,
        currentValue: 0,
        units: "",
        iconName: "exercise",
        color: "green",
        completed: false,
        streak: 0
      },
      {
        userId: 1,
        name: "Read a book",
        description: "Read for at least 20 minutes",
        targetValue: 0,
        currentValue: 0,
        units: "",
        iconName: "book",
        color: "orange",
        completed: true,
        streak: 3
      }
    ];
    
    habits.forEach(habit => {
      const id = this.habitIdCounter++;
      this.habits.set(id, { ...habit, id } as Habit);
    });
    
    // Create demo moods
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(now.getDate() - 2);
    
    const moods: Partial<Mood>[] = [
      {
        userId: 1,
        mood: "happy",
        emoji: "😊",
        notes: "Had a great day today! Completed most of my tasks and had time for self-care.",
        date: now
      },
      {
        userId: 1,
        mood: "neutral",
        emoji: "😐",
        notes: "Average day, nothing special.",
        date: yesterday
      },
      {
        userId: 1,
        mood: "tired",
        emoji: "😴",
        notes: "Didn't sleep well last night.",
        date: twoDaysAgo
      }
    ];
    
    moods.forEach(mood => {
      const id = this.moodIdCounter++;
      this.moods.set(id, { ...mood, id } as Mood);
    });
    
    // Create demo goals
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    const goals: Partial<Goal>[] = [
      {
        userId: 1,
        name: "10,000 Steps Daily",
        description: "Walk 10,000 steps every day",
        targetValue: 10000,
        currentValue: 7532,
        units: "steps",
        deadline: nextMonth,
        completed: false
      },
      {
        userId: 1,
        name: "Sleep 8 Hours",
        description: "Get 8 hours of sleep every night",
        targetValue: 8,
        currentValue: 6,
        units: "hours",
        completed: false
      },
      {
        userId: 1,
        name: "Read 10 Books",
        description: "Read 10 books this year",
        targetValue: 10,
        currentValue: 3,
        units: "books",
        completed: false
      }
    ];
    
    goals.forEach(goal => {
      const id = this.goalIdCounter++;
      this.goals.set(id, { ...goal, id } as Goal);
    });
    
    // Create demo reminders
    const reminderTime1 = new Date();
    reminderTime1.setHours(15, 0, 0, 0); // 3:00 PM
    
    const reminderTime2 = new Date();
    reminderTime2.setHours(18, 30, 0, 0); // 6:30 PM
    
    const reminderTime3 = new Date();
    reminderTime3.setDate(reminderTime3.getDate() + 1);
    reminderTime3.setHours(9, 0, 0, 0); // 9:00 AM tomorrow
    
    const reminders: Partial<Reminder>[] = [
      {
        userId: 1,
        title: "Drink water",
        time: reminderTime1,
        iconName: "water",
        isActive: true
      },
      {
        userId: 1,
        title: "Meditation",
        time: reminderTime2,
        iconName: "meditation",
        isActive: true
      },
      {
        userId: 1,
        title: "Log your mood",
        time: reminderTime3,
        iconName: "mood",
        isActive: true
      }
    ];
    
    reminders.forEach(reminder => {
      const id = this.reminderIdCounter++;
      this.reminders.set(id, { ...reminder, id } as Reminder);
    });
  }
}

export const storage = new MemStorage();
