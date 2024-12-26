import axios from 'axios'
export const CONFIG = {
  SPOTIFY_SERVER_PATH: 'https://api.spotify.com/v1',
  SPOTIFY_TOKEN_PATH: 'https://accounts.spotify.com/api/token',
  SPOTIFY_AUTH_PATH: 'https://accounts.spotify.com/authorize',
  SPOTIFY_REDIRECT_URI: 'http://localhost:5173/callback',
  SPOTIFY_CLIENT_ID: '193c6409959343a68a3caddd55c933be',
  SPOTIFY_CLIENT_SECRET: 'bf71fe65b3e941e68e75d73e3da5c602'
}

export const getAccessToken = async (code: string) => {
  try {
    const params = new URLSearchParams()
    params.append('grant_type', 'authorization_code')
    params.append('code', code)
    params.append('redirect_uri', CONFIG.SPOTIFY_REDIRECT_URI!)
    params.append('client_id', CONFIG.SPOTIFY_CLIENT_ID!)
    params.append('client_secret', CONFIG.SPOTIFY_CLIENT_SECRET!)
    const response = await axios.post('https://accounts.spotify.com/api/token', params)
    return response.data
  } catch (error) {
    console.error('Error fetching access token:', error)
    return null // Trả về null để xử lý khi gọi hàm
  }
}

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const params = new URLSearchParams()
    params.append('grant_type', 'refresh_token')
    params.append('refresh_token', refreshToken)

    const response = await axios.post('https://accounts.spotify.com/api/token', params, {
      headers: {
        Authorization: `Basic ${btoa(
          `${CONFIG.SPOTIFY_CLIENT_ID}:${CONFIG.SPOTIFY_CLIENT_SECRET}`
        )}`
      }
    })
    return response.data
  } catch (error) {
    console.error('Error refreshing access token:', error)
    return null
  }
}
