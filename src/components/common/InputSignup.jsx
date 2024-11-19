import { Table, TableRow, TableCell, TextField, Button } from '@mui/material'
import React ,{useEffect, useState}from 'react'


const InputSignup = ({ onValidityChange }) => {
    const [id, setId] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')

    const [idError, setIdError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordConfirmError, setPasswordConfirmError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [emailError, setEmailError] = useState('');

    const [isIdValid, setIsIdValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isPasswordConfirmValid, setIsPasswordConfirmValid] = useState(false);
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);

    const handleIdChange = (e) => {
        const value = e.target.value;
        setId(value);
        if (/^[A-Za-z]{5,}$/.test(value)) {
          setIsIdValid(true);
          setIdError('');
        } else {
          setIsIdValid(false);
          setIdError('영문으로 5자 이상 입력해주세요');
        }
    };
    
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)) {
            setIsPasswordValid(true);
            setPasswordError('');
        } else {
            setIsPasswordValid(false);
            setPasswordError('숫자+영문자+특수조합으로 8자 이상 입력해주세요');
        }
    };

    const handlePasswordConfirmChange = (e) => {
        const value = e.target.value;
        setPasswordConfirm(value);
        if (value === password) {
            setIsPasswordConfirmValid(true);
            setPasswordConfirmError('');
        } else {
            setIsPasswordConfirmValid(false);
            setPasswordConfirmError('비밀번호가 일치하지 않습니다');
        }
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        setPhoneNumber(value);
        if (/^\d{10,11}$/.test(value)) {
            setIsPhoneValid(true);
            setPhoneError('');
        } else {
            setIsPhoneValid(false);
            setPhoneError('숫자만 입력해주세요');
        }
    };
    
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
          setIsEmailValid(true);
          setEmailError('');
        } else {
          setIsEmailValid(false);
          setEmailError('유효한 이메일 형식으로 입력해주세요');
        }
    };

    useEffect(() => {
        const isAllValid = isIdValid && isPasswordValid && isPasswordConfirmValid && isPhoneValid && isEmailValid;
        onValidityChange(isAllValid);
    },[id, password, passwordConfirm, phoneNumber, email, 
        isIdValid, isPasswordValid, isPasswordConfirmValid, 
        isPhoneValid, isEmailValid, onValidityChange])

    return (
        <div>
            <form>
                <Table>
                    <TableRow>
                        <TableCell align="center" >아이디</TableCell>
                        <TableCell align='left' colSpan={2}>
                            <TextField  
                                size="small" 
                                name='id'
                                label='id'
                                fullWidth
                                value={id}
                                onChange={handleIdChange}
                                helperText={idError || (isIdValid && '사용가능한 아이디입니다.')}
                                error={!!idError}
                                />
                        </TableCell>
                        <TableCell><Button>중복확인</Button></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="center" >비밀번호</TableCell>
                        <TableCell align='left' colSpan={3}>
                            <TextField 
                                size="small" 
                                name='password'
                                label='password'
                                type='password'
                                fullWidth
                                value={password}
                                onChange={handlePasswordChange}
                                helperText={passwordError || (isPasswordValid && '사용 가능한 비밀번호입니다')}
                                error={!!passwordError}
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="center" >비밀번호 확인</TableCell>
                        <TableCell align='left' colSpan={3}>
                        <TextField
                            size="small"
                            type='password'
                            fullWidth
                            label="password confirm"
                            value={passwordConfirm}
                            onChange={handlePasswordConfirmChange}
                            helperText={passwordConfirmError || (isPasswordConfirmValid && '비밀번호가 일치합니다')}
                            error={!!passwordConfirmError}
                        />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="center" >휴대전화</TableCell>
                        <TableCell align='left' colSpan={3}>
                        <TextField
                            size="small"
                            name='phone'
                            label='phone'
                            type='number'
                            fullWidth
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            helperText={phoneError || (isPhoneValid && '유효한 번호입니다')}
                            error={!!phoneError}
                        />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell align="center" >이메일</TableCell>
                        <TableCell align='left' colSpan={3}>
                        <TextField
                            size="small"
                            name='email'
                            label='email'
                            fullWidth
                            value={email}
                            onChange={handleEmailChange}
                            helperText={emailError || (isEmailValid && '유효한 이메일입니다')}
                            error={!!emailError}
                        />
                        </TableCell>
                    </TableRow>
                </Table>
            </form>
        </div>
    )
}

export default InputSignup