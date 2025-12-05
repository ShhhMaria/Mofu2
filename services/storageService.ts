import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { Pet, Task } from '../types';

export const StorageService = {
  getPets: async (): Promise<Pet[]> => {
    if (!auth?.currentUser || !db) return [];
    
    const q = query(collection(db, "pets"), where("userId", "==", auth.currentUser.uid));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Pet));
  },

  savePet: async (pet: Omit<Pet, 'id'>): Promise<Pet> => {
    if (!auth?.currentUser || !db) throw new Error("Not authenticated");
    
    const doc = await addDoc(collection(db, "pets"), {
      ...pet, 
      userId: auth.currentUser.uid
    });
    return { id: doc.id, ...pet };
  },

  updatePet: async (pet: Pet): Promise<Pet> => {
    if (!db) throw new Error("Database error");
    const ref = doc(db, "pets", pet.id);
    const { id, ...data } = pet;
    await updateDoc(ref, data);
    return pet;
  },

  deletePet: async (id: string) => {
    if (!db) return;
    await deleteDoc(doc(db, "pets", id));
    
    const tasks = await StorageService.getTasksByPet(id);
    for (const t of tasks) {
      await StorageService.deleteTask(t.id);
    }
  },

  getTasksByPet: async (petId: string): Promise<Task[]> => {
    if (!db) return [];
    const q = query(collection(db, "tasks"), where("petId", "==", petId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Task));
  },

  saveTask: async (task: Omit<Task, 'id' | 'completed'>): Promise<Task> => {
    if (!db) throw new Error("Database error");
    const doc = await addDoc(collection(db, "tasks"), { 
      ...task, 
      completed: false 
    });
    return { id: doc.id, ...task, completed: false };
  },

  updateTask: async (task: Task): Promise<Task> => {
    if (!db) throw new Error("Database error");
    const ref = doc(db, "tasks", task.id);
    const { id, ...data } = task;
    await updateDoc(ref, data);
    return task;
  },

  toggleTask: async (task: Task): Promise<Task> => {
    if (!db) throw new Error("Database error");
    const ref = doc(db, "tasks", task.id);
    const newStatus = !task.completed;
    await updateDoc(ref, { completed: newStatus });
    return { ...task, completed: newStatus };
  },
  
  deleteTask: async (id: string) => {
    if (!db) return;
    await deleteDoc(doc(db, "tasks", id));
  },

  addMultipleTasks: async (tasks: Omit<Task, 'id' | 'completed'>[]) => {
    const created: Task[] = [];
    for (const t of tasks) {
      created.push(await StorageService.saveTask(t));
    }
    return created;
  }
};
