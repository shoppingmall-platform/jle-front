import React from "react";
import { Divider } from "@mui/material";
import ItemWrapper from "@/components/common/home/ItemWrapper";
import ItemSlide from "@/components/common/home/ItemSlide";

//메인 사진 계속 바뀌게 - 그냥 이미지 파일
//Weekly best item - 사진 3개 , 계속 바뀌게  크기는 조금 작음
//Best item - 가로 2 또는 3 선택할 수 있게 + 사진 계속 바뀜 +더보기 칸(1/n) 1페이지당 18?
//new arrivals - 가로 2 또는 3 선택할 수 있게 + 사진 계속 바뀜 + 더보기 칸 (1/n)
//review - 가로 2 + 모두보기 -> 페이지를 따로 만들기

const Dashboard = () => {
  return (
    <div>
      <img
        src="https://cafe24.poxo.com/ec01/gwon3066/YepDBcpQi6F1EGuL9rzRwZlbyEg6QdanrR8cpMvEWIm1IPaEK0ju5UMWMuWxeVhPwhgNLWVqAtSDW9gvkeTqgw==/_/web/product/big/202405/f7949c909d65f6545f0b5bdf76fd2c3e.gif"
        style={{
          marginTop: "5px",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div style={{ margin: "5px", fontSize: "15px", textAlign: "center" }}>
        WEEKLY BEST ITEM
      </div>
      <ItemSlide />
      <Divider />
      <ItemWrapper title="Best Item" products={Array} />
      <Divider />
      <ItemWrapper title="New Item" products={Array} />
    </div>
  );
};

export default Dashboard;
