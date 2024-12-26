import { SpotifyAPIResult } from '@renderer/types/spotify'
import { getValidAccessToken } from '@renderer/utils/tokenManager'
import axios from 'axios'
import { useEffect, useState } from 'react'

const useSpotifyAPI = <T>(endpoint: string, options: Record<string, any> = {}) => {
  const [result, setResult] = useState<SpotifyAPIResult<T>>({
    data: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setResult((prev) => ({ ...prev, loading: true, error: null }))
        const token = await getValidAccessToken()
        if (!token) {
          throw new Error('Invalid token')
        }

        const response = await axios.get<T>(`https://api.spotify.com/v1${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          ...options
        })

        setResult({ data: response.data, loading: false, error: null })
      } catch (error) {
        console.error('Error fetching Spotify API:', error)
        setResult({ data: null, loading: false, error: (error as Error).message })
      }
    }

    fetchData()
  }, [endpoint, JSON.stringify(options)])

  return result
}

export default useSpotifyAPI
