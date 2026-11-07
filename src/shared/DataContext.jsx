import { createContext, useContext, useState } from 'react'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [sharedData, setSharedData] = useState({})

  return (
    <DataContext.Provider value={{ sharedData, setSharedData }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  return useContext(DataContext)
}
