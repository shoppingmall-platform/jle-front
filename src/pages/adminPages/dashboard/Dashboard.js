import React from "react";
import { CCard, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react";

const Dashboard = () => {
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>대시보드</strong>
            </CCardHeader>
            <CCardBody>
              <p className="text-body-secondary">
                JLE 쇼핑몰 관리자 대시보드입니다. 여기에 실제 쇼핑몰 데이터
                기반의 통계와 차트를 추가할 예정입니다.
              </p>
              {/* TODO: 쇼핑몰 통계 데이터 추가 예정
                - 오늘의 매출
                - 주문 현황
                - 신규 회원
                - 인기 상품
                - 매출 추이 그래프
              */}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Dashboard;
