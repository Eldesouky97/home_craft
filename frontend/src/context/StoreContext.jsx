import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const StoreContext = createContext()

export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}

export const StoreProvider = ({ children }) => {
  const [stores, setStores] = useState([])
  const [currentStore, setCurrentStore] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchStores = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/stores')
      setStores(response.data.stores)
    } catch (error) {
      console.error('Error fetching stores:', error)
    } finally {
      setLoading(false)
    }
  }

  const createStore = async (storeData) => {
    try {
      const response = await axios.post('/api/stores', storeData)
      setStores(prev => [...prev, response.data.store])
      return { success: true, store: response.data.store }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to create store' }
    }
  }

  const getStoreByName = async (storeName) => {
    try {
      const response = await axios.get(`/api/stores/${storeName}`)
      setCurrentStore(response.data.store)
      setProducts(response.data.products)
      return { success: true, store: response.data.store, products: response.data.products }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Store not found' }
    }
  }

  const addProduct = async (productId, storeData) => {
    try {
      const response = await axios.post(`/api/products`, productId, storeData)
      setProducts(prev => [...prev, response.data.product])
      return { success: true, product: response.data.product }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to add product' }
    }
  }

  const updateProduct = async (productId, productData) => {
    try {
      const response = await axios.put(`/api/products/${productId}`, productData)
      setProducts(prev => prev.map(p => p.id === productId ? response.data.product : p))
      return { success: true, product: response.data.product }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update product' }
    }
  }

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`/api/products/${productId}`)
      setProducts(prev => prev.filter(p => p.id !== productId))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete product' }
    }
  }

  const value = {
    stores,
    currentStore,
    products,
    loading,
    fetchStores,
    createStore,
    getStoreByName,
    addProduct,
    updateProduct,
    deleteProduct,
    setCurrentStore,
    setProducts,
  }

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  )
}