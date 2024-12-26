import { refreshAccessToken } from '../services/spotify.service'

export const getValidAccessToken = async () => {
  try {
    const accessToken = localStorage.getItem('access_token')
    const refreshToken = localStorage.getItem('refresh_token')
    const expiresIn = parseInt(localStorage.getItem('expires_in') || '0', 10)
    const now = new Date().getTime() / 1000

    if (now < expiresIn) {
      return accessToken
    }

    if (refreshToken) {
      const data = await refreshAccessToken(refreshToken)
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('expires_in', (now + data.expires_in).toString())
      return data.access_token
    }
  } catch (error) {
    console.error(error)
    return null
  }
  //   throw new Error("No valid access token or refresh token available.");
}
