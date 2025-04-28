// 가격 포맷팅 (예: 59000 -> ₩59,000)
export function formatPrice(price) {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      currencyDisplay: "symbol",
      maximumFractionDigits: 0,
    }).format(price)
  }
  
  // 날짜 포맷팅 (예: 2023-05-24 -> 2023.05.24)
  export function formatDate(dateString) {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
  
    return `${year}.${month}.${day}`
  }
  
  // 문자열 자르기 (긴 텍스트 줄임)
  export function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }
  
  // 랜덤 ID 생성
  export function generateId() {
    return Math.random().toString(36).substring(2, 15)
  }
  
  // 쿠키 설정
  export function setCookie(name, value, days) {
    let expires = ""
    if (days) {
      const date = new Date()
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
      expires = "; expires=" + date.toUTCString()
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/"
  }
  
  // 쿠키 가져오기
  export function getCookie(name) {
    const nameEQ = name + "="
    const ca = document.cookie.split(";")
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === " ") c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }
  
  // 쿠키 삭제
  export function eraseCookie(name) {
    document.cookie = name + "=; Max-Age=-99999999; path=/"
  }
  
  