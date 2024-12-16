import React, { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { useColorModes } from '@coreui/react'
import { routes } from './routers/route' // 기존 RouterProvider 설정
import './scss/style.scss' // CoreUI 스타일
import './scss/examples.scss' // CoreUI 예제 스타일 (필요하지 않다면 삭제 가능)
import useThemeStore from './store/themeStore' // Import zustand store

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const { theme, setTheme } = useThemeStore() // Get theme and setter from zustand

  useEffect(() => {
    // URL 파라미터에서 테마 추출
    const urlParams = new URLSearchParams(window.location.search)
    const themeFromUrl = urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)[0]

    if (themeFromUrl) {
      setColorMode(themeFromUrl)
      setTheme(themeFromUrl) // Update theme in zustand store
    }

    // Redux의 storedTheme로 초기 테마 설정
    if (!isColorModeSet()) {
      setColorMode(theme)
    }
  }, [isColorModeSet, setColorMode, theme, setTheme])

  return <RouterProvider router={routes} />
}

export default App
