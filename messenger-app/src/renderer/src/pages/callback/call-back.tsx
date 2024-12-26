import { getAccessToken } from '@renderer/services/spotify.service'
import React, { useEffect } from 'react'

const Callback: React.FC = () => {
  useEffect(() => {
    const authenticate = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search)
        const code = queryParams.get('code')

        if (code) {
          const data = await getAccessToken(code)
          if (data) {
            localStorage.setItem('access_token', data.access_token)
            localStorage.setItem('refresh_token', data.refresh_token)
            localStorage.setItem('expires_in', data.expires_in.toString())
            window.location.href = '/music/library'
          } else {
            console.error('Failed to authenticate user')
          }
        }
      } catch (error) {
        console.error('Error during authentication:', error)
      }
    }

    authenticate()
  }, [])

  return <div>Authenticating...</div>
}

export default Callback
