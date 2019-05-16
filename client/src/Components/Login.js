import React from 'react';
import styled from 'styled-components';
import Fab from '@material-ui/core/Fab';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import Auth from './Auth/Auth';

const LoginOrRegisterContainer = styled.div`
    background:#FCFCFB;
    display:flex;
    justify-content:center;
    align-content:center;
    flex-wrap:wrap;
    width:100%;
    height:100vh;
`;

const LoginOrRegisterForm = styled.form`
    background:#3685B5;
    width:10%;
    height:300px;
    padding:100px;
    display:flex;
    justify-content:center;
    flex-wrap:wrap;
    -webkit-box-shadow: 6px 7px 24px -1px rgba(0,0,0,0.75);
    -moz-box-shadow: 6px 7px 24px -1px rgba(0,0,0,0.75);
    box-shadow: 6px 7px 24px -1px rgba(0,0,0,0.75);
    border-radius:10px;
`

const StyledButton = withStyles({
    root: {
        background: '#40A798',
        width: '150px'
    }
})(Fab);

class LoginOrRegister extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            login: false,
            username: '',
            password: ''
        }
    }

    // Handle field hcange
    handleChange = input => e => {
        this.setState({[input]: e.target.value})
    }

    handleSubmit(e){
        const auth = new Auth();

        auth.login();
        e.preventDefault();
    }

    render(){
        return(
            <LoginOrRegisterContainer>
                <LoginOrRegisterForm>
                    {this.state.login && (
                        <div>
                            <h1>test</h1>
                        </div>
                    )}
                    <TextField
                        label="Username"
                        placeholder="Username"
                        margin="dense"
                        onChange={this.handleChange('username')}
                    />

                    <TextField
                        required
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        margin="dense"
                        onChange={this.handleChange('password')}
                    />

                    <StyledButton
                        variant="extended"
                        size="large"
                        onClick={this.handleSubmit}
                    >
                        Submit
                    </StyledButton>

                </LoginOrRegisterForm>
            </LoginOrRegisterContainer>
        )
    }
}

export default LoginOrRegister;