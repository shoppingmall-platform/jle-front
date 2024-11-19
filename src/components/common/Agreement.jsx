import React, { useState, useEffect } from 'react';
import { Checkbox, FormGroup, FormControlLabel, Divider } from '@mui/material';

const Agreement = ({ onAgreementChange }) => {
    const [allChecked, setAllChecked] = useState(false);
    const [requiredChecked, setRequiredChecked] = useState({
        필수1: false,
        필수2: false,
    });
    const [optionalChecked, setOptionalChecked] = useState(false);

    // 전체동의 체크 상태 변화 처리
    const handleAllChecked = (event) => {
        const isChecked = event.target.checked;
        setAllChecked(isChecked);
        setRequiredChecked({
            필수1: isChecked,
            필수2: isChecked,
        });
        setOptionalChecked(isChecked);
    };

    // 필수 약관 체크박스 상태 변화 처리
    const handleRequiredChange = (event) => {
        const { name, checked } = event.target;
        setRequiredChecked((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    };

    // 선택 약관 체크 상태 변화 처리
    const handleOptionalChange = (event) => {
        setOptionalChecked(event.target.checked);
    };

    // 필수 약관 모두 체크 시 Next 버튼 활성화 상태 업데이트
    useEffect(() => {
        const allRequiredChecked = Object.values(requiredChecked).every(Boolean);
        onAgreementChange(allRequiredChecked);
        setAllChecked(allRequiredChecked && optionalChecked); // 전체 동의 상태 업데이트
    }, [requiredChecked, optionalChecked, onAgreementChange]);

    return (
        <div style={{ height: "100%" }}>
            <FormGroup>
                <FormControlLabel
                    control={<Checkbox checked={allChecked} onChange={handleAllChecked} />}
                    label="전체동의"
                />
                <Divider />
                <FormControlLabel
                    required
                    control={<Checkbox checked={requiredChecked.필수1} onChange={handleRequiredChange} name="필수1" />}
                    label="필수1"
                />
                <FormControlLabel
                    required
                    control={<Checkbox checked={requiredChecked.필수2} onChange={handleRequiredChange} name="필수2" />}
                    label="필수2"
                />
                <FormControlLabel
                    control={<Checkbox checked={optionalChecked} onChange={handleOptionalChange} />}
                    label="선택"
                />
            </FormGroup>
        </div>
    );
};

export default Agreement;
