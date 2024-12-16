import React, { useState } from "react";
import ProductCard from "../ProductCard";
import GridViewIcon from "@mui/icons-material/GridView"; //4
import GridOnIcon from "@mui/icons-material/GridOn"; //9
import { Button, IconButton } from "@mui/material";

const ItemWrapper = (props) => {
  const bestTotalProducts = 30;
  const [visibleCount, setVisibleCount] = useState(6); //한 페이지 당 카드 개수
  const [columns, setColumns] = useState(2);

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 12);
  };

  return (
    <>
      <div style={{ textAlign: "center", margin: 1 }}>
        <IconButton
          onClick={() => setColumns(2)}
          sx={{ color: "black", margin: "0 1px" }}
        >
          <GridViewIcon />
        </IconButton>
        <IconButton
          onClick={() => setColumns(3)}
          sx={{ color: "black", margin: "0 1px" }}
        >
          <GridOnIcon />
        </IconButton>
      </div>
      <div style={{ margin: "5px", fontSize: "15px", textAlign: "center" }}>
        {props.title}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: "2px",
          padding: "2px",
        }}
      >
        {Array.from({ length: Math.min(visibleCount, bestTotalProducts) }).map(
          (_, index) => (
            <ProductCard key={index} />
          )
        )}
        {visibleCount < bestTotalProducts && (
          <div style={{ textAlign: "center", margin: "1px 0" }}>
            <Button onClick={loadMore} sx={{}}>
              더보기
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ItemWrapper;
