import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  WhereFilterOp,
  QueryConstraint,
  writeBatch,
  serverTimestamp,
  Timestamp,
  addDoc
} from "firebase/firestore";
import { db } from "./config";

// Firestore service wrapper
export const firestoreService = {
  // Create document
  create: async (collectionName: string, data: any, docId?: string) => {
    try {
      if (docId) {
        const docRef = doc(db, collectionName, docId);
        await setDoc(docRef, {
          ...data,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp()
        });
        return { data: { id: docId, ...data }, error: null };
      } else {
        const docRef = await addDoc(collection(db, collectionName), {
          ...data,
          created_at: serverTimestamp(),
          updated_at: serverTimestamp()
        });
        return { data: { id: docRef.id, ...data }, error: null };
      }
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Read single document
  getById: async (collectionName: string, docId: string) => {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
      } else {
        return { data: null, error: "Document not found" };
      }
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Read all documents in collection
  getAll: async (collectionName: string, constraints: QueryConstraint[] = []) => {
    try {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Query with filters
  queryWhere: async (
    collectionName: string,
    field: string,
    operator: WhereFilterOp,
    value: any,
    additionalConstraints: QueryConstraint[] = []
  ) => {
    try {
      const collectionRef = collection(db, collectionName);
      const q = query(
        collectionRef,
        where(field, operator, value),
        ...additionalConstraints
      );
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  },

  // Update document
  update: async (collectionName: string, docId: string, data: any) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updated_at: serverTimestamp()
      });
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Delete document
  delete: async (collectionName: string, docId: string) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Batch write
  batchWrite: async (operations: Array<{
    type: 'create' | 'update' | 'delete';
    collection: string;
    docId?: string;
    data?: any;
  }>) => {
    try {
      const batch = writeBatch(db);

      operations.forEach(op => {
        if (op.type === 'create' && op.docId && op.data) {
          const docRef = doc(db, op.collection, op.docId);
          batch.set(docRef, {
            ...op.data,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
          });
        } else if (op.type === 'update' && op.docId && op.data) {
          const docRef = doc(db, op.collection, op.docId);
          batch.update(docRef, {
            ...op.data,
            updated_at: serverTimestamp()
          });
        } else if (op.type === 'delete' && op.docId) {
          const docRef = doc(db, op.collection, op.docId);
          batch.delete(docRef);
        }
      });

      await batch.commit();
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },

  // Real-time listener
  subscribe: (
    collectionName: string,
    callback: (data: any[]) => void,
    constraints: QueryConstraint[] = []
  ) => {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);

    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(data);
    });
  },

  // Real-time listener for single document
  subscribeToDoc: (
    collectionName: string,
    docId: string,
    callback: (data: any) => void
  ) => {
    const docRef = doc(db, collectionName, docId);

    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    });
  }
};

// Helper to convert Firestore Timestamp to Date
export const timestampToDate = (timestamp: Timestamp | any): Date | null => {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  return null;
};

export { serverTimestamp, Timestamp, where, orderBy, limit, startAfter };
export type { QueryConstraint, WhereFilterOp };
