// 게스트 장바구니 옵션 추가 로직 없음, 변경 시 전부 없어지는 문제 있음 (고도화 시 참고)
// 모바일 반응형으로 구현
import React, { useState } from "react";
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CFormInput,
  CButton,
  CImage,
  CFormCheck,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
} from "@coreui/react";
import useGuestCartStore from "@/store/member/guestCartStore";
import useCheckboxSelection from "@/hooks/useCheckboxSelection";
import OptionChange from "@/components/user/product/OptionChange";

const GuestCartList = () => {
  const { cartItems, updateQuantity, removeItem, clearCart, updateOption } =
    useGuestCartStore();

  const [quantities, setQuantities] = useState(
    cartItems.reduce((acc, item) => {
      acc[item.productOptionId] = item.quantity;
      return acc;
    }, {})
  );
  const [visibleOption, setVisibleOption] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const {
    selectedItems: selectedIds,
    handleSelectAll,
    handleSelectItem,
    handleDeleteSelected,
  } = useCheckboxSelection(cartItems, "productOptionId");

  // PC용 - 팝업 방식
  const handleOptionChangeClickPC = (e, productOptionId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setVisibleOption({
      productOptionId,
      top: rect.top + window.scrollY + e.currentTarget.offsetHeight + 5,
      left: rect.left + window.scrollX,
      isModal: false,
    });
  };

  // 모바일용 - 모달 방식
  const handleOptionChangeClickMobile = (productOptionId) => {
    setVisibleOption({
      productOptionId,
      isModal: true,
    });
  };

  const handleOptionUpdateSuccess = (oldOptionId, newOption) => {
    updateOption(oldOptionId, newOption);
    setVisibleOption(null);
  };

  const handleQuantityChange = (productOptionId, value) => {
    setQuantities({ ...quantities, [productOptionId]: parseInt(value) });
  };

  const handleQuantityUpdate = (productOptionId) => {
    updateQuantity(productOptionId, quantities[productOptionId] || 1);
    alert("수량이 변경되었습니다!");
  };

  const handleDelete = (ids) => {
    ids.forEach((id) => removeItem(id));
    handleDeleteSelected();
  };

  const totalSelectedPrice = cartItems
    .filter((item) => selectedIds.includes(item.productOptionId))
    .reduce((sum, item) => {
      const price =
        typeof item.productInfo?.discountedPrice === "number"
          ? item.productInfo.discountedPrice
          : 0;
      const qty = quantities[item.productOptionId] || 1;
      return sum + price * qty;
    }, 0);

  const totalShippingFee =
    selectedIds.length === 0 || totalSelectedPrice < 70000 ? 3000 : 0;
  const totalPayment = totalSelectedPrice + totalShippingFee;

  // 현재 옵션변경 대상 아이템
  const currentOptionItem = visibleOption
    ? cartItems.find(
        (item) => item.productOptionId === visibleOption.productOptionId
      )
    : null;

  return (
    <>
      {/* ========== PC 버전 (테이블) ========== */}
      <div className="d-none d-md-block">
        <CTable align="middle" responsive className="custom-header">
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell scope="col">
                <CFormCheck
                  checked={selectedIds.length === cartItems.length}
                  onChange={handleSelectAll}
                />
              </CTableHeaderCell>
              <CTableHeaderCell scope="col">이미지</CTableHeaderCell>
              <CTableHeaderCell scope="col">상품정보</CTableHeaderCell>
              <CTableHeaderCell scope="col">수량</CTableHeaderCell>
              <CTableHeaderCell scope="col">상품금액</CTableHeaderCell>
              <CTableHeaderCell scope="col">할인된 금액</CTableHeaderCell>
              <CTableHeaderCell scope="col">배송비</CTableHeaderCell>
              <CTableHeaderCell scope="col">선택</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {cartItems.map((item) => {
              const info = item.productInfo;
              const option = info.productOptions.find(
                (opt) => opt.productOptionId === item.productOptionId
              );
              return (
                <CTableRow key={item.productOptionId}>
                  <CTableDataCell>
                    <CFormCheck
                      checked={selectedIds.includes(item.productOptionId)}
                      onChange={() => handleSelectItem(item.productOptionId)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <CImage src={info.thumbnailPath} width={80} />
                  </CTableDataCell>
                  <CTableDataCell className="text-start">
                    <div>{info.name}</div>
                    <div className="text-muted small">
                      {option.productOptionDetails
                        ?.map(
                          (opt) =>
                            `${opt.productOptionType}: ${opt.productOptionDetailName}`
                        )
                        .join(" / ")}
                    </div>
                    <CButton
                      color="secondary"
                      size="sm"
                      className="mt-1"
                      onClick={(e) =>
                        handleOptionChangeClickPC(e, item.productOptionId)
                      }
                    >
                      옵션변경
                    </CButton>
                    {visibleOption?.productOptionId ===
                      item.productOptionId && (
                      <OptionChange
                        cartItemId={item.productOptionId}
                        top={visibleOption.top}
                        left={visibleOption.left}
                        productOptions={info.productOptions}
                        selectedOptions={
                          selectedOptions[item.productOptionId] || {}
                        }
                        quantity={quantities[item.productOptionId]}
                        handleSelectOption={(type, value) =>
                          setSelectedOptions((prev) => ({
                            ...prev,
                            [item.productOptionId]: {
                              ...prev[item.productOptionId],
                              [type]: value,
                            },
                          }))
                        }
                        onUpdateSuccess={(newOption) =>
                          handleOptionUpdateSuccess(
                            item.productOptionId,
                            newOption
                          )
                        }
                        onClose={() => setVisibleOption(null)}
                        isGuest={true}
                      />
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex align-items-center">
                      <CFormInput
                        type="number"
                        min="1"
                        size="sm"
                        style={{ width: "60px" }}
                        value={quantities[item.productOptionId] || 1}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.productOptionId,
                            e.target.value
                          )
                        }
                      />
                      <CButton
                        color="secondary"
                        size="sm"
                        className="ms-2"
                        onClick={() =>
                          handleQuantityUpdate(item.productOptionId)
                        }
                      >
                        변경
                      </CButton>
                    </div>
                  </CTableDataCell>
                  <CTableDataCell>
                    {typeof info.price === "number"
                      ? (
                          info.price * (quantities[item.productOptionId] || 1)
                        ).toLocaleString() + "원"
                      : "가격 없음"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {typeof info.discountedPrice === "number" &&
                    info.discountedPrice !== info.price
                      ? (
                          info.discountedPrice *
                          (quantities[item.productOptionId] || 1)
                        ).toLocaleString() + "원"
                      : "-"}
                  </CTableDataCell>
                  <CTableDataCell>
                    {info.discountedPrice *
                      (quantities[item.productOptionId] || 1) >=
                    70000
                      ? "0원"
                      : "3,000원"}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="danger"
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete([item.productOptionId])}
                    >
                      삭제
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              );
            })}
          </CTableBody>
        </CTable>
      </div>

      {/* ========== 모바일 버전 (카드) ========== */}
      <div className="d-block d-md-none">
        {/* 전체 선택 */}
        <div className="mb-3 p-2 bg-light rounded">
          <CFormCheck
            label="전체 선택"
            checked={
              selectedIds.length === cartItems.length && cartItems.length > 0
            }
            onChange={handleSelectAll}
          />
        </div>

        {/* 카드 목록 */}
        {cartItems.map((item) => {
          const info = item.productInfo;
          const option = info.productOptions.find(
            (opt) => opt.productOptionId === item.productOptionId
          );

          return (
            <CCard
              key={item.productOptionId}
              className="mb-3"
              style={{
                border: selectedIds.includes(item.productOptionId)
                  ? "2px solid #0d6efd"
                  : "1px solid #dee2e6",
              }}
            >
              <CCardBody>
                <div className="d-flex align-items-start mb-2">
                  <CFormCheck
                    checked={selectedIds.includes(item.productOptionId)}
                    onChange={() => handleSelectItem(item.productOptionId)}
                    className="me-2 mt-1"
                  />
                  <div style={{ flex: "0 0 80px" }}>
                    <CImage
                      src={info.thumbnailPath}
                      width={80}
                      className="rounded"
                    />
                  </div>
                  <div className="ms-2 flex-grow-1">
                    <div className="fw-bold">{info.name}</div>
                    <div className="text-muted small">
                      {option?.productOptionDetails
                        ?.map(
                          (opt) =>
                            `${opt.productOptionType}: ${opt.productOptionDetailName}`
                        )
                        .join(" / ")}
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="d-flex justify-content-between small">
                    <span className="text-muted">상품금액</span>
                    <span>
                      {typeof info.price === "number"
                        ? (
                            info.price * (quantities[item.productOptionId] || 1)
                          ).toLocaleString() + "원"
                        : "가격 없음"}
                    </span>
                  </div>
                  {info.discountedPrice !== info.price && (
                    <div className="d-flex justify-content-between small">
                      <span className="text-muted">할인된 금액</span>
                      <span className="text-danger fw-bold">
                        {(
                          info.discountedPrice *
                          (quantities[item.productOptionId] || 1)
                        ).toLocaleString() + "원"}
                      </span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between small">
                    <span className="text-muted">배송비</span>
                    <span>
                      {info.discountedPrice *
                        (quantities[item.productOptionId] || 1) >=
                      70000
                        ? "0원"
                        : "3,000원"}
                    </span>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-2">
                  <span className="me-2 small">수량</span>
                  <div className="d-flex align-items-center">
                    <CButton
                      color="light"
                      size="sm"
                      onClick={() => {
                        const newQty = Math.max(
                          1,
                          (quantities[item.productOptionId] || 1) - 1
                        );
                        handleQuantityChange(item.productOptionId, newQty);
                      }}
                      style={{ padding: "4px 12px" }}
                    >
                      -
                    </CButton>
                    <span
                      className="mx-2 fw-bold"
                      style={{ minWidth: "30px", textAlign: "center" }}
                    >
                      {quantities[item.productOptionId] ?? 1}
                    </span>
                    <CButton
                      color="light"
                      size="sm"
                      onClick={() => {
                        const newQty =
                          (quantities[item.productOptionId] || 1) + 1;
                        handleQuantityChange(item.productOptionId, newQty);
                      }}
                      style={{ padding: "4px 12px" }}
                    >
                      +
                    </CButton>
                  </div>
                  <CButton
                    color="secondary"
                    size="sm"
                    className="ms-2"
                    onClick={() => handleQuantityUpdate(item.productOptionId)}
                  >
                    변경
                  </CButton>
                </div>

                <div className="d-flex gap-2">
                  <CButton
                    color="secondary"
                    size="sm"
                    onClick={() =>
                      handleOptionChangeClickMobile(item.productOptionId)
                    }
                  >
                    옵션변경
                  </CButton>
                  <CButton
                    color="danger"
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete([item.productOptionId])}
                  >
                    삭제
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          );
        })}
      </div>

      {/* ========== 옵션변경 모달 (모바일용) ========== */}
      {visibleOption?.isModal && currentOptionItem && (
        <CModal
          visible={true}
          onClose={() => setVisibleOption(null)}
          alignment="center"
        >
          <CModalHeader>
            <CModalTitle>옵션 변경</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <OptionChange
              cartItemId={currentOptionItem.productOptionId}
              productOptions={currentOptionItem.productInfo.productOptions}
              selectedOptions={
                selectedOptions[currentOptionItem.productOptionId] || {}
              }
              quantity={quantities[currentOptionItem.productOptionId]}
              handleSelectOption={(type, value) =>
                setSelectedOptions((prev) => ({
                  ...prev,
                  [currentOptionItem.productOptionId]: {
                    ...prev[currentOptionItem.productOptionId],
                    [type]: value,
                  },
                }))
              }
              onUpdateSuccess={(newOption) =>
                handleOptionUpdateSuccess(
                  currentOptionItem.productOptionId,
                  newOption
                )
              }
              onClose={() => setVisibleOption(null)}
              isGuest={true}
              isModal={true}
            />
          </CModalBody>
        </CModal>
      )}

      {/* ========== 공통 영역 ========== */}
      <CRow className="my-3">
        <CCol className="text-start">
          <CButton
            color="danger"
            variant="outline"
            size="sm"
            onClick={() => handleDelete(selectedIds)}
          >
            선택상품 삭제
          </CButton>
        </CCol>
        <CCol className="text-end">
          <CButton
            color="secondary"
            variant="outline"
            size="sm"
            onClick={clearCart}
          >
            장바구니 비우기
          </CButton>
        </CCol>
      </CRow>

      <CRow className="text-center my-4">
        <CCol>
          <div className="text-muted small">총 상품금액</div>
          <div className="fw-bold">
            {selectedIds.length === 0
              ? "-"
              : totalSelectedPrice.toLocaleString() + "원"}
          </div>
        </CCol>
        <CCol>
          <div className="text-muted small">총 배송비</div>
          <div className="fw-bold">
            {selectedIds.length === 0
              ? "-"
              : totalShippingFee.toLocaleString() + "원"}
          </div>
        </CCol>
        <CCol>
          <div className="text-muted small">결제예정금액</div>
          <div className="fw-bold">
            {selectedIds.length === 0
              ? "-"
              : totalPayment.toLocaleString() + "원"}
          </div>
        </CCol>
      </CRow>

      <hr />

      <div className="text-center">
        <CButton color="dark" className="me-2">
          전체상품주문
        </CButton>
        <CButton color="secondary" variant="outline">
          선택상품주문
        </CButton>
      </div>
    </>
  );
};

export default GuestCartList;
