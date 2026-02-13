import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Only create client if both URL and key are provided
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface VisitorData {
  id?: string
  ip_address?: string
  user_agent: string
  country?: string
  city?: string
  device_type: string
  browser: string
  os: string
  referrer?: string
  page_url: string
  session_duration?: number
  visited_at: string
}

export interface PageView {
  id?: string
  visitor_id: string
  page_path: string
  visited_at: string
  time_spent?: number
}

// Track visitor
export const trackVisitor = async (visitorData: Omit<VisitorData, 'id' | 'visited_at'>) => {
  if (!supabase) {
    console.warn('Supabase not configured - visitor tracking disabled')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('visitors')
      .insert([{
        ...visitorData,
        visited_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error tracking visitor:', error)
    return null
  }
}

// Track page view
export const trackPageView = async (pageData: Omit<PageView, 'id' | 'visited_at'>) => {
  if (!supabase) {
    console.warn('Supabase not configured - page view tracking disabled')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('page_views')
      .insert([{
        ...pageData,
        visited_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error tracking page view:', error)
    return null
  }
}

// Get analytics data
export const getAnalytics = async () => {
  if (!supabase) {
    console.warn('Supabase not configured - analytics disabled')
    return { visitors: [], pageViews: [], error: null }
  }

  try {
    const [visitorsResult, pageViewsResult] = await Promise.all([
      supabase
        .from('visitors')
        .select('*')
        .order('visited_at', { ascending: false }),
      supabase
        .from('page_views')
        .select('*')
        .order('visited_at', { ascending: false })
    ])

    return {
      visitors: visitorsResult.data || [],
      pageViews: pageViewsResult.data || [],
      error: visitorsResult.error || pageViewsResult.error
    }
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return { visitors: [], pageViews: [], error }
  }
}

// Get visitor stats
export const getVisitorStats = async () => {
  if (!supabase) {
    console.warn('Supabase not configured - visitor stats disabled')
    return null
  }

  try {
    const { data: visitors, error } = await supabase
      .from('visitors')
      .select('*')

    if (error) throw error

    const today = new Date().toISOString().split('T')[0]
    const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const thisMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const stats = {
      total: visitors.length,
      today: visitors.filter(v => v.visited_at.startsWith(today)).length,
      thisWeek: visitors.filter(v => v.visited_at >= thisWeek).length,
      thisMonth: visitors.filter(v => v.visited_at >= thisMonth).length,
      countries: [...new Set(visitors.map(v => v.country).filter(Boolean))].length,
      devices: visitors.reduce((acc: any, v) => {
        acc[v.device_type] = (acc[v.device_type] || 0) + 1
        return acc
      }, {}),
      browsers: visitors.reduce((acc: any, v) => {
        acc[v.browser] = (acc[v.browser] || 0) + 1
        return acc
      }, {})
    }

    return stats
  } catch (error) {
    console.error('Error fetching visitor stats:', error)
    return null
  }
}