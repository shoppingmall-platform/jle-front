import React from "react";
import "@/App.css";
import { Divider } from "@mui/material";

const ReviewCard = () => {
  return (
    <div
      style={{
        width: "200px",
        height: "300px",
        border: "1px solid #ddd",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <img
        src="https://gwon3066.cafe24.com/web/upload/appfiles/tgHZp6LCG5KuklqvIYgrtB/8aa261f8e9e9c70eeea6837f0114333f.jpeg"
        style={{ width: "100%", height: "60%" }}
      />
      <div style={{ margin: "5px" }}>
        <img
          src="https://cafe24.poxo.com/ec01/gwon3066/YepDBcpQi6F1EGuL9rzRwZlbyEg6QdanrR8cpMvEWIm1IPaEK0ju5UMWMuWxeVhPwhgNLWVqAtSDW9gvkeTqgw==/_/web/product/small/202404/67bd505df695ffd691125bb8b842cc70.gif"
          style={{ width: "35px", height: "35px", borderRadius: "50%" }}
        />
        <p>상품명, 평점숫자, 리뷰 몇개</p>
      </div>
      <Divider />
      <div>
        <p>별점, 상품옵션, 리뷰내용, 닉네임/날짜</p>
      </div>
    </div>
  );
};

export default ReviewCard;
