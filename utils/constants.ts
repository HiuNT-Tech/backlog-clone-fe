let apiRoot: string = ''
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-api-0gbu.onrender.com'
}
export const API_ROOT = apiRoot

export const APP_BAR_HEIGHT = '58px'
export const BOARD_BAR_HEIGHT = '60px'
export const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`
export const COLUMN_HEADER_HEIGHT = '50px'
export const COLUMN_FOOTER_HEIGHT = '56px'
