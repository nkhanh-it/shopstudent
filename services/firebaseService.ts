
import { db } from '../firebase';
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, 
  doc, query, where, getDoc, setDoc, orderBy 
} from 'firebase/firestore';
import { Product, Order, User, OrderStatus } from '../types';
import { MOCK_PRODUCTS } from '../data';

// --- PRODUCTS ---
export const getProducts = async (): Promise<Product[]> => {
  if (!db) return MOCK_PRODUCTS;
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    if (querySnapshot.empty) {
        // Nếu DB trống, khởi tạo bằng mock data cho lần đầu
        for (const p of MOCK_PRODUCTS) {
            await setDoc(doc(db, "products", p.id.toString()), p);
        }
        return MOCK_PRODUCTS;
    }
    return querySnapshot.docs.map(doc => ({ ...doc.data() } as Product));
  } catch (error) {
    console.error("Error fetching products:", error);
    return MOCK_PRODUCTS;
  }
};

export const getProductById = async (id: string): Promise<Product | null> => {
    if (!db) return MOCK_PRODUCTS.find(p => p.id === Number(id)) || null;
    try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? (docSnap.data() as Product) : null;
    } catch (error) {
        return null;
    }
};

export const updateProduct = async (product: Product) => {
    if (!db) return;
    const docRef = doc(db, "products", product.id.toString());
    await setDoc(docRef, product);
};

export const deleteProduct = async (id: number) => {
    if (!db) return;
    await deleteDoc(doc(db, "products", id.toString()));
};

// --- ORDERS ---
export const createOrder = async (order: Order) => {
  if (!db) throw new Error("Database not connected");
  await setDoc(doc(db, "orders", order.id), order);
};

export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
    if (!db) return [];
    try {
        const q = query(
            collection(db, "orders"), 
            where("userId", "==", userId),
            orderBy("date", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as Order);
    } catch (error) {
        console.error("Error getting user orders:", error);
        return [];
    }
};

export const getAllOrders = async (): Promise<Order[]> => {
    if (!db) return [];
    try {
        const q = query(collection(db, "orders"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as Order);
    } catch (error) {
        return [];
    }
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    if (!db) return;
    const docRef = doc(db, "orders", orderId);
    await updateDoc(docRef, { status });
};

export const deleteOrder = async (orderId: string) => {
    if (!db) return;
    await deleteDoc(doc(db, "orders", orderId));
};

// --- USERS ---
export const getAllUsers = async (): Promise<User[]> => {
    if (!db) return [];
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => doc.data() as User);
};

export const deleteUser = async (uid: string) => {
    if (!db) return;
    await deleteDoc(doc(db, "users", uid));
};
