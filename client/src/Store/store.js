import create from 'zustand';

const useStore = create((set) => ({
    stores: [],
    totalStores: 0,
    setStores: (stores, total) => set({ stores, totalStores: total }),
    addStore: (store) => set((state) => ({ stores: [...state.stores, store] })),
    updateStore: (updatedStore) =>
        set((state) => ({
            stores: state.stores.map((store) => (store._id === updatedStore._id ? updatedStore : store)),
        })),
    deleteStore: (id) =>
        set((state) => ({
            stores: state.stores.filter((store) => store._id !== id),
        })),
}));
