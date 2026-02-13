import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Eye, 
  Globe, 
  Smartphone, 
  Monitor, 
  Tablet,
  TrendingUp,
  Calendar,
  Clock,
  MapPin,
  X
} from 'lucide-react'
import { getAnalytics, getVisitorStats } from '../../lib/supabase'

interface AnalyticsDashboardProps {
  isOpen: boolean
  onClose: () => void
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState<any>(null)
  const [visitors, setVisitors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchAnalytics()
    }
  }, [isOpen])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const [statsData, analyticsData] = await Promise.all([
        getVisitorStats(),
        getAnalytics()
      ])
      
      setStats(statsData)
      setVisitors(analyticsData.visitors)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return <Smartphone size={16} />
      case 'tablet': return <Tablet size={16} />
      default: return <Monitor size={16} />
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <TrendingUp className="text-blue-600 dark:text-blue-400" size={24} />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Portfolio Analytics
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Stats Overview */}
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="text-blue-600 dark:text-blue-400" size={20} />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Visitors</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.total}</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="text-green-600 dark:text-green-400" size={20} />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Today</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.today}</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="text-purple-600 dark:text-purple-400" size={20} />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">This Week</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.thisWeek}</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Globe className="text-orange-600 dark:text-orange-400" size={20} />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Countries</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.countries}</p>
                  </div>
                </div>
              )}

              {/* Device & Browser Stats */}
              {stats && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Device Types</h3>
                    <div className="space-y-3">
                      {Object.entries(stats.devices).map(([device, count]: [string, any]) => (
                        <div key={device} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getDeviceIcon(device)}
                            <span className="text-gray-600 dark:text-gray-300 capitalize">{device}</span>
                          </div>
                          <span className="font-semibold text-gray-800 dark:text-gray-100">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Browsers</h3>
                    <div className="space-y-3">
                      {Object.entries(stats.browsers).slice(0, 5).map(([browser, count]: [string, any]) => (
                        <div key={browser} className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-300">{browser}</span>
                          <span className="font-semibold text-gray-800 dark:text-gray-100">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Visitors */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Recent Visitors</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-2 text-gray-600 dark:text-gray-300">Time</th>
                        <th className="text-left py-2 text-gray-600 dark:text-gray-300">Location</th>
                        <th className="text-left py-2 text-gray-600 dark:text-gray-300">Device</th>
                        <th className="text-left py-2 text-gray-600 dark:text-gray-300">Browser</th>
                        <th className="text-left py-2 text-gray-600 dark:text-gray-300">Referrer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitors.slice(0, 10).map((visitor, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-700/50">
                          <td className="py-3 text-gray-800 dark:text-gray-200">
                            {formatDate(visitor.visited_at)}
                          </td>
                          <td className="py-3">
                            <div className="flex items-center space-x-1">
                              <MapPin size={12} className="text-gray-400" />
                              <span className="text-gray-600 dark:text-gray-300">
                                {visitor.city}, {visitor.country}
                              </span>
                            </div>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center space-x-2">
                              {getDeviceIcon(visitor.device_type)}
                              <span className="text-gray-600 dark:text-gray-300 capitalize">
                                {visitor.device_type}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 text-gray-600 dark:text-gray-300">{visitor.browser}</td>
                          <td className="py-3 text-gray-600 dark:text-gray-300 truncate max-w-32">
                            {visitor.referrer === 'Direct' ? 'Direct' : new URL(visitor.referrer || '').hostname}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard