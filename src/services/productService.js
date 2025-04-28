// 임시 데이터 - 실제 구현 시에는 API 호출로 대체
const products = [
    {
      id: "1",
      name: "미니멀 오버사이즈 셔츠",
      price: 59000,
      discountRate: 0,
      discountPrice: 59000,
      sku: "P001",
      categoryId: "shirts",
      images: [
        "https://cafe24.poxo.com/ec01/gwon3066/YepDBcpQi6F1EGuL9rzRwZlbyEg6QdanrR8cpMvEWIm1IPaEK0ju5UMWMuWxeVhPwhgNLWVqAtSDW9gvkeTqgw==/_/web/product/small/202404/67bd505df695ffd691125bb8b842cc70.gif",
        "https://cafe24.poxo.com/ec01/gwon3066/YepDBcpQi6F1EGuL9rzRwZlbyEg6QdanrR8cpMvEWIm1IPaEK0ju5UMWMuWxeVhPwhgNLWVqAtSDW9gvkeTqgw==/_/web/product/small/202404/67bd505df695ffd691125bb8b842cc70.gif",
        "https://cafe24.poxo.com/ec01/gwon3066/YepDBcpQi6F1EGuL9rzRwZlbyEg6QdanrR8cpMvEWIm1IPaEK0ju5UMWMuWxeVhPwhgNLWVqAtSDW9gvkeTqgw==/_/web/product/small/202404/67bd505df695ffd691125bb8b842cc70.gif",
        "https://cafe24.poxo.com/ec01/gwon3066/YepDBcpQi6F1EGuL9rzRwZlbyEg6QdanrR8cpMvEWIm1IPaEK0ju5UMWMuWxeVhPwhgNLWVqAtSDW9gvkeTqgw==/_/web/product/small/202404/67bd505df695ffd691125bb8b842cc70.gif",
      ],
      colors: [
        { name: "블랙", code: "BK", hex: "#000000" },
        { name: "화이트", code: "WH", hex: "#FFFFFF" },
        { name: "네이비", code: "NV", hex: "#000080" },
      ],
      sizes: ["S", "M", "L", "XL"],
      isNew: true,
      colorCount: 3,
      description: "미니멀한 디자인의 오버사이즈 셔츠입니다. 고급스러운 코튼 소재로 제작되어 편안한 착용감을 제공합니다.",
    },
    {
      id: "2",
      name: "베이직 슬림 데님",
      price: 79000,
      discountRate: 10,
      discountPrice: 71100,
      sku: "P002",
      categoryId: "bottom",
      images: [
        "https://cafe24.poxo.com/ec01/gwon3066/YepDBcpQi6F1EGuL9rzRwZlbyEg6QdanrR8cpMvEWIm1IPaEK0ju5UMWMuWxeVhPwhgNLWVqAtSDW9gvkeTqgw==/_/web/product/small/202404/67bd505df695ffd691125bb8b842cc70.gif",
        "https://cafe24.poxo.com/ec01/gwon3066/YepDBcpQi6F1EGuL9rzRwZlbyEg6QdanrR8cpMvEWIm1IPaEK0ju5UMWMuWxeVhPwhgNLWVqAtSDW9gvkeTqgw==/_/web/product/small/202404/67bd505df695ffd691125bb8b842cc70.gif",
        "https://cafe24.poxo.com/ec01/gwon3066/YepDBcpQi6F1EGuL9rzRwZlbyEg6QdanrR8cpMvEWIm1IPaEK0ju5UMWMuWxeVhPwhgNLWVqAtSDW9gvkeTqgw==/_/web/product/small/202404/67bd505df695ffd691125bb8b842cc70.gif",
        "https://cafe24.poxo.com/ec01/gwon3066/YepDBcpQi6F1EGuL9rzRwZlbyEg6QdanrR8cpMvEWIm1IPaEK0ju5UMWMuWxeVhPwhgNLWVqAtSDW9gvkeTqgw==/_/web/product/small/202404/67bd505df695ffd691125bb8b842cc70.gif",
      ],
      colors: [
        { name: "라이트블루", code: "LB", hex: "#ADD8E6" },
        { name: "다크블루", code: "DB", hex: "#00008B" },
        { name: "블랙", code: "BK", hex: "#000000" },
      ],
      sizes: ["28", "30", "32", "34", "36"],
      isNew: false,
      colorCount: 3,
      description: "클래식한 디자인의 슬림핏 데님입니다. 편안한 착용감과 내구성을 갖춘 제품입니다.",
    },
    {
      id: "3",
      name: "캐시미어 니트 스웨터",
      price: 129000,
      discountRate: 20,
      discountPrice: 103200,
      sku: "P003",
      categoryId: "top",
      images: [
        "https://cafe24.poxo.com/ec01/gwon3066/YepDBcpQi6F1EGuL9rzRwZlbyEg6QdanrR8cpMvEWIm1IPaEK0ju5UMWMuWxeVhPwhgNLWVqAtSDW9gvkeTqgw==/_/web/product/small/202404/67bd505df695ffd691125bb8b842cc70.gif",
        "https://cafe24.poxo.com/ec01/gwon3066/YepDBcpQi6F1EGuL9rzRwZlbyEg6QdanrR8cpMvEWIm1IPaEK0ju5UMWMuWxeVhPwhgNLWVqAtSDW9gvkeTqgw==/_/web/product/small/202404/67bd505df695ffd691125bb8b842cc70.gif",
        "https://cafe24.poxo.com/ec01/gwon3066/YepDBcpQi6F1EGuL9rzRwZlbyEg6QdanrR8cpMvEWIm1IPaEK0ju5UMWMuWxeVhPwhgNLWVqAtSDW9gvkeTqgw==/_/web/product/small/202404/67bd505df695ffd691125bb8b842cc70.gif",
        "https://cafe24.poxo.com/ec01/gwon3066/YepDBcpQi6F1EGuL9rzRwZlbyEg6QdanrR8cpMvEWIm1IPaEK0ju5UMWMuWxeVhPwhgNLWVqAtSDW9gvkeTqgw==/_/web/product/small/202404/67bd505df695ffd691125bb8b842cc70.gif",
      ],
      colors: [
        { name: "베이지", code: "BG", hex: "#F5F5DC" },
        { name: "그레이", code: "GY", hex: "#808080" },
        { name: "블랙", code: "BK", hex: "#000000" },
      ],
      sizes: ["S", "M", "L", "XL"],
      isNew: true,
      colorCount: 3,
      description: "부드러운 캐시미어 소재로 제작된 니트 스웨터입니다. 보온성이 뛰어나며 고급스러운 느낌을 줍니다.",
    },
    {
      id: "4",
      name: "울 블렌드 코트",
      price: 259000,
      discountRate: 0,
      discountPrice: 259000,
      sku: "P004",
      categoryId: "outer",
      images: [
        "https://cafe24.poxo.com/ec01/gwon3066/YepDBcpQi6F1EGuL9rzRwZlbyEg6QdanrR8cpMvEWIm1IPaEK0ju5UMWMuWxeVhPwhgNLWVqAtSDW9gvkeTqgw==/_/web/product/small/202404/67bd505df695ffd691125bb8b842cc70.gif",
        "https://cafe24.poxo.com/ec01/gwon3066/YepDBcpQi6F1EGuL9rzRwZlbyEg6QdanrR8cpMvEWIm1IPaEK0ju5UMWMuWxeVhPwhgNLWVqAtSDW9gvkeTqgw==/_/web/product/small/202404/67bd505df695ffd691125bb8b842cc70.gif",
        "https://cafe24.poxo.com/ec01/gwon3066/YepDBcpQi6F1EGuL9rzRwZlbyEg6QdanrR8cpMvEWIm1IPaEK0ju5UMWMuWxeVhPwhgNLWVqAtSDW9gvkeTqgw==/_/web/product/small/202404/67bd505df695ffd691125bb8b842cc70.gif",
        "https://cafe24.poxo.com/ec01/gwon3066/YepDBcpQi6F1EGuL9rzRwZlbyEg6QdanrR8cpMvEWIm1IPaEK0ju5UMWMuWxeVhPwhgNLWVqAtSDW9gvkeTqgw==/_/web/product/small/202404/67bd505df695ffd691125bb8b842cc70.gif",
      ],
      colors: [
        { name: "카멜", code: "CM", hex: "#C19A6B" },
        { name: "차콜", code: "CH", hex: "#36454F" },
      ],
      sizes: ["S", "M", "L", "XL"],
      isNew: false,
      colorCount: 2,
      description: "고급 울 소재를 사용한 클래식한 디자인의 코트입니다. 보온성이 뛰어나며 다양한 스타일링이 가능합니다.",
    },
  ]
  
  // 카테고리 데이터
  const categories = [
    { id: "best", name: "BEST", korName: "인기 상품" },
    { id: "new", name: "NEW 5%", korName: "신상품" },
    { id: "outer", name: "OUTER", korName: "아우터" },
    { id: "top", name: "TOP", korName: "상의" },
    { id: "shirts", name: "SHIRTS", korName: "셔츠" },
    { id: "bottom", name: "BOTTOM", korName: "하의" },
    { id: "acc", name: "ACC", korName: "액세서리" },
    { id: "shoes", name: "SHOES", korName: "신발" },
    { id: "sale", name: "SALE", korName: "할인 상품" },
  ]
  
  // 홈페이지 상품 가져오기
  export function getHomeProducts(type, limit = 4) {
    if (type === "best") {
      return products.slice(0, limit)
    }
  
    if (type === "new") {
      return products.filter((product) => product.isNew).slice(0, limit)
    }
  
    if (type === "sale") {
      return products.filter((product) => product.discountRate > 0).slice(0, limit)
    }
  
    return products.slice(0, limit)
  }
  
  // 카테고리별 상품 가져오기
  export function getCategoryProducts(categorySlug, limit = 12) {
    if (categorySlug === "best") {
      return products.slice(0, limit)
    }
  
    if (categorySlug === "new") {
      return products.filter((product) => product.isNew).slice(0, limit)
    }
  
    if (categorySlug === "sale") {
      return products.filter((product) => product.discountRate > 0).slice(0, limit)
    }
  
    return products.filter((product) => product.categoryId === categorySlug).slice(0, limit)
  }
  
  // 상품 ID로 상품 가져오기
  export function getProductById(productId) {
    return products.find((product) => product.id === productId)
  }
  
  // 관련 상품 가져오기
  export function getRelatedProducts(productId, categoryId, limit = 4) {
    return products.filter((product) => product.id !== productId && product.categoryId === categoryId).slice(0, limit)
  }
  
  // 카테고리 정보 가져오기
  export function getCategoryBySlug(slug) {
    return categories.find((category) => category.id === slug)
  }
  
  // 모든 카테고리 가져오기
  export function getAllCategories() {
    return categories
  }
  
  