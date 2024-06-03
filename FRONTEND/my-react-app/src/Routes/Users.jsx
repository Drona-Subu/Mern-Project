import React, {useEffect, useState} from "react";

import Finder from "../api/Finder";
import UsersList from "../Components/UsersList";
import ErrorModal from "../UIElements/ErrorModal";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";

const Users = () => {
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState();
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState([]);


  useEffect(() => {
    const fetchUsers = async () => {
      try{
        // setIsLoading(true);

      const response = await sendRequest('/api/users');
      console.log(response.data.users);
       setLoadedUsers(response.data.users)
       
      }
      catch(err) {
        
      }
    }
    fetchUsers();
  }, [sendRequest]);

  

  return (
  <>
  <ErrorModal error={error} onClear={clearError} />
  {isLoading && (<div className="center">
    <LoadingSpinner />
  </div>) }
  {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
  </>
  );
};

export default Users;

// {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
