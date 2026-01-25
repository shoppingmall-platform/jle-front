import React, { useEffect, useState } from "react";
import {
  CContainer,
  CCard,
  CCardBody,
  CTable,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CButton,
  CFormCheck,
  CAlert,
  CRow,
  CCol,
  CBadge,
} from "@coreui/react";
import { useNavigate } from "react-router-dom";
import addressApis from "@/apis/member/addressApis";

const AddressList = () => {
  const navigate = useNavigate();
  const [addressList, setAddressList] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);

  const fetchAddresses = async () => {
    try {
      const addressData = await addressApis.getMyAddresses();
      setAddressList(addressData || []);
    } catch {
      setAlertMsg("배송지 정보를 불러오는 데 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!selectedAddressId) return setAlertMsg("삭제할 배송지를 선택해주세요.");
    try {
      await addressApis.deleteAddress(selectedAddressId);
      setSelectedAddressId(null);
      fetchAddresses();
    } catch {
      setAlertMsg("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleSetDefault = async () => {
    const item = addressList.find((a) => a.addressId === selectedAddressId);
    if (!item) return setAlertMsg("기본으로 설정할 배송지를 선택해주세요.");

    try {
      await addressApis.updateAddress({ ...item, isDefault: 1 });
      fetchAddresses();
    } catch {
      setAlertMsg("기본 배송지 설정 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <CContainer style={{ maxWidth: "1200px" }} className="mt-5">
      <h4 className="mb-1">배송 주소록 관리</h4>
      <p className="text-muted mb-4">
        자주 쓰는 배송지들을 등록/관리하실 수 있습니다.
      </p>

      {alertMsg && <CAlert color="danger">{alertMsg}</CAlert>}

      {/* ========== PC 버전 (테이블) ========== */}
      <div className="d-none d-md-block">
        <CTable bordered hover responsive>
          <thead>
            <CTableRow>
              <CTableHeaderCell style={{ width: "5%" }}></CTableHeaderCell>
              <CTableHeaderCell style={{ width: "10%" }}>
                배송지명
              </CTableHeaderCell>
              <CTableHeaderCell style={{ width: "10%" }}>
                수령인
              </CTableHeaderCell>
              <CTableHeaderCell style={{ width: "10%" }}>
                일반전화
              </CTableHeaderCell>
              <CTableHeaderCell style={{ width: "15%" }}>
                휴대전화
              </CTableHeaderCell>
              <CTableHeaderCell style={{ width: "45%" }}>주소</CTableHeaderCell>
              <CTableHeaderCell style={{ width: "10%" }}>
                기본 여부
              </CTableHeaderCell>
            </CTableRow>
          </thead>
          <CTableBody>
            {addressList.map((item) => (
              <CTableRow key={item.addressId}>
                <CTableDataCell>
                  <CFormCheck
                    type="radio"
                    name="selectAddress"
                    checked={selectedAddressId === item.addressId}
                    onChange={() => setSelectedAddressId(item.addressId)}
                  />
                </CTableDataCell>
                <CTableDataCell>{item.alias}</CTableDataCell>
                <CTableDataCell>{item.receiverName}</CTableDataCell>
                <CTableDataCell>-</CTableDataCell>
                <CTableDataCell>{item.phoneNumber}</CTableDataCell>
                <CTableDataCell>{`(${item.zipcode})${item.address1} ${item.address2}`}</CTableDataCell>
                <CTableDataCell>
                  {item.isDefault && <CBadge color="primary">기본</CBadge>}
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>

      {/* ========== 모바일 버전 (카드) ========== */}
      <div className="d-block d-md-none">
        {addressList.length === 0 ? (
          <CAlert color="info">등록된 배송지가 없습니다.</CAlert>
        ) : (
          addressList.map((item) => (
            <CCard
              key={item.addressId}
              className="mb-3"
              style={{
                border:
                  selectedAddressId === item.addressId
                    ? "2px solid #0d6efd"
                    : "1px solid #dee2e6",
              }}
            >
              <CCardBody>
                <div className="d-flex align-items-start mb-2">
                  <CFormCheck
                    type="radio"
                    name="selectAddress"
                    checked={selectedAddressId === item.addressId}
                    onChange={() => setSelectedAddressId(item.addressId)}
                    className="me-2 mt-1"
                  />
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-1">
                      <h6 className="mb-0 me-2">{item.alias}</h6>
                      {item.isDefault && <CBadge color="primary">기본</CBadge>}
                    </div>
                    <div className="text-muted small mb-2">
                      {item.receiverName}
                    </div>
                  </div>
                </div>

                <div className="mb-1">
                  <div className="small">
                    <strong>전화번호:</strong> {item.phoneNumber}
                  </div>
                </div>

                <div className="small">
                  <strong>주소:</strong>
                  <div>({item.zipcode})</div>
                  <div>{item.address1}</div>
                  <div>{item.address2}</div>
                </div>
              </CCardBody>
            </CCard>
          ))
        )}
      </div>

      {/* ========== 공통 버튼 영역 ========== */}
      <div className="d-flex flex-column flex-md-row justify-content-between gap-2 mt-3">
        <CButton
          color="danger"
          variant="outline"
          onClick={handleDelete}
          disabled={!selectedAddressId}
          size="sm"
          className="w-100 w-md-auto"
        >
          선택 주소록 삭제
        </CButton>

        <div className="d-flex flex-column flex-md-row gap-2">
          <CButton
            color="secondary"
            onClick={handleSetDefault}
            disabled={!selectedAddressId}
            size="sm"
            className="w-100 w-md-auto"
          >
            기본 배송지로 설정
          </CButton>
          <CButton
            color="dark"
            onClick={() => navigate("/mypage/address/add")}
            size="sm"
            className="w-100 w-md-auto"
          >
            배송지등록
          </CButton>
        </div>
      </div>
    </CContainer>
  );
};

export default AddressList;
