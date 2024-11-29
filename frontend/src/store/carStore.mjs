import { create } from 'zustand'

export const useCartStore = create((set) => ({
  cartItems: {},
  totalItems: 0,
  addToCart: (productId) => set((state) => {
    const updatedCartItems = { ...state.cartItems }
    updatedCartItems[productId] = (updatedCartItems[productId] || 0) + 1
    return {
      cartItems: updatedCartItems,
      totalItems: state.totalItems + 1
    }
  }),
  removeFromCart: (productId) => set((state) => {
    const updatedCartItems = { ...state.cartItems }
    if (updatedCartItems[productId] > 0) {
      updatedCartItems[productId]--
      // Remove the product entirely if quantity reaches 0
      if (updatedCartItems[productId] === 0) {
        delete updatedCartItems[productId]
      }
      return {
        cartItems: updatedCartItems,
        totalItems: state.totalItems - 1
      }
    }
    return state
  }),
  clearCart: () => set({ cartItems: {}, totalItems: 0 })
}))

export const useRoleStore = create((set) => ({
  role: '',
  setRole: async (newRole) => set({ role: newRole })
}))


