// pages/Cart/MemberCartList.js
import React, { useState, useEffect } from "react";
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
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
} from "@coreui/react";
import OptionChange from "@/components/user/product/OptionChange";
import useCheckboxSelection from "@/hooks/useCheckboxSelection";
import { useNavigate } from "react-router-dom";
import {
  updateCartItem,
  deleteCartItems,
  getCartItems,
} from "@/apis/member/cartApis";

const MemberCartList = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [visibleOption, setVisibleOption] = useState(null);
  const [quantities, setQuantities] = useState({});

  const {
    selectedItems: selectedCartItemIds,
    handleSelectAll,
    handleSelectItem,
    handleDeleteSelected,
  } = useCheckboxSelection(cartItems, "cartItemId");

  const fetchCartItems = async () => {
    try {
      const data = await getCartItems();
      setCartItems(data.cartItems);
      const quantityMap = data.cartItems.reduce((acc, item) => {
        acc[item.cartItemId] = item.quantity;
        return acc;
      }, {});
      setQuantities(quantityMap);
    } catch (err) {
      console.error("장바구니 데이터를 불러오는데 실패했습니다.");
    }
  };

  // 품절 여부 확인
  const isOutOfStock = (item) => {
    const option = item.productOptionInfo.productInfo.productOptions.find(
      (opt) => opt.productOptionId === item.productOptionInfo.productOptionId
    );
    return option && option.stockQuantity === 0;
  };

  // 재고 부족 확인 (주문 수량 > 재고)
  const isInsufficientStock = (item) => {
    const option = item.productOptionInfo.productInfo.productOptions.find(
      (opt) => opt.productOptionId === item.productOptionInfo.productOptionId
    );
    const requestedQuantity = quantities[item.cartItemId] || item.quantity;
    return option && option.stockQuantity < requestedQuantity;
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleQuantityChange = (cartItemId, value) => {
    setQuantities({ ...quantities, [cartItemId]: parseInt(value) });
  };

  // PC용 - 팝업 방식
  const handleOptionChangeClickPC = (e, cartItemId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setVisibleOption({
      cartItemId,
      top: rect.top + window.scrollY + e.currentTarget.offsetHeight + 5,
      left: rect.left + window.scrollX,
      isModal: false,
    });
  };

  // 모바일용 - 모달 방식
  const handleOptionChangeClickMobile = (cartItemId) => {
    setVisibleOption({
      cartItemId,
      isModal: true,
    });
  };

  const handleQuantityUpdate = async (cartItemId, productOptionId) => {
    const quantity = quantities[cartItemId];
    const payload = [{ cartItemId, productOptionId, quantity }];
    try {
      await updateCartItem(payload);
      fetchCartItems();
      alert("수량이 변경되었습니다!");
    } catch (err) {
      console.error("❌ 수량 변경 실패:", err);
      alert("수량 변경에 실패했습니다.");
    }
  };

  const handleDelete = async (ids) => {
    const payload = ids.map((id) => ({ cartItemId: id }));
    try {
      await deleteCartItems(payload);
      alert("삭제되었습니다.");
      handleDeleteSelected();
      fetchCartItems();
    } catch (err) {
      console.error("❌ 삭제 실패:", err);
      alert("삭제에 실패했습니다.");
    }
  };

  const totalSelectedPrice = cartItems
    .filter((item) => selectedCartItemIds.includes(item.cartItemId))
    .reduce((sum, item) => {
      const info = item.productOptionInfo.productInfo;
      const option = info.productOptions.find(
        (opt) => opt.productOptionId === item.productOptionInfo.productOptionId
      );
      const additionalPrice = option?.additionalPrice || 0;
      const quantity = quantities[item.cartItemId] || 1;
      const itemPrice = (info.discountedPrice + additionalPrice) * quantity;
      return sum + itemPrice;
    }, 0);

  const totalShippingFee =
    selectedCartItemIds.length === 0 || totalSelectedPrice < 70000 ? 3000 : 0;
  const totalPayment = totalSelectedPrice + totalShippingFee;

  // 1) 선택된 상품만 주문
  const handleOrderSelected = () => {
    if (selectedCartItemIds.length === 0) {
      alert("주문할 상품을 선택해주세요.");
      return;
    }

    // 품절 상품 체크
    const selectedItems = cartItems.filter((item) =>
      selectedCartItemIds.includes(item.cartItemId)
    );
    const hasOutOfStock = selectedItems.some((item) => isOutOfStock(item));
    const hasInsufficientStock = selectedItems.some((item) =>
      isInsufficientStock(item)
    );

    if (hasOutOfStock) {
      alert(
        "선택한 상품 중 품절된 상품이 있습니다.\n품절 상품을 제외하고 주문해주세요."
      );
      return;
    }

    if (hasInsufficientStock) {
      alert(
        "선택한 상품 중 재고가 부족한 상품이 있습니다.\n수량을 조정해주세요."
      );
      return;
    }

    // e.g. selectedCartItemIds = [6, 8] → "6,8"
    const qs = selectedCartItemIds.join(",");
    navigate(`/order?cartItems=${qs}`);
  };

  // 2) 전체 상품 주문
  const handleOrderAll = () => {
    if (cartItems.length === 0) {
      alert("장바구니에 상품이 없습니다.");
      return;
    }

    // 품절 상품 체크
    const hasOutOfStock = cartItems.some((item) => isOutOfStock(item));
    const hasInsufficientStock = cartItems.some((item) =>
      isInsufficientStock(item)
    );

    if (hasOutOfStock) {
      alert(
        "장바구니에 품절된 상품이 있습니다.\n품절 상품을 삭제하고 주문해주세요."
      );
      return;
    }

    if (hasInsufficientStock) {
      alert("장바구니에 재고가 부족한 상품이 있습니다.\n수량을 조정해주세요.");
      return;
    }

    // allCartIds = [6, 8, ...]
    const allCartIds = cartItems.map((item) => item.cartItemId);
    const qs = allCartIds.join(",");
    navigate(`/order?cartItems=${qs}`);
  };

  // 현재 옵션변경 대상 아이템
  const currentOptionItem = visibleOption
    ? cartItems.find((item) => item.cartItemId === visibleOption.cartItemId)
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
                  checked={selectedCartItemIds.length === cartItems.length}
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
              const info = item.productOptionInfo.productInfo;
              const option = info.productOptions.find(
                (opt) =>
                  opt.productOptionId === item.productOptionInfo.productOptionId
              );
              return (
                <CTableRow
                  key={item.cartItemId}
                  style={{
                    backgroundColor: isOutOfStock(item)
                      ? "#f8f9fa"
                      : "transparent",
                    opacity: isOutOfStock(item) ? 0.6 : 1,
                  }}
                >
                  <CTableDataCell>
                    <CFormCheck
                      checked={selectedCartItemIds.includes(item.cartItemId)}
                      onChange={() => handleSelectItem(item.cartItemId)}
                      disabled={isOutOfStock(item)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>
                    <div style={{ position: "relative" }}>
                      <CImage src={info.thumbnailPath} width={80} />
                      {isOutOfStock(item) && (
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "bold",
                            width: "80px",
                          }}
                        >
                          품절
                        </div>
                      )}
                    </div>
                  </CTableDataCell>
                  <CTableDataCell className="text-start">
                    <div>{info.name}</div>
                    <div className="text-muted small">
                      {option.productOptionDetails
                        .map(
                          (opt) =>
                            `${opt.productOptionType}: ${opt.productOptionDetailName}`
                        )
                        .join(" / ")}
                    </div>
                    {isOutOfStock(item) ? (
                      <div className="mt-2">
                        <span className="badge bg-danger">
                          품절된 상품입니다
                        </span>
                      </div>
                    ) : isInsufficientStock(item) ? (
                      <div className="mt-2">
                        <span className="badge bg-warning text-dark">
                          재고 부족 (재고: {option.stockQuantity}개)
                        </span>
                      </div>
                    ) : (
                      <>
                        <CButton
                          color="secondary"
                          size="sm"
                          className="mt-1"
                          onClick={(e) =>
                            handleOptionChangeClickPC(e, item.cartItemId)
                          }
                        >
                          옵션변경
                        </CButton>
                        {visibleOption?.cartItemId === item.cartItemId && (
                          <OptionChange
                            cartItemId={item.cartItemId}
                            top={visibleOption.top}
                            left={visibleOption.left}
                            productOptions={info.productOptions}
                            selectedOptions={
                              selectedOptions[item.cartItemId] || {}
                            }
                            quantity={quantities[item.cartItemId]}
                            handleSelectOption={(type, value) =>
                              setSelectedOptions((prev) => ({
                                ...prev,
                                [item.cartItemId]: {
                                  ...prev[item.cartItemId],
                                  [type]: value,
                                },
                              }))
                            }
                            onUpdateSuccess={() => {
                              fetchCartItems();
                              setVisibleOption(null);
                            }}
                            onClose={() => setVisibleOption(null)}
                          />
                        )}
                      </>
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    {isOutOfStock(item) ? (
                      <span className="text-danger">품절</span>
                    ) : (
                      <div className="d-flex align-items-center">
                        <CFormInput
                          type="number"
                          min="1"
                          max={option.stockQuantity}
                          size="sm"
                          style={{ width: "60px" }}
                          value={quantities[item.cartItemId] ?? 1}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.cartItemId,
                              e.target.value
                            )
                          }
                        />
                        <CButton
                          color="secondary"
                          size="sm"
                          className="ms-2"
                          onClick={() =>
                            handleQuantityUpdate(
                              item.cartItemId,
                              item.productOptionInfo.productOptionId,
                              quantities[item.cartItemId]
                            )
                          }
                          disabled={isInsufficientStock(item)}
                        >
                          변경
                        </CButton>
                      </div>
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    {typeof info.price === "number"
                      ? (
                          (info.price + (option?.additionalPrice || 0)) *
                          (quantities[item.cartItemId] || 1)
                        ).toLocaleString() + "원"
                      : "가격 없음"}
                  </CTableDataCell>

                  <CTableDataCell>
                    {typeof info.discountedPrice === "number" &&
                    info.discountedPrice !== info.price
                      ? (
                          (info.discountedPrice +
                            (option?.additionalPrice || 0)) *
                          (quantities[item.cartItemId] || 1)
                        ).toLocaleString() + "원"
                      : "-"}
                  </CTableDataCell>

                  <CTableDataCell>
                    {(info.discountedPrice + (option?.additionalPrice || 0)) *
                      (quantities[item.cartItemId] || 1) >=
                    70000
                      ? "0원"
                      : "3,000원"}
                  </CTableDataCell>

                  <CTableDataCell>
                    <div className="d-flex flex-column">
                      <CButton
                        color="primary"
                        size="sm"
                        className="mb-1"
                        onClick={() =>
                          navigate(`/order?cartItems=${item.cartItemId}`)
                        }
                        disabled={
                          isOutOfStock(item) || isInsufficientStock(item)
                        }
                      >
                        {isOutOfStock(item) ? "품절" : "주문하기"}
                      </CButton>
                      <CButton
                        color="danger"
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete([item.cartItemId])}
                      >
                        삭제
                      </CButton>
                    </div>
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
              selectedCartItemIds.length === cartItems.length &&
              cartItems.length > 0
            }
            onChange={handleSelectAll}
          />
        </div>

        {/* 카드 목록 */}
        {cartItems.map((item) => {
          const info = item.productOptionInfo.productInfo;
          const option = info.productOptions.find(
            (opt) =>
              opt.productOptionId === item.productOptionInfo.productOptionId
          );
          const isOut = isOutOfStock(item);
          const isInsufficient = isInsufficientStock(item);

          return (
            <CCard
              key={item.cartItemId}
              className="mb-3"
              style={{
                opacity: isOut ? 0.6 : 1,
                border: selectedCartItemIds.includes(item.cartItemId)
                  ? "2px solid #0d6efd"
                  : "1px solid #dee2e6",
              }}
            >
              <CCardBody>
                <div className="d-flex align-items-start mb-2">
                  <CFormCheck
                    checked={selectedCartItemIds.includes(item.cartItemId)}
                    onChange={() => handleSelectItem(item.cartItemId)}
                    disabled={isOut}
                    className="me-2 mt-1"
                  />
                  <div style={{ position: "relative", flex: "0 0 80px" }}>
                    <CImage
                      src={info.thumbnailPath}
                      width={80}
                      className="rounded"
                    />
                    {isOut && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "bold",
                          borderRadius: "4px",
                        }}
                      >
                        품절
                      </div>
                    )}
                  </div>
                  <div className="ms-2 flex-grow-1">
                    <div className="fw-bold">{info.name}</div>
                    <div className="text-muted small">
                      {option.productOptionDetails
                        .map(
                          (opt) =>
                            `${opt.productOptionType}: ${opt.productOptionDetailName}`
                        )
                        .join(" / ")}
                    </div>
                  </div>
                </div>

                {isOut ? (
                  <CBadge color="danger" className="mb-2">
                    품절된 상품입니다
                  </CBadge>
                ) : isInsufficient ? (
                  <CBadge color="warning" textColor="dark" className="mb-2">
                    재고 부족 (재고: {option.stockQuantity}개)
                  </CBadge>
                ) : null}

                <div className="mb-2">
                  <div className="d-flex justify-content-between small">
                    <span className="text-muted">상품금액</span>
                    <span>
                      {typeof info.price === "number"
                        ? (
                            (info.price + (option?.additionalPrice || 0)) *
                            (quantities[item.cartItemId] || 1)
                          ).toLocaleString() + "원"
                        : "가격 없음"}
                    </span>
                  </div>
                  {info.discountedPrice !== info.price && (
                    <div className="d-flex justify-content-between small">
                      <span className="text-muted">할인된 금액</span>
                      <span className="text-danger fw-bold">
                        {(
                          (info.discountedPrice +
                            (option?.additionalPrice || 0)) *
                          (quantities[item.cartItemId] || 1)
                        ).toLocaleString() + "원"}
                      </span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between small">
                    <span className="text-muted">배송비</span>
                    <span>
                      {(info.discountedPrice + (option?.additionalPrice || 0)) *
                        (quantities[item.cartItemId] || 1) >=
                      70000
                        ? "0원"
                        : "3,000원"}
                    </span>
                  </div>
                </div>

                {!isOut && (
                  <div className="d-flex align-items-center mb-2">
                    <span className="me-2 small">수량</span>
                    <div className="d-flex align-items-center">
                      <CButton
                        color="light"
                        size="sm"
                        onClick={() => {
                          const newQty = Math.max(
                            1,
                            (quantities[item.cartItemId] || 1) - 1
                          );
                          handleQuantityChange(item.cartItemId, newQty);
                        }}
                        style={{ padding: "4px 12px" }}
                      >
                        -
                      </CButton>
                      <span
                        className="mx-2 fw-bold"
                        style={{ minWidth: "30px", textAlign: "center" }}
                      >
                        {quantities[item.cartItemId] ?? 1}
                      </span>
                      <CButton
                        color="light"
                        size="sm"
                        onClick={() => {
                          const newQty = Math.min(
                            option.stockQuantity,
                            (quantities[item.cartItemId] || 1) + 1
                          );
                          handleQuantityChange(item.cartItemId, newQty);
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
                      onClick={() =>
                        handleQuantityUpdate(
                          item.cartItemId,
                          item.productOptionInfo.productOptionId
                        )
                      }
                      disabled={isInsufficient}
                    >
                      변경
                    </CButton>
                  </div>
                )}

                <div className="d-flex gap-2">
                  {!isOut && (
                    <CButton
                      color="secondary"
                      size="sm"
                      onClick={() =>
                        handleOptionChangeClickMobile(item.cartItemId)
                      }
                    >
                      옵션변경
                    </CButton>
                  )}
                  <CButton
                    color="primary"
                    size="sm"
                    onClick={() =>
                      navigate(`/order?cartItems=${item.cartItemId}`)
                    }
                    disabled={isOut || isInsufficient}
                  >
                    주문하기
                  </CButton>
                  <CButton
                    color="danger"
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete([item.cartItemId])}
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
              cartItemId={currentOptionItem.cartItemId}
              productOptions={
                currentOptionItem.productOptionInfo.productInfo.productOptions
              }
              selectedOptions={
                selectedOptions[currentOptionItem.cartItemId] || {}
              }
              quantity={quantities[currentOptionItem.cartItemId]}
              handleSelectOption={(type, value) =>
                setSelectedOptions((prev) => ({
                  ...prev,
                  [currentOptionItem.cartItemId]: {
                    ...prev[currentOptionItem.cartItemId],
                    [type]: value,
                  },
                }))
              }
              onUpdateSuccess={() => {
                fetchCartItems();
                setVisibleOption(null);
              }}
              onClose={() => setVisibleOption(null)}
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
            onClick={() => handleDelete(selectedCartItemIds)}
          >
            선택상품 삭제
          </CButton>
        </CCol>
        <CCol className="text-end">
          <CButton
            color="secondary"
            variant="outline"
            size="sm"
            onClick={() =>
              handleDelete(cartItems.map((item) => item.cartItemId))
            }
          >
            장바구니 비우기
          </CButton>
        </CCol>
      </CRow>

      <hr />

      <CRow className="text-center my-4">
        <CCol>
          <div className="text-muted small">총 상품금액</div>
          <div className="fw-bold">
            {selectedCartItemIds.length === 0
              ? "-"
              : totalSelectedPrice.toLocaleString() + "원"}
          </div>
        </CCol>
        <CCol>
          <div className="text-muted small">총 배송비</div>
          <div className="fw-bold">
            {selectedCartItemIds.length === 0
              ? "-"
              : totalShippingFee.toLocaleString() + "원"}
          </div>
        </CCol>
        <CCol>
          <div className="text-muted small">결제예정금액</div>
          <div className="fw-bold">
            {selectedCartItemIds.length === 0
              ? "-"
              : totalPayment.toLocaleString() + "원"}
          </div>
        </CCol>
      </CRow>

      <hr />

      <div className="text-center">
        <CButton color="dark" className="me-2" onClick={handleOrderAll}>
          전체상품주문
        </CButton>
        <CButton
          color="secondary"
          variant="outline"
          onClick={handleOrderSelected}
          disabled={selectedCartItemIds.length === 0}
        >
          선택상품주문
        </CButton>
      </div>
    </>
  );
};

export default MemberCartList;
