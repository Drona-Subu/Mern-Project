import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false);
  const [tokenExpirationTime, setTokenExpirationTime] = useState();
  const [userId, setUserId] = useState(null);

  const login = useCallback((uid, token, expirationDate) => {
    console.log("Logged In");
    setToken(token);
    setUserId(uid);
    //  const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000*60*60);
     const tokenExpirationDate = expirationDate ? new Date(expirationDate) : new Date(new Date().getTime() + 1000*60*60);
     setTokenExpirationTime(tokenExpirationDate);
    localStorage.setItem('userData', JSON.stringify({
      userId: uid, token: token, expiration: tokenExpirationDate.toISOString() ,
    }));
    
  }, []);

  const logout = useCallback(() => {
    console.log("Logged Out");
    setToken(null);
    setTokenExpirationTime(null);
    setUserId(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if(token && tokenExpirationTime ) {
      const remainingTime = tokenExpirationTime.getTime() - new Date().getTime(); //it is in milliseconds

      logoutTimer = setTimeout(logout, remainingTime);
    }
    else{
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationTime]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if(storedData && storedData.token && new Date(storedData.expiration) > new Date() ){
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  },[login]);

  return { token, login, logout, userId} ;
}