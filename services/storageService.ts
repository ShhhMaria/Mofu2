import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  setDoc,
  getDoc
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import { Pet, Task } from '../types';

const getCurrentUserIdentifier = () => {
  if (!auth?.currentUser) return null;
  // FIXED: Always use UID instead of displayName
  return auth.currentUser.uid;
};

const ensureOwner = async (): Promise<string> => {
  if (!db) throw new Error("Database error");
  const identifier = getCurrentUserIdentifier();
  if (!identifier) throw new Error("Not authenticated");

  const ownerRef = doc(db, "owners", identifier);
  const ownerSnap = await getDoc(ownerRef);

  const payload = {
    id: identifier,
    username: auth.currentUser?.displayName || null,
    email: auth.currentUser?.email || null,
    uid: auth.currentUser?.uid || null,
    updatedAt: Date.now()
  };

  if (!ownerSnap.exists()) {
    await setDoc(ownerRef, { ...payload, createdAt: Date.now() });
  } else {
    await setDoc(ownerRef, payload, { merge: true });
  }

  return identifier;
};

export const StorageService = {
  // ----- Owners -----
  getMyOwner: async (): Promise<any | null> => {
    if (!db) return null;
    const ownerId = await ensureOwner();
    const ref = doc(db, "owners", ownerId);
    const snap = await getDoc(ref);
    return snap.exists() ? { id: ownerId, ...snap.data() } : null;
  },

  getOwnerById: async (ownerId: string): Promise<any | null> => {
    if (!db) return null;
    const ref = doc(db, "owners", ownerId);
    const snap = await getDoc(ref);
    return snap.exists() ? { id: ownerId, ...snap.data() } : null;
  },

  // ----- Pets -----
  getPets: async (): Promise<Pet[]> => {
    if (!db) return [];
    const ownerId = await ensureOwner();

    const q = query(collection(db, "pets"), where("ownerId", "==", ownerId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Pet));
  },

  savePet: async (pet: Omit<Pet, 'id'>): Promise<Pet> => {
    const ownerId = await ensureOwner();
    if (!db) throw new Error("Database error");

    const docRef = await addDoc(collection(db, "pets"), {
      ...pet,
      ownerId,
      userId: ownerId
    });

    return { id: docRef.id, ...pet };
  },

  updatePet: async (pet: Pet): Promise<Pet> => {
    const ownerId = await ensureOwner();
    if (!db) throw new Error("Database error");

    const ref = doc(db, "pets", pet.id);
    const { id, ...data } = pet;

    await updateDoc(ref, { ...data, ownerId, userId: ownerId });
    return pet;
  },

  deletePet: async (id: string) => {
    if (!db) return;
    await deleteDoc(doc(db, "pets", id));

    // Cascade delete schedules/tasks associated with this pet
    const schedules = await StorageService.getSchedulesByPet(id);
    for (const s of schedules) await StorageService.deleteTask(s.id);

    const tasks = await StorageService.getCompletedTasksByPet(id);
    for (const t of tasks) await StorageService.deleteTask(t.id, true);
  },

  // ----- Schedules (incomplete tasks) -----
  getSchedulesByPet: async (petId: string): Promise<Task[]> => {
    if (!db) return [];
    const ownerId = await ensureOwner();
    // FIXED: Added ownerId filter to ensure proper data isolation
    const q = query(
      collection(db, "schedules"), 
      where("petId", "==", petId),
      where("ownerId", "==", ownerId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Task));
  },

  // ----- Completed Tasks -----
  getCompletedTasksByPet: async (petId: string): Promise<Task[]> => {
    if (!db) return [];
    const ownerId = await ensureOwner();
    // FIXED: Added ownerId filter to ensure proper data isolation
    const q = query(
      collection(db, "tasks"), 
      where("petId", "==", petId),
      where("ownerId", "==", ownerId)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Task));
  },

  // ----- Save -----
  saveTask: async (task: Omit<Task, 'id'>): Promise<Task> => {
    const ownerId = await ensureOwner();
    if (!db) throw new Error("Database error");

    const targetCollection = task.completed ? "tasks" : "schedules";
    const docRef = await addDoc(collection(db, targetCollection), {
      ...task,
      ownerId,
      userId: ownerId
    });
    return { id: docRef.id, ...task };
  },

  // ----- Update -----
  updateTask: async (task: Task): Promise<Task> => {
    const ownerId = await ensureOwner();
    if (!db) throw new Error("Database error");

    const targetCollection = task.completed ? "tasks" : "schedules";
    const ref = doc(db, targetCollection, task.id);
    const { id, ...data } = task;

    await updateDoc(ref, { ...data, ownerId, userId: ownerId });
    return task;
  },

  // ----- Toggle -----
  toggleTask: async (task: Task): Promise<Task> => {
    const ownerId = await ensureOwner();
    if (!db) throw new Error("Database error");

    const newStatus = !task.completed;

    // Delete from old collection
    const oldCollection = task.completed ? "tasks" : "schedules";
    await deleteDoc(doc(db, oldCollection, task.id));

    // Add to new collection
    const newCollection = newStatus ? "tasks" : "schedules";
    const docRef = await addDoc(collection(db, newCollection), {
      ...task,
      completed: newStatus,
      ownerId,
      userId: ownerId
    });

    return { ...task, id: docRef.id, completed: newStatus };
  },

  // ----- Delete -----
  deleteTask: async (id: string, isCompleted: boolean = false) => {
    if (!db) return;
    const targetCollection = isCompleted ? "tasks" : "schedules";
    await deleteDoc(doc(db, targetCollection, id));
  },

  addMultipleTasks: async (tasks: Omit<Task, 'id'>[]) => {
    const created: Task[] = [];
    for (const t of tasks) {
      created.push(await StorageService.saveTask(t));
    }
    return created;
  }
};
