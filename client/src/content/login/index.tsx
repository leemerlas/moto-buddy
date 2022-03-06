import { Box, Container, Card, TextField, Grid, Button, Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from "react-router-dom";
import Text from 'src/components/Text';

import { styled } from '@mui/material/styles';
import { useState } from 'react';
import configData from '../../utils/configData.json'

const OverviewWrapper = styled(Box)(
  () => `
    overflow: auto;
    flex: 1;
    overflow-x: hidden;
    align-items: center;
`
);


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
  const [helperText, setHelperText] = useState("");

  const handleLogin = () => {

    if (email === ""){
      setShowError(true)
      setError("Email field cannot be empty")
    } else if (password === "") {
      setShowError(true)
      setError("Password field cannot be empty")
    } else {
      fetch(`${configData.SERVER_URL}/api/v1/auth`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email: email, password: password})
      })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          navigate('/dashboard/diary');
        } else {
          setShowError(true)
          setError(data.errors[0].msg);
        }
      })
    }


    
  }

  const handleFocus = () => {
    setShowError(false);
    // setError("")
  }

  return (
    <OverviewWrapper>
      <Helmet>
        <title>Moto Buddy</title>
      </Helmet>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" py={5} alignItems="center">
          {/* <Logo /> */}
        </Box>
        <Card sx={{ p: 6, mb: 3, borderRadius: 12 }}>
          <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            <img src="/static/images/logo/moto_buddy_large.svg" alt="MB Logo" width={700}/>      
          </div>
          <div>
            <Grid container spacing={2}
              direction="column"
              alignItems="center"
              justifyContent="center">
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  id="outlined-required"
                  label="Username"
                  placeholder="harleydavidson@gmail.com"
                  style={{ width: '50vh' }}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={handleFocus}
                  error={showError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="outlined-password-input"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  style={{ width: '50vh' }}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={handleFocus}
                  error={showError}
                />
              </Grid>
              <Grid item xs={12}>
                <Text color='error'>
                  {error}
                </Text>
              </Grid>
              <Grid item xs={12}>
                <Button
                  size="medium" 
                  sx={{ margin: 1 }} 
                  variant="contained" 
                  style={{ width: 250, height: 50, backgroundColor: "#223354" }}
                  onClick={handleLogin}
                >
                  Sign In
                </Button>
              </Grid>
              <Grid item xs={8}>
                <Typography>
                  or
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Link to={"/create-account"}>
                  Don't have an account yet? <b>Click here</b>
                </Link>
              </Grid>
            </Grid>
          </div>
        </Card>
      </Container>
    </OverviewWrapper>
  );
}

export default Login;
