import { useEffect, useState } from 'react'
import { trackVisitor, trackPageView, VisitorData } from '../lib/supabase'

// Get device type
const getDeviceType = (): string => {
  const userAgent = navigator.userAgent.toLowerCase()
  if (/tablet|ipad|playbook|silk/.test(userAgent)) return 'tablet'
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/.test(userAgent)) return 'mobile'
  return 'desktop'
}

// Get browser name
const getBrowser = (): string => {
  const userAgent = navigator.userAgent
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  if (userAgent.includes('Opera')) return 'Opera'
  return 'Unknown'
}

// Get OS
const getOS = (): string => {
  const userAgent = navigator.userAgent
  if (userAgent.includes('Windows')) return 'Windows'
  if (userAgent.includes('Mac')) return 'macOS'
  if (userAgent.includes('Linux')) return 'Linux'
  if (userAgent.includes('Android')) return 'Android'
  if (userAgent.includes('iOS')) return 'iOS'
  return 'Unknown'
}

// Get location (simplified - in production you'd use a geolocation API)
const getLocation = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    return {
      country: data.country_name,
      city: data.city,
      ip: data.ip
    }
  } catch (error) {
    console.error('Error getting location:', error)
    return {
      country: 'Unknown',
      city: 'Unknown',
      ip: 'Unknown'
    }
  }
}

export const useAnalytics = () => {
  const [visitorId, setVisitorId] = useState<string | null>(null)
  const [isTracking, setIsTracking] = useState(false)

  useEffect(() => {
    const initializeTracking = async () => {
      if (isTracking) return
      setIsTracking(true)

      try {
        const location = await getLocation()
        
        const visitorData: Omit<VisitorData, 'id' | 'visited_at'> = {
          ip_address: location.ip,
          user_agent: navigator.userAgent,
          country: location.country,
          city: location.city,
          device_type: getDeviceType(),
          browser: getBrowser(),
          os: getOS(),
          referrer: document.referrer || 'Direct',
          page_url: window.location.href
        }

        const visitor = await trackVisitor(visitorData)
        if (visitor) {
          setVisitorId(visitor.id)
          
          // Track initial page view
          await trackPageView({
            visitor_id: visitor.id,
            page_path: window.location.pathname
          })
        }
      } catch (error) {
        console.error('Error initializing tracking:', error)
      }
    }

    initializeTracking()
  }, [isTracking])

  // Track page changes
  const trackPage = async (pagePath: string) => {
    if (visitorId) {
      await trackPageView({
        visitor_id: visitorId,
        page_path: pagePath
      })
    }
  }

  return { visitorId, trackPage }
}