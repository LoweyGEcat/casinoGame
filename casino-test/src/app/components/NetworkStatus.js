'use client'

import { useState, useEffect } from 'react'
import { Wifi } from 'lucide-react'

const NetworkStatus = () => {
  const [latency, setLatency] = useState(null)
  const [connectionType, setConnectionType] = useState(null)

  useEffect(() => {
    const measureLatency = async () => {
      const start = performance.now()
      try {
        await fetch('/api/ping')
        const end = performance.now()
        setLatency(Math.round(end - start))
      } catch (error) {
        console.error('Error measuring latency:', error)
        setLatency(null)
      }
    }

    const updateConnectionInfo = () => {
      if ('connection' in navigator) {
        setConnectionType(navigator.connection.effectiveType)
      }
    }

    const intervalId = setInterval(measureLatency, 5000)
    measureLatency()

    updateConnectionInfo()
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', updateConnectionInfo)
    }

    return () => {
      clearInterval(intervalId)
      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', updateConnectionInfo)
      }
    }
  }, [])

  const getConnectionColor = () => {
    if (!latency) return 'text-gray-500'
    if (latency < 100) return 'text-green-500'
    if (latency < 300) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="flex items-center space-x-2" style={{paddingRight:"10px"}}>
      {latency !== null && (
        <span className={`text-sm ${getConnectionColor()}`}>
          {latency}ms
        </span>
      )}
      <Wifi className={`w-9 h-9 ${getConnectionColor()}`} />
      {/* {connectionType && (
        <span className="text-sm text-gray-500">({connectionType})</span>
      )} */}
    </div>
  )
}

export default NetworkStatus

