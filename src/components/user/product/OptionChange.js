import React from "react";
import { CButton } from "@coreui/react";
import { updateCartItem, addToCart } from "@/apis/member/cartApis";
import useGuestCartStore from "@/store/member/guestCartStore";

const OptionChange = ({
  top,
  left,
  cartItemId,
  productOptions,
  selectedOptions,
  quantity,
  handleSelectOption,
  onClose,
  onUpdateSuccess,
  isGuest = false,
  isModal = false, // ← 모달 모드 추가
}) => {
  const { updateOption, addToCart: addToGuestCart } = useGuestCartStore();
  const buildOptionTypes = (options) => {
    const grouped = {};
    options.forEach((option) => {
      option.productOptionDetails.forEach(
        ({ productOptionType, productOptionDetailName }) => {
          if (!grouped[productOptionType])
            grouped[productOptionType] = new Set();
          grouped[productOptionType].add(productOptionDetailName);
        }
      );
    });
    return Object.entries(grouped).reduce((acc, [type, values]) => {
      acc[type] = Array.from(values);
      return acc;
    }, {});
  };

  const optionTypes = buildOptionTypes(productOptions);

  const handleUpdate = async () => {
    // 선택된 옵션 조합에 해당하는 productOptionId 찾기
    const selectedSet = new Set(
      Object.entries(selectedOptions).map(([type, val]) => `${type}:${val}`)
    );

    const matchedOption = productOptions.find((option) => {
      const optionSet = new Set(
        option.productOptionDetails.map(
          (d) => `${d.productOptionType}:${d.productOptionDetailName}`
        )
      );
      return (
        selectedSet.size === optionSet.size &&
        [...selectedSet].every((v) => optionSet.has(v))
      );
    });

    if (!matchedOption) {
      alert("⚠️ 해당 옵션 조합이 존재하지 않습니다.");
      return;
    }

    if (isGuest) {
      // ✅ 비회원일 경우
      updateOption(cartItemId, {
        ...matchedOption,
        quantity,
      });
      alert("✅ 옵션이 변경되었습니다.");
      onUpdateSuccess?.(matchedOption);
      onClose();
    } else {
      // ✅ 회원일 경우
      const payload = [
        {
          cartItemId,
          productOptionId: matchedOption.productOptionId,
          quantity,
        },
      ];
      console.log("🛒 옵션 변경 요청 데이터:", payload);

      try {
        await updateCartItem(payload);
        alert("✅ 장바구니 항목이 변경되었습니다.");
        onUpdateSuccess?.(matchedOption);
        onClose();
      } catch (error) {
        alert("❌ 변경 실패. 다시 시도해주세요.");
      }
    }
  };

  const handleAdd = async () => {
    // 선택된 옵션 조합에 해당하는 productOptionId 찾기
    const selectedSet = new Set(
      Object.entries(selectedOptions).map(([type, val]) => `${type}:${val}`)
    );

    const matchedOption = productOptions.find((option) => {
      const optionSet = new Set(
        option.productOptionDetails.map(
          (d) => `${d.productOptionType}:${d.productOptionDetailName}`
        )
      );
      return (
        selectedSet.size === optionSet.size &&
        [...selectedSet].every((v) => optionSet.has(v))
      );
    });

    if (!matchedOption) {
      alert("⚠️ 해당 옵션 조합이 존재하지 않습니다.");
      return;
    }

    if (isGuest) {
      // ✅ 비회원일 경우 - 게스트 장바구니에 추가
      addToGuestCart({
        ...matchedOption,
        quantity,
      });
      alert("✅ 장바구니에 추가되었습니다.");
      onUpdateSuccess?.(matchedOption);
      onClose();
    } else {
      // ✅ 회원일 경우 - 장바구니 추가 API 호출
      const payload = [
        {
          productOptionId: matchedOption.productOptionId,
          quantity,
        },
      ];
      console.log("🛒 장바구니 추가 요청 데이터:", payload);

      try {
        await addToCart(payload);
        alert("✅ 장바구니에 추가되었습니다.");
        onUpdateSuccess?.(matchedOption);
        onClose();
      } catch (error) {
        alert("❌ 추가 실패. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div
      style={
        isModal
          ? {
              // 모달 안에서는 position 없이
              background: "white",
              borderRadius: "4px",
              padding: "1rem",
            }
          : {
              // 기존 팝업 스타일
              position: "absolute",
              top,
              left,
              zIndex: 1000,
              background: "white",
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "1rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              minWidth: "200px",
            }
      }
    >
      {!isModal && (
        <div style={{ textAlign: "right" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        </div>
      )}

      {Object.entries(optionTypes).map(([type, values]) => (
        <div key={type} className="mt-2">
          <h6>{type}</h6>
          <div className="d-flex flex-wrap">
            {values.map((value) => (
              <CButton
                key={value}
                size="sm"
                color={selectedOptions[type] === value ? "dark" : "light"}
                className="me-2 mb-2"
                onClick={() => handleSelectOption(type, value)}
              >
                {value}
              </CButton>
            ))}
          </div>
        </div>
      ))}

      <div className="d-flex justify-content-end mt-3">
        <CButton size="sm" color="dark" className="me-2" onClick={handleAdd}>
          추가
        </CButton>
        <CButton size="sm" color="primary" onClick={handleUpdate}>
          변경
        </CButton>
      </div>
    </div>
  );
};

export default OptionChange;
