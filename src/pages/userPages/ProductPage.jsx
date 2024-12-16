import React from "react";
import { useProductStore } from "@/store/product/productStore";
import { Button } from "primereact/button";
import { useApi } from "@/apis/index";

const ProductPage = () => {
  const { count, increment, decrement } = useProductStore();
  const api = useApi();

  const test = async () => {
    try {
      const response = await api.get("/v1/st/user/apis");
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>홈페이지 제목</h1>
      {count}
      <Button onClick={increment}> 증가</Button>
      <Button onClick={test}> 감소</Button>
      <p>홈페이지 내용이 여기에 들어갑니다.</p>
    </div>
  );
};

export default ProductPage;
